/**
 * Enhanced Sanity Image Utilities
 * Provides robust image processing functionality with improved error handling,
 * responsive image generation, and detailed diagnostics.
 */

import { ImageType } from '../app/PropertyTypeFix';
import { extractImageUrl, extractAltText } from './image-sanity';

/**
 * Interface for normalized image data
 */
export interface EnhancedSanityImage {
    url: string;
    alt: string;
    responsiveUrls?: {
        small: string;
        medium: string;
        large: string;
        original: string;
    };
    hotspot?: {
        x: number;
        y: number;
    };
    aspectRatio?: number;
    dimensions?: {
        width: number;
        height: number;
    };
    blurDataUrl?: string;
}

/**
 * Configuration options for image processing
 */
interface ImageProcessingOptions {
    quality?: number;
    generateBlurHash?: boolean;
    sizes?: {
        small: number;
        medium: number;
        large: number;
    };
}

const defaultOptions: ImageProcessingOptions = {
    quality: 80,
    generateBlurHash: true,
    sizes: {
        small: 400,
        medium: 800,
        large: 1200
    }
};

/**
 * Processes a Sanity image and returns an enhanced image object with fallback handling
 * and responsive variants
 * 
 * @param image Sanity image object in any format
 * @param altText Default alt text to use when not available in the image
 * @param options Processing configuration options
 * @returns Enhanced image object with multiple sizes and fallback handling
 */
export function processEnhancedSanityImage(
    image: ImageType,
    altText: string = 'Imagem',
    options: Partial<ImageProcessingOptions> = {}
): EnhancedSanityImage {
    try {
        // Merge options with defaults
        const config = { ...defaultOptions, ...options };

        // Debug image structure (removed debug call)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Enhanced Image] Processing image:', image);
        }

        // Handle null/undefined image
        if (!image) {
            console.log('[Enhanced Image] Image is null or undefined, using fallback');
            return createFallbackImage(altText);
        }

        // Extract base URL and alt text
        const baseUrl = extractImageUrl(image);
        const imageAlt = extractAltText(image) || altText;

        if (!baseUrl) {
            console.warn('[Enhanced Image] Failed to extract URL, using fallback');
            return createFallbackImage(imageAlt);
        }

        // Extract hotspot if available
        let hotspot;
        if (typeof image === 'object' && image && 'hotspot' in image && image.hotspot) {
            hotspot = {
                x: image.hotspot.x,
                y: image.hotspot.y
            };
        }

        // Generate responsive URLs
        const responsiveUrls = generateResponsiveUrls(baseUrl, config);

        // Generate blur data URL for image placeholders (if enabled)
        const blurDataUrl = config.generateBlurHash ? generateBlurDataUrl(baseUrl) : undefined;

        return {
            url: baseUrl,
            alt: imageAlt,
            responsiveUrls,
            hotspot,
            blurDataUrl
        };
    } catch (error) {
        console.error('[Enhanced Image] Error processing image:', error);
        return createFallbackImage(altText);
    }
}

/**
 * Creates a fallback image object when the original cannot be processed
 */
function createFallbackImage(alt: string): EnhancedSanityImage {
    const fallbackUrl = '/images/property-placeholder.jpg';
    return {
        url: fallbackUrl,
        alt,
        responsiveUrls: {
            small: fallbackUrl,
            medium: fallbackUrl,
            large: fallbackUrl,
            original: fallbackUrl
        }
    };
}

/**
 * Generates responsive image URLs for different viewport sizes
 */
function generateResponsiveUrls(
    baseUrl: string,
    options: ImageProcessingOptions
): EnhancedSanityImage['responsiveUrls'] {
    try {
        // For non-Sanity URLs, return the original URL for all sizes
        if (!baseUrl.includes('cdn.sanity.io')) {
            return {
                small: baseUrl,
                medium: baseUrl,
                large: baseUrl,
                original: baseUrl
            };
        }        // For Sanity URLs, apply width and quality parameters
        const { sizes, quality } = options;
        const addParams = (url: string, size: number): string => {
            // Parse existing URL
            const urlObj = new URL(url);

            // Add or update width and quality parameters
            urlObj.searchParams.set('w', size.toString());
            if (quality !== undefined) {
                urlObj.searchParams.set('q', quality.toString());
            }
            urlObj.searchParams.set('auto', 'format'); return urlObj.toString();
        };

        return {
            small: addParams(baseUrl, sizes?.small || 400),
            medium: addParams(baseUrl, sizes?.medium || 800),
            large: addParams(baseUrl, sizes?.large || 1200),
            original: baseUrl
        };
    } catch (error) {
        console.error('[Enhanced Image] Error generating responsive URLs:', error);
        return {
            small: baseUrl,
            medium: baseUrl,
            large: baseUrl,
            original: baseUrl
        };
    }
}

/**
 * Generates a blur data URL for image placeholders
 * This is a simple implementation - in production, you might want to use
 * a more sophisticated method or library for generating blur hashes
 */
function generateBlurDataUrl(imageUrl: string): string | undefined {
    try {
        // For simplicity, we're just appending a blur parameter to Sanity URLs
        // In a real implementation, you might want to generate actual blur hashes
        if (imageUrl.includes('cdn.sanity.io')) {
            const urlObj = new URL(imageUrl);
            urlObj.searchParams.set('blur', '20');
            urlObj.searchParams.set('w', '100');
            return urlObj.toString();
        }
        return undefined;
    } catch (error) {
        console.error('[Enhanced Image] Error generating blur data URL:', error);
        return undefined;
    }
}

/**
 * Processes multiple images in batch
 */
export function batchProcessImages(
    images: ImageType[],
    defaultAlt: string = 'Imagem',
    options: Partial<ImageProcessingOptions> = {}
): EnhancedSanityImage[] {
    return images.map(img => processEnhancedSanityImage(img, defaultAlt, options));
}
