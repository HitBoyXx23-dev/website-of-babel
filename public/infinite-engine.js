/* Website Of Babel Infinity Protocol.
   This layer adds unbounded deterministic address spaces without pretending
   that infinite data is physically stored. Every visible value is either
   computed from its address or explicitly sourced by the finite core. */

const INFINITY_VERSION='5.0.0';
const infinityKeys={palace:'babel.infinity.palace.v1',image:'babel.infinity.images.v1'};

function bigOr(value,fallback=0n){try{const s=String(value??'').trim();return /^[-+]?\d+$/.test(s)?BigInt(s):fallback}catch{return fallback}}
function posBig(value,fallback=1n){const n=bigOr(value,fallback);return n<1n?1n:n}
function bmod(n,m){return Number(((n%BigInt(m))+BigInt(m))%BigInt(m))}
function base64urlUtf8(text){const bytes=new TextEncoder().encode(String(text));let bin='';for(const b of bytes)bin+=String.fromCharCode(b);return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')||'AA'}
function fromBase64urlUtf8(value){try{let s=String(value).replace(/-/g,'+').replace(/_/g,'/');s+='='.repeat((4-s.length%4)%4);const bin=atob(s);return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))}catch{return''}}
function infinityCoordinate(kind,index){return `babel://${kind}/${String(index)}`}
function infinityNotice(label,detail){return `<div class="infinity-notice"><span class="infinity-symbol">∞</span><div><strong>${esc(label)}</strong><p>${esc(detail)}</p></div></div>`}

// Mark the platform as an unbounded-address architecture.
try{
  const inf=BABEL_SYSTEMS.find(x=>x.route==='/infinite');
  if(inf){inf.name='Infinity Protocol';inf.kind='UNBOUNDED ADDRESS SPACES';inf.desc='One protocol connecting every Babel system that can grow without a predefined last address.'}
}catch{}

// Home: show the protocol before individual systems.
const infinityBaseHome=universeHome;
universeHome=function(){
  infinityBaseHome();
  const hero=app.querySelector('.universe-hero');
  if(hero)hero.insertAdjacentHTML('afterend',`<section class="infinity-manifest"><div class="infinity-manifest-mark">∞</div><div><div class="kicker">INFINITY PROTOCOL ACTIVE · v${INFINITY_VERSION}</div><h2>No preset last room, page, branch, integer, rational, locus, or discovery coordinate.</h2><p>Babel stores rules and addresses instead of pretending to pre-store infinity. Finite source collections remain honestly finite, while deterministic spaces can continue for any finite coordinate you ask for.</p></div><a href="/infinite" data-route>Enter ∞</a></section>`);
  wireRoutes();
};

