import React, { useState } from 'react';
import { CloseIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon } from './Icons';

interface AdminLoginProps {
    onLogin: (password: string, trustDevice: boolean) => void;
    onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [trustDevice, setTrustDevice] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password.trim(), trustDevice);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-dark-card p-6 sm:p-10 rounded-2xl shadow-2xl relative w-full max-w-sm border border-gray-200 dark:border-gray-800">
                <button onClick={onClose} aria-label="Close login modal" className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <CloseIcon className="h-5 w-5" />
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Security Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-base min-h-[44px]"
                                placeholder="Enter admin password"
                                autoFocus
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-primary transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={trustDevice}
                                    onChange={(e) => setTrustDevice(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-300 ${trustDevice ? 'bg-primary' : ''}`}></div>
                                <div className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 transform ${trustDevice ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="ml-3 flex items-center">
                                <ShieldCheckIcon className={`h-4 w-4 mr-1.5 transition-colors duration-300 ${trustDevice ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                    Trust this device
                                </span>
                            </div>
                        </label>
                    </div>

                    <button type="submit" className="w-full px-6 py-4 sm:py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] min-h-[48px]">
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;