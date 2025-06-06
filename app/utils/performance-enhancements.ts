'use client';

/**
 * Page Performance Enhancements
 * This script applies various optimizations to improve page loading performance.
 * 
 * Key optimizations:
 * - Resource prioritization
 * - Font optimization
 * - Script loading optimization  
 * - Connection preloading
 */

// Function to apply performance optimizations
export function applyPerformanceOptimizations() {
    if (typeof window === 'undefined') return;

    try {
        // Set high priority for critical resources
        prioritizeCriticalResources();

        // Optimize font loading
        optimizeFontLoading();

        // Optimize third-party scripts
        optimizeScriptLoading();

        // Preconnect to origins
        preconnectToOrigins();

        // Report initial performance metrics
        reportInitialMetrics();
    } catch (error) {
        console.error('Error applying performance optimizations:', error);
    }
}

// Prioritize critical resources
function prioritizeCriticalResources() {
    // Find render-blocking resources and add importance hints
    const criticalSelectors = [
        'link[rel="stylesheet"]',
        'script[src]:not([async]):not([defer])',
        'img[src]:not([loading="lazy"])'
    ];

    document.querySelectorAll(criticalSelectors.join(',')).forEach((el: Element) => {
        // Check if it's a link element
        if (el.tagName === 'LINK' && 'href' in el) {
            const linkEl = el as HTMLLinkElement;
            if (linkEl.href.includes('critical') || linkEl.href.includes('main')) {
                linkEl.setAttribute('importance', 'high');
                linkEl.setAttribute('fetchpriority', 'high');
            }
        }
        // Check if it's an image element
        else if (el.tagName === 'IMG') {
            const imgEl = el as HTMLImageElement;
            if (imgEl.getBoundingClientRect().top < window.innerHeight) {
                imgEl.setAttribute('fetchpriority', 'high');
            }
        }
    });
}

// Optimize font loading
function optimizeFontLoading() {
    // Use font-display: swap for all fonts
    const style = document.createElement('style');
    style.textContent = `
    @font-face {
      font-display: swap !important;
    }
    
    /* Ensure text remains visible during webfont load */
    html {
      font-display: swap !important;
    }
  `;
    document.head.appendChild(style);
}

// Optimize script loading
function optimizeScriptLoading() {
    // Add loading="async" to non-critical scripts
    document.querySelectorAll('script[src]').forEach((script: Element) => {
        const src = script.getAttribute('src') || '';

        // Skip already optimized scripts
        if (script.hasAttribute('async') || script.hasAttribute('defer')) {
            return;
        }

        // Skip critical scripts
        const criticalPatterns = ['vendor', 'main', 'app', 'chunk', 'critical'];
        if (criticalPatterns.some(pattern => src.includes(pattern))) {
            return;
        }

        // Add async to non-critical scripts
        script.setAttribute('async', '');

        // Some browsers support lazy loading for scripts
        try {
            script.setAttribute('loading', 'lazy');
        } catch (e) {
            // Ignore if not supported
        }
    });
}

// Preconnect to origins
function preconnectToOrigins() {
    // Common external domains that might be used
    const origins = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdn.sanity.io'
    ];

    origins.forEach((origin: string) => {
        if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    });
}

// Report initial metrics 
function reportInitialMetrics() {
    if (!('performance' in window)) return;

    // Collect basic timing metrics
    setTimeout(() => {
        const { timing } = window.performance;
        if (!timing) return;

        const metrics = {
            pageLoadTime: timing.loadEventEnd - timing.navigationStart,
            domReadyTime: timing.domComplete - timing.domLoading,
            ttfb: timing.responseStart - timing.navigationStart,
        };

        // Log metrics in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Performance]', metrics);
        }
    }, 0);
}
