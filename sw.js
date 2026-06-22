const CACHE_NAME = 'youth-memory-v15';
const ASSETS = [
  './',
  './index.html',
  './quizData.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './word_puzzle.png',
  './word_puzzle_2.png',
  './word_puzzle_3.png',
  './word_puzzle_4.png',
  './word_puzzle_5.png',
  './word_puzzle_6.png',
  './word_puzzle_7.png'
];

// 서비스 워커 설치 및 리소스 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 오래된 캐시 정리 및 활성화
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 오프라인 상태 및 빠른 성능을 위한 캐시 우선 반환 패턴
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // 캐시된 응답이 있으면 반환하고, 없으면 네트워크 요청 수행
      return cachedResponse || fetch(e.request).catch(() => {
        // 둘 다 실패하고 HTML 요청인 경우 대체할 오프라인 대응이 필요하다면 여기에 작성
      });
    })
  );
});
