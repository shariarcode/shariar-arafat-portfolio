
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Work from './components/Work';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Blog from './components/Blog';
import BlogPostPage from './components/BlogPostPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import NotFound from './components/NotFound';
import AdminLogin from './components/AdminLogin';
import EditorPanel from './components/EditorPanel';
import ChatBubble from './components/ChatBubble';
import Chatbot from './components/Chatbot';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import GithubActivity from './components/GithubActivity';
import CustomCursor from './components/CustomCursor';
import CursorAnalysisOverlay from './components/CursorAnalysisOverlay';
import Resume from './components/Resume';
import Guestbook from './components/Guestbook';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CookieConsent from './components/CookieConsent';
import { ArrowUpIcon } from './components/Icons';
import { motion } from 'framer-motion';
import type { PortfolioData } from './types';
import { removeJsonLd, setSeoMeta } from './lib/seo';
import { usePortfolio } from './context/PortfolioContext';
import { ToastProvider, useToast } from './components/Toast';

const AppInner: React.FC = () => {
    const { showToast } = useToast();
    const { 
        content, 
        loading, 
        isAdmin, 
        setIsAdmin, 
        saveContent 
    } = usePortfolio();
    
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const currentPath = window.location.pathname;
    const isBlogRoute = currentPath.startsWith('/blog/');
    const isProjectRoute = currentPath.startsWith('/project/');
    const routeSlug = isBlogRoute || isProjectRoute ? currentPath.split('/').pop()?.replace(/\/+$/, '') : '';

    useEffect(() => {
        const canonicalUrl = `${window.location.origin}${currentPath}`;
        if (currentPath === '/') {
            setSeoMeta({
                title: `${content.userName} | Portfolio`,
                description: content.heroSubheading,
                canonicalUrl,
                imageUrl: `${window.location.origin}/og-image.jpg`,
            });
            removeJsonLd('blog-post');
        } else if (!isBlogRoute) {
            setSeoMeta({
                title: `404 | ${content.userName}`,
                description: 'The page you requested does not exist.',
                canonicalUrl,
            });
            removeJsonLd('blog-post');
        }
    }, [content.heroSubheading, content.userName, currentPath, isBlogRoute]);

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScrollTop && window.pageYOffset > 400) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 400) {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScrollTop]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleAdminClick = () => {
        if (isAdmin) setShowEditor(true);
        else setShowLogin(true);
    };

    const handleLogin = (password: string) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowLogin(false);
            setShowEditor(true);
            showToast('Welcome back, Admin!', 'success');
        } else {
            showToast('Incorrect password. Please try again.', 'error');
        }
    };

    const handleSaveChanges = async (savedData: PortfolioData) => {
        const success = await saveContent(savedData);
        if (success) {
            showToast('Changes saved successfully! 🎉', 'success');
            setShowEditor(false);
        } else {
            showToast('Failed to save changes.', 'error');
        }
    };
    
    if (loading && !showEditor) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-dark-bg text-gray-900 dark:text-white">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                    <motion.span 
                        animate={{ opacity: [0.5, 1, 0.5] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                    >
                        Loading Experience...
                    </motion.span>
                </motion.div>
            </div>
        );
    }

    if (isBlogRoute) {
        const post = (content.blogPosts || []).find(p => p.slug === routeSlug);
        return post ? <BlogPostPage post={post} /> : <NotFound />;
    }

    if (isProjectRoute) {
        return <ProjectDetailPage />;
    }

    if (currentPath !== '/') {
        return <NotFound />;
    }

return (
        <div className="bg-slate-50 dark:bg-dark-bg transition-colors duration-300 font-sans relative overflow-x-hidden">
            <CustomCursor />
            <CursorAnalysisOverlay />
            <Header />
            <main className="relative z-10">
                <Hero />
                <Stats />
                <About />
                <Expertise />
                <Services />
                <Timeline />
                <Skills />
                <Resume />
                <Pricing />
                <GithubActivity />
                <Work />
                <Blog />
                <Testimonials />
                <Guestbook />
                <Contact />
                <AnalyticsDashboard />
            </main>
            <Footer onAdminClick={handleAdminClick} />
            <CookieConsent />
            
            {showScrollTop && !isChatOpen && (
                 <button onClick={scrollToTop} className="fixed bottom-[max(2rem,env(safe-area-inset-bottom))] right-8 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <ArrowUpIcon />
                 </button>
            )}

            {!isChatOpen && <ChatBubble onOpen={() => setIsChatOpen(true)} />}
            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}

            {showLogin && <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
            {isAdmin && showEditor && <EditorPanel data={content} onSave={handleSaveChanges} onClose={() => setShowEditor(false)} />}
        </div>
    );
};

const App: React.FC = () => (
    <ToastProvider>
        <AppInner />
    </ToastProvider>
);

export default App;
