// Service Worker for GitHub Pages Portfolio Optimization
const CACHE_NAME = 'video-portfolio-v39';
const VIDEO_CACHE_NAME = 'video-cache-v39';

// Files to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css?v=39',
    '/script.js?v=39',
    '/favi.png'
];

// Install event - skip waiting to activate immediately
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(() => {});
        })
    );
});

// Activate event - claim clients immediately and purge old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== VIDEO_CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch event - Network-First for CSS/JS/HTML, fallback to cache if offline
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle video requests with performance optimization
    if (url.pathname.includes('/videos/') && url.pathname.endsWith('.mp4')) {
        event.respondWith(
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) return response;
                    return fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => new Response('', { status: 404 }));
                });
            })
        );
        return;
    }
    
    // Network-first strategy for code & assets
    event.respondWith(
        fetch(event.request).then(networkResponse => {
            if (networkResponse.ok && event.request.method === 'GET') {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            return caches.match(event.request);
        })
    );
});
