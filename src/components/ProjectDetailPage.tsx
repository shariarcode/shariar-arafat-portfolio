import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon, CodeIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';
import FadeIn from './FadeIn';

const ProjectDetailPage: React.FC = () => {
    const { content } = usePortfolio();
    const { slug } = useParams<{ slug: string }>();
    
    const project = content.projectsData.find(p => 
        p.title.toLowerCase().replace(/\s+/g, '-') === slug || 
        p.title.toLowerCase() === slug
    );

    useEffect(() => {
        if (project) {
            document.title = `${project.title} | ${content.userName} Portfolio`;
        }
    }, [project, content.userName]);

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">The project you're looking for doesn't exist.</p>
                    <Link 
                        to="/#work" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <ArrowLeftIcon />
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-20 pb-20">
            <div className="container mx-auto px-6">
                {/* Back button */}
                <FadeIn direction="up">
                    <Link 
                        to="/#work" 
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-8"
                    >
                        <ArrowLeftIcon />
                        Back to Projects
                    </Link>
                </FadeIn>

                {/* Hero section */}
                <FadeIn direction="up">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">
                            {project.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 mb-6">
                            {project.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-4 mb-8">
                            {project.services?.map((service, idx) => {
                                const IconComponent = ICON_OPTIONS[service.iconName as keyof typeof ICON_OPTIONS] || CodeIcon;
                                return (
                                    <div 
                                        key={idx}
                                        className="flex items-center gap-2 bg-white dark:bg-dark-card px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700"
                                    >
                                        <IconComponent />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {service.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>

                {/* Project image */}
                {project.imageUrl && (
                    <FadeIn direction="up" delay={0.1}>
                        <div className="max-w-4xl mx-auto mb-12">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src={project.imageUrl} 
                                    alt={project.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Project description */}
                <FadeIn direction="up" delay={0.2}>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Project</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {project.description}
                            </p>
                            
                            {project.liveUrl && project.liveUrl !== '#' && (
                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                                    >
                                        View Live Project
                                        <ExternalLinkIcon />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </FadeIn>

                {/* Technologies used */}
                <FadeIn direction="up" delay={0.3}>
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies & Services</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.services?.map((service, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-4 py-2 bg-white dark:bg-dark-card rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                    >
                                        {service.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default ProjectDetailPage;