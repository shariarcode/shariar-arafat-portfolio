import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ChevronDownIcon } from './Icons';
import { setJsonLd, removeJsonLd } from '../lib/seo';

const FAQ: React.FC = () => {
    const { content } = usePortfolio();
    const { faqs = [] } = content;
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    useEffect(() => {
        if (faqs.length > 0) {
            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            };
            setJsonLd('faq-schema', faqSchema);
        }
        return () => removeJsonLd('faq-schema');
    }, [faqs]);

    if (faqs.length === 0) return null;

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Questions</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Got questions? I've got answers. Here are some of the most common questions clients ask me.
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className={`w-full text-left px-6 py-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                                    activeIndex === index 
                                    ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' 
                                    : 'bg-gray-50 dark:bg-dark-card border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                                } border`}
                            >
                                <span className={`text-lg font-bold ${activeIndex === index ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 ${activeIndex === index ? 'bg-primary text-white rotate-180' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </div>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
