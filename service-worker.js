const CACHE_NAME = "u11-coach-v1.117";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./u11-coach-icon-192.png",
  "./u11-coach-icon-512.png",
  "./U11-Coach-Versionshistory.md",
  "./u11-parcours-aufbau.png",
  "./u11-beschleunigen-abbremser.png",
  "./u11-reaction-chase-game.png",
  "./u11-shoot-defense.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Spielerwerte.xlsx ist veränderliche Datenquelle und wird niemals
  // vom Service Worker zwischengespeichert.
  if (url.pathname.endsWith("/Spielerwerte.xlsx")) {
    event.respondWith(
      fetch(new Request(request, { cache: "no-store" }))
    );
    return;
  }

  // HTML-Navigation: immer zuerst Netzwerk, Cache nur als Fallback.
  if (request.mode === "navigate" ||
      request.destination === "document" ||
      url.pathname.endsWith("/index.html") ||
      url.pathname.endsWith("/")) {
    event.respondWith(
      fetch(new Request(request, { cache: "no-store" }))
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Statische Ressourcen: Cache bevorzugen, Netzwerk als Fallback.
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
        return response;
      }))
      .catch(() => caches.match("./index.html"))
  );
});
