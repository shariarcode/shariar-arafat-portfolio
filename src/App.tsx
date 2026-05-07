
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Services from './components/Services';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ReadingProgressBar from './components/ReadingProgressBar';
import Skeleton from './components/Skeleton';
import CookieConsent from './components/CookieConsent';
import SEO from './components/SEO';
import InstallPWA from './components/InstallPWA';

// Lazy load non-critical / below-the-fold components
const Timeline = lazy(() => import('./components/Timeline'));
const Skills = lazy(() => import('./components/Skills'));
const Work = lazy(() => import('./components/Work'));
const Pricing = lazy(() => import('./components/Pricing'));
const Contact = lazy(() => import('./components/Contact'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage'));
const Education = lazy(() => import('./components/Education'));
const Process = lazy(() => import('./components/Process'));
const FAQ = lazy(() => import('./components/FAQ'));
const Resources = lazy(() => import('./components/Resources'));
const NotFound = lazy(() => import('./components/NotFound'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const EditorPanel = lazy(() => import('./components/EditorPanel'));
const ChatBubble = lazy(() => import('./components/ChatBubble'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const Stats = lazy(() => import('./components/Stats'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const GithubActivity = lazy(() => import('./components/GithubActivity'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const CursorAnalysisOverlay = lazy(() => import('./components/CursorAnalysisOverlay'));
const Resume = lazy(() => import('./components/Resume'));
const Guestbook = lazy(() => import('./components/Guestbook'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const NewsletterModal = lazy(() => import('./components/NewsletterModal'));
const CustomPageRenderer = lazy(() => import('./components/CustomPageRenderer'));
import { ArrowUpIcon } from './components/Icons';
import type { PortfolioData } from './types';
import { removeJsonLd, setSeoMeta, setJsonLd } from './lib/seo';
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
    
    const location = useLocation();
    const currentPath = location.pathname;
    const isBlogRoute = currentPath.startsWith('/blog/');
    const isProjectRoute = currentPath.startsWith('/project/');
    const isCustomPageRoute = currentPath.startsWith('/p/');
    const routeSlug = isBlogRoute || isProjectRoute || isCustomPageRoute ? currentPath.split('/').pop()?.replace(/\/+$/, '') : '';

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
            
            // Add Person Schema
            const personSchema = {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": content.userName,
                "url": canonicalUrl,
                "jobTitle": content.heroHeading?.replace("Hi, I'm ", "").split(" - ")[0] || "Professional",
                "sameAs": content.socialLinks ? Object.values(content.socialLinks).filter(Boolean) : []
            };
            setJsonLd('person-schema', personSchema);
        } else if (isCustomPageRoute) {
            const page = (content.customPages || []).find(p => p.slug === routeSlug);
            if (page) {
                setSeoMeta({
                    title: `${page.title} | ${content.userName}`,
                    description: page.title,
                    canonicalUrl,
                });
            }
        } else if (!isBlogRoute) {
            setSeoMeta({
                title: `404 | ${content.userName}`,
                description: 'The page you requested does not exist.',
                canonicalUrl,
            });
            removeJsonLd('blog-post');
        }
    }, [content.heroSubheading, content.userName, currentPath, isBlogRoute, isCustomPageRoute, routeSlug, content.customPages]);

    useEffect(() => {
        const checkScroll = () => {
            if (!showScrollTop && window.pageYOffset > 400) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 400) {
                setShowScrollTop(false);
            }

            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercentage > 0.7 && !localStorage.getItem('newsletter_dismissed') && !localStorage.getItem('newsletter_subscribed')) {
                setShowNewsletter(true);
            }
        };

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

    const handleLogin = (password: string, trustDevice: boolean) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            setIsAdmin(true, trustDevice);
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

    const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
        hero: Hero,
        stats: Stats,
        about: About,
        expertise: Expertise,
        services: Services,
        timeline: Timeline,
        skills: Skills,
        resume: Resume,
        pricing: Pricing,
        github: GithubActivity,
        work: Work,
        blog: Blog,
        testimonials: Testimonials,
        guestbook: Guestbook,
        contact: Contact,
        analytics: AnalyticsDashboard,
        education: Education,
        process: Process,
        faq: FAQ,
        resources: Resources,
    };

    let mainContent;
    if (isBlogRoute) {
        const post = (content.blogPosts || []).find((p: any) => p.slug === routeSlug);
        mainContent = post ? <BlogPostPage post={post} /> : <NotFound />;
    } else if (isProjectRoute) {
        mainContent = <ProjectDetailPage />;
    } else if (isCustomPageRoute) {
        const page = (content.customPages || []).find(p => p.slug === routeSlug);
        mainContent = page ? <CustomPageRenderer page={page} /> : <NotFound />;
    } else if (currentPath !== '/') {
        mainContent = <NotFound />;
    } else {
        mainContent = (
            <main className="relative z-10">
                {(content.sections || []).map(section => {
                    const Component = SECTION_COMPONENTS[section.id];
                    if (!Component || !section.visible) return null;
                    return <Component key={section.id} />;
                })}
            </main>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-dark-bg transition-colors duration-300 font-sans relative overflow-x-hidden">
            <SEO />
            <ReadingProgressBar />
            <CommandPalette />
            <Suspense fallback={null}>
                <CustomCursor />
                <CursorAnalysisOverlay />
            </Suspense>
            <Header />
            
            <Suspense fallback={
                <div className="container mx-auto px-6 py-8 animate-pulse mt-20">
                    <Skeleton className="h-[40vh] w-full rounded-3xl" />
                </div>
            }>
                {mainContent}
            </Suspense>

            <Footer onAdminClick={handleAdminClick} />
            <CookieConsent />
            <InstallPWA />
            
            {showScrollTop && !isChatOpen && (
                 <button onClick={scrollToTop} className="fixed bottom-[max(2rem,env(safe-area-inset-bottom))] right-8 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <ArrowUpIcon />
                 </button>
            )}

            <Suspense fallback={null}>
                {!isChatOpen && <ChatBubble onOpen={() => setIsChatOpen(true)} />}
                {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
                <NewsletterModal isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
                {showLogin && <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
                {isAdmin && showEditor && <EditorPanel data={content} onSave={handleSaveChanges} onClose={() => setShowEditor(false)} />}
            </Suspense>
        </div>
    );
};

const App: React.FC = () => (
    <ToastProvider>
        <AppInner />
    </ToastProvider>
);

export default App;
