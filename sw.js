const CACHE_NAME = 'lumenread-offline-v10';
const OFFLINE_ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(OFFLINE_ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{
   if(response && (response.ok || response.type==='opaque')) {
     const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy)).catch(()=>{});
   }
   return response;
 }).catch(()=>caches.match('./index.html'))));
});
