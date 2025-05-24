'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import type { ImageProps } from '../../types/next-image';
// Define types for Next.js images
interface StaticRequire {
    default: StaticImageData
}
type StaticImageData = {
    src: string
    height: number
    width: number
    blurDataURL?: string
    blurWidth?: number
    blurHeight?: number
}
type StaticImport = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
};

interface UltraOptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
    blurDataURL?: string;
    lowQualitySrc?: string;
    fallbackSrc?: string;
    preventCLS?: boolean;
    loadingPriority?: 'high' | 'medium' | 'low';
    onLoadComplete?: () => void;
}

/**
 * UltraOptimizedImage Component
 * 
 * An advanced image component with progressive loading, blur-up effect,
 * intersection observer-based loading, and fallback handling.
 *
 * Features:
 * - Progressive loading with blur-up effect
 * - Low-quality image placeholder
 * - Intelligent lazy loading based on viewport
 * - CLS prevention
 * - Comprehensive error handling
 * - Performance metrics
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */
export function UltraOptimizedImage({
    src,
    alt = '',
    width,
    height,
    blurDataURL,
    lowQualitySrc,
    fallbackSrc = '/images/placeholder.svg',
    sizes = '100vw',
    priority = false,
    loadingPriority = 'medium',
    preventCLS = true,
    className = '',
    onLoadComplete,
    ...props
}: UltraOptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

    // Configure threshold based on loading priority
    const thresholdMap = {
        high: 0,      // Load immediately when any part is visible
        medium: 0.1,  // Load when 10% is visible
        low: 0.5      // Load when 50% is visible
    };

    // Only use intersection observer if not priority
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
        threshold: thresholdMap[loadingPriority],
        skip: priority, // Skip observer for priority images
    });

    // Set up loading when in view
    useEffect(() => {
        if (priority || inView) {
            setLoadStartTime(performance.now());
        }
    }, [inView, priority]);

    // Handle loading complete
    const handleLoadComplete = () => {
        setIsLoaded(true);

        // Record performance metrics
        if (loadStartTime) {
            const loadTime = performance.now() - loadStartTime;
            console.debug(`Image loaded: ${typeof src === 'string' ? src : 'object'} (${Math.round(loadTime)}ms)`);

            // Report to analytics if load time is concerning
            if (loadTime > 3000) {
                // Consider reporting slow image loads to analytics
            }
        }

        onLoadComplete?.();
    };

    // Handle load errors
    const handleError = () => {
        console.warn(`Failed to load image: ${typeof src === 'string' ? src : 'object'}`);
        setError(true);

        // Try low quality version first
        if (lowQualitySrc && imgSrc !== lowQualitySrc) {
            console.debug('Trying low quality version...');
            setImgSrc(lowQualitySrc);
        }
        // Fall back to default if that also fails or no low quality version
        else if (fallbackSrc && imgSrc !== fallbackSrc) {
            console.debug('Using fallback image');
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <div
            ref={ref}
            className={`relative ${className}`}
            style={{
                position: 'relative',
                ...(preventCLS && width && height ? {
                    aspectRatio: `${width} / ${height}`
                } : {})
            }}
        >
            {(priority || inView) && (
                <Image
                    src={imgSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    sizes={sizes}
                    priority={priority}
                    placeholder={blurDataURL ? "blur" : "empty"}
                    blurDataURL={blurDataURL}
                    onLoad={handleLoadComplete}
                    onError={handleError}
                    className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    {...props}
                />
            )}

            {/* Show placeholder while image is loading */}
            {(!isLoaded && (priority || inView)) && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined
                    }}
                />
            )}

            {/* Show placeholder when not in view yet */}
            {!priority && !inView && (
                <div
                    className="absolute inset-0 bg-gray-100"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined
                    }}
                />
            )}
        </div>
    );
}

export default UltraOptimizedImage;
