'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { ImageProps } from '../../types/next-image';

interface OptimizedImagePlaceholderProps {
    src: string;
    fallbackSrc?: string;
    width?: number;
    height?: number;
    alt?: string;
    style?: React.CSSProperties;
    imageProps?: Partial<ImageProps>;
}

/**
 * PlaceholderImageFixer Component
 * 
 * This component helps fix the 404 error for property-placeholder.jpg
 * by dynamically selecting between SVG and JPG formats based on availability.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.src - Source URL of the image
 * @param {string} [props.fallbackSrc] - Fallback source if primary fails
 * @param {number} [props.width] - Width of the image
 * @param {number} [props.height] - Height of the image
 * @param {string} [props.alt] - Alt text for the image
 * @param {Object} [props.style] - Additional style properties
 * @param {Object} [props.imageProps] - Additional props for the Image component
 */
export function OptimizedImagePlaceholder({
    src,
    fallbackSrc = '/images/placeholder.svg',
    width = 300,
    height = 200,
    alt = 'Image placeholder',
    style = {},
    imageProps = {}
}: OptimizedImagePlaceholderProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const pathname = usePathname();

    // Check if the src is for property-placeholder.jpg and replace with SVG if necessary
    useEffect(() => {
        if (src === '/images/property-placeholder.jpg') {
            // Use SVG for placeholder instead which we know exists
            setImageSrc('/images/property-placeholder.svg');
        } else {
            setImageSrc(src);
        }
    }, [src, pathname]);

    return (
        <Image
            src={imageSrc}
            width={width}
            height={height}
            alt={alt}
            onError={() => setImageSrc(fallbackSrc)}
            style={{
                objectFit: 'cover',
                ...style
            }}
            {...imageProps}
        />
    );
}

/**
 * Use this hook to get a safe image URL that won't 404
 * 
 * @param {string} imageUrl - Original image URL
 * @param {string} fallbackUrl - Fallback URL if original fails
 * @returns {string} - Safe image URL
 */
export function useSafePlaceholderUrl(imageUrl: string, fallbackUrl: string = '/images/placeholder.svg') {
    const [safeUrl, setSafeUrl] = useState<string>(imageUrl);

    useEffect(() => {
        if (imageUrl === '/images/property-placeholder.jpg') {
            setSafeUrl('/images/property-placeholder.svg');
        } else {
            setSafeUrl(imageUrl);
        }
    }, [imageUrl]);

    return safeUrl;
}

export default OptimizedImagePlaceholder;

