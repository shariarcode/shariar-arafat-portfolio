import React from 'react';

const NotFound: React.FC = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-6">
            <div className="max-w-xl text-center">
                <p className="text-primary font-semibold">404 Error</p>
                <h1 className="mt-2 text-5xl font-extrabold text-gray-900 dark:text-white">Page not found</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    The page you requested does not exist or may have been moved.
                </p>
                <a
                    href="/"
                    className="inline-block mt-8 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                >
                    Return to homepage
                </a>
            </div>
        </main>
    );
};

export default NotFound;
