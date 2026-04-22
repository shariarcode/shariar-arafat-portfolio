import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { CloseIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface EditorPanelProps {
    data: PortfolioData;
    onSave: (newData: PortfolioData) => void;
    onClose: () => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px]"
        />
    </div>
);

const FormTextarea: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5 sm:mb-1">{label}</label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-3 sm:py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all text-sm sm:text-base min-h-[44px]"
        />
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
                                        <FormInput label="Full Name" name="userName" value={formData.userName} onChange={handleChange} />
                                        <FormInput label="Roles (comma separated)" name="heroRoles" value={formData.heroRoles} onChange={handleChange} />
                                        <FormInput label="'Available for hire' Text" name="heroAvailableText" value={formData.heroAvailableText} onChange={handleChange} />
                                        <div>
                                            <FormInput label="Resume / CV PDF URL" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="Paste a direct PDF link here..." />
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
                                        <FormTextarea label="Subheading" name="heroSubheading" value={formData.heroSubheading} onChange={handleChange} />
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
                                <FormTextarea label="Career Objective" name="careerObjective" value={formData.careerObjective} onChange={handleChange} />
                                
                                <div className="space-y-4 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xl font-bold text-gray-200">Expertise Areas</h4>
                                        <button onClick={() => handleAddItem('expertiseAreas', { name: "New Expertise", description: "" })} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm border border-gray-600">+ Add Expertise</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {formData.expertiseAreas.map((area: any, index: number) => (
                                            <div key={index} className="space-y-4 border border-gray-600 p-5 rounded-xl relative group bg-gray-900/50">
                                                <FormInput label="Area Name" name="name" value={area.name} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
                                                <FormTextarea label="Area Description" name="description" value={area.description || ''} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
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
                                                    <FormInput label="Year" name="year" value={event.year || ''} onChange={(e) => handleArrayChange('timeline', index, e)} />
                                                    <FormInput label="Milestone Title" name="title" value={event.title || ''} onChange={(e) => handleArrayChange('timeline', index, e)} />
                                                </div>
                                                <FormTextarea label="Milestone Description" name="description" value={event.description || ''} onChange={(e) => handleArrayChange('timeline', index, e)} />
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
                                                <FormInput label="Skill Name" name="name" value={skill.name} onChange={(e) => handleArrayChange('skillsData', index, e)} />
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
                                            <FormInput label="Technologies (comma separated)" name="technologies" value={skill.technologies} onChange={(e) => handleArrayChange('skillsData', index, e)} />
                                            <FormTextarea label="Description" name="description" value={skill.description} onChange={(e) => handleArrayChange('skillsData', index, e)} />
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
                                                <FormInput label="Plan Name" name="name" value={plan.name} onChange={(e) => handleArrayChange('pricingPlans', index, e)} />
                                                <FormInput label="Price" name="price" value={plan.price} onChange={(e) => handleArrayChange('pricingPlans', index, e)} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                <FormInput label="Period (e.g., per project)" name="period" value={plan.period || ''} onChange={(e) => handleArrayChange('pricingPlans', index, e)} />
                                                <FormInput label="Button Text" name="buttonText" value={plan.buttonText || ''} onChange={(e) => handleArrayChange('pricingPlans', index, e)} />
                                            </div>
                                            <div className="mt-4">
                                                <FormTextarea label="Description" name="description" value={plan.description} onChange={(e) => handleArrayChange('pricingPlans', index, e)} />
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Features (one per line)</label>
                                                <textarea 
                                                    name="features" 
                                                    value={Array.isArray(plan.features) ? plan.features.join('\n') : ''}
                                                    onChange={(e) => {
                                                        const features = e.target.value.split('\n').filter(f => f.trim());
                                                        setFormData((prev: any) => {
                                                            const newData = { ...prev };
                                                            newData.pricingPlans = [...(newData.pricingPlans || [])];
                                                            newData.pricingPlans[index] = { ...newData.pricingPlans[index], features };
                                                            return newData;
                                                        });
                                                    }}
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
                                                    <FormInput label="Project Title" name="title" value={project.title} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                                    <FormInput label="Category" name="category" value={project.category} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                                    <FormInput label="Live URL" name="liveUrl" value={project.liveUrl || ''} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                                </div>
                                                <div className="space-y-4">
                                                    <FormTextarea label="Description" name="description" value={project.description} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                                    <FormInput label="Image URL" name="imageUrl" value={project.imageUrl || ''} onChange={(e) => handleArrayChange('projectsData', index, e)} />
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
                                                <FormInput label="Post Slug" name="slug" value={post.slug || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                                <FormInput label="Post Title" name="title" value={post.title || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                                <FormInput label="Published Date (YYYY-MM-DD)" name="date" value={post.date || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                                <FormInput label="Read Time" name="readTime" value={post.readTime || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                                <FormInput label="Article URL" name="url" value={post.url || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                            </div>
                                            <FormTextarea label="Excerpt" name="excerpt" value={post.excerpt || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
                                            <FormTextarea label="Post Content (one paragraph per line)" name="content" value={post.content || ''} onChange={(e) => handleArrayChange('blogPosts', index, e)} />
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
                                                <FormInput label="Client Name" name="name" value={testimonial.name || ''} onChange={(e) => handleArrayChange('testimonials', index, e)} />
                                                <FormInput label="Client Role" name="role" value={testimonial.role || ''} onChange={(e) => handleArrayChange('testimonials', index, e)} />
                                                <FormInput label="Company" name="company" value={testimonial.company || ''} onChange={(e) => handleArrayChange('testimonials', index, e)} />
                                                <FormInput label="Profile Image URL" name="image" value={testimonial.image || ''} onChange={(e) => handleArrayChange('testimonials', index, e)} />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
                                                    <input type="number" min={1} max={5} name="rating" value={testimonial.rating || 5} onChange={(e) => handleArrayChange('testimonials', index, e)} className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all" />
                                                </div>
                                            </div>
                                            <FormTextarea label="Testimonial Content" name="content" value={testimonial.content || ''} onChange={(e) => handleArrayChange('testimonials', index, e)} />
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
                                        <FormInput label="Email Address" name="email" value={formData.contactInfo?.email || ''} onChange={(e) => handleNestedChange('contactInfo', e)} />
                                        <FormInput label="Phone Number" name="phone" value={formData.contactInfo?.phone || ''} onChange={(e) => handleNestedChange('contactInfo', e)} />
                                        <FormInput label="Location" name="location" value={formData.contactInfo?.location || ''} onChange={(e) => handleNestedChange('contactInfo', e)} />
                                    </div>
                                    
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Social Links</h4>
                                        <FormInput label="LinkedIn URL" name="linkedin" value={formData.socialLinks?.linkedin || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
                                        <FormInput label="GitHub URL" name="github" value={formData.socialLinks?.github || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
                                        <FormInput label="Behance URL" name="behance" value={formData.socialLinks?.behance || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
                                        <FormInput label="Website URL" name="website" value={formData.socialLinks?.website || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
                                        <FormInput label="Dribbble URL" name="dribbble" value={formData.socialLinks?.dribbble || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
                                        <FormInput label="Instagram URL" name="instagram" value={formData.socialLinks?.instagram || ''} onChange={(e) => handleNestedChange('socialLinks', e)} />
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
                                        <FormInput label="About Section Title" name="about" value={formData.sectionTitles?.about || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Services Section Title" name="services" value={formData.sectionTitles?.services || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Timeline Section Title" name="timeline" value={formData.sectionTitles?.timeline || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Resume Section Title" name="resume" value={formData.sectionTitles?.resume || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Skills Section Title" name="skills" value={formData.sectionTitles?.skills || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Pricing Section Title" name="pricing" value={formData.sectionTitles?.pricing || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Work Section Title" name="work" value={formData.sectionTitles?.work || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Blog Section Title" name="blog" value={formData.sectionTitles?.blog || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Testimonials Section Title" name="testimonials" value={formData.sectionTitles?.testimonials || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Contact Section Title" name="contact" value={formData.sectionTitles?.contact || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
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
                                        <FormInput label="Calendly URL" name="bookingUrl" value={formData.bookingUrl || ''} onChange={handleChange} placeholder="https://calendly.com/your-username" />
                                        <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                            <p className="text-xs text-blue-400">
                                                Enter your Calendly (or similar) URL to enable the booking feature. Users will be able to schedule calls with you.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Footer Content</h4>
                                        <FormTextarea label="Footer Description" name="description" value={formData.footerContent?.description || ''} onChange={(e) => handleNestedChange('footerContent', e)} />
                                        <FormInput label="Footer Services (comma separated)" name="services" value={formData.footerContent?.services || ''} onChange={(e) => handleNestedChange('footerContent', e)} />
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
