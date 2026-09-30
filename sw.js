/* Zone Scout offline cache. Bump VERSION when you upload a new index.html. */
const VERSION='zs-v25';
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

/* recheck reminders: the app writes due rechecks to on-phone storage; this reads them in the background */
function zsDb(){return new Promise((res,rej)=>{const r=indexedDB.open('zonescout',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function zsGet(db,k){return new Promise((res,rej)=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
function zsPut(db,k,v){return new Promise((res,rej)=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
async function zsCheckAlerts(){const db=await zsDb();const al=(await zsGet(db,'meta/alerts'))||[];const sent=(await zsGet(db,'meta/notified'))||{};
  const d=new Date();const t=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');let ch=false;
  for(const a of al){const id=a.key+'@'+a.due;if(a.due<=t&&!sent[id]){await self.registration.showNotification(a.title,{body:a.body,tag:a.key,icon:'icon-192.png',badge:'icon-192.png'});sent[id]=1;ch=true}}
  if(ch)await zsPut(db,'meta/notified',sent)}
self.addEventListener('periodicsync',e=>{if(e.tag==='zs-alerts')e.waitUntil(zsCheckAlerts())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c){if(c.navigate)c.navigate('./#alerts');return c.focus()}}return self.clients.openWindow('./#alerts')}))});
