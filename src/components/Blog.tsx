import React, { useState, useMemo, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SearchIcon } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Blog: React.FC = () => {
    const { content } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const posts = content.blogPosts || [];

    // Trigger grid items fade-in on scroll
    useEffect(() => {
        if (posts.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.blog-reveal-header',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.blog-reveal-header',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo('.blog-card-item',
                { opacity: 0, y: 40, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.blog-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const query = searchQuery.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            (post.content && post.content.some((c: string) => c.toLowerCase().includes(query)))
        );
    }, [posts, searchQuery]);

    if (posts.length === 0) return null;

    return (
        <section ref={containerRef} id="blog" className="py-24 bg-white dark:bg-dark-bg border-y border-gray-100/50 dark:border-gray-900/50 scroll-mt-20 transition-colors duration-300 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="blog-reveal-header text-center mb-16">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Insights</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-gray-900 dark:text-white tracking-tight">Latest Articles</h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
                        Practical thoughts on design systems, code architecture, and client engineering workflows.
                    </p>
                </div>

                {posts.length > 3 && (
                    <div className="max-w-md mx-auto mb-12">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-dark-card border border-gray-200/50 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold uppercase tracking-wider"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No articles found matching "{searchQuery}"
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary font-bold hover:underline"
                            data-magnetic
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => {
                            const href = post.url || `/blog/${post.slug}`;
                            const isInternal = href.startsWith('/');
                            return (
                                <article 
                                    key={post.slug || index} 
                                    className="blog-card-item h-full flex flex-col rounded-3xl border border-gray-200/50 dark:border-gray-800/80 bg-slate-50/50 dark:bg-dark-card/50 p-8 hover:-translate-y-1.5 transition-all duration-350 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_35px_rgba(111,66,193,0.07)] group"
                                >
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{post.date} • {post.readTime}</p>
                                    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm flex-1 font-medium">{post.excerpt}</p>
                                    {href && (
                                        <a
                                            href={href}
                                            target={isInternal ? undefined : '_blank'}
                                            rel={isInternal ? undefined : 'noopener noreferrer'}
                                            className="inline-flex items-center gap-1 mt-6 text-primary font-bold text-xs uppercase tracking-wider hover:text-primary-dark transition-colors duration-300"
                                            data-magnetic
                                        >
                                            Read Article <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </a>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;
