'use client';

/**
 * Utility functions to detect, prevent, and recover from chunk loading errors
 */

// Constants for caching keys
const CHUNK_ERROR_COUNT_KEY = 'ipe-chunk-error-count';
const CHUNK_ERROR_TIME_KEY = 'ipe-chunk-error-last';
const FALLBACK_MODE_KEY = 'ipe-fallback-mode';

/**
 * Registers a global handler to detect and recover from chunk loading errors
 */
export function registerChunkErrorHandler() {
    if (typeof window !== 'undefined') {
        // Store original error handlers
        // We need to handle these as generic EventHandlers to avoid TypeScript errors
        const origOnError = window.onerror;
        const origUnhandledRejection = window.onunhandledrejection;

        // Create a type-safe wrapper function for the onerror handler
        function errorHandler(
            message: string | Event,
            source?: string,
            lineno?: number,
            colno?: number,
            error?: Error
        ): boolean | void {
            // Check if it's a chunk loading error
            const errorMessage = message instanceof Event ? message.type : String(message);
            if (
                errorMessage &&
                (errorMessage.includes('ChunkLoadError') ||
                    errorMessage.includes('Loading chunk') ||
                    errorMessage.includes('Failed to load resource'))
            ) {
                handleChunkError(errorMessage);
            }

            // Call original handler as a generic function - this avoids type checking issues
            if (origOnError) {
                // Direct function invocation avoids 'this' binding issues
                if (typeof origOnError === 'function') {
                    try {
                        const handler = origOnError as any;
                        if (message instanceof Event) {
                            return handler(message);
                        } else {
                            return handler(message, source, lineno, colno, error);
                        }
                    } catch (e) {
                        console.error('Error in original error handler:', e);
                    }
                }
            }
            return false;
        }

        // Create a type-safe wrapper for the unhandledrejection handler
        function rejectionHandler(event: PromiseRejectionEvent): boolean | void {
            const error = event.reason;

            if (error && (
                error.message?.includes('Loading chunk') ||
                error.message?.includes('Failed to fetch') ||
                error.message?.includes('NetworkError') ||
                error.message?.includes('net::ERR') ||
                error.message?.includes('Failed to load resource')
            )
            ) {
                handleChunkError(error.message);
            }

            // Call original handler as a generic function to avoid type checking issues
            if (origUnhandledRejection) {
                try {
                    const handler = origUnhandledRejection as any;
                    return handler(event);
                } catch (e) {
                    console.error('Error in original unhandledrejection handler:', e);
                }
            }
            return false;
        }

        // Assign our wrapper functions to the window
        window.onerror = errorHandler;
        window.onunhandledrejection = rejectionHandler;

        console.log('[ChunkErrorRecovery] Registered global chunk error handler');
    }
}

/**
 * Logic to handle and recover from chunk errors
 */
function handleChunkError(errorMessage: string) {
    try {
        console.warn('[ChunkErrorRecovery] Detected chunk loading error:', errorMessage);

        // Added browser environment check for localStorage usage
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            // Get current error count from storage
            const currentCount = parseInt(window.localStorage.getItem(CHUNK_ERROR_COUNT_KEY) || '0', 10);
            const lastErrorTime = parseInt(window.localStorage.getItem(CHUNK_ERROR_TIME_KEY) || '0', 10);
            const now = Date.now();

            // Reset count if last error was more than 1 hour ago
            const errorCount = (now - lastErrorTime > 3600000) ? 1 : currentCount + 1;

            // Store updated values
            window.localStorage.setItem(CHUNK_ERROR_COUNT_KEY, errorCount.toString());
            window.localStorage.setItem(CHUNK_ERROR_TIME_KEY, now.toString());

            // Take action based on error frequency
            if (errorCount >= 3) {
                console.warn('[ChunkErrorRecovery] Multiple chunk errors detected, enabling fallback mode');
                window.localStorage.setItem(FALLBACK_MODE_KEY, 'true');

                // Also enable mock data mode if we're in development
                if (process.env.NODE_ENV === 'development' && typeof window.sessionStorage !== 'undefined') {
                    window.sessionStorage.setItem('use-mock-data', 'true');
                }

                // Clear application cache to force fresh resources on next load
                if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                        cacheNames.forEach(cacheName => {
                            if (cacheName.includes('next-data')) {
                                caches.delete(cacheName);
                            }
                        });
                    });
                }

                // Reload the page after a brief delay to apply fallback settings
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    } catch (e) {
        console.error('[ChunkErrorRecovery] Error in chunk error handler:', e);
    }
}

/**
 * Checks if the app is currently in fallback mode due to persistent chunk errors
 */
export function isInFallbackMode() {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return false;
    return window.localStorage.getItem(FALLBACK_MODE_KEY) === 'true';
}

/**
 * Resets fallback mode status
 */
export function resetFallbackMode() {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    window.localStorage.removeItem(FALLBACK_MODE_KEY);
    window.localStorage.removeItem(CHUNK_ERROR_COUNT_KEY);
    window.localStorage.removeItem(CHUNK_ERROR_TIME_KEY);
    console.log('[ChunkErrorRecovery] Reset fallback mode');
}

/**
 * Manually force fallback mode for testing
 */
export function forceFallbackMode() {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    window.localStorage.setItem(FALLBACK_MODE_KEY, 'true');
    console.log('[ChunkErrorRecovery] Forced fallback mode');
}
