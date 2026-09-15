/* Website Of Babel v8: restored editorial UI + hybrid Internet/knowledge Network. */
const V8_VERSION='8.0.0';

// Replace the old random /end resolver with a real public-web system.
try{
  const old=BABEL_SYSTEMS.findIndex(x=>x.route==='/end');
  const webSystem={n:'21',name:'Web of Babel',route:'/web',kind:'PUBLIC WEB DISCOVERY',desc:'Search real public websites, open them, and move from website to website through the Network of Babel.'};
  if(old>=0)BABEL_SYSTEMS.splice(old,1,webSystem);
  else if(!BABEL_SYSTEMS.some(x=>x.route==='/web'))BABEL_SYSTEMS.push(webSystem);
}catch{}

function v8HomeCard(n,name,route,desc){return `<a class="v8-core-card" href="${route}" data-route><span>${n}</span><h3>${esc(name)}</h3><p>${esc(desc)}</p><b>Open →</b></a>`}

universeHome=function(){
  setTitle('');
  const curated=state.stats?.curated||state.curated?.length||54;
  app.innerHTML=`<div class="page v8-home">
    <section class="universe-hero v8-hero">
      <div class="hero-overline"><span>WEBSITE OF BABEL · INDEX / ${String(curated).padStart(6,'0')}</span><span>KNOWLEDGE + WEB + NUMBER SPACES</span></div>
      <div class="universe-hero-grid">
        <div><h1>Website<br>of <em>Babel</em></h1><p class="hero-manifesto">Search the public web, traverse connected websites, inspect knowledge, search π, explore deterministic libraries, learn skills, build a mind palace, and keep your own notes without publishing them.</p></div>
        <div class="v8-hero-index"><span>PUBLIC INDEX</span><b>READ ONLY</b><span>PRIVATE NOTES</span><b>YOUR DEVICE</b><span>WEB GRAPH</span><b>LIVE</b></div>
      </div>
      <form class="universe-search" id="v8HomeSearch"><input id="v8HomeQ" autocomplete="off" maxlength="220" placeholder="Search anything"><button>Search</button></form>
      <div class="universe-search-foot"><span>Unknown searches open temporary research. They do not publish permanent pages.</span><div>${['hitboyxx23','the end of the internet','method of loci','lucid dreaming','time travel','pi'].map(q=>`<button data-v8q="${esc(q)}">${esc(q)}</button>`).join('')}</div></div>
    </section>
    <section class="v8-core-grid">
      ${v8HomeCard('01','Network of Babel','/network','A movable graph combining Babel knowledge with real public websites and outgoing links.')}
      ${v8HomeCard('02','Research','/research','Live reference, archive, scholarly, image, and video discovery without creating public user pages.')}
      ${v8HomeCard('03','Pi of Babel','/pi','One million verified decimal digits, phrase coordinates, literal number search, and auditable mappings.')}
      ${v8HomeCard('04','Library of Babel','/library','Deterministic pages and reversible phrase coordinates with no preset final page address.')}
    </section>
    <section class="statement-band"><span>THE INTERNET LAYER</span><p><strong>Network search now searches beyond Babel.</strong> Handles, domains, obscure sites, and phrases can become real website nodes. Select a website, map its outgoing links, then keep walking.</p></section>
    <section class="universe-section"><div class="section-heading"><div><div class="kicker">WEB OF BABEL</div><h2>Search for a website, not a random exit.</h2></div><a href="/web" data-route>Open Web of Babel →</a></div><form class="v8-web-inline" id="v8WebSearch"><input id="v8WebQ" placeholder="Try: the end of the internet"><button>Find websites</button></form></section>
    <section class="universe-section"><div class="section-heading"><div><div class="kicker">SYSTEM DIRECTORY</div><h2>Every instrument stays connected.</h2></div><a href="/systems" data-route>All systems →</a></div><div class="system-index-grid">${BABEL_SYSTEMS.slice(0,9).map(s=>`<article class="system-index-card" data-go="${esc(s.route)}"><div class="system-index-top"><span>${esc(s.n)}</span><span>${esc(s.kind||'SYSTEM')}</span></div><h3>${esc(s.name)}</h3><p>${esc(s.desc||'Babel system.')}</p><div class="system-open">OPEN →</div></article>`).join('')}</div></section>
  </div>`;
  document.querySelector('#v8HomeSearch').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v8HomeQ').value.trim();if(!q)return;if(/^https?:\/\//i.test(q)||/\.[a-z]{2,}(?:\/|$)/i.test(q))route(`/network?q=${encodeURIComponent(q)}`);else openTopic(q)};
  document.querySelectorAll('[data-v8q]').forEach(b=>b.onclick=()=>{const q=b.dataset.v8q;if(q==='hitboyxx23'||q==='the end of the internet')route(`/network?q=${encodeURIComponent(q)}`);else if(q==='pi')route('/pi');else openTopic(q)});
  document.querySelector('#v8WebSearch').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v8WebQ').value.trim();if(q)route(`/web?q=${encodeURIComponent(q)}`)};
  document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>route(x.dataset.go));wireRoutes();
};