// Library: every finite UTF-8 phrase has its own reversible address, and page numbers use BigInt.
function infiniteLibraryAddress(seed){return `BINF-${base64urlUtf8(seed)}`}
function infiniteLibraryPageHref(address,page,find=''){return `/library?${find?`find=${encodeURIComponent(find)}&`:''}address=${encodeURIComponent(address)}&page=${encodeURIComponent(String(page))}`}
library=function(){
  setTitle('Infinite Library of Babel');
  const params=new URLSearchParams(location.search);
  const find=params.get('find')||'';
  const address=params.get('address')||infiniteLibraryAddress(find||'entrance');
  const page=posBig(params.get('page')||'1',1n);
  const text=makeLibraryText(address,String(page),find);
  const rendered=esc(text);
  const highlighted=find?rendered.replace(new RegExp(escRegex(esc(find.toLowerCase())),'i'),m=>`<mark>${m}</mark>`):rendered;
  const shelves=[];for(let d=-8n;d<=8n;d++){const p=page+d;if(p>0n)shelves.push(p)}
  const phraseAddress=find?infiniteLibraryAddress(find):'';
  app.innerHTML=`<div class="page infinite-library"><header class="page-head"><div class="page-head-grid"><div><div class="kicker">CORE SYSTEM 02 · UNBOUNDED</div><h1>Library<br>of Babel ∞</h1></div><p>A deterministic library with no preset final page. Every finite phrase can be mapped to a reversible UTF-8 coordinate, and every positive integer is a valid page address.</p></div></header>
  ${infinityNotice('The address space has no last page.','Pages are generated from address + BigInt page coordinate. They are not all stored on Vercel.')}
  <div class="library-workspace"><aside class="library-controls"><div class="kicker">LOCATE ANY FINITE STRING</div><h3>Find a phrase</h3><form id="phraseForm"><textarea class="library-input library-textarea" id="phraseInput" placeholder="Any finite Unicode text">${esc(find)}</textarea><button class="solid-button">Map into library</button></form>${find?`<div class="coordinate-box mono-wrap">${esc(phraseAddress)}</div>`:''}<div class="kicker">OPEN COORDINATE</div><h3>Address</h3><form id="addressForm"><textarea class="library-input library-textarea" id="addressInput">${esc(address)}</textarea><input class="library-input" id="libraryPageInput" inputmode="numeric" value="${esc(String(page))}" placeholder="Any positive integer page"><button class="ghost-button">Open exact coordinate</button></form><div class="coordinate-box mono-wrap">${esc(address)} / page ${esc(String(page))}</div><button class="ghost-button" id="copyLibrary">Copy coordinate</button><button class="ghost-button" id="randomLibrary">Random seed room</button><div class="kicker" style="margin-top:28px">LOCAL WINDOW</div><div class="library-map infinity-shelf">${shelves.map(p=>`<button class="book-spine ${p===page?'active':''}" data-book-page="${p}">${p.toString().slice(-6)}</button>`).join('')}</div></aside><main><div class="library-page"><div class="library-address">${esc(address)} · page ${esc(String(page))} · no final page</div><div class="library-text">${highlighted}</div></div><div class="library-pagination"><button class="ghost-button" id="prevPage">← ${page>1n?'Previous':'First page'}</button><button class="ghost-button" id="nextPage">Next page →</button></div></main></div></div>`;
  document.querySelector('#phraseForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#phraseInput').value;if(!q)return;route(infiniteLibraryPageHref(infiniteLibraryAddress(q),1n,q))};
  document.querySelector('#addressForm').onsubmit=e=>{e.preventDefault();const a=document.querySelector('#addressInput').value.trim();if(!a)return;const p=posBig(document.querySelector('#libraryPageInput').value,1n);route(infiniteLibraryPageHref(a,p))};
  document.querySelector('#copyLibrary').onclick=()=>copyText(`${infinityCoordinate('library',base64urlUtf8(address))}/page/${page}`);
  document.querySelector('#randomLibrary').onclick=()=>{const a=new Uint32Array(4);crypto.getRandomValues(a);route(infiniteLibraryPageHref(`BINF-R-${[...a].map(x=>x.toString(16).padStart(8,'0')).join('')}`,1n))};
  document.querySelector('#prevPage').onclick=()=>route(infiniteLibraryPageHref(address,page>1n?page-1n:1n,find));
  document.querySelector('#nextPage').onclick=()=>route(infiniteLibraryPageHref(address,page+1n,find));
  document.querySelectorAll('[data-book-page]').forEach(b=>b.onclick=()=>route(infiniteLibraryPageHref(address,bigOr(b.dataset.bookPage,1n),find)));
};

