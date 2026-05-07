import React from 'react';
import { TabHeader, FormInput, FormTextarea } from './AdminUI';

interface SEOTabProps {
    formData: any;
    handleNestedChange: (section: string, e: any) => void;
}

const SEOTab: React.FC<SEOTabProps> = ({ formData, handleNestedChange }) => {
    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <TabHeader 
                title="Global SEO Metadata" 
                description="Configure how your portfolio appears in search engine results and social media link previews." 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50 shadow-lg">
                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Basic Metadata</h4>
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
                        />
                        <FormInput 
                            label="Canonical URL (e.g., https://yourdomain.com)" 
                            name="canonicalUrl" 
                            value={formData.seoConfig?.canonicalUrl || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                        />
                        <FormInput 
                            label="Keywords (comma separated)" 
                            name="keywords" 
                            value={formData.seoConfig?.keywords || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                        />
                    </div>

                    <div className="space-y-4 border border-gray-600 p-5 rounded-xl bg-gray-900/50 shadow-lg">
                        <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Social Sharing (Open Graph)</h4>
                        <FormInput 
                            label="Open Graph Image URL (1200x630)" 
                            name="ogImage" 
                            value={formData.seoConfig?.ogImage || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                            placeholder="https://..."
                        />
                        <FormInput 
                            label="Twitter Handle (e.g., @shariararafat)" 
                            name="twitterHandle" 
                            value={formData.seoConfig?.twitterHandle || ''} 
                            onChange={(e) => handleNestedChange('seoConfig', e)} 
                        />
                    </div>
                </div>

                {/* SEO Preview Widget */}
                <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Live Preview</h4>
                    
                    {/* Google Search Preview */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm font-sans">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 font-bold">G</div>
                            <div className="text-xs text-gray-700 truncate">{formData.seoConfig?.canonicalUrl || 'https://yourdomain.com'}</div>
                        </div>
                        <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                            {formData.seoConfig?.siteTitle || 'Your Site Title'}
                        </div>
                        <div className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">
                            {formData.seoConfig?.siteDescription || 'Your site description will appear here...'}
                        </div>
                    </div>

                    {/* Twitter Card Preview */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900 font-sans shadow-lg max-w-[400px]">
                        {formData.seoConfig?.ogImage ? (
                            <div className="w-full aspect-[1.91/1] bg-gray-800 border-b border-gray-700 relative overflow-hidden">
                                <img src={formData.seoConfig.ogImage} alt="OG" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        ) : (
                            <div className="w-full aspect-[1.91/1] bg-gray-800 border-b border-gray-700 flex items-center justify-center text-gray-500">
                                No Image Provided
                            </div>
                        )}
                        <div className="p-3 bg-gray-800">
                            <div className="text-gray-400 text-sm truncate">{formData.seoConfig?.canonicalUrl?.replace(/^https?:\/\//, '') || 'yourdomain.com'}</div>
                            <div className="text-white font-bold truncate mt-1">{formData.seoConfig?.siteTitle || 'Your Site Title'}</div>
                            <div className="text-gray-400 text-sm line-clamp-2 mt-1">{formData.seoConfig?.siteDescription || 'Your site description will appear here...'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOTab;
