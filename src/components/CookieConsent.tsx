import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CookieIcon } from './Icons';

const CookieConsent: React.FC = () => {
    const { t } = usePortfolio();
    const [isVisible, setIsVisible] = useState(false);
    const [hasConsented, setHasConsented] = useState<boolean | null>(null);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            setTimeout(() => setIsVisible(true), 2000);
        } else {
            setHasConsented(consent === 'true');
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setHasConsented(true);
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setHasConsented(false);
        setIsVisible(false);
    };

    if (!isVisible || hasConsented !== null) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3 max-w-2xl">
                    <CookieIcon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t.cookies?.message || 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'}
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        {t.cookies?.decline || 'Decline'}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                        {t.cookies?.accept || 'Accept'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;