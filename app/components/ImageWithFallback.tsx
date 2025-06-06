'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import type { ImageProps } from '../../types/next-image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src?: string;
    fallbackSrc?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

/**
 * ImageWithFallback - A component that handles image loading with fallback
 * 
 * This component tries to load the main image, and if it fails,
 * it automatically switches to a fallback image.
 * 
 * It also supports blurhash placeholder for better user experience.
 */
export function ImageWithFallback({
    src,
    fallbackSrc = '/images/property-placeholder.jpg',
    alt = 'Imagem',
    width = 500,
    height = 300,
    className,
    priority = false,
    ...rest
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [isLoading, setIsLoading] = useState(true);

    // Reset the image source when component props change
    useEffect(() => {
        if (src) {
            setImgSrc(src);
        }
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            <Image
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                priority={priority}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setImgSrc(fallbackSrc);
                }}
                {...rest}
            />
        </div>
    );
}

/**
 * PropertyImage - Specifically optimized for property images
 * 
 * This component is a specialized version of ImageWithFallback
 * tailored for property listings.
 */
export function PropertyImage(props: ImageWithFallbackProps) {
    return (
        <ImageWithFallback
            fallbackSrc="/images/property-placeholder.jpg"
            {...props}
        />
    );
}
