import React from 'react';
import type { PortfolioData } from '../types';
import FadeIn from './FadeIn';

interface BlogProps {
    content: PortfolioData;
}

const Blog: React.FC<BlogProps> = ({ content }) => {
    const posts = content.blogPosts || [];
    if (posts.length === 0) return null;

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        (() => {
                            const href = post.url || `/blog/${post.slug}`;
                            const isInternal = href.startsWith('/');
                            return (
                        <FadeIn key={index} direction="up" delay={index * 0.1}>
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
            </div>
        </section>
    );
};

export default Blog;
