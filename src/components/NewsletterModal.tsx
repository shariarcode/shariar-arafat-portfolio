import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, MailIcon, CheckIcon } from './Icons';
import { useToast } from './Toast';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('newsletter_dismissed');
        if (dismissed) {
            const dismissedAt = parseInt(dismissed);
            const now = Date.now();
            const dayInMs = 24 * 60 * 60 * 1000;
            if (now - dismissedAt < dayInMs * 7) {
                setIsDismissed(true);
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen && !isDismissed) {
            const timer = setTimeout(() => {
                onClose();
            }, 30000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isDismissed, onClose]);

    const handleDismiss = () => {
        localStorage.setItem('newsletter_dismissed', String(Date.now()));
        setIsDismissed(true);
        onClose();
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'loading') return;

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Subscription failed');
            }

            setStatus('success');
            showToast('Successfully subscribed! Check your inbox for confirmation.', 'success');
            localStorage.setItem('newsletter_subscribed', 'true');
            
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setStatus('error');
            showToast('Subscription failed. Please try again later.', 'error');
        }
    };

    if (isDismissed || localStorage.getItem('newsletter_subscribed')) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[301]"
                    >
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden mx-4">
                            {/* Header */}
                            <div className="relative p-6 pb-4 bg-gradient-to-r from-primary to-secondary">
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    <CloseIcon />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <MailIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Stay Updated</h3>
                                        <p className="text-white/80 text-sm">Get notified about new projects</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {status === 'success' ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                            <CheckIcon />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            You're subscribed!
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Check your inbox to confirm your subscription.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Join my newsletter to receive updates on new projects, design insights, 
                                            and development tips directly to your inbox.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                            >
                                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                            </button>
                                        </form>

                                        <button
                                            onClick={handleDismiss}
                                            className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            Maybe later
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NewsletterModal;