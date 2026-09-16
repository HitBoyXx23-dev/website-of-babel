/* Website Of Babel v16: boxy shell, integrated Scramjet, 100 Internet Rules, richer non-YouTube media. */
const V16_VERSION='16.0.0';

function v16InstallShell(){
  const brand=document.querySelector('.brand');
  if(brand)brand.innerHTML='<span class="brand-mark" aria-hidden="true">B</span><span class="brand-name">Website Of Babel</span>';
  const nav=document.querySelector('#nav');
  if(nav)nav.innerHTML=`
    <a href="/search" data-route>Search</a><a href="/network" data-route>Network</a><a href="/library" data-route>Library</a><a href="/pi" data-route>Pi</a><a href="/media" data-route>Media</a><a href="/browser" data-route>Browser</a><a href="/arcade" data-route>Games</a><a href="/rules" data-route>Rules</a><a href="/tools" data-route>Tools</a><a href="/systems" data-route>All</a>
    <button class="global-search-button" id="globalSearchButton" aria-label="Search everything">Search <kbd>/</kbd></button><button class="theme-toggle" id="themeToggle" aria-label="Toggle theme"><span id="themeIcon">◐</span></button>`;
  document.querySelector('#globalSearchButton')?.addEventListener('click',()=>route('/search'));
  const theme=document.querySelector('#themeToggle');if(theme)theme.onclick=()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem(themeKey,next);applyTheme(next)};
  const mobile=document.querySelector('#mobileNav');if(mobile)mobile.onclick=()=>nav?.classList.toggle('open');
  wireRoutes();
}

universeHome=function(){
  setTitle('');
  const boxes=[
    ['SEARCH','Everything','/search','Knowledge · people · usernames · web · images · video · audio · files · code · research'],
    ['MAP','Network','/network','Drag, pan, zoom, discover websites, expand links, map people and concepts'],
    ['BABEL','Library + Pi','/library','Text spaces, phrases, verified digits, numbers, coordinates, generative rooms'],
    ['MEDIA','Images + video','/media','Wikimedia · Openverse · Internet Archive · NASA · PeerTube · direct page media'],
    ['WEB','Browser','/browser','Babel Reader plus integrated Scramjet browser mode'],
    ['TOOLS','Calculate','/tools','Scientific calculator · units · bases · JSON · hashes · text tools'],
    ['CULTURE','100 Rules','/rules','A searchable 100-rule archive of old internet folklore and meme culture'],
    ['PLAY','Games','/arcade','Built-in games · Freedoom · Bad Apple public-media search']
  ];
  app.innerHTML=`<div class="v16-home v13-wrap"><section class="v16-hero"><div class="v16-hero-mark">B</div><div><span class="v16-eyebrow">WEBSITE OF BABEL</span><h1>Everything, anywhere, through one index.</h1><p>Search knowledge, websites, public people and usernames, images, non-YouTube video, audio, files, code, archives, languages, countries, recipes, numbers, internet culture, games, and connected ideas.</p></div></section><form class="v16-search" id="v16HomeForm"><input id="v16HomeQ" autofocus autocomplete="off" placeholder="Search anything"><button>Search</button></form><div class="v16-quick">${['hitboyxx23','the end of the internet','C++','Japan','cake recipe','ghosts','DOOM','Bad Apple','Rule 34','pi','lucid dreaming'].map(x=>`<button data-v16-q="${esc(x)}">${esc(x)}</button>`).join('')}</div><section class="v16-box-grid">${boxes.map(([k,t,h,d])=>`<a href="${h}" data-route><span>${k}</span><h2>${t}</h2><p>${d}</p><i>OPEN →</i></a>`).join('')}</section></div>`;
  document.querySelector('#v16HomeForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v16HomeQ').value.trim();if(q)route(v9SearchRoute(q))};document.querySelectorAll('[data-v16-q]').forEach(b=>b.onclick=()=>route(v9SearchRoute(b.dataset.v16Q)));wireRoutes();
};

