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
                    {/* Central Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-purple-500 to-secondary hidden md:block opacity-20" />

                    <div className="space-y-4 md:space-y-0">
                        {timeline.map((event, index) => (
                            <FadeIn 
                                key={index} 
                                delay={index * 0.1} 
                                direction={index % 2 === 0 ? 'right' : 'left'}
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_3rem_1fr] w-full py-8 md:py-12">
                                    {/* Left Column */}
                                    <div className="md:pr-12 flex items-center justify-end self-stretch">
                                        {index % 2 === 0 ? (
                                            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-300 relative group w-full">
                                                <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white dark:bg-dark-card border-r border-t border-gray-100 dark:border-gray-800 rotate-45 hidden md:block" />
                                                
                                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-primary-light text-sm font-semibold rounded-full mb-3">
                                                    {event.year}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="hidden md:block w-full" />
                                        )}
                                    </div>

                                    {/* Center Column (Dot) */}
                                    <div className="hidden md:flex items-center justify-center self-stretch z-20">
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-dark-bg transform transition-transform hover:scale-110 duration-300">
                                            <span className="text-white font-bold text-sm">{event.year.slice(-2)}</span>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="md:pl-12 flex items-center justify-start self-stretch">
                                        {index % 2 !== 0 ? (
                                            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-300 relative group w-full">
                                                <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white dark:bg-dark-card border-l border-b border-gray-100 dark:border-gray-800 rotate-45 hidden md:block" />
                                                
                                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-primary-light text-sm font-semibold rounded-full mb-3">
                                                    {event.year}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="hidden md:block w-full" />
                                        )}
                                    </div>
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
