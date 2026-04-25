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
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-purple-500 to-secondary hidden md:block opacity-30" />

                    <div className="space-y-12 md:space-y-0">
                        {timeline.map((event, index) => (
                            <FadeIn key={index} delay={index * 0.1} direction={index % 2 === 0 ? 'right' : 'left'}>
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_3rem_1fr] items-center min-h-[150px]">
                                    {/* Card Content */}
                                    <div className={`
                                        col-start-1 
                                        ${index % 2 === 0 
                                            ? 'md:col-start-1 md:text-right md:pr-12' 
                                            : 'md:col-start-3 md:text-left md:pl-12'}
                                    `}>
                                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all duration-300 relative group">
                                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-dark-card border-t border-l border-gray-100 dark:border-gray-800 rotate-45 hidden md:block ${index % 2 === 0 ? '-right-2 border-r-0 border-b-0 border-t-1 border-l-1 !rotate-[135deg]' : '-left-2'}`} />
                                            
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
                                    </div>

                                    {/* Central Dot */}
                                    <div className="hidden md:flex col-start-2 items-center justify-center z-20">
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-dark-bg transform transition-transform hover:scale-110 duration-300">
                                            <span className="text-white font-bold text-sm">{event.year.slice(-2)}</span>
                                        </div>
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
