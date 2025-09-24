// Service Worker for BizPilot PWA
const CACHE_NAME = 'bizpilot-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching App Shell');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((error) => {
                console.log('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version or fetch from network
                return cachedResponse || fetch(event.request)
                    .then((response) => {
                        // Cache successful requests
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    });
            })
            .catch(() => {
                // Fallback for offline scenarios
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Background sync for saving plans when online
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-plans') {
        event.waitUntil(syncPlans());
    }
});

// Sync saved plans with server when online
async function syncPlans() {
    try {
        const pendingPlans = await getStoredData('pendingPlans');
        if (pendingPlans && pendingPlans.length > 0) {
            for (const plan of pendingPlans) {
                await syncPlanToServer(plan);
            }
            await clearStoredData('pendingPlans');
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper functions for IndexedDB operations
function getStoredData(key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BizPilotDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['plans'], 'readonly');
            const store = transaction.objectStore('plans');
            const getRequest = store.get(key);
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };
            
            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

function clearStoredData(key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BizPilotDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['plans'], 'readwrite');
            const store = transaction.objectStore('plans');
            const deleteRequest = store.delete(key);
            
            deleteRequest.onsuccess = () => {
                resolve();
            };
            
            deleteRequest.onerror = () => {
                reject(deleteRequest.error);
            };
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function syncPlanToServer(plan) {
    // Simulate API call to sync plan
    return fetch('/api/plans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan)
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                url: '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open BizPilot'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification('BizPilot', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});