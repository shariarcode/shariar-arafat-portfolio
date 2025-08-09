import React, { useState, useEffect } from 'react';
import type { PortfolioData } from '../types';
import { ArrowRightIcon, DownloadIcon, LinkIcon, LinkedInIcon, BehanceIcon, DribbbleIcon, InstagramIcon, GithubIcon } from './Icons';

interface HeroProps {
    content: PortfolioData;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
    const { userName, heroImage, heroRoles, heroSubheading, socialLinks } = content;
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
        <section id="home" className="min-h-screen flex items-center pt-24 pb-12">
            <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between">
                <div className="lg:w-1/2 text-center lg:text-left mt-12 lg:mt-0">
                    <span className="text-sm font-medium text-primary">Available for hire</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mt-2">
                        Hello, I'm <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{userName}</span>
                    </h1>
                    <div className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 h-8">
                        I'm a <span className="font-semibold text-primary">{displayedRole}</span>
                        <span className="border-r-2 border-primary animate-blink">|</span>
                    </div>
                    <p className="mt-6 text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
                        {heroSubheading}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <a href="#contact" className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-transform transform hover:scale-105 duration-300">
                            Get in Touch <ArrowRightIcon />
                        </a>
                        <a href="#resume" className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform transform hover:scale-105 duration-300">
                            <DownloadIcon /> Download Resume
                        </a>
                    </div>
                    <div className="mt-10 flex justify-center lg:justify-start space-x-6 text-gray-500 dark:text-gray-400">
                        {[
                            { href: socialLinks.website, icon: <LinkIcon /> },
                            { href: socialLinks.linkedin, icon: <LinkedInIcon /> },
                            { href: socialLinks.github, icon: <GithubIcon /> },
                            { href: socialLinks.behance, icon: <BehanceIcon /> },
                            { href: socialLinks.dribbble, icon: <DribbbleIcon /> },
                            { href: socialLinks.instagram, icon: <InstagramIcon /> },
                        ].map((social, index) => (
                            <a key={index} href={social.href} className="hover:text-primary dark:hover:text-primary-light transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                    <div className="relative w-80 h-80 md:w-96 md:h-96">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl"></div>
                        <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-br from-primary to-secondary">
                            <div className="bg-white dark:bg-dark-bg rounded-full h-full w-full p-2">
                                <img src={heroImage} alt={userName} className="rounded-full object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;