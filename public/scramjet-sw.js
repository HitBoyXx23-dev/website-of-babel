importScripts('/scramjet/scramjet.all.js');
const {ScramjetServiceWorker}=$scramjetLoadWorker();
const scramjet=new ScramjetServiceWorker();
const SCRAMJET_PREFIX='/service/';

self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  // Critical: Babel's API, JSON, media and normal pages bypass Scramjet entirely.
  if(url.origin!==self.location.origin || !url.pathname.startsWith(SCRAMJET_PREFIX)) return;
  event.respondWith((async()=>{
    try{
      await scramjet.loadConfig();
      if(scramjet.route(event)) return await scramjet.fetch(event);
      return fetch(event.request);
    }catch(err){
      console.error('[Babel Scramjet SW]',err);
      return new Response('Scramjet service unavailable. Re-open Babel Browser and retry.',{
        status:502,
        headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}
      });
    }
  })());
});
