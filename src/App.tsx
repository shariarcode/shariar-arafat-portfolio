
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
import CommandPalette from './components/CommandPalette';
import ReadingProgressBar from './components/ReadingProgressBar';
import NewsletterModal from './components/NewsletterModal';
import Skeleton from './components/Skeleton';
import CookieConsent from './components/CookieConsent';
import { ArrowUpIcon } from './components/Icons';
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
    const [showNewsletter, setShowNewsletter] = useState(false);
    
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
        const checkScroll = () => {
            // Scroll to top button logic
            if (!showScrollTop && window.pageYOffset > 400) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 400) {
                setShowScrollTop(false);
            }

            // Newsletter trigger logic (70% scroll)
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercentage > 0.7 && !localStorage.getItem('newsletter_dismissed') && !localStorage.getItem('newsletter_subscribed')) {
                setShowNewsletter(true);
            }
        };

        // Newsletter trigger logic (15s timer)
        const timer = setTimeout(() => {
            if (!localStorage.getItem('newsletter_dismissed') && !localStorage.getItem('newsletter_subscribed')) {
                setShowNewsletter(true);
            }
        }, 15000);

        window.addEventListener('scroll', checkScroll);
        return () => {
            window.removeEventListener('scroll', checkScroll);
            clearTimeout(timer);
        };
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
            <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
                <div className="container mx-auto px-6 py-8 animate-pulse">
                    <Skeleton className="h-16 w-full mb-8 rounded-xl" />
                    <Skeleton className="h-[60vh] w-full mb-12 rounded-3xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                    <Skeleton className="h-96 w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    let mainContent;
    if (isBlogRoute) {
        const post = (content.blogPosts || []).find((p: any) => p.slug === routeSlug);
        mainContent = post ? <BlogPostPage post={post} /> : <NotFound />;
    } else if (isProjectRoute) {
        mainContent = <ProjectDetailPage />;
    } else if (currentPath !== '/') {
        mainContent = <NotFound />;
    } else {
        mainContent = (
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
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-dark-bg transition-colors duration-300 font-sans relative overflow-x-hidden">
            <ReadingProgressBar />
            <CommandPalette />
            <CustomCursor />
            <CursorAnalysisOverlay />
            <Header />
            
            {mainContent}

            <Footer onAdminClick={handleAdminClick} />
            <CookieConsent />
            
            {showScrollTop && !isChatOpen && (
                 <button onClick={scrollToTop} className="fixed bottom-[max(2rem,env(safe-area-inset-bottom))] right-8 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <ArrowUpIcon />
                 </button>
            )}

            {!isChatOpen && <ChatBubble onOpen={() => setIsChatOpen(true)} />}
            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}

            <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />

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
