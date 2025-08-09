import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface AdminLoginProps {
    onLogin: (password: string) => void;
    onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-xl relative w-full max-w-sm m-4">
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <CloseIcon className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            placeholder="Enter password"
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