// Network: keep the sourced/stored graph, then expose an unbounded procedural frontier.
const infinityBaseNetwork=network;
network=async function(){
  await infinityBaseNetwork();
  const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="frontier-section"><div class="section-row"><div><div class="kicker">PROCEDURAL FRONTIER</div><h2>Expand beyond the stored graph.</h2></div><p>Every positive integer is a frontier node. Children are <code>2n</code> and <code>2n+1</code>, so expansion has no terminal depth.</p></div><div class="frontier-control"><input id="frontierJump" inputmode="numeric" value="1" placeholder="Node coordinate"><button id="frontierGo">Open coordinate</button></div><div id="frontierTree" class="frontier-tree"></div></section>`);
  const drawFrontier=(root)=>{root=posBig(root,1n);const topics=allTopics();const rows=[];let level=[root];for(let depth=0;depth<4;depth++){rows.push(level);level=level.flatMap(n=>[n*2n,n*2n+1n])}document.querySelector('#frontierTree').innerHTML=rows.map((row,d)=>`<div class="frontier-row" data-depth="${d}">${row.map(n=>{const t=topics[bmod(n,Math.max(1,topics.length))]||{title:'Unknown',slug:'unknown',category:'Index'};return `<button class="frontier-node" data-frontier="${n}" title="${esc(infinityCoordinate('network',n))}"><span>∞:${n}</span><strong>${esc(t.title)}</strong><small>${esc(t.category||'Index')}</small></button>`}).join('')}</div>`).join('');document.querySelectorAll('[data-frontier]').forEach(b=>b.onclick=()=>{document.querySelector('#frontierJump').value=b.dataset.frontier;drawFrontier(bigOr(b.dataset.frontier,1n))})};
  document.querySelector('#frontierGo').onclick=()=>drawFrontier(document.querySelector('#frontierJump').value);drawFrontier(1n);
};

// Numbers: add truly unbounded BigInt enumerations for integers and positive rationals.
function integerAtIndex(i){i=bigOr(i,0n);if(i<0n)i=-i;return i===0n?0n:(i%2n?((i+1n)/2n):-(i/2n))}
function calkinWilf(n){n=posBig(n,1n);const bits=n.toString(2).slice(1);let a=1n,b=1n;for(const bit of bits){if(bit==='0')b=a+b;else a=a+b}return[a,b]}
const infinityBaseNumbers=numbersPage;
numbersPage=async function(){
  await infinityBaseNumbers();
  const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="infinite-number-space"><div class="section-row"><div><div class="kicker">INFINITE ENUMERATIONS</div><h2>Numbers with no final entry.</h2></div><p>Coordinates use BigInt. The integer stream enumerates all integers. The Calkin-Wilf stream enumerates every positive reduced rational exactly once.</p></div><div class="infinite-number-grid"><article><span>ℤ</span><h3>All integers</h3><label>Index<input id="integerIndex" inputmode="numeric" value="0"></label><div class="infinite-number-result" id="integerIndexOut"></div><div class="button-row"><button id="integerPrev">←</button><button id="integerNext">→</button></div></article><article><span>ℚ⁺</span><h3>All positive rationals</h3><label>Index<input id="rationalIndex" inputmode="numeric" value="1"></label><div class="infinite-number-result" id="rationalIndexOut"></div><div class="button-row"><button id="rationalPrev">←</button><button id="rationalNext">→</button></div></article></div></section>`);
  const drawI=()=>{const i=bigOr(document.querySelector('#integerIndex').value,0n);const n=integerAtIndex(i);document.querySelector('#integerIndexOut').innerHTML=`<small>${esc(infinityCoordinate('integer',i<0n?-i:i))}</small><strong>${n}</strong>`};
  const drawR=()=>{const i=posBig(document.querySelector('#rationalIndex').value,1n);const[a,b]=calkinWilf(i);document.querySelector('#rationalIndexOut').innerHTML=`<small>${esc(infinityCoordinate('rational',i))}</small><strong>${a}/${b}</strong><em>≈ ${Number(a)/Number(b)}</em>`};
  document.querySelector('#integerIndex').oninput=drawI;document.querySelector('#rationalIndex').oninput=drawR;
  document.querySelector('#integerPrev').onclick=()=>{const e=document.querySelector('#integerIndex');e.value=(bigOr(e.value,0n)-1n<0n?0n:bigOr(e.value,0n)-1n);drawI()};document.querySelector('#integerNext').onclick=()=>{const e=document.querySelector('#integerIndex');e.value=bigOr(e.value,0n)+1n;drawI()};
  document.querySelector('#rationalPrev').onclick=()=>{const e=document.querySelector('#rationalIndex');e.value=posBig(e.value,1n)>1n?posBig(e.value,1n)-1n:1n;drawR()};document.querySelector('#rationalNext').onclick=()=>{const e=document.querySelector('#rationalIndex');e.value=posBig(e.value,1n)+1n;drawR()};drawI();drawR();
};

