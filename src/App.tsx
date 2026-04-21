
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Blog from './components/Blog';
import BlogPostPage from './components/BlogPostPage';
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
import { ArrowUpIcon } from './components/Icons';
import { motion } from 'framer-motion';
import type { PortfolioData, Skill, Project, ProjectService, Testimonial, TimelineEvent } from './types';
import { DEFAULT_PORTFOLIO_DATA } from './constants';
import { supabase } from './lib/supabaseClient';
import { removeJsonLd, setSeoMeta } from './lib/seo';
import { ToastProvider, useToast } from './components/Toast';

const mergeProjectServices = (savedServices: any[], defaultServices: ProjectService[]): ProjectService[] => {
    const dServices = defaultServices || [];
    return savedServices
        .filter(s => s && typeof s === 'object' && 'name' in s)
        .map((savedService, serviceIndex) => {
            const defaultService = dServices.find(ds => ds.name === savedService.name) || dServices[serviceIndex] || dServices[0];
            if (!defaultService) return null;
            return { 
                name: savedService.name || defaultService.name, 
                icon: defaultService.icon,
                iconName: savedService.iconName || defaultService.iconName
            };
        }).filter((s): s is ProjectService => s !== null);
}

const mergeContentData = (saved: Partial<PortfolioData>, defaults: PortfolioData): PortfolioData => {
    const s = saved || {};
    const merged: PortfolioData = {
        userName: s.userName || defaults.userName,
        userEmail: s.userEmail || defaults.userEmail,
        userLocation: s.userLocation || defaults.userLocation,
        heroImage: s.heroImage || defaults.heroImage,
        heroSubheading: s.heroSubheading || defaults.heroSubheading,
        heroAvailableText: s.heroAvailableText !== undefined ? s.heroAvailableText : defaults.heroAvailableText,
        resumeUrl: s.resumeUrl !== undefined ? s.resumeUrl : defaults.resumeUrl,
        sectionTitles: { ...defaults.sectionTitles, ...(s.sectionTitles || {}) },
        navLinks: { ...defaults.navLinks, ...(s.navLinks || {}) },
        careerObjective: s.careerObjective || defaults.careerObjective,
        contactInfo: { ...defaults.contactInfo, ...(s.contactInfo || {}) },
        socialLinks: { ...defaults.socialLinks, ...(s.socialLinks || {}) },
        footerContent: {
            description: s.footerContent?.description || defaults.footerContent?.description,
            services: Array.isArray(s.footerContent?.services) ? s.footerContent?.services : defaults.footerContent?.services
        },
        heroRoles: Array.isArray(s.heroRoles) && s.heroRoles.every(r => typeof r === 'string') 
            ? s.heroRoles 
            : defaults.heroRoles,
        expertiseAreas: Array.isArray(s.expertiseAreas)
            ? s.expertiseAreas
                .filter(area => area && typeof area === 'object' && area.name)
                .map(area => ({
                    name: area.name,
                    description: area.description || ''
                }))
            : defaults.expertiseAreas,
        skillsData: Array.isArray(s.skillsData)
            ? s.skillsData
                .filter(skill => skill && typeof skill === 'object' && skill.name)
                .map((savedSkill, index) => {
                    const defaultSkill = defaults.skillsData.find(ds => ds.name === savedSkill.name) || defaults.skillsData[index] || defaults.skillsData[0];
                    if (!defaultSkill) return null;
                    return {
                        name: savedSkill.name || defaultSkill.name,
                        icon: defaultSkill.icon,
                        iconName: savedSkill.iconName || defaultSkill.iconName,
                        description: savedSkill.description || defaultSkill.description,
                        technologies: savedSkill.technologies || defaultSkill.technologies,
                        proficiency: savedSkill.proficiency !== undefined ? savedSkill.proficiency : defaultSkill.proficiency || 85,
                    };
                }).filter((skill): skill is Skill => skill !== null)
            : defaults.skillsData,
        projectsData: Array.isArray(s.projectsData)
            ? s.projectsData
                .filter(project => project && typeof project === 'object' && project.title)
                .map((savedProject, index) => {
                    const defaultProject = defaults.projectsData.find(dp => dp.title === savedProject.title) || defaults.projectsData[index] || defaults.projectsData[0];
                    if (!defaultProject) return null;
                    const mergedServices = Array.isArray(savedProject.services)
                        ? mergeProjectServices(savedProject.services, defaultProject.services)
                        : defaultProject.services;
                    return {
                        title: savedProject.title || defaultProject.title,
                        category: savedProject.category || defaultProject.category,
                        description: savedProject.description || defaultProject.description,
                        services: mergedServices,
                        imageUrl: savedProject.imageUrl !== undefined ? savedProject.imageUrl : defaultProject.imageUrl,
                        liveUrl: savedProject.liveUrl !== undefined ? savedProject.liveUrl : defaultProject.liveUrl
                    };
                }).filter((p): p is Project => p !== null)
            : defaults.projectsData,
        testimonials: Array.isArray(s.testimonials)
            ? s.testimonials
                .filter(testimonial => testimonial && typeof testimonial === 'object')
                .map((savedTestimonial, index) => {
                    const defaultTestimonial = defaults.testimonials?.[index] || defaults.testimonials?.[0];
                    return {
                        name: savedTestimonial.name || defaultTestimonial?.name || 'Client Name',
                        role: savedTestimonial.role || defaultTestimonial?.role || 'Role',
                        company: savedTestimonial.company || defaultTestimonial?.company || 'Company',
                        image: savedTestimonial.image || defaultTestimonial?.image || 'https://i.pravatar.cc/150?img=1',
                        content: savedTestimonial.content || defaultTestimonial?.content || '',
                        rating: Math.min(5, Math.max(1, Number(savedTestimonial.rating || defaultTestimonial?.rating || 5))),
                    };
                }).filter((testimonial): testimonial is Testimonial => Boolean(testimonial.content))
            : defaults.testimonials,
        timeline: Array.isArray(s.timeline)
            ? s.timeline
                .filter(event => event && typeof event === 'object')
                .map((savedEvent, index) => {
                    const defaultEvent = defaults.timeline?.[index] || defaults.timeline?.[0];
                    return {
                        year: savedEvent.year || defaultEvent?.year || 'Year',
                        title: savedEvent.title || defaultEvent?.title || 'Milestone',
                        description: savedEvent.description || defaultEvent?.description || '',
                    };
                }).filter((event): event is TimelineEvent => Boolean(event.description))
            : defaults.timeline,
        blogPosts: Array.isArray(s.blogPosts)
            ? s.blogPosts
                .filter(post => post && typeof post === 'object')
                .map((savedPost, index) => {
                    const defaultPost = defaults.blogPosts?.[index] || defaults.blogPosts?.[0];
                    return {
                        slug: savedPost.slug || defaultPost?.slug || 'post-slug',
                        title: savedPost.title || defaultPost?.title || 'Blog Title',
                        excerpt: savedPost.excerpt || defaultPost?.excerpt || '',
                        content: Array.isArray(savedPost.content) ? savedPost.content : (defaultPost?.content || []),
                        date: savedPost.date || defaultPost?.date || new Date().toISOString().slice(0, 10),
                        readTime: savedPost.readTime || defaultPost?.readTime || '5 min read',
                        url: savedPost.url !== undefined ? savedPost.url : (defaultPost?.url || `/blog/${savedPost.slug || defaultPost?.slug || 'post-slug'}`)
                    };
                }).filter(post => Boolean(post.title && post.excerpt))
            : defaults.blogPosts,
    };
    return merged;
};

