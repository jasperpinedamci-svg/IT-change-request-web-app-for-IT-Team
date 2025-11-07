import React, { useState, useEffect } from 'react';
import { NewChangeRequest, Department, Priority } from '../types';
import { PRIORITY_OPTIONS } from '../constants';
import { Calendar } from './Calendar';
import { CalendarIcon } from './icons';

interface ChangeRequestFormProps {
  onSubmit: (request: NewChangeRequest) => Promise<void>;
  isLoading: boolean;
  departments: Department[];
  isAdminView: boolean;
  currentUser: string;
  userOptions: string[];
}

// Separate type for form state to allow for empty initial values for validation
interface ChangeRequestFormData extends Omit<NewChangeRequest, 'priority' | 'department'> {
  priority: Priority | '';
  department: Department | '';
}


const initialFormState: ChangeRequestFormData = {
    title: '',
    system: '',
    requester: '',
    department: '',
    description: '',
    reason: '',
    impact: '',
    priority: '',
    implementationDate: '',
};

export const ChangeRequestForm: React.FC<ChangeRequestFormProps> = ({ onSubmit, isLoading, departments, isAdminView, currentUser, userOptions }) => {
  const [formData, setFormData] = useState<ChangeRequestFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ChangeRequestFormData, string>>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (!isAdminView) {
      setFormData(prev => ({ ...prev, requester: currentUser }));
    } else {
      // Clear requester when switching to admin view to avoid confusion
      if (formData.requester !== '') {
          setFormData(prev => ({...prev, requester: ''}))
      }
    }
  }, [isAdminView, currentUser]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChangeRequestFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Request title is required.";
    if (!formData.system.trim()) newErrors.system = "System/Module is required.";
    if (!formData.requester.trim()) newErrors.requester = "Requester name is required.";
    if (!formData.department) newErrors.department = "Department must be selected.";
    if (!formData.description.trim()) newErrors.description = "Description of change is required.";
    if (!formData.reason.trim()) newErrors.reason = "Reason for change is required.";
    if (!formData.impact.trim()) newErrors.impact = "Impact assessment is required.";
    if (!formData.priority) newErrors.priority = "Priority must be selected.";
    if (!formData.implementationDate) newErrors.implementationDate = "Target implementation date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ChangeRequestFormData]) {
        const newErrors = { ...errors };
        delete newErrors[name as keyof ChangeRequestFormData];
        setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // Type assertion is safe here because validate() ensures all fields are filled.
      await onSubmit(formData as NewChangeRequest);
      setFormData({
          ...initialFormState,
          // Keep the requester name if in user view
          requester: isAdminView ? '' : currentUser,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3">Submit a Change Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] md:max-h-[calc(100vh-22rem)] overflow-y-auto pr-2" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Request Title</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
             <div>
                <label htmlFor="system" className="block text-sm font-medium text-slate-700">System/Module</label>
                <input
                    type="text"
                    id="system"
                    name="system"
                    value={formData.system}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.system ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.system && <p className="mt-1 text-sm text-red-600">{errors.system}</p>}
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="requester" className="block text-sm font-medium text-slate-700">Requester Name</label>
            {isAdminView ? (
                 <select
                    id="requester"
                    name="requester"
                    value={formData.requester}
                    onChange={handleChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.requester ? 'border-red-500' : 'border-slate-300'}`}
                >
                    <option value="" disabled>Select a requester</option>
                    {userOptions.map(user => <option key={user} value={user}>{user}</option>)}
                </select>
            ) : (
                <input
                    type="text"
                    id="requester"
                    name="requester"
                    value={formData.requester}
                    readOnly
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-slate-100 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-not-allowed ${errors.requester ? 'border-red-500' : 'border-slate-300'}`}
                />
            )}
            {errors.requester && <p className="mt-1 text-sm text-red-600">{errors.requester}</p>}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-700">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.department ? 'border-red-500' : 'border-slate-300'}`}
            >
              <option value="" disabled>Select a department</option>
              {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description of Change</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason for Change</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={3}
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.reason ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
        </div>

        <div>
          <label htmlFor="impact" className="block text-sm font-medium text-slate-700">Impact Assessment</label>
          <textarea
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            required
            rows={3}
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.impact ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.impact && <p className="mt-1 text-sm text-red-600">{errors.impact}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Priority</label>
                <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.priority ? 'border-red-500' : 'border-slate-300'}`}
                >
                <option value="" disabled>Select a priority</option>
                {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            </div>
            <div>
                <label htmlFor="implementationDate" className="block text-sm font-medium text-slate-700">Target Implementation Date</label>
                 <div className="relative mt-1">
                    <input
                        type="text"
                        id="implementationDate"
                        name="implementationDate"
                        value={formData.implementationDate}
                        readOnly
                        onClick={() => setIsCalendarOpen(true)}
                        placeholder="Select a date"
                        className={`w-full pl-3 pr-10 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer ${errors.implementationDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    {isCalendarOpen && (
                        <Calendar 
                            initialDate={formData.implementationDate}
                            onDateSelect={(date) => {
                                // Create a synthetic event to use the existing handleChange
                                handleChange({ target: { name: 'implementationDate', value: date } } as React.ChangeEvent<HTMLInputElement>);
                                setIsCalendarOpen(false);
                            }}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                    )}
                </div>
                {errors.implementationDate && <p className="mt-1 text-sm text-red-600">{errors.implementationDate}</p>}
            </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Summary & Submitting...
                </>
            ) : (
                'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};