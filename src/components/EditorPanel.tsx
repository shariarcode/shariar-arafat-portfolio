import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { CloseIcon } from './Icons';
import { ICON_OPTIONS } from '../constants';

interface EditorPanelProps {
    data: PortfolioData;
    onSave: (newData: PortfolioData) => void;
    onClose: () => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all"
        />
    </div>
);

const FormTextarea: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea 
            name={name}
            value={value} 
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary transition-all"
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
        if (!serializableData.sectionTitles) serializableData.sectionTitles = { about: "About Me", skills: "Technical Skills", work: "My Projects", contact: "Get In Touch" };
        if (!serializableData.navLinks) serializableData.navLinks = { about: true, skills: true, work: true, contact: true };
        if (!serializableData.heroAvailableText) serializableData.heroAvailableText = "Available for hire";
        if (!serializableData.resumeUrl) serializableData.resumeUrl = "";
        
        // Transform skills technologies for editing
        serializableData.skillsData = (serializableData.skillsData || []).map((skill: any) => ({
            ...skill,
            technologies: Array.isArray(skill.technologies) ? skill.technologies.join(', ') : ''
        }));
        
        return serializableData;
    });

    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'skills' | 'work' | 'contact' | 'settings'>('home');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
            }))
        };
        onSave(processedData as unknown as PortfolioData);
    };

    const tabs = [
        { id: 'home', label: '🏠 Home' },
        { id: 'about', label: '👤 About' },
        { id: 'skills', label: '🛠️ Skills' },
        { id: 'work', label: '💼 Work' },
        { id: 'contact', label: '📬 Contact' },
        { id: 'settings', label: '⚙️ Settings' }
    ] as const;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4 sm:p-8">
            <div className="w-full h-full max-w-6xl bg-dark-bg shadow-2xl z-[100] rounded-2xl flex flex-col overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-gray-700 bg-gray-900">
                    <h2 className="text-2xl font-bold text-white">Full CMS Dashboard</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors bg-gray-800"><CloseIcon /></button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-gray-900 border-r border-gray-700 flex flex-col p-4 gap-2">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-3 text-left rounded-lg transition-colors font-medium ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-dark-bg text-white">
                        
                        {/* HOME TAB */}
                        {activeTab === 'home' && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-2xl font-bold text-primary mb-6">Home Section Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <FormInput label="Full Name" name="userName" value={formData.userName} onChange={handleChange} />
                                        <FormInput label="Roles (comma separated)" name="heroRoles" value={formData.heroRoles} onChange={handleChange} />
                                        <FormInput label="'Available for hire' Text" name="heroAvailableText" value={formData.heroAvailableText} onChange={handleChange} />
                                        <div>
                                            <FormInput label="Resume / CV PDF URL" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="Paste a direct PDF link here..." />
                                            <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                                <p className="text-xs text-blue-300 font-semibold mb-1">📄 How to get your PDF link:</p>
                                                <ol className="text-xs text-blue-400 space-y-1 list-decimal list-inside">
                                                    <li>Upload your CV PDF to <strong>Google Drive</strong></li>
                                                    <li>Right-click → <strong>Share</strong> → <strong>Anyone with the link</strong></li>
                                                    <li>Copy the link, then change <code className="bg-blue-900 px-1 rounded">/view</code> to <code className="bg-blue-900 px-1 rounded">/preview</code></li>
                                                </ol>
                                                <p className="text-xs text-blue-400 mt-2">Or use any direct <code className="bg-blue-900 px-1 rounded">.pdf</code> URL from any file hosting service.</p>
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
                                        <FormInput label="Skills Section Title" name="skills" value={formData.sectionTitles?.skills || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Work Section Title" name="work" value={formData.sectionTitles?.work || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                        <FormInput label="Contact Section Title" name="contact" value={formData.sectionTitles?.contact || ''} onChange={(e) => handleNestedChange('sectionTitles', e)} />
                                    </div>
                                    
                                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50">
                                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Navigation Links Visibility</h4>
                                        {['about', 'skills', 'work', 'contact'].map((navItem) => (
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
                                </div>
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
