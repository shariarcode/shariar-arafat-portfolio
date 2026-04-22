import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import type { Language } from '../translations';
import { GlobeIcon } from './Icons';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = usePortfolio();
    const [isOpen, setIsOpen] = useState(false);

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
                <GlobeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang.flag}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[140px]">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                language === lang.code 
                                    ? 'bg-primary/10 text-primary dark:text-primary-light' 
                                    : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <span>{lang.flag}</span>
                            <span className="text-sm">{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;