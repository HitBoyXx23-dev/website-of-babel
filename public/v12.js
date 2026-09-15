/* Website Of Babel v12: simple shell, multi-source people search, movable network, browser, arcade. */
const V12_VERSION='12.0.0';

BABEL_SYSTEMS.push(
  {n:'26',name:'Babel Browser',route:'/browser',kind:'WEB BROWSER',desc:'Internal Reader browsing with an optional Scramjet adapter for a separately hosted Scramjet browser endpoint.'},
  {n:'27',name:'Arcade of Babel',route:'/arcade',kind:'GAMES + DEMOS',desc:'Built-in HTML5 games, a Doom-compatible Freedoom launcher, and the official Bad Apple video embedded inside Babel.'},
  {n:'28',name:'Rules of the Internet',route:'/rules',kind:'INTERNET CULTURE',desc:'A contextual guide to the old Rules of the Internet meme, its history, variants, and influence.'}
);

function v12InstallShell(){
  const brand=document.querySelector('.brand');
  if(brand)brand.innerHTML='<span class="brand-name">Website Of Babel</span>';
  const nav=document.querySelector('#nav');
  if(nav)nav.innerHTML=`
    <a href="/" data-route>Home</a>
    <a href="/search" data-route>Search</a>
    <a href="/network" data-route>Network</a>
    <a href="/browser" data-route>Browser</a>
    <a href="/arcade" data-route>Arcade</a>
    <a href="/library" data-route>Library</a>
    <a href="/pi" data-route>Pi</a>
    <a href="/systems" data-route>More</a>
    <button class="global-search-button" id="globalSearchButton" aria-label="Search everywhere">Search <kbd>/</kbd></button>
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle light and dark mode"><span id="themeIcon">◐</span></button>`;
  const searchBtn=document.querySelector('#globalSearchButton');
  if(searchBtn)searchBtn.onclick=()=>route('/search');
  const theme=document.querySelector('#themeToggle');
  if(theme)theme.onclick=()=>{const root=document.documentElement;const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;localStorage.setItem('babel.theme',next)};
  wireRoutes();
}

function v12Pill(q,label=q){return `<button class="v12-pill" data-v12-search="${esc(q)}">${esc(label)}</button>`}
function v12BindSearch(root=document){root.querySelectorAll('[data-v12-search]').forEach(b=>b.onclick=()=>route(v9SearchRoute(b.dataset.v12Search)));wireRoutes()}
function v12RouteCard(name,route,copy,tag){return `<a class="v12-route-card" href="${route}" data-route><span>${esc(tag)}</span><h3>${esc(name)}</h3><p>${esc(copy)}</p><b>Open</b></a>`}

universeHome=function(){
  setTitle('');
  app.innerHTML=`<div class="v12-home">
    <section class="v12-home-hero">
      <div class="v12-eyebrow">UNIVERSAL RESEARCH INDEX</div>
      <h1>Website Of Babel</h1>
      <p>Search knowledge, websites, usernames, people, code, recipes, languages, countries, media, files, mathematics, folklore, games, and connected ideas from one place.</p>
      <form id="v12HomeSearch" class="v12-searchbar"><input id="v12HomeQ" autocomplete="off" placeholder="Search anything"><button>Search</button></form>
      <div class="v12-quick">${['hitboyxx23','the end of the internet','Python','sourdough','Japanese language','Japan','ghosts','lucid dreaming','π','Rules of the Internet'].map(x=>v12Pill(x)).join('')}</div>
    </section>
    <section class="v12-primary-grid">
      ${v12RouteCard('Search Everything','/search','Build a full internal dossier from public knowledge, web results, media, papers, files, code, and structured data.','01')}
      ${v12RouteCard('Network of Babel','/network','Search the web and move around a pan, zoom, drag, and expand graph of real sites and Babel topics.','02')}
      ${v12RouteCard('Babel Browser','/browser','Browse through Babel Reader or connect a Scramjet browser endpoint.','03')}
      ${v12RouteCard('Arcade of Babel','/arcade','Play built-in games, launch a Doom-compatible Freedoom build, or watch Bad Apple inside Babel.','04')}
    </section>
    <section class="v12-section">
      <header><span>KNOWLEDGE</span><h2>Browse by field</h2></header>
      <div class="v12-field-grid">
        ${v12RouteCard('Programming','/code','Programming languages, compilers, APIs, algorithms, repositories, and learning paths.','CODE')}
        ${v12RouteCard('Cooking + Baking','/food','Recipes, ingredients, cuisines, technique, food science, and troubleshooting.','FOOD')}
        ${v12RouteCard('Human Languages','/languages','ISO language catalog, grammar, writing systems, translation, and learning.','LANG')}
        ${v12RouteCard('Countries + Places','/world','Countries, territories, geography, culture, languages, currencies, and reference data.','WORLD')}
        ${v12RouteCard('Ghosts + Spirits','/paranormal','Folklore, spiritual traditions, ghost-hunting claims, skeptical explanations, and evidence.','CLAIMS')}
        ${v12RouteCard('Mature Knowledge','/mature','Age-aware sexual health, relationships, consent, law, history, and media literacy.','18+')}
        ${v12RouteCard('Mind Palace','/palace','Method of loci, memory routes, cues, retrieval practice, and local notes.','MIND')}
        ${v12RouteCard('Internet Culture','/rules','Rules of the Internet, web folklore, memes, communities, and history.','WEB')}
      </div>
    </section>
    <section class="v12-strip"><b>Private by default</b><span>Searches do not publish permanent pages. Personal notes remain on this device.</span><a href="/systems" data-route>View all systems</a></section>
  </div>`;
  document.querySelector('#v12HomeSearch').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v12HomeQ').value.trim();if(q)route(v9SearchRoute(q))};
  v12BindSearch();
};

