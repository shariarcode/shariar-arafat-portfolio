import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRightIcon, CodeIcon, ArrowLeftIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';

const Work: React.FC = () => {
    const { content, t } = usePortfolio();
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const categories = ['All', ...Array.from(new Set(content.projectsData.map(p => p.category)))];
    const filteredProjects = activeFilter === 'All'
        ? content.projectsData
        : content.projectsData.filter(p => p.category === activeFilter);

    // Reset current index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeFilter]);

    const handleNext = () => {
        if (filteredProjects.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    };

    const handlePrev = () => {
        if (filteredProjects.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    };

    if (!filteredProjects || filteredProjects.length === 0) return null;

    return (
        <section id="work" className="relative py-24 bg-[#0d1116] text-white scroll-mt-20 overflow-hidden border-y border-white/10 grid-bg">
            {/* Ambient Lighting & Particles */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full font-space">
                        Portfolio
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black mt-4 tracking-tight font-space">
                        {content.sectionTitles?.work || "Bringing Ideas to Life"}
                    </h2>
                    <p className="mt-4 text-base text-gray-400 max-w-xl mx-auto font-medium">
                        A curated selection of client projects, community events, and digital creations.
                    </p>
                </div>

                {/* Filter Categories Pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveFilter(category)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 font-space ${
                                activeFilter === category
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 border border-primary/30'
                                    : 'bg-[#14181f] border border-white/10 text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                            data-magnetic
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 3D Stacked Cards Deck */}
                <div className="relative w-full max-w-[720px] h-[620px] sm:h-[550px] md:h-[450px] mx-auto flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => {
                                const isTop = index === currentIndex;
                                const isSecond = index === (currentIndex + 1) % filteredProjects.length;
                                const isThird = index === (currentIndex + 2) % filteredProjects.length;
                                const isVisible = isTop || isSecond || isThird;

                                if (!isVisible) return null;

                                const depth = isTop ? 0 : isSecond ? 1 : 2;
                                const projectSlug = project.title.toLowerCase().replace(/\s+/g, '-');

                                return (
                                    <motion.div
                                        key={project.title}
                                        style={{
                                            zIndex: 30 - depth,
                                            transformOrigin: "top center",
                                        }}
                                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                        animate={{
                                            scale: 1 - depth * 0.05,
                                            y: depth * 16,
                                            opacity: 1 - depth * 0.35,
                                        }}
                                        exit={{ 
                                            opacity: 0, 
                                            x: dragStart.x > 0 ? 250 : -250,
                                            rotate: dragStart.x > 0 ? 15 : -15,
                                            scale: 0.9,
                                            transition: { duration: 0.4, ease: "easeOut" }
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 25
                                        }}
                                        drag={isTop && filteredProjects.length > 1 ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.6}
                                        onDragStart={(e, info) => {
                                            setDragStart({ x: info.point.x, y: info.point.y });
                                        }}
                                        onDragEnd={(event, info) => {
                                            const swipeThreshold = 120;
                                            if (info.offset.x > swipeThreshold) {
                                                handlePrev();
                                            } else if (info.offset.x < -swipeThreshold) {
                                                handleNext();
                                            }
                                        }}
                                        className={`absolute inset-0 bg-[#14181f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full w-full ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                                    >
                                        {/* Project Image Panel */}
                                        <div className="h-48 md:h-full md:w-5/12 overflow-hidden bg-[#0d1116] relative flex-shrink-0">
                                            {project.imageUrl ? (
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                                    draggable="false"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-[#14181f] text-primary-light">
                                                    <CodeIcon className="w-16 h-16 opacity-30" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#14181f]/40 to-[#14181f] pointer-events-none" />
                                            <span className="absolute top-4 left-4 bg-primary/20 border border-primary/30 backdrop-blur-md text-primary text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full font-space">
                                                {project.category}
                                            </span>
                                        </div>

                                        {/* Description Content Box */}
                                        <div className="p-6 md:p-8 flex flex-col flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <h3 className="text-xl sm:text-2xl font-bold text-white hover:text-primary transition-colors duration-300 leading-tight font-space truncate">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <a
                                                        href={`/project/${projectSlug}`}
                                                        className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 flex items-center justify-center transition-all duration-300"
                                                        title="View Details"
                                                        data-magnetic
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </a>
                                                    {project.liveUrl && project.liveUrl !== '#' && (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 flex items-center justify-center transition-all duration-300"
                                                            data-magnetic
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed flex-1 line-clamp-4">
                                                {project.description}
                                            </p>

                                            {/* Sub-services / tags */}
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {project.services && project.services.map((service: any, idx: number) => {
                                                    const IconComponent = ICON_OPTIONS[service.iconName as keyof typeof ICON_OPTIONS] || CodeIcon;
                                                    return (
                                                        <div key={idx} className="flex items-center gap-1.5 bg-[#0d1116] px-3 py-1 rounded-full border border-white/5">
                                                            <div className="text-primary text-xs"><IconComponent className="w-3.5 h-3.5" /></div>
                                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider font-space">{service.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Stack Controls & CTA */}
                {filteredProjects.length > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={handlePrev}
                            className="p-3 bg-[#14181f] hover:bg-primary/20 text-gray-400 hover:text-primary rounded-full border border-white/10 transition-all"
                            aria-label="Previous Project"
                            data-magnetic
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-bold font-space text-gray-400">
                            {currentIndex + 1} / {filteredProjects.length}
                        </span>
                        <button
                            onClick={handleNext}
                            className="p-3 bg-[#14181f] hover:bg-primary/20 text-gray-400 hover:text-primary rounded-full border border-white/10 transition-all"
                            aria-label="Next Project"
                            data-magnetic
                        >
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="text-center mt-12">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all duration-300 font-space"
                        data-magnetic
                    >
                        Start a Project <ArrowRightIcon />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Work;