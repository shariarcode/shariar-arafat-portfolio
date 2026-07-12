import React from 'react';
import { TabHeader } from './AdminUI';

interface DashboardTabProps {
    formData: any;
    setActiveTab: (tab: any) => void;
    fetchInbox: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ formData, setActiveTab, fetchInbox }) => {
    return (
        <div className="space-y-8 animate-fade-in text-zinc-100">
            <TabHeader title="Dashboard Overview" description="Manage and view the health, content stats, and shortcuts of your CMS." />
            
            {/* Quick Stats Grid - Bento Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Projects</span>
                    <span className="text-4xl font-extrabold text-white mt-4">{formData.projectsData?.length || 0}</span>
                </div>
                <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Blog Posts</span>
                    <span className="text-4xl font-extrabold text-white mt-4">{formData.blogPosts?.length || 0}</span>
                </div>
                <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Testimonials</span>
                    <span className="text-4xl font-extrabold text-white mt-4">{formData.testimonials?.length || 0}</span>
                </div>
                <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Custom Pages</span>
                    <span className="text-4xl font-extrabold text-white mt-4">{formData.customPages?.length || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Site Health Monitor */}
                <div className="space-y-4 border border-zinc-800 p-6 rounded-2xl bg-zinc-900/20 shadow-md">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Site Configuration Health</h4>
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    
                    <div className="space-y-3">
                        {!formData.resumeUrl && (
                            <div className="flex items-start gap-3 text-amber-400 bg-amber-950/15 p-4 rounded-xl border border-amber-500/25">
                                <span className="text-base mt-0.5">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Missing Resume URL</p>
                                    <p className="text-xs text-amber-500/90 mt-1 leading-relaxed">Download CV links in the Hero & About sections are disabled.</p>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all ml-2" data-magnetic>Fix</button>
                            </div>
                        )}
                        {(!formData.projectsData || formData.projectsData.length === 0) && (
                            <div className="flex items-start gap-3 text-amber-400 bg-amber-950/15 p-4 rounded-xl border border-amber-500/25">
                                <span className="text-base mt-0.5">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">No Projects Registered</p>
                                    <p className="text-xs text-amber-500/90 mt-1 leading-relaxed">The Work showcase section on the homepage is currently empty.</p>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); setActiveTab('work'); }} className="text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all ml-2" data-magnetic>Add</button>
                            </div>
                        )}
                        {(!formData.heroImage || formData.heroImage.includes('placeholder')) && (
                            <div className="flex items-start gap-3 text-amber-400 bg-amber-950/15 p-4 rounded-xl border border-amber-500/25">
                                <span className="text-base mt-0.5">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Placeholder Hero Avatar</p>
                                    <p className="text-xs text-amber-500/90 mt-1 leading-relaxed">The main page is using a fallback placeholder profile image.</p>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all ml-2" data-magnetic>Update</button>
                            </div>
                        )}
                        {formData.resumeUrl && formData.projectsData?.length > 0 && formData.heroImage && !formData.heroImage.includes('placeholder') && (
                            <div className="flex items-start gap-3 text-emerald-400 bg-emerald-950/15 p-4 rounded-xl border border-emerald-500/25">
                                <span className="text-base mt-0.5">✓</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Core Profile Configured</p>
                                    <p className="text-xs text-emerald-500/90 mt-1 leading-relaxed">Your main sections and profile media assets look complete and ready.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6 border border-zinc-800 p-6 rounded-2xl bg-zinc-900/20 shadow-md">
                    <div>
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Quick Actions</h4>
                        </div>
                        <p className="text-xs text-zinc-500 mb-2 leading-relaxed">
                            Jump straight to editing specific areas or perform manual updates below.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3.5">
                        <button 
                            onClick={(e) => { e.preventDefault(); setActiveTab('blog'); }} 
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-center transition-all duration-200 group min-h-[80px]"
                            data-magnetic
                        >
                            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📝</span>
                            <span className="text-xs font-bold text-zinc-300">Add Blog Post</span>
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); setActiveTab('work'); }} 
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-center transition-all duration-200 group min-h-[80px]"
                            data-magnetic
                        >
                            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">💼</span>
                            <span className="text-xs font-bold text-zinc-300">Add Project</span>
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); setActiveTab('inbox'); fetchInbox(); }} 
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-center transition-all duration-200 group min-h-[80px]"
                            data-magnetic
                        >
                            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📥</span>
                            <span className="text-xs font-bold text-zinc-300">Check Inbox</span>
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); setActiveTab('pages'); }} 
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-center transition-all duration-200 group min-h-[80px]"
                            data-magnetic
                        >
                            <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📄</span>
                            <span className="text-xs font-bold text-zinc-300">Edit Pages</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
