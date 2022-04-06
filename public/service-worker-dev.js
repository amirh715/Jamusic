self.addEventListener("beforeinstallprompt", function(e) {
  e.preventDefault();
});

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('jamusic')
      .then(cache => {
        return cache.addAll([
          '/',
          'index.html',
          'assets',
          'assets/icon/favicon.png',
          'assets/icon/icon.png',
          'assets/images/dark_street_background.jpg',
          'assets/images/disc.png',
        ]);
      })
      .catch(err => console.log(err))
  );
});
self.addEventListener('fetch', (e) => {});
