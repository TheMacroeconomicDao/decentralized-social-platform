// Advanced Service Worker for DSP Platform 2025
// Version: 2.0.0

const CACHE_NAME = 'dsp-v2.0.0';
const STATIC_CACHE = 'dsp-static-v2.0.0';
const DYNAMIC_CACHE = 'dsp-dynamic-v2.0.0';
const IMAGE_CACHE = 'dsp-images-v2.0.0';

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
  console.log('[SW] Installing Service Worker v2.0.0');
  
  event.waitUntil(
    (async () => {
      // Cache critical resources
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(PRECACHE_URLS);
      
      // Skip waiting to activate immediately
      await self.skipWaiting();
      
      console.log('[SW] Critical resources cached');
    })()
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker v2.0.0');
  
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
      
      console.log('[SW] Old caches cleaned, SW activated');
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
  
  // Determine caching strategy
  if (CACHE_STRATEGIES.images.test(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else if (CACHE_STRATEGIES.static.test(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
  } else if (CACHE_STRATEGIES.api.test(url.href)) {
    event.respondWith(handleApiRequest(request));
  } else if (CACHE_STRATEGIES.pages.test(url.href)) {
    event.respondWith(handlePageRequest(request));
  } else {
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
    console.log('[SW] Image fetch failed:', error);
    
    // Return placeholder image for failed requests
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#666">Image unavailable</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Static assets caching
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Static asset fetch failed:', error);
    throw error;
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
    console.log('[SW] API fetch failed, trying cache:', error);
    
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
    console.log('[SW] Page fetch failed:', error);
    
    // Return offline page
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('[SW] Default fetch failed:', error);
    
    // Try to find in any cache
    const response = await caches.match(request);
    return response || new Response('Resource unavailable offline', { status: 503 });
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
      console.log('[SW] Queued submission sent:', submission.id);
    } catch (error) {
      console.log('[SW] Failed to send queued submission:', error);
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
    console.log('[SW] Performance report:', event.data.metrics);
    
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

console.log('[SW] Service Worker v2.0.0 loaded successfully'); 