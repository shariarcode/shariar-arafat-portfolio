import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ICON_OPTIONS } from '../constants';
import { CodeIcon } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Glassmorphism Skill Card with 3D Tilt & Glow ──────────────────
const SkillCard: React.FC<{ skill: any }> = ({ skill }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const IconComponent = skill.iconName ? ICON_OPTIONS[skill.iconName as keyof typeof ICON_OPTIONS] : null;
    const renderIcon = IconComponent ? <IconComponent /> : skill.icon || <CodeIcon />;

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables for tracking hover radial light coordinates
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Compute 3D rotation values
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`,
            boxShadow: `${-rotateY * 1.5}px ${rotateX * 1.5}px 35px rgba(111, 66, 193, 0.18)`,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="glow-card group relative overflow-hidden rounded-2xl p-6 bg-white/70 dark:bg-dark-card/75 border border-gray-200/50 dark:border-gray-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] cursor-pointer"
            style={{ 
                transformStyle: 'preserve-3d',
                willChange: 'transform'
            }}
        >
            {/* Glow accent border */}
            <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/35 via-transparent to-secondary/25 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div className="w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/10 text-primary p-3 rounded-xl border border-primary/10 group-hover:scale-110 transition-transform duration-500" data-magnetic>
                            {renderIcon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{skill.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{skill.description}</p>
                </div>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 relative z-10" style={{ transform: 'translateZ(10px)' }}>
                {skill.technologies.map((tech: string) => (
                    <span
                        key={tech}
                        className="bg-gray-150/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200/40 dark:border-gray-700/50 hover:border-primary/50 hover:text-primary dark:hover:text-primary-light transition-all"
                        data-magnetic
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Dynamic proficiency bar */}
            <div className="mt-6 relative z-10" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Proficiency</span>
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        {skill.proficiency || 85}%
                    </span>
                </div>
                <div className="w-full bg-gray-200/80 dark:bg-gray-700/60 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 85}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                        className="bg-gradient-to-r from-primary via-purple-500 to-secondary h-full rounded-full relative"
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md shadow-primary/50" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ─── SVG Radar Chart ─────────────────────────────────────────────
const RadarChart: React.FC<{ skills: any[] }> = ({ skills }) => {
    const ref = useRef<SVGSVGElement>(null);
    const inView = useInView(ref, { once: true });
    const displaySkills = skills.slice(0, 6);
    const size = 240;
    const cx = size / 2;
    const cy = size / 2;
    const R = 100;
    const levels = 5;
    const n = displaySkills.length;

    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pt = (i: number, r: number) => ({
        x: cx + r * Math.cos(angle(i)),
        y: cy + r * Math.sin(angle(i)),
    });

    const levelPaths = Array.from({ length: levels }, (_, level) => {
        const r = (R * (level + 1)) / levels;
        return Array.from({ length: n }, (_, i) => pt(i, r))
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
            .join(' ') + ' Z';
    });

    const dataPath = displaySkills
        .map((sk, i) => {
            const r = R * ((sk.proficiency || 80) / 100);
            const p = pt(i, r);
            return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
        })
        .join(' ') + ' Z';

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-dark-card/40 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/80 shadow-xl max-w-md mx-auto">
            <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background grid levels */}
                {levelPaths.map((path, i) => (
                    <path
                        key={i}
                        d={path}
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-800"
                        strokeWidth="1"
                    />
                ))}
                {/* Axis lines */}
                {displaySkills.map((_, i) => {
                    const p = pt(i, R);
                    return (
                        <line
                            key={i}
                            x1={cx} y1={cy} x2={p.x} y2={p.y}
                            className="stroke-gray-200 dark:stroke-gray-800"
                            strokeWidth="1"
                        />
                    );
                })}
                {/* Data area */}
                <motion.path
                    d={dataPath}
                    fill="url(#radarFill)"
                    stroke="url(#radarStroke)"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                {/* Data points */}
                {displaySkills.map((sk, i) => {
                    const r = R * ((sk.proficiency || 80) / 100);
                    const p = pt(i, r);
                    return (
                        <motion.circle
                            key={i}
                            cx={p.x} cy={p.y} r={4}
                            fill="#6F42C1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + i * 0.07, duration: 0.3 }}
                        />
                    );
                })}
                {/* Labels */}
                {displaySkills.map((sk, i) => {
                    const p = pt(i, R + 22);
                    return (
                        <text
                            key={i}
                            x={p.x} y={p.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-600 dark:fill-gray-400 text-[10px] font-bold"
                            style={{ fontSize: '10px', fontWeight: 700 }}
                        >
                            {sk.name.length > 10 ? sk.name.slice(0, 9) + '…' : sk.name}
                        </text>
                    );
                })}
                <defs>
                    <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6F42C1" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#F87171" stopOpacity={0.15} />
                    </linearGradient>
                    <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6F42C1" />
                        <stop offset="100%" stopColor="#F87171" />
                    </linearGradient>
                </defs>
            </svg>
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-505">Top {displaySkills.length} skills visualized</p>
        </div>
    );
};

// ─── Main Skills Section ──────────────────────────────────────────
const Skills: React.FC = () => {
    const { content } = usePortfolio();
    const [view, setView] = useState<'cards' | 'radar'>('cards');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.skills-reveal-header',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.skills-reveal-header',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="skills" className="py-24 scroll-mt-20 relative overflow-hidden bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="skills-reveal-header text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {content.sectionTitles?.skills || "Technical Skills"}
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
                        A detailed lookup of technologies in my active toolbelt.
                    </p>
                </div>

                {/* View toggle button */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center bg-gray-150 dark:bg-dark-card rounded-xl p-1 gap-1 border border-gray-200/50 dark:border-gray-800/80 shadow-inner">
                        {(['cards', 'radar'] as const).map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    view === v
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                                data-magnetic
                            >
                                {v === 'cards' ? '🃏 Cards View' : '📡 Radar View'}
                            </button>
                        ))}
                    </div>
                </div>

                {view === 'cards' ? (
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {content.skillsData.map((skill, index) => (
                            <SkillCard key={index} skill={skill} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
                        <RadarChart skills={content.skillsData} />
                        <div className="flex flex-col gap-4 max-w-xs w-full">
                            {content.skillsData.slice(0, 6).map((sk, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-sm font-bold text-gray-850 dark:text-gray-250">{sk.name}</span>
                                            <span className="text-xs font-bold text-primary">{sk.proficiency || 80}%</span>
                                        </div>
                                        <div className="w-full bg-gray-250 dark:bg-gray-750 rounded-full h-1.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${sk.proficiency || 80}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: i * 0.08 }}
                                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;