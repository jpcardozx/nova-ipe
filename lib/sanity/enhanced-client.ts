/**
 * Enhanced Sanity Client with CORS handling and intelligent fallbacks
 * Automatically handles CORS issues and provides seamless data fetching
 */

import React from 'react';
import { sanityClient } from '@/lib/sanity/sanity.client';

// Detection utilities - Safe for SSR
const isBrowser = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache for CORS detection
let corsCheckCache: { [origin: string]: boolean } = {};
let corsCheckPromises: { [origin: string]: Promise<boolean> } = {};

/**
 * Check if direct Sanity API access works (no CORS issues)
 */
async function checkCORSSupport(origin?: string): Promise<boolean> {
    if (!isBrowser) return false;
    
    const currentOrigin = origin || window.location.origin;
    
    // Return cached result if available
    if (corsCheckCache[currentOrigin] !== undefined) {
        return corsCheckCache[currentOrigin];
    }
    
    // Return existing promise if check is in progress
    if (currentOrigin in corsCheckPromises) {
        return corsCheckPromises[currentOrigin];    }

    // Start new CORS check
    const corsPromise = (async () => {
        try {
            // Try a minimal query to test CORS
            await sanityClient.fetch('*[_type == "imovel"][0]{ _id }');
            corsCheckCache[currentOrigin] = true;
            return true;
        } catch (error) {
            if (error instanceof Error && error.message.includes('CORS')) {
                console.warn('🔒 CORS issue detected, using proxy fallback');
                corsCheckCache[currentOrigin] = false;
                return false;
            }
            // Other errors might not be CORS-related
            corsCheckCache[currentOrigin] = true;
            return true;
        }
    })();

    corsCheckPromises[currentOrigin] = corsPromise;
    return corsPromise;
}

/**
 * Enhanced fetch with automatic CORS fallback
 */
export async function enhancedSanityFetch<T>(
    query: string,
    params: Record<string, any> = {},
    options: {
        timeout?: number;
        useProxy?: boolean;
        retries?: number;
    } = {}
): Promise<T> {
    const {
        timeout = 15000,
        useProxy = false,
        retries = 1
    } = options;

    // Force proxy in development if requested
    if (useProxy || (isDevelopment && isBrowser)) {
        return await fetchViaProxy<T>(query, params, { timeout });
    }

    // Try direct fetch first if not in browser or if CORS is supported
    if (!isBrowser) {
        return await sanityClient.fetch<T>(query, params);
    }

    try {
        // Check if CORS is supported
        const corsSupported = await checkCORSSupport();
        
        if (corsSupported) {
            // Try direct fetch
            return await Promise.race([
                sanityClient.fetch<T>(query, params),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('Direct fetch timeout')), timeout)
                )
            ]);
        } else {
            // Use proxy fallback
            return await fetchViaProxy<T>(query, params, { timeout });
        }
    } catch (error) {
        console.warn('Direct fetch failed, trying proxy:', error);
        
        // Fallback to proxy
        try {
            return await fetchViaProxy<T>(query, params, { timeout });
        } catch (proxyError) {
            console.error('Both direct and proxy fetch failed:', { error, proxyError });
            
            // Last resort: use mock data in development
            if (isDevelopment) {
                return await getMockData<T>(query);
            }
            
            throw proxyError;
        }
    }
}

/**
 * Fetch via enhanced proxy
 */
async function fetchViaProxy<T>(
    query: string,
    params: Record<string, any> = {},
    options: { timeout?: number } = {}
): Promise<T> {
    const { timeout = 15000 } = options;
    
    try {
        const response = await fetch('/api/sanity-enhanced', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query, 
                params,
                options: { timeout }
            }),
            signal: AbortSignal.timeout(timeout),
        });

        if (!response.ok) {
            throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Proxy request failed');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Proxy request timeout after ${timeout}ms`);
        }
        throw error;
    }
}

/**
 * Get mock data for development fallback
 */
async function getMockData<T>(query: string): Promise<T> {
    console.warn('🎭 Using mock data fallback for query:', query);
    
    try {
        const { mockImoveisDestaque, mockImoveisAluguel } = await import('@/lib/mock-data');
        
        if (query.includes('destaque == true')) {
            return mockImoveisDestaque as T;
        } else if (query.includes('finalidade == "Aluguel"')) {
            return mockImoveisAluguel as T;
        } else {
            // Return empty array for other queries
            return [] as unknown as T;
        }
    } catch (error) {
        console.error('Failed to load mock data:', error);
        return [] as unknown as T;
    }
}

/**
 * Test Sanity connection and return diagnostic information
 */
export async function testSanityConnection(): Promise<{
    directAccess: boolean;
    proxyAccess: boolean;
    errors: string[];
    recommendations: string[];
}> {
    const errors: string[] = [];
    const recommendations: string[] = [];
    let directAccess = false;
    let proxyAccess = false;

    // Test direct access
    try {
        await sanityClient.fetch('*[_type == "imovel"][0]{ _id }');
        directAccess = true;
    } catch (error) {
        if (error instanceof Error) {
            errors.push(`Direct access failed: ${error.message}`);
            if (error.message.includes('CORS')) {
                recommendations.push('Configure CORS origins in Sanity Studio dashboard');
                recommendations.push('Add http://localhost:3001 to allowed origins');
            }
        }
    }

    // Test proxy access
    try {
        const response = await fetch('/api/sanity-enhanced?test=connection');
        const result = await response.json();
        if (result.success) {
            proxyAccess = true;
        } else {
            errors.push(`Proxy access failed: ${result.error}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            errors.push(`Proxy access failed: ${error.message}`);
        }
    }

    if (!directAccess && !proxyAccess) {
        recommendations.push('Check Sanity project configuration');
        recommendations.push('Verify environment variables');
        recommendations.push('Check network connectivity');
    }

    return {
        directAccess,
        proxyAccess,
        errors,
        recommendations
    };
}

/**
 * React hook for enhanced Sanity queries
 */
export function useEnhancedSanityQuery<T>(
    query: string,
    params: Record<string, any> = {},
    options: {
        enabled?: boolean;
        timeout?: number;
        useProxy?: boolean;
        refetchInterval?: number;
    } = {}
) {
    const [data, setData] = React.useState<T | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const {
        enabled = true,
        timeout = 15000,
        useProxy = false,
        refetchInterval
    } = options;

    const fetchData = React.useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await enhancedSanityFetch<T>(query, params, {
                timeout,
                useProxy
            });
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [query, params, enabled, timeout, useProxy]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    React.useEffect(() => {
        if (refetchInterval && enabled) {
            const interval = setInterval(fetchData, refetchInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, refetchInterval, enabled]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}
