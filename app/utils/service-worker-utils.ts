'use client';

/**
 * Service Worker utilities for safer communication and state management
 * Helps eliminate null reference errors when working with service workers
 */

type MessageResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};

type ServiceWorkerVersion = {
    version: string;
    cacheName: string;
    timestamp: number;
};

/**
 * Safely send a message to an active service worker with type checking
 * Handles the case where serviceWorker.controller might be null
 * 
 * @param message The message to send to the service worker
 * @returns Promise that resolves with the response from the service worker or rejects with an error
 */
export const sendMessageToServiceWorker = <T = any>(
    message: { type: string;[key: string]: any }
): Promise<MessageResponse<T>> => {
    return new Promise((resolve, reject) => {
        if (!('serviceWorker' in navigator)) {
            reject(new Error('Service Worker API is not supported in this browser'));
            return;
        }

        // Safe check for service worker controller
        if (!navigator.serviceWorker.controller) {
            reject(new Error('No active Service Worker found. The page might be loading for the first time or the Service Worker is not yet activated.'));
            return;
        }

        // Create unique message ID for this request
        const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const messageWithId = { ...message, messageId };

        // Set up message listener
        const messageListener = (event: MessageEvent) => {
            // Only process messages that have a matching ID or appropriate type
            if (event.data &&
                (event.data.messageId === messageId ||
                    (event.data.type && event.data.type === `${message.type}_RESPONSE`))) {

                navigator.serviceWorker.removeEventListener('message', messageListener);
                resolve({
                    success: true,
                    data: event.data
                });
            }
        };

        // Listen for the response
        navigator.serviceWorker.addEventListener('message', messageListener);

        // Send the message
        navigator.serviceWorker.controller.postMessage(messageWithId);

        // Set timeout to avoid hanging promises
        setTimeout(() => {
            navigator.serviceWorker.removeEventListener('message', messageListener);
            reject(new Error('Service Worker did not respond within the timeout period'));
        }, 3000);
    });
};

/**
 * Get the current service worker version information
 * @returns Promise with the service worker version info
 */
export const getServiceWorkerVersion = async (): Promise<ServiceWorkerVersion | null> => {
    try {
        const response = await sendMessageToServiceWorker<ServiceWorkerVersion>({ type: 'GET_VERSION' });
        return response.data || null;
    } catch (error) {
        console.error('Failed to get service worker version:', error);
        return null;
    }
};

/**
 * Safely check if service worker is active and controlling the page
 * @returns Boolean indicating if service worker is controlling the page
 */
export const isServiceWorkerActive = (): boolean => {
    return Boolean(
        'serviceWorker' in navigator &&
        navigator.serviceWorker.controller
    );
};

/**
 * Clear the service worker cache
 * @returns Promise resolving to a boolean indicating success or failure
 */
export const clearServiceWorkerCache = async (): Promise<boolean> => {
    try {
        if (!isServiceWorkerActive()) {
            throw new Error('No active service worker found');
        }

        const response = await sendMessageToServiceWorker({ type: 'CLEAR_CHUNK_CACHE' });
        return response.success;
    } catch (error) {
        console.error('Failed to clear service worker cache:', error);
        return false;
    }
};
