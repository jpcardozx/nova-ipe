// Service worker for offline capabilities
// Adapted from https://web.dev/articles/offline-fallback-page

/// <reference lib="webworker" />
/// <reference path="./sw.d.ts" />

const CACHE_NAME = 'nova-ipe-v1';

// Assets to cache for offline use
const CACHE_ASSETS = [
    // Core application assets
    '/',
    '/offline',
    '/critical-property-styles.css',
    '/critical-home-styles.css',
    '/critical-detail-styles.css',

    // Fallback images
    '/images/property-placeholder.jpg',
    '/images/logo-ipe.svg',

    // Interface assets
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',

    // Routes that should work offline
    '/alugar',
    '/comprar',
];

// API URLs that should be cached with special strategies
const API_URLS = [
    '/api/properties',
    '/api/featured-properties',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service worker caching assets');
                return cache.addAll(CACHE_ASSETS);
            })
    );

    // Activate the worker immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
    // Clean old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => {
            console.log('Service worker activated');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event: any) => {
    const url = new URL(event.request.url);

    // Handle API requests with network-first strategy
    if (API_URLS.some(apiUrl => url.pathname.includes(apiUrl))) {
        event.respondWith(
            fetchAndCache(event.request)
        );
        return;
    }

    // For navigation requests (HTML pages), use network-first approach
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match('/offline') || caches.match('/');
                })
        );
        return;
    }

    // For non-navigation requests, use cache-first approach
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetchAndCache(event.request);
            })
            .catch(() => {
                // If both cache and network fail and it's an image request, return fallback image
                if (event.request.destination === 'image') {
                    return caches.match('/images/property-placeholder.jpg');
                }

                return new Response('Conteúdo não disponível offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                });
            })
    );
});

// Function to fetch and cache response
function fetchAndCache(request: Request) {
    return fetch(request)
        .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(request, responseToCache);
                });

            return response;
        });
}
