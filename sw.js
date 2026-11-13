const V='hl-20261113-0303';
const CORE=["./", "index.html", "manifest.webmanifest", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "fonts/lalezar-arabic-400-normal.woff2", "fonts/lalezar-latin-400-normal.woff2", "fonts/vazirmatn-arabic-400-normal.woff2", "fonts/vazirmatn-arabic-600-normal.woff2", "fonts/vazirmatn-arabic-800-normal.woff2", "fonts/vazirmatn-latin-400-normal.woff2", "fonts/vazirmatn-latin-600-normal.woff2", "fonts/vazirmatn-latin-800-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==self.location.origin)return;
  if(r.mode==='navigate'){
    const net=fetch(r).then(res=>{if(res.ok&&res.type==='basic'){const cp=res.clone();caches.open(V).then(c=>c.put('./',cp));}return res;});
    net.catch(()=>{});
    e.respondWith(Promise.race([net,new Promise(ok=>setTimeout(()=>ok(null),3500))]).then(x=>x||caches.match('./')).then(x=>x||net).catch(()=>caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok&&res.type==='basic'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;})));
});
