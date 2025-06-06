'use client';

import dynamic from 'next/dynamic';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';
import React, { useEffect, useState } from 'react';

/**
 * Fallback component shown when dynamic loading fails
 */
const ErrorFallback = ({ componentName }: { componentName?: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Only show error indicator in development mode after a delay
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible || process.env.NODE_ENV === 'production') return null;

    return (
        <div style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(255,0,0,0.1)',
            color: '#ff0000',
            fontSize: '12px',
            opacity: 0.7,
            position: 'relative',
            margin: '4px 0',
            display: 'inline-block'
        }}>
            Failed to load: {componentName || 'component'}
        </div>
    );
};

/**
 * Enhanced helper for safe dynamic imports with error handling and retries
 * 
 * @param importFn Function that returns an import promise
 * @param options Additional options for dynamic
 * @returns Dynamic component with error handling
 */
export function safeDynamic<T>(
    importFn: () => Promise<{ default: React.ComponentType<T> }>,
    options: {
        loading?: React.ComponentType;
        ssr?: boolean;
        componentName?: string;
        retries?: number;
        [key: string]: any;
    } = {}
) {
    const {
        componentName = 'Unknown',
        retries = 2,
        loading,
        ...dynamicOptions
    } = options;    // Create a wrapper function that handles retries and errors
    const importWithRetry = async () => {
        let lastError: Error | null = null;

        // Try multiple times to load the component
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const mod = await importFn();

                // Fix for webpack options.factory → .call undefined crash
                // Ensure we always have a valid default export even if the module
                // only exports named exports or is empty
                if (mod && typeof mod === 'object') {
                    if (mod.default === undefined) {
                        if (Object.keys(mod).length > 0) {
                            // If there are named exports but no default export,
                            // create a wrapper component that forwards props
                            const firstExport = Object.values(mod)[0];
                            if (typeof firstExport === 'function') {
                                mod.default = firstExport;
                            } else {
                                // Create a dummy component if no suitable export exists
                                mod.default = () => <div>Component {componentName} loaded</div>;
                            }
                        } else {
                            // Create a fallback component if module is empty
                            mod.default = () => <div>Empty Component {componentName}</div>;
                        }
                    }
                }

                return mod;
            } catch (err: any) {
                lastError = err;
                console.warn(`Failed to load dynamic component ${componentName} (attempt ${attempt + 1}/${retries + 1}): ${err.message}`);

                // Add a small delay before retry
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)));
                }
            }
        }

        // All retries failed, return fallback component
        return {
            default: (props: T) => <ErrorFallback componentName={componentName} />
        };
    };

    interface DynamicLoadingProps {
        error?: Error | null;
        isLoading?: boolean;
        pastDelay?: boolean;
        retry?: () => void;
        timedOut?: boolean;
    }

    const loadingFn = (_props: DynamicLoadingProps): React.ReactNode => null;

    return dynamic(() => importWithRetry(), {
        ssr: false,
        loading: loadingFn,
        ...dynamicOptions
    });
}
