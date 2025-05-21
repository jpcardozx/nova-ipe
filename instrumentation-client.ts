// instrumentation-client.ts
// This is the client side instrumentation file for Next.js
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

'use client';

import { useEffect } from 'react';

// Only initialize Sentry in production
const isProd = process.env.NODE_ENV === 'production';

// Lazy-load Sentry to reduce initial bundle size
export function SentryInit() {
    useEffect(() => {
        if (isProd) {
            import('@sentry/nextjs').then(Sentry => {
                Sentry.init({
                    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
                    tracesSampleRate: 0.05,
                    environment: process.env.NODE_ENV,
                    enabled: true,
                });
                console.log('Sentry client initialized in production mode');
            }).catch(error => console.warn('Failed to initialize Sentry:', error));
        } else {
            console.log('Sentry disabled in development mode');
        }
    }, []);

    return null;
}