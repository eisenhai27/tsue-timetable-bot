// Offline + speed. The page itself (HTML) is network-first with a short timeout, so a new version of the Mini App shows
// up on the very next open (it used to be cache-first, and a stale copy could stick for weeks); icons / manifest are
// cache-first, refreshed in the background. Timetable data is network-first too; a bad connection falls back to the last copy.
const CACHE = 'tsue-v7';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
const put = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const isPage = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  if (isPage || /\/data\//.test(url.pathname)) {
    // page + data: network first (3.5 s), cached copy as the fallback. The page is always stored under one key ('./'),
    // whatever ?v= / #hash it was opened with, so the fallback is the newest copy.
    const key = isPage ? new Request('./') : e.request;
    e.respondWith(new Promise((resolve) => {
      let done = false;
      const fallback = () => caches.match(key, { ignoreSearch: true }).then((m) => { if (m && !done) { done = true; resolve(m); } });
      const timer = setTimeout(fallback, 3500);
      // (a navigation request can't be re-sent with options, so the page is fetched by its address; no-cache = ask GitHub, skip the browser's copy)
      fetch(isPage ? new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' }) : e.request).then((res) => {
        clearTimeout(timer);
        if (isPage && res.redirected) { if (!done) { done = true; resolve(Response.redirect(res.url, 302)); } return; }
        const r = put(key, res); if (!done) { done = true; resolve(r); }
      },
        () => { clearTimeout(timer); caches.match(key, { ignoreSearch: true }).then((m) => { if (!done) { done = true; resolve(m || Response.error()); } }); });
    }));
    return;
  }
  // shell: cache first, refreshed in the background
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => {
    const net = fetch(e.request).then((res) => put(e.request, res)).catch(() => null);
    return hit || net.then((r) => r || Response.error());
  }));
});