// Pi: the verified decimal cache stays finite and auditable. BBP adds an open-ended hexadecimal address rule.
function bbpWorkerSource(){return `
self.onmessage=e=>{const n=Number(e.data.n);let cancelled=false;function powmod16(p,m){let P=BigInt(p),M=BigInt(m),r=1n,b=16n%M;while(P>0n){if(P&1n)r=(r*b)%M;b=(b*b)%M;P>>=1n}return Number(r)}function S(j){let s=0;for(let k=0;k<=n;k++){if((k&16383)===0)self.postMessage({progress:k,total:n+1});const r=8*k+j;s=(s+powmod16(n-k,r)/r)%1}for(let k=n+1;k<n+160;k++){const term=Math.pow(16,n-k)/(8*k+j);s+=term;if(term<1e-18)break}return s}try{let x=4*S(1)-2*S(4)-S(5)-S(6);x=x-Math.floor(x);const d=Math.floor(16*x).toString(16).toUpperCase();self.postMessage({done:true,digit:d})}catch(err){self.postMessage({error:String(err&&err.message||err)})}}`}
const infinityBasePi=piPage;
piPage=async function(){
  await infinityBasePi();
  const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="pi-infinity-lab"><div class="section-row"><div><div class="kicker">π INFINITE ADDRESS LAYER</div><h2>Random access to hexadecimal π digits.</h2></div><p>The bundled decimal corpus is finite and verified. The Bailey-Borwein-Plouffe formula gives a separate mathematical rule for computing hexadecimal digits at arbitrary finite positions without storing all preceding hexadecimal digits.</p></div>${infinityNotice('The coordinate space itself has no final digit.','Computation time still grows with the requested position, and this browser implementation uses exact integer loop indices only while the position fits safely in JavaScript Number.')}
  <div class="pi-bbp"><label>Hex digit position after the radix point<input id="bbpIndex" inputmode="numeric" value="0" placeholder="0, 1, 2, 3..."></label><button id="bbpRun">Compute digit</button><button id="bbpCancel" class="ghost-button">Cancel</button><div id="bbpOut" class="bbp-out"><span>Coordinate</span><strong>pi://hex/0</strong></div></div></section>`);
  let worker=null;const stop=()=>{if(worker){worker.terminate();worker=null;document.querySelector('#bbpOut').innerHTML='<span>Computation</span><strong>Cancelled</strong>'}};document.querySelector('#bbpCancel').onclick=stop;
  document.querySelector('#bbpRun').onclick=()=>{stop();const raw=document.querySelector('#bbpIndex').value.trim();const big=bigOr(raw,-1n);const out=document.querySelector('#bbpOut');if(big<0n){out.innerHTML='<span>Error</span><strong>Use a nonnegative integer.</strong>';return}if(big>BigInt(Number.MAX_SAFE_INTEGER)){out.innerHTML=`<span>${esc(infinityCoordinate('pi/hex',big))}</span><strong>Address is valid, but this browser BBP implementation cannot safely iterate an index larger than 2^53-1.</strong>`;return}const n=Number(big);out.innerHTML=`<span>${esc(infinityCoordinate('pi/hex',big))}</span><strong>Computing...</strong><small id="bbpProgress">Starting worker</small>`;const blob=new Blob([bbpWorkerSource()],{type:'text/javascript'});worker=new Worker(URL.createObjectURL(blob));worker.onmessage=e=>{if(e.data.progress!=null){const p=document.querySelector('#bbpProgress');if(p)p.textContent=`${e.data.progress.toLocaleString()} / ${e.data.total.toLocaleString()} terms`}if(e.data.done){out.innerHTML=`<span>${esc(infinityCoordinate('pi/hex',big))}</span><strong class="bbp-digit">${esc(e.data.digit)}</strong><small>BBP hexadecimal digit at zero-based position ${big}.</small>`;worker.terminate();worker=null}if(e.data.error){out.innerHTML=`<span>Error</span><strong>${esc(e.data.error)}</strong>`;worker.terminate();worker=null}}};
};

