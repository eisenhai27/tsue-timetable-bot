// Offline + speed. The app shell is served from the cache at once and refreshed in the background (stale-while-revalidate);
// timetable data is network-first with a short timeout, so a bad connection falls back to the last copy instead of hanging.
const CACHE = 'tsue-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
const put = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (/\/data\//.test(url.pathname)) {
    // data: network first (3.5 s), cached copy as the fallback
    e.respondWith(new Promise((resolve) => {
      let done = false;
      const fallback = () => caches.match(e.request, { ignoreSearch: true }).then((m) => { if (m && !done) { done = true; resolve(m); } });
      const timer = setTimeout(fallback, 3500);
      fetch(e.request).then((res) => { clearTimeout(timer); done = true; resolve(put(e.request, res)); },
        () => { clearTimeout(timer); caches.match(e.request, { ignoreSearch: true }).then((m) => { if (!done) { done = true; resolve(m || Response.error()); } }); });
    }));
    return;
  }
  // shell: cache first, refreshed in the background
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => {
    const net = fetch(e.request).then((res) => put(e.request, res)).catch(() => null);
    return hit || net.then((r) => r || Response.error());
  }));
});
