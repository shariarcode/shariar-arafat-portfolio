import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import FadeIn from './FadeIn';

const GithubActivity: React.FC = () => {
    const { content } = usePortfolio();
    const { githubConfig } = content;
    
    // Fallback to legacy socialLinks.github if githubConfig is missing or username is empty
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const rawGithub = githubConfig?.username || content.socialLinks?.github;
        if (rawGithub) {
            try {
                // If it's a URL
                const url = new URL(rawGithub);
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                    setUsername(pathParts[0]);
                }
            } catch (e) {
                // If it's just a username
                const val = rawGithub.replace('/', '').trim();
                if (val && val !== '#') {
                    setUsername(val);
                }
            }
        }
    }, [githubConfig?.username, content.socialLinks?.github]);

    if (!username || username === '#') return null;

    const sectionTitle = githubConfig?.sectionTitle || "GitHub Contributions";
    const sectionDescription = githubConfig?.description || "Proof of continuous learning and building. I push code regularly.";

    return (
        <section id="github" className="py-20 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800 scroll-mt-20 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
             <div className="container mx-auto px-6 relative z-10">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold">Active Developer</span>
                        <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{sectionTitle}</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {sectionDescription}
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-4xl overflow-x-auto pb-4 custom-scrollbar">
                        <div className="min-w-[700px] bg-slate-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mx-auto transition-transform hover:-translate-y-1 shadow-md">
                             <img 
                                 src={`https://ghchart.rshah.org/6F42C1/${username}`} 
                                 alt={`${username}'s Github chart`} 
                                 className="w-full h-auto drop-shadow-sm dark:brightness-110 dark:contrast-125"
                                 loading="lazy"
                            />
                        </div>
                    </div>
                    
                    {(githubConfig?.showStats !== false || githubConfig?.showLanguages !== false) && (
                        <div className="mt-8 flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center md:items-stretch">
                            {githubConfig?.showStats !== false && (
                                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md p-2 hover:-translate-y-1 transition-transform">
                                     <img 
                                        src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=6F42C1&text_color=718096&icon_color=6F42C1`} 
                                        alt="GitHub Stats" 
                                        className="w-full h-full object-contain" 
                                        loading="lazy"
                                     />
                                </div>
                            )}
                            {githubConfig?.showLanguages !== false && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md p-2 hover:-translate-y-1 transition-transform w-[300px] shrink-0">
                                     <img 
                                        src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=6F42C1&text_color=718096`} 
                                        alt="Top Languages" 
                                        className="w-full h-full object-contain" 
                                        loading="lazy"
                                     />
                                </div>
                            )}
                        </div>
                    )}
                </FadeIn>
            </div>
        </section>
    );
};

export default GithubActivity;
