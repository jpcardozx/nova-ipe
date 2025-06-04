'use client';

import { useEffect, useState, ReactNode } from 'react';

interface HydrationBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

/**
 * HydrationBoundary component that catches hydration errors and provides fallback
 */
export default function HydrationBoundary({
    children,
    fallback = null,
    name = 'Unknown'
}: HydrationBoundaryProps) {
    const [hasHydrated, setHasHydrated] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        try {
            setHasHydrated(true);
        } catch (error) {
            console.error(`Hydration error in ${name}:`, error);
            setHasError(true);
        }
    }, [name]);

    // Handle hydration errors
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (event.message.includes('hydration') || event.message.includes('Hydration')) {
                console.error(`Hydration boundary caught error in ${name}:`, event.error);
                setHasError(true);
                event.preventDefault();
            }
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, [name]);

    if (!hasHydrated) {
        return <>{fallback}</>;
    }

    if (hasError) {
        return (
            <div className="hydration-error-boundary p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                    Component temporarily unavailable due to hydration error
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
