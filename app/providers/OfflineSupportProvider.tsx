'use client';

import { useEffect, useState } from 'react';

/**
 * OfflineSupportProvider - Clean PWA Support
 * Simplified service worker registration without conflicts
 */
export default function OfflineSupportProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Only register in production
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            process.env.NODE_ENV === 'production'
        ) {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(() => {
                    console.log('✅ Service Worker registered');
                    setReady(true);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        } else {
            setReady(true);
        }
    }, []);

    return <>{children}</>;
}
