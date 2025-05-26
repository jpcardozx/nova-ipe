'use client';

import { useEffect } from 'react';

/**
 * CSS Optimizer Component
 * Addresses CSS preloading warnings and optimizes critical path rendering
 */
export default function CSSOptimizer() {
    useEffect(() => {
        // Optimize CSS loading to prevent console warnings
        const optimizeCSSLoading = () => {
            // Remove unused CSS preload hints that cause warnings
            const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
            preloadLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    // Check if the CSS is actually used
                    const stylesheets = Array.from(document.styleSheets);
                    const isUsed = stylesheets.some(sheet => {
                        try {
                            return sheet.href && sheet.href.includes(href);
                        } catch {
                            return false;
                        }
                    });

                    if (!isUsed) {
                        // Convert preload to actual stylesheet loading
                        const styleLink = document.createElement('link');
                        styleLink.rel = 'stylesheet';
                        styleLink.href = href;
                        styleLink.media = 'all';
                        document.head.appendChild(styleLink);

                        // Remove the preload link
                        link.remove();
                    }
                }
            });

            // Optimize font loading to prevent layout shifts
            const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
            fontLinks.forEach(link => {
                if (!link.hasAttribute('crossorigin')) {
                    link.setAttribute('crossorigin', 'anonymous');
                }
            });
        };

        // Run optimization after initial page load
        if (document.readyState === 'complete') {
            optimizeCSSLoading();
        } else {
            window.addEventListener('load', optimizeCSSLoading);
            return () => window.removeEventListener('load', optimizeCSSLoading);
        }
    }, []);

    return null; // This is a utility component with no visual output
}