function v16MediaEmbed(x){
  const src=String(x.original||x.embed||x.url||'');if(!src||/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(src))return'';
  if(x.type==='video'){
    if(x.embed)return `<iframe class="v16-media-player" src="${esc(x.embed)}" loading="lazy" title="${esc(x.title||'Video')}" allow="fullscreen; autoplay" allowfullscreen referrerpolicy="no-referrer"></iframe>`;
    if(/\.(mp4|webm|ogv)(?:\?|$)/i.test(src))return `<video class="v16-media-player" controls preload="metadata" poster="${esc(x.thumbnail||x.url||'')}" src="${esc(src)}"></video>`;
  }
  if(x.type==='audio'&&x.original)return `<audio controls preload="none" src="${esc(x.original)}"></audio>`;
  return'';
}

v13MediaCard=function(x){
  const title=x.title||'Untitled',type=x.type||'file',thumb=x.thumbnail||((type==='image')?(x.url||x.original):x.url)||'',player=v16MediaEmbed(x);
  return `<article class="v13-media v16-media-card" data-kind="media ${esc(type)}">${player||((thumb&&!/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(thumb))?`<img src="${esc(thumb)}" alt="${esc(title)}" loading="lazy" referrerpolicy="no-referrer">`:'')}<div class="v13-media-body"><b>${esc(title)}</b><span>${esc(type)} · ${esc(x.source||'public source')}${x.creator?` · ${esc(x.creator)}`:''}${x.license?` · ${esc(x.license)}`:''}</span>${!player&&type==='audio'&&x.original?`<audio controls preload="none" src="${esc(x.original)}"></audio>`:''}${x.identifier?`<a href="/archive?id=${encodeURIComponent(x.identifier)}" data-route>Open in Babel</a>`:x.sourceUrl?`<a href="${v9ReaderRoute(x.sourceUrl)}" data-route>Inspect in Babel</a>`:''}</div></article>`;
};

v13WebItem=function(r,i){
  const thumb=r.thumbnail||r.avatar||'';
  return `<article class="v13-web-item v16-web-item" data-kind="web people" data-v16-preview="${esc(r.url||'')}"><span>${String(i+1).padStart(2,'0')}</span><div class="v16-web-core">${thumb?`<img class="v16-web-thumb" src="${esc(thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<div><h3>${esc(r.title||r.host||'Public web result')}</h3><p>${esc(r.snippet||'Public web result.')}</p><small>${esc(r.source||'web')} · ${esc(r.host||'')}</small><div class="v16-auto-media" aria-live="polite"></div></div></div><div class="v13-web-actions"><a href="${v9ReaderRoute(r.url)}" data-route>Read</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map</a></div></article>`;
};

