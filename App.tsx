import React, { useState, useEffect, useCallback } from 'react';
import { ChangeRequestForm } from './components/ChangeRequestForm';
import { ChangeRequestList } from './components/ChangeRequestList';
import { CreateUserForm } from './components/CreateUserForm';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import { UserManagement } from './components/UserManagement';
import { ChangeRequest, NewChangeRequest, Status, Department, User } from './types';
import { summarizeChangeRequest } from './services/geminiService';
import { INITIAL_DEPARTMENT_OPTIONS, STATUS_OPTIONS } from './constants';
import * as db from './db';
import { UserIcon, LogoutIcon, TrashIcon } from './components/icons';
import { LoginPage } from './components/LoginPage';


type LoggedInState = {
    id: string;
    role: 'admin' | 'user';
    name: string;
} | null;

const App: React.FC = () => {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENT_OPTIONS);
  const [newDepartment, setNewDepartment] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [loggedInUser, setLoggedInUser] = useState<LoggedInState>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = useCallback(async () => {
    const [dbUsers, dbRequests] = await Promise.all([
        db.getAllUsers(),
        db.getAllChangeRequests()
    ]);
    setUsers(dbUsers);
    setRequests(dbRequests);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const initialize = async () => {
        await db.seedInitialUsers();
        await fetchData();
    };
    initialize();
  }, [fetchData]);

  const handleLogin = async ({ userId, password }: { userId: string, password: string }) => {
    const allUsers = await db.getAllUsers();
    const user = allUsers.find(u => u.id.toLowerCase() === userId.toLowerCase() && u.password === password);
    
    if (user) {
        setLoggedInUser({ id: user.id, role: user.role, name: user.name });
        setLoginError(null);
    } else {
        setLoginError('Invalid User ID or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setLoginError(null);
  };
    
  const handleChangePassword = async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }): Promise<{ success: boolean, message: string }> => {
    if (!loggedInUser) {
        return { success: false, message: 'No user is logged in.' };
    }

    const userToUpdate = await db.getUserById(loggedInUser.id);
    
    if (!userToUpdate) {
        // This should not happen if user is logged in
        return { success: false, message: 'Could not find user account.' };
    }

    if (userToUpdate.password !== currentPassword) {
        return { success: false, message: 'Current password does not match.' };
    }

    const updatedUser = { ...userToUpdate, password: newPassword };
    await db.updateUser(updatedUser);
    await fetchData();

    return { success: true, message: 'Password updated successfully!' };
  };

  const handleCreateUser = async (details: { name: string, id: string, password: string }): Promise<{ success: boolean, message: string }> => {
    const userIdExists = await db.getUserById(details.id.toLowerCase());
    if (userIdExists) {
        return { success: false, message: 'User ID already exists. Please choose a different one.' };
    }
    const newUser: User = { ...details, id: details.id.toLowerCase(), role: 'user' };
    await db.addUser(newUser);
    await fetchData();
    return { success: true, message: `User "${details.name}" created successfully!` };
  };
  
  const handleUpdateUserPassword = async (userId: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
    const user = await db.getUserById(userId);
    if (!user) {
        return { success: false, message: 'User not found.' };
    }
    await db.updateUser({ ...user, password: newPassword });
    await fetchData();
    return { success: true, message: `Password for ${user.name} updated successfully!` };
};

  const handleDeleteUser = async (userId: string) => {
    await db.deleteUser(userId);
    await fetchData();
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDept = newDepartment.trim();
    if (trimmedDept && !departments.some(d => d.toLowerCase() === trimmedDept.toLowerCase())) {
      setDepartments(prev => [...prev, trimmedDept].sort());
      setNewDepartment('');
    }
  };
  
  const handleDeleteDepartment = (departmentToDelete: string) => {
    const isInUse = requests.some(req => req.department === departmentToDelete);
    if (isInUse) {
      alert(`Cannot delete "${departmentToDelete}" as it is currently assigned to one or more change requests.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the department "${departmentToDelete}"?`)) {
      setDepartments(prev => prev.filter(d => d !== departmentToDelete));
    }
  };

  const handleAddRequest = async (newRequestData: NewChangeRequest) => {
    setIsSubmitting(true);
    try {
      const summary = await summarizeChangeRequest({
        description: newRequestData.description,
        reason: newRequestData.reason,
        impact: newRequestData.impact,
        system: newRequestData.system,
      });

      const newRequest: ChangeRequest = {
        ...newRequestData,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        requestDate: new Date().toISOString(),
        status: Status.Pending,
        summary,
      };

      await db.addChangeRequest(newRequest);
      await fetchData();
    } catch (error) {
      console.error("Failed to add request:", error);
      alert("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRequestStatus = async (id: string, status: Status, remarks?: string) => {
    const request = await db.getChangeRequestById(id);
    if (request) {
        const updatedRequest = { ...request, status, remarks: remarks !== undefined ? remarks : request.remarks };
        await db.updateChangeRequest(updatedRequest);
        await fetchData();
    }
  };

  const handleApprove = (id: string, remarks: string) => {
    updateRequestStatus(id, Status.Approved, remarks);
  };

  const handleReject = (id: string, remarks: string) => {
    updateRequestStatus(id, Status.Rejected, remarks);
  };

  const handleMarkAsReviewed = async (id: string) => {
    const request = await db.getChangeRequestById(id);
    if (request && request.status === Status.Pending) {
        await updateRequestStatus(id, Status.Reviewed);
    }
  };
  
  if (isInitializing) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xl font-medium text-slate-700">Initializing Application...</span>
            </div>
        </div>
    );
  }

  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  const isAdminView = loggedInUser.role === 'admin';
  const currentUser = loggedInUser.name;

  const filteredRequests = requests.filter(request => {
    const statusMatch = statusFilter === 'All' || request.status === statusFilter;
    if (isAdminView) {
        return statusMatch;
    }
    return statusMatch && request.requester === currentUser;
  });
  
  const listTitle = isAdminView 
    ? (statusFilter === 'All' ? 'All Requests' : `${statusFilter} Requests`)
    : `${currentUser}'s ${statusFilter === 'All' ? '' : statusFilter + ' '}Requests`;

  const userNames = users.filter(u => u.role === 'user').map(u => u.name).sort();
  const usedDepartments = new Set(requests.map(req => req.department));

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-slate-900 text-center sm:text-left">
            IT Change Request Approval <span className="text-indigo-600">{isAdminView ? 'Admin' : 'User'}</span> Portal
          </h1>
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2 mr-4 sm:mr-6">
                <UserIcon className="h-6 w-6 text-slate-500" />
                <span className="font-medium text-slate-700">{loggedInUser.name}</span>
            </div>
             <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <LogoutIcon className="h-5 w-5 mr-2" />
                Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="md:col-span-1 space-y-8">
              <ChangeRequestForm 
                onSubmit={handleAddRequest} 
                isLoading={isSubmitting} 
                departments={departments} 
                isAdminView={isAdminView}
                currentUser={currentUser}
                userOptions={userNames}
              />
              {isAdminView && (
                <>
                <CreateUserForm onCreateUser={handleCreateUser} />
                <UserManagement 
                    users={users} 
                    onUpdatePassword={handleUpdateUserPassword} 
                    onDeleteUser={handleDeleteUser} 
                />
                <ChangePasswordForm onChangePassword={handleChangePassword} />
                <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">Manage Departments</h3>
                  <form onSubmit={handleAddDepartment} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="New department name"
                      className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button type="submit" className="w-full sm:w-auto justify-center mt-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                      Add Department
                    </button>
                  </form>
                  <div className="mt-4">
                      <p className="text-sm font-medium text-slate-600">Available Departments:</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500 columns-2">
                          {departments.map(d => {
                            const isInUse = usedDepartments.has(d);
                            return (
                              <li key={d} className="flex justify-between items-center group pr-2 hover:bg-slate-50 rounded">
                                <span>{d}</span>
                                <button
                                  onClick={() => handleDeleteDepartment(d)}
                                  disabled={isInUse}
                                  title={isInUse ? "Cannot delete: department is in use by a request" : "Delete department"}
                                  className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 focus:opacity-100 disabled:opacity-20 disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-opacity"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                  </div>
                </div>
                </>
              )}
            </div>
            <div className="md:col-span-1 space-y-8">
               <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">Filter Requests</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        statusFilter === status
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <ChangeRequestList 
                requests={filteredRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onMarkAsReviewed={handleMarkAsReviewed}
                title={listTitle}
                isAdminView={isAdminView}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;