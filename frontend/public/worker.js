// import { precacheAndRoute } from 'workbox-precaching';
// precacheAndRoute(self.__WB_MANIFEST);

//PWA INSTALLATION
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '/app/page.js',
                '/images/Notifications.png',
                '/manifest.json'
            ]);
        })
    );
});

// PWA CACHE
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

//FIREBASE NOTIFICATION
export const register = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then(function (registration) {
                console.log('Service Worker registration successful with scope: ', registration.scope);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }
};
