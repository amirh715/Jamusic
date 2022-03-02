
const cacheName = 'JamusicV1.0.0';
const appShellFiles = [
  '/',
  '/index.html',
  '/assets/images/dark_street_background.jpg',
  '/assets/images/disc.png',
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(appShellFiles);
  })());
});

self.addEventListener('offline', (ev) => console.log('OFFLINE: ', ev));