// Infinite Mind Palace: one locus for every nonnegative integer coordinate.
const infinityBasePalace=palacePage;
palacePage=function(){
  infinityBasePalace();const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="infinite-palace"><div class="section-row"><div><div class="kicker">INFINITE HALLWAY</div><h2>No final locus.</h2></div><p>Each nonnegative integer is a stable room coordinate. Notes are stored only for rooms you actually use.</p></div><div class="palace-infinity-control"><input id="locusIndex" inputmode="numeric" value="0"><button id="locusOpen">Open locus</button><button id="locusNext">Next room →</button></div><article id="locusRoom" class="locus-room"></article></section>`);
  const open=()=>{let n=bigOr(document.querySelector('#locusIndex').value,0n);if(n<0n)n=0n;const store=readStore(infinityKeys.palace,{});const note=store[String(n)]||'';document.querySelector('#locusRoom').innerHTML=`<span>${esc(infinityCoordinate('palace',n))}</span><h3>Room ${n}</h3><textarea id="locusNote" placeholder="Attach one memory, image, fact, or cue to this locus.">${esc(note)}</textarea><button id="saveLocus">Save this locus</button>`;document.querySelector('#saveLocus').onclick=()=>{const s=readStore(infinityKeys.palace,{});s[String(n)]=document.querySelector('#locusNote').value;writeStore(infinityKeys.palace,s);toast(`Saved locus ${n}`)}};
  document.querySelector('#locusOpen').onclick=open;document.querySelector('#locusNext').onclick=()=>{const e=document.querySelector('#locusIndex');e.value=bigOr(e.value,0n)+1n;open()};open();
};

// Possibility Engine: recursively split any branch forever. It is a scenario tree, not a probability forecast.
const infinityBasePossibilities=possibilitiesPage;
possibilitiesPage=function(){
  infinityBasePossibilities();const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="recursive-possibility"><div class="section-row"><div><div class="kicker">RECURSIVE BRANCH SPACE</div><h2>Any branch can split again.</h2></div><p>No probability is attached. A path records assumptions, not a claim that a future will occur.</p></div><form id="branchRootForm" class="frontier-control"><input id="branchRoot" placeholder="Scenario root, e.g. cheap fusion power becomes practical"><button>Create root</button></form><div id="branchSpace" class="branch-space"></div></section>`);
  const axes=['adoption accelerates','adoption stalls','cost falls','cost rises','regulation tightens','regulation loosens','public trust rises','public trust falls','technical progress continues','technical bottleneck appears'];
  const nodes=new Map();const render=()=>{const root=document.querySelector('#branchRoot').value.trim()||'Unspecified scenario';const arr=[...nodes.entries()].sort((a,b)=>a[0].split('.').length-b[0].split('.').length||a[0].localeCompare(b[0]));document.querySelector('#branchSpace').innerHTML=arr.map(([path,n])=>`<article class="branch-node"><span>possibility://${esc(base64urlUtf8(root))}/${esc(path)}</span><h3>${esc(n.label)}</h3><p>${esc(n.condition)}</p><div class="button-row"><button data-split="${esc(path)}:0">Split A</button><button data-split="${esc(path)}:1">Split B</button></div></article>`).join('');document.querySelectorAll('[data-split]').forEach(b=>b.onclick=()=>{const [parent,bit]=b.dataset.split.split(':');const child=`${parent}.${bit}`;if(!nodes.has(child)){const k=hash32(`${root}|${child}`);nodes.set(child,{label:`Branch ${child}`,condition:axes[k%axes.length]})}render()})};
  document.querySelector('#branchRootForm').onsubmit=e=>{e.preventDefault();nodes.clear();nodes.set('1',{label:'Root branch',condition:document.querySelector('#branchRoot').value.trim()||'Unspecified scenario'});render()};nodes.set('1',{label:'Root branch',condition:'Enter a scenario above, then keep splitting branches.'});render();
};

// Media: an unbounded SVG address stream. Address text is embedded, so coordinates remain distinguishable.
const infinityBaseMedia=mediaPage;
mediaPage=function(){
  infinityBaseMedia();const page=app.querySelector('.page');if(!page)return;
  page.insertAdjacentHTML('beforeend',`<section class="infinite-image-space"><div class="section-row"><div><div class="kicker">IMAGES OF BABEL · ADDRESS STREAM</div><h2>One procedural image for every nonnegative integer.</h2></div><p>This does not claim to enumerate every possible bitmap. It is an unbounded deterministic image stream because integer coordinates have no final member.</p></div><div class="image-address-controls"><input id="infiniteImageIndex" inputmode="numeric" value="0"><button id="infiniteImageOpen">Render</button><button id="infiniteImageNext">Next →</button></div><div id="infiniteImageOut" class="infinite-image-out"></div></section>`);
  const render=()=>{let n=bigOr(document.querySelector('#infiniteImageIndex').value,0n);if(n<0n)n=0n;const a=bmod(n,360),b=bmod(n/7n+31n,360),c=bmod(n/97n+113n,360);document.querySelector('#infiniteImageOut').innerHTML=`<svg viewBox="0 0 900 520" role="img" aria-label="Procedural image coordinate ${n}"><defs><linearGradient id="ig${a}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${a} 55% 28%)"/><stop offset="1" stop-color="hsl(${b} 50% 72%)"/></linearGradient></defs><rect width="900" height="520" fill="url(#ig${a})"/><circle cx="${120+b}" cy="${90+(c%300)}" r="${50+(a%170)}" fill="hsl(${c} 70% 60% / .55)"/><path d="M0 ${100+a%300} Q 450 ${20+b%480} 900 ${100+c%300} V520 H0Z" fill="hsl(${(a+b+c)%360} 35% 14% / .45)"/><text x="42" y="460" font-size="22" font-family="monospace" fill="white">image://integer/${n}</text></svg><div class="coordinate-box">${esc(infinityCoordinate('image',n))}</div>`};
  document.querySelector('#infiniteImageOpen').onclick=render;document.querySelector('#infiniteImageNext').onclick=()=>{const e=document.querySelector('#infiniteImageIndex');e.value=bigOr(e.value,0n)+1n;render()};render();
};

