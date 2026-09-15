/* Website Of Babel v20: Scramjet v2 migration guard. */
(async()=>{
  try{
    if(!('serviceWorker' in navigator))return;
    for(const reg of await navigator.serviceWorker.getRegistrations()){
      const urls=[reg.active?.scriptURL,reg.waiting?.scriptURL,reg.installing?.scriptURL].filter(Boolean).join(' ');
      if(/\/scramjet-sw\.js(?:$|\?)/.test(urls))await reg.unregister();
    }
  }catch{}
})();
