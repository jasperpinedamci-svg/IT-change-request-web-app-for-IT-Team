import React, { useState } from 'react';
import { User } from '../types';
import { KeyIcon, TrashIcon, UsersIcon, CheckCircleIcon, InformationCircleIcon } from './icons';

interface UserManagementProps {
    users: User[];
    onUpdatePassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
    onDeleteUser: (userId: string) => void;
}

interface FormMessage {
    type: 'success' | 'error';
    text: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdatePassword, onDeleteUser }) => {
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState<FormMessage | null>(null);

    const userList = users.filter(user => user.role !== 'admin').sort((a, b) => a.name.localeCompare(b.name));

    const handlePasswordChangeClick = (userId: string) => {
        setEditingUserId(userId);
        setNewPassword('');
        setMessage(null);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setMessage(null);
    };

    const handleSavePassword = async (e: React.FormEvent, userId: string) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
            return;
        }
        const result = await onUpdatePassword(userId, newPassword);
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        setEditingUserId(null);
        setNewPassword('');
    };

    const handleDeleteClick = (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            onDeleteUser(userId);
            setMessage({ type: 'success', text: `User "${userName}" has been deleted.`})
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
            <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4 border-b pb-3">
                <UsersIcon className="h-6 w-6 mr-2 text-slate-500" />
                Manage Users
            </h3>
            {message && (
                <div className={`p-3 mb-4 flex items-start rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    {message.type === 'success' ? <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" /> : <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {userList.length > 0 ? userList.map(user => (
                    <div key={user.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-800">{user.name}</p>
                                <p className="text-sm text-slate-500">ID: {user.id}</p>
                            </div>
                            {editingUserId !== user.id && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePasswordChangeClick(user.id)}
                                        title="Change Password"
                                        className="p-2 text-slate-500 hover:bg-yellow-100 hover:text-yellow-700 rounded-full transition-colors"
                                    >
                                        <KeyIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user.id, user.name)}
                                        title="Delete User"
                                        className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {editingUserId === user.id && (
                             <form onSubmit={(e) => handleSavePassword(e, user.id)} className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                                <label htmlFor={`new-pass-${user.id}`} className="block text-sm font-medium text-slate-600">
                                    Set new password for {user.name}:
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        id={`new-pass-${user.id}`}
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        autoFocus
                                        className="flex-grow w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleCancelEdit} className="w-full sm:w-auto justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">
                                            Cancel
                                        </button>
                                        <button type="submit" className="w-full sm:w-auto justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                )) : (
                    <p className="text-center text-slate-500 py-4">No users to manage.</p>
                )}
            </div>
        </div>
    );
};