const CACHE_NAME = "u11-coach-v29.7";
const ASSETS=["./","./index.html","./manifest.webmanifest","./u11-coach-icon-192.png","./u11-coach-icon-512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached) return cached;
    return fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
      return response;
    }).catch(()=>caches.match("./index.html"));
  }));
});
