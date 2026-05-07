import React from 'react';
import { SparklesIcon, LoadingSpinner } from '../Icons';

export const AIEnhanceButton: React.FC<{ onClick: () => void, isLoading: boolean, disabled?: boolean }> = ({ onClick, isLoading, disabled }) => (
    <button 
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled || isLoading}
        title="Enhance with AI"
        className="absolute right-2 top-8 sm:top-7 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
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
    isEnhancing?: boolean 
}> = ({ label, name, value, onChange, placeholder, onEnhance, isEnhancing }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px] ${onEnhance ? 'pr-10' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
    </div>
);

export const FormTextarea: React.FC<{ 
    label: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
    onEnhance?: () => void, 
    isEnhancing?: boolean,
    rows?: number
}> = ({ label, name, value, onChange, onEnhance, isEnhancing, rows = 3 }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            rows={rows}
            className={`w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px] ${onEnhance ? 'pr-10' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
    </div>
);

export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const TabHeader: React.FC<{ title: string, description?: string }> = ({ title, description }) => (
    <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
);
