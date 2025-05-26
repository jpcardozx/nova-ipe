const SW_VERSION = '2.1.0';
const BUILD_TIME = Date.now();
const CACHE_VERSION = `v5-${BUILD_TIME}`;
const CHUNK_CACHE_NAME = `nova-ipe-chunk-cache-${CACHE_VERSION}`;
const OFFLINE_CACHE_NAME = `nova-ipe-offline-cache-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `nova-ipe-static-cache-${CACHE_VERSION}`;
const API_CACHE_NAME = `nova-ipe-api-cache-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `nova-ipe-image-cache-${CACHE_VERSION}`;

const CRITICAL_ASSETS = [
    '/_next/static/chunks/main-app.js',
    '/_next/static/chunks/app/page.js',
    '/_next/static/chunks/webpack.js',
    '/offline',
    '/404',
    '/',
    '/fonts/critical-icons.woff2',
    '/images/logo.png',
    '/manifest.webmanifest',
];

const PATTERNS = {
    chunks: /\/_next\/static\/chunks\//,
    static: /\.(css|js|woff2|ico)$/,
    image: /\.(png|jpg|jpeg|svg|webp|gif|avif)$/,
    api: /\/api\//,
    sanity: /cdn\.sanity\.io/,
    fonts: /\.(woff2|woff|ttf|otf)$/,
};

const CACHE_CONFIG = {
    chunks: {
        name: CHUNK_CACHE_NAME,
        maxAge: 24 * 60 * 60 * 1000,
        maxEntries: 300,
        priority: 'high',
    },
    image: {
        name: IMAGE_CACHE_NAME,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        maxEntries: 100,
    },
    static: {
        name: STATIC_CACHE_NAME,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        maxEntries: 200,
    },
    api: {
        name: API_CACHE_NAME,
        maxAge: 60 * 60 * 1000,
        maxEntries: 50,
    },
};

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing version', SW_VERSION);
    event.waitUntil(
        Promise.all([
            caches.open(CHUNK_CACHE_NAME).then(function(cache) {
                console.log('[Service Worker] Precaching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            }),
            caches.open(STATIC_CACHE_NAME),
            caches.open(IMAGE_CACHE_NAME),
            caches.open(API_CACHE_NAME),
        ])
        .then(function() {
            return self.skipWaiting();
        })
        .catch(function(error) {
            console.error('[Service Worker] Precaching failed:', error);
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating version', SW_VERSION);
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (
                        cacheName.startsWith('nova-ipe-') &&
                        ![CHUNK_CACHE_NAME, STATIC_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME, OFFLINE_CACHE_NAME].includes(cacheName)
                    ) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                }).concat([self.clients.claim()])
            );
        })
    );
});

function shouldCache(response) {
    return response && response.status === 200 && response.type === 'basic';
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

    for (let i = 0; i < keys.length; i++) {
        const request = keys[i];
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

    if (keys.length > maxEntries) {
        const entriesToRemove = keys.length - maxEntries;
        for (let i = 0; i < entriesToRemove; i++) {
            await cache.delete(keys[i]);
        }
    }
}

self.addEventListener('fetch', function(event) {
    const request = event.request;
    if (request.method !== 'GET') return;

    const isChunk = PATTERNS.chunks.test(request.url);
    if (isChunk) {
        event.respondWith((async function() {
            try {
                const cache = await caches.open(CHUNK_CACHE_NAME);
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    fetch(request)
                        .then(function(networkResponse) {
                            if (shouldCache(networkResponse)) {
                                cache.put(request, networkResponse.clone());
                            }
                        })
                        .catch(function() {});
                    return cachedResponse;
                }
                const networkResponse = await fetch(request);
                if (shouldCache(networkResponse)) {
                    await cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                const cache = await caches.open(CHUNK_CACHE_NAME);
                const lastCached = await cache.match(request);
                if (lastCached) return lastCached;
                return new Response('', { status: 503 });
            }
        })());
        return;
    }

    const cacheConfig = getCacheConfig(request);
    if (request.url.includes('/_next/static/chunks/') || CRITICAL_ASSETS.includes(request.url)) {
        event.respondWith(
            caches.match(request).then(function(cachedResponse) {
                const fetchPromise = fetch(request).then(function(networkResponse) {
                    if (shouldCache(networkResponse)) {
                        caches.open(CHUNK_CACHE_NAME).then(function(cache) {
                            cache.put(request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            })
        );
    } else if (cacheConfig) {
        event.respondWith(
            caches.open(cacheConfig.name).then(async function(cache) {
                const cachedResponse = await cache.match(request);
                const fetchPromise = fetch(request).then(function(networkResponse) {
                    if (shouldCache(networkResponse)) {
                        cache.put(request, networkResponse.clone()).then(function() {
                            cleanCache(cacheConfig.name, cacheConfig.maxEntries, cacheConfig.maxAge);
                        });
                    }
                    return networkResponse;
                }).catch(function() {
                    if (cachedResponse) return cachedResponse;
                    return new Response('', { status: 503 });
                });
                return cachedResponse || fetchPromise;
            })
        );
    } else {
        event.respondWith((async function() {
            try {
                const response = await Promise.race([
                    fetch(request).catch(function() { return undefined }),
                    new Promise(function(resolve) {
                        setTimeout(async function() {
                            const fallback = await caches.match(request);
                            resolve(fallback || undefined);
                        }, 3000);
                    })
                ]);
                if (response) return response;
                const fallback = await caches.match(request);
                if (fallback) return fallback;
                return new Response('', { status: 503 });
            } catch {
                return new Response('', { status: 503 });
            }
        })());
    }
});
