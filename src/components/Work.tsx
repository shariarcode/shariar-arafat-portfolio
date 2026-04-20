import React from 'react';
import type { PortfolioData } from '../types';
import { ArrowRightIcon, CodeIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';

interface WorkProps {
    content: PortfolioData;
}

const Work: React.FC<WorkProps> = ({ content }) => {
    return (
        <section id="work" className="py-20 bg-gray-900 text-white relative scroll-mt-20">
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-dark-bg bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <span className="text-primary font-semibold">My Projects</span>
                    <h2 className="text-4xl font-bold mt-2">{content.sectionTitles?.work || "Bringing Ideas to Life"}</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                        I create digital experiences that combine creativity with functionality. Here's a look at my work.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {content.projectsData.map((project, index) => (
                        <div key={index} className="bg-dark-card bg-opacity-70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col md:flex-row">
                            {project.imageUrl && (
                                <div className="md:w-1/3 h-48 md:h-auto shrink-0 relative overflow-hidden bg-gray-800">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2 inline-block">{project.category}</span>
                                        <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
                                    </div>
                                    {project.liveUrl && project.liveUrl !== '#' && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center p-2 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all transform hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-6 flex-1 mt-2">{project.description}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto border-t border-gray-700 pt-6">
                                    {project.services.map((service, i) => {
                                        const ServiceIcon = service.iconName ? ICON_OPTIONS[service.iconName] : null;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="text-primary opacity-80">{ServiceIcon ? <ServiceIcon /> : service.icon || <CodeIcon />}</div>
                                                <h4 className="font-semibold text-sm text-gray-200">{service.name}</h4>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="#contact" className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105 duration-300">
                        Discuss Your Project <ArrowRightIcon />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Work;