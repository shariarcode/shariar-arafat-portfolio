import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioData } from '../types';
import { ArrowRightIcon, CodeIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';
import FadeIn from './FadeIn';

// ─── Wave Divider (points upward into the Work section) ──────────
const WaveTop: React.FC<{ fill: string }> = ({ fill }) => (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 C360,0 1080,60 1440,10 L1440,0 L0,0 Z" fill={fill} />
        </svg>
    </div>
);

// ─── 3D Tilt Card ─────────────────────────────────────────────────
interface TiltCardProps {
    project: PortfolioData['projectsData'][0];
}

const TiltCard: React.FC<TiltCardProps> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(111,66,193,0.25)`;

        if (glareRef.current) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
            glareRef.current.style.opacity = '1';
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.boxShadow = '';
        if (glareRef.current) glareRef.current.style.opacity = '0';
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-dark-card bg-opacity-70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row relative"
            style={{ transition: 'transform 0.1s ease, box-shadow 0.1s ease' }}
        >
            {/* Glare overlay */}
            <div
                ref={glareRef}
                className="absolute inset-0 z-10 pointer-events-none rounded-2xl transition-opacity duration-200"
                style={{ opacity: 0 }}
            />

            {project.imageUrl && (
                <div className="md:w-1/3 h-48 md:h-auto shrink-0 relative overflow-hidden bg-gray-800">
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-card/80 md:block hidden" />
                </div>
            )}

            <div className="p-8 flex-1 flex flex-col relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-primary/90 uppercase tracking-widest mb-2 inline-block">{project.category}</span>
                        <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
                    </div>
                    {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center justify-center p-2 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all transform hover:scale-110 hover:rotate-12 border border-primary/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
                <p className="text-gray-400 mb-6 flex-1 mt-2 text-sm leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto border-t border-gray-700/60 pt-5">
                    {project.services.map((service, i) => {
                        const ServiceIcon = service.iconName ? ICON_OPTIONS[service.iconName] : null;
                        return (
                            <div key={i} className="flex items-center gap-3 group/item">
                                <div className="text-primary/70 group-hover/item:text-primary transition-colors">{ServiceIcon ? <ServiceIcon /> : service.icon || <CodeIcon />}</div>
                                <h4 className="font-semibold text-sm text-gray-300 group-hover/item:text-white transition-colors">{service.name}</h4>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Main Work Section ────────────────────────────────────────────
interface WorkProps {
    content: PortfolioData;
}

const Work: React.FC<WorkProps> = ({ content }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const categories = ['All', ...Array.from(new Set(content.projectsData.map(p => p.category)))];
    const filteredProjects = activeFilter === 'All'
        ? content.projectsData
        : content.projectsData.filter(p => p.category === activeFilter);

    return (
        <section id="work" className="py-24 bg-gray-900 text-white relative scroll-mt-20 overflow-hidden">
            {/* Wave divider at top */}
            <WaveTop fill="rgb(249 250 251)" />
            <div className="dark:hidden"><WaveTop fill="rgb(249 250 251)" /></div>
            <div className="hidden dark:block absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,60 C360,0 1080,60 1440,10 L1440,0 L0,0 Z" fill="rgb(31 41 55)" />
                </svg>
            </div>

            {/* Background dot grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-dark-bg bg-[radial-gradient(#3a3a4a_1px,transparent_1px)] [background-size:18px_18px]" />
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 pt-8">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold text-sm uppercase tracking-widest">My Projects</span>
                        <h2 className="text-4xl font-bold mt-2">{content.sectionTitles?.work || "Bringing Ideas to Life"}</h2>
                        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                            I create digital experiences that combine creativity with functionality.
                        </p>
                    </div>
                </FadeIn>

                {/* Filter tabs */}
                <FadeIn direction="up" delay={0.1}>
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {categories.map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveFilter(category)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    activeFilter === category
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                                        : 'bg-gray-800/80 backdrop-blur-sm text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Project cards with 3D tilt */}
                <motion.div layout className="max-w-4xl mx-auto space-y-8">
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.35 }}
                                key={project.title}
                            >
                                <TiltCard project={project} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <FadeIn direction="up" delay={0.3}>
                    <div className="text-center mt-14">
                        <a
                            href="#contact"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                        >
                            Discuss Your Project <ArrowRightIcon />
                        </a>
                    </div>
                </FadeIn>
            </div>

            {/* Wave divider at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0 C360,60 1080,0 1440,50 L1440,60 L0,60 Z" fill="rgb(248 250 252)" />
                </svg>
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full hidden dark:block absolute inset-0">
                    <path d="M0,0 C360,60 1080,0 1440,50 L1440,60 L0,60 Z" fill="rgb(17 24 39)" />
                </svg>
            </div>
        </section>
    );
};

export default Work;