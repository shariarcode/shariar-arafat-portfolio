import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PortfolioData } from '../types';
import FadeIn from './FadeIn';

interface TestimonialsProps {
    content: PortfolioData;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
    const testimonials = useMemo(
        () => (content.testimonials && content.testimonials.length > 0 ? content.testimonials : []),
        [content.testimonials]
    );
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setCurrent(0);
    }, [testimonials.length]);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = window.setInterval(() => {
            setCurrent(prev => (prev + 1) % testimonials.length);
        }, 6000);
        return () => window.clearInterval(timer);
    }, [testimonials.length]);

    if (testimonials.length === 0) return null;

    const goToPrev = () => setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);
    const goToNext = () => setCurrent(prev => (prev + 1) % testimonials.length);

    return (
        <section className="py-20 bg-slate-50 dark:bg-dark-bg relative scroll-mt-20">
            <div className="container mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold">Social Proof</span>
                        <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">What Clients Say</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Don't just take my word for it. Here is some feedback from people I've had the pleasure of working with.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.1}>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-2xl">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${current * 100}%` }}
                                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            >
                                {testimonials.map((testi, idx) => (
                                    <div key={idx} className="w-full shrink-0 px-1">
                                        <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative flex flex-col min-h-[320px]">
                                            <div className="flex gap-1 mb-6 text-yellow-400">
                                                {[...Array(Math.max(1, Math.min(5, testi.rating || 5)))].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 mb-8 italic flex-1">"{testi.content}"</p>
                                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                                                <img src={testi.image} alt={testi.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{testi.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testi.role}, {testi.company}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                        {testimonials.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    aria-label="Previous testimonial"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-primary"
                                >
                                    &#8592;
                                </button>
                                <button
                                    onClick={goToNext}
                                    aria-label="Next testimonial"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-primary"
                                >
                                    &#8594;
                                </button>
                                <div className="flex justify-center gap-2 mt-6">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrent(idx)}
                                            aria-label={`Go to testimonial ${idx + 1}`}
                                            className={`h-2.5 rounded-full transition-all ${current === idx ? 'w-7 bg-primary' : 'w-2.5 bg-gray-300 dark:bg-gray-600'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default Testimonials;
