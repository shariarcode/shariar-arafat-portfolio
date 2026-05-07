import React from 'react';
import { TabHeader } from './AdminUI';

interface DashboardTabProps {
    formData: any;
    setActiveTab: (tab: any) => void;
    fetchInbox: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ formData, setActiveTab, fetchInbox }) => {
    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <TabHeader title="Dashboard Overview" />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-3xl font-bold text-white mb-1">{formData.projectsData?.length || 0}</span>
                    <span className="text-sm text-gray-400">Projects</span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-3xl font-bold text-white mb-1">{formData.blogPosts?.length || 0}</span>
                    <span className="text-sm text-gray-400">Blog Posts</span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-3xl font-bold text-white mb-1">{formData.testimonials?.length || 0}</span>
                    <span className="text-sm text-gray-400">Testimonials</span>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-3xl font-bold text-white mb-1">{formData.customPages?.length || 0}</span>
                    <span className="text-sm text-gray-400">Custom Pages</span>
                </div>
            </div>

            {/* Site Health */}
            <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Site Health</h4>
                <div className="space-y-3">
                    {!formData.resumeUrl && (
                        <div className="flex items-center gap-3 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                            <span>⚠️</span>
                            <span className="text-sm">No Resume URL set. Download buttons will be disabled.</span>
                            <button onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="ml-auto text-xs underline hover:text-yellow-300">Fix now</button>
                        </div>
                    )}
                    {(!formData.projectsData || formData.projectsData.length === 0) && (
                        <div className="flex items-center gap-3 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                            <span>⚠️</span>
                            <span className="text-sm">No projects added yet. The Work section will be empty.</span>
                            <button onClick={(e) => { e.preventDefault(); setActiveTab('work'); }} className="ml-auto text-xs underline hover:text-yellow-300">Add projects</button>
                        </div>
                    )}
                    {(!formData.heroImage || formData.heroImage.includes('placeholder')) && (
                        <div className="flex items-center gap-3 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                            <span>⚠️</span>
                            <span className="text-sm">Using a placeholder profile image.</span>
                            <button onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="ml-auto text-xs underline hover:text-yellow-300">Update image</button>
                        </div>
                    )}
                    {formData.resumeUrl && formData.projectsData?.length > 0 && formData.heroImage && !formData.heroImage.includes('placeholder') && (
                        <div className="flex items-center gap-3 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                            <span>✅</span>
                            <span className="text-sm">All core profile data looks great! Your portfolio is ready for visitors.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Quick Actions</h4>
                <div className="flex flex-wrap gap-4">
                    <button onClick={(e) => { e.preventDefault(); setActiveTab('blog'); }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-white transition-colors shadow-sm">
                        📝 Add Blog Post
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setActiveTab('work'); }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-white transition-colors shadow-sm">
                        💼 Add Project
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setActiveTab('inbox'); fetchInbox(); }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-white transition-colors shadow-sm">
                        📥 Check Inbox
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setActiveTab('pages'); }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-white transition-colors shadow-sm">
                        📄 Edit Pages
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