const v12OldDossier=v10RenderDossier;
v10RenderDossier=function(q,d,web,topPage,trends){
  let html=v12OldDossier(q,d,web,topPage,trends);const rows=web?.results||[];const profiles=rows.filter(x=>x.kind==='profile');const more=rows.slice(24);
  const providers=web?.providers||{};
  const extra=`<section class="v10-dossier-section v12-search-sources"><div class="v10-section-head"><span>WEB SEARCH COVERAGE</span><h3>People, usernames, sites, and profiles</h3><small>${rows.length} returned results</small></div>
    <div class="v12-provider-row">${Object.entries(providers).map(([k,v])=>`<span><b>${esc(k)}</b>${Number(v||0)}</span>`).join('')}</div>
    ${profiles.length?`<div class="v12-profile-grid">${profiles.slice(0,24).map(x=>`<article>${x.avatar?`<img src="${esc(x.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<div><span>${esc(x.source||'profile')}</span><h4>${esc(x.title)}</h4><p>${esc(x.snippet||'Public profile result.')}</p><a href="${v9ReaderRoute(x.url)}" data-route>Read in Babel</a><a href="/network?q=${encodeURIComponent(x.url)}" data-route>Map</a></div></article>`).join('')}</div><p class="v12-identity-note">Matching usernames on different services are separate public results. A shared handle alone does not prove the accounts belong to the same person.</p>`:''}
    ${more.length?`<details class="v12-more-results"><summary>Show ${more.length} more web results</summary><div class="v10-web-grid">${more.map((r,i)=>`<article><span>${String(i+25).padStart(2,'0')} · ${esc(r.host||v10Host(r.url))}</span><h4>${esc(r.title||r.host)}</h4><p>${esc(r.snippet||'Public web result.')}</p><a href="${v9ReaderRoute(r.url)}" data-route>Read in Babel</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map</a></article>`).join('')}</div></details>`:''}
  </section>`;
  const at=html.lastIndexOf('</article>');return at>=0?html.slice(0,at)+extra+html.slice(at):html+extra;
};

async function v12PeoplePage(){
  setTitle('People + Usernames');const initial=new URLSearchParams(location.search).get('q')||'';
  app.innerHTML=`<div class="v12-page"><header class="v12-page-head"><div><span>PUBLIC IDENTITY SEARCH</span><h1>People + Usernames</h1></div><p>Search public web results, exact handle checks, developer networks, reference pages, and websites. Babel does not assume that identical handles belong to the same person.</p></header>
  <form id="v12PeopleForm" class="v12-searchbar"><input id="v12PeopleQ" value="${esc(initial)}" placeholder="Name, username, handle, website, organization"><button>Search</button></form><div id="v12PeopleOut" class="v12-results-empty">Search a name or handle.</div></div>`;
  const run=async q=>{if(!q)return;history.replaceState({},'',`/people?q=${encodeURIComponent(q)}`);const out=document.querySelector('#v12PeopleOut');out.innerHTML='<div class="v12-loading">Searching public sources...</div>';try{const d=await json(`/api/websearch?q=${encodeURIComponent(q)}`);const rows=d.results||[];out.innerHTML=`<div class="v12-result-summary"><b>${rows.length}</b><span>public results</span><small>${Object.entries(d.providers||{}).map(([k,v])=>`${k}: ${v}`).join(' · ')}</small></div><div class="v12-profile-grid v12-profile-grid-all">${rows.map(r=>`<article>${r.avatar?`<img src="${esc(r.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<div><span>${esc(r.kind||'website')} · ${esc(r.source||'public web')}</span><h3>${esc(r.title||r.host)}</h3><p>${esc(r.snippet||'Public result.')}</p><a href="${v9ReaderRoute(r.url)}" data-route>Read in Babel</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Graph</a></div></article>`).join('')}</div><p class="v12-identity-note">Results show public pages and handle matches, not verified identity relationships.</p>`;wireRoutes()}catch(e){out.innerHTML=`<div class="v12-error">${esc(e.message)}</div>`}};
  document.querySelector('#v12PeopleForm').onsubmit=e=>{e.preventDefault();run(document.querySelector('#v12PeopleQ').value.trim())};if(initial)run(initial);
}

async function v12WebPage(){
  setTitle('Web');const initial=new URLSearchParams(location.search).get('q')||'';
  app.innerHTML=`<div class="v12-page"><header class="v12-page-head"><div><span>PUBLIC WEB INDEX</span><h1>Web of Babel</h1></div><p>Search real public websites, profiles, references, and communities. Results stay inside Babel Reader and can be mapped into Network of Babel.</p></header>
  <form id="v12WebForm" class="v12-searchbar"><input id="v12WebQ" value="${esc(initial)}" placeholder="Website, username, person, phrase, domain"><button>Search web</button></form><div id="v12WebOut">${v10WebLanding()}</div></div>`;
  const run=async q=>{if(!q)return;history.replaceState({},'',`/web?q=${encodeURIComponent(q)}`);const out=document.querySelector('#v12WebOut');out.innerHTML='<div class="v12-loading">Searching multiple public indexes...</div>';try{const d=await json(`/api/websearch?q=${encodeURIComponent(q)}`);const rows=d.results||[];out.innerHTML=`<div class="v12-result-summary"><b>${rows.length}</b><span>results</span><small>${Object.entries(d.providers||{}).map(([k,v])=>`${k}: ${v}`).join(' · ')}</small></div><div class="v12-web-results">${rows.map((r,i)=>`<article><span>${String(i+1).padStart(2,'0')} · ${esc(r.source||'web')}</span><h3>${esc(r.title||r.host)}</h3><p>${esc(r.snippet||r.host||'Public result.')}</p><div><a href="${v9ReaderRoute(r.url)}" data-route>Read in Babel</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map</a></div></article>`).join('')}</div>`;wireRoutes()}catch(e){out.innerHTML=`<div class="v12-error">${esc(e.message)}</div>`}};
  document.querySelector('#v12WebForm').onsubmit=e=>{e.preventDefault();run(document.querySelector('#v12WebQ').value.trim())};if(initial)run(initial);wireRoutes();
}

function v12SvgEl(name,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el}
async function v12NetworkPage(){
  setTitle('Network');await loadExplore();const initial=new URLSearchParams(location.search).get('q')||'';const topics=v7Curated();
  app.innerHTML=`<div class="v12-network-page"><header class="v12-page-head"><div><span>INTERACTIVE WEB + KNOWLEDGE GRAPH</span><h1>Network of Babel</h1></div><p>Search a subject, username, or website. Drag nodes, pan the background, zoom, inspect results, and expand real websites into their outgoing links.</p></header>
  <form id="v12NetForm" class="v12-searchbar"><input id="v12NetQ" value="${esc(initial)}" placeholder="Search hitboyxx23, hmpg.net, a person, topic, or website"><button>Map</button></form>
  <div class="v12-net-toolbar"><div><button id="v12NetFit">Fit</button><button id="v12NetIn">+</button><button id="v12NetOut">-</button><button id="v12NetReset">Reset</button></div><span id="v12NetStatus">Ready</span></div>
  <div class="v12-net-layout"><div class="v12-net-stage"><svg id="v12NetSvg" viewBox="-700 -450 1400 900" aria-label="Movable Network of Babel graph"><g id="v12NetEdges"></g><g id="v12NetNodes"></g></svg><div class="v12-net-help">DRAG NODE · DRAG BACKGROUND · WHEEL ZOOM · DOUBLE CLICK TO OPEN</div></div><aside id="v12NetInspector"><span>NETWORK INSPECTOR</span><h2>Search or select a node</h2><p>The graph combines Babel entries with live public websites and public profile results.</p></aside></div></div>`;
  const svg=document.querySelector('#v12NetSvg'),edgesG=document.querySelector('#v12NetEdges'),nodesG=document.querySelector('#v12NetNodes'),ins=document.querySelector('#v12NetInspector'),status=document.querySelector('#v12NetStatus');
  let nodes=[],edges=[],vb={x:-700,y:-450,w:1400,h:900},selected=null,drag=null;
  const nodeById=()=>new Map(nodes.map(x=>[x.id,x]));
  function applyVB(){svg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`)}
  function point(e){const r=svg.getBoundingClientRect();return {x:vb.x+(e.clientX-r.left)/r.width*vb.w,y:vb.y+(e.clientY-r.top)/r.height*vb.h}}
  function draw(){
    edgesG.textContent='';nodesG.textContent='';const map=nodeById();
    for(const [a,b] of edges){const A=map.get(a),B=map.get(b);if(!A||!B)continue;edgesG.appendChild(v12SvgEl('line',{x1:A.x,y1:A.y,x2:B.x,y2:B.y,class:'v12-edge'}))}
    for(const n of nodes){const g=v12SvgEl('g',{class:`v12-node v12-node-${n.kind}${selected===n?' selected':''}`,'data-id':n.id,transform:`translate(${n.x} ${n.y})`});const c=v12SvgEl('circle',{r:n.r||10});const t=v12SvgEl('text',{x:(n.r||10)+8,y:4});t.textContent=n.label.length>38?n.label.slice(0,35)+'...':n.label;g.append(c,t);nodesG.appendChild(g)}
  }
  function fit(){if(!nodes.length){vb={x:-700,y:-450,w:1400,h:900};applyVB();return}const xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y);const minX=Math.min(...xs)-180,maxX=Math.max(...xs)+300,minY=Math.min(...ys)-140,maxY=Math.max(...ys)+140;vb={x:minX,y:minY,w:Math.max(700,maxX-minX),h:Math.max(520,maxY-minY)};applyVB()}
  function inspect(n){selected=n;draw();if(!n){ins.innerHTML='<span>NETWORK INSPECTOR</span><h2>Select a node</h2>';return}if(n.kind==='web'||n.kind==='profile'){ins.innerHTML=`<span>${esc((n.kind||'website').toUpperCase())}</span>${n.avatar?`<img class="v12-inspector-avatar" src="${esc(n.avatar)}" alt="" referrerpolicy="no-referrer">`:''}<h2>${esc(n.label)}</h2><code>${esc(n.host||'')}</code><p>${esc(n.desc||'Public web result.')}</p><div class="v12-inspector-actions"><a href="${v9ReaderRoute(n.url)}" data-route>Read in Babel</a><button id="v12Expand">Expand links</button></div>`;document.querySelector('#v12Expand').onclick=()=>expand(n);wireRoutes();return}if(n.kind==='topic'){ins.innerHTML=`<span>BABEL ENTRY</span><h2>${esc(n.label)}</h2><p>${esc(n.desc||'')}</p><div class="v12-inspector-actions"><a href="/topic/${encodeURIComponent(n.slug)}" data-route>Open entry</a><a href="${v9SearchRoute(n.label)}" data-route>Build dossier</a></div>`;wireRoutes();return}ins.innerHTML=`<span>SEARCH ROOT</span><h2>${esc(n.label)}</h2><p>${esc(n.desc||'Search results radiate from this node.')}</p>`}
  async function expand(n){status.textContent=`Reading links from ${n.host||n.label}...`;try{const d=await json(`/api/webgraph?url=${encodeURIComponent(n.url)}`);const existing=new Set(nodes.map(x=>x.url).filter(Boolean));const links=(d.links||[]).filter(x=>!existing.has(x.url)).slice(0,70);links.forEach((r,i)=>{const a=i/Math.max(1,links.length)*Math.PI*2,dist=170+(i%6)*28;const child={id:`web:${r.url}`,kind:'web',label:r.host||r.url,host:r.host||'',url:r.url,desc:r.sameSite?'Link on the same site':'Outgoing public link',x:n.x+Math.cos(a)*dist,y:n.y+Math.sin(a)*dist,r:7};nodes.push(child);edges.push([n.id,child.id])});status.textContent=`${links.length} links added · ${nodes.length} nodes`;draw()}catch(e){status.textContent=`Could not expand: ${e.message}`}}
  async function search(q){if(!q)return;history.replaceState({},'',`/network?q=${encodeURIComponent(q)}`);status.textContent=`Searching ${q}...`;let d={results:[]};try{d=await json(`/api/websearch?q=${encodeURIComponent(q)}`)}catch(e){status.textContent=e.message}const local=topics.filter(t=>`${t.title} ${t.dek||''} ${(t.tags||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0,16);nodes=[];edges=[];const root={id:'root',kind:'root',label:q,desc:`${local.length} Babel matches and ${(d.results||[]).length} public web results`,x:0,y:0,r:17};nodes.push(root);
    local.forEach((t,i)=>{const a=(i/Math.max(1,local.length))*Math.PI*2;const n={id:`topic:${t.slug}`,kind:'topic',label:t.title,slug:t.slug,desc:t.dek||'',x:Math.cos(a)*260,y:Math.sin(a)*260,r:9};nodes.push(n);edges.push(['root',n.id])});
    (d.results||[]).slice(0,60).forEach((r,i)=>{const ring=430+Math.floor(i/15)*190,a=(i%15)/15*Math.PI*2+(Math.floor(i/15)*.18);const n={id:`web:${i}:${r.url}`,kind:r.kind==='profile'?'profile':'web',label:r.title||r.host,desc:r.snippet||'',url:r.url,host:r.host||v10Host(r.url),avatar:r.avatar||'',x:Math.cos(a)*ring,y:Math.sin(a)*ring,r:r.kind==='profile'?9:7};nodes.push(n);edges.push(['root',n.id])});selected=root;draw();fit();inspect(root);status.textContent=`${nodes.length} nodes · ${d.count||0} public results · drag, zoom, expand`}
  svg.addEventListener('pointerdown',e=>{const g=e.target.closest?.('.v12-node');if(g){const n=nodes.find(x=>x.id===g.dataset.id);drag={type:'node',n,start:point(e),nx:n.x,ny:n.y,moved:false};svg.setPointerCapture(e.pointerId);return}drag={type:'pan',sx:e.clientX,sy:e.clientY,vx:vb.x,vy:vb.y,moved:false};svg.setPointerCapture(e.pointerId)});
  svg.addEventListener('pointermove',e=>{if(!drag)return;if(drag.type==='node'){const p=point(e),dx=p.x-drag.start.x,dy=p.y-drag.start.y;if(Math.hypot(dx,dy)>2)drag.moved=true;drag.n.x=drag.nx+dx;drag.n.y=drag.ny+dy;draw()}else{const r=svg.getBoundingClientRect(),dx=(e.clientX-drag.sx)/r.width*vb.w,dy=(e.clientY-drag.sy)/r.height*vb.h;if(Math.hypot(dx,dy)>2)drag.moved=true;vb.x=drag.vx-dx;vb.y=drag.vy-dy;applyVB()}});
  svg.addEventListener('pointerup',e=>{if(drag?.type==='node'&&!drag.moved)inspect(drag.n);drag=null;try{svg.releasePointerCapture(e.pointerId)}catch{}});
  svg.addEventListener('dblclick',e=>{const g=e.target.closest?.('.v12-node');if(!g)return;const n=nodes.find(x=>x.id===g.dataset.id);if(n?.url)route(v9ReaderRoute(n.url));else if(n?.slug)route(`/topic/${n.slug}`)});
  svg.addEventListener('wheel',e=>{e.preventDefault();const p=point(e),factor=e.deltaY<0 ? .82 : 1.22,nw=Math.max(250,Math.min(10000,vb.w*factor)),nh=nw*(vb.h/vb.w),r=svg.getBoundingClientRect(),rx=(e.clientX-r.left)/r.width,ry=(e.clientY-r.top)/r.height;vb={x:p.x-rx*nw,y:p.y-ry*nh,w:nw,h:nh};applyVB()},{passive:false});
  document.querySelector('#v12NetForm').onsubmit=e=>{e.preventDefault();search(document.querySelector('#v12NetQ').value.trim())};document.querySelector('#v12NetFit').onclick=fit;document.querySelector('#v12NetIn').onclick=()=>{vb.x+=vb.w*.1;vb.y+=vb.h*.1;vb.w*=.8;vb.h*=.8;applyVB()};document.querySelector('#v12NetOut').onclick=()=>{vb.x-=vb.w*.125;vb.y-=vb.h*.125;vb.w*=1.25;vb.h*=1.25;applyVB()};document.querySelector('#v12NetReset').onclick=()=>{nodes=[];edges=[];selected=null;draw();fit();inspect(null);status.textContent='Ready'};
  if(initial)search(initial);else{nodes=[{id:'root',kind:'root',label:'Website Of Babel',desc:'Search above to map the public web and Babel knowledge.',x:0,y:0,r:17}];topics.slice(0,20).forEach((t,i)=>{const a=i/20*Math.PI*2,n={id:`topic:${t.slug}`,kind:'topic',label:t.title,slug:t.slug,desc:t.dek||'',x:Math.cos(a)*360,y:Math.sin(a)*360,r:8};nodes.push(n);edges.push(['root',n.id])});draw();fit()}
}

async function v12BrowserPage(){
  setTitle('Browser');let cfg={scramjetUrl:'',mode:'reader'};try{cfg=await json('/api/browser-config')}catch{}
  app.innerHTML=`<div class="v12-page v12-browser-page"><header class="v12-page-head"><div><span>WEB ACCESS</span><h1>Babel Browser</h1></div><p>Reader mode works directly on Vercel. Scramjet mode becomes available when a Scramjet browser endpoint is configured with <code>SCRAMJET_BROWSER_URL</code>.</p></header>
  <div class="v12-browser"><div class="v12-browser-bar"><button id="v12BrowserBack">←</button><button id="v12BrowserForward">→</button><form id="v12BrowserForm"><input id="v12BrowserURL" placeholder="https://example.com or search phrase"><button>Go</button></form><select id="v12BrowserMode"><option value="reader">Babel Reader</option><option value="scramjet" ${cfg.scramjetUrl?'':'disabled'}>Scramjet${cfg.scramjetUrl?'':' (configure endpoint)'}</option></select></div><div class="v12-browser-frame"><iframe id="v12BrowserFrame" title="Babel Browser" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts" referrerpolicy="no-referrer"></iframe><div id="v12BrowserBlank"><b>Babel Browser</b><span>Enter a URL or phrase above.</span>${cfg.scramjetUrl?'<small>Scramjet adapter is configured.</small>':'<small>Reader mode is active. Add SCRAMJET_BROWSER_URL in Vercel to connect a Scramjet deployment.</small>'}</div></div></div>
  <section class="v12-browser-notes"><article><span>READER</span><h3>Internal snapshots</h3><p>Fetches public pages through Babel Reader, extracts readable sections, images, media references, and links, and keeps navigation inside the site.</p></article><article><span>SCRAMJET</span><h3>Full browser adapter</h3><p>Designed to point at your own Scramjet deployment. Scramjet itself requires a compatible transport/relay; Vercel is used for the Babel frontend.</p></article></section></div>`;
  const frame=document.querySelector('#v12BrowserFrame'),blank=document.querySelector('#v12BrowserBlank'),input=document.querySelector('#v12BrowserURL'),mode=document.querySelector('#v12BrowserMode');const hist=[];let hi=-1;
  function normalize(v){v=v.trim();if(!v)return'';if(/^https?:\/\//i.test(v))return v;if(/^[\w.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(v))return'https://'+v;return''}
  function open(v,push=true){const url=normalize(v);if(!url){route(v9SearchRoute(v));return}blank.hidden=true;if(mode.value==='scramjet'&&cfg.scramjetUrl){const base=cfg.scramjetUrl;frame.src=base.includes('{url}')?base.replace('{url}',encodeURIComponent(url)):base+(base.includes('?')?'&':'?')+'url='+encodeURIComponent(url)}else frame.src=v9ReaderRoute(url);input.value=url;if(push){hist.splice(hi+1);hist.push({url,mode:mode.value});hi=hist.length-1}}
  document.querySelector('#v12BrowserForm').onsubmit=e=>{e.preventDefault();open(input.value)};document.querySelector('#v12BrowserBack').onclick=()=>{if(hi>0){hi--;mode.value=hist[hi].mode;open(hist[hi].url,false)}};document.querySelector('#v12BrowserForward').onclick=()=>{if(hi<hist.length-1){hi++;mode.value=hist[hi].mode;open(hist[hi].url,false)}};
}

function v12Snake(canvas){const ctx=canvas.getContext('2d'),N=20,S=canvas.width/N;let snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}],dir={x:1,y:0},next=dir,food={x:14,y:10},score=0,timer=null;canvas.tabIndex=0;canvas.focus();const place=()=>{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};if(snake.some(p=>p.x===food.x&&p.y===food.y))place()};const draw=()=>{ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';snake.forEach((p,i)=>ctx.fillRect(p.x*S+2,p.y*S+2,S-4,S-4));ctx.strokeStyle='#fff';ctx.strokeRect(food.x*S+4,food.y*S+4,S-8,S-8);ctx.font='16px monospace';ctx.fillText(`SCORE ${score}`,10,20)};const tick=()=>{dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||snake.some(p=>p.x===h.x&&p.y===h.y)){clearInterval(timer);ctx.fillStyle='#fff';ctx.font='24px monospace';ctx.fillText('GAME OVER',120,205);return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;place()}else snake.pop();draw()};canvas.onkeydown=e=>{const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}}[e.key];if(m&&!(m.x===-dir.x&&m.y===-dir.y)){e.preventDefault();next=m}};draw();timer=setInterval(tick,110);return()=>clearInterval(timer)}
function v12Pong(canvas){const ctx=canvas.getContext('2d');let py=160,ai=160,ball={x:240,y:200,vx:4.2,vy:2.6},score=[0,0],keys={};canvas.tabIndex=0;canvas.focus();canvas.onkeydown=e=>{keys[e.key]=1;e.preventDefault()};canvas.onkeyup=e=>{keys[e.key]=0};let raf;const loop=()=>{if(keys.ArrowUp||keys.w)py-=6;if(keys.ArrowDown||keys.s)py+=6;py=Math.max(0,Math.min(320,py));ai+=Math.sign(ball.y-(ai+40))*3.2;ai=Math.max(0,Math.min(320,ai));ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y<5||ball.y>395)ball.vy*=-1;if(ball.x<30&&ball.x>18&&ball.y>py&&ball.y<py+80)ball.vx=Math.abs(ball.vx)*1.03;if(ball.x>450&&ball.x<462&&ball.y>ai&&ball.y<ai+80)ball.vx=-Math.abs(ball.vx)*1.03;if(ball.x<0){score[1]++;ball={x:240,y:200,vx:4.2,vy:2.6}}if(ball.x>480){score[0]++;ball={x:240,y:200,vx:-4.2,vy:-2.6}}ctx.fillStyle='#000';ctx.fillRect(0,0,480,400);ctx.fillStyle='#fff';ctx.fillRect(20,py,10,80);ctx.fillRect(450,ai,10,80);ctx.fillRect(ball.x-5,ball.y-5,10,10);ctx.font='28px monospace';ctx.fillText(`${score[0]}  ${score[1]}`,205,35);raf=requestAnimationFrame(loop)};loop();return()=>cancelAnimationFrame(raf)}
function v12Mines(container){const W=10,H=10,M=14,cells=Array(W*H).fill(0),bombs=new Set();while(bombs.size<M)bombs.add(Math.floor(Math.random()*cells.length));bombs.forEach(i=>cells[i]=-1);for(let i=0;i<cells.length;i++)if(cells[i]>=0){const x=i%W,y=Math.floor(i/W);let c=0;for(let yy=y-1;yy<=y+1;yy++)for(let xx=x-1;xx<=x+1;xx++){const j=yy*W+xx;if(xx>=0&&xx<W&&yy>=0&&yy<H&&bombs.has(j))c++}cells[i]=c}container.innerHTML=`<div class="v12-mines">${cells.map((_,i)=>`<button data-i="${i}"></button>`).join('')}</div><p>Clear the board without opening a mine.</p>`;container.querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(cells[i]===-1){b.textContent='×';container.querySelectorAll('button').forEach((x,j)=>{if(cells[j]===-1)x.textContent='×'});return}b.textContent=cells[i]||'·';b.disabled=true})}

function v12ArcadePage(){
  setTitle('Arcade');app.innerHTML=`<div class="v12-page"><header class="v12-page-head"><div><span>GAMES + DEMOS</span><h1>Arcade of Babel</h1></div><p>Small games run directly in the page. External open-source or official media launches stay embedded where framing is supported.</p></header><div class="v12-arcade-grid">
  <button data-game="snake"><span>BUILT IN</span><h3>Snake</h3><p>Keyboard arcade game.</p></button><button data-game="pong"><span>BUILT IN</span><h3>Pong</h3><p>Play against a simple AI.</p></button><button data-game="mines"><span>BUILT IN</span><h3>Mines</h3><p>10 x 10 minesweeper board.</p></button><button data-game="freedoom"><span>OPEN SOURCE</span><h3>Doom engine / Freedoom</h3><p>Browser Doom-compatible engine using free game data.</p></button><button data-game="badapple"><span>VIDEO</span><h3>Bad Apple!!</h3><p>Official Alstroemeria Records shadow-animation upload.</p></button><a href="/rules" data-route><span>INTERNET CULTURE</span><h3>Rules of the Internet</h3><p>History and context for the old meme list.</p></a></div>
  <section class="v12-game-stage" id="v12GameStage"><div><b>Select something to run.</b><span>Built-in games work without leaving Website Of Babel.</span></div></section></div>`;
  let cleanup=null;const stage=document.querySelector('#v12GameStage');document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>{cleanup?.();cleanup=null;const g=b.dataset.game;if(g==='snake'||g==='pong'){stage.innerHTML=`<div class="v12-game-head"><b>${g==='snake'?'Snake':'Pong'}</b><span>${g==='snake'?'Arrow keys':'W/S or arrow keys'}</span></div><canvas width="${g==='snake'?400:480}" height="400" class="v12-game-canvas"></canvas>`;cleanup=g==='snake'?v12Snake(stage.querySelector('canvas')):v12Pong(stage.querySelector('canvas'));return}if(g==='mines'){stage.innerHTML='<div class="v12-game-head"><b>Mines</b><span>Click cells to reveal them.</span></div><div id="v12MinesHost"></div>';v12Mines(document.querySelector('#v12MinesHost'));return}if(g==='freedoom'){stage.innerHTML=`<div class="v12-game-head"><b>Doom engine / Freedoom</b><span>Open-source Doom-compatible game data. If embedding is blocked, use the open button.</span></div><iframe class="v12-media-frame" src="https://themagicalkarp.github.io/wasmdoom/" allow="fullscreen; gamepad; autoplay" referrerpolicy="no-referrer"></iframe><a class="v12-open-fallback" href="https://themagicalkarp.github.io/wasmdoom/" target="_blank" rel="noopener">Open Freedoom player</a>`;return}if(g==='badapple'){stage.innerHTML=`<div class="v12-game-head"><b>Bad Apple!!</b><span>Official Alstroemeria Records upload.</span></div><iframe class="v12-media-frame v12-video-frame" src="https://www.youtube-nocookie.com/embed/i41KoE0iMYU" title="Bad Apple official video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`}});wireRoutes();
}

const V12_RULES=[
  ['Origins','The Rules of the Internet are a loose collection of early-web jokes, imageboard folklore, and community in-jokes. There is no single canonical list.'],
  ['Anonymous culture','Many versions emphasize anonymity, skepticism about identity, and the idea that online reputations are contextual.'],
  ['Do not feed the trolls','A recurring idea is that attention can reward disruptive behavior, so disengagement is sometimes more effective than arguing.'],
  ['Nothing disappears','Internet folklore warns that copies, screenshots, mirrors, and archives can outlive the original post.'],
  ['Search before asking','Older communities often expected newcomers to search archives and FAQs before repeating common questions.'],
  ['Context collapses','A post intended for one group can travel to a completely different audience, where tone and intent may be lost.'],
  ['Everything can become a meme','Online culture rapidly remixes language, images, video, games, and current events.'],
  ['Rule 34','One famous adult-content meme claims that almost any subject will eventually receive sexualized fan content. It is internet folklore, not a literal law.'],
  ['Rule 35','A companion joke says that if such content does not yet exist, someone will eventually create it.'],
  ['Rules vary','Different sites and eras added, removed, or renumbered rules, so lists often disagree.'],
  ['Modern reality','Platform moderation, law, privacy, copyright, harassment policies, and real-world consequences matter more than meme rules.']
];
function v12RulesPage(){setTitle('Rules of the Internet');app.innerHTML=`<div class="v12-page"><header class="v12-page-head"><div><span>INTERNET CULTURE</span><h1>Rules of the Internet</h1></div><p>A historical and cultural guide to the meme list, its variants, and the web behavior it tried to describe. These are jokes and folklore, not actual laws or platform policies.</p></header><div class="v12-rules">${V12_RULES.map((x,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p>${v12Pill(x[0],`Research ${x[0]}`)}</div></article>`).join('')}</div><section class="v12-strip"><b>Go deeper</b><span>Search meme history, anonymous imageboards, trolling, netiquette, archives, fandom, or specific numbered rules.</span><a href="${v9SearchRoute('Rules of the Internet')}" data-route>Build dossier</a></section></div>`;v12BindSearch()}

const v12OldSystems=systemsPage;
systemsPage=function(){v12OldSystems();const page=document.querySelector('.page');if(!page)return;const note=document.createElement('div');note.className='v12-system-note';note.innerHTML='<b>Everything is searchable.</b><span>Use Search Everything for a full dossier, Network for graph exploration, Browser for web access, and the domain systems for structured catalogs.</span>';page.prepend(note);wireRoutes()};

const v12OldRender=renderRoute;
renderRoute=async function(){v12InstallShell();window.scrollTo(0,0);const p=location.pathname;document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p));if(p==='/network')return v12NetworkPage();if(p==='/web')return v12WebPage();if(p==='/people')return v12PeoplePage();if(p==='/browser')return v12BrowserPage();if(p==='/arcade')return v12ArcadePage();if(p==='/rules')return v12RulesPage();return v12OldRender()};

setTimeout(()=>{v12InstallShell();try{renderRoute()}catch(e){console.error(e)}},0);
