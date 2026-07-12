import React from 'react';
import { TabHeader, FormInput, FormTextarea } from './AdminUI';

interface SEOTabProps {
    formData: any;
    handleNestedChange: (section: string, e: any) => void;
    formErrors?: Record<string, string>;
}

const SEOTab: React.FC<SEOTabProps> = ({ formData, handleNestedChange, formErrors }) => {
    return (
        <div className="space-y-8 animate-fade-in text-zinc-100">
            <TabHeader 
                title="Global SEO Metadata" 
                description="Configure how your portfolio appears in search engine results and social media link previews." 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs Pane */}
                <div className="space-y-6">
                    <div className="space-y-4 border border-zinc-800 p-6 rounded-2xl bg-zinc-900/20 shadow-md">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-3 mb-4">Basic Metadata</h4>
                        <FormInput 
                            label="Site Title" 
                            name="siteTitle" 
                            value={formData.seoConfig?.siteTitle || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                        />
                        <FormTextarea 
                            label="Site Description" 
                            name="siteDescription" 
                            value={formData.seoConfig?.siteDescription || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                            rows={4}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput 
                                label="Canonical URL" 
                                name="canonicalUrl" 
                                value={formData.seoConfig?.canonicalUrl || ''} 
                                onChange={(e) => handleNestedChange('seoConfig', e)} 
                                placeholder="https://shariararafat.com"
                                error={formErrors?.['seoConfig.canonicalUrl']}
                            />
                            <FormInput 
                                label="Keywords (comma separated)" 
                                name="keywords" 
                                value={formData.seoConfig?.keywords || ''} 
                                onChange={(e) => handleNestedChange('seoConfig', e)} 
                                placeholder="React, Developer, Portfolio"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border border-zinc-800 p-6 rounded-2xl bg-zinc-900/20 shadow-md">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-3 mb-4">Social Sharing (Open Graph)</h4>
                        <FormInput 
                            label="Open Graph Image URL (1200x630)" 
                            name="ogImage" 
                            value={formData.seoConfig?.ogImage || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                            placeholder="https://yourdomain.com/og-image.jpg"
                            error={formErrors?.['seoConfig.ogImage']}
                        />
                        <FormInput 
                            label="Twitter Handle" 
                            name="twitterHandle" 
                            value={formData.seoConfig?.twitterHandle || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                            placeholder="@username"
                        />
                    </div>
                </div>

                {/* Previews Pane */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-3 mb-2">Live Search Previews</h4>
                    
                    {/* Google Search Preview */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Google Search Snippet</span>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-850 shadow-sm font-sans">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700">S</div>
                                <div className="text-xs text-zinc-400 truncate">{formData.seoConfig?.canonicalUrl || 'https://shariararafat.com'}</div>
                            </div>
                            <div className="text-lg text-[#8ab4f8] hover:underline cursor-pointer truncate font-medium">
                                {formData.seoConfig?.siteTitle || 'Shariar Arafat | Portfolio'}
                            </div>
                            <div className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                                {formData.seoConfig?.siteDescription || 'Portfolio of Shariar Arafat, showcasing my projects, skills, and experience.'}
                            </div>
                        </div>
                    </div>

                    {/* Twitter Card Preview */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Twitter Card Preview</span>
                        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40 font-sans shadow-lg max-w-full">
                            {formData.seoConfig?.ogImage ? (
                                <div className="w-full aspect-[1.91/1] bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
                                    <img src={formData.seoConfig.ogImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            ) : (
                                <div className="w-full aspect-[1.91/1] bg-zinc-950 border-b border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
                                    No Image Provided
                                </div>
                            )}
                            <div className="p-4 bg-zinc-900/90 border-t border-zinc-800/20">
                                <div className="text-zinc-500 text-xs truncate">{formData.seoConfig?.canonicalUrl?.replace(/^https?:\/\//, '') || 'shariararafat.com'}</div>
                                <div className="text-white font-bold truncate mt-1 text-sm">{formData.seoConfig?.siteTitle || 'Shariar Arafat | Portfolio'}</div>
                                <div className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed">{formData.seoConfig?.siteDescription || 'Portfolio of Shariar Arafat...'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOTab;
