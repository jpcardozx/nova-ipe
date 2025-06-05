// Service Worker - Single Source of Truth
// Version: 3.0.0 (Simplified & Clean)

const CACHE_NAME = 'nova-ipe-v3';
const STATIC_CACHE = 'nova-ipe-static-v3';

// Essential assets only
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== STATIC_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) return;

  // Network first for HTML, cache first for assets
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/offline'))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
