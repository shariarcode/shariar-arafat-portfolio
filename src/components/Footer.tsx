import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { LinkedInIcon, GithubIcon, BehanceIcon, InstagramIcon, LinkIcon, DribbbleIcon } from './Icons';

// Wave divider — points upward into footer
const WaveTop: React.FC = () => (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
            <path
                className="text-slate-50 dark:text-dark-bg"
                d="M0,60 C360,0 1080,60 1440,10 L1440,0 L0,0 Z"
                style={{ fill: 'currentColor' }}
            />
        </svg>
    </div>
);

const Footer: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
    const { content } = usePortfolio();
    const { userName, contactInfo, socialLinks, footerContent } = content;
    const footerDescription = footerContent?.description || "A multidisciplinary professional specializing in Web Development and Design.";
    const services = footerContent?.services?.length ? footerContent.services : ["Web Development", "Graphic Design", "Consulting"];

    const socials = [
        { href: socialLinks.website, icon: <LinkIcon /> },
        { href: socialLinks.linkedin, icon: <LinkedInIcon /> },
        { href: socialLinks.github, icon: <GithubIcon /> },
        { href: socialLinks.behance, icon: <BehanceIcon /> },
        { href: socialLinks.dribbble, icon: <DribbbleIcon /> },
        { href: socialLinks.instagram, icon: <InstagramIcon /> },
    ].filter(s => s.href && s.href !== '#' && s.href !== '');

    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 relative pt-20 pb-12 overflow-hidden">
            <WaveTop />

            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(111,66,193,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(111,66,193,0.12),rgba(255,255,255,0))] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                            {userName}'s Portfolio
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            {footerDescription}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3">
                            {["Home", "About", "Skills", "Work", "Blog", "Contact"].map(link => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors text-sm flex items-center gap-2 justify-center md:justify-start group"
                                    >
                                        <span className="w-0 h-0.5 bg-primary group-hover:w-3 transition-all duration-300 rounded-full" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 justify-center md:justify-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary shrink-0" />
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-5 text-sm uppercase tracking-wider">Connect</h4>
                        <div className="flex justify-center md:justify-start gap-3 mb-5">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 border border-transparent hover:border-primary/20"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <p>{contactInfo.email}</p>
                            <p>{contactInfo.location}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold">{userName}</span>. All rights reserved.</p>
                    <button
                        onClick={onAdminClick}
                        className="text-xs text-gray-400 hover:text-primary dark:hover:text-primary-light underline bg-transparent border-none cursor-pointer transition-colors"
                    >
                        Admin
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;