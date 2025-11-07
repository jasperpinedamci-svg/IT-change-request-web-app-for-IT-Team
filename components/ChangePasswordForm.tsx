import React, { useState } from 'react';
import { KeyIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, InformationCircleIcon, ShieldCheckIcon } from './icons';

interface ChangePasswordFormProps {
    onChangePassword: (details: { currentPassword: string, newPassword: string }) => Promise<{ success: boolean, message: string }>;
}

interface FormMessage {
    type: 'success' | 'error';
    text: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [message, setMessage] = useState<FormMessage | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'All password fields are required.' });
            return;
        }
        
        if (newPassword.length < 8) {
             setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        const result = await onChangePassword({ currentPassword, newPassword });
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        
        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
            <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4 border-b pb-3">
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-slate-500" />
                Change Your Password
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword"className="block text-sm font-medium text-slate-700 sr-only">Current Password</label>
                    <div className="relative">
                        <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Current Password"
                        />
                         <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                            {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                 <div>
                    <label htmlFor="newAdminPassword"className="block text-sm font-medium text-slate-700 sr-only">New Password</label>
                    <div className="relative">
                        <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="newAdminPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="New Password"
                        />
                         <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                 <div>
                    <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700 sr-only">Confirm New Password</label>
                    <div className="relative">
                        <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="confirmPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm New Password"
                        />
                    </div>
                </div>
                
                {message && (
                    <div className={`p-3 flex items-start rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        {message.type === 'success' ? <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" /> : <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};