import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, MoonIcon, SunIcon, GlobeIcon, LayoutIcon, FileTextIcon, UserIcon, MailIcon, BriefcaseIcon } from './Icons';
import { usePortfolio } from '../context/PortfolioContext';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { content, t, darkMode, setDarkMode, setLanguage } = usePortfolio();
  const inputRef = useRef<HTMLInputElement>(null);

  const sections = [
    { id: 'home', title: t.nav.home, icon: <LayoutIcon className="w-4 h-4" />, action: () => window.location.href = '#home' },
    { id: 'about', title: t.nav.about, icon: <UserIcon className="w-4 h-4" />, action: () => window.location.href = '#about' },
    { id: 'work', title: t.nav.work, icon: <BriefcaseIcon className="w-4 h-4" />, action: () => window.location.href = '#work' },
    { id: 'blog', title: t.nav.blog, icon: <FileTextIcon className="w-4 h-4" />, action: () => window.location.href = '#blog' },
    { id: 'contact', title: t.nav.contact, icon: <MailIcon className="w-4 h-4" />, action: () => window.location.href = '#contact' },
  ];

  const actions = [
    { id: 'theme', title: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />, action: () => setDarkMode(!darkMode) },
    { id: 'lang-en', title: 'Switch to English', icon: <GlobeIcon className="w-4 h-4" />, action: () => setLanguage('en') },
    { id: 'lang-bn', title: 'Switch to Bengali', icon: <GlobeIcon className="w-4 h-4" />, action: () => setLanguage('bn') },
  ];

  const blogPosts = (content.blogPosts || []).map(post => ({
    id: `blog-${post.slug}`,
    title: `Blog: ${post.title}`,
    icon: <FileTextIcon className="w-4 h-4 text-primary" />,
    action: () => window.location.href = `/blog/${post.slug}`
  }));

  const filteredItems = [...sections, ...actions, ...blogPosts].filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }

    if (isOpen) {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          setIsOpen(false);
        }
      }
    }
  }, [isOpen, filteredItems, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-[201] overflow-hidden"
          >
            <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-white placeholder-gray-400"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-1 ml-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-md">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      index === selectedIndex
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`${index === selectedIndex ? 'text-primary' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className="flex-1 text-left font-medium">{item.title}</span>
                    {index === selectedIndex && (
                      <span className="text-xs font-semibold opacity-60">ENTER</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
              <div className="flex gap-4">
                <span>↑↓ Navigate</span>
                <span>⏎ Select</span>
              </div>
              <div>Command Palette</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
