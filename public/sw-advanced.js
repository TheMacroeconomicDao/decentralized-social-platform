// Advanced Service Worker for DSP Platform 2025
// Version: 2.0.0

const CACHE_NAME = 'dsp-v2.0.0';
const STATIC_CACHE = 'dsp-static-v2.0.0';
const DYNAMIC_CACHE = 'dsp-dynamic-v2.0.0';
const IMAGE_CACHE = 'dsp-images-v2.0.0';

// Production-ready логирование (только ошибки в production)
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const swLogger = {
  log: (...args) => {
    if (isDevelopment) console.log('[SW]', ...args);
  },
  error: (...args) => {
    console.error('[SW]', ...args); // Ошибки всегда логируем
  },
  warn: (...args) => {
    if (isDevelopment) console.warn('[SW]', ...args);
  }
};

// Critical resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/styles/global-enhanced.css',
  '/images/gyber_background.svg',
  '/images/icons/favicon.ico',
  '/offline.html'
];

// Routes for different caching strategies
const CACHE_STRATEGIES = {
  // Images: Cache First with WebP/AVIF optimization
  images: /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i,
  
  // Static assets: Cache First
  static: /\.(css|js|woff|woff2|ttf|eot)$/i,
  
  // API calls: Network First with fallback
  api: /^https:\/\/api\./,
  
  // Pages: Stale While Revalidate
  pages: /^https:\/\/.*\/(about|platform|offering|events)/
};

// Install event - cache critical resources
self.addEventListener('install', event => {
  swLogger.log('Installing Service Worker v2.0.0');
  
  event.waitUntil(
    (async () => {
      // Cache critical resources
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(PRECACHE_URLS);
      
      // Skip waiting to activate immediately
      await self.skipWaiting();
      
      swLogger.log('Critical resources cached');
    })()
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  swLogger.log('Activating Service Worker v2.0.0');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('dsp-') && !name.includes('v2.0.0')
      );
      
      await Promise.all(
        oldCaches.map(name => caches.delete(name))
      );
      
      // Take control of all clients
      await self.clients.claim();
      
      swLogger.log('Old caches cleaned, SW activated');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // CRITICAL: Never cache Next.js internal requests — they handle their own caching
  // This includes RSC payloads, navigation data, HMR, and webpack chunks
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/__next') ||
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-State-Tree') ||
    request.headers.get('Next-Router-Prefetch') ||
    url.pathname.endsWith('.json')
  ) {
    return;
  }

  // Skip third-party requests — only cache same-origin
  if (url.origin !== self.location.origin) {
    return;
  }

  // Determine caching strategy
  if (CACHE_STRATEGIES.images.test(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else if (CACHE_STRATEGIES.api.test(url.href)) {
    event.respondWith(handleApiRequest(request));
  } else if (CACHE_STRATEGIES.pages.test(url.href)) {
    event.respondWith(handlePageRequest(request));
  } else {
    // For all other requests (HTML pages, etc.) use network-first
    event.respondWith(handleDefaultRequest(request));
  }
});

// Image caching with format optimization
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    swLogger.error('Image fetch failed', error);
    
    // Return placeholder image for failed requests
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#666">Image unavailable</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// API requests with network first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful API responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    swLogger.log('API fetch failed, trying cache', error);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API failures
    return new Response(
      JSON.stringify({
        error: 'Offline mode',
        message: 'API недоступно в оффлайн режиме'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Page requests with stale-while-revalidate
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  try {
    return await fetchPromise;
  } catch (error) {
    swLogger.log('Page fetch failed', error);
    
    // Return offline page
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Default request handler — network first, cache fallback for offline
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    swLogger.log('Default fetch failed, trying offline fallback');

    // For navigation requests, serve offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }

    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'form-submission') {
    event.waitUntil(handleFormSubmissionSync());
  }
});

async function handleFormSubmissionSync() {
  // Handle queued form submissions when back online
  const db = await openDB();
  const submissions = await getQueuedSubmissions(db);
  
  for (const submission of submissions) {
    try {
      await fetch(submission.url, submission.options);
      await removeQueuedSubmission(db, submission.id);
      swLogger.log('Queued submission sent', submission.id);
    } catch (error) {
      swLogger.error('Failed to send queued submission', error);
    }
  }
}

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Открыть',
        icon: '/images/icons/open-icon.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/images/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url;
    
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    swLogger.log('Performance report', event.data.metrics);
    
    // Could send to analytics service
    // sendToAnalytics(event.data.metrics);
  }
});

// IndexedDB helpers for offline functionality
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('dsp-offline-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getQueuedSubmissions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readonly');
    const store = transaction.objectStore('submissions');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function removeQueuedSubmission(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readwrite');
    const store = transaction.objectStore('submissions');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

swLogger.log('Service Worker v2.0.0 loaded successfully'); 