import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRightIcon, DownloadIcon, LinkIcon, LinkedInIcon, BehanceIcon, DribbbleIcon, InstagramIcon, GithubIcon } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
    const { content, t } = usePortfolio();
    const { userName, heroImage, heroRoles, heroSubheading, socialLinks, heroAvailableText, resumeUrl } = content;
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayedRole, setDisplayedRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

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

    // Helper to split text into character elements
    const splitText = (text: string) => {
        return text.split('').map((char, index) => (
            <span key={index} className="char-span inline-block select-none" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                {char}
            </span>
        ));
    };

    return (
        <section ref={heroRef} id="hero" className="min-h-[100dvh] flex items-center pt-28 sm:pt-24 pb-12 relative overflow-hidden bg-slate-50 dark:bg-dark-bg">
            {/* Ambient animated visual backgrounds */}
            <div className="aurora-bg absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="aurora-blob aurora-blob-1" />
                <div className="aurora-blob aurora-blob-2" />
                <div className="aurora-blob aurora-blob-3" />
                <div className="aurora-blob aurora-blob-4" />
                <div className="aurora-noise" />
            </div>

            <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between relative z-10">
                {/* Text contents */}
                <div className="lg:w-1/2 text-center lg:text-left mt-12 lg:mt-0 hero-text-content">
                    <span className="hero-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-semibold mb-4 hover:scale-105 transition-transform" data-magnetic>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        {heroAvailableText || t.hero.availableForHire}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mt-2 leading-[1.1] tracking-tight">
                        {splitText("Hello, I'm")} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary animate-gradient-x select-text">
                            {splitText(userName)}
                        </span>
                    </h1>

                    <div className="hero-fade-in mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 h-8 font-medium">
                        I'm a{" "}
                        <span className="font-bold text-primary">{displayedRole}</span>
                        <span className="border-r-2 border-primary animate-blink">|</span>
                    </div>

                    <p className="hero-fade-in mt-6 text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        {heroSubheading}
                    </p>

                    <div className="hero-fade-in mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <a
                            href="#contact"
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                            data-magnetic
                        >
                            {t.hero.getInTouch} <ArrowRightIcon />
                        </a>
                        <a
                            href={resumeUrl || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 ${!resumeUrl ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
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
                </div>

                {/* Interactive avatar ring */}
                <div className="lg:w-1/2 flex justify-center parallax-avatar">
                    <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96">
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-25 blur-3xl scale-110 animate-pulse-slow" />
                        {/* Rotating border ring */}
                        <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-primary via-purple-400 to-secondary animate-spin-slow">
                            <div className="bg-white dark:bg-dark-bg rounded-full h-full w-full" />
                        </div>
                        {/* Image element */}
                        <div className="absolute inset-[3.5px] rounded-full p-2 bg-white dark:bg-dark-bg overflow-hidden shadow-inner">
                            <img
                                src={heroImage}
                                alt={userName}
                                className="rounded-full object-cover object-top w-full h-full transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Status tag */}
                        <div className="absolute -bottom-3 -right-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform duration-300 pointer-events-auto" data-magnetic>
                            <span className="text-base animate-bounce">✨</span> Open to Work
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex flex-col items-center gap-2 opacity-60">
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 dark:text-gray-500">Scroll Down</span>
                <div className="w-5 h-9 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-1.5">
                    <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
                </div>
            </div>
        </section>
    );
};

export default Hero;