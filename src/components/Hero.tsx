import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRightIcon, DownloadIcon, LinkIcon, LinkedInIcon, BehanceIcon, DribbbleIcon, InstagramIcon, GithubIcon } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
    const { content, t } = usePortfolio();
    const { userName, heroImage, heroRoles, heroSubheading, socialLinks, heroAvailableText, resumeUrl } = content;
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayedRole, setDisplayedRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    // Mobile lanyard coordinates & path (shortened to 90px)
    const mCardX = useMotionValue(0);
    const mCardY = useMotionValue(0);
    const mPathD = useTransform([mCardX, mCardY], ([cx, cy]) => {
        const x = Number(cx);
        const y = Number(cy);
        const sx = 150;
        const sy = 0;
        const ex = 150 + x;
        const ey = 90 + y;
        
        const cpx = sx + (ex - sx) * 0.15;
        const cpy = sy + (ey - sy) * 0.5;
        
        return `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
    });
    const mClipX = useTransform(mCardX, x => 150 + Number(x));
    const mClipY = useTransform(mCardY, y => 90 + Number(y));

    // Desktop lanyard coordinates & path (standard 140px)
    const dCardX = useMotionValue(0);
    const dCardY = useMotionValue(0);
    const dPathD = useTransform([dCardX, dCardY], ([cx, cy]) => {
        const x = Number(cx);
        const y = Number(cy);
        const sx = 150;
        const sy = 0;
        const ex = 150 + x;
        const ey = 140 + y;
        
        const cpx = sx + (ex - sx) * 0.15;
        const cpy = sy + (ey - sy) * 0.5;
        
        return `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
    });
    const dClipX = useTransform(dCardX, x => 150 + Number(x));
    const dClipY = useTransform(dCardY, y => 140 + Number(y));

    // Typing animation for roles
    useEffect(() => {
        const handleTyping = () => {
            const fullRole = heroRoles[currentRoleIndex];
            if (isDeleting) {
                setDisplayedRole(fullRole.substring(0, displayedRole.length - 1));
            } else {
                setDisplayedRole(fullRole.substring(0, displayedRole.length + 1));
            }
            if (!isDeleting && displayedRole === fullRole) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayedRole === "") {
                setIsDeleting(false);
                setCurrentRoleIndex((prev) => (prev + 1) % heroRoles.length);
            }
        };
        const typingTimeout = setTimeout(handleTyping, isDeleting ? 70 : 120);
        return () => clearTimeout(typingTimeout);
    }, [displayedRole, isDeleting, currentRoleIndex, heroRoles]);

    // GSAP Entrance and Parallax scroll-exit animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split character reveal for name and greetings
            gsap.fromTo('.char-span', 
                { opacity: 0, y: 35, rotateX: -20 },
                { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out', delay: 0.1 }
            );

            // Animate other text blocks (Subheadings, buttons)
            gsap.fromTo('.hero-fade-in',
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
            );

            // Parallax mouse movements for background blobs and avatar
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (!isTouch) {
                const handleMouseMove = (e: MouseEvent) => {
                    const { clientX, clientY } = e;
                    const xPercent = (clientX / window.innerWidth - 0.5) * 2;
                    const yPercent = (clientY / window.innerHeight - 0.5) * 2;

                    gsap.to('.parallax-avatar', {
                        x: xPercent * 20,
                        y: yPercent * 20,
                        duration: 0.6,
                        ease: 'power2.out'
                    });

                    gsap.to('.aurora-blob-1', { x: xPercent * -30, y: yPercent * -30, duration: 0.8, ease: 'power2.out' });
                    gsap.to('.aurora-blob-2', { x: xPercent * 25, y: yPercent * 25, duration: 0.8, ease: 'power2.out' });
                };
                window.addEventListener('mousemove', handleMouseMove);
                return () => window.removeEventListener('mousemove', handleMouseMove);
            }
        }, heroRef);

        // Scroll exit timelines
        const tlExit = gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });

        tlExit.to('.hero-text-content', {
            y: 120,
            opacity: 0,
            ease: 'none'
        }, 0);

        tlExit.to('.parallax-avatar', {
            y: -50,
            scale: 0.92,
            opacity: 0.3,
            ease: 'none'
        }, 0);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === '#hero') t.kill();
            });
        };
    }, []);

    const renderCard = (
        cardX: MotionValue<number>,
        cardY: MotionValue<number>,
        pathD: MotionValue<string>,
        clipX: MotionValue<number>,
        clipY: MotionValue<number>,
        isMobileCard: boolean
    ) => {
        return (
            <div className="relative w-[300px] h-full overflow-visible mx-auto">
                {/* Lanyard SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                    {/* Glow path */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#00df8f"
                        strokeWidth="3"
                        strokeOpacity="0.3"
                        className="blur-[2px]"
                    />
                    {/* Core path */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="url(#lanyard-gradient)"
                        strokeWidth="1.5"
                    />
                    <defs>
                        <linearGradient id="lanyard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00df8f" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#00b373" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                    {/* Clip ring */}
                    <motion.circle
                        cx={clipX}
                        cy={clipY}
                        r="5.5"
                        fill="#14181f"
                        stroke="#00df8f"
                        strokeWidth="2.5"
                    />
                    <motion.rect
                        x={useTransform(clipX, cx => Number(cx) - 4)}
                        y={useTransform(clipY, cy => Number(cy))}
                        width="8"
                        height="10"
                        rx="2"
                        fill="#14181f"
                        stroke="#00df8f"
                        strokeWidth="1.5"
                    />
                </svg>

                {/* Draggable Card */}
                <motion.div
                    drag
                    dragElastic={0.2}
                    dragMomentum={false}
                    dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
                    dragConstraints={isMobileCard ? { left: -60, right: 60, top: -40, bottom: 80 } : { left: -120, right: 120, top: -80, bottom: 150 }}
                    style={{ x: cardX, y: cardY }}
                    whileDrag={{ cursor: "grabbing" }}
                    className={
                        isMobileCard
                            ? "absolute top-[90px] left-1/2 -ml-[105px] w-[210px] h-[310px] z-20 cursor-grab active:cursor-grabbing"
                            : "absolute top-[140px] left-1/2 -ml-[135px] w-[270px] h-[390px] z-20 cursor-grab active:cursor-grabbing"
                    }
                >
                    <motion.div
                        animate={{ 
                            y: [0, -8, 0],
                            rotate: [-1.2, 1.2, -1.2]
                        }}
                        transition={{ 
                            y: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: 6.5, ease: "easeInOut" }
                        }}
                        whileHover={{ scale: 1.03 }}
                        className={`w-full h-full bg-[#14181f]/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative flex flex-col items-center justify-between ${isMobileCard ? 'p-4' : 'p-5'}`}
                    >
                        {/* Card glow accent */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#00df8f]/10 to-transparent pointer-events-none opacity-50" />
                        
                        {/* Slot/Hole for clip */}
                        <div className={`bg-[#0d1116] border border-white/10 rounded-full z-10 ${isMobileCard ? 'w-6 h-1.5' : 'w-8 h-2'}`} />

                        {/* Header */}
                        <div className="w-full flex justify-between items-center text-[9px] font-bold text-gray-400 font-space tracking-widest mt-2 z-10">
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                ACCESS SECURED
                            </div>
                            <span>ID: #2026</span>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/5 my-2 z-10" />

                        {/* Rectangular photo frame */}
                        <div className={`relative rounded-xl md:rounded-2xl p-[1.5px] bg-gradient-to-br from-primary to-secondary z-10 shadow-lg shadow-primary/10 ${isMobileCard ? 'w-28 h-32' : 'w-36 h-40'}`}>
                            <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden bg-[#14181f] p-[2px]">
                                <img
                                    src={heroImage}
                                    alt={userName}
                                    className="rounded-xl object-cover object-top w-full h-full pointer-events-none"
                                    draggable="false"
                                />
                            </div>
                            {/* Status tag */}
                            <div className="absolute -bottom-1.5 -right-1.5 bg-primary/20 border border-primary/40 backdrop-blur-md rounded-full px-2 py-0.5 shadow-lg flex items-center gap-1 text-[8px] font-bold text-primary select-none">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-455 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                ACTIVE
                            </div>
                        </div>

                        {/* User details */}
                        <div className={`text-center z-10 ${isMobileCard ? 'my-2' : 'my-3'}`}>
                            <h3 className={`font-black tracking-tight text-white font-space ${isMobileCard ? 'text-base' : 'text-lg'}`}>
                                {userName}
                            </h3>
                            <p className={`font-bold text-primary uppercase tracking-widest mt-1 font-space ${isMobileCard ? 'text-[9px]' : 'text-[10px]'}`}>
                                {displayedRole || "DEVELOPER"}
                            </p>
                        </div>

                        {/* Barcode representing Scan key */}
                        <div className={`w-full flex flex-col items-center z-10 mb-2 ${isMobileCard ? 'gap-1' : 'gap-1.5'}`}>
                            {/* Barcode lines */}
                            <div className={`w-full flex items-center justify-center gap-px opacity-70 bg-white/5 p-1 rounded ${isMobileCard ? 'h-5' : 'h-6'}`}>
                                {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 3, 2, 1, 4].map((w, idx) => (
                                    <div 
                                        key={idx} 
                                        className="h-full bg-white" 
                                        style={{ width: `${w}px` }} 
                                    />
                                ))}
                            </div>
                            <span className={`font-bold text-gray-500 tracking-[0.25em] font-space uppercase ${isMobileCard ? 'text-[6px]' : 'text-[7px]'}`}>
                                * DEV-ACCESS-AUTHENTICATED *
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    };

    return (
        <section ref={heroRef} id="hero" className="min-h-[100dvh] flex items-center pt-28 sm:pt-24 pb-12 relative overflow-hidden bg-slate-50 dark:bg-dark-bg grid-bg font-sans">
            {/* Ambient animated visual backgrounds */}
            <div className="aurora-bg absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="aurora-blob aurora-blob-1" />
                <div className="aurora-blob aurora-blob-2" />
                <div className="aurora-blob aurora-blob-3" />
                <div className="aurora-blob aurora-blob-4" />
                <div className="aurora-noise" />
            </div>

            {/* Giant Background Outline Typography Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden translate-x-20 translate-y-16">
                <span className="text-[12vw] sm:text-[18vw] font-black tracking-tighter text-gray-950/[0.02] dark:text-white/[0.02] uppercase font-space select-none blur-[3px]" style={{ WebkitTextStroke: '1.5px currentColor' }}>
                    SA
                </span>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div 
                    className="absolute bottom-1/4 right-20 w-16 h-16 rounded-xl border border-secondary/20 bg-secondary/5 hidden md:block"
                    animate={{ y: [0, 25, 0], rotate: [0, -360], scale: [1, 0.9, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute top-1/3 right-1/3 w-8 h-8 rounded-lg border border-primary/20 bg-primary/5 hidden lg:block"
                    animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between relative z-10">
                {/* Text contents */}
                <div className="lg:w-1/2 text-center lg:text-left mt-0 hero-text-content">
                    <span className="hero-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4 shadow-[0_0_15px_rgba(0,223,143,0.1)] hover:scale-105 transition-transform" data-magnetic>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        {heroAvailableText || t.hero.availableForHire}
                    </span>

                    <p className="hero-fade-in text-gray-400 dark:text-gray-500 font-bold tracking-widest text-sm font-space uppercase mb-1 z-10 relative">
                        Hello, I'm
                    </p>
                    <h1 className="hero-fade-in text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mt-1 mb-2 leading-none tracking-tight font-space z-10 relative">
                        {userName}
                    </h1>

                    <div className="hero-fade-in mt-4 text-xl md:text-2xl text-primary font-bold h-8 font-space tracking-wider uppercase z-10 relative">
                        <span>{displayedRole}</span>
                        <span className="border-r-2 border-primary animate-blink ml-1">|</span>
                    </div>

                    <p className="hero-fade-in mt-6 text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed z-10 relative">
                        {heroSubheading}
                    </p>

                    {/* MOBILE ONLY: ID CARD CONTAINER (centered, smaller, positioned after description and before CTAs) */}
                    <div className="flex lg:hidden justify-center relative w-full h-[400px] select-none overflow-visible mt-8 mb-6 parallax-avatar z-10">
                        {renderCard(mCardX, mCardY, mPathD, mClipX, mClipY, true)}
                    </div>

                    {/* CTA buttons */}
                    <div className="hero-fade-in mt-0 md:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <a
                            href="#contact"
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 font-space"
                            data-magnetic
                        >
                            {t.hero.getInTouch} <ArrowRightIcon />
                        </a>
                        <a
                            href={resumeUrl || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white/70 dark:bg-[#14181f]/70 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-space ${!resumeUrl ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            data-magnetic
                        >
                            <DownloadIcon /> {t.hero.downloadResume}
                        </a>
                    </div>

                    {/* Social profiles */}
                    <div className="hero-fade-in mt-10 flex justify-center lg:justify-start space-x-5 text-gray-500 dark:text-gray-400">
                        {[
                            { href: socialLinks?.website, icon: <LinkIcon /> },
                            { href: socialLinks?.linkedin, icon: <LinkedInIcon /> },
                            { href: socialLinks?.github, icon: <GithubIcon /> },
                            { href: socialLinks?.behance, icon: <BehanceIcon /> },
                            { href: socialLinks?.dribbble, icon: <DribbbleIcon /> },
                            { href: socialLinks?.instagram, icon: <InstagramIcon /> },
                        ].map((social, index) =>
                            social.href && social.href !== '#' && social.href !== '' ? (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="p-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:text-primary dark:hover:text-primary-light hover:border-primary/50 transition-all duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-magnetic
                                >
                                    {social.icon}
                                </a>
                            ) : null
                        )}
                    </div>

                    {/* Tablet-Only Inline Scroll Indicator (768px - 1024px) */}
                    <div className="hidden md:flex lg:hidden flex-col items-center gap-2 opacity-60 mt-14 pb-8 z-10">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 dark:text-gray-500">Scroll Down</span>
                        <div className="w-5 h-9 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-1.5">
                            <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* DESKTOP ONLY: Hanging ID Card Container */}
                <div className="hidden lg:flex lg:w-1/2 justify-center relative w-full h-[600px] select-none overflow-visible pt-0 parallax-avatar z-10">
                    {renderCard(dCardX, dCardY, dPathD, dClipX, dClipY, false)}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex md:hidden lg:flex flex-col items-center gap-2 opacity-60">
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 dark:text-gray-500">Scroll Down</span>
                <div className="w-5 h-9 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-1.5">
                    <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
                </div>
            </div>
        </section>
    );
};

export default Hero;