function v8Host(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return''}}
function v8Clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function v8WebResultCard(r,i){return `<article class="v8-web-result"><div class="v8-web-rank">${String(i+1).padStart(2,'0')}</div><div><span>${esc(r.host||v8Host(r.url))} · ${esc(r.source||'web')}</span><h3>${esc(r.title||r.host||'Website')}</h3><p>${esc(r.snippet||'Public website result.')}</p><div class="v8-result-actions"><a href="/reader?url=${encodeURIComponent(r.url)}" data-route>Read in Babel →</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map in Network →</a></div></div></article>`}

webPage=async function(){
  setTitle('Web of Babel');const p=new URLSearchParams(location.search),initial=p.get('q')||'';
  app.innerHTML=`<div class="page v8-web-page"><header class="page-head"><div class="page-head-grid"><div><div class="kicker">PUBLIC WEB DISCOVERY</div><h1>Web<br>of Babel</h1></div><p>Search a phrase and get real public websites. No hash-to-random-site resolver. From any result you can open the website or place it inside Network of Babel and continue outward link by link.</p></div></header>
    <form class="v8-web-search" id="v8WebForm"><input id="v8WebInput" value="${esc(initial)}" placeholder="Search websites, handles, domains, phrases..."><button>Search the web</button></form>
    <div id="v8WebOut">${initial?'<div class="v7-loading-card">Searching public websites...</div>':'<div class="v8-web-empty"><b>Search the public web.</b><span>Try “hitboyxx23” or “the end of the internet”.</span></div>'}</div>
    ${v7NotePanel(`web:${initial.toLowerCase()||'home'}`,'Private web notes')}
  </div>`;
  const run=async q=>{if(!q)return;history.replaceState({},'',`/web?q=${encodeURIComponent(q)}`);const out=document.querySelector('#v8WebOut');out.innerHTML='<div class="v7-loading-card">Finding public websites...</div>';try{const d=await json(`/api/websearch?q=${encodeURIComponent(q)}`);const rows=d.results||[];out.innerHTML=rows.length?`<section class="v8-web-best"><span>CLOSEST DOOR</span><h2>${esc(rows[0].title)}</h2><p>${esc(rows[0].snippet||rows[0].host)}</p><a href="/reader?url=${encodeURIComponent(rows[0].url)}" data-route>Read inside Babel →</a><a href="/network?q=${encodeURIComponent(q)}" data-route>See this search as a graph →</a></section><div class="v8-web-list">${rows.map(v8WebResultCard).join('')}</div>`:`<div class="v8-web-empty"><b>No public websites returned.</b><span>Try a broader phrase or a complete URL.</span></div>`;wireRoutes()}catch(err){out.innerHTML=`<div class="v7-error-card">${esc(err.message)}</div>`}};
  document.querySelector('#v8WebForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v8WebInput').value.trim();if(q)run(q)};v7BindNote(`web:${initial.toLowerCase()||'home'}`);if(initial)run(initial);
};

