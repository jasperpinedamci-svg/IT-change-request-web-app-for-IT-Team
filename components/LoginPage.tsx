import React, { useState } from 'react';
import { AtSymbolIcon, KeyIcon, EyeIcon, EyeSlashIcon, InformationCircleIcon } from './icons';

interface LoginPageProps {
  onLogin: (credentials: { userId: string, password: string }) => void;
  error: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId.trim() && password.trim()) {
      onLogin({ userId: userId.trim(), password: password.trim() });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
        <ul className="bg-animation">
            {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
      <div className="w-full max-w-sm z-10">
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-slate-500/30 p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-2">Sign in to the Change Request Portal.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="userId" className="block text-sm font-medium text-slate-300 sr-only">User ID</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSymbolIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        id="userId"
                        name="userId"
                        type="text"
                        autoComplete="username"
                        required
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 pl-10 bg-slate-700/50 border border-slate-500/50 rounded-md shadow-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm transition"
                        placeholder="User ID"
                    />
                </div>
            </div>

             <div>
                <label htmlFor="password"className="block text-sm font-medium text-slate-300 sr-only">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 pl-10 bg-slate-700/50 border border-slate-500/50 rounded-md shadow-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm transition"
                        placeholder="Password"
                    />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/30 p-3 flex items-start rounded-md">
                    <InformationCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400 transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:from-slate-600 disabled:hover:scale-100 disabled:cursor-not-allowed"
                disabled={!userId.trim() || !password.trim()}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};