// Infinite Page: unique BigInt coordinates and automatic scroll continuation.
function infiniteDiscoveryCard(n){
  const topics=allTopics();const systems=BABEL_SYSTEMS;const t=topics[bmod(n,Math.max(1,topics.length))]||{title:'Unknown',slug:'unknown',category:'Index'};const s=systems[bmod(n*7n+3n,systems.length)];const prompts=['What evidence would change this?','What is its oldest traceable source?','What can be built from it?','What happens when its main assumption is reversed?','Which adjacent field changes the interpretation?','How would this be taught from first principles?','What remains unresolved?','What would a skeptic and a believer each investigate next?'];const prompt=prompts[bmod(n*13n+5n,prompts.length)];return `<article class="infinite-card infinite-coordinate-card" data-infinite-topic="${esc(t.slug)}"><span>∞:${n} · ${esc(t.category||'Index')}</span><h3>${esc(t.title)} <em>×</em> ${esc(s.name)}</h3><p>${esc(prompt)}</p><small>${esc(infinityCoordinate('discovery',n))}</small></article>`
}
infinitePage=function(){
  setTitle('Infinity Protocol');let n=0n;const params=new URLSearchParams(location.search);n=bigOr(params.get('at')||'0',0n);if(n<0n)n=0n;
  app.innerHTML=`<div class="page infinite-page infinity-protocol-page">${universePageHead('System ∞ / unbounded address protocol','Infinity Protocol','The site does not need a final page. Deterministic address spaces let Babel keep creating finite views at larger and larger coordinates while finite source collections remain honestly labeled as finite.')}
  <section class="infinity-rules"><article><span>∞1</span><strong>Library</strong><p>Any positive BigInt page.</p></article><article><span>∞2</span><strong>Integers</strong><p>Every integer by index.</p></article><article><span>∞3</span><strong>Rationals</strong><p>Every positive rational once.</p></article><article><span>∞4</span><strong>Network</strong><p>Recursive frontier nodes.</p></article><article><span>∞5</span><strong>Mind Palace</strong><p>Unlimited loci.</p></article><article><span>∞6</span><strong>Possibilities</strong><p>Unlimited branch depth.</p></article><article><span>∞7</span><strong>Images</strong><p>Unbounded integer image stream.</p></article><article><span>∞8</span><strong>Discovery</strong><p>Automatic continuation.</p></article></section>
  <div class="infinite-jump"><label>Jump to discovery coordinate<input id="infiniteJump" inputmode="numeric" value="${n}"></label><button id="infiniteJumpGo">Jump</button></div><div id="infiniteFeed" class="infinite-feed"></div><div id="infiniteSentinel" class="infinite-sentinel"><span>∞</span><small>Scroll to continue</small></div></div>`;
  const more=(count=32)=>{const feed=document.querySelector('#infiniteFeed');let html='';for(let i=0;i<count;i++){html+=infiniteDiscoveryCard(n);n++}feed.insertAdjacentHTML('beforeend',html);feed.querySelectorAll('[data-infinite-topic]:not([data-bound])').forEach(x=>{x.dataset.bound='1';x.onclick=()=>openTopic(x.dataset.infiniteTopic)})};
  document.querySelector('#infiniteJumpGo').onclick=()=>route(`/infinite?at=${encodeURIComponent(String(posBig(document.querySelector('#infiniteJump').value,1n)))}`);more(48);
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))more(32)},{rootMargin:'800px'});observer.observe(document.querySelector('#infiniteSentinel'));
};

// Make the About page explicit about unbounded vs physically infinite storage.
const infinityBaseAbout=about;
about=function(){
  infinityBaseAbout();const page=app.querySelector('.page');if(page)page.insertAdjacentHTML('afterbegin',infinityNotice('Infinity means an address rule with no preset last coordinate.','The repository does not claim to physically contain infinite bytes, infinite web pages, or future facts. It can generate or navigate another finite coordinate whenever resources allow.'));
};
