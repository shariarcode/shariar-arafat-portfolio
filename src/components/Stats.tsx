import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatsProps {}

const StatItem: React.FC<{ endValue: number; label: string; suffix?: string }> = ({ endValue, label, suffix = "+" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const numberEl = numberRef.current;
        if (!numberEl) return;

        const counter = { value: 0 };
        const anim = gsap.to(counter, {
            value: endValue,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
                numberEl.textContent = String(Math.floor(counter.value));
            }
        });

        return () => {
            anim.kill();
        };
    }, [endValue]);

    return (
        <div 
            ref={containerRef} 
            className="flex flex-col items-center p-6 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-800/80 w-full sm:w-48 transform hover:-translate-y-1.5 transition-all duration-300"
            data-magnetic
        >
            <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                <span ref={numberRef}>0</span>{suffix}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-semibold text-center text-sm">{label}</p>
        </div>
    );
};

const Stats: React.FC<StatsProps> = () => {
    const { content } = usePortfolio();
    const stats = content.stats || [];

    if (stats.length === 0) return null;

    return (
        <section id="stats" className="py-12 bg-slate-50 dark:bg-dark-bg relative z-20 -mt-10 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-6">
                    {stats.map((stat, index) => (
                        <StatItem 
                            key={index}
                            endValue={stat.endValue} 
                            label={stat.label} 
                            suffix={stat.suffix}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;

