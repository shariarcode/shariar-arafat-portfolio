import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
    aspectRatio?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    priority = false,
    aspectRatio
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    return (
        <div 
            className={`relative overflow-hidden ${aspectRatio ? '' : 'w-full h-full'} ${className}`}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            {/* Placeholder skeleton */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 dark:from-gray-700 via-gray-100 dark:via-gray-600 to-gray-200 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]" />
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Image unavailable</span>
                </div>
            )}

            {/* Main image */}
            <motion.img
                src={src}
                alt={alt}
                loading={loading}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'auto'}
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                style={{ 
                    aspectRatio: aspectRatio ? undefined : undefined
                }}
            />

            {/* Fade in animation */}
            {isLoaded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none"
                />
            )}
        </div>
    );
};

export default OptimizedImage;

export const getOptimizedImageUrl = (url: string, width = 800): string => {
    if (!url) return '';
    
    if (url.includes('unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${width}&q=80&auto=format&fit=crop`;
    }
    
    if (url.includes('pravatar.cc')) {
        return url;
    }
    
    return url;
};