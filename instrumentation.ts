// instrumentation.ts - Server instrumentation
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from "@sentry/nextjs";

// Required hook for the new Sentry configuration
export const onRequestError = Sentry.captureRequestError;

export async function register() {
    // Only run on server and in production to reduce development overhead
    if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production') {
        try {
            // Server-side initialization
            Sentry.init({
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                tracesSampleRate: 0.1,
                environment: process.env.NODE_ENV,
                enabled: true,
                ignoreErrors: [
                    "Network request failed",
                    "Failed to fetch",
                    "Load failed",
                    "AbortError",
                ],
                integrations: [],
            });

            console.log('Sentry server instrumentation initialized');
        } catch (error) {
            console.error('Failed to initialize Sentry server:', error);
        }
    }
} 