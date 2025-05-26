'use client';

import { useEffect } from 'react';

/**
 * Console Error Monitor
 * Tracks and handles console errors gracefully
 */
export default function ConsoleErrorMonitor() {
    useEffect(() => {
        // Store original console methods
        const originalError = console.error;
        const originalWarn = console.warn;

        // Enhanced error handler
        const handleError = (type: 'error' | 'warn') => (...args: any[]) => {
            const message = args.join(' ');

            // Filter out known non-critical warnings
            const ignoredPatterns = [
                'Failed to execute \'addAll\' on \'Cache\'',
                'net::ERR_ABORTED 404',
                'net::ERR_ABORTED 503',
                'Fast Refresh',
                'chrome-extension://',
                'Preload warning'
            ];

            const isIgnored = ignoredPatterns.some(pattern =>
                message.toLowerCase().includes(pattern.toLowerCase())
            );

            if (!isIgnored) {
                // Call original console method for legitimate errors
                if (type === 'error') {
                    originalError.apply(console, args);
                } else {
                    originalWarn.apply(console, args);
                }
            } else {
                // Log filtered errors in development only
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Filtered ${type}]:`, message);
                }
            }
        };

        // Override console methods
        console.error = handleError('error');
        console.warn = handleError('warn');

        // Handle unhandled promise rejections
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const message = event.reason?.message || event.reason;

            // Prevent default browser error logging for known issues
            if (typeof message === 'string') {
                const knownIssues = [
                    'Service Worker',
                    'Cache',
                    'ChunkLoadError',
                    'Loading chunk'
                ];

                if (knownIssues.some(issue => message.includes(issue))) {
                    event.preventDefault();
                    console.log('[Handled Promise Rejection]:', message);
                    return;
                }
            }
        };

        // Handle general errors
        const handleGlobalError = (event: ErrorEvent) => {
            const message = event.message;

            if (message.includes('Service Worker') || message.includes('Cache')) {
                event.preventDefault();
                console.log('[Handled Global Error]:', message);
                return;
            }
        };

        // Add event listeners
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleGlobalError);

        // Cleanup
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleGlobalError);
        };
    }, []);

    return null;
}
