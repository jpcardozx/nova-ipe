'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/app/utils/performance-monitor';
import { applyPerformanceOptimizations } from '@/app/utils/performance-enhancements';

/**
 * PerformanceOptimizer - Client component that initializes performance optimizations
 * It's designed to be included in the root layout to apply site-wide optimizations
 */
export default function PerformanceOptimizer() {
    const pathname = usePathname();

    useEffect(() => {
        // Initialize performance monitoring
        initPerformanceMonitoring();

        // Apply performance optimizations
        applyPerformanceOptimizations();

        // Determine page type for specific optimizations
        const pageType = getPageType(pathname);
        document.documentElement.setAttribute('data-page-type', pageType);

        // Apply specific optimizations based on page type
        if (pageType === 'property-listing') {
            document.documentElement.setAttribute('data-optimize-lcp', 'true');
        }

        // Clean up on page navigation
        return () => {
            // Clean up any observers or listeners if needed
        };
    }, [pathname]);

    // Doesn't render anything visible
    return null;
}

/**
 * Determine the page type based on URL pathname
 * This helps apply specific optimizations for different page types
 */
function getPageType(pathname: string | null): string {
    if (!pathname) return 'unknown';

    // Property listing pages
    if (pathname === '/alugar' || pathname === '/comprar' || pathname.startsWith('/imoveis')) {
        return 'property-listing';
    }

    // Property detail page
    if (pathname.match(/\/imovel\/[^\/]+$/)) {
        return 'property-detail';
    }

    // Contact page
    if (pathname === '/contato') {
        return 'contact';
    }

    // Home page
    if (pathname === '/' || pathname === '/home') {
        return 'home';
    }

    // Default
    return 'other';
}
