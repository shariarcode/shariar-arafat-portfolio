import React from 'react';
import { motion } from 'framer-motion';
import type { Skill, PortfolioData } from '../types';
import { ICON_OPTIONS } from '../constants';
import { CodeIcon } from './Icons';
import FadeIn from './FadeIn';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
    const IconComponent = skill.iconName ? ICON_OPTIONS[skill.iconName] : null;
    const renderIcon = IconComponent ? <IconComponent /> : skill.icon || <CodeIcon />;

    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-lg">
                            {renderIcon}
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

            {/* Proficiency progress bar */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency</span>
                    <span className="text-sm font-semibold text-primary">{skill.proficiency || 85}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 85}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                    ></motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        </div>
    );
};

interface SkillsProps {
    content: PortfolioData;
}

const Skills: React.FC<SkillsProps> = ({ content }) => {
    return (
        <section id="skills" className="py-20 scroll-mt-20">
            <div className="container mx-auto px-6">
                <FadeIn direction="up">
                     <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{content.sectionTitles?.skills || "Technical Skills"}</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A glimpse into the technologies I work with.</p>
                    </div>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-8">
                    {content.skillsData.map((skill, index) => (
                        <FadeIn key={index} direction="up" delay={index * 0.1}>
                            <SkillCard skill={skill} />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;