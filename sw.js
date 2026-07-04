// Block Inventory service worker — offline support.
// Bump CACHE when the app shell changes so clients pick up the new version.
const CACHE = "blockinv-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // data.enc: network-first (fresh when online, cached for offline). Key strips any query
  // so the cache-busting fetch in index.html still matches one stored copy.
  if (url.pathname.endsWith("/data.enc")) {
    const key = url.origin + url.pathname;
    e.respondWith(
      fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(key, cp)); return r; })
        .catch(() => caches.match(key))
    );
    return;
  }

  // app shell: stale-while-revalidate — serve cache fast, refresh cache in the background
  // so shell edits (favicon, layout) propagate on the next load without bumping CACHE.
  e.respondWith(caches.match(e.request).then(cached => {
    const fresh = fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, cp)); return r; })
      .catch(() => cached);
    return cached || fresh;
  }));
});
