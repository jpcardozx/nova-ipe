'use client';

import { useEffect, useState, ReactNode } from 'react';

interface OptimizationProviderProps {
    children: ReactNode;
}

export default function OptimizationProvider({ children }: OptimizationProviderProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Client-side only effects to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
        setIsHydrated(true);

        // Only run optimizations on client-side after hydration
        const runOptimizations = () => {
            try {
                // Mark document as fully loaded when component mounts
                if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-loading-state', 'ready');
                }

                // Optimization: Delay non-critical resources loading
                const delayNonCritical = () => {
                    // Load non-critical resources after main content
                    const loadNonCritical = () => {
                        try {
                            // Focus on optimizing existing content instead of prefetching
                            // Load any deferred images
                            const deferredImages = document.querySelectorAll('img[loading="lazy"][data-src]');
                            deferredImages.forEach((img: any) => {
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.removeAttribute('data-src');
                                }
                            });
                        } catch (error) {
                            console.warn('Error in loadNonCritical:', error);
                        }
                    };

                    // Use requestIdleCallback for optimal timing
                    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                        window.requestIdleCallback(loadNonCritical, { timeout: 2000 });
                    } else {
                        setTimeout(loadNonCritical, 1000);
                    }
                };

                // Execute optimization after page load
                if (typeof document !== 'undefined') {
                    if (document.readyState === 'complete') {
                        delayNonCritical();
                    } else {
                        const handleLoad = () => {
                            delayNonCritical();
                            window.removeEventListener('load', handleLoad);
                        };
                        window.addEventListener('load', handleLoad);
                    }

                    // Add CSS class for animations that should only run after hydration
                    document.documentElement.classList.add('hydrated');
                }
            } catch (error) {
                console.warn('Error in OptimizationProvider:', error);
            }
        };

        // Delay optimization to ensure DOM is ready
        const timeout = setTimeout(runOptimizations, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    // Prevent hydration mismatch by rendering consistently
    if (!isClient) {
        return <div suppressHydrationWarning>{children}</div>;
    }

    return (
        <div data-hydrated={isHydrated} suppressHydrationWarning>
            {children}
        </div>
    );
}
