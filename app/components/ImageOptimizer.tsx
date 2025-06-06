'use client';

/**
 * ImageOptimizer.tsx
 * 
 * Componente para otimizar o carregamento de imagens e melhorar LCP
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useEffect } from 'react';

/**
 * Otimizador de imagens para melhorar o Core Web Vitals, especialmente LCP
 */
export default function ImageOptimizer() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Helper function to check if an element can have its dimensions measured
        const canMeasure = (element: Element): element is Element & { getBoundingClientRect: () => DOMRect } => {
            return 'getBoundingClientRect' in element;
        };

        // Helper function to check if an element is an image
        const isImage = (element: Element): element is HTMLImageElement => {
            return element.tagName.toLowerCase() === 'img';
        };

        // Function to optimize image loading attributes
        const optimizeImage = (element: Element): void => {
            if (isImage(element)) {
                if (element.getAttribute('loading') === 'lazy') {
                    element.setAttribute('loading', 'eager');
                }
                element.setAttribute('fetchpriority', 'high');
            }
        };

        // Function to check if element should be prioritized based on size and position
        const checkPriority = (element: Element): boolean => {
            if (!canMeasure(element)) return false;
            const rect = element.getBoundingClientRect();
            const area = rect.width * rect.height;
            return rect.top < window.innerHeight && area > 50000;
        };

        // Identify and optimize LCP candidates
        const optimizeLCPCandidates = (): void => {
            try {
                // Handle priority images
                const imageNodes = document.querySelectorAll('img[width][height]');
                for (let i = 0; i < imageNodes.length; i++) {
                    const img = imageNodes[i];
                    if (checkPriority(img)) {
                        img.setAttribute('data-optimize-lcp', 'true');
                        optimizeImage(img);
                    }
                }

                // Handle priority containers
                const containerNodes = document.querySelectorAll('section, header, main > div');
                for (let i = 0; i < containerNodes.length; i++) {
                    const container = containerNodes[i];
                    if (checkPriority(container)) {
                        container.setAttribute('data-optimize-lcp', 'true');

                        // Find and optimize images within the container
                        const imgNodes = document.querySelectorAll('img');
                        let optimizedCount = 0;

                        for (let j = 0; j < imgNodes.length && optimizedCount < 2; j++) {
                            const img = imgNodes[j];
                            if (container.contains(img)) {
                                optimizeImage(img);
                                optimizedCount++;
                            }
                        }
                    }
                }
            } catch (error) {
                // Log any errors but don't break the app
                console.error('Error in ImageOptimizer:', error);
            }
        };

        // Run the optimization when DOM is ready
        optimizeLCPCandidates();

        // Return cleanup function
        return () => {
            // Clean up any listeners or observers if needed
        };
    }, []);

    // Component doesn't render anything visible
    return null;
}
