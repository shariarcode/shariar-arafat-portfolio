import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCapIcon, AwardIcon, ExternalLinkIcon } from './Icons';

const Education: React.FC = () => {
    const { content } = usePortfolio();
    const { education = [], certifications = [] } = content;

    if (education.length === 0 && certifications.length === 0) return null;

    return (
        <section id="education" className="py-24 relative overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] transform translate-x-1/2"></div>
                <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] transform -translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                            Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Certifications</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            My academic background and professional qualifications that form the foundation of my expertise.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Education Column */}
                    {education.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary">
                                    <GraduationCapIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                            </div>

                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                                {education.map((item, index) => (
                                    <div key={index} className="relative flex items-start gap-6">
                                        <div className="absolute left-0 md:left-1/2 w-10 h-10 rounded-full bg-white dark:bg-dark-card border-4 border-primary/20 dark:border-primary/30 flex items-center justify-center transform -translate-x-1/2 z-10 shadow-lg">
                                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                                        </div>
                                        
                                        <div className="w-full md:w-1/2 md:pr-12 md:text-right md:even:text-left md:even:pl-12 md:even:ml-auto ml-12 md:ml-0">
                                            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors group">
                                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                                    {item.year}
                                                </span>
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{item.degree}</h4>
                                                <p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">{item.institution}</p>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Certifications Column */}
                    {certifications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-2xl text-secondary">
                                    <AwardIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {certifications.map((cert, index) => (
                                    <motion.div 
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
                                                <AwardIcon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                {cert.year}
                                            </span>
                                        </div>
                                        
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                            {cert.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                                            {cert.issuer}
                                        </p>
                                        
                                        {cert.url && cert.url !== '#' && (
                                            <a 
                                                href={cert.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors mt-auto"
                                            >
                                                View Credential <ExternalLinkIcon className="w-4 h-4" />
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Education;
