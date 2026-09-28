/* Zone Scout offline cache. Bump VERSION when you upload a new index.html. */
const VERSION='zs-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k!=='zs-fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open('zs-fonts').then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const r=await fetch(req);c.put(req,r.clone());return r}catch(err){return Response.error()}}));return}
  if(u.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    e.respondWith((async()=>{const c=await caches.open(VERSION);
      try{const r=await Promise.race([fetch(req),new Promise((_,rej)=>setTimeout(()=>rej(new Error('slow')),3500))]);if(r&&r.ok)c.put('./index.html',r.clone());return r}
      catch(err){return (await c.match('./index.html'))||(await c.match('./'))||Response.error()}})());return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cl=r.clone();caches.open(VERSION).then(c=>c.put(req,cl))}return r})));
});
