import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import FadeIn from './FadeIn';

const Timeline: React.FC = () => {
    const { content, t } = usePortfolio();
    const { timeline } = content;

    if (!timeline || timeline.length === 0) return null;

    return (
        <section id="timeline" className="py-20 bg-slate-50 dark:bg-dark-bg">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {t.sections.timeline || 'My Journey'}
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            A timeline of my professional journey and key milestones.
                        </p>
                    </div>
                </FadeIn>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-purple-500 to-secondary hidden md:block" />

                    <div className="space-y-12">
                        {timeline.map((event, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right pr-8' : 'md:text-left pl-8'}`}>
                                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-300">
                                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-primary-light text-sm font-semibold rounded-full mb-3">
                                                {event.year}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg z-10">
                                        <span className="text-white font-bold">{event.year.slice(-2)}</span>
                                    </div>
                                    <div className="flex-1" />
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
