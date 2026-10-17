/* ============================================================
   sw.js - Service Worker (CORE)
   Change CACHE_NAME each time you deploy an update.
   Files are cached one by one, so deleting any module file
   never breaks installation.
   ============================================================ */
var CACHE_NAME = 'kingdom-app-v1';

var FILES = [
    './',
    'index.html',
    'styles.css',
    'app.js',
    'manifest.json',
    'GAS.js',
    'analytics.js',
    'telemetry.js',
    'contact-bar.js',
    'live-broadcast.js',
    'library.js',
    'prayer-wall.js',
    'testimony.js',
    'daily-word.js',
    'global-mission.js',
    'mission.js',
    'partner.js',
    'assignment.js',
    'how-to.js',
    'share.js',
    'about-developer.js',
    'announcement.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return Promise.all(FILES.map(function (file) {
                return cache.add(file).catch(function () {});
            }));
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    if (new URL(event.request.url).origin !== self.location.origin) return;
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
