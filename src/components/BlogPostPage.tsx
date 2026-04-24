import React, { useEffect } from 'react';
import type { BlogPost } from '../types';
import { removeJsonLd, setJsonLd, setSeoMeta } from '../lib/seo';
import { TwitterIcon, LinkedInIcon, FacebookIcon } from './Icons';

interface BlogPostPageProps {
    post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.title;

    useEffect(() => {
        const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
        setSeoMeta({
            title: `${post.title} | Shariar Arafat`,
            description: post.excerpt,
            canonicalUrl,
            imageUrl: `${window.location.origin}/og-image.jpg`,
        });

        setJsonLd('blog-post', {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
                '@type': 'Person',
                name: 'Shariar Arafat',
            },
            mainEntityOfPage: canonicalUrl,
            url: canonicalUrl,
        });

        window.scrollTo(0, 0);

        return () => {
            removeJsonLd('blog-post');
        };
    }, [post]);

    const shareActions = [
        { 
            name: 'Twitter', 
            icon: <TwitterIcon className="w-5 h-5" />, 
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#1DA1F2]'
        },
        { 
            name: 'LinkedIn', 
            icon: <LinkedInIcon className="w-5 h-5" />, 
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#0A66C2]'
        },
        { 
            name: 'Facebook', 
            icon: <FacebookIcon className="w-5 h-5" />, 
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: 'hover:text-[#1877F2]'
        },
    ];

    return (
        <div className="pt-24 pb-16 px-6">
            <article className="max-w-3xl mx-auto bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
                <div className="p-8 md:p-12">
                    <a href="/" className="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-colors mb-8 group">
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                        Back to homepage
                    </a>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium text-primary">Blog Post</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
                        {post.excerpt}
                    </p>

                    <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none">
                        {post.content.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                                Share this article
                            </h4>
                            <div className="flex items-center gap-4">
                                {shareActions.map((action) => (
                                    <a
                                        key={action.name}
                                        href={action.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-3 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${action.color}`}
                                        title={`Share on ${action.name}`}
                                    >
                                        {action.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">Written By</p>
                                <p className="font-bold text-gray-900 dark:text-white">Shariar Arafat</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                                <div className="w-full h-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center font-bold text-primary">
                                    SA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;
