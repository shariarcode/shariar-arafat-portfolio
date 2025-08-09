
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import EditorPanel from './components/EditorPanel';
import ChatBubble from './components/ChatBubble';
import Chatbot from './components/Chatbot';
import { ArrowUpIcon } from './components/Icons';
import type { PortfolioData, Skill, Project, ProjectService } from './types';
import { DEFAULT_PORTFOLIO_DATA } from './constants';
import { supabase } from './lib/supabaseClient';

const mergeContentData = (saved: any, defaults: PortfolioData): PortfolioData => {
    // Start with defaults, spread saved on top for top-level properties
    const merged = { ...defaults, ...saved };

    // Deep merge nested objects to prevent them from being wiped out if not in saved data
    merged.contactInfo = { ...defaults.contactInfo, ...(saved.contactInfo || {}) };
    merged.socialLinks = { ...defaults.socialLinks, ...(saved.socialLinks || {}) };

    // Handle simple arrays, ensuring they are arrays of strings.
    merged.heroRoles = (Array.isArray(saved.heroRoles) && saved.heroRoles.every((r: any) => typeof r === 'string'))
        ? saved.heroRoles
        : defaults.heroRoles;

    // Robustly merge arrays of objects, filtering invalid items and restoring non-serializable data (icons)
    if (Array.isArray(saved.expertiseAreas)) {
        merged.expertiseAreas = saved.expertiseAreas
            .filter(item => item && typeof item === 'object' && 'name' in item) // Ensure item is a valid object
            .map((savedArea) => {
                const defaultArea = defaults.expertiseAreas[0] || { name: '', description: '' };
                return { ...defaultArea, ...savedArea };
            });
    } else {
        merged.expertiseAreas = defaults.expertiseAreas;
    }

    if (Array.isArray(saved.skillsData)) {
        merged.skillsData = saved.skillsData
            .filter(item => item && typeof item === 'object' && 'name' in item)
            .map((savedSkill, index) => {
                const defaultSkill = defaults.skillsData[index] || defaults.skillsData[0];
                if (!defaultSkill) return null;
                return { ...defaultSkill, ...savedSkill, icon: defaultSkill.icon };
            }).filter((s): s is Skill => s !== null); // Filter out any nulls
    } else {
        merged.skillsData = defaults.skillsData;
    }

    if (Array.isArray(saved.projectsData)) {
        merged.projectsData = saved.projectsData
            .filter(item => item && typeof item === 'object' && 'title' in item)
            .map((savedProject, index) => {
                const defaultProject = defaults.projectsData[index] || defaults.projectsData[0];
                if (!defaultProject) return null;

                let mergedServices = defaultProject.services || [];
                if (Array.isArray(savedProject.services)) {
                    mergedServices = savedProject.services
                        .filter(s => s && typeof s === 'object' && 'name' in s)
                        .map((savedService, serviceIndex) => {
                            const defaultService = (defaultProject.services || [])[serviceIndex] || (defaultProject.services || [])[0];
                            if (!defaultService) return null;
                            return { ...defaultService, ...savedService, icon: defaultService.icon };
                        }).filter((s): s is ProjectService => s !== null);
                }

                return { ...defaultProject, ...savedProject, services: mergedServices };
            }).filter((p): p is Project => p !== null);
    } else {
        merged.projectsData = defaults.projectsData;
    }
    
    return merged as PortfolioData;
};


const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [content, setContent] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);

    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                // Assuming content is stored in a table 'portfolio' with a single row where id=1
                const { data, error } = await supabase
                    .from('portfolio')
                    .select('data')
                    .eq('id', 1)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok on first run
                    console.error('Error fetching content:', error.message);
                }

                if (data && data.data) {
                    const savedContent = data.data;
                    setContent(mergeContentData(savedContent, DEFAULT_PORTFOLIO_DATA));
                } else {
                     console.warn("No portfolio data found in Supabase. Using default content. Save in the editor to create the first record.");
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

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleAdminClick = () => {
        if (isAdmin) {
            setShowEditor(true);
        } else {
            setShowLogin(true);
        }
    };

    const handleLogin = (password: string) => {
        if (password === '@shariararafatportfoliowebsite2006') {
            setIsAdmin(true);
            setShowLogin(false);
            setShowEditor(true);
        } else {
            alert('Incorrect password.');
        }
    };

    const handleSaveChanges = async (savedData: PortfolioData) => {
        setLoading(true);
        try {
            const serializableContent = JSON.parse(JSON.stringify(savedData));
            
            const { error } = await supabase
                .from('portfolio')
                .upsert({ id: 1, data: serializableContent } as any);

            if (error) {
                throw error;
            }

            const fullContent = mergeContentData(serializableContent, DEFAULT_PORTFOLIO_DATA);
            setContent(fullContent);
            alert('Changes saved successfully!');
        } catch (error: any) {
            console.error("Failed to save changes to Supabase:", error);
            alert(`Failed to save changes: ${error.message}`);
        } finally {
            setShowEditor(false);
            setLoading(false);
        }
    };
    
    if (loading && !showEditor) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg text-gray-900 dark:text-white">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Loading Portfolio...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-dark-bg transition-colors duration-300 font-sans relative overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-50 dark:opacity-100"></div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-dark-bg bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} userName={content.userName} />
            <main className="relative z-10">
                <Hero content={content} />
                <Expertise content={content} />
                <Skills content={content} />
                <Work content={content} />
                <Contact content={content} />
            </main>
            <Footer content={content} onAdminClick={handleAdminClick} />
            
            {showScrollTop && !isChatOpen && (
                 <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50">
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

export default App;
