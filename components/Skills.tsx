import React from 'react';
import type { Skill, PortfolioData } from '../types';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
        <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-lg">
                        {skill.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{skill.description}</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
            {skill.technologies.map(tech => (
                <span key={tech} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                    {tech}
                </span>
            ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
    </div>
);

interface SkillsProps {
    content: PortfolioData;
}

const Skills: React.FC<SkillsProps> = ({ content }) => {
    return (
        <section id="skills" className="py-20 scroll-mt-20">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Technical Skills</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A glimpse into the technologies I work with.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {content.skillsData.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;