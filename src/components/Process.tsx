import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import * as Icons from './Icons';

const Process: React.FC = () => {
    const { content } = usePortfolio();
    const { processSteps = [] } = content;

    if (processSteps.length === 0) return null;

    return (
        <section id="process" className="py-24 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                            My Working <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Process</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            A structured approach to ensure quality, transparency, and timely delivery of your project.
                        </p>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 transform -translate-y-1/2 rounded-full z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {processSteps.map((step, index) => {
                            const IconComponent = step.iconName && (Icons as any)[step.iconName] 
                                ? (Icons as any)[step.iconName] 
                                : Icons.CodeIcon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 text-center group hover:-translate-y-2 transition-transform duration-300 relative"
                                >
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-dark-bg z-20">
                                        {index + 1}
                                    </div>
                                    <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:text-secondary transition-all duration-300 mb-6 mt-4">
                                        <IconComponent className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
