import React from 'react';
import type { PortfolioData } from '../types';
import { CodeIcon, DesignIcon } from './Icons';

interface ExpertiseProps {
    content: PortfolioData;
}

const Expertise: React.FC<ExpertiseProps> = ({ content }) => {
    const { careerObjective, expertiseAreas } = content;
    return (
        <section id="about" className="py-20 bg-white dark:bg-dark-card scroll-mt-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">My Expertise</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        With a diverse skill set across multiple disciplines, I bring a unique perspective to every project.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2 flex justify-center items-center">
                       <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                         <div className="absolute w-full h-full bg-orange-300 dark:bg-orange-500 rounded-lg transform -rotate-12 transition-transform duration-500 hover:rotate-0"></div>
                         <div className="absolute w-full h-full bg-green-300 dark:bg-green-500 rounded-lg transform rotate-6 transition-transform duration-500 hover:rotate-0"></div>
                         <div className="absolute w-full h-full bg-blue-300 dark:bg-blue-500 rounded-lg transform rotate-3 transition-transform duration-500 hover:rotate-0"></div>
                         <div className="relative w-full h-full bg-purple-400 dark:bg-purple-600 text-white rounded-lg flex flex-col justify-center items-center p-8 shadow-2xl z-10">
                            <h3 className="text-2xl font-bold">Multi-Disciplinary</h3>
                            <p className="text-center mt-2">Design & Development</p>
                         </div>
                       </div>
                    </div>
                    <div className="lg:w-1/2">
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
                    </div>
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-4">
                     {expertiseAreas.map((area, index) => (
                         <div key={index} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-gray-600 dark:text-gray-300">
                            {area.name.includes("Web") ? <CodeIcon /> : <DesignIcon />}
                            <span>{area.name}</span>
                         </div>
                     ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;