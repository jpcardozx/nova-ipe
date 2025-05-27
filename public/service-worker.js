// Service Worker para Nova Ipê - Versão JavaScript Pura
// Versão: 2.0.0 - Compatível com todos os navegadores

const CACHE_NAME = 'nova-ipe-v2.0.0';
const STATIC_CACHE_NAME = 'nova-ipe-static-v2.0.0';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css',
  '/_next/static/js'
];

// URLs que devem ser sempre atualizadas
const DYNAMIC_URLS = [
  '/api/',
  '/sanity/',
  'https://0nks58lj.apicdn.sanity.io/'
];

// Instalação do Service Worker
self.addEventListener('install', function(event) {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function() {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        console.log('[SW] Service worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorar requisições que não são HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Strategy: Network First para APIs e dados dinâmicos
  if (isDynamicRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy: Cache First para recursos estáticos
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy: Stale While Revalidate para páginas HTML
  event.respondWith(staleWhileRevalidate(request));
});

// Verifica se é uma requisição dinâmica
function isDynamicRequest(request) {
  const url = request.url;
  return DYNAMIC_URLS.some(function(dynamicUrl) {
    return url.includes(dynamicUrl);
  });
}

// Verifica se é um asset estático
function isStaticAsset(request) {
  const url = request.url;
  return url.includes('_next/static') || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.woff') || 
         url.includes('.woff2');
}

// Strategy: Network First
function networkFirst(request) {
  return fetch(request)
    .then(function(response) {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(request, responseClone);
          });
      }
      return response;
    })
    .catch(function() {
      return caches.match(request)
        .then(function(response) {
          if (response) {
            return response;
          }
          // Fallback para erro de rede
          return new Response('No cached response available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    });
}

// Strategy: Cache First
function cacheFirst(request) {
  return caches.match(request)
    .then(function(response) {
      if (response) {
        return response;
      }
      
      return fetch(request)
        .then(function(networkResponse) {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME)
              .then(function(cache) {
                cache.put(request, responseClone);
              });
          }
          return networkResponse;
        });
    });
}

// Strategy: Stale While Revalidate
function staleWhileRevalidate(request) {
  return caches.match(request)
    .then(function(cachedResponse) {
      const fetchPromise = fetch(request)
        .then(function(networkResponse) {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(request, responseClone);
              });
          }
          return networkResponse;
        })
        .catch(function(error) {
          console.warn('[SW] Network request failed:', error);
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    });
}

// Message listener para comunicação com o client
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded successfully');