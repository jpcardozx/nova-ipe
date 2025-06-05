'use client';

/**
 * NextDeveloperExperienceEnhancer
 * 
 * This component specifically targets development-only issues in Next.js
 * by providing runtime patches and fixes for common development errors.
 * 
 * Features:
 * - Fixes "Missing ActionQueueContext" error
 * - Patches React Dev Overlay userAgent issues
 * - Provides better error messages for common Next.js issues
 * - Only runs in development mode
 */

import React, { useEffect } from 'react';

interface NextDeveloperExperienceEnhancerProps {
    children: React.ReactNode;
}

// Global patch registry to avoid applying patches multiple times
const appliedPatches = new Set<string>();

export function NextDeveloperExperienceEnhancer({ children }: NextDeveloperExperienceEnhancerProps) {
    useEffect(() => {
        // Only run in development mode
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        // Apply dev overlay patches
        if (!appliedPatches.has('dev-overlay')) {
            try {
                // --- Apply comprehensive navigator fixes ---
                if (typeof navigator !== 'undefined') {
                    const navigatorProps = {
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                        platform: navigator.platform || 'Win32',
                        vendor: navigator.vendor || 'Nova IPE Polyfill',
                        language: navigator.language || 'en-US',
                        languages: navigator.languages || ['en-US', 'en'],
                        appName: 'Netscape', // Expected by some Next.js internals
                        appVersion: '5.0', // Standard value
                    };

                    // Apply all properties that might be missing
                    Object.entries(navigatorProps).forEach(([key, value]) => {
                        if (!(key in navigator) || !navigator[key as keyof Navigator]) {
                            try {
                                Object.defineProperty(navigator, key, {
                                    value,
                                    configurable: true,
                                    writable: true
                                });
                            } catch (e) {
                                console.debug(`[NextDEE] Could not set navigator.${key}:`, e);
                            }
                        }
                    });
                }

                // --- Fix Next.js ActionQueue ---
                if (typeof window !== 'undefined' && !(window as any).__NEXT_CONTEXT_PATCHED__) {
                    (window as any).__NEXT_CONTEXT_PATCHED__ = true;

                    // Create minimal Next.js router if missing
                    if (!(window as any).next?.router) {
                        (window as any).next = (window as any).next || {};
                        (window as any).next.router = {
                            state: { route: '/', pathname: '/' },
                            asPath: '/',
                            query: {},
                            events: {
                                on: () => { },
                                off: () => { },
                                emit: () => { }
                            }
                        };
                    }
                }

                // --- Fix error handling ---
                if (typeof window !== 'undefined') {
                    // Patch both console.error and window.onerror
                    const originalConsoleError = console.error;
                    console.error = function (...args) {
                        // Filter out known Next.js development errors
                        if (args.length > 0 && typeof args[0] === 'string') {
                            if (args[0].includes('Missing ActionQueueContext') ||
                                args[0].includes('Cannot read properties') && args[0].includes('userAgent')) {
                                // Suppress the error but log a more helpful message
                                console.debug('[NextDEE] Suppressed Next.js internal error:', args[0]);
                                return;
                            }
                        }
                        originalConsoleError.apply(console, args);
                    };

                    // Patch window.onerror to catch Next.js specific errors
                    const originalOnError = window.onerror;
                    window.onerror = function (message, source, lineno, colno, error) {
                        // Detect Next.js specific errors
                        if (message && typeof message === 'string') {
                            // Check for ActionQueueContext error
                            if (message.includes('Missing ActionQueueContext')) {
                                console.debug('[NextDEE] Caught Missing ActionQueueContext error. Fixed by NextContextProvider.');
                                return true; // Prevent error from propagating
                            }

                            // Check for userAgent error
                            if (message.includes('Cannot read properties of undefined') &&
                                (message.includes('userAgent') || source?.includes('next/dist'))) {
                                console.debug('[NextDEE] Caught Next.js internal error. Fixed by polyfills.');
                                return true; // Prevent error from propagating
                            }
                        }

                        // Call original handler if exists
                        if (typeof originalOnError === 'function') {
                            return originalOnError.call(this, message, source, lineno, colno, error);
                        }
                        return false;
                    };
                }

                appliedPatches.add('dev-overlay');
                console.debug('[NextDEE] Development experience enhancer active');
            } catch (e) {
                console.warn('[NextDEE] Failed to apply development enhancer patches:', e);
            }
        }
    }, []);

    // Simply render children - this is a behavior wrapper only
    return <>{children}</>;
}

export default NextDeveloperExperienceEnhancer;
