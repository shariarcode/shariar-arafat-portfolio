
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PortfolioData, ProjectService, Skill, Project, Testimonial, TimelineEvent } from '../types';
import { DEFAULT_PORTFOLIO_DATA } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { Language, translations, Translations } from '../translations';

interface PortfolioContextType {
    content: PortfolioData;
    loading: boolean;
    isAdmin: boolean;
    darkMode: boolean;
    language: Language;
    setDarkMode: (dark: boolean) => void;
    setIsAdmin: (admin: boolean, persist?: boolean) => void;
    setContent: (data: PortfolioData) => void;
    setLanguage: (lang: Language) => void;
    t: Translations;
    refreshContent: () => Promise<void>;
    saveContent: (newData: PortfolioData) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const isValidProjectService = (s: unknown): s is ProjectService => {
    return s !== null && typeof s === 'object' && 'name' in s;
};

const isValidSkill = (s: unknown): s is Skill => {
    return s !== null && typeof s === 'object' && 'name' in s;
};

const isValidProject = (p: unknown): p is Project => {
    return p !== null && typeof p === 'object' && 'title' in p;
};

const mergeProjectServices = (savedServices: any[], defaultServices: ProjectService[]): ProjectService[] => {
    const dServices = defaultServices || [];
    const result = savedServices
        .filter(s => s && typeof s === 'object' && 'name' in s)
        .map((savedService, serviceIndex) => {
            const defaultService = dServices.find(ds => ds.name === savedService.name) || dServices[serviceIndex] || dServices[0];
            if (!defaultService) return null;
            return { 
                name: savedService.name || defaultService.name, 
                icon: defaultService.icon,
                iconName: savedService.iconName || defaultService.iconName
            } as ProjectService;
        }).filter(isValidProjectService);
    return result;
}

const mergeContentData = (saved: Partial<PortfolioData>, defaults: PortfolioData): PortfolioData => {
    const s = saved || {};
    
    // Default sections order and configuration
    const defaultSections = [
        { id: 'hero', navLabel: 'Home', visible: true },
        { id: 'stats', navLabel: 'Stats', visible: true },
        { id: 'about', navLabel: 'About', visible: true },
        { id: 'expertise', navLabel: 'Expertise', visible: true },
        { id: 'services', navLabel: 'Services', visible: true },
        { id: 'timeline', navLabel: 'Timeline', visible: true },
        { id: 'skills', navLabel: 'Skills', visible: true },
        { id: 'resume', navLabel: 'Resume', visible: true },
        { id: 'pricing', navLabel: 'Pricing', visible: true },
        { id: 'github', navLabel: 'GitHub', visible: true },
        { id: 'work', navLabel: 'Work', visible: true },
        { id: 'blog', navLabel: 'Blog', visible: true },
        { id: 'testimonials', navLabel: 'Testimonials', visible: true },
        { id: 'guestbook', navLabel: 'Guestbook', visible: true },
        { id: 'contact', navLabel: 'Contact', visible: true },
        { id: 'analytics', navLabel: 'Analytics', visible: true }
    ];

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
        sections: Array.isArray(s.sections) ? s.sections : defaultSections,
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
            ? (s.skillsData
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
                }).filter(isValidSkill) as Skill[])
            : defaults.skillsData,
        projectsData: Array.isArray(s.projectsData)
            ? (s.projectsData
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
                }).filter(isValidProject) as Project[])
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
        pricingPlans: Array.isArray(s.pricingPlans)
            ? s.pricingPlans
                .filter(plan => plan && typeof plan === 'object' && plan.name)
                .map((savedPlan, index) => {
                    const defaultPlan = defaults.pricingPlans?.[index] || defaults.pricingPlans?.[0];
                    return {
                        name: savedPlan.name || defaultPlan?.name || 'New Plan',
                        description: savedPlan.description || defaultPlan?.description || '',
                        price: savedPlan.price || defaultPlan?.price || '$0',
                        period: savedPlan.period || defaultPlan?.period || 'per project',
                        features: Array.isArray(savedPlan.features) ? savedPlan.features : (defaultPlan?.features || []),
                        isPopular: savedPlan.isPopular !== undefined ? savedPlan.isPopular : defaultPlan?.isPopular,
                        buttonText: savedPlan.buttonText || defaultPlan?.buttonText || 'Get Started'
                    };
                })
            : defaults.pricingPlans,
        bookingUrl: s.bookingUrl !== undefined ? s.bookingUrl : defaults.bookingUrl,
        stats: Array.isArray(s.stats)
            ? s.stats
                .filter(stat => stat && typeof stat === 'object')
                .map((savedStat, index) => {
                    const defaultStat = defaults.stats?.[index];
                    return {
                        endValue: savedStat.endValue !== undefined ? Number(savedStat.endValue) : (defaultStat?.endValue || 0),
                        label: savedStat.label || defaultStat?.label || 'Stat',
                        suffix: savedStat.suffix || defaultStat?.suffix || '+',
                    };
                })
            : defaults.stats,
            showStats: s.githubConfig.showStats !== undefined ? s.githubConfig.showStats : defaults.githubConfig?.showStats,
            showLanguages: s.githubConfig.showLanguages !== undefined ? s.githubConfig.showLanguages : defaults.githubConfig?.showLanguages,
        } : defaults.githubConfig,
        customPages: Array.isArray(s.customPages)
            ? s.customPages.map(page => ({
                id: page.id || Math.random().toString(36).substr(2, 9),
                slug: page.slug || '',
                title: page.title || 'Untitled Page',
                navLabel: page.navLabel || page.title || 'Page',
                showInNav: page.showInNav !== undefined ? page.showInNav : false,
                content: page.content || '',
                layout: page.layout || 'standard',
                theme: page.theme || 'default',
                visible: page.visible !== undefined ? page.visible : true,
            }))
            : [],
    };
    return merged;
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdminState] = useState(() => {
        return localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
    });
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) return saved === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        if (saved === 'en' || saved === 'bn') return saved;
        const browserLang = navigator.language.slice(0, 2);
        return browserLang === 'bn' ? 'bn' : 'en';
    });

    const t = translations[language];

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const setIsAdmin = (admin: boolean, persist: boolean = false) => {
        setIsAdminState(admin);
        if (admin) {
            if (persist) {
                localStorage.setItem('isAdmin', 'true');
                sessionStorage.removeItem('isAdmin');
            } else {
                sessionStorage.setItem('isAdmin', 'true');
                localStorage.removeItem('isAdmin');
            }
        } else {
            localStorage.removeItem('isAdmin');
            sessionStorage.removeItem('isAdmin');
        }
    };

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
            }
        } catch (err) {
            console.error("An unexpected error occurred while fetching content:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async (newData: PortfolioData): Promise<boolean> => {
        try {
            console.log("Saving portfolio content to Supabase...", newData);
            const { error } = await supabase
                .from('settings')
                .upsert({ 
                    id: 'portfolio', 
                    content: newData, 
                    updated_at: new Date().toISOString() 
                });

            if (error) {
                console.error("Supabase upsert error:", error);
                throw error;
            }
            
            setContent(newData);
            return true;
        } catch (err) {
            console.error("Failed to save content:", err);
            return false;
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', String(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);



    return (
        <PortfolioContext.Provider value={{ 
            content, 
            loading, 
            isAdmin, 
            darkMode, 
            language,
            setDarkMode, 
            setIsAdmin, 
            setContent,
            setLanguage,
            t,
            refreshContent: fetchContent,
            saveContent
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};
