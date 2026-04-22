import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { DownloadIcon, FileIcon, EyeIcon } from './Icons';
import FadeIn from './FadeIn';

const Resume: React.FC = () => {
    const { content, t } = usePortfolio();
    const { resumeUrl, userName, careerObjective, skillsData } = content;

    const hasResume = !!resumeUrl;

    return (
        <section id="resume" className="py-20 bg-white dark:bg-dark-card">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {t.sections.resume || 'Resume'}
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Download my resume to learn more about my experience and qualifications.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <FadeIn direction="left" className="space-y-6">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Career Objective
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {careerObjective || 'Passionate developer dedicated to building exceptional digital experiences.'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Key Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillsData?.slice(0, 8).map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" className="text-center">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border-2 border-dashed border-primary/30">
                            <div className="w-20 h-24 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
                                <FileIcon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {userName}'s Resume
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                PDF Document
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {hasResume ? (
                                    <>
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                                        >
                                            <EyeIcon /> Preview
                                        </a>
                                        <a
                                            href={resumeUrl}
                                            download
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <DownloadIcon /> Download
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Resume not available
                                    </p>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default Resume;
