// lib/debug/sanityImageValidator.ts
'use client';

/**
 * Utility to validate and debug Sanity image references
 * Use this in client components to identify image problems
 */

/**
 * Check if an image reference is valid
 * @param ref The Sanity image reference
 * @returns A validation result object
 */
export function validateImageRef(ref: string | null | undefined): {
    isValid: boolean;
    format?: string;
    id?: string;
    error?: string;
} {
    if (!ref) {
        return { isValid: false, error: 'Reference is empty' };
    }

    try {
        // Expected format: image-abc123-1200x800-jpg
        const parts = ref.split('-');

        if (parts.length < 3 || parts[0] !== 'image') {
            return { isValid: false, error: 'Invalid reference format' };
        }

        const id = parts[1];
        let format = parts[parts.length - 1];

        // Extract format if it contains dimensions
        if (format.includes('x')) {
            const lastPart = parts[parts.length - 1];
            format = lastPart.includes('.') ? lastPart.split('.').pop() || '' : '';
        }

        return {
            isValid: true,
            id,
            format
        };
    } catch (err) {
        return {
            isValid: false,
            error: `Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`
        };
    }
}

/**
 * Validate a Sanity image object structure
 * @param image The image object from Sanity
 * @returns Validation result
 */
export function validateSanityImage(image: any): {
    isValid: boolean;
    hasAsset: boolean;
    hasRef: boolean;
    hasURL: boolean;
    hasAlt: boolean;
    validStructure: boolean;
    refValidation?: ReturnType<typeof validateImageRef>;
    error?: string;
} {
    try {
        if (!image) {
            return {
                isValid: false,
                hasAsset: false,
                hasRef: false,
                hasURL: false,
                hasAlt: false,
                validStructure: false,
                error: 'Image object is null or undefined'
            };
        }

        const hasAsset = !!image.asset;
        const hasRef = hasAsset && !!image.asset._ref;
        const hasURL = hasAsset && !!image.asset.url;
        const hasAlt = !!image.alt;

        // Validate reference if present
        const refValidation = hasRef ? validateImageRef(image.asset._ref) : undefined;

        // Structure is valid if we have either a ref or URL
        const validStructure = hasAsset && (hasRef || hasURL);

        return {
            isValid: validStructure,
            hasAsset,
            hasRef,
            hasURL,
            hasAlt,
            validStructure,
            refValidation,
            error: !validStructure ? 'Image missing required asset data' : undefined
        };
    } catch (err) {
        return {
            isValid: false,
            hasAsset: false,
            hasRef: false,
            hasURL: false,
            hasAlt: false,
            validStructure: false,
            error: `Validation error: ${err instanceof Error ? err.message : 'Unknown'}`
        };
    }
}

/**
 * Debug multiple image references on a page
 * @param images Array of image objects
 * @returns Diagnostic information about the images
 */
export function debugImageRefs(images: any[]): {
    totalImages: number;
    validImages: number;
    invalidImages: number;
    validationResults: Array<{ imageIndex: number; validation: ReturnType<typeof validateSanityImage> }>;
} {
    if (!Array.isArray(images)) {
        return {
            totalImages: 0,
            validImages: 0,
            invalidImages: 0,
            validationResults: []
        };
    }

    const validationResults = images.map((img, idx) => ({
        imageIndex: idx,
        validation: validateSanityImage(img)
    }));

    return {
        totalImages: images.length,
        validImages: validationResults.filter(r => r.validation.isValid).length,
        invalidImages: validationResults.filter(r => !r.validation.isValid).length,
        validationResults
    };
}
