// lib/sanity/development-proxy.ts
'use client';

/**
 * This is a utility for local development to avoid CORS issues
 * that proxies Sanity requests through a local API endpoint
 */

export async function fetchSanityWithProxy<T = any>(
    query: string,
    params: Record<string, any> = {}
): Promise<T> {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (isDevelopment) {
            // In development, use the proxy to avoid CORS issues
            const response = await fetch('/api/sanity-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, params }),
            });

            if (!response.ok) {
                throw new Error(`Proxy request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Unknown error from Sanity proxy');
            }

            return result.data;
        } else {
            // In production, use the standard client-side fetch logic
            // This would be imported from your main Sanity client
            const { sanityClient } = await import('./sanity.client');
            return sanityClient.fetch<T>(query, params);
        }
    } catch (error) {
        console.error('Error fetching from Sanity:', error);
        // Return an empty result with appropriate shape based on the expected return type
        return ([] as unknown) as T;
    }
}
