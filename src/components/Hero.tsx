import React, { useState, useEffect } from 'react';
import type { PortfolioData } from '../types';
import { ArrowRightIcon, DownloadIcon, LinkIcon, LinkedInIcon, BehanceIcon, DribbbleIcon, InstagramIcon, GithubIcon } from './Icons';
import FadeIn from './FadeIn';

interface HeroProps {
    content: PortfolioData;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
    const { userName, heroImage, heroRoles, heroSubheading, socialLinks, heroAvailableText, resumeUrl } = content;
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayedRole, setDisplayedRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

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
        const typingTimeout = setTimeout(handleTyping, isDeleting ? 100 : 150);
        return () => clearTimeout(typingTimeout);
    }, [displayedRole, isDeleting, currentRoleIndex, heroRoles]);

    return (
        <section id="home" className="min-h-[100dvh] flex items-center pt-28 sm:pt-24 pb-12 relative overflow-hidden">
            {/* Aurora animated background */}
            <div className="aurora-bg" aria-hidden="true">
                <div className="aurora-blob aurora-blob-1" />
                <div className="aurora-blob aurora-blob-2" />
                <div className="aurora-blob aurora-blob-3" />
                <div className="aurora-blob aurora-blob-4" />
                <div className="aurora-noise" />
            </div>

            <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between relative z-10">
                <FadeIn direction="left" className="lg:w-1/2 text-center lg:text-left mt-12 lg:mt-0">
                    {/* Available badge — gradient pill with pulsing dot */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        {heroAvailableText || "Available for hire"}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mt-2">
                        Hello, I'm <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary animate-gradient-x">
                            {userName}
                        </span>
                    </h1>

                    <div className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 h-8">
                        I'm a{" "}
                        <span className="font-semibold text-primary">{displayedRole}</span>
                        <span className="border-r-2 border-primary animate-blink">|</span>
                    </div>

                    <p className="mt-6 text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
                        {heroSubheading}
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <a
                            href="#contact"
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                        >
                            Get in Touch <ArrowRightIcon />
                        </a>
                        <a
                            href={resumeUrl || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 ${!resumeUrl ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        >
                            <DownloadIcon /> Download Resume
                        </a>
                    </div>

                    {/* Social links */}
                    <div className="mt-10 flex justify-center lg:justify-start space-x-5 text-gray-500 dark:text-gray-400">
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
                                    className="p-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:text-primary dark:hover:text-primary-light hover:border-primary/50 hover:scale-110 transition-all duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon}
                                </a>
                            ) : null
                        )}
                    </div>
                </FadeIn>

                <FadeIn direction="right" className="lg:w-1/2 flex justify-center">
                    <div className="relative w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96">
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-30 blur-3xl scale-110 animate-pulse-slow" />
                        {/* Rotating border ring */}
                        <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-primary via-purple-400 to-secondary animate-spin-slow">
                            <div className="bg-white dark:bg-dark-bg rounded-full h-full w-full" />
                        </div>
                        {/* Photo */}
                        <div className="absolute inset-[3px] rounded-full p-2 bg-white dark:bg-dark-bg">
                            <img
                                src={heroImage}
                                alt={userName}
                                className="rounded-full object-cover object-top w-full h-full"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-3 -right-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 animate-float">
                            <span className="text-base">✨</span> Open to Work
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default Hero;