function v16PreviewHTML(d){
  if(!d)return'';const img=(d.images||[])[0],vid=(d.videos||[]).find(v=>!/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(v.url||'')),aud=(d.audio||[])[0],files=d.files||[];
  let media='';if(vid){const u=vid.url||'';media=/\.(mp4|webm|ogv)(?:\?|$)/i.test(u)?`<video controls preload="none" src="${esc(u)}"></video>`:`<iframe class="v16-source-video" src="${esc(u)}" loading="lazy" title="Source video" allow="fullscreen; autoplay" referrerpolicy="no-referrer"></iframe>`}else if(img)media=`<img src="${esc(img.url)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;else if(aud)media=`<audio controls preload="none" src="${esc(aud.url)}"></audio>`;else if(files.length)media=`<span>${files.length} FILE${files.length===1?'':'S'} FOUND</span>`;return media;
}
function v16HydrateSources(root=document){
  const nodes=[...root.querySelectorAll('[data-v16-preview]')];if(!nodes.length)return;const io=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;io.unobserve(e.target);const url=e.target.dataset.v16Preview;if(!url)return;const box=e.target.querySelector('.v16-auto-media');if(!box)return;box.textContent='Scanning source media…';json(`/api/reader?url=${encodeURIComponent(url)}`).then(d=>{box.innerHTML=v16PreviewHTML(d)||''}).catch(()=>{box.textContent=''})}},{rootMargin:'500px 0px'});nodes.forEach(n=>io.observe(n));
}
const v16BaseBind=v13Bind;
v13Bind=function(root=document){v16BaseBind(root);v16HydrateSources(root)};

async function v16RulesPage(){
  setTitle('100 Rules of the Internet');app.innerHTML=`<div class="v13-wrap v13-page"><header class="v16-page-head"><span>INTERNET CULTURE ARCHIVE</span><h1>100 Rules of the Internet</h1><p>The numbered meme never had one permanent canonical edition. Babel preserves a complete 1–100 searchable archive edition with the famous recurring rules and historical context.</p></header><div class="v16-rule-tools"><input id="v16RuleFind" placeholder="Search all 100 rules"><span id="v16RuleCount">100 / 100</span></div><div class="v16-rules" id="v16Rules"><div class="v13-loading">Loading the archive…</div></div></div>`;
  try{let d=window.BABEL_INTERNET_RULES;try{const r=await fetch('/data/internet-rules.json',{cache:'no-store'});if(r.ok)d=await r.json()}catch{}if(!d||!Array.isArray(d.rules)||d.rules.length!==100)throw new Error('Rules archive unavailable');const host=document.querySelector('#v16Rules');host.innerHTML=`<div class="v16-rule-note">${esc(d.note||'')}</div>`+d.rules.map(r=>`<article data-rule-text="${esc(r.text.toLowerCase())}"><b>${String(r.number).padStart(3,'0')}</b><p>${esc(r.text)}</p><button data-v16-q="Rule ${r.number} internet ${esc(r.text.slice(0,80))}">Research</button></article>`).join('');const input=document.querySelector('#v16RuleFind'),count=document.querySelector('#v16RuleCount');input.oninput=()=>{const q=input.value.trim().toLowerCase();let n=0;host.querySelectorAll('article').forEach(a=>{const hit=!q||a.dataset.ruleText.includes(q)||a.querySelector('b').textContent.includes(q);a.hidden=!hit;if(hit)n++});count.textContent=`${n} / 100`};host.querySelectorAll('[data-v16-q]').forEach(b=>b.onclick=()=>route(v9SearchRoute(b.dataset.v16Q)))}catch(e){document.querySelector('#v16Rules').innerHTML=`<div class="v13-error">${esc(e.message)}</div>`}
}

let v16Scramjet=null,v16ScramjetFrame=null,v16ScramjetKeepalive=null,v16ScramjetTransport='';
function v16LoadScript(src){return new Promise((resolve,reject)=>{const found=document.querySelector(`script[data-v16-src="${src}"]`);if(found){if(found.dataset.ready==='1')return resolve();found.addEventListener('load',resolve,{once:true});found.addEventListener('error',reject,{once:true});return}const x=document.createElement('script');x.src=src;x.dataset.v16Src=src;x.onload=()=>{x.dataset.ready='1';resolve()};x.onerror=()=>reject(new Error(`Could not load ${src}`));document.head.appendChild(x)})}
async function v16DeleteDb(name){return new Promise(resolve=>{try{const r=indexedDB.deleteDatabase(name);r.onsuccess=r.onerror=r.onblocked=()=>resolve()}catch{resolve()}})}
async function v16ResetScramjetStorage(){
  try{if(indexedDB.databases){for(const db of await indexedDB.databases()){const name=db?.name||'';if(/bare.?mux|scramjet/i.test(name))await v16DeleteDb(name)}}}catch{}
}
async function v16MigrateLegacyScramjet(){
  const key='babel.scramjet.v22.migrated';
  if(sessionStorage.getItem(key)==='1')return false;
  let controlledByOld=false;
  try{
    const current=navigator.serviceWorker.controller?.scriptURL||'';
    controlledByOld=/\/scramjet-sw\.js(?:$|\?)/.test(current);
    for(const reg of await navigator.serviceWorker.getRegistrations()){
      const urls=[reg.active?.scriptURL,reg.waiting?.scriptURL,reg.installing?.scriptURL].filter(Boolean).join(' ');
      if(/\/scramjet-sw\.js(?:$|\?)/.test(urls))await reg.unregister();
    }
  }catch{}
  await v16ResetScramjetStorage();
  sessionStorage.setItem(key,'1');
  return controlledByOld;
}
async function v16WaitForServiceWorker(reg,timeout=12000){
  if(navigator.serviceWorker.controller)return navigator.serviceWorker.controller;
  await Promise.race([
    navigator.serviceWorker.ready.catch(()=>null),
    new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),
    new Promise(resolve=>setTimeout(resolve,timeout))
  ]);
  return navigator.serviceWorker.controller||reg.active||reg.waiting||null;
}
function v16StartKeepalive(){
  if(v16ScramjetKeepalive)return;
  v16ScramjetKeepalive=setInterval(()=>{try{navigator.serviceWorker.controller?.postMessage('keepalive')}catch{}},15000);
}
async function v16MakeTransport(cfg,forced=''){
  const preferred=(forced||cfg.transport||'bare').toLowerCase();
  if(preferred==='wisp'&&cfg.wispUrl){
    const mod=await import(cfg.libcurlModule||'/libcurl/index.mjs');
    const LibcurlClient=mod.default||mod.LibcurlClient;
    if(!LibcurlClient)throw new Error('libcurl transport did not export LibcurlClient.');
    v16ScramjetTransport='wisp';
    return new LibcurlClient({wisp:cfg.wispUrl});
  }
  const mod=await import(cfg.bareModule||'/baremod/index.mjs');
  const BareClient=mod.default||mod.BareClient;
  if(!BareClient)throw new Error('Bare transport did not export its client.');
  v16ScramjetTransport='bare';
  return new BareClient(new URL(cfg.bareUrl||'/bare/',location.href));
}
async function v16StartScramjet(cfg,forcedTransport=''){
  if(!('serviceWorker'in navigator))throw new Error('This browser does not support service workers.');
  if(await v16MigrateLegacyScramjet()){
    sessionStorage.setItem('babel.scramjet.pending.reload','1');
    location.reload();
    throw new Error('Removing the old Scramjet runtime. Reloading once.');
  }

  // Scramjet 2 load order is core -> controller -> utils.
  await v16LoadScript(cfg.scramjetCore||cfg.scramjetPath||'/scram/scramjet.js');
  await v16LoadScript(cfg.controllerApi||'/controller/controller.api.js');
  try{await v16LoadScript(cfg.utilsScript||'/utils/scramjet-utils.js')}catch{}

  const api=globalThis.$scramjetController;
  if(!api?.Controller)throw new Error('Scramjet 2 controller API did not load.');
  try{api.assertRuntimeScramjetVersion?.()}catch(e){throw new Error(`Scramjet runtime version mismatch: ${e.message||e}`)}

  const reg=await navigator.serviceWorker.register(cfg.serviceWorker||'/scramjet-v2-sw.js',{scope:'/',updateViaCache:'none'});
  try{await reg.update()}catch{}
  const sw=await v16WaitForServiceWorker(reg);
  if(!sw)throw new Error('Scramjet service worker did not become active.');

  const transport=await v16MakeTransport(cfg,forcedTransport);
  v16Scramjet=new api.Controller({
    serviceworker:sw,
    transport,
    config:{
      scramjetPath:cfg.scramjetPath||'/scram/scramjet.js',
      wasmPath:cfg.wasmPath||'/scram/scramjet.wasm',
      injectPath:cfg.injectPath||'/controller/controller.inject.js'
    }
  });
  await v16Scramjet.wait();
  v16StartKeepalive();
  return v16Scramjet;
}
async function v16InitScramjet(cfg,forcedTransport=''){
  if(v16Scramjet&&(!forcedTransport||forcedTransport===v16ScramjetTransport))return v16Scramjet;
  if(v16Scramjet&&forcedTransport&&forcedTransport!==v16ScramjetTransport){
    const next=await v16MakeTransport(cfg,forcedTransport);
    if(typeof v16Scramjet.setTransport==='function'){await v16Scramjet.setTransport(next);v16ScramjetTransport=forcedTransport;return v16Scramjet}
    v16Scramjet=null;
  }
  return v16StartScramjet(cfg,forcedTransport);
}
async function v16BrowserPage(){
  setTitle('Browser');
  let cfg={integratedScramjet:true,engine:'Scramjet 2',engineVersion:'2.0.67-alpha.2',transport:'bare',bareUrl:'/bare/',wispUrl:'',scramjetUrl:''};
  try{cfg=await json('/api/browser-config')}catch{}
  const canWisp=!!cfg.wispUrl;
  app.innerHTML=`<div class="v13-wrap v13-page v22-browser-page"><header class="v16-page-head"><span>BABEL BROWSER</span><h1>Browse inside Babel</h1><p>Scramjet 2 now uses Babel's same-deployment Bare transport by default on Vercel. Reader mode is the resilient fallback. A private Wisp relay can be configured for sites that require target WebSockets.</p></header><section class="v16-browser v22-browser"><div class="v22-tabbar"><button class="active">NEW TAB</button><span id="v22EngineBadge">ENGINE · READY</span><button id="v22ResetEngine">RESET ENGINE</button></div><div class="v16-browser-bar"><button id="v16Back" title="Back">←</button><button id="v16Forward" title="Forward">→</button><form id="v16BrowserForm"><input id="v16BrowserURL" autocomplete="off" spellcheck="false" placeholder="Enter a URL or search Babel"><button>GO</button></form><select id="v16BrowserMode" aria-label="Browser mode"><option value="scramjet">Scramjet 2</option><option value="reader">Babel Reader</option>${canWisp?'<option value="wisp">Scramjet + Wisp</option>':''}</select></div><div class="v22-browser-tools"><button id="v22Home">HOME</button><button id="v22Reload">RELOAD</button><button id="v22Reader">READER</button><button id="v22Network">MAP SITE</button><span id="v22Isolation">${crossOriginIsolated?'ISOLATED':'STANDARD CONTEXT'}</span></div><div class="v16-browser-status" id="v16BrowserStatus">Ready · ${esc(cfg.engine||'Scramjet 2')} ${esc(cfg.engineVersion||'')} · ${esc(cfg.transport||'bare')} transport</div><div class="v16-browser-stage" id="v16BrowserStage"><div class="v16-browser-empty"><b>B</b><span>Enter a public website. Search phrases are sent to Search Everywhere.</span><small>Vercel mode: ordinary HTTP browsing uses Babel Bare. WebSocket-heavy sites need an optional Wisp backend.</small></div></div></section><section class="v22-browser-info"><div><b>SCRAMJET</b><p>Interactive rewritten browsing with cookies, navigation and scripts.</p></div><div><b>READER</b><p>Fast normalized text, images, media, files and links when a full browser is unnecessary.</p></div><div><b>NETWORK</b><p>Map the current site's internal pages and outgoing links in Network of Babel.</p></div></section></div>`;

  const stage=document.querySelector('#v16BrowserStage'),status=document.querySelector('#v16BrowserStatus'),input=document.querySelector('#v16BrowserURL'),mode=document.querySelector('#v16BrowserMode'),badge=document.querySelector('#v22EngineBadge');
  const hist=[];let hi=-1,currentUrl='',lastMode='';
  const normalize=v=>{v=String(v||'').trim();if(!v)return'';if(/^https?:\/\//i.test(v))return v;if(/^[\w.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(v))return'https://'+v;return''};
  const setStatus=(text,state='')=>{status.textContent=text;badge.textContent=`ENGINE · ${state||text.split('·')[0].trim().toUpperCase()}`};
  const addHistory=(url,m)=>{hist.splice(hi+1);hist.push({url,mode:m});hi=hist.length-1};
  const renderReader=(url,note='')=>{stage.innerHTML=`${note?`<div class="v22-fallback-note">${esc(note)}</div>`:''}<iframe class="v16-browser-frame" src="${v9ReaderRoute(url)}" title="Babel Reader"></iframe>`;setStatus(`Babel Reader · ${url}`,'READER')};

  async function open(v,push=true){
    const url=normalize(v);if(!url){if(String(v||'').trim())route(v9SearchRoute(String(v).trim()));return}
    currentUrl=url;input.value=url;const selected=mode.value;if(push)addHistory(url,selected);lastMode=selected;
    if(selected==='reader'){renderReader(url);return}

    const transport=selected==='wisp'?'wisp':'bare';
    setStatus(`Starting Scramjet 2 · ${transport} transport`,'STARTING');
    stage.innerHTML='<div class="v16-browser-empty"><b>SJ2</b><span>Loading core, controller, service worker and transport…</span></div>';
    try{
      const sj=await v16InitScramjet(cfg,transport);
      stage.innerHTML='';
      const iframe=document.createElement('iframe');iframe.className='v16-browser-frame';iframe.title='Scramjet 2 Browser';stage.appendChild(iframe);
      const utils=globalThis.$scramjetUtils;const plugins=[];
      try{if(utils?.HttpCachePlugin)plugins.push(new utils.HttpCachePlugin())}catch{}
      try{if(utils?.UrlWatcherPlugin)plugins.push(new utils.UrlWatcherPlugin(next=>{if(!next)return;currentUrl=String(next);input.value=currentUrl;setStatus(`Scramjet 2 · ${v16ScramjetTransport} · ${currentUrl}`,'ONLINE')}))}catch{}
      try{if(utils?.CatchEscapedLinksPlugin)plugins.push(new utils.CatchEscapedLinksPlugin(()=>new URL(location.href)))}catch{}
      v16ScramjetFrame=sj.createFrame(iframe,{plugins});
      v16ScramjetFrame.go(url);
      setStatus(`Scramjet 2 · ${v16ScramjetTransport} · ${url}`,'ONLINE');
    }catch(e){
      console.error('[Babel Browser] Scramjet start failed',e);
      if(cfg.scramjetUrl){
        const src=cfg.scramjetUrl.includes('{url}')?cfg.scramjetUrl.replace('{url}',encodeURIComponent(url)):cfg.scramjetUrl+(cfg.scramjetUrl.includes('?')?'&':'?')+'url='+encodeURIComponent(url);
        stage.innerHTML=`<iframe class="v16-browser-frame" src="${esc(src)}" title="Remote Scramjet"></iframe>`;setStatus('Remote Scramjet fallback','REMOTE');
      }else{
        renderReader(url,`Interactive browser unavailable (${e.message||String(e)}). Babel switched to Reader mode for this page.`);
      }
    }
  }

  document.querySelector('#v16BrowserForm').onsubmit=e=>{e.preventDefault();open(input.value)};
  document.querySelector('#v16Back').onclick=()=>{if(hi>0){hi--;mode.value=hist[hi].mode;open(hist[hi].url,false)}else try{v16ScramjetFrame?.element?.contentWindow?.history.back()}catch{}};
  document.querySelector('#v16Forward').onclick=()=>{if(hi<hist.length-1){hi++;mode.value=hist[hi].mode;open(hist[hi].url,false)}else try{v16ScramjetFrame?.element?.contentWindow?.history.forward()}catch{}};
  document.querySelector('#v22Home').onclick=()=>{currentUrl='';input.value='';stage.innerHTML='<div class="v16-browser-empty"><b>B</b><span>Enter a public website. Search phrases are sent to Search Everywhere.</span></div>';setStatus('Ready · Babel Browser','READY')};
  document.querySelector('#v22Reload').onclick=()=>{if(currentUrl)open(currentUrl,false)};
  document.querySelector('#v22Reader').onclick=()=>{if(currentUrl){mode.value='reader';renderReader(currentUrl)}};
  document.querySelector('#v22Network').onclick=()=>{if(currentUrl){try{route(`/network?q=${encodeURIComponent(new URL(currentUrl).hostname)}`)}catch{}}};
  document.querySelector('#v22ResetEngine').onclick=async()=>{setStatus('Resetting Scramjet state…','RESET');try{for(const reg of await navigator.serviceWorker.getRegistrations()){const urls=[reg.active?.scriptURL,reg.waiting?.scriptURL,reg.installing?.scriptURL].filter(Boolean).join(' ');if(/scramjet-v2-sw\.js/.test(urls))await reg.unregister()}await v16ResetScramjetStorage();sessionStorage.removeItem('babel.scramjet.v22.migrated')}catch{}location.reload()};
  mode.onchange=()=>{if(currentUrl)open(currentUrl,false)};

  const pending=sessionStorage.getItem('babel.scramjet.pending.url');if(pending){sessionStorage.removeItem('babel.scramjet.pending.url');input.value=pending;setTimeout(()=>open(pending),0)}
}

const v16BaseRender=renderRoute;
renderRoute=async function(){
  v16InstallShell();window.scrollTo(0,0);const p=location.pathname;document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p));
  let r;if(p==='/browser')r=await v16BrowserPage();else if(p==='/rules')r=await v16RulesPage();else r=await v16BaseRender();v16InstallShell();document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p));return r;
};
setTimeout(()=>{v16InstallShell();try{renderRoute()}catch(e){console.error('v16 render failed',e)}},0);
