
import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { CloseIcon } from './Icons';

interface EditorPanelProps {
    data: PortfolioData;
    onSave: (newData: PortfolioData) => void;
    onClose: () => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input 
            type="text" 
            id={name}
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
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea 
            id={name}
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
    const [formData, setFormData] = useState(() => {
        const serializableData = JSON.parse(JSON.stringify(data));
        serializableData.heroRoles = Array.isArray(data.heroRoles) ? data.heroRoles.join(', ') : '';
        return serializableData;
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (arrayName: 'projectsData' | 'expertiseAreas', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newArray = [...(prev as any)[arrayName]];
            newArray[index] = { ...newArray[index], [name]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleAddItem = (arrayName: 'projectsData' | 'expertiseAreas') => {
        const newItem = arrayName === 'projectsData'
            ? { category: "New Category", title: "New Project", description: "A new project description.", services: [] }
            : { name: "New Expertise", description: "A new expertise description." };
        setFormData(prev => ({ ...prev, [arrayName]: [...(prev as any)[arrayName], newItem] }));
    };

    const handleDeleteItem = (arrayName: 'projectsData' | 'expertiseAreas', index: number) => {
        setFormData(prev => ({ ...prev, [arrayName]: (prev as any)[arrayName].filter((_: any, i: number) => i !== index) }));
    };

    const handleSave = () => {
        const processedData = {
            ...formData,
            heroRoles: formData.heroRoles.split(',').map((s: string) => s.trim()).filter(Boolean),
        };
        onSave(processedData as unknown as PortfolioData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]">
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card shadow-2xl z-[100] transform transition-transform translate-x-0 border-l border-gray-700">
                <div className="h-full flex flex-col">
                    <div className="p-6 flex justify-between items-center border-b border-gray-700 bg-gray-900">
                        <h2 className="text-2xl font-bold text-white">Content Editor</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"><CloseIcon /></button>
                    </div>
                    <div className="flex-grow p-6 overflow-y-auto space-y-8 text-white">
                        <fieldset className="space-y-4 border-2 border-gray-700 p-5 rounded-xl bg-gray-900/50">
                            <legend className="text-xl font-bold text-primary px-3 text-primary-light">Hero Section</legend>
                            <FormInput label="Full Name" name="userName" value={formData.userName} onChange={handleChange} />
                            
                             <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image</label>
                                <div className="flex items-center gap-6 bg-gray-800/80 p-4 rounded-xl border border-gray-600">
                                    <div className="shrink-0 relative">
                                        <img src={formData.heroImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary/50 shadow-lg" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-xs text-gray-400">Preview Updates Instantly</p>
                                        <FormInput 
                                            label="Direct Link" 
                                            name="heroImage" 
                                            value={formData.heroImage} 
                                            onChange={handleChange} 
                                            placeholder="Paste URL (Imgur, PostImages, etc)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <FormInput label="Roles (comma separated)" name="heroRoles" value={formData.heroRoles} onChange={handleChange} />
                            <FormTextarea label="Subheading" name="heroSubheading" value={formData.heroSubheading} onChange={handleChange} />
                        </fieldset>

                        <fieldset className="space-y-4 border-2 border-gray-700 p-5 rounded-xl bg-gray-900/50">
                            <legend className="text-xl font-bold text-primary px-3 text-primary-light">About Me</legend>
                            <FormTextarea label="Career Objective" name="careerObjective" value={formData.careerObjective} onChange={handleChange} />
                            <div className="space-y-4 pt-2">
                                <label className="block text-sm font-medium text-gray-300">Expertise Areas</label>
                                {formData.expertiseAreas.map((area, index) => (
                                    <div key={index} className="space-y-3 border border-gray-600 p-4 rounded-xl relative group bg-dark-bg/40">
                                        <FormInput label="Area Name" name="name" value={area.name} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
                                        <FormTextarea label="Area Description" name="description" value={area.description || ''} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
                                        <button onClick={() => handleDeleteItem('expertiseAreas', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-1.5 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><TrashIcon/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem('expertiseAreas')} className="w-full mt-2 px-4 py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-xl hover:bg-gray-800 hover:text-white transition-all font-medium">+ Add New Expertise</button>
                            </div>
                        </fieldset>
                    </div>
                    <div className="p-6 border-t border-gray-700 bg-gray-900 sticky bottom-0">
                        <button onClick={handleSave} className="w-full px-6 py-4 bg-primary text-white font-bold rounded-xl shadow-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95">Save All Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditorPanel;
