import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SearchIcon, XIcon, ArrowRightIcon } from './Icons';
import FadeIn from './FadeIn';

interface SearchResult {
    type: 'blog' | 'project' | 'service';
    title: string;
    description: string;
    url: string;
}

const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { content } = usePortfolio();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const searchData: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        content.blogPosts?.forEach(post => {
            if (post.title.toLowerCase().includes(lowerQuery) || 
                post.excerpt.toLowerCase().includes(lowerQuery)) {
                searchData.push({
                    type: 'blog',
                    title: post.title,
                    description: post.excerpt,
                    url: post.url || `/blog/${post.slug}`
                });
            }
        });

        content.projectsData?.forEach(project => {
            if (project.title.toLowerCase().includes(lowerQuery) || 
                project.description.toLowerCase().includes(lowerQuery)) {
                searchData.push({
                    type: 'project',
                    title: project.title,
                    description: project.description,
                    url: project.liveUrl || '#'
                });
            }
        });

        content.skillsData?.forEach(skill => {
            if (skill.name.toLowerCase().includes(lowerQuery)) {
                searchData.push({
                    type: 'service',
                    title: skill.name,
                    description: skill.description,
                    url: '#skills'
                });
            }
        });

        setResults(searchData);
    }, [query, content]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <FadeIn>
                <div className="relative bg-white dark:bg-dark-card rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search blogs, projects, services..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <XIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    
                    {results.length > 0 && (
                        <div className="max-h-96 overflow-y-auto p-2">
                            {results.map((result, index) => (
                                <a
                                    key={index}
                                    href={result.url}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={onClose}
                                >
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                        result.type === 'blog' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                        result.type === 'project' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                    }`}>
                                        {result.type}
                                    </span>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{result.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{result.description}</p>
                                    </div>
                                    <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                                </a>
                            ))}
                        </div>
                    )}

                    {query.length >= 2 && results.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No results found for "{query}"
                        </div>
                    )}

                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> to close
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

const SearchButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">⌘K</kbd>
            </button>
            <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default SearchButton;