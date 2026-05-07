import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { DownloadIcon, DocumentIcon } from './Icons';

const Resources: React.FC = () => {
    const { content } = usePortfolio();
    const { resources = [] } = content;

    if (resources.length === 0) return null;

    return (
        <section id="resources" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                            Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Resources</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Downloadable assets, templates, and guides that I've created to help fellow developers and designers.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-dark-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group flex flex-col h-full shadow-sm hover:shadow-xl"
                        >
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <DocumentIcon className="w-8 h-8" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{resource.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                                {resource.description}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between">
                                {resource.downloadCount !== undefined && (
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                                        {resource.downloadCount} downloads
                                    </span>
                                )}
                                <a 
                                    href={resource.fileUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto flex items-center gap-2 text-sm font-bold text-white bg-gray-900 dark:bg-gray-700 hover:bg-primary dark:hover:bg-primary px-5 py-2.5 rounded-full transition-colors"
                                >
                                    <DownloadIcon className="w-4 h-4" /> Download
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Resources;
