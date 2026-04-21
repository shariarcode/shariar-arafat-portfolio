import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SearchIcon } from './Icons';
import FadeIn from './FadeIn';

const Blog: React.FC = () => {
    const { content } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState('');
    const posts = content.blogPosts || [];
    if (posts.length === 0) return null;

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const query = searchQuery.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            (post.content && post.content.some((c: string) => c.toLowerCase().includes(query)))
        );
    }, [posts, searchQuery]);

    return (
        <section id="blog" className="py-20 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800 scroll-mt-20">
            <div className="container mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold">Insights</span>
                        <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">Latest Articles</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Practical notes from projects, design decisions, and development workflows.
                        </p>
                    </div>
                </FadeIn>

                {posts.length > 3 && (
                    <FadeIn direction="up" delay={0.1}>
                        <div className="max-w-md mx-auto mb-10">
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                )}

                {filteredPosts.length === 0 ? (
                    <FadeIn direction="up">
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No articles found matching "{searchQuery}"
                            </p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-primary hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => (
                            (() => {
                                const href = post.url || `/blog/${post.slug}`;
                                const isInternal = href.startsWith('/');
                                return (
                            <FadeIn key={post.slug || index} direction="up" delay={index * 0.1}>
                                <article className="h-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-shadow">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.date} • {post.readTime}</p>
                                    <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                                    <p className="mt-3 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                                    {href && (
                                        <a
                                            href={href}
                                            target={isInternal ? undefined : '_blank'}
                                            rel={isInternal ? undefined : 'noopener noreferrer'}
                                            className="inline-block mt-5 text-primary font-semibold hover:underline"
                                        >
                                            Read article
                                        </a>
                                    )}
                                </article>
                            </FadeIn>
                                );
                            })()
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;
