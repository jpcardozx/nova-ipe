/// <reference lib="WebWorker" />

export { };
const SW_VERSION = '1.0.0';
const CACHE_NAME = `nova-ipe-cache-v1`;

// Basic assets to cache
const CRITICAL_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
];

declare const self: ServiceWorkerGlobalScope;

// Install event - cache critical assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing version', SW_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CRITICAL_ASSETS))
            .then(() => self.skipWaiting())
            .catch(error => {
                console.error('[Service Worker] Install failed:', error);
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating version', SW_VERSION);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - simple cache-first strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for offline
                if (event.request.destination === 'document') {
                    return caches.match('/offline');
                }
                return new Response('Offline', { status: 503 });
            })
    );
});
