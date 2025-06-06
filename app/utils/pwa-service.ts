'use client';

/**
 * PWA Service - Centralized management for Progressive Web App features
 * Provides safer interactions with the Service Worker and better error handling
 */

import { useState, useEffect } from 'react';
import { isServiceWorkerActive, sendMessageToServiceWorker, getServiceWorkerVersion } from './service-worker-utils';

export type PWAStatus = {
    isOnline: boolean;
    serviceWorkerActive: boolean;
    serviceWorkerController: boolean;
    serviceWorkerRegistered: boolean;
    canInstall: boolean;
    isStandalone: boolean;
    version: string | null;
    buildTimestamp: number | null;
    cacheName: string | null;
    cachedPages: string[];
};

export type PWAEvents = {
    onUpdateFound?: () => void;
    onOffline?: () => void;
    onOnline?: () => void;
    onControllerChange?: () => void;
    onInstallPrompt?: (event: any) => void;
};

let deferredPrompt: any = null;
let cachedRegistration: ServiceWorkerRegistration | null = null;

/**
 * Get current PWA status information
 * Provides a comprehensive overview of the PWA state
 */
export function usePWAStatus(config: {
    pollInterval?: number;
    events?: PWAEvents;
    autoRegister?: boolean;
} = {}): [PWAStatus, {
    clearCache: () => Promise<boolean>;
    update: () => Promise<boolean>;
    install: () => Promise<boolean>;
}] {
    const [status, setStatus] = useState<PWAStatus>({
        isOnline: true, // Default to true during SSR
        serviceWorkerActive: false,
        serviceWorkerController: false,
        serviceWorkerRegistered: false,
        canInstall: false,
        isStandalone: false,
        version: null,
        buildTimestamp: null,
        cacheName: null,
        cachedPages: []
    });

    // Poll for status updates (optional)
    useEffect(() => {
        if (!config.pollInterval) return;

        const interval = setInterval(async () => {
            await updateStatus();
        }, config.pollInterval);

        return () => clearInterval(interval);
    }, [config.pollInterval]);

    // Register event listeners
    useEffect(() => {
        const events = config.events || {};

        const handleOnline = () => {
            setStatus(prev => ({ ...prev, isOnline: true }));
            if (events.onOnline) events.onOnline();
        };

        const handleOffline = () => {
            setStatus(prev => ({ ...prev, isOnline: false }));
            if (events.onOffline) events.onOffline();
        };

        const handleControllerChange = () => {
            updateStatus();
            if (events.onControllerChange) events.onControllerChange();
        };

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the default browser install prompt
            e.preventDefault();
            // Store the event for later use
            deferredPrompt = e;
            setStatus(prev => ({ ...prev, canInstall: true }));
            if (events.onInstallPrompt) events.onInstallPrompt(e);
        };

        // Register all event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        }        // Auto-register Service Worker if configured (only in production)
        if (config.autoRegister && typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            registerServiceWorker();
        }

        // Initial status check
        updateStatus();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            }
        };
    }, []);

    /**
     * Update the status of all PWA-related features
     */
    const updateStatus = async () => {
        if (typeof window === 'undefined') return;

        // Check if running in standalone mode
        const isInStandaloneMode =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        // Check if running online
        const isOnline = navigator.onLine;

        // Check service worker status
        const serviceWorkerActive = isServiceWorkerActive();
        const serviceWorkerController = Boolean('serviceWorker' in navigator && navigator.serviceWorker.controller);        let serviceWorkerRegistered = false;
        let version: string | null = null;
        let buildTimestamp: number | null = null;
        let cacheName: string | null = null;
        let cachedPages: string[] = [];

        // Get service worker registration status
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                serviceWorkerRegistered = registrations.length > 0;

                // Store the active registration for reuse
                if (registrations.length > 0) {
                    cachedRegistration = registrations[0];
                }
            } catch (error) {
                console.error('Error checking service worker registration:', error);
            }

            // Get version info if active
            if (serviceWorkerActive) {
                try {
                    const versionInfo = await getServiceWorkerVersion();
                    if (versionInfo) {
                        version = versionInfo.version;
                        buildTimestamp = versionInfo.timestamp;
                        cacheName = versionInfo.cacheName;
                    }
                } catch (error) {
                    console.warn('Failed to get service worker version:', error);
                }
            }

            // Get cached pages
            if ('caches' in window) {
                try {
                    const cache = await caches.open(cacheName || 'nova-ipe-chunk-cache-v3');
                    const keys = await cache.keys();

                    cachedPages = keys
                        .filter(request => {
                            const url = new URL(request.url);
                            return !url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp)$/) &&
                                !url.pathname.startsWith('/_next/') &&
                                !url.pathname.includes('/api/');
                        })
                        .map(request => {
                            const url = new URL(request.url);
                            return url.pathname;
                        });
                } catch (error) {
                    console.warn('Error checking cached pages:', error);
                }
            }
        }

        // Update the status state
        setStatus({
            isOnline,
            serviceWorkerActive,
            serviceWorkerController,
            serviceWorkerRegistered,
            canInstall: Boolean(deferredPrompt),
            isStandalone: isInStandaloneMode,
            version,
            buildTimestamp,
            cacheName,
            cachedPages
        });
    };

    /**
     * Register the service worker
     */
    const registerServiceWorker = async () => {
        if (!('serviceWorker' in navigator)) return false;

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            cachedRegistration = registration;
            console.log('Service Worker registered successfully:', registration);

            // Watch for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker && config.events?.onUpdateFound) {
                    config.events.onUpdateFound();

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New Service Worker installed and waiting for activation');
                            updateStatus();
                        }
                    });
                }
            });

            await updateStatus();
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    };

    /**
     * Clear the Service Worker cache
     */
    const clearCache = async () => {
        try {
            if (!isServiceWorkerActive()) {
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                    await updateStatus();
                    return true;
                }
                return false;
            }

            await sendMessageToServiceWorker({ type: 'CLEAR_CHUNK_CACHE' });
            await updateStatus();
            return true;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            return false;
        }
    };

    /**
     * Update the Service Worker
     */
    const update = async () => {
        if (!cachedRegistration) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                if (registrations.length > 0) {
                    cachedRegistration = registrations[0];
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Failed to get service worker registrations:', error);
                return false;
            }
        }

        try {
            await cachedRegistration.update();
            await updateStatus();
            return true;
        } catch (error) {
            console.error('Failed to update service worker:', error);
            return false;
        }
    };

    /**
     * Install the PWA
     */
    const install = async () => {
        if (!deferredPrompt) {
            console.warn('No install prompt available');
            return false;
        }

        try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('PWA installation accepted');
                deferredPrompt = null;
                await updateStatus();
                return true;
            } else {
                console.log('PWA installation rejected');
                return false;
            }
        } catch (error) {
            console.error('Failed to install PWA:', error);
            return false;
        }
    };

    return [
        status,
        {
            clearCache,
            update,
            install
        }
    ];
}
