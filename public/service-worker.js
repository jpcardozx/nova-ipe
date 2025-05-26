/**
 * Service Worker for Nova Ipê Imobiliária
 * Generated on: 2025-05-25T17:00:05.489Z
 * 
 * This service worker implements a stale-while-revalidate strategy for static chunks
 * to prevent chunk loading errors and improve offline capabilities.
 */

const SW_VERSION = '2.1.0';
const BUILD_TIME = Date.now();
const CACHE_VERSION = `v5-${BUILD_TIME}`;
const CHUNK_CACHE_NAME = `nova-ipe-chunk-cache-${CACHE_VERSION}`;
const OFFLINE_CACHE_NAME = `nova-ipe-offline-cache-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `nova-ipe-static-cache-${CACHE_VERSION}`;
const API_CACHE_NAME = `nova-ipe-api-cache-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `nova-ipe-image-cache-${CACHE_VERSION}`;

// Critical assets for immediate caching
const CRITICAL_ASSETS = [
    '/',
    '/offline',
    // Don't cache manifest here, let Next.js handle it
];

// Asset patterns with caching strategies
const PATTERNS = {
    chunks: /\/_next\/static\/chunks\//,
    static: /\.(css|js|woff2|ico)$/,
    image: /\.(png|jpg|jpeg|svg|webp|gif|avif)$/,
    api: /\/api\//,
    sanity: /cdn\.sanity\.io/,
    fonts: /\.(woff2|woff|ttf|otf)$/
};

// Cache configuration
const CACHE_CONFIG = {
    chunks: {
        name: CHUNK_CACHE_NAME,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        maxEntries: 300, // Aumentado para comportar mais chunks
        priority: 'high'
    },
    image: {
        name: IMAGE_CACHE_NAME,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 100
    },
    static: {
        name: STATIC_CACHE_NAME,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxEntries: 200
    },
    api: {
        name: API_CACHE_NAME,
        maxAge: 60 * 60 * 1000, // 1 hour
        maxEntries: 50
    }
};

// --- Install Event ---
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing version', SW_VERSION);
    event.waitUntil(        Promise.all([
            // Precache critical assets with individual error handling
            caches.open(CHUNK_CACHE_NAME).then(cache => {
                console.log('[Service Worker] Precaching critical assets');
                // Cache each asset individually to avoid failing the entire batch
                return Promise.allSettled(
                    CRITICAL_ASSETS.map(asset => 
                        cache.add(asset).catch(error => {
                            console.warn(`[Service Worker] Failed to cache ${asset}:`, error.message);
                            return null;
                        })
                    )
                );
            }),
            caches.open(STATIC_CACHE_NAME),
            caches.open(IMAGE_CACHE_NAME),
            caches.open(API_CACHE_NAME),
        ])
            .then(() => self.skipWaiting())
            .catch(error => {
                console.error('[Service Worker] Precaching failed:', error);
                return self.skipWaiting();
            })
    );
});

// --- Activate Event ---
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating version', SW_VERSION);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all([
                ...cacheNames.map(cacheName => {
                    if (
                        cacheName.startsWith('nova-ipe-') &&
                        ![CHUNK_CACHE_NAME, STATIC_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME, OFFLINE_CACHE_NAME].includes(cacheName)
                    ) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                }),
                self.clients.claim(),
            ]);
        })
    );
});

// Helper functions
function shouldCache(response) {
    return response !== undefined && response.status === 200 && response.type === 'basic';
}

function getCacheConfig(request) {
    const url = new URL(request.url);

    if (PATTERNS.image.test(url.pathname) || PATTERNS.sanity.test(url.hostname)) {
        return CACHE_CONFIG.image;
    }
    if (PATTERNS.static.test(url.pathname)) {
        return CACHE_CONFIG.static;
    }
    if (PATTERNS.api.test(url.pathname)) {
        return CACHE_CONFIG.api;
    }
    if (PATTERNS.chunks.test(url.pathname)) {
        return CACHE_CONFIG.chunks;
    }
    return null;
}

