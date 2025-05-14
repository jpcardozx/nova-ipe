'use client';

import { useEffect, ReactNode } from 'react';

interface OptimizationProviderProps {
    children: ReactNode;
}

export default function OptimizationProvider({ children }: OptimizationProviderProps) {
    useEffect(() => {
        // Mark document as fully loaded when component mounts
        document.documentElement.setAttribute('data-loading-state', 'ready');

        // Optimization: Delay non-critical resources loading
        const delayNonCritical = () => {
            // Load non-critical resources after main content
            const loadNonCritical = () => {
                // Prefetch other pages after main page is loaded
                const links = ['/imovel', '/contato', '/alugar', '/comprar'];
                links.forEach(href => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                });

                // Load any deferred images
                const deferredImages = document.querySelectorAll('img[loading="lazy"][data-src]');
                deferredImages.forEach((img: any) => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                });
            };

            // Use requestIdleCallback for optimal timing
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(loadNonCritical, { timeout: 2000 });
            } else {
                setTimeout(loadNonCritical, 1000);
            }
        };

        // Execute optimization after page load
        if (document.readyState === 'complete') {
            delayNonCritical();
        } else {
            window.addEventListener('load', delayNonCritical);
            return () => window.removeEventListener('load', delayNonCritical);
        }

        // Add CSS class for animations that should only run after hydration
        document.documentElement.classList.add('hydrated');
    }, []);

    return <>{children}</>;
}
