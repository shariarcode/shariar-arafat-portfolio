import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SendIcon, UserIcon } from './Icons';
import FadeIn from './FadeIn';

interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    date: string;
}

const Guestbook: React.FC = () => {
    const { t } = usePortfolio();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [newEntry, setNewEntry] = useState({ name: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.name.trim() || !newEntry.message.trim()) return;

        setIsSubmitting(true);
        const entry: GuestbookEntry = {
            id: Date.now().toString(),
            name: newEntry.name,
            message: newEntry.message,
            date: new Date().toLocaleDateString(),
        };

        setEntries([entry, ...entries]);
        setNewEntry({ name: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <section id="guestbook" className="py-20 bg-white dark:bg-dark-card">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {t.guestbook?.title || 'Guestbook'}
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {t.guestbook?.subtitle || 'Leave a message or just say hello!'}
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                        <input
                            type="text"
                            placeholder={t.guestbook?.namePlaceholder || 'Your name'}
                            value={newEntry.name}
                            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                        <textarea
                            placeholder={t.guestbook?.messagePlaceholder || 'Your message'}
                            value={newEntry.message}
                            onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none h-24"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SendIcon /> {t.guestbook?.submit || 'Sign Guestbook'}
                        </button>
                    </form>

                    <div className="space-y-4">
                        {entries.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                {t.guestbook?.empty || 'No messages yet. Be the first to sign!'}
                            </p>
                        ) : (
                            entries.map((entry) => (
                                <FadeIn key={entry.id}>
                                    <div className="bg-slate-50 dark:bg-dark-bg rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                                <UserIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {entry.name}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {entry.date}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 ml-13">
                                            {entry.message}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;