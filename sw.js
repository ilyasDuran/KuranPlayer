/* Service Worker: kuran-player-v1.3 */
const CACHE_NAME = 'kuran-player-v1.3'; // Güncelleme yapınca burayı v1.4 yap!
const urlsToCache = [
  './',
  './index.html',
  './kurandata.js',
  './manifest.json'
];

// 1. Kurulum: Dosyaları Cache'e al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Yeni versiyonun beklemeden devreye girmesini sağlar
});

// 2. Aktivasyon: Eski cache'leri temizle (Otomatik güncelleme anahtarı)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski versiyon siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Kontrolü hemen ele al
});

// 3. Getirme: Önce Cache, yoksa Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


