/**
 * Examples of how to use the Sanity Client
 * This file demonstrates basic usage patterns
 */

import {
    sanityClient,
    sanityFetch
} from '../../sanity';

// Example 1: Basic fetch
export async function getProperties() {
    try {
        const properties = await sanityFetch('*[_type == "imovel"] | order(_createdAt desc)[0...10]') as any[];

        console.log(`Fetched ${properties.length} properties`);
        return properties;
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        return [];
    }
}

// Example 2: Direct client usage
export async function getPropertiesWithClient() {
    try {
        const properties = await sanityClient.fetch('*[_type == "imovel"]');
        return properties;
    } catch (error) {
        console.error('Failed to fetch with client:', error);
        return [];
    }
}

// Example 3: Fetch single property
export async function getPropertyById(id: string) {
    try {
        const property = await sanityFetch(`*[_type == "imovel" && _id == "${id}"][0]`) as any;
        return property;
    } catch (error) {
        console.error('Failed to fetch property by id:', error);
        return null;
    }
}

// Example 4: Fetch properties with images
export async function getPropertiesWithImages() {
    try {
        const properties = await sanityFetch(`
            *[_type == "imovel"] {
                _id,
                title,
                price,
                "images": images[].asset->url
            }
        `) as any[];
        
        return properties;
    } catch (error) {
        console.error('Failed to fetch properties with images:', error);
        return [];
    }
}

// Example 5: Health check
export async function checkSanityHealth() {
    try {
        const result = await sanityClient.fetch('*[_type == "imovel"] | order(_createdAt desc)[0]');
        return {
            status: 'healthy',
            hasData: !!result
        };
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}