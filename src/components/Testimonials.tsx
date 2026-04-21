import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioData } from '../types';
import FadeIn from './FadeIn';

interface TestimonialsProps {
    content: PortfolioData;
}

// Wave at top of section
const WaveTop: React.FC = () => (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
            <path
                className="text-white dark:text-dark-card"
                d="M0,0 C360,60 1080,0 1440,50 L1440,60 L0,60 Z"
                style={{ fill: 'currentColor' }}
            />
        </svg>
    </div>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
    const testimonials = useMemo(
        () => (content.testimonials && content.testimonials.length > 0 ? content.testimonials : []),
        [content.testimonials]
    );
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => { setCurrent(0); }, [testimonials.length]);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = window.setInterval(() => {
            setDirection(1);
            setCurrent(prev => (prev + 1) % testimonials.length);
        }, 6000);
        return () => window.clearInterval(timer);
    }, [testimonials.length]);

    if (testimonials.length === 0) return null;

    const goToPrev = () => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };
    const goToNext = () => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % testimonials.length);
    };

    const variants = {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
    };

    const testi = testimonials[current];

    return (
        <section className="py-24 bg-slate-50 dark:bg-dark-bg relative scroll-mt-20 overflow-hidden">
            <WaveTop />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 pt-10 relative z-10">
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm uppercase tracking-widest">Social Proof</span>
                        <h2 className="section-heading mt-2">What Clients Say</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Don't just take my word for it. Here is feedback from people I've worked with.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.1}>
                    <div className="relative max-w-3xl mx-auto">
                        {/* Card */}
                        <div className="relative overflow-hidden min-h-[300px]">
                            <AnimatePresence custom={direction} mode="wait">
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                                    className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
                                >
                                    {/* Large quote mark */}
                                    <div className="absolute top-4 right-6 text-8xl font-serif text-primary/10 leading-none select-none">"</div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-5 text-amber-400">
                                        {[...Array(Math.max(1, Math.min(5, testi.rating || 5)))].map((_, i) => (
                                            <StarIcon key={i} />
                                        ))}
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed italic mb-8">
                                        "{testi.content}"
                                    </p>

                                    <div className="flex items-center gap-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                                        <img
                                            src={testi.image}
                                            alt={testi.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{testi.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{testi.role}, {testi.company}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        {testimonials.length > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button
                                    onClick={goToPrev}
                                    aria-label="Previous testimonial"
                                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary/40 transition-all"
                                >
                                    ←
                                </button>
                                <div className="flex gap-2">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                                            aria-label={`Go to testimonial ${idx + 1}`}
                                            className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-gradient-to-r from-primary to-secondary' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary/50'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={goToNext}
                                    aria-label="Next testimonial"
                                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary/40 transition-all"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default Testimonials;
