'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Data prefetching strategies to optimize loading performance
 * Prefetches data for commonly accessed routes to reduce loading times
 */

interface PrefetcherProps {
    prefetchHome?: boolean;
    prefetchListings?: boolean;
    prefetchPopularProperties?: boolean;
}

// Common data URLs that should be prefetched
const PREFETCH_URLS = {
    home: '/api/sanity/home?prefetch=true',
    alugar: '/api/sanity/imoveis?tipo=aluguel&limit=6&prefetch=true',
    comprar: '/api/sanity/imoveis?tipo=venda&limit=6&prefetch=true',
    destaques: '/api/sanity/destaques?prefetch=true'
};

/**
 * DataPrefetcher Component
 * Pre-loads data that's likely to be needed soon based on user navigation patterns
 */
export default function DataPrefetcher({
    prefetchHome = true,
    prefetchListings = true,
    prefetchPopularProperties = true
}: PrefetcherProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [prefetched, setPrefetched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Skip prefetching for already prefetched URLs
        const prefetchUrls: string[] = [];

        // Determine which URLs to prefetch based on current page
        if (prefetchHome && pathname !== '/' && !prefetched.home) {
            prefetchUrls.push(PREFETCH_URLS.home);
            setPrefetched(prev => ({ ...prev, home: true }));
        }

        // Prefetch property listings when on home page
        if (prefetchListings && pathname === '/' && !prefetched.listings) {
            prefetchUrls.push(PREFETCH_URLS.alugar);
            prefetchUrls.push(PREFETCH_URLS.comprar);
            setPrefetched(prev => ({ ...prev, listings: true }));
        }

        // Always prefetch featured properties if not already done
        if (prefetchPopularProperties && !prefetched.destaques) {
            prefetchUrls.push(PREFETCH_URLS.destaques);
            setPrefetched(prev => ({ ...prev, destaques: true }));
        }

        // Perform prefetching with priority
        if (prefetchUrls.length > 0) {
            // Add slight delay to not compete with critical resources
            const timeoutId = setTimeout(() => {
                prefetchUrls.forEach(url => {
                    prefetchData(url).catch(err => {
                        // Silent fail for prefetching
                        console.debug('Prefetch error:', err);
                    });
                });
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [pathname, prefetchHome, prefetchListings, prefetchPopularProperties, prefetched]);

    // Also prefetch client-side navigations
    useEffect(() => {
        // Common routes that users often navigate to
        const commonRoutes = ['/', '/alugar', '/comprar', '/contato'];

        // Don't prefetch current route
        const routesToPrefetch = commonRoutes.filter(route => route !== pathname);

        // Delay prefetching to prioritize current page resources
        const timeoutId = setTimeout(() => {
            routesToPrefetch.forEach(route => {
                router.prefetch(route);
            });
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [pathname, router]);

    return null;
}

/**
 * Prefetch data using fetch API
 */
async function prefetchData(url: string): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Purpose': 'prefetch',
                'X-Prefetch': 'true'
            },
            priority: 'low',
            cache: 'force-cache',
            signal: AbortSignal.timeout(5000) // Abort after 5 seconds
        });

        if (!response.ok) {
            throw new Error(`Prefetch failed: ${response.status}`);
        }

        // We don't need to await the result, just trigger the fetch
        response.json();

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Prefetch] Successfully prefetched: ${url}`);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[Prefetch] Failed to prefetch ${url}:`, error);
        }
    }
}
