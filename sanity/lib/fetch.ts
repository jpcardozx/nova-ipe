/**
 * Sanity Data Fetching Functions
 * Clean and simple data fetching with error handling
 */

import { client } from './client'
import {
    FEATURED_PROPERTIES_QUERY,
    RENTAL_PROPERTIES_QUERY,
    SALE_PROPERTIES_QUERY,
    PROPERTY_BY_SLUG_QUERY,
    ALL_PROPERTIES_QUERY,
} from './queries'

// Generic fetch function with error handling
async function sanityFetch<T>(
    query: string,
    params: Record<string, any> = {},
    tags: string[] = []
): Promise<T> {
    try {
        const data = await client.fetch<T>(query, params, {
            next: {
                revalidate: 3600, // Cache for 1 hour
                tags,
            },
        })
        return data
    } catch (error) {
        console.error('Sanity fetch error:', {
            error: error instanceof Error ? error.message : error,
            query: query.slice(0, 100) + '...',
            params
        })

        // Return empty array for array queries, empty object for single queries
        return ([] as unknown) as T
    }
}

// Fetch featured properties
export async function getFeaturedProperties() {
    return sanityFetch(
        FEATURED_PROPERTIES_QUERY,
        {},
        ['properties', 'featured']
    )
}

// Fetch rental properties
export async function getRentalProperties() {
    return sanityFetch(
        RENTAL_PROPERTIES_QUERY,
        {},
        ['properties', 'rental']
    )
}

// Fetch sale properties
export async function getSaleProperties() {
    return sanityFetch(
        SALE_PROPERTIES_QUERY,
        {},
        ['properties', 'sale']
    )
}

// Fetch property by slug
export async function getPropertyBySlug(slug: string) {
    return sanityFetch(
        PROPERTY_BY_SLUG_QUERY,
        { slug },
        ['properties', `property:${slug}`]
    )
}

// Fetch all properties
export async function getAllProperties() {
    return sanityFetch(
        ALL_PROPERTIES_QUERY,
        {},
        ['properties']
    )
}

// Export the generic fetch function for custom queries
export { sanityFetch }