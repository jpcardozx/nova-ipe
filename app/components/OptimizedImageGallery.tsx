'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SanityImage from '@/app/components/SanityImage';
import { cn } from '@/lib/utils';
import { getOptimalImageDimensions, generateLowQualityPlaceholder } from '@/lib/image-performance-optimizer';

interface OptimizedImageGalleryProps {
    images: Array<string | { url: string; alt?: string }>;
    image?: {
        url?: string;
        alt?: string;
        asset?: {
            _ref?: string;
            url?: string;
        };
    }; // Sanity image reference with more specific type
    alt: string;
    height?: number;
    width?: number;
    priority?: boolean;
    eager?: boolean;
    onLoad?: () => void;
    className?: string;
    showControls?: boolean;
    objectFit?: 'cover' | 'contain' | 'fill';
    sizes?: string;
}

/**
 * OptimizedImageGallery - Um componente de galeria de imagens altamente otimizado
 * que suporta tanto URLs de imagem diretas quanto referências do Sanity CMS
 */
export default function OptimizedImageGallery({
    images = [],
    image,
    alt,
    height,
    width,
    priority = false,
    eager = false,
    onLoad,
    className = '',
    showControls = false,
    objectFit = 'cover',
    sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
}: OptimizedImageGalleryProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    // Calculate optimal dimensions based on viewport
    const [imageDimensions, setImageDimensions] = useState({
        width: width || 800,
        height: height || 600,
    });

    // Initialize with available images
    const [allImages, setAllImages] = useState<string[]>([]);

    useEffect(() => {
        // Combine direct image URLs with Sanity image if present
        let imageUrls: string[] = [];

        // Add direct URLs from images prop
        if (images && images.length > 0) {
            imageUrls = images.map(img => typeof img === 'string' ? img : img.url);
        }

        // If we have a Sanity image reference but no direct URLs yet
        if (image && !imageUrls.length) {
            const sanityUrl = typeof image === 'string' ? image : image?.url;
            if (sanityUrl) imageUrls.push(sanityUrl);
        }

        // If we still have no images, use placeholder
        if (imageUrls.length === 0) {
            imageUrls.push('/placeholder.png');
        }

        setAllImages(imageUrls.filter(Boolean));
    }, [images, image]);

    // Handle browser resize for responsive dimensions
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const viewport = window.innerWidth;
            const optimalDims = getOptimalImageDimensions(viewport);

            setImageDimensions({
                width: width || optimalDims.card.width,
                height: height || optimalDims.card.height,
            });
        };

        handleResize(); // Run once on mount

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width, height]);

    // Generate placeholder
    const placeholder = generateLowQualityPlaceholder(
        imageDimensions.width,
        imageDimensions.height
    );

    // Determine loading strategy
    const loading = priority || eager ? 'eager' : 'lazy';

    const handleImageLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    // Navigation functions
    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div
            ref={ref}
            className={cn('relative overflow-hidden', className)}
            data-component="optimized-image-gallery"
        >
            {/* Loading skeleton */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-neutral-200 animate-pulse"
                    style={{
                        width: imageDimensions.width || '100%',
                        height: imageDimensions.height || 300
                    }}
                />
            )}

            {/* Image display with transitions */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Use SanityImage for Sanity assets */}
                    {image && !allImages[currentImage] ? (
                        <SanityImage
                            image={image}
                            alt={alt}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            priority={priority}
                            eager={eager}
                            loading={loading}
                            className={cn(
                                'transition-opacity duration-300',
                                isLoaded ? 'opacity-100' : 'opacity-0',
                                objectFit === 'cover' && 'object-cover',
                                objectFit === 'contain' && 'object-contain'
                            )}
                            sizes={sizes}
                            onLoad={handleImageLoad}
                        />
                    ) : (
                        /* Use standard Image for direct URLs */
                        <Image
                            src={allImages[currentImage]}
                            alt={alt}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            priority={priority}
                            loading={loading}
                            className={cn(
                                'transition-opacity duration-300',
                                isLoaded ? 'opacity-100' : 'opacity-0',
                                objectFit === 'cover' && 'object-cover',
                                objectFit === 'contain' && 'object-contain'
                            )}
                            sizes={sizes}
                            onLoad={handleImageLoad}
                            placeholder="blur"
                            blurDataURL={placeholder}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Gallery controls */}
            {showControls && allImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {allImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={cn(
                                'transition-all rounded-full',
                                idx === currentImage
                                    ? 'w-4 h-2 bg-white shadow-md'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            )}
                            aria-label={`Ver imagem ${idx + 1} de ${allImages.length}`}
                            aria-current={idx === currentImage ? "true" : "false"}
                        />
                    ))}
                </div>
            )}

            {/* Navigation arrows for desktop */}
            {showControls && allImages.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white transition-all hidden md:block"
                        aria-label="Imagem anterior"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white transition-all hidden md:block"
                        aria-label="Próxima imagem"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
