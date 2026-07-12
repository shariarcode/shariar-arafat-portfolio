import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
    const { content, t } = usePortfolio();
    const { timeline } = content;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!timeline || timeline.length === 0) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo('.timeline-header',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.timeline-header',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Progressive line draw on scroll
            gsap.fromTo('.timeline-draw-line',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    transformOrigin: 'top center',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.timeline-events-container',
                        start: 'top 45%',
                        end: 'bottom 70%',
                        scrub: true,
                    }
                }
            );

            // Card reveals
            gsap.utils.toArray<HTMLElement>('.timeline-event-item').forEach((item) => {
                gsap.fromTo(item.querySelectorAll('.timeline-card, .timeline-dot'),
                    { opacity: 0, y: 35, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [timeline]);

    if (!timeline || timeline.length === 0) return null;

    return (
        <section ref={containerRef} id="timeline" className="py-24 bg-slate-50 dark:bg-dark-bg transition-colors duration-300 relative scroll-mt-20 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[110px] pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="timeline-header text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t.sections.timeline || 'My Journey'}
                    </h2>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
                        A detailed timeline of major milestones and professional history.
                    </p>
                </div>

                <div className="timeline-events-container relative max-w-5xl mx-auto">
                    {/* Background line tracker (static faint line) */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-800 rounded-full opacity-60" />
                    
                    {/* Progressive draw line (animated) */}
                    <div className="timeline-draw-line absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-purple-500 to-secondary rounded-full will-change-transform" />

                    <div className="space-y-12 md:space-y-0 relative z-15">
                        {timeline.map((event, index) => (
                            <div 
                                key={index} 
                                className="timeline-event-item grid grid-cols-1 md:grid-cols-[1fr_4rem_1fr] w-full items-center py-4 md:py-8"
                            >
                                {/* Left Column */}
                                <div className="pl-12 md:pl-0 md:pr-12 flex items-center md:justify-end self-stretch order-3 md:order-1">
                                    {index % 2 === 0 ? (
                                        <div className="timeline-card bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100/50 dark:border-gray-800/80 hover:border-primary/30 transition-all duration-300 relative group w-full">
                                            <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white dark:bg-dark-card border-r border-t border-gray-100/50 dark:border-gray-800/80 rotate-45 hidden md:block" />
                                            
                                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-primary-light text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                                {event.year}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                {event.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="hidden md:block w-full" />
                                    )}
                                </div>

                                {/* Center Dot */}
                                <div className="absolute left-0 md:relative md:left-auto md:transform-none md:pr-0 pl-1 md:pl-0 flex items-center justify-center self-stretch order-1 md:order-2 z-20">
                                    <div className="timeline-dot w-8 h-8 md:w-11 md:h-11 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-dark-bg transform transition-transform hover:scale-110 duration-300" data-magnetic>
                                        <span className="text-white font-bold text-[9px] md:text-xs">{event.year.slice(-2)}</span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="pl-12 flex items-center justify-start self-stretch order-3">
                                    {index % 2 !== 0 ? (
                                        <div className="timeline-card bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-100/50 dark:border-gray-800/80 hover:border-primary/30 transition-all duration-300 relative group w-full">
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white dark:bg-dark-card border-l border-b border-gray-100/50 dark:border-gray-800/80 rotate-45 hidden md:block" />
                                            
                                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-primary-light text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                                {event.year}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                {event.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="hidden md:block w-full" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
