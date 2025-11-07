import React, { useState } from 'react';
import { UserIcon, AtSymbolIcon, KeyIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, InformationCircleIcon } from './icons';

interface CreateUserFormProps {
    onCreateUser: (details: { name: string, id: string, password: string }) => Promise<{ success: boolean, message: string }>;
}

interface FormMessage {
    type: 'success' | 'error';
    text: string;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreateUser }) => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<FormMessage | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !userId.trim() || !password.trim()) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        const result = await onCreateUser({ name: name.trim(), id: userId.trim(), password });
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        
        if (result.success) {
            setName('');
            setUserId('');
            setPassword('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">Create a New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 sr-only">Full Name</label>
                    <div className="relative">
                        <UserIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            id="fullName"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="newUserId" className="block text-sm font-medium text-slate-700 sr-only">User ID</label>
                    <div className="relative">
                        <AtSymbolIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            id="newUserId"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            placeholder="User ID (e.g., jsmith)"
                            className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="newPassword"className="block text-sm font-medium text-slate-700 sr-only">Password</label>
                    <div className="relative">
                        <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
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
                    Create User
                </button>
            </form>
        </div>
    );
};