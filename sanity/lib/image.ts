/**
 * Sanity Image Utilities
 * Helper functions for working with Sanity images
 */

import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImage } from './types'

// Initialize the image URL builder
const builder = imageUrlBuilder(client)

// Helper function to generate image URLs
export function urlFor(source: SanityImage) {
    return builder.image(source)
}

// Get optimized image URL with default settings
export function getImageUrl(
    image: SanityImage,
    width?: number,
    height?: number,
    quality: number = 80
): string {
    let imageBuilder = urlFor(image).quality(quality).format('webp')

    if (width) {
        imageBuilder = imageBuilder.width(width)
    }

    if (height) {
        imageBuilder = imageBuilder.height(height)
    }

    return imageBuilder.url()
}

// Get responsive image URLs for different screen sizes
export function getResponsiveImageUrls(image: SanityImage) {
    return {
        mobile: getImageUrl(image, 400, 300),
        tablet: getImageUrl(image, 800, 600),
        desktop: getImageUrl(image, 1200, 900),
        original: getImageUrl(image),
    }
}

// Process image for use in components
export function processImage(image: SanityImage | undefined) {
    if (!image) return undefined

    return {
        ...image,
        url: getImageUrl(image),
        responsive: getResponsiveImageUrls(image),
    }
}