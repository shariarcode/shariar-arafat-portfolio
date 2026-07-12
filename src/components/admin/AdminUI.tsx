import React from 'react';
import { SparklesIcon, LoadingSpinner } from '../Icons';

export const AIEnhanceButton: React.FC<{ onClick: () => void, isLoading: boolean, disabled?: boolean }> = ({ onClick, isLoading, disabled }) => (
    <button 
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled || isLoading}
        title="Enhance with AI"
        className="absolute right-2.5 top-8.5 sm:top-7.5 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
    >
        {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
    </button>
);

export const FormInput: React.FC<{ 
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    placeholder?: string, 
    onEnhance?: () => void, 
    isEnhancing?: boolean,
    required?: boolean,
    error?: string,
    type?: string
}> = ({ label, name, value, onChange, placeholder, onEnhance, isEnhancing, required, error, type = 'text' }) => (
    <div className="relative">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            {label} {required && <span className="text-red-500 font-sans">*</span>}
        </label>
        <input 
            type={type}
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3.5 py-3 sm:py-2.5 bg-zinc-900/50 hover:bg-zinc-900 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-800 focus:border-primary focus:ring-primary/20'} rounded-xl text-white placeholder-zinc-500 focus:bg-zinc-950 focus:outline-none focus:ring-4 transition-all text-sm min-h-[44px] ${onEnhance ? 'pr-11' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
        {error && <span className="block text-xs font-semibold text-red-400 mt-1.5">{error}</span>}
    </div>
);

export const FormTextarea: React.FC<{ 
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
    onEnhance?: () => void, 
    isEnhancing?: boolean,
    rows?: number,
    required?: boolean,
    error?: string
}> = ({ label, name, value, onChange, onEnhance, isEnhancing, rows = 3, required, error }) => (
    <div className="relative">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            {label} {required && <span className="text-red-500 font-sans">*</span>}
        </label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            rows={rows}
            required={required}
            className={`w-full px-3.5 py-3 sm:py-2.5 bg-zinc-900/50 hover:bg-zinc-900 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-800 focus:border-primary focus:ring-primary/20'} rounded-xl text-white placeholder-zinc-500 focus:bg-zinc-950 focus:outline-none focus:ring-4 transition-all text-sm min-h-[44px] ${onEnhance ? 'pr-11' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
        {error && <span className="block text-xs font-semibold text-red-400 mt-1.5">{error}</span>}
    </div>
);

export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const TabHeader: React.FC<{ title: string, description?: string }> = ({ title, description }) => (
    <div className="mb-6 sm:mb-8 pb-4 border-b border-zinc-800/80">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed font-medium">{description}</p>}
    </div>
);
