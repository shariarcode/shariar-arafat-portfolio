import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './Icons';
import { usePortfolio } from '../context/PortfolioContext';
import SearchButton from './SearchButton';
import LanguageSwitcher from './LanguageSwitcher';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void; className?: string }> = ({ href, children, onClick, className = '' }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const check = () => {
            const id = href.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                setActive(rect.top <= 100 && rect.bottom >= 100);
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
            className={`relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 font-medium text-sm group py-1 ${className}`}
        >
            {children}
            <span
                className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
            />
        </a>
    );
};

const Header: React.FC = () => {
    const { content, darkMode, setDarkMode, t } = usePortfolio();
    const { userName, resumeUrl } = content;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreDropdownRef = useRef<HTMLDivElement>(null);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const visibleNavLinks = [
        ...(content.sections || [])
            .filter(section => section.visible && section.id !== 'hero' && section.id !== 'stats' && section.id !== 'expertise' && section.id !== 'analytics')
            .map(section => ({
                id: section.id,
                label: section.navLabel,
                path: `/#${section.id}`
            })),
        ...(content.customPages || [])
            .filter(page => page.visible && page.showInNav)
            .map(page => ({
                id: page.id,
                label: page.navLabel,
                path: `/p/${page.slug}`
            }))
    ];

    const mainLinksLimit = 6;
    const mainLinks = visibleNavLinks.slice(0, mainLinksLimit);
    const moreLinks = visibleNavLinks.slice(mainLinksLimit);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/70 dark:bg-dark-bg/70 backdrop-blur-md py-3 border-b border-gray-200/30 dark:border-gray-800/30 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)]'
                    : 'bg-transparent py-5'
            }`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <nav className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-0 mr-8">
                            <a href="#hero" className="text-2xl font-black tracking-tighter group transition-transform active:scale-95 block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-secondary group-hover:opacity-80 transition-opacity">
                                    {initials}
                                </span>
                            </a>
                        </div>

                        {/* Desktop nav */}
                        <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8 flex-1 justify-center">
                            {mainLinks.map(link => (
                                <NavLink key={link.id} href={link.path}>{link.label}</NavLink>
                            ))}
                            
                            {moreLinks.length > 0 && (
                                <div className="relative" ref={moreDropdownRef}>
                                    <button 
                                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isMoreOpen ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}
                                    >
                                        More <ChevronDownIcon className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isMoreOpen && (
                                        <div className="absolute top-full right-0 mt-4 w-48 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in py-2">
                                            {moreLinks.map(link => (
                                                <a 
                                                    key={link.id} 
                                                    href={link.path}
                                                    onClick={() => setIsMoreOpen(false)}
                                                    className="block px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
                                                >
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-x-2 sm:gap-x-4">
                            <div className="hidden sm:flex items-center gap-2">
                                <SearchButton />
                                <LanguageSwitcher />
                            </div>
                            
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:inline-flex items-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary via-purple-600 to-secondary hover:shadow-[0_0_20px_rgba(111,66,193,0.4)] transition-all active:scale-95"
                                >
                                    {t.nav.resume}
                                </a>
                            )}

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:rotate-12"
                                    aria-label="Toggle theme"
                                >
                                    {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={handleMenuToggle}
                                    className="lg:hidden p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-500 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
            />

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs z-[201] transform transition-transform duration-500 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full bg-white dark:bg-dark-bg shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                        <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{initials}</span>
                        <button onClick={closeMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex flex-col p-6 space-y-2 flex-1 overflow-y-auto">
                        {visibleNavLinks.map(link => (
                            <NavLink key={link.id} href={link.path} onClick={closeMenu} className="text-lg py-3 block w-full border-b border-gray-50 dark:border-gray-800/50">
                                {link.label}
                            </NavLink>
                        ))}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <SearchButton />
                            <LanguageSwitcher />
                        </div>
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMenu}
                                className="mt-8 text-center px-6 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20 transition-transform active:scale-95"
                            >
                                {t.nav.resume}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
