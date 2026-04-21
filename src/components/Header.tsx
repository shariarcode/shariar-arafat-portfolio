import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from './Icons';
import type { PortfolioData } from '../types';

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    content: PortfolioData;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void; className?: string }> = ({ href, children, onClick, className = '' }) => (
    <a href={href} onClick={onClick} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200 ${className}`}>
        {children}
    </a>
);

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, content }) => {
    const { userName, navLinks, resumeUrl } = content;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const visibleNavLinks = [
        { id: "home", label: "Home", visible: true },
        { id: "about", label: "About", visible: navLinks?.about !== false },
        { id: "skills", label: "Skills", visible: navLinks?.skills !== false },
        { id: "work", label: "Work", visible: navLinks?.work !== false },
        { id: "blog", label: "Blog", visible: navLinks?.blog !== false },
        { id: "contact", label: "Contact", visible: navLinks?.contact !== false }
    ].filter(item => item.visible);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-dark-bg bg-opacity-80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <a href="#home" className="text-xl font-bold text-gray-900 dark:text-white">
                            {userName.split(' ').map(n => n[0]).join('')}
                        </a>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            {visibleNavLinks.map(link => (
                                <NavLink key={link.id} href={`#${link.id}`}>{link.label}</NavLink>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {resumeUrl ? (
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block px-4 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-300">
                                    Resume
                                </a>
                            ) : null}
                            <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {darkMode ? <SunIcon className="h-5 w-5"/> : <MoonIcon className="h-5 w-5"/>}
                            </button>
                            <button onClick={handleMenuToggle} className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay — outside <header> so it truly covers page content */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-[200] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
            />

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-dark-card shadow-2xl z-[201] transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="font-bold text-gray-800 dark:text-white">Menu</h2>
                    <button onClick={closeMenu} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex flex-col p-6 space-y-6">
                    {visibleNavLinks.map(link => (
                        <NavLink key={link.id} href={`#${link.id}`} onClick={closeMenu} className="text-lg font-medium">
                            {link.label}
                        </NavLink>
                    ))}
                    {resumeUrl && (
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="w-full mt-4 text-center px-4 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors duration-300">
                            Resume
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
