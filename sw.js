// Service Worker for GitHub Pages Video Optimization
const CACHE_NAME = 'video-portfolio-v1';
const VIDEO_CACHE_NAME = 'video-cache-v1';

// Files to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favi.png'
];

// Video files to cache - OPTIMIZED FOR PERFORMANCE
const videosToCache = [
    '/videos/reklama.mp4',
    '/videos/ELONMUSKNEWS.mp4'
    // Only cache critical videos to prevent memory issues
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(urlsToCache);
            }),
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                return cache.addAll(videosToCache);
            })
        ])
    );
});

// Fetch event - OPTIMIZED FOR PERFORMANCE
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle video requests with performance optimization
    if (url.pathname.includes('/videos/') && url.pathname.endsWith('.mp4')) {
        event.respondWith(
            caches.open(VIDEO_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        // Return cached video immediately
                        return response;
                    }
                    
                    // Fetch video with timeout
                    const fetchPromise = fetch(event.request);
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout')), 10000);
                    });
                    
                    return Promise.race([fetchPromise, timeoutPromise]).then(networkResponse => {
                        // Only cache if response is ok
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(error => {
                        console.warn('Video fetch failed:', url.pathname, error);
                        // Return a fallback response
                        return new Response('', { status: 404 });
                    });
                });
            })
        );
        return;
    }
    
    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
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
