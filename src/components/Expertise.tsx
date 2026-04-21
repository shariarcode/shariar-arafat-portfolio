import React from 'react';
import type { PortfolioData } from '../types';
import { CodeIcon, DesignIcon } from './Icons';
import FadeIn from './FadeIn';
import { motion } from 'framer-motion';

interface ExpertiseProps {
    content: PortfolioData;
}

const Expertise: React.FC<ExpertiseProps> = ({ content }) => {
    const { careerObjective, expertiseAreas, sectionTitles } = content;
    return (
        <section id="about" className="py-20 bg-white dark:bg-dark-card scroll-mt-20 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-56 h-56 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="section-heading">
                            {sectionTitles?.about || "My Expertise"}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            With a diverse skill set across multiple disciplines, I bring a unique perspective to every project.
                        </p>
                    </div>
                </FadeIn>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Timeline — glassmorphism cards */}
                    <FadeIn direction="left" className="lg:w-1/2 flex justify-center w-full">
                        <div className="relative border-l-2 border-primary/30 w-full max-w-sm ml-4">
                            {(content.timeline || [
                                { year: "2020", title: "The Beginning", description: "Discovered a passion for programming and started learning foundational web tech." },
                                { year: "2022", title: "Freelance Hustle", description: "Took on client projects across graphic design and front-end development." },
                                { year: "2024", title: "Full Stack & Beyond", description: "Mastering modern frameworks, TypeScript, and backend architectures." }
                            ]).map((event, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className={`pl-6 relative ${i === 2 ? '' : 'mb-8'}`}
                                >
                                    {/* Pulsing timeline dot */}
                                    <div className="absolute -left-[7px] top-1.5">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                                        </span>
                                    </div>

                                    {/* Glassmorphism timeline card */}
                                    <div className="glass-card p-5 rounded-2xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-primary bg-primary/10 rounded-full">{event.year}</span>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Right side — expertise bullets */}
                    <FadeIn direction="right" className="lg:w-1/2">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Multi-Disciplinary Expertise</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {careerObjective}
                        </p>
                        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {expertiseAreas.map((area, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.07 }}
                                    className="flex items-center space-x-3 glass-card px-4 py-2.5 rounded-xl"
                                >
                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary" />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{area.name}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </FadeIn>
                </div>

                {/* Expertise pill tags */}
                <FadeIn direction="up" delay={0.2} className="mt-16 flex flex-wrap justify-center gap-3" stagger staggerDelay={0.06}>
                    {expertiseAreas.map((area, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 glass-card px-5 py-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:scale-105 hover:border-primary/40 transition-all duration-300 cursor-default border border-transparent"
                        >
                            {area.name.includes("Web") ? <CodeIcon /> : <DesignIcon />}
                            <span className="font-medium text-sm">{area.name}</span>
                        </div>
                    ))}
                </FadeIn>
            </div>
        </section>
    );
};

export default Expertise;