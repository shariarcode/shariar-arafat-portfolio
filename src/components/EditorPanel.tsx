import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { CloseIcon } from './Icons';
import { storage } from '../../lib/firebase';
// Standard Firebase v9+ storage modular imports
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EditorPanelProps {
    data: PortfolioData;
    onSave: (newData: PortfolioData) => void;
    onClose: () => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input 
            type="text" 
            id={name}
            name={name} 
            value={value} 
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary"
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
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-primary focus:border-primary"
        />
    </div>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const EditorPanel: React.FC<EditorPanelProps> = ({ data, onSave, onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState(() => {
        const serializableData = JSON.parse(JSON.stringify(data));
        serializableData.heroRoles = Array.isArray(data.heroRoles) ? data.heroRoles.join(', ') : '';
        return serializableData;
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileName = `${Date.now()}-${file.name}`;
        // Using modular ref from firebase/storage
        const storageRef = ref(storage, `portfolio-images/${fileName}`);
        
        setIsUploading(true);
        try {
            // Using modular uploadBytes and getDownloadURL
            const snapshot = await uploadBytes(storageRef, file);
            const publicUrl = await getDownloadURL(snapshot.ref);
            setFormData(prev => ({ ...prev, heroImage: publicUrl }));
        } catch (error: any) {
            console.error('Error uploading image to Firebase:', error);
            alert(`Error uploading image: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[99]">
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-card shadow-2xl z-[100] transform transition-transform translate-x-0">
                <div className="h-full flex flex-col">
                    <div className="p-6 flex justify-between items-center border-b border-gray-700 bg-gray-900">
                        <h2 className="text-2xl font-bold text-white">Content Editor</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-300 hover:bg-gray-700"><CloseIcon /></button>
                    </div>
                    <div className="flex-grow p-6 overflow-y-auto space-y-6 text-white">
                        <fieldset className="space-y-4 border-2 border-gray-700 p-4 rounded-lg">
                            <legend className="text-xl font-semibold text-primary px-2">Hero Section</legend>
                            <FormInput label="Name" name="userName" value={formData.userName} onChange={handleChange} />
                             <div>
                                <label htmlFor="heroImage" className="block text-sm font-medium text-gray-400 mb-1">Hero Image</label>
                                <div className="mt-2 flex items-center gap-4">
                                    <img src={formData.heroImage} alt="Preview" className="w-16 h-16 rounded-full object-cover bg-gray-700" />
                                    <input type="file" id="heroImage" name="heroImage" onChange={handleImageChange} accept="image/*" disabled={isUploading} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer disabled:opacity-50"/>
                                </div>
                                {isUploading && <p className="text-sm text-primary-light mt-2">Uploading...</p>}
                            </div>
                            <FormInput label="Roles (comma separated)" name="heroRoles" value={formData.heroRoles} onChange={handleChange} />
                            <FormTextarea label="Subheading" name="heroSubheading" value={formData.heroSubheading} onChange={handleChange} />
                        </fieldset>
                        <fieldset className="space-y-4 border-2 border-gray-700 p-4 rounded-lg">
                            <legend className="text-xl font-semibold text-primary px-2">About / Expertise</legend>
                            <FormTextarea label="Career Objective" name="careerObjective" value={formData.careerObjective} onChange={handleChange} />
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-300">Expertise Areas</label>
                                {formData.expertiseAreas.map((area, index) => (
                                    <div key={index} className="space-y-2 border border-gray-600 p-3 rounded-md relative">
                                        <FormInput label="Area Name" name="name" value={area.name} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
                                        <FormTextarea label="Area Description" name="description" value={area.description || ''} onChange={(e) => handleArrayChange('expertiseAreas', index, e)} />
                                        <button onClick={() => handleDeleteItem('expertiseAreas', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 bg-gray-700 rounded-full"><TrashIcon/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem('expertiseAreas')} className="w-full mt-2 px-4 py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">+ Add Area</button>
                            </div>
                        </fieldset>
                        <fieldset className="space-y-4 border-2 border-gray-700 p-4 rounded-lg">
                            <legend className="text-xl font-semibold text-primary px-2">Projects</legend>
                            {formData.projectsData.map((project, index) => (
                                <div key={index} className="space-y-3 border border-gray-600 p-3 rounded-md relative">
                                    <h4 className="font-semibold text-gray-300">Project {index + 1}</h4>
                                    <FormInput label="Project Title" name="title" value={project.title} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                    <FormTextarea label="Project Description" name="description" value={project.description} onChange={(e) => handleArrayChange('projectsData', index, e)} />
                                    <button onClick={() => handleDeleteItem('projectsData', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 bg-gray-700 rounded-full"><TrashIcon/></button>
                                </div>
                            ))}
                            <button onClick={() => handleAddItem('projectsData')} className="w-full mt-2 px-4 py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">+ Add Project</button>
                        </fieldset>
                    </div>
                    <div className="p-6 border-t border-gray-700 bg-gray-900">
                        <button onClick={handleSave} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditorPanel;
