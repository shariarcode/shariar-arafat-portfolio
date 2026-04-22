import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CodeIcon, DesignIcon, DevOpsIcon, ChevronRightIcon } from './Icons';
import FadeIn from './FadeIn';

const DefaultIcon: React.FC<{className?: string}> = ({className}) => <CodeIcon className={className} />;

const Services: React.FC = () => {
    const { content, t } = usePortfolio();
    const { expertiseAreas } = content;

    const services = [
        { name: 'Web Development', description: 'Building responsive and modern websites.', IconComponent: CodeIcon },
        { name: 'Graphic Design', description: 'Creating visual content and designs.', IconComponent: DesignIcon },
        { name: 'Consulting', description: 'Technical advice and strategy.', IconComponent: DevOpsIcon },
    ];

    const displayServices = expertiseAreas?.length 
        ? expertiseAreas.map((area, index) => ({
            name: area.name,
            description: area.description,
            IconComponent: services[index]?.IconComponent || DefaultIcon,
        }))
        : services;

    return (
        <section id="services" className="py-20 bg-slate-50 dark:bg-dark-bg">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {t.sections.services || 'Services'}
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Professional services I offer to help bring your ideas to life.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-6">
                    {displayServices.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className="group bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                                    <service.IconComponent className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {service.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {service.description}
                                </p>
                                <a 
                                    href="#contact" 
                                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all"
                                >
                                    Get Started <ChevronRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;