const CACHE_NAME="u11-coach-v1.095";
const ASSETS=["./","./index.html","./manifest.webmanifest","./u11-coach-icon-192.png","./u11-coach-icon-512.png","./U11-Coach-Versionshistory.md","./u11-parcours-aufbau.png","./u11-beschleunigen-abbremser.png","./u11-reaction-chase-game.png","./u11-shoot-defense.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE_NAME).then(k=>k.put(e.request,x));return r;}).catch(()=>caches.match("./index.html"))));});
