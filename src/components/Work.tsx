import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRightIcon, CodeIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Upgraded V2 Tilt Project Card ─────────────────────────────────
interface ProjectCardProps {
    project: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const projectSlug = project.title.toLowerCase().replace(/\s+/g, '-');

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Mouse tracking glow position variables
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Compute 3D rotation angles
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`,
            boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(111, 66, 193, 0.22)`,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        if (imageRef.current) {
            gsap.to(imageRef.current, {
                scale: 1.08,
                duration: 0.4,
                overwrite: 'auto'
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        if (imageRef.current) {
            gsap.to(imageRef.current, {
                scale: 1.0,
                duration: 0.5,
                overwrite: 'auto'
            });
        }
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-dark-card/85 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-800 flex flex-col w-[310px] sm:w-[480px] lg:w-[600px] shrink-0 relative transition-colors duration-300"
            style={{ 
                transformStyle: 'preserve-3d',
                willChange: 'transform'
            }}
        >
            {/* Visual glow layer */}
            <div className="absolute -inset-px rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />

            {/* Project Image Frame */}
            <div className="h-44 sm:h-64 lg:h-72 w-full overflow-hidden bg-gray-900 relative">
                {project.imageUrl ? (
                    <img
                        ref={imageRef}
                        src={project.imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-900/10 text-primary-light">
                        <CodeIcon className="w-16 h-16 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-80" />
                <span className="absolute top-4 left-4 bg-primary/25 border border-primary/40 backdrop-blur-md text-primary-light text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    {project.category}
                </span>
            </div>

            {/* Description / Content Box */}
            <div className="p-6 sm:p-8 flex flex-col flex-1 relative z-10" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white hover:text-primary transition-colors duration-300 leading-tight">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2">
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

                <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed flex-1 line-clamp-3">
                    {project.description}
                </p>

                {/* Sub-services / tags */}
                <div className="flex flex-wrap gap-2.5 mt-auto">
                    {project.services && project.services.map((service: any, idx: number) => {
                        const IconComponent = ICON_OPTIONS[service.iconName as keyof typeof ICON_OPTIONS] || CodeIcon;
                        return (
                            <div key={idx} className="flex items-center gap-1.5 bg-gray-800/40 px-3 py-1 rounded-full border border-gray-700/50">
                                <div className="text-primary text-xs"><IconComponent /></div>
                                <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">{service.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Main Projects Showcase Section ──────────────────────────────
const Work: React.FC = () => {
    const { content } = usePortfolio();
    const [activeFilter, setActiveFilter] = useState('All');
    const [isScrollable, setIsScrollable] = useState(false);

    const categories = ['All', ...Array.from(new Set(content.projectsData.map(p => p.category)))];
    const filteredProjects = activeFilter === 'All'
        ? content.projectsData
        : content.projectsData.filter(p => p.category === activeFilter);

    const triggerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkScrollable = () => {
            const width = window.innerWidth;
            let cardWidth = 310;
            let gap = 32;
            let padding = 48;

            if (width >= 1024) {
                cardWidth = 600;
                gap = 48;
                padding = 192;
            } else if (width >= 640) {
                cardWidth = 480;
            }

            const totalWidth = filteredProjects.length * cardWidth + Math.max(0, filteredProjects.length - 1) * gap + padding;
            setIsScrollable(totalWidth > width);
        };

        checkScrollable();
        window.addEventListener('resize', checkScrollable);

        const isMobile = window.innerWidth < 1024;
        let cardWidth = 310;
        let gap = 32;
        let padding = 48;

        if (window.innerWidth >= 1024) {
            cardWidth = 600;
            gap = 48;
            padding = 192;
        } else if (window.innerWidth >= 640) {
            cardWidth = 480;
        }

        const totalWidth = filteredProjects.length * cardWidth + Math.max(0, filteredProjects.length - 1) * gap + padding;
        const scrollDistance = totalWidth - window.innerWidth;

        let pin: any;
        if (!isMobile && scrollDistance > 0) {
            pin = gsap.fromTo(scrollRef.current,
                { x: 0 },
                {
                    x: -scrollDistance - 100,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        pin: true,
                        scrub: 1.2,
                        start: 'top top',
                        end: () => `+=${scrollDistance}`,
                        invalidateOnRefresh: true,
                    }
                }
            );
        }

        return () => {
            window.removeEventListener('resize', checkScrollable);
            if (pin) pin.kill();
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === triggerRef.current) t.kill();
            });
        };
    }, [filteredProjects]);

    return (
        <section ref={triggerRef} id="work" className="relative bg-gray-950 text-white scroll-mt-20 overflow-hidden">
            {/* Diagonal Premium Top Divider */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10" style={{ height: '40px' }}>
                <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0 L1440,30 L1440,0 Z" fill="white" className="dark:hidden" />
                    <path d="M0,0 L1440,30 L1440,0 Z" fill="#111827" className="hidden dark:block" />
                </svg>
            </div>

            {/* Ambient Lighting & Particles */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#3a3a4a_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Content Container */}
            <div className="lg:min-h-screen flex flex-col justify-center py-20 lg:py-0">
                {/* Section Header */}
                <div className="container mx-auto px-6 pt-12 lg:pt-0 max-w-7xl relative z-20">
                    <div className={`text-center mb-10 lg:mb-6 ${isScrollable ? 'lg:text-left' : 'lg:text-center'}`}>
                        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Portfolio</span>
                        <h2 className="text-3xl md:text-5xl font-black mt-3 tracking-tight">
                            {content.sectionTitles?.work || "Bringing Ideas to Life"}
                        </h2>
                        <p className={`mt-4 text-base text-gray-400 max-w-xl font-medium ${isScrollable ? 'lg:mx-0' : 'lg:mx-auto'}`}>
                            A curated selection of client projects, community events, and digital creations.
                        </p>
                    </div>

                    {/* Filter categories pills */}
                    <div className={`flex flex-wrap justify-center gap-3 mb-8 ${isScrollable ? 'lg:justify-start' : 'lg:justify-center'}`}>
                        {categories.map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveFilter(category)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                    activeFilter === category
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                                        : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                                data-magnetic
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Horizontal Scroll Track Wrapper */}
                <div className="w-full relative overflow-x-auto lg:overflow-x-hidden py-4 cursor-grab active:cursor-grabbing custom-scrollbar">
                    <div
                        ref={scrollRef}
                        className={`flex flex-row gap-8 lg:gap-12 px-6 lg:px-24 ${
                            isScrollable ? 'w-max justify-start' : 'w-full justify-center'
                        }`}
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))}
                    </div>
                </div>

                {/* Bottom Call-to-action */}
                <div className={`container mx-auto px-6 mt-8 lg:mt-6 text-center relative z-20 max-w-7xl ${isScrollable ? 'lg:text-left' : 'lg:text-center'}`}>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all duration-300"
                        data-magnetic
                    >
                        Start a Project <ArrowRightIcon />
                    </a>
                </div>
            </div>

            {/* Bottom visual divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10" style={{ height: '40px' }}>
                <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,40 L1440,0 L1440,40 Z" fill="white" className="dark:hidden" />
                    <path d="M0,40 L1440,0 L1440,40 Z" fill="#111827" className="hidden dark:block" />
                </svg>
            </div>
        </section>
    );
};

export default Work;