import React, { useEffect } from 'react';
import type { BlogPost } from '../types';
import { removeJsonLd, setJsonLd, setSeoMeta } from '../lib/seo';

interface BlogPostPageProps {
    post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
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

        return () => {
            removeJsonLd('blog-post');
        };
    }, [post]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-dark-bg py-16 px-6">
            <article className="max-w-3xl mx-auto bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 md:p-10">
                <a href="/" className="text-primary hover:underline font-medium">
                    ← Back to homepage
                </a>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">{post.date} • {post.readTime}</p>
                <h1 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                <div className="mt-8 space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {post.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>
        </main>
    );
};

export default BlogPostPage;
