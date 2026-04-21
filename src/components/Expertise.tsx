import React from 'react';
import type { PortfolioData } from '../types';
import { CodeIcon, DesignIcon } from './Icons';
import FadeIn from './FadeIn';

interface ExpertiseProps {
    content: PortfolioData;
}

const Expertise: React.FC<ExpertiseProps> = ({ content }) => {
    const { careerObjective, expertiseAreas, sectionTitles } = content;
    return (
        <section id="about" className="py-20 bg-white dark:bg-dark-card scroll-mt-20">
            <div className="container mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{sectionTitles?.about || "My Expertise"}</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            With a diverse skill set across multiple disciplines, I bring a unique perspective to every project.
                        </p>
                    </div>
                </FadeIn>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <FadeIn direction="left" className="lg:w-1/2 flex justify-center w-full">
                        <div className="relative border-l-2 border-primary/30 w-full max-w-sm ml-4">
                            {(content.timeline || [
                                { year: "2020", title: "The Beginning", description: "Discovered a passion for programming and started learning foundational web tech." },
                                { year: "2022", title: "Freelance Hustle", description: "Took on client projects across graphic design and front-end development." },
                                { year: "2024", title: "Full Stack & Beyond", description: "Mastering modern frameworks, TypeScript, and backend architectures." }
                            ]).map((event, i) => (
                                <div key={i} className={`pl-6 relative ${i === 2 ? '' : 'mb-8'}`}>
                                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-dark-card" />
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300">
                                        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-primary bg-primary/10 rounded-full">{event.year}</span>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                    <FadeIn direction="right" className="lg:w-1/2">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Multi-Disciplinary Expertise</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                           {careerObjective}
                        </p>
                        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {expertiseAreas.map((area, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary"></span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{area.name}</span>
                                </li>
                            ))}
                        </ul>
                    </FadeIn>
                </div>

                <FadeIn direction="up" delay={0.2} className="mt-16 flex flex-wrap justify-center gap-4">
                     {expertiseAreas.map((area, index) => (
                         <div key={index} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-gray-600 dark:text-gray-300">
                            {area.name.includes("Web") ? <CodeIcon /> : <DesignIcon />}
                            <span>{area.name}</span>
                         </div>
                     ))}
                </FadeIn>
            </div>
        </section>
    );
};

export default Expertise;