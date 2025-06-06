'use client';

import { useRef, useEffect, useState } from 'react';

interface UseLazyLoadOptions {
    rootMargin?: string;
    threshold?: number;
    triggerOnce?: boolean;
    delayMs?: number;
}

/**
 * Custom hook for efficient lazy loading
 * Uses Intersection Observer to efficiently trigger loading when elements enter viewport
 * 
 * This hook helps reduce initial page load time by deferring non-critical content
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
    options: UseLazyLoadOptions = {}
): [React.RefObject<T>, boolean] {
    const {
        rootMargin = '200px 0px',
        threshold = 0.1,
        triggerOnce = true,
        delayMs = 0
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<T>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Performance optimization: avoid work when SSR or unsupported browser
        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        let timeout: ReturnType<typeof setTimeout> | null = null;

        // Callback to handle intersection change
        const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            const entry = entries[0];

            // Skip if not intersecting
            if (!entry.isIntersecting) return;

            // Apply delay if specified
            if (delayMs > 0) {
                timeout = setTimeout(() => {
                    setIsVisible(true);
                }, delayMs);
            } else {
                setIsVisible(true);
            }

            // Disconnect observer if configured to trigger only once
            if (triggerOnce) {
                observer.disconnect();
            }
        };

        // Create and connect observer
        const observer = new IntersectionObserver(handleIntersect, {
            root: null, // viewport
            rootMargin,
            threshold
        });

        observer.observe(element);

        // Clean up observer and timeout
        return () => {
            if (timeout) clearTimeout(timeout);
            observer.disconnect();
        };
    }, [rootMargin, threshold, triggerOnce, delayMs]);

    return [elementRef, isVisible];
}

interface LazyLoadContentProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
    rootMargin?: string;
    threshold?: number;
    delay?: number;
}

/**
 * LazyLoadContent component
 * Renders content only when it enters the viewport
 * 
 * This helps improve performance by reducing initial DOM size and deferring hydration
 */
export function LazyLoadContent({
    children,
    fallback,
    className,
    rootMargin = '200px 0px',
    threshold = 0.1,
    delay = 0
}: LazyLoadContentProps) {
    const [ref, isVisible] = useLazyLoad<HTMLDivElement>({
        rootMargin,
        threshold,
        triggerOnce: true,
        delayMs: delay
    });

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : fallback || null}
        </div>
    );
}
