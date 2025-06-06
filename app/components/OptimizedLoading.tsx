'use client';

import React, { Suspense, useState, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// LoadingFallback with customizable appearance
interface LoadingFallbackProps {
    height?: string | number;
    width?: string | number;
    className?: string;
    label?: string;
    showSpinner?: boolean;
}

function LoadingFallback({
    height = '200px',
    width = '100%',
    className = '',
    label = 'Loading...',
    showSpinner = true,
}: LoadingFallbackProps) {
    return (
        <div
            style={{
                height,
                width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
            className={`bg-gray-50 rounded-md ${className}`}
            role="status"
            aria-label={label}
        >
            {showSpinner && (
                <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent" />
            )}
            <span className="text-sm text-gray-500 mt-2">{label}</span>
        </div>
    );
}

// LazyLoadedSection component - only loads content when scrolled into view
interface LazyLoadedSectionProps {
    children: ReactNode;
    placeholder?: ReactNode;
    threshold?: number;
    className?: string;
    id?: string;
    priority?: boolean;
    loadingHeight?: string | number;
}

export function LazyLoadedSection({
    children,
    placeholder,
    threshold = 0.1,
    className = '',
    id,
    priority = false,
    loadingHeight = '200px',
}: LazyLoadedSectionProps) {
    const [shouldRender, setShouldRender] = useState(priority);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (priority) {
            setShouldRender(true);
            return;
        }

        if (typeof window === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        const element = document.getElementById(id || '');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [priority, threshold, id]);

    if (!mounted) {
        return <LoadingFallback height={loadingHeight} />;
    }

    return (
        <div className={className} id={id}>
            {shouldRender ? children : (placeholder || <LoadingFallback height={loadingHeight} />)}
        </div>
    );
}

// SuspenseBoundary component for React.Suspense with better defaults
interface SuspenseBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    className?: string;
    id?: string;
    delayMs?: number;
}

export function SuspenseBoundary({
    children,
    fallback,
    className = '',
    id,
    delayMs = 0,
}: SuspenseBoundaryProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return fallback || <LoadingFallback />;
    }

    return (
        <div className={className} id={id}>
            <Suspense fallback={fallback || <LoadingFallback />}>
                {children}
            </Suspense>
        </div>
    );
}

// OptimizedContent - combines lazy loading with suspense for optimal loading strategies
interface OptimizedContentProps {
    children: ReactNode;
    fallback?: ReactNode;
    threshold?: number;
    priority?: boolean;
    id?: string;
    className?: string;
    minHeight?: string | number;
    delayMs?: number;
}

export function OptimizedContent({
    children,
    fallback,
    threshold = 0.1,
    priority = false,
    id,
    className = '',
    minHeight = '200px',
    delayMs = 200,
}: OptimizedContentProps) {
    return (
        <LazyLoadedSection
            priority={priority}
            threshold={threshold}
            id={id}
            className={className}
            loadingHeight={minHeight}
        >
            <SuspenseBoundary
                fallback={fallback || <LoadingFallback height={minHeight} />}
                delayMs={delayMs}
            >
                {children}
            </SuspenseBoundary>
        </LazyLoadedSection>
    );
}

// PriorityContent - optimized for important above-the-fold content
// that should be loaded immediately but still have suspense boundaries
interface PriorityContentProps {
    children: ReactNode;
    fallback?: ReactNode;
    id?: string;
    className?: string;
}

export function PriorityContent({
    children,
    fallback,
    id,
    className = '',
}: PriorityContentProps) {
    return (
        <SuspenseBoundary
            fallback={fallback}
            id={id}
            className={className}
            delayMs={0}
        >
            {children}
        </SuspenseBoundary>
    );
}

// BelowFoldContent - specifically optimized for below-the-fold content
interface BelowFoldContentProps {
    children: ReactNode;
    fallback?: ReactNode;
    id?: string;
    className?: string;
    minHeight?: string | number;
}

export function BelowFoldContent({
    children,
    fallback,
    id,
    className = '',
    minHeight = '200px',
}: BelowFoldContentProps) {
    return (
        <OptimizedContent
            priority={false}
            threshold={0.1}
            id={id}
            className={className}
            minHeight={minHeight}
            delayMs={500} // Slightly higher delay for below-fold content
            fallback={fallback}
        >
            {children}
        </OptimizedContent>
    );
}

export default {
    LoadingFallback,
    LazyLoadedSection,
    SuspenseBoundary,
    OptimizedContent,
    PriorityContent,
    BelowFoldContent,
};
