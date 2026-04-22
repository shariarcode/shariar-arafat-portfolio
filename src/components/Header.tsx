import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from './Icons';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void; className?: string }> = ({ href, children, onClick, className = '' }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const check = () => {
            const id = href.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                setActive(rect.top <= 80 && rect.bottom >= 80);
            }
        };
        window.addEventListener('scroll', check, { passive: true });
        check();
        return () => window.removeEventListener('scroll', check);
    }, [href]);

    return (
        <a
            href={href}
            onClick={onClick}
            className={`relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200 font-medium text-sm group ${className}`}
        >
            {children}
            {/* Gradient underline indicator */}
            <span
                className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
            />
        </a>
    );
};

const Header: React.FC = () => {
    const { content, darkMode, setDarkMode, language, setLanguage, t } = usePortfolio();
    const { userName, navLinks, resumeUrl } = content;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleLanguage = () => setLanguage(language === 'en' ? 'bn' : 'en');

    const visibleNavLinks = [
        { id: "home", label: t.nav.home, visible: true },
        { id: "about", label: t.nav.about, visible: navLinks?.about !== false },
        { id: "skills", label: t.nav.skills, visible: navLinks?.skills !== false },
        { id: "pricing", label: "Pricing", visible: true },
        { id: "work", label: t.nav.work, visible: navLinks?.work !== false },
        { id: "blog", label: t.nav.blog, visible: navLinks?.blog !== false },
        { id: "contact", label: t.nav.contact, visible: navLinks?.contact !== false }
    ].filter(item => item.visible);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const initials = userName.split(' ').map(n => n[0]).join('');

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50'
                    : 'bg-transparent'
            }`}>
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        {/* Logo — gradient text */}
                        <a href="#home" className="text-xl font-extrabold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {initials}
                            </span>
                        </a>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            {visibleNavLinks.map(link => (
                                <NavLink key={link.id} href={`#${link.id}`}>{link.label}</NavLink>
                            ))}
                        </div>

                        <div className="flex items-center space-x-3">
                            {resumeUrl ? (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md shadow-primary/20"
                                >
                                    Resume
                                </a>
                            ) : null}
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 backdrop-blur-sm transition-colors font-semibold text-xs"
                                title={language === 'en' ? 'বাংলা' : 'English'}
                            >
                                {language === 'en' ? 'BN' : 'EN'}
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 backdrop-blur-sm transition-colors"
                            >
                                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={handleMenuToggle}
                                className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors"
                            >
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
            />

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-[201] transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full bg-white/90 dark:bg-dark-card/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50 flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{initials}</span>
                        <button onClick={closeMenu} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="flex flex-col p-6 space-y-5 flex-1">
                        {visibleNavLinks.map(link => (
                            <NavLink key={link.id} href={`#${link.id}`} onClick={closeMenu} className="text-base font-semibold">
                                {link.label}
                            </NavLink>
                        ))}
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMenu}
                                className="mt-4 text-center px-4 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-300"
                            >
                                Resume
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
