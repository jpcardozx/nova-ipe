'use client';

/**
 * Optimized Service Worker Utilities
 * 
 * This module provides optimized utilities for interacting with the service worker
 * with a focus on reducing overhead and improving performance.
 */

// Cache for registration to avoid repeated lookups
let cachedRegistration: ServiceWorkerRegistration | null = null;

/**
 * Get the service worker registration with caching to avoid repeated lookups
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (cachedRegistration) {
        return cachedRegistration;
    }

    if (!('serviceWorker' in navigator)) {
        return null;
    }

    try {
        // Get all registrations and find the active one
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
            cachedRegistration = registrations[0];
            return cachedRegistration;
        }
        return null;
    } catch (error) {
        console.error('Error getting service worker registration:', error);
        return null;
    }
}

/**
 * Optimized check if service worker is active - uses minimal operations
 */
export async function checkServiceWorkerStatus(): Promise<{
    registered: boolean;
    active: boolean;
}> {
    if (!('serviceWorker' in navigator)) {
        return { registered: false, active: false };
    }

    try {
        const registration = await getServiceWorkerRegistration();
        return {
            registered: !!registration,
            active: !!(navigator.serviceWorker.controller && registration?.active)
        };
    } catch {
        return { registered: false, active: false };
    }
}

/**
 * Send a simple message to the service worker with timeout protection
 */
export async function sendServiceWorkerMessage<T>(
    message: any
): Promise<{ success: boolean; data?: T }> {
    const registration = await getServiceWorkerRegistration();

    if (!registration || !registration.active) {
        return { success: false };
    }

    return new Promise((resolve) => {
        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
            resolve({ success: false });
        }, 2000);

        // Setup listener for the response
        const messageHandler = (event: MessageEvent) => {
            if (event.data && event.data.type === 'RESPONSE') {
                clearTimeout(timeout);
                navigator.serviceWorker.removeEventListener('message', messageHandler);
                resolve({ success: true, data: event.data.payload });
            }
        };

        // Listen for the response
        navigator.serviceWorker.addEventListener('message', messageHandler);

        // Send the message
        if (registration.active) {
            registration.active.postMessage({
                type: 'REQUEST',
                payload: message
            });
        } else {
            clearTimeout(timeout);
            navigator.serviceWorker.removeEventListener('message', messageHandler);
            resolve({ success: false });
        }
    });
}
