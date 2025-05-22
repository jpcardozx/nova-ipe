/**
 * Service Worker for Nova Ipê Imobiliária
 * Generated on: 2025-05-22T02:23:21.177Z
 * 
 * This service worker implements a stale-while-revalidate strategy for static chunks
 * to prevent chunk loading errors and improve offline capabilities.
 */

// app/workers/service-worker.ts



// Ensure this script is running in a Service Worker context
if (typeof self !== 'undefined') {
    const swScope = self ;

    const CHUNK_CACHE_NAME = 'nova-ipe-chunk-cache-v2'; // Updated cache name
    const CRITICAL_ASSETS = [
        // Critical assets that should be cached immediately
        '/_next/static/chunks/main-app.js',
        '/_next/static/chunks/app/page.js',
        '/_next/static/chunks/webpack.js',
        // Add other critical chunks here
    ];

    // Installation: Cache critical assets immediately
    swScope.addEventListener('install', (event) => {
        console.log('[Service Worker] Installing...');

        // Precache critical assets
        event.waitUntil(
            caches.open(CHUNK_CACHE_NAME)
                .then(cache => {
                    console.log('[Service Worker] Precaching critical assets');
                    return cache.addAll(CRITICAL_ASSETS);
                })
                .then(() => {
                    console.log('[Service Worker] Precaching complete');
                    return swScope.skipWaiting(); // Force activate immediately
                })
                .catch(error => {
                    console.error('[Service Worker] Precaching failed:', error);
                    return swScope.skipWaiting(); // Still activate even if precaching fails
                })
        );
    });

    // Activation: Clean old caches
    swScope.addEventListener('activate', (event) => {
        console.log('[Service Worker] Activating...');

        event.waitUntil(
            caches.keys()
                .then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheName !== CHUNK_CACHE_NAME && cacheName.startsWith('nova-ipe-chunk-cache')) {
                                console.log('[Service Worker] Deleting old cache:', cacheName);
                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
                .then(() => {
                    console.log('[Service Worker] Now controlling clients');
                    return swScope.clients.claim(); // Take control of all clients
                })
        );
    });

    // Handle fetch events
    swScope.addEventListener('fetch', (event) => {
        const { request } = event;

        // Only handle GET requests
        if (request.method !== 'GET') {
            return;
        }

        // Special handling for chunk files and critical assets
        if (request.url.includes('/_next/static/chunks/') ||
            CRITICAL_ASSETS.some(asset => request.url.includes(asset))) {

            event.respondWith(
                caches.open(CHUNK_CACHE_NAME)
                    .then(async cache => {
                        // Try cache first
                        const cachedResponse = await cache.match(request);

                        if (cachedResponse) {
                            console.log('[Service Worker] Serving from cache:', request.url);

                            // Update cache in background (stale-while-revalidate)
                            fetch(request)
                                .then(networkResponse => {
                                    if (networkResponse && networkResponse.status === 200) {
                                        console.log('[Service Worker] Updating cache for:', request.url);
                                        cache.put(request, networkResponse.clone());
                                    }
                                })
                                .catch(error => {
                                    console.log('[Service Worker] Background fetch failed:', error);
                                    // No need to do anything as we already returned the cached response
                                });

                            return cachedResponse;
                        }

                        console.log('[Service Worker] Cache miss, fetching from network:', request.url);

                        // Not in cache, try network with timeout
                        const timeoutPromise = new Promise((_, reject) => {
                            setTimeout(() => reject(new Error('Fetch timeout')), 10000); // 10 second timeout
                        });

                        return Promise.race([
                            fetch(request).then(networkResponse => {
                                if (networkResponse && networkResponse.status === 200) {
                                    // Cache the response for future
                                    console.log('[Service Worker] Caching new response for:', request.url);
                                    cache.put(request, networkResponse.clone());
                                }
                                return networkResponse;
                            }),
                            timeoutPromise
                        ]).catch(error => {
                            console.error('[Service Worker] Fetch failed:', error);

                            // If we have an offline/fallback response, return it
                            // For now, we'll return a simple error response
                            return new Response(
                                `Failed to load resource: ${request.url}\nError: ${error.message}`,
                                {
                                    status: 504,
                                    statusText: 'Gateway Timeout',
                                    headers: {
                                        'Content-Type': 'text/plain',
                                    }
                                }
                            );
                        });
                    })
            );
            return;
        }

        // For other resources, let the browser handle it
    });
} else {
    throw new Error('self is not defined. Ensure this script is running in a Service Worker context.');
}



// Build timestamp: 1747880601180