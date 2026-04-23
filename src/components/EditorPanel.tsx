import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { CloseIcon, SparklesIcon, LoadingSpinner } from './Icons';
import { ICON_OPTIONS } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './Toast';

interface EditorPanelProps {
    data: PortfolioData;
    onSave: (newData: PortfolioData) => void;
    onClose: () => void;
}

const AIEnhanceButton: React.FC<{ onClick: () => void, isLoading: boolean, disabled?: boolean }> = ({ onClick, isLoading, disabled }) => (
    <button 
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled || isLoading}
        title="Enhance with AI"
        className="absolute right-2 top-8 sm:top-7 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
    >
        {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
    </button>
);

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, onEnhance?: () => void, isEnhancing?: boolean }> = ({ label, name, value, onChange, placeholder, onEnhance, isEnhancing }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px] ${onEnhance ? 'pr-10' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
    </div>
);

const FormTextarea: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, onEnhance?: () => void, isEnhancing?: boolean }> = ({ label, name, value, onChange, onEnhance, isEnhancing }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            rows={3}
            className={`w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px] ${onEnhance ? 'pr-10' : ''}`}
        />
        {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isEnhancing} disabled={!value.trim()} />}
    </div>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const EditorPanel: React.FC<EditorPanelProps> = ({ data, onSave, onClose }) => {
    // Add default values for new fields if they don't exist in data
    const [formData, setFormData] = useState<any>(() => {
        const serializableData = JSON.parse(JSON.stringify(data));
        serializableData.heroRoles = Array.isArray(data.heroRoles) ? data.heroRoles.join(', ') : '';
        
        // Ensure new objects exist
        if (!serializableData.sectionTitles) serializableData.sectionTitles = { about: "About Me", skills: "Technical Skills", services: "Services", timeline: "My Journey", resume: "Resume", work: "My Projects", pricing: "Pricing Plans", blog: "Latest Posts", testimonials: "What Clients Say", contact: "Get In Touch" };
        if (!serializableData.pricingPlans) serializableData.pricingPlans = [];
        serializableData.pricingPlans = serializableData.pricingPlans.map((plan: any) => ({
            ...plan,
            features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || '')
        }));
        
        if (!serializableData.navLinks) serializableData.navLinks = { about: true, skills: true, services: true, timeline: true, resume: true, work: true, blog: true, guestbook: true, contact: true };
        if (!serializableData.heroAvailableText) serializableData.heroAvailableText = "Available for hire";
        if (!serializableData.resumeUrl) serializableData.resumeUrl = "";
        if (!serializableData.footerContent) serializableData.footerContent = { description: "", services: [] };
        if (!serializableData.bookingUrl) serializableData.bookingUrl = "";
        
        // Transform skills technologies for editing
        serializableData.skillsData = (serializableData.skillsData || []).map((skill: any) => ({
            ...skill,
            technologies: Array.isArray(skill.technologies) ? skill.technologies.join(', ') : ''
        }));
        
        if (!Array.isArray(serializableData.timeline)) serializableData.timeline = [];
        if (!Array.isArray(serializableData.testimonials)) serializableData.testimonials = [];
        if (!Array.isArray(serializableData.blogPosts)) serializableData.blogPosts = [];
        serializableData.blogPosts = serializableData.blogPosts.map((post: any) => ({
            ...post,
            content: Array.isArray(post.content) ? post.content.join('\n\n') : ''
        }));
        serializableData.footerContent.services = Array.isArray(serializableData.footerContent.services) ? serializableData.footerContent.services.join(', ') : '';

        return serializableData;
    });

    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'skills' | 'pricing' | 'work' | 'blog' | 'testimonials' | 'contact' | 'settings' | 'inbox' | 'guestbook'>('home');
    const [inboxMessages, setInboxMessages] = useState<any[]>([]);
    const [loadingInbox, setLoadingInbox] = useState(false);
    const [guestbookMessages, setGuestbookMessages] = useState<any[]>([]);
    const [loadingGuestbook, setLoadingGuestbook] = useState(false);
    const [enhancingFields, setEnhancingFields] = useState<Record<string, boolean>>({});
    const { showToast } = useToast();

    const handleEnhance = async (fieldId: string, currentText: string, setter: (val: string) => void) => {
        if (!currentText.trim() || enhancingFields[fieldId]) return;

        setEnhancingFields(prev => ({ ...prev, [fieldId]: true }));
        try {
            const response = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: currentText })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to enhance text');

            setter(data.enhancedText);
            showToast('Writing enhanced! ✨', 'success');
        } catch (err: any) {
            console.error("Enhance error:", err);
            showToast(err.message || 'AI Enhancement failed', 'error');
        } finally {
            setEnhancingFields(prev => ({ ...prev, [fieldId]: false }));
        }
    };

    React.useEffect(() => {
        if (activeTab === 'inbox') {
            fetchInbox();
        }
        if (activeTab === 'guestbook') {
            fetchGuestbook();
        }
    }, [activeTab]);

    const fetchGuestbook = async () => {
        setLoadingGuestbook(true);
        try {
            const stored = localStorage.getItem('guestbook_entries');
            if (stored) {
                setGuestbookMessages(JSON.parse(stored));
            } else {
                setGuestbookMessages([]);
            }
        } catch (err) {
            console.error("Failed to load guestbook:", err);
        } finally {
            setLoadingGuestbook(false);
        }
    };

    const deleteGuestbookEntry = (index: number) => {
        const updated = guestbookMessages.filter((_, i) => i !== index);
        setGuestbookMessages(updated);
        localStorage.setItem('guestbook_entries', JSON.stringify(updated));
    };

    const fetchInbox = async () => {
        setLoadingInbox(true);
        try {
            const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setInboxMessages(data || []);
        } catch (err) {
            console.error("Failed to load inbox:", err);
        } finally {
            setLoadingInbox(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [parent]: { ...(prev[parent] || {}), [name]: value }
        }));
    };
    
    const handleCheckboxChange = (parent: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [parent]: { ...(prev[parent] || {}), [name]: checked }
        }));
    };

    const handleArrayChange = (arrayName: string, index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const newArray = [...(prev as any)[arrayName]];
            newArray[index] = { ...newArray[index], [name]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleAddItem = (arrayName: string, defaultItem: any) => {
        setFormData((prev: any) => ({ ...prev, [arrayName]: [...(prev as any)[arrayName], defaultItem] }));
    };

    const handleDeleteItem = (arrayName: string, index: number) => {
        setFormData((prev: any) => ({ ...prev, [arrayName]: (prev as any)[arrayName].filter((_: any, i: number) => i !== index) }));
    };

    const handleNestedArrayChange = (arrayName: string, index: number, nestedArrayName: string, nestedIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const newArray = [...(prev as any)[arrayName]];
            const newNestedArray = [...(newArray[index][nestedArrayName] || [])];
            newNestedArray[nestedIndex] = { ...newNestedArray[nestedIndex], [name]: value };
            newArray[index][nestedArrayName] = newNestedArray;
            return { ...prev, [arrayName]: newArray };
        });
    };
    
    const handleAddNestedItem = (arrayName: string, index: number, nestedArrayName: string, defaultItem: any) => {
        setFormData((prev: any) => {
            const newArray = [...(prev as any)[arrayName]];
            const nested = newArray[index][nestedArrayName] || [];
            newArray[index][nestedArrayName] = [...nested, defaultItem];
            return { ...prev, [arrayName]: newArray };
        });
    };
    
    const handleDeleteNestedItem = (arrayName: string, index: number, nestedArrayName: string, nestedIndex: number) => {
        setFormData((prev: any) => {
            const newArray = [...(prev as any)[arrayName]];
            newArray[index][nestedArrayName] = newArray[index][nestedArrayName].filter((_: any, i: number) => i !== nestedIndex);
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleSave = () => {
        // Transform back the string arrays before saving
        const processedData = {
            ...formData,
            heroRoles: typeof formData.heroRoles === 'string' ? formData.heroRoles.split(',').map((s: string) => s.trim()).filter(Boolean) : formData.heroRoles,
            skillsData: formData.skillsData.map((skill: any) => ({
                ...skill,
                technologies: typeof skill.technologies === 'string' 
                    ? skill.technologies.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : skill.technologies
            })),
            footerContent: {
                ...formData.footerContent,
                services: typeof formData.footerContent?.services === 'string'
                    ? formData.footerContent.services.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : formData.footerContent?.services
            },
            pricingPlans: (formData.pricingPlans || []).map((plan: any) => ({
                ...plan,
                features: typeof plan.features === 'string'
                    ? plan.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
                    : plan.features
            })),
            blogPosts: (formData.blogPosts || []).map((post: any) => ({
                ...post,
                content: typeof post.content === 'string'
                    ? post.content.split('\n').map((line: string) => line.trim()).filter(Boolean)
                    : post.content
            })),
            testimonials: (formData.testimonials || []).map((testimonial: any) => ({
                ...testimonial,
                rating: Math.min(5, Math.max(1, Number(testimonial.rating || 5)))
            }))
        };
        onSave(processedData as unknown as PortfolioData);
    };

    const tabs = [
        { id: 'home', label: '🏠 Home' },
        { id: 'about', label: '👤 About' },
        { id: 'skills', label: '🛠️ Skills' },
        { id: 'pricing', label: '💰 Pricing' },
        { id: 'work', label: '💼 Work' },
        { id: 'blog', label: '📝 Blog' },
        { id: 'testimonials', label: '💬 Testimonials' },
        { id: 'contact', label: '📬 Contact' },
        { id: 'inbox', label: '📥 Inbox' },
        { id: 'guestbook', label: '📖 Guestbook' },
        { id: 'settings', label: '⚙️ Settings' }
    ] as const;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-0 sm:p-4 lg:p-8">
            <div className="w-full h-full lg:max-w-6xl bg-dark-bg shadow-2xl z-[100] sm:rounded-2xl flex flex-col overflow-hidden border-0 sm:border border-gray-700">
                {/* Header */}
                <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-700 bg-gray-900">
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate mr-4">Full CMS Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors bg-gray-800 min-w-[44px] min-h-[44px] flex items-center justify-center"><CloseIcon /></button>
                </div>
                
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Sidebar Tabs - Scrollable horizontally on mobile, vertically on desktop */}
                    <div className="flex lg:flex-col lg:w-48 bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-700 p-2 sm:p-4 gap-1 sm:gap-2 overflow-x-auto lg:overflow-y-auto no-scrollbar scroll-smooth">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 sm:py-3 text-sm sm:text-base text-center lg:text-left rounded-lg transition-colors font-medium whitespace-nowrap min-h-[44px] ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-dark-bg text-white">
                        
                        {/* HOME TAB */}
                        {activeTab === 'home' && (
                            <div className="space-y-6 sm:space-y-8 animate-fade-in">
                                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Home Section Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-4">
                                        <FormInput 
                                            label="Full Name" 
                                            name="userName" 
                                            value={formData.userName} 
                                            onChange={handleChange} 
                                            onEnhance={() => handleEnhance('userName', formData.userName, (val) => setFormData((prev: any) => ({ ...prev, userName: val })))}
                                            isEnhancing={enhancingFields['userName']}
                                        />
                                        <FormInput 
                                            label="Roles (comma separated)" 
                                            name="heroRoles" 
                                            value={formData.heroRoles} 
                                            onChange={handleChange} 
                                            onEnhance={() => handleEnhance('heroRoles', formData.heroRoles, (val) => setFormData((prev: any) => ({ ...prev, heroRoles: val })))}
                                            isEnhancing={enhancingFields['heroRoles']}
                                        />
                                        <FormInput 
                                            label="'Available for hire' Text" 
                                            name="heroAvailableText" 
                                            value={formData.heroAvailableText} 
                                            onChange={handleChange} 
                                            onEnhance={() => handleEnhance('heroAvailableText', formData.heroAvailableText, (val) => setFormData((prev: any) => ({ ...prev, heroAvailableText: val })))}
                                            isEnhancing={enhancingFields['heroAvailableText']}
                                        />
                                        <div>
                                            <FormInput 
                                                label="Resume / CV PDF URL" 
                                                name="resumeUrl" 
                                                value={formData.resumeUrl} 
                                                onChange={handleChange} 
                                                placeholder="Paste a direct PDF link here..." 
                                                onEnhance={() => handleEnhance('resumeUrl', formData.resumeUrl, (val) => setFormData((prev: any) => ({ ...prev, resumeUrl: val })))}
                                                isEnhancing={enhancingFields['resumeUrl']}
                                            />
                                            <div className="mt-3 p-3 sm:p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                                <p className="text-xs sm:text-sm text-blue-300 font-semibold mb-2">📄 How to get your PDF link:</p>
                                                <ol className="text-xs sm:text-sm text-blue-400 space-y-2 list-decimal list-inside">
                                                    <li>Upload your CV PDF to <strong>Google Drive</strong></li>
                                                    <li>Right-click → <strong>Share</strong> → <strong>Anyone with the link</strong></li>
                                                    <li>Copy the link, then change <code className="bg-blue-900 px-1 rounded">/view</code> to <code className="bg-blue-900 px-1 rounded">/preview</code></li>
                                                </ol>
                                                <p className="text-xs sm:text-sm text-blue-400 mt-2">Or use any direct <code className="bg-blue-900 px-1 rounded">.pdf</code> URL from any file hosting service.</p>
                                            </div>
                                            {!formData.resumeUrl && (
                                                <p className="text-xs text-yellow-400 mt-1">⚠️ No resume URL set — buttons will not work until you add one.</p>
                                            )}
                                        </div>
                                        <FormTextarea 
                                            label="Subheading" 
                                            name="heroSubheading" 
                                            value={formData.heroSubheading} 
                                            onChange={handleChange} 
                                            onEnhance={() => handleEnhance('heroSubheading', formData.heroSubheading, (val) => setFormData((prev: any) => ({ ...prev, heroSubheading: val })))}
                                            isEnhancing={enhancingFields['heroSubheading']}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image</label>
                                        <div className="flex items-center gap-6 bg-gray-800/80 p-6 rounded-xl border border-gray-600">
                                            <div className="shrink-0 relative">
                                                <img src={formData.heroImage} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-primary/50 shadow-lg" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <FormInput 
                                                    label="Direct Image Link" 
                                                    name="heroImage" 
                                                    value={formData.heroImage} 
                                                    onChange={handleChange} 
                                                    placeholder="e.g. /profile.png or valid URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABOUT TAB */}
                        {activeTab === 'about' && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-2xl font-bold text-primary mb-6">About Me Section</h3>
                                <FormTextarea 
                                    label="Career Objective" 
                                    name="careerObjective" 
                                    value={formData.careerObjective} 
                                    onChange={handleChange} 
                                    onEnhance={() => handleEnhance('careerObjective', formData.careerObjective, (val) => setFormData((prev: any) => ({ ...prev, careerObjective: val })))}
                                    isEnhancing={enhancingFields['careerObjective']}
                                />
                                
                                <div className="space-y-4 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xl font-bold text-gray-200">Expertise Areas</h4>
                                        <button onClick={() => handleAddItem('expertiseAreas', { name: "New Expertise", description: "" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Expertise</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {formData.expertiseAreas.map((area: any, index: number) => (
                                            <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                                <FormInput 
                                                    label="Area Name" 
                                                    name="name" 
                                                    value={area.name} 
                                                    onChange={(e) => handleArrayChange('expertiseAreas', index, e)} 
                                                    onEnhance={() => handleEnhance(`expertise-name-${index}`, area.name, (val) => {
                                                        const newAreas = [...formData.expertiseAreas];
                                                        newAreas[index] = { ...newAreas[index], name: val };
                                                        setFormData((prev: any) => ({ ...prev, expertiseAreas: newAreas }));
                                                    })}
                                                    isEnhancing={enhancingFields[`expertise-name-${index}`]}
                                                />
                                                <FormTextarea 
                                                    label="Area Description" 
                                                    name="description" 
                                                    value={area.description || ''} 
                                                    onChange={(e) => handleArrayChange('expertiseAreas', index, e)} 
                                                    onEnhance={() => handleEnhance(`expertise-${index}`, area.description, (val) => {
                                                        const newAreas = [...formData.expertiseAreas];
                                                        newAreas[index] = { ...newAreas[index], description: val };
                                                        setFormData((prev: any) => ({ ...prev, expertiseAreas: newAreas }));
                                                    })}
                                                    isEnhancing={enhancingFields[`expertise-${index}`]}
                                                />
                                                <button onClick={() => handleDeleteItem('expertiseAreas', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xl font-bold text-gray-200">Career Timeline</h4>
                                        <button onClick={() => handleAddItem('timeline', { year: "2026", title: "New Milestone", description: "" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Timeline Event</button>
                                    </div>

                                    <div className="space-y-4">
                                        {(formData.timeline || []).map((event: any, index: number) => (
                                            <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    <FormInput 
                                                        label="Year" 
                                                        name="year" 
                                                        value={event.year || ''} 
                                                        onChange={(e) => handleArrayChange('timeline', index, e)} 
                                                        onEnhance={() => handleEnhance(`timeline-year-${index}`, event.year, (val) => {
                                                            const newTimeline = [...formData.timeline];
                                                            newTimeline[index] = { ...newTimeline[index], year: val };
                                                            setFormData((prev: any) => ({ ...prev, timeline: newTimeline }));
                                                        })}
                                                        isEnhancing={enhancingFields[`timeline-year-${index}`]}
                                                    />
                                                    <FormInput 
                                                        label="Milestone Title" 
                                                        name="title" 
                                                        value={event.title || ''} 
                                                        onChange={(e) => handleArrayChange('timeline', index, e)} 
                                                        onEnhance={() => handleEnhance(`timeline-title-${index}`, event.title, (val) => {
                                                            const newTimeline = [...formData.timeline];
                                                            newTimeline[index] = { ...newTimeline[index], title: val };
                                                            setFormData((prev: any) => ({ ...prev, timeline: newTimeline }));
                                                        })}
                                                        isEnhancing={enhancingFields[`timeline-title-${index}`]}
                                                    />
                                                </div>
                                                <FormTextarea 
                                                    label="Milestone Description" 
                                                    name="description" 
                                                    value={event.description || ''} 
                                                    onChange={(e) => handleArrayChange('timeline', index, e)} 
                                                    onEnhance={() => handleEnhance(`timeline-${index}`, event.description, (val) => {
                                                        const newTimeline = [...formData.timeline];
                                                        newTimeline[index] = { ...newTimeline[index], description: val };
                                                        setFormData((prev: any) => ({ ...prev, timeline: newTimeline }));
                                                    })}
                                                    isEnhancing={enhancingFields[`timeline-${index}`]}
                                                />
                                                <button onClick={() => handleDeleteItem('timeline', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Technical Skills</h3>
                                    <button onClick={() => handleAddItem('skillsData', { name: "New Skill", description: "", technologies: "", iconName: "CodeIcon" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Skill Group</button>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {formData.skillsData.map((skill: any, index: number) => (
                                        <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInput 
                                                    label="Skill Name" 
                                                    name="name" 
                                                    value={skill.name} 
                                                    onChange={(e) => handleArrayChange('skillsData', index, e)} 
                                                    onEnhance={() => handleEnhance(`skill-name-${index}`, skill.name, (val) => {
                                                        const newSkills = [...formData.skillsData];
                                                        newSkills[index] = { ...newSkills[index], name: val };
                                                        setFormData((prev: any) => ({ ...prev, skillsData: newSkills }));
                                                    })}
                                                    isEnhancing={enhancingFields[`skill-name-${index}`]}
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1">Icon</label>
                                                    <select 
                                                        name="iconName" 
                                                        value={skill.iconName || ''} 
                                                        onChange={(e) => handleArrayChange('skillsData', index, e)}
                                                        className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all"
                                                    >
                                                        {Object.keys(ICON_OPTIONS).map(icon => (
                                                            <option key={icon} value={icon}>{icon}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <FormInput 
                                                label="Technologies (comma separated)" 
                                                name="technologies" 
                                                value={skill.technologies} 
                                                onChange={(e) => handleArrayChange('skillsData', index, e)} 
                                                onEnhance={() => handleEnhance(`skill-tech-${index}`, skill.technologies, (val) => {
                                                    const newSkills = [...formData.skillsData];
                                                    newSkills[index] = { ...newSkills[index], technologies: val };
                                                    setFormData((prev: any) => ({ ...prev, skillsData: newSkills }));
                                                })}
                                                isEnhancing={enhancingFields[`skill-tech-${index}`]}
                                            />
                                            <FormTextarea 
                                                label="Description" 
                                                name="description" 
                                                value={skill.description} 
                                                onChange={(e) => handleArrayChange('skillsData', index, e)} 
                                                onEnhance={() => handleEnhance(`skill-desc-${index}`, skill.description, (val) => {
                                                    const newSkills = [...formData.skillsData];
                                                    newSkills[index] = { ...newSkills[index], description: val };
                                                    setFormData((prev: any) => ({ ...prev, skillsData: newSkills }));
                                                })}
                                                isEnhancing={enhancingFields[`skill-desc-${index}`]}
                                            />
                                            <button onClick={() => handleDeleteItem('skillsData', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRICING TAB */}
                        {activeTab === 'pricing' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Pricing Plans</h3>
                                    <button onClick={() => handleAddItem('pricingPlans', { name: "New Plan", description: "", price: "$0", period: "per project", features: [], buttonText: "Get Started" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Plan</button>
                                </div>

                                <div className="space-y-8">
                                    {formData.pricingPlans?.map((plan: any, index: number) => (
                                        <div key={index} className="border border-gray-600 p-6 rounded-xl relative group bg-gray-900/50">
                                            <button onClick={() => handleDeleteItem('pricingPlans', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-400"><TrashIcon/></button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormInput 
                                                    label="Plan Name" 
                                                    name="name" 
                                                    value={plan.name} 
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)} 
                                                    onEnhance={() => handleEnhance(`plan-name-${index}`, plan.name, (val) => {
                                                        const newPlans = [...formData.pricingPlans];
                                                        newPlans[index] = { ...newPlans[index], name: val };
                                                        setFormData((prev: any) => ({ ...prev, pricingPlans: newPlans }));
                                                    })}
                                                    isEnhancing={enhancingFields[`plan-name-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Price" 
                                                    name="price" 
                                                    value={plan.price} 
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)} 
                                                    onEnhance={() => handleEnhance(`plan-price-${index}`, plan.price, (val) => {
                                                        const newPlans = [...formData.pricingPlans];
                                                        newPlans[index] = { ...newPlans[index], price: val };
                                                        setFormData((prev: any) => ({ ...prev, pricingPlans: newPlans }));
                                                    })}
                                                    isEnhancing={enhancingFields[`plan-price-${index}`]}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                <FormInput 
                                                    label="Period (e.g., per project)" 
                                                    name="period" 
                                                    value={plan.period || ''} 
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)} 
                                                    onEnhance={() => handleEnhance(`plan-period-${index}`, plan.period, (val) => {
                                                        const newPlans = [...formData.pricingPlans];
                                                        newPlans[index] = { ...newPlans[index], period: val };
                                                        setFormData((prev: any) => ({ ...prev, pricingPlans: newPlans }));
                                                    })}
                                                    isEnhancing={enhancingFields[`plan-period-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Button Text" 
                                                    name="buttonText" 
                                                    value={plan.buttonText || ''} 
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)} 
                                                    onEnhance={() => handleEnhance(`plan-btn-${index}`, plan.buttonText, (val) => {
                                                        const newPlans = [...formData.pricingPlans];
                                                        newPlans[index] = { ...newPlans[index], buttonText: val };
                                                        setFormData((prev: any) => ({ ...prev, pricingPlans: newPlans }));
                                                    })}
                                                    isEnhancing={enhancingFields[`plan-btn-${index}`]}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <FormTextarea 
                                                    label="Description" 
                                                    name="description" 
                                                    value={plan.description} 
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)} 
                                                    onEnhance={() => handleEnhance(`plan-desc-${index}`, plan.description, (val) => {
                                                        const newPlans = [...formData.pricingPlans];
                                                        newPlans[index] = { ...newPlans[index], description: val };
                                                        setFormData((prev: any) => ({ ...prev, pricingPlans: newPlans }));
                                                    })}
                                                    isEnhancing={enhancingFields[`plan-desc-${index}`]}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Features (one per line)</label>
                                                <textarea 
                                                    name="features" 
                                                    value={plan.features || ''}
                                                    onChange={(e) => handleArrayChange('pricingPlans', index, e)}
                                                    rows={5}
                                                    className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary text-sm"
                                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                                />
                                            </div>
                                            <div className="mt-4 flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id={`isPopular-${index}`}
                                                    checked={plan.isPopular || false}
                                                    onChange={(e) => {
                                                        setFormData((prev: any) => {
                                                            const newData = { ...prev };
                                                            newData.pricingPlans = [...(newData.pricingPlans || [])];
                                                            newData.pricingPlans[index] = { ...newData.pricingPlans[index], isPopular: e.target.checked };
                                                            return newData;
                                                        });
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-600"
                                                />
                                                <label htmlFor={`isPopular-${index}`} className="text-sm text-gray-300">Mark as Most Popular</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WORK TAB */}
                        {activeTab === 'work' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Projects & Work</h3>
                                    <button onClick={() => handleAddItem('projectsData', { title: "New Project", category: "Category", description: "", services: [], imageUrl: "", liveUrl: "" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Project</button>
                                </div>

                                <div className="space-y-8">
                                    {formData.projectsData.map((project: any, index: number) => (
                                        <div key={index} className="border border-gray-600 p-6 rounded-xl relative group bg-gray-900/50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                                <div className="space-y-4">
                                                    <FormInput 
                                                        label="Project Title" 
                                                        name="title" 
                                                        value={project.title} 
                                                        onChange={(e) => handleArrayChange('projectsData', index, e)} 
                                                        onEnhance={() => handleEnhance(`project-title-${index}`, project.title, (val) => {
                                                            const newProjects = [...formData.projectsData];
                                                            newProjects[index] = { ...newProjects[index], title: val };
                                                            setFormData((prev: any) => ({ ...prev, projectsData: newProjects }));
                                                        })}
                                                        isEnhancing={enhancingFields[`project-title-${index}`]}
                                                    />
                                                    <FormInput 
                                                        label="Category" 
                                                        name="category" 
                                                        value={project.category} 
                                                        onChange={(e) => handleArrayChange('projectsData', index, e)} 
                                                        onEnhance={() => handleEnhance(`project-cat-${index}`, project.category, (val) => {
                                                            const newProjects = [...formData.projectsData];
                                                            newProjects[index] = { ...newProjects[index], category: val };
                                                            setFormData((prev: any) => ({ ...prev, projectsData: newProjects }));
                                                        })}
                                                        isEnhancing={enhancingFields[`project-cat-${index}`]}
                                                    />
                                                    <FormInput 
                                                        label="Live URL" 
                                                        name="liveUrl" 
                                                        value={project.liveUrl || ''} 
                                                        onChange={(e) => handleArrayChange('projectsData', index, e)} 
                                                        onEnhance={() => handleEnhance(`project-url-${index}`, project.liveUrl, (val) => {
                                                            const newProjects = [...formData.projectsData];
                                                            newProjects[index] = { ...newProjects[index], liveUrl: val };
                                                            setFormData((prev: any) => ({ ...prev, projectsData: newProjects }));
                                                        })}
                                                        isEnhancing={enhancingFields[`project-url-${index}`]}
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <FormTextarea 
                                                        label="Description" 
                                                        name="description" 
                                                        value={project.description} 
                                                        onChange={(e) => handleArrayChange('projectsData', index, e)} 
                                                        onEnhance={() => handleEnhance(`project-${index}`, project.description, (val) => {
                                                            const newProjects = [...formData.projectsData];
                                                            newProjects[index] = { ...newProjects[index], description: val };
                                                            setFormData((prev: any) => ({ ...prev, projectsData: newProjects }));
                                                        })}
                                                        isEnhancing={enhancingFields[`project-${index}`]}
                                                    />
                                                    <FormInput 
                                                        label="Image URL" 
                                                        name="imageUrl" 
                                                        value={project.imageUrl || ''} 
                                                        onChange={(e) => handleArrayChange('projectsData', index, e)} 
                                                        onEnhance={() => handleEnhance(`project-img-${index}`, project.imageUrl, (val) => {
                                                            const newProjects = [...formData.projectsData];
                                                            newProjects[index] = { ...newProjects[index], imageUrl: val };
                                                            setFormData((prev: any) => ({ ...prev, projectsData: newProjects }));
                                                        })}
                                                        isEnhancing={enhancingFields[`project-img-${index}`]}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="block text-sm font-medium text-gray-300">Project Services</label>
                                                    <button onClick={() => handleAddNestedItem('projectsData', index, 'services', { name: "New Service", iconName: "CodeIcon" })} className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Add Service</button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {(project.services || []).map((service: any, sIdx: number) => (
                                                        <div key={sIdx} className="flex items-center gap-2">
                                                            <div className="flex-1">
                                                                <input type="text" name="name" value={service.name} onChange={(e) => handleNestedArrayChange('projectsData', index, 'services', sIdx, e)} className="w-full px-2 py-1 bg-gray-900 rounded text-sm text-white border border-gray-600 focus:border-primary" placeholder="Service Name" />
                                                            </div>
                                                            <div className="w-32">
                                                                <select name="iconName" value={service.iconName || ''} onChange={(e) => handleNestedArrayChange('projectsData', index, 'services', sIdx, e)} className="w-full px-2 py-1 bg-gray-900 rounded text-sm text-white border border-gray-600 focus:border-primary">
                                                                    {Object.keys(ICON_OPTIONS).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                                </select>
                                                            </div>
                                                            <button onClick={() => handleDeleteNestedItem('projectsData', index, 'services', sIdx)} className="text-red-500 hover:text-red-400 p-1"><TrashIcon/></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteItem('projectsData', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BLOG TAB */}
                        {activeTab === 'blog' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Blog Section</h3>
                                    <button onClick={() => handleAddItem('blogPosts', { slug: "new-blog-post", title: "New Blog Post", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10), readTime: "5 min read", url: "/blog/new-blog-post" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Blog Post</button>
                                </div>
                                <div className="space-y-6">
                                    {(formData.blogPosts || []).map((post: any, index: number) => (
                                        <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <FormInput 
                                                    label="Post Slug" 
                                                    name="slug" 
                                                    value={post.slug || ''} 
                                                    onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                    onEnhance={() => handleEnhance(`blog-slug-${index}`, post.slug, (val) => {
                                                        const newPosts = [...formData.blogPosts];
                                                        newPosts[index] = { ...newPosts[index], slug: val };
                                                        setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                    })}
                                                    isEnhancing={enhancingFields[`blog-slug-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Post Title" 
                                                    name="title" 
                                                    value={post.title || ''} 
                                                    onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                    onEnhance={() => handleEnhance(`blog-title-${index}`, post.title, (val) => {
                                                        const newPosts = [...formData.blogPosts];
                                                        newPosts[index] = { ...newPosts[index], title: val };
                                                        setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                    })}
                                                    isEnhancing={enhancingFields[`blog-title-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Published Date (YYYY-MM-DD)" 
                                                    name="date" 
                                                    value={post.date || ''} 
                                                    onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                    onEnhance={() => handleEnhance(`blog-date-${index}`, post.date, (val) => {
                                                        const newPosts = [...formData.blogPosts];
                                                        newPosts[index] = { ...newPosts[index], date: val };
                                                        setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                    })}
                                                    isEnhancing={enhancingFields[`blog-date-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Read Time" 
                                                    name="readTime" 
                                                    value={post.readTime || ''} 
                                                    onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                    onEnhance={() => handleEnhance(`blog-read-${index}`, post.readTime, (val) => {
                                                        const newPosts = [...formData.blogPosts];
                                                        newPosts[index] = { ...newPosts[index], readTime: val };
                                                        setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                    })}
                                                    isEnhancing={enhancingFields[`blog-read-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Article URL" 
                                                    name="url" 
                                                    value={post.url || ''} 
                                                    onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                    onEnhance={() => handleEnhance(`blog-url-${index}`, post.url, (val) => {
                                                        const newPosts = [...formData.blogPosts];
                                                        newPosts[index] = { ...newPosts[index], url: val };
                                                        setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                    })}
                                                    isEnhancing={enhancingFields[`blog-url-${index}`]}
                                                />
                                            </div>
                                            <FormTextarea 
                                                label="Excerpt" 
                                                name="excerpt" 
                                                value={post.excerpt || ''} 
                                                onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                onEnhance={() => handleEnhance(`blog-excerpt-${index}`, post.excerpt, (val) => {
                                                    const newPosts = [...formData.blogPosts];
                                                    newPosts[index] = { ...newPosts[index], excerpt: val };
                                                    setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                })}
                                                isEnhancing={enhancingFields[`blog-excerpt-${index}`]}
                                            />
                                            <FormTextarea 
                                                label="Post Content (one paragraph per line)" 
                                                name="content" 
                                                value={post.content || ''} 
                                                onChange={(e) => handleArrayChange('blogPosts', index, e)} 
                                                onEnhance={() => handleEnhance(`blog-content-${index}`, post.content, (val) => {
                                                    const newPosts = [...formData.blogPosts];
                                                    newPosts[index] = { ...newPosts[index], content: val };
                                                    setFormData((prev: any) => ({ ...prev, blogPosts: newPosts }));
                                                })}
                                                isEnhancing={enhancingFields[`blog-content-${index}`]}
                                            />
                                            <button onClick={() => handleDeleteItem('blogPosts', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TESTIMONIALS TAB */}
                        {activeTab === 'testimonials' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Testimonials Carousel Content</h3>
                                    <button onClick={() => handleAddItem('testimonials', { name: "Client Name", role: "Role", company: "Company", image: "https://i.pravatar.cc/150?img=12", content: "", rating: 5 })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Testimonial</button>
                                </div>

                                <div className="space-y-6">
                                    {(formData.testimonials || []).map((testimonial: any, index: number) => (
                                        <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <FormInput 
                                                    label="Client Name" 
                                                    name="name" 
                                                    value={testimonial.name || ''} 
                                                    onChange={(e) => handleArrayChange('testimonials', index, e)} 
                                                    onEnhance={() => handleEnhance(`test-name-${index}`, testimonial.name, (val) => {
                                                        const newTest = [...formData.testimonials];
                                                        newTest[index] = { ...newTest[index], name: val };
                                                        setFormData((prev: any) => ({ ...prev, testimonials: newTest }));
                                                    })}
                                                    isEnhancing={enhancingFields[`test-name-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Client Role" 
                                                    name="role" 
                                                    value={testimonial.role || ''} 
                                                    onChange={(e) => handleArrayChange('testimonials', index, e)} 
                                                    onEnhance={() => handleEnhance(`test-role-${index}`, testimonial.role, (val) => {
                                                        const newTest = [...formData.testimonials];
                                                        newTest[index] = { ...newTest[index], role: val };
                                                        setFormData((prev: any) => ({ ...prev, testimonials: newTest }));
                                                    })}
                                                    isEnhancing={enhancingFields[`test-role-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Company" 
                                                    name="company" 
                                                    value={testimonial.company || ''} 
                                                    onChange={(e) => handleArrayChange('testimonials', index, e)} 
                                                    onEnhance={() => handleEnhance(`test-company-${index}`, testimonial.company, (val) => {
                                                        const newTest = [...formData.testimonials];
                                                        newTest[index] = { ...newTest[index], company: val };
                                                        setFormData((prev: any) => ({ ...prev, testimonials: newTest }));
                                                    })}
                                                    isEnhancing={enhancingFields[`test-company-${index}`]}
                                                />
                                                <FormInput 
                                                    label="Profile Image URL" 
                                                    name="image" 
                                                    value={testimonial.image || ''} 
                                                    onChange={(e) => handleArrayChange('testimonials', index, e)} 
                                                    onEnhance={() => handleEnhance(`test-img-${index}`, testimonial.image, (val) => {
                                                        const newTest = [...formData.testimonials];
                                                        newTest[index] = { ...newTest[index], image: val };
                                                        setFormData((prev: any) => ({ ...prev, testimonials: newTest }));
                                                    })}
                                                    isEnhancing={enhancingFields[`test-img-${index}`]}
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
                                                    <input type="number" min={1} max={5} name="rating" value={testimonial.rating || 5} onChange={(e) => handleArrayChange('testimonials', index, e)} className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all" />
                                                </div>
                                            </div>
                                            <FormTextarea 
                                                label="Testimonial Content" 
                                                name="content" 
                                                value={testimonial.content || ''} 
                                                onChange={(e) => handleArrayChange('testimonials', index, e)} 
                                                onEnhance={() => handleEnhance(`testimonial-${index}`, testimonial.content, (val) => {
                                                    const newTestimonials = [...formData.testimonials];
                                                    newTestimonials[index] = { ...newTestimonials[index], content: val };
                                                    setFormData((prev: any) => ({ ...prev, testimonials: newTestimonials }));
                                                })}
                                                isEnhancing={enhancingFields[`testimonial-${index}`]}
                                            />
                                            <button onClick={() => handleDeleteItem('testimonials', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTACT TAB */}
                        {activeTab === 'contact' && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-2xl font-bold text-primary mb-6">Contact & Socials</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Contact Info</h4>
                                        <FormInput 
                                            label="Email Address" 
                                            name="email" 
                                            value={formData.contactInfo?.email || ''} 
                                            onChange={(e) => handleNestedChange('contactInfo', e)} 
                                            onEnhance={() => handleEnhance('contact-email', formData.contactInfo.email, (val) => setFormData((prev: any) => ({ ...prev, contactInfo: { ...prev.contactInfo, email: val } })))}
                                            isEnhancing={enhancingFields['contact-email']}
                                        />
                                        <FormInput 
                                            label="Phone Number" 
                                            name="phone" 
                                            value={formData.contactInfo?.phone || ''} 
                                            onChange={(e) => handleNestedChange('contactInfo', e)} 
                                            onEnhance={() => handleEnhance('contact-phone', formData.contactInfo.phone, (val) => setFormData((prev: any) => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: val } })))}
                                            isEnhancing={enhancingFields['contact-phone']}
                                        />
                                        <FormInput 
                                            label="Location" 
                                            name="location" 
                                            value={formData.contactInfo?.location || ''} 
                                            onChange={(e) => handleNestedChange('contactInfo', e)} 
                                            onEnhance={() => handleEnhance('contact-loc', formData.contactInfo.location, (val) => setFormData((prev: any) => ({ ...prev, contactInfo: { ...prev.contactInfo, location: val } })))}
                                            isEnhancing={enhancingFields['contact-loc']}
                                        />
                                    </div>
                                    
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Social Links</h4>
                                        <FormInput 
                                            label="LinkedIn URL" 
                                            name="linkedin" 
                                            value={formData.socialLinks?.linkedin || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-li', formData.socialLinks.linkedin, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: val } })))}
                                            isEnhancing={enhancingFields['social-li']}
                                        />
                                        <FormInput 
                                            label="GitHub URL" 
                                            name="github" 
                                            value={formData.socialLinks?.github || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-gh', formData.socialLinks.github, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, github: val } })))}
                                            isEnhancing={enhancingFields['social-gh']}
                                        />
                                        <FormInput 
                                            label="Behance URL" 
                                            name="behance" 
                                            value={formData.socialLinks?.behance || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-be', formData.socialLinks.behance, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, behance: val } })))}
                                            isEnhancing={enhancingFields['social-be']}
                                        />
                                        <FormInput 
                                            label="Website URL" 
                                            name="website" 
                                            value={formData.socialLinks?.website || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-web', formData.socialLinks.website, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, website: val } })))}
                                            isEnhancing={enhancingFields['social-web']}
                                        />
                                        <FormInput 
                                            label="Dribbble URL" 
                                            name="dribbble" 
                                            value={formData.socialLinks?.dribbble || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-dr', formData.socialLinks.dribbble, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, dribbble: val } })))}
                                            isEnhancing={enhancingFields['social-dr']}
                                        />
                                        <FormInput 
                                            label="Instagram URL" 
                                            name="instagram" 
                                            value={formData.socialLinks?.instagram || ''} 
                                            onChange={(e) => handleNestedChange('socialLinks', e)} 
                                            onEnhance={() => handleEnhance('social-ig', formData.socialLinks.instagram, (val) => setFormData((prev: any) => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: val } })))}
                                            isEnhancing={enhancingFields['social-ig']}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-2xl font-bold text-primary mb-6">Site Settings & Headings</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Section Titles</h4>
                                        <FormInput 
                                            label="About Section Title" 
                                            name="about" 
                                            value={formData.sectionTitles?.about || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-about', formData.sectionTitles.about, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, about: val } })))}
                                            isEnhancing={enhancingFields['st-about']}
                                        />
                                        <FormInput 
                                            label="Services Section Title" 
                                            name="services" 
                                            value={formData.sectionTitles?.services || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-services', formData.sectionTitles.services, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, services: val } })))}
                                            isEnhancing={enhancingFields['st-services']}
                                        />
                                        <FormInput 
                                            label="Timeline Section Title" 
                                            name="timeline" 
                                            value={formData.sectionTitles?.timeline || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-timeline', formData.sectionTitles.timeline, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, timeline: val } })))}
                                            isEnhancing={enhancingFields['st-timeline']}
                                        />
                                        <FormInput 
                                            label="Resume Section Title" 
                                            name="resume" 
                                            value={formData.sectionTitles?.resume || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-resume', formData.sectionTitles.resume, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, resume: val } })))}
                                            isEnhancing={enhancingFields['st-resume']}
                                        />
                                        <FormInput 
                                            label="Skills Section Title" 
                                            name="skills" 
                                            value={formData.sectionTitles?.skills || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-skills', formData.sectionTitles.skills, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, skills: val } })))}
                                            isEnhancing={enhancingFields['st-skills']}
                                        />
                                        <FormInput 
                                            label="Pricing Section Title" 
                                            name="pricing" 
                                            value={formData.sectionTitles?.pricing || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-pricing', formData.sectionTitles.pricing, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, pricing: val } })))}
                                            isEnhancing={enhancingFields['st-pricing']}
                                        />
                                        <FormInput 
                                            label="Work Section Title" 
                                            name="work" 
                                            value={formData.sectionTitles?.work || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-work', formData.sectionTitles.work, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, work: val } })))}
                                            isEnhancing={enhancingFields['st-work']}
                                        />
                                        <FormInput 
                                            label="Blog Section Title" 
                                            name="blog" 
                                            value={formData.sectionTitles?.blog || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-blog', formData.sectionTitles.blog, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, blog: val } })))}
                                            isEnhancing={enhancingFields['st-blog']}
                                        />
                                        <FormInput 
                                            label="Testimonials Section Title" 
                                            name="testimonials" 
                                            value={formData.sectionTitles?.testimonials || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-test', formData.sectionTitles.testimonials, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, testimonials: val } })))}
                                            isEnhancing={enhancingFields['st-test']}
                                        />
                                        <FormInput 
                                            label="Contact Section Title" 
                                            name="contact" 
                                            value={formData.sectionTitles?.contact || ''} 
                                            onChange={(e) => handleNestedChange('sectionTitles', e)} 
                                            onEnhance={() => handleEnhance('st-contact', formData.sectionTitles.contact, (val) => setFormData((prev: any) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, contact: val } })))}
                                            isEnhancing={enhancingFields['st-contact']}
                                        />
                                    </div>
                                    
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Navigation Links Visibility</h4>
                                        {['about', 'services', 'timeline', 'resume', 'skills', 'work', 'blog', 'guestbook', 'contact'].map((navItem) => (
                                            <div key={navItem} className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id={`nav-${navItem}`}
                                                    name={navItem} 
                                                    checked={formData.navLinks?.[navItem] !== false} 
                                                    onChange={(e) => handleCheckboxChange('navLinks', e)}
                                                    className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-gray-800"
                                                />
                                                <label htmlFor={`nav-${navItem}`} className="text-gray-300 font-medium capitalize flex-1 cursor-pointer">Show {navItem} Link</label>
                                            </div>
                                        ))}
                                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                            Toggle these checks to hide or show specific links in the header navigation menu. Note that the section will still exist on the page, but the link will be hidden.
                                        </p>
                                    </div>
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Booking / Calendar</h4>
                                        <FormInput 
                                            label="Calendly URL" 
                                            name="bookingUrl" 
                                            value={formData.bookingUrl || ''} 
                                            onChange={handleChange} 
                                            placeholder="https://calendly.com/your-username" 
                                            onEnhance={() => handleEnhance('booking-url', formData.bookingUrl, (val) => setFormData((prev: any) => ({ ...prev, bookingUrl: val })))}
                                            isEnhancing={enhancingFields['booking-url']}
                                        />
                                        <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                            <p className="text-xs text-blue-400">
                                                Enter your Calendly (or similar) URL to enable the booking feature. Users will be able to schedule calls with you.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Footer Content</h4>
                                        <FormTextarea 
                                            label="Footer Description" 
                                            name="description" 
                                            value={formData.footerContent?.description || ''} 
                                            onChange={(e) => handleNestedChange('footerContent', e)} 
                                            onEnhance={() => handleEnhance('footer-desc', formData.footerContent.description, (val) => setFormData((prev: any) => ({ ...prev, footerContent: { ...prev.footerContent, description: val } })))}
                                            isEnhancing={enhancingFields['footer-desc']}
                                        />
                                        <FormInput 
                                            label="Footer Services (comma separated)" 
                                            name="services" 
                                            value={formData.footerContent?.services || ''} 
                                            onChange={(e) => handleNestedChange('footerContent', e)} 
                                            onEnhance={() => handleEnhance('footer-serv', formData.footerContent.services, (val) => setFormData((prev: any) => ({ ...prev, footerContent: { ...prev.footerContent, services: val } })))}
                                            isEnhancing={enhancingFields['footer-serv']}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* INBOX TAB */}
                        {activeTab === 'inbox' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Contact Submissions</h3>
                                    <button onClick={fetchInbox} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">Refresh</button>
                                </div>
                                {loadingInbox ? (
                                    <div className="text-gray-400 text-center py-10">Loading messages...</div>
                                ) : inboxMessages.length === 0 ? (
                                    <div className="text-gray-500 text-center py-10 bg-gray-900 rounded-xl border border-gray-700">No messages yet.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {inboxMessages.map((msg, i) => (
                                            <div key={i} className="bg-gray-900 border border-gray-700 p-5 rounded-xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-200">{msg.name}</h4>
                                                        <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-800">
                                                    <p className="text-sm font-semibold text-gray-400 mb-1">Subject: {msg.subject}</p>
                                                    <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* GUESTBOOK TAB */}
                        {activeTab === 'guestbook' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-primary">Guestbook Entries</h3>
                                    <button onClick={fetchGuestbook} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">Refresh</button>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Manage visitor messages from the guestbook section. These entries are stored locally in the browser.
                                </p>
                                {loadingGuestbook ? (
                                    <div className="text-gray-400 text-center py-10">Loading...</div>
                                ) : guestbookMessages.length === 0 ? (
                                    <div className="text-gray-500 text-center py-10 bg-gray-900 rounded-xl border border-gray-700">No guestbook entries yet.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {guestbookMessages.map((msg, i) => (
                                            <div key={i} className="bg-gray-900 border border-gray-700 p-5 rounded-xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-200">{msg.name}</h4>
                                                        <span className="text-xs text-gray-500">{msg.date}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteGuestbookEntry(i)} 
                                                        className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-800"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                                <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-700 bg-gray-900 flex justify-end gap-4 mt-auto">
                    <button onClick={onClose} className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0">Save All Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
