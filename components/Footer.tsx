import React from 'react';
import type { PortfolioData } from '../types';
import { LinkedInIcon, GithubIcon, BehanceIcon, InstagramIcon, LinkIcon, DribbbleIcon } from './Icons';

interface FooterProps {
    content: PortfolioData;
    onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ content, onAdminClick }) => {
    const { userName, contactInfo, socialLinks } = content;
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 relative py-12">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))] opacity-50 dark:opacity-100"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
                    {/* About */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold text-primary mb-4">{userName}'s Portfolio</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            A multidisciplinary professional specializing in Web Development and Design.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {["Home", "About", "Skills", "Work", "Contact"].map(link => (
                                <li key={link}><a href={`#${link.toLowerCase()}`} className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li><span className="text-gray-500 dark:text-gray-400">Web Development</span></li>
                            <li><span className="text-gray-500 dark:text-gray-400">Graphic Design</span></li>
                            <li><span className="text-gray-500 dark:text-gray-400">Consulting</span></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Connect</h4>
                        <div className="flex justify-center md:justify-start space-x-4 mb-4 text-gray-600 dark:text-gray-300">
                             <a href={socialLinks.website} className="hover:text-primary dark:hover:text-primary-light transition-colors"><LinkIcon/></a>
                             <a href={socialLinks.linkedin} className="hover:text-primary dark:hover:text-primary-light transition-colors"><LinkedInIcon/></a>
                             <a href={socialLinks.github} className="hover:text-primary dark:hover:text-primary-light transition-colors"><GithubIcon/></a>
                             <a href={socialLinks.behance} className="hover:text-primary dark:hover:text-primary-light transition-colors"><BehanceIcon/></a>
                             <a href={socialLinks.dribbble} className="hover:text-primary dark:hover:text-primary-light transition-colors"><DribbbleIcon/></a>
                             <a href={socialLinks.instagram} className="hover:text-primary dark:hover:text-primary-light transition-colors"><InstagramIcon/></a>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email: {contactInfo.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location: {contactInfo.location}</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {userName}. All rights reserved.
                        <button onClick={onAdminClick} className="ml-4 text-gray-500 hover:text-primary dark:hover:text-primary-light underline bg-transparent border-none cursor-pointer">
                            Admin
                        </button>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
