import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from './Icons';
import FadeIn from './FadeIn';

const About: React.FC = () => {
    const { content, t } = usePortfolio();
    const { 
        userName, 
        userEmail, 
        userLocation, 
        careerObjective, 
        expertiseAreas, 
        contactInfo
    } = content;

    return (
        <section id="about" className="py-20 bg-white dark:bg-dark-card">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            {t.sections.about || 'About Me'}
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Learn more about my background and what I do.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    <FadeIn direction="left" className="md:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Who I Am
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {careerObjective || `I'm ${userName}, a passionate developer committed to creating exceptional digital experiences.`}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {expertiseAreas?.slice(0, 4).map((area, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-dark-bg rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {area.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {area.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" className="space-y-4">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Contact Info
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm">{contactInfo.email || userEmail}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <MapPinIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm">{contactInfo.location || userLocation}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <PhoneIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm">{contactInfo.phone || 'Available on request'}</span>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#contact"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <CalendarIcon /> Let's Talk
                        </a>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default About;