function v8BuildKnowledgeGraph(topics){
  const nodes=[{id:'babel:root',kind:'root',label:'BABEL',x:0,y:0,r:18,desc:'Website Of Babel knowledge root.'}],edges=[];
  const cats=[...new Set(topics.map(t=>t.category||'General'))];
  cats.forEach((c,i)=>{const a=(i/cats.length)*Math.PI*2;const n={id:`cat:${c}`,kind:'category',label:c,x:Math.cos(a)*290,y:Math.sin(a)*290,r:12,desc:`${c} category hub`};nodes.push(n);edges.push(['babel:root',n.id]);});
  topics.forEach((t,i)=>{const group=topics.filter(x=>(x.category||'General')===(t.category||'General'));const j=group.findIndex(x=>x.slug===t.slug);const cat=nodes.find(n=>n.id===`cat:${t.category||'General'}`);const a=Math.atan2(cat.y,cat.x)+((j/(Math.max(1,group.length)-1||1))-.5)*1.28;const r=105+(j%3)*30;const n={id:`topic:${t.slug}`,kind:'topic',label:t.title,x:cat.x+Math.cos(a)*r,y:cat.y+Math.sin(a)*r,r:7,topic:t,desc:t.dek||'Curated Babel topic.'};nodes.push(n);edges.push([cat.id,n.id]);});
  const bySlug=new Map(nodes.filter(n=>n.kind==='topic').map(n=>[n.topic.slug,n]));
  nodes.filter(n=>n.kind==='topic').forEach(n=>(n.topic.related||[]).slice(0,2).forEach(r=>{const m=bySlug.get(slug(r));if(m)edges.push([n.id,m.id])}));
  return {nodes,edges};
}

network=async function(){
  setTitle('Network of Babel');await loadExplore();const topics=v7Curated();const params=new URLSearchParams(location.search),initial=params.get('q')||'',focus=params.get('focus')||'';
  app.innerHTML=`<div class="page v8-network-page"><header class="page-head"><div class="page-head-grid"><div><div class="kicker">KNOWLEDGE + PUBLIC WEB</div><h1>Network<br>of Babel</h1></div><p>Move through the graph instead of reading a flat result list. Drag empty space to pan, drag nodes to reposition them, use the wheel to zoom, and expand website nodes into the links they point to.</p></div></header>
    <form class="v8-network-search" id="v8NetworkSearch"><input id="v8NetworkQ" value="${esc(initial)}" placeholder="Search a topic, website, domain, or handle"><button>Search network + web</button></form>
    <div class="v8-network-toolbar"><div><button id="v8Reset">Reset knowledge map</button><button id="v8Fit">Fit graph</button><button id="v8ZoomIn">+</button><button id="v8ZoomOut">−</button></div><span id="v8GraphStatus">${topics.length} curated topics · live web search ready</span></div>
    <div class="v8-network-shell"><div class="v8-canvas-wrap"><canvas id="v8Graph" tabindex="0" aria-label="Interactive Network of Babel graph"></canvas><div class="v8-canvas-help">DRAG BACKGROUND: PAN · WHEEL: ZOOM · DRAG NODE: MOVE · DOUBLE CLICK WEBSITE: OPEN</div></div><aside id="v8Inspector"><div class="kicker">NETWORK INSPECTOR</div><h2>Select a node</h2><p>Search the web above or click a Babel node. Website nodes can be expanded into their outgoing links.</p></aside></div>
  </div>`;
  const canvas=document.querySelector('#v8Graph'),ctx=canvas.getContext('2d'),wrap=canvas.parentElement,inspector=document.querySelector('#v8Inspector'),status=document.querySelector('#v8GraphStatus');
  let {nodes,edges}=v8BuildKnowledgeGraph(topics);let pan={x:0,y:0},zoom=1,selected=null,drag=null,dpr=Math.max(1,Math.min(2,devicePixelRatio||1)),w=0,h=0;
  const nodeMap=()=>new Map(nodes.map(n=>[n.id,n]));
  function colors(){const s=getComputedStyle(document.documentElement);return {ink:s.getPropertyValue('--ink').trim()||'#000',paper:s.getPropertyValue('--paper').trim()||'#fff',muted:s.getPropertyValue('--muted').trim()||'#777',line:s.getPropertyValue('--line').trim()||'#ddd',paper2:s.getPropertyValue('--paper-2').trim()||'#f5f5f5'}}
  function resize(){const r=wrap.getBoundingClientRect();w=Math.max(320,r.width);h=Math.max(430,r.height);canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';draw()}
  function worldFromEvent(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left-w/2-pan.x)/zoom,y:(e.clientY-r.top-h/2-pan.y)/zoom}}
  function hitAt(p){for(let i=nodes.length-1;i>=0;i--){const n=nodes[i];const rr=(n.r||7)+9/zoom;if(Math.hypot(n.x-p.x,n.y-p.y)<=rr)return n}return null}
  function draw(){const c=colors();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2+pan.x,h/2+pan.y);ctx.scale(zoom,zoom);const map=nodeMap();ctx.lineWidth=1/zoom;for(const [a,b] of edges){const x=map.get(a),y=map.get(b);if(!x||!y)continue;ctx.beginPath();ctx.moveTo(x.x,x.y);ctx.lineTo(y.x,y.y);ctx.strokeStyle=c.line;ctx.globalAlpha=(x.kind==='web'||y.kind==='web'||x.kind==='query')?.7:.45;ctx.stroke()}ctx.globalAlpha=1;for(const n of nodes){const sel=selected===n;ctx.beginPath();ctx.arc(n.x,n.y,sel?(n.r+4):n.r,0,Math.PI*2);ctx.fillStyle=sel?c.paper:c.ink;if(sel){ctx.fill();ctx.strokeStyle=c.ink;ctx.lineWidth=2/zoom;ctx.stroke()}else ctx.fill();if(zoom>.44&&(sel||n.kind==='root'||n.kind==='query'||n.kind==='web'||n.kind==='category')){ctx.font=`${sel?12:10}px ui-monospace, monospace`;ctx.fillStyle=c.ink;ctx.textBaseline='middle';ctx.fillText(n.label,n.x+(n.r+8)/zoom,n.y)}}ctx.restore()}
  function fit(){if(!nodes.length)return;let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;nodes.forEach(n=>{minX=Math.min(minX,n.x);maxX=Math.max(maxX,n.x);minY=Math.min(minY,n.y);maxY=Math.max(maxY,n.y)});const bw=Math.max(200,maxX-minX+180),bh=Math.max(200,maxY-minY+180);zoom=v8Clamp(Math.min(w/bw,h/bh),.25,1.7);pan.x=-(minX+maxX)/2*zoom;pan.y=-(minY+maxY)/2*zoom;draw()}
  function inspect(n){selected=n;draw();if(!n){inspector.innerHTML='<div class="kicker">NETWORK INSPECTOR</div><h2>Select a node</h2>';return}if(n.kind==='web'){inspector.innerHTML=`<div class="kicker">PUBLIC WEBSITE</div><h2>${esc(n.label)}</h2><code>${esc(n.host||v8Host(n.url))}</code><p>${esc(n.desc||'Public website result.')}</p><div class="v8-inspector-actions"><a href="/reader?url=${encodeURIComponent(n.url)}" data-route>Read in Babel →</a><button id="v8ExpandWeb">Map outgoing links</button></div><small>Expanding reads the public HTML page and adds up to 36 links as movable nodes. Private/local network addresses remain blocked.</small>`;document.querySelector('#v8ExpandWeb').onclick=()=>expandWeb(n);return}if(n.kind==='topic'){inspector.innerHTML=`<div class="kicker">${esc(n.topic.category||'CURATED')}</div><h2>${esc(n.label)}</h2><p>${esc(n.desc)}</p><div class="v8-inspector-actions"><button id="v8OpenTopic">Open entry</button><a href="/research?q=${encodeURIComponent(n.label)}" data-route>Research live →</a></div>`;document.querySelector('#v8OpenTopic').onclick=()=>route(`/topic/${n.topic.slug}`);wireRoutes();return}if(n.kind==='query'){inspector.innerHTML=`<div class="kicker">WEB SEARCH ROOT</div><h2>${esc(n.label)}</h2><p>${esc(n.desc||'Live public website results radiate from this node.')}</p><a href="/web?q=${encodeURIComponent(n.label)}" data-route>Open result list →</a>`;wireRoutes();return}inspector.innerHTML=`<div class="kicker">${esc(n.kind.toUpperCase())}</div><h2>${esc(n.label)}</h2><p>${esc(n.desc||'Network node.')}</p>`}
  async function expandWeb(n){status.textContent=`Mapping links from ${n.host||v8Host(n.url)}...`;try{const d=await json(`/api/webgraph?url=${encodeURIComponent(n.url)}`);n.label=d.root?.title||n.label;n.desc=d.root?.description||n.desc;const old=new Set(nodes.map(x=>x.url).filter(Boolean));const links=(d.links||[]).filter(x=>!old.has(x.url)).slice(0,60);const baseAngle=(Math.atan2(n.y,n.x)||0);links.forEach((r,i)=>{const a=baseAngle+(i/Math.max(1,links.length))*Math.PI*2;const dist=125+(i%4)*24;const child={id:`web:${r.url}`,kind:'web',label:r.host,x:n.x+Math.cos(a)*dist,y:n.y+Math.sin(a)*dist,r:6,url:r.url,host:r.host,desc:r.sameSite?'Internal link from mapped page.':'External link from mapped page.'};nodes.push(child);edges.push([n.id,child.id])});status.textContent=`${d.counts?.links||0} links found · ${d.counts?.hosts||0} hosts · ${nodes.length} graph nodes`;inspect(n);draw()}catch(err){status.textContent=err.message;toast('Could not map that page')}}
  async function search(q){if(!q)return;history.replaceState({},'',`/network?q=${encodeURIComponent(q)}`);status.textContent=`Searching Babel and the public web for “${q}”...`;const local=topics.filter(t=>`${t.title} ${t.dek||''} ${(t.tags||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0,10);let data={results:[]};try{data=await json(`/api/websearch?q=${encodeURIComponent(q)}`)}catch(err){status.textContent=`Web search unavailable: ${err.message}`}
    nodes=[];edges=[];const root={id:`query:${q}`,kind:'query',label:q,x:0,y:0,r:16,desc:`Search root with ${local.length} Babel match(es) and ${(data.results||[]).length} website result(s).`};nodes.push(root);
    local.forEach((t,i)=>{const a=Math.PI+(i/Math.max(1,local.length))*Math.PI;const n={id:`topic:${t.slug}`,kind:'topic',label:t.title,x:Math.cos(a)*240,y:Math.sin(a)*240,r:8,topic:t,desc:t.dek||''};nodes.push(n);edges.push([root.id,n.id])});
    (data.results||[]).slice(0,30).forEach((r,i)=>{const ring=310+Math.floor(i/10)*155;const a=((i%10)/10)*Math.PI*2+Math.floor(i/10)*.12;const n={id:`web:${r.url}`,kind:'web',label:r.title||r.host,x:Math.cos(a)*ring,y:Math.sin(a)*ring,r:i===0?11:7,url:r.url,host:r.host||v8Host(r.url),desc:r.snippet||'',source:r.source};nodes.push(n);edges.push([root.id,n.id])});
    selected=root;status.textContent=`${local.length} Babel matches · ${(data.results||[]).length} website results · drag, zoom, and expand`;fit();inspect(root);
  }
  canvas.onpointerdown=e=>{const p=worldFromEvent(e),hit=hitAt(p);drag={mode:hit?'node':'pan',node:hit,sx:e.clientX,sy:e.clientY,px:pan.x,py:pan.y,nx:hit?.x,ny:hit?.y,moved:false};canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.hypot(dx,dy)>3)drag.moved=true;if(drag.mode==='pan'){pan.x=drag.px+dx;pan.y=drag.py+dy}else if(drag.node){drag.node.x=drag.nx+dx/zoom;drag.node.y=drag.ny+dy/zoom}draw()};
  canvas.onpointerup=e=>{if(drag?.node&&!drag.moved)inspect(drag.node);drag=null;try{canvas.releasePointerCapture(e.pointerId)}catch{}};
  canvas.ondblclick=e=>{const n=hitAt(worldFromEvent(e));if(!n)return;if(n.kind==='web')route(`/reader?url=${encodeURIComponent(n.url)}`);else if(n.kind==='topic')route(`/topic/${n.topic.slug}`)};
  canvas.onwheel=e=>{e.preventDefault();const before=worldFromEvent(e);const factor=e.deltaY<0?1.12:.89;zoom=v8Clamp(zoom*factor,.18,4);const r=canvas.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top;pan.x=sx-w/2-before.x*zoom;pan.y=sy-h/2-before.y*zoom;draw()};
  document.querySelector('#v8NetworkSearch').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v8NetworkQ').value.trim();if(q)search(q)};
  document.querySelector('#v8Reset').onclick=()=>{({nodes,edges}=v8BuildKnowledgeGraph(topics));selected=null;fit();inspect(null);status.textContent=`${topics.length} curated topics · live web search ready`};document.querySelector('#v8Fit').onclick=fit;document.querySelector('#v8ZoomIn').onclick=()=>{zoom=v8Clamp(zoom*1.2,.18,4);draw()};document.querySelector('#v8ZoomOut').onclick=()=>{zoom=v8Clamp(zoom/1.2,.18,4);draw()};
  window.addEventListener('resize',resize,{once:true});resize();fit();if(focus){const n=nodes.find(x=>x.kind==='topic'&&x.topic.slug===focus);if(n){inspect(n);pan.x=-n.x*zoom;pan.y=-n.y*zoom;draw()}}if(initial)search(initial);
};

// Keep curated topic pages but remove the old /end link.
const v8BaseTopicPage=topicPage;
topicPage=async function(s){await v8BaseTopicPage(s);document.querySelectorAll('a[href^="/end"]').forEach(a=>{const topic=state.current?.title||titleFromSlug(s);a.setAttribute('href',`/web?q=${encodeURIComponent(topic)}`);a.textContent='Find related websites'});wireRoutes()};

renderRoute=async function(){
  window.scrollTo(0,0);document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===location.pathname));const p=location.pathname;
  if(p==='/')return universeHome();if(p==='/systems')return systemsPage();if(p==='/research')return researchPage();if(p==='/explore')return explore();if(p==='/network')return network();if(p==='/web')return webPage();if(p==='/web-network')return webNetworkPage();if(p==='/library')return library();if(p==='/lexicon')return lexiconPage();if(p==='/pi')return piPage();if(p==='/numbers')return numbersPage();if(p==='/universe-numbers')return universeNumbersPage();if(p==='/palace')return palacePage();if(p==='/learn')return learnPage();if(p==='/dreams')return dreamsPage();if(p==='/paranormal')return paranormalPage();if(p==='/futures')return futuresPage();if(p==='/people')return peoplePage();if(p==='/beliefs')return beliefsPage();if(p==='/myths')return mythsPage();if(p==='/probability')return probabilityPage();if(p==='/possibilities')return possibilitiesPage();if(p==='/timeline')return timelinePage();if(p==='/media')return mediaPage();if(p==='/sources')return sourcesPage();if(p==='/end')return route('/terminus',{replace:true});if(p==='/infinite')return route('/systems',{replace:true});if(p==='/workbench')return workbench();if(p==='/about')return about();if(p.startsWith('/topic/'))return topicPage(decodeURIComponent(p.split('/')[2]||''));return notFound();
};
setTimeout(()=>{try{renderRoute()}catch{}},0);