const AppInner: React.FC = () => {
    const { showToast } = useToast();
    const [darkMode, setDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const currentPath = window.location.pathname;
    const isBlogRoute = currentPath.startsWith('/blog/');
    const routeSlug = isBlogRoute ? currentPath.replace('/blog/', '').replace(/\/+$/, '') : '';

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('content')
                    .eq('id', 'portfolio')
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching portfolio from Supabase:", error);
                } else if (data && data.content) {
                    const savedContent = data.content as Partial<PortfolioData>;
                    setContent(mergeContentData(savedContent, DEFAULT_PORTFOLIO_DATA));
                } else {
                     console.warn("No portfolio data found in Supabase. Using default content.");
                }
            } catch (err) {
                console.error("An unexpected error occurred while fetching content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

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

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleAdminClick = () => {
        if (isAdmin) setShowEditor(true);
        else setShowLogin(true);
    };

    const handleLogin = (password: string) => {
        if (password === (import.meta as any).env.VITE_ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowLogin(false);
            setShowEditor(true);
            showToast('Welcome back, Admin!', 'success');
        } else {
            showToast('Incorrect password. Please try again.', 'error');
        }
    };

    const handleSaveChanges = async (savedData: PortfolioData) => {
        setLoading(true);
        try {
            const serializableContent = JSON.parse(JSON.stringify(savedData));
            
            const { error } = await supabase
                .from('settings')
                .upsert({ id: 'portfolio', content: serializableContent });

            if (error) throw error;

            const fullContent = mergeContentData(serializableContent, DEFAULT_PORTFOLIO_DATA);
            setContent(fullContent);
            showToast('Changes saved successfully! 🎉', 'success');
        } catch (error: any) {
            console.error("Failed to save changes:", error);
            showToast(`Failed to save: ${error.message}`, 'error');
        } finally {
            setShowEditor(false);
            setLoading(false);
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

    if (currentPath !== '/') {
        return <NotFound />;
    }

    return (
        <div className="bg-slate-50 dark:bg-dark-bg transition-colors duration-300 font-sans relative overflow-x-hidden">
            <CustomCursor />
            <CursorAnalysisOverlay />
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} content={content} />
            <main className="relative z-10">
                <Hero content={content} />
                <Stats />
                <Expertise content={content} />
                <Skills content={content} />
                <GithubActivity content={content} />
                <Work content={content} />
                <Blog content={content} />
                <Testimonials content={content} />
                <Contact content={content} />
            </main>
            <Footer content={content} onAdminClick={handleAdminClick} />
            
            {showScrollTop && !isChatOpen && (
                 <button onClick={scrollToTop} className="fixed bottom-[max(2rem,env(safe-area-inset-bottom))] right-8 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <ArrowUpIcon />
                </button>
            )}

            {!isChatOpen && <ChatBubble onOpen={() => setIsChatOpen(true)} />}
            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} portfolioData={content} />}

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
