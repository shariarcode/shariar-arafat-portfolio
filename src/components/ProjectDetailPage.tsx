import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon, CodeIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';
import FadeIn from './FadeIn';
import SEO from './SEO';

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
            <SEO 
                title={project.title} 
                description={project.description} 
                image={project.imageUrl}
                type="article"
            />
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
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <span className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                {project.category}
                            </span>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {project.role && <span><strong className="text-gray-900 dark:text-white">Role:</strong> {project.role}</span>}
                                {project.duration && <span><strong className="text-gray-900 dark:text-white">Duration:</strong> {project.duration}</span>}
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            {project.title}
                        </h1>
                        
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                </FadeIn>

                {/* Main Project image */}
                {project.imageUrl && (
                    <FadeIn direction="up" delay={0.1}>
                        <div className="max-w-5xl mx-auto mb-16">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card">
                                <img 
                                    src={project.imageUrl} 
                                    alt={project.title} 
                                    loading="lazy"
                                    className="w-full h-auto object-cover" 
                                />
                            </div>
                        </div>
                    </FadeIn>
                )}

                <div className="max-w-4xl mx-auto space-y-16">
                    {/* The Challenge & The Solution */}
                    {(project.challenge || project.solution) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.challenge && (
                                <FadeIn direction="up" delay={0.2}>
                                    <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 h-full">
                                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Challenge</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {project.challenge}
                                        </p>
                                    </div>
                                </FadeIn>
                            )}

                            {project.solution && (
                                <FadeIn direction="up" delay={0.3}>
                                    <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 h-full">
                                        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-6">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Solution</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {project.solution}
                                        </p>
                                    </div>
                                </FadeIn>
                            )}
                        </div>
                    )}

                    {/* Results / Impact */}
                    {project.results && project.results.length > 0 && (
                        <FadeIn direction="up" delay={0.2}>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Results</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {project.results.map((result, idx) => (
                                        <div key={idx} className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
                                            <div className="text-3xl font-black text-primary mb-2">{result.value}</div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{result.metric}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    )}

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <FadeIn direction="up" delay={0.2}>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Gallery</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {project.gallery.map((img, idx) => (
                                        <div key={idx} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                                            <img src={img} alt={`${project.title} screenshot ${idx + 1}`} loading="lazy" className="w-full h-auto hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    )}

                    {/* Tech Stack & Live Link */}
                    <FadeIn direction="up" delay={0.2}>
                        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tech Stack & Tools</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(project.techStack || project.services?.map(s => s.name))?.map((tech, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {project.liveUrl && project.liveUrl !== '#' && (
                                <div className="flex-shrink-0">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full justify-center md:w-auto"
                                    >
                                        Visit Live Site
                                        <ExternalLinkIcon className="w-5 h-5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;