import React from 'react';
import type { PortfolioData } from '../types';
import { ArrowRightIcon } from './Icons';

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
                    <h2 className="text-4xl font-bold mt-2">Bringing Ideas to Life</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                        I create digital experiences that combine creativity with functionality. Here's a look at my work.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {content.projectsData.map((project, index) => (
                        <div key={index} className="bg-dark-card bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
                             <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                             <p className="text-gray-400 mb-6">{project.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               {project.services.map((service, i) => (
                                   <div key={i} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                                       <div className="text-primary">{service.icon}</div>
                                       <div>
                                           <h4 className="font-semibold text-white">{service.name}</h4>
                                       </div>
                                   </div>
                               ))}
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