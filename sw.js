const CACHE_NAME = 'youth-memory-v23';
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

// ✅ 네트워크 우선 전략 (Network First)
// 항상 서버에서 최신 파일을 먼저 받아오고,
// 네트워크 오류 시에만 캐시를 사용합니다.
// 카카오톡 인앱 브라우저 등 캐시 문제를 방지합니다.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // 네트워크 응답 성공 시 캐시도 최신으로 업데이트
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => {
        // 네트워크 실패(오프라인) 시 캐시에서 반환
        return caches.match(e.request);
      })
  );
});
