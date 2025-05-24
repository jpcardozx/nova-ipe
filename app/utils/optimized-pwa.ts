'use client';

/**
 * Optimized PWA Service - Performance-focused implementation
 * Provides lightweight interactions with the Service Worker
 */

import { useState, useEffect, useCallback } from 'react';
import { checkServiceWorkerStatus, sendServiceWorkerMessage } from './optimized-sw-utils';

type SimplePWAStatus = {
    isOnline: boolean;
    serviceWorkerActive: boolean;
    serviceWorkerRegistered: boolean;
};

// For prompting installation
let deferredInstallPrompt: any = null;

/**
 * Lightweight hook for PWA status that minimizes performance impact
 */
export function useOptimizedPWA() {
    const [status, setStatus] = useState<SimplePWAStatus>({
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        serviceWorkerActive: false,
        serviceWorkerRegistered: false,
    });

    // Update online status
    const updateOnlineStatus = useCallback(() => {
        setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    }, []);

    // Check service worker status
    const checkStatus = useCallback(async () => {
        const swStatus = await checkServiceWorkerStatus();
        setStatus(prev => ({
            ...prev,
            serviceWorkerRegistered: swStatus.registered,
            serviceWorkerActive: swStatus.active
        }));
    }, []);

    // Initial setup
    useEffect(() => {
        // Setup online/offline listeners
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Check service worker status once
        checkStatus();

        // Setup install prompt capture
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstallPrompt = e;
        });

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [updateOnlineStatus, checkStatus]);

    // Actions
    const actions = {
        // Attempt to install the PWA
        install: async () => {
            if (!deferredInstallPrompt) return false;

            try {
                deferredInstallPrompt.prompt();
                const choiceResult = await deferredInstallPrompt.userChoice;
                deferredInstallPrompt = null;
                return choiceResult.outcome === 'accepted';
            } catch (err) {
                console.error('Install error:', err);
                return false;
            }
        },

        // Lightweight update function
        update: async () => {
            try {
                const result = await sendServiceWorkerMessage({ action: 'UPDATE_CHECK' });
                return result.success;
            } catch {
                return false;
            }
        },

        // Check connection status
        checkConnection: () => navigator.onLine
    };

    return [status, actions] as const;
}
