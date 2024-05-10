const cacheFiles = [
  'index.html',
  'style.css',
  'index.js',
  'community-board/index.js',
  'community-board/index.html',
  'exercise/index.html',
  'exercise/index.js',
  'exercise/style.css',
  'exercise/outside-activity/index.html',
  'exercise/outside-activity/index.mjs',
  'exercise/outside-activity/style.css',
  'leaderboard/index.html',
  'leaderboard/index.js',
  'leaderboard/style.css',
  'profile/index.html',
  'profile/index.js',
  'profile/style.css',
  'background.mp4',
  'navbar.html',
];

const cacheName = 'myAppCache-v1';
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(cacheFiles))
      .catch(err => {
        console.error('Error adding files to cache:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) // cache it for the user or smthn idk
      .then(response => response || fetch(event.request)) // send the intercepted thingy idk im tired
  );
});