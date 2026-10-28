const CACHE = 'dachlauf-v4';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const save = (req, res) => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; };
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Seite selbst: zuerst online laden (damit Updates sofort ankommen), offline aus dem Speicher
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => save(e.request, res)).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => save(e.request, res))));
});
