
import React from 'react';
import type { CustomPage } from '../types';
import FadeIn from './FadeIn';

interface CustomPageRendererProps {
    page: CustomPage;
}

const CustomPageRenderer: React.FC<CustomPageRendererProps> = ({ page }) => {
    if (!page.visible) return null;

    const layoutClasses = {
        standard: 'max-w-5xl',
        narrow: 'max-w-3xl',
        wide: 'max-w-full px-4 md:px-12',
    }[page.layout] || 'max-w-5xl';

    const themeClasses = {
        default: 'bg-white dark:bg-dark-bg',
        glass: 'bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl',
        minimal: 'bg-transparent',
    }[page.theme] || 'bg-white dark:bg-dark-bg';

    return (
        <div className="min-h-screen pt-32 pb-20 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className={`container mx-auto px-6 ${layoutClasses}`}>
                <FadeIn direction="up">
                    <header className="mb-16 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                            {page.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                    </header>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                    <div className={`${themeClasses} p-8 md:p-16 relative overflow-hidden group`}>
                        {page.theme === 'glass' && (
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                        )}
                        
                        <div 
                            className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:text-gray-900 dark:prose-headings:text-white 
                                prose-p:text-gray-600 dark:prose-p:text-gray-400
                                prose-strong:text-gray-900 dark:prose-strong:text-white
                                prose-a:text-primary hover:prose-a:text-primary-dark transition-colors
                                prose-img:rounded-2xl prose-img:shadow-lg
                                prose-pre:bg-gray-900 dark:prose-pre:bg-black/40 prose-pre:border prose-pre:border-gray-800
                            "
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CustomPageRenderer;