async function cleanCache(cacheName, maxEntries, maxAge) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const now = Date.now();

    for (const request of keys) {
        const response = await cache.match(request);
        if (!response) continue;

        const date = response.headers.get('date');
        if (date) {
            const cacheTime = new Date(date).getTime();
            if (now - cacheTime > maxAge) {
                await cache.delete(request);
            }
        }
    }

    // If we still have too many entries, remove the oldest ones
    if (keys.length > maxEntries) {
        const entriesToRemove = keys.length - maxEntries;
        for (let i = 0; i < entriesToRemove; i++) {
            await cache.delete(keys[i]);
        }
    }
}

// --- Fetch Event ---
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests and chrome-extension requests
    if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Add error boundary for all fetch handling
    try {
        // Verificar se é um chunk dinâmico
        const isChunk = PATTERNS.chunks.test(request.url);
        if (isChunk) {
            event.respondWith(
                (async () => {
                    try {
                        const cache = await caches.open(CHUNK_CACHE_NAME);
                        const cachedResponse = await cache.match(request);

                        if (cachedResponse) {
                            // Background revalidation with error handling
                            fetch(request)
                                .then(networkResponse => {
                                    if (shouldCache(networkResponse)) {
                                        cache.put(request, networkResponse.clone());
                                    }
                                })
                                .catch(error => {
                                    console.log('[Service Worker] Background revalidation failed:', error.message);
                                });

                            return cachedResponse;
                        }

                        const networkResponse = await fetch(request);
                        if (shouldCache(networkResponse)) {
                            await cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    } catch (error) {
                        console.warn('[Service Worker] Chunk fetch failed:', error.message);
                        const cache = await caches.open(CHUNK_CACHE_NAME);
                        const lastCachedResponse = await cache.match(request);
                        if (lastCachedResponse) return lastCachedResponse;
                        return new Response('', { status: 503, statusText: 'Service Unavailable' });
                    }
                })()
            );
        return;
    }

    // Handle other resources with normal caching
    const cacheConfig = getCacheConfig(request);
    if (request.url.includes('/_next/static/chunks/') || CRITICAL_ASSETS.includes(request.url)) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    if (shouldCache(networkResponse)) {
                        const clone = networkResponse.clone();
                        caches.open(CHUNK_CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            })
        );
    } else if (cacheConfig) {
        event.respondWith(
            caches.open(cacheConfig.name).then(async cache => {
                const cachedResponse = await cache.match(request);
                const fetchPromise = fetch(request)
                    .then(networkResponse => {
                        if (shouldCache(networkResponse)) {
                            const clone = networkResponse.clone();
                            cache.put(request, clone).then(() =>
                                cleanCache(cacheConfig.name, cacheConfig.maxEntries, cacheConfig.maxAge)
                            );
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        if (cachedResponse) return cachedResponse;
                        throw new Error('No cached response available');
                    });
                return cachedResponse || fetchPromise;
            })
        );
    } else {
        event.respondWith(
            (async () => {
                try {
                    const response = await Promise.race([
                        fetch(request).catch(() => undefined),
                        new Promise((resolve) => {
                            setTimeout(async () => {
                                const cacheResponse = await caches.match(request);
                                resolve(cacheResponse || undefined);
                            }, 3000);
                        })
                    ]);

                    if (response) return response;
                    const cacheResponse = await caches.match(request);
                    if (cacheResponse) return cacheResponse;
                    return new Response('', { status: 503 });                } catch (error) {
                    console.warn('[Service Worker] General fetch failed:', error.message);
                    return new Response('', { status: 503, statusText: 'Service Unavailable' });
                }
            })()
        );
    }
    } catch (error) {
        console.error('[Service Worker] Fetch event error:', error.message);
        // Let the request fall through to the network
    }
});

// Build timestamp: 1748230283168