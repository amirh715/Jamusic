
self.addEventListener("beforeinstallprompt", function(e) {
  e.preventDefault();
  // log the platforms provided as options in an install prompt
  console.log(e.platforms); // e.g., ["web", "android", "windows"]
  e.userChoice.then(function(choiceResult) {
    console.log(choiceResult.outcome); // either "accepted" or "dismissed"
  }, handleError);
});
self.addEventListener('appinstalled', () => {
  console.log('appinstalled');
});
self.addEventListener('install', e => {
  console.log('install');
  e.waitUntil(
    caches.open('jamusic')
      .then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/assets',
          '/assets/icon/favicon.png',
          '/assets/icon/icon.png',
          '/assets/images/dark_street_background.jpg',
          '/assets/images/disc.png',
        ]);
      })
      .catch(err => console.log(err))
  );
});
self.addEventListener('fetch', (e) => console.log(e));
