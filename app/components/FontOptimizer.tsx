'use client';

/**
 * Font Optimization Script
 * 
 * This script helps optimize font loading to improve CLS (Cumulative Layout Shift)
 * and LCP (Largest Contentful Paint) metrics.
 */

import { useEffect } from 'react';

// We don't need to declare types here as they're already declared in global.d.ts

export default function FontOptimizer() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if the font is already loaded
        if ('fonts' in document) {
            const montserratMedium = new FontFace(
                'Montserrat',
                `url('/fonts/Montserrat-Medium.ttf') format('truetype')`,
                { weight: '500', style: 'normal', display: 'swap' }
            );

            const montserratBold = new FontFace(
                'Montserrat',
                `url('/fonts/Montserrat-Bold.ttf') format('truetype')`,
                { weight: '700', style: 'normal', display: 'swap' }
            );

            // Add the fonts to the document
            Promise.all([
                montserratMedium.load(),
                montserratBold.load()
            ]).then(loadedFonts => {
                loadedFonts.forEach(font => {
                    if (document.fonts) {
                        document.fonts.add(font);
                    }
                });

                // Mark fonts as loaded
                document.documentElement.classList.add('fonts-loaded');

                // Log performance metric
                if (process.env.NODE_ENV === 'development') {
                    console.log('[Performance] Fonts loaded');
                }
            }).catch(err => {
                console.warn('Failed to load fonts:', err);
            });
        }

        // Add polyfill for font loading on older browsers
        if (!('fonts' in document) && 'addEventListener' in document) {
            // Create style element
            const doc = document as Document;
            const style = doc.createElement('style');
            style.textContent = `
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: url('/fonts/Montserrat-Medium.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url('/fonts/Montserrat-Bold.ttf') format('truetype');
        }
      `;
            doc.head.appendChild(style);
        }

        // Add font loading timeout to prevent indefinite waiting
        const fontTimeout = setTimeout(() => {
            if (!document.documentElement.classList.contains('fonts-loaded')) {
                document.documentElement.classList.add('fonts-loaded');
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[Performance] Font loading timed out');
                }
            }
        }, 3000);

        return () => {
            clearTimeout(fontTimeout);
        };
    }, []);

    return null;
}
