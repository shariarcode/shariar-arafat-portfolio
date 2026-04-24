import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface StatsProps {}

import { usePortfolio } from '../context/PortfolioContext';

const StatItem: React.FC<{ endValue: number; label: string; duration?: number; suffix?: string }> = ({ endValue, label, duration = 2, suffix = "+" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // ease out cubic function
            const easeOutProgress = 1 - Math.pow(1 - percentage, 3);
            setCount(Math.floor(easeOutProgress * endValue));

            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, endValue, duration]);

    return (
        <div ref={ref} className="flex flex-col items-center p-6 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 w-full sm:w-48 transform hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                {count}{suffix}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-center">{label}</p>
        </div>
    );
};

const Stats: React.FC<StatsProps> = () => {
    const { content } = usePortfolio();
    const stats = content.stats || [];

    if (stats.length === 0) return null;

    return (
        <section id="stats" className="py-12 bg-slate-50 dark:bg-dark-bg relative z-20 -mt-10">
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
