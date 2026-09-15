/* Website Of Babel v10: dense Babel Dossiers, living index, searchable selections. */
const V10_VERSION='10.0.0';

function v10SearchLink(q,label=q){return `<button class="v10-query-link" data-v10-search="${esc(q)}">${esc(label)}</button>`}
function v10Host(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return''}}
function v10Num(n){return n==null?'n/a':Number(n).toLocaleString()}
function v10Date(v){try{return new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}catch{return String(v||'')}}
function v10FactValue(f){if(f.type==='quantity')return `${esc(f.value)}${f.unit&&f.unit!=='1'?` <small>${esc(f.unit.replace('http://www.wikidata.org/entity/',''))}</small>`:''}`;return esc(f.value)}
function v10BindSearchables(){document.querySelectorAll('[data-v10-search]').forEach(x=>x.onclick=()=>route(v9SearchRoute(x.dataset.v10Search)));v9BindInternalMedia();wireRoutes()}

function v10InstallSelectionSearch(){
  if(document.querySelector('#v10SelectionSearch'))return;
  const b=document.createElement('button');b.id='v10SelectionSearch';b.className='v10-selection-search';b.hidden=true;document.body.appendChild(b);
  const hide=()=>{b.hidden=true};
  document.addEventListener('selectionchange',()=>{setTimeout(()=>{const s=String(getSelection()?.toString()||'').trim().replace(/\s+/g,' ');if(s.length<2||s.length>120){hide();return}const r=getSelection()?.rangeCount?getSelection().getRangeAt(0).getBoundingClientRect():null;if(!r||(!r.width&&!r.height)){hide();return}b.textContent=`Search “${s.slice(0,55)}${s.length>55?'…':''}”`;b.dataset.q=s;b.style.left=`${Math.max(12,Math.min(innerWidth-240,r.left+r.width/2-100))}px`;b.style.top=`${Math.max(70,r.bottom+8+scrollY)}px`;b.hidden=false},0)});
  b.onclick=()=>{const q=b.dataset.q||'';hide();if(q)route(v9SearchRoute(q))};document.addEventListener('pointerdown',e=>{if(e.target!==b&&b.hidden===false&&getSelection()?.isCollapsed)hide()});
}

function v10DefaultIndex(){
  const topics=v7Curated();const groups=new Map();for(const t of topics){const k=t.category||'General';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(t)}
  return `<section class="v10-index-intro"><div><span>THE INDEX IS ALREADY OPEN</span><h2>Browse before you search.</h2><p>Babel is not an empty search box. Start from a field, a system, or a foundation topic, then branch outward.</p></div><div class="v10-index-stats"><b>${topics.length}</b><small>curated foundations</small><b>${BABEL_SYSTEMS.length}</b><small>connected systems</small><b>1M</b><small>verified π digits</small></div></section>
  <section class="v10-category-atlas"><div class="v9-section-title"><span>KNOWLEDGE ATLAS</span><small>${groups.size} fields</small></div><div class="v10-category-grid">${[...groups.entries()].slice(0,14).map(([cat,rows])=>`<article><span>${esc(cat.toUpperCase())}</span><h3>${rows.length} entries</h3><div>${rows.slice(0,6).map(t=>v10SearchLink(t.title)).join('')}</div></article>`).join('')}</div></section>
  <section class="v10-system-atlas"><div class="v9-section-title"><span>BABEL SYSTEMS</span><small>${BABEL_SYSTEMS.length} instruments</small></div><div>${BABEL_SYSTEMS.slice(0,18).map(s=>`<a href="${esc(s.route)}" data-route><span>${esc(s.n)}</span><b>${esc(s.name)}</b><small>${esc(s.kind||'SYSTEM')}</small><i>→</i></a>`).join('')}</div></section>`;
}

function v10MediaGrid(media=[]){
  if(!media.length)return '<p class="v9-none">No indexed media returned for this query.</p>';
  return `<div class="v10-media-grid">${media.map(m=>m.type==='image'?`<button data-image-view="${esc(m.url)}" data-image-title="${esc(m.title||'Image')}"><img src="${esc(m.url)}" alt="${esc(m.title||'')}" loading="lazy" referrerpolicy="no-referrer"><span><b>${esc(m.title||'Image')}</b><small>${esc(m.source||'Media')}${m.license?` · ${esc(m.license)}`:''}</small></span></button>`:m.type==='video'?`<article><video controls preload="metadata" src="${esc(m.url)}"></video><b>${esc(m.title||'Video')}</b><small>${esc(m.source||'Media')}</small></article>`:`<article><audio controls preload="metadata" src="${esc(m.url)}"></audio><b>${esc(m.title||'Audio')}</b><small>${esc(m.source||'Media')}</small></article>`).join('')}</div>`;
}

function v10RenderDossier(q,d,web,topPage,trends){
  const e=d.encyclopedia, facts=d.facts||[], related=d.related||[], media=d.media||[], papers=d.papers||[], archives=d.archives||[], projects=d.projects||[], discussions=d.discussions||[], coverage=d.coverage||[], lex=d.lexicon||[], sites=web.results||[];
  const title=e?.title||d.wikidata?.label||q;const dek=e?.summary||d.wikidata?.description||topPage?.description||`Babel dossier for ${q}.`;
  const signalRows=trends?.signals||[];
  return `<article class="v10-dossier">
    <header class="v10-dossier-head"><div><span>BABEL DOSSIER / LIVE COMPOSITE</span><h2>${esc(title)}</h2><p>${esc(dek)}</p><div class="v10-dossier-tools"><a href="/network?q=${encodeURIComponent(q)}" data-route>Map network</a><a href="/pi?q=${encodeURIComponent(q)}" data-route>Search π</a><a href="/library?find=${encodeURIComponent(q)}" data-route>Map library</a><a href="/futures?q=${encodeURIComponent(q)}" data-route>Measure signals</a></div></div>${e?.image?`<button data-image-view="${esc(e.image)}" data-image-title="${esc(title)}" class="v10-cover"><img src="${esc(e.image)}" alt="${esc(title)}" loading="eager" referrerpolicy="no-referrer"></button>`:''}</header>
    <nav class="v10-dossier-nav">${[['overview','Overview'],['facts','Facts'],['media','Media'],['research','Research'],['archive','Files'],['web','Web'],['related','Related']].map(([id,l])=>`<a href="#v10-${id}">${l}</a>`).join('')}</nav>
    <section id="v10-overview" class="v10-dossier-section"><div class="v10-section-head"><span>01 / KNOWLEDGE</span><h3>Overview</h3></div><div class="v10-prose">${e?.paragraphs?.length?e.paragraphs.slice(0,22).map((p,i)=>`<p${i>7?' class="v10-deep"':''}>${esc(p)}</p>`).join(''):`<p>No encyclopedia article matched this exact query. Babel is still using web, archive, code, structured-data, and research indexes below.</p>`}</div>${(e?.paragraphs?.length||0)>8?'<button class="v10-expand-prose" data-expand-prose>Show complete indexed overview</button>':''}</section>
    ${lex.length?`<section class="v10-dossier-section"><div class="v10-section-head"><span>02 / LANGUAGE</span><h3>Definitions</h3></div><div class="v10-definition-grid">${lex.map(x=>`<article><b>${esc(x.title)}</b><p>${esc(x.definition)}</p></article>`).join('')}</div></section>`:''}
    <section id="v10-facts" class="v10-dossier-section"><div class="v10-section-head"><span>03 / STRUCTURED DATA</span><h3>Facts</h3></div>${facts.length?`<div class="v10-facts">${facts.map(f=>`<div><span>${esc(f.property)}</span><b>${v10FactValue(f)}</b></div>`).join('')}</div>`:'<p class="v9-none">No structured Wikidata facts returned for this query.</p>'}</section>
    <section id="v10-media" class="v10-dossier-section"><div class="v10-section-head"><span>04 / MEDIA</span><h3>Images, video, audio</h3><small>${media.length} indexed objects</small></div>${v10MediaGrid(media)}</section>
    ${topPage?`<section class="v10-dossier-section v10-site-profile"><div class="v10-section-head"><span>05 / WEBSITE SNAPSHOT</span><h3>${esc(topPage.title||topPage.host)}</h3><small>${esc(topPage.host||'')}</small></div><p>${esc(topPage.description||'Public website indexed by Babel Reader.')}</p><div class="v10-site-sections">${(topPage.sections||[]).slice(0,8).map(s=>`<article><b>${esc(s.title)}</b><p>${esc(s.text)}</p></article>`).join('')}</div>${(topPage.images||[]).length?`<div class="v10-reader-thumbs">${topPage.images.slice(0,8).map(x=>`<button data-image-view="${esc(x.url)}" data-image-title="${esc(x.alt||topPage.title)}"><img src="${esc(x.url)}" alt="${esc(x.alt||'')}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>`:''}<a class="v10-internal-link" href="${v9ReaderRoute(topPage.url)}" data-route>Open full website snapshot inside Babel →</a></section>`:''}
    <section id="v10-research" class="v10-dossier-section"><div class="v10-section-head"><span>06 / SCHOLARSHIP</span><h3>Research</h3><small>${papers.length} works</small></div>${papers.length?`<div class="v10-paper-list">${papers.map((p,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h4>${esc(p.title)}</h4><p>${[p.year,p.venue,p.authors?.join(', ')].filter(Boolean).map(esc).join(' · ')}</p><small>${v10Num(p.citations)} citations${p.openAccess?' · open access':''}</small></div></article>`).join('')}</div>`:'<p class="v9-none">No research works returned.</p>'}</section>
    <section id="v10-archive" class="v10-dossier-section"><div class="v10-section-head"><span>07 / ARCHIVE</span><h3>Files and preserved objects</h3><small>${archives.length} records</small></div>${archives.length?`<div class="v10-archive-grid">${archives.map(a=>`<a href="/archive?identifier=${encodeURIComponent(a.identifier)}&title=${encodeURIComponent(a.title)}" data-route><span>${esc((a.mediatype||'item').toUpperCase())}${a.year?` · ${esc(a.year)}`:''}</span><b>${esc(a.title)}</b><p>${esc(a.description||a.creator||'Archived object.')}</p><i>Open inside Babel →</i></a>`).join('')}</div>`:'<p class="v9-none">No archive objects returned.</p>'}</section>
    ${projects.length?`<section class="v10-dossier-section"><div class="v10-section-head"><span>08 / BUILDING</span><h3>Code and projects</h3><small>${projects.length} repositories</small></div><div class="v10-project-grid">${projects.map(p=>`<article><span>${esc(p.language||'Repository')} · ★ ${v10Num(p.stars)}</span><h4>${esc(p.name)}</h4><p>${esc(p.description||'Public repository.')}</p><a href="${v9ReaderRoute(p.url)}" data-route>Inspect in Babel →</a></article>`).join('')}</div></section>`:''}
    ${signalRows.length?`<section class="v10-dossier-section"><div class="v10-section-head"><span>09 / OBSERVED NOW</span><h3>Public signals</h3><small>measurements, not predictions</small></div><div class="v9-signal-grid">${signalRows.map(s=>`<article><span>${esc(s.label)}</span><b>${s.available?v10Num(s.value):'n/a'}</b><small>${esc(s.kind)}</small></article>`).join('')}</div>${trends?.momentum==null?'':`<p class="v10-signal-note">Wikipedia attention, recent 7 days vs previous 7 days: <b>${trends.momentum>=0?'+':''}${Number(trends.momentum).toFixed(1)}%</b>.</p>`}</section>`:''}
    ${coverage.length?`<section class="v10-dossier-section"><div class="v10-section-head"><span>10 / RECENT COVERAGE</span><h3>Public coverage index</h3><small>${coverage.length} records</small></div><div class="v10-coverage-list">${coverage.map(c=>`<article><span>${esc(c.domain||'web')}${c.seen?` · ${esc(c.seen)}`:''}</span><h4>${esc(c.title)}</h4><a href="${v9ReaderRoute(c.url)}" data-route>Read inside Babel →</a></article>`).join('')}</div></section>`:''}
    ${discussions.length?`<section class="v10-dossier-section"><div class="v10-section-head"><span>11 / DISCUSSION</span><h3>Public discussion signals</h3></div><div class="v10-discussion-list">${discussions.map(x=>`<article><h4>${esc(x.title)}</h4><span>${v10Num(x.points)} points · ${v10Num(x.comments)} comments${x.created?` · ${esc(v10Date(x.created))}`:''}</span><a href="${v9ReaderRoute(x.url)}" data-route>Inspect inside Babel →</a></article>`).join('')}</div></section>`:''}
    <section id="v10-web" class="v10-dossier-section"><div class="v10-section-head"><span>12 / PUBLIC WEB</span><h3>Websites</h3><small>${sites.length} results</small></div>${sites.length?`<div class="v10-website-grid">${sites.slice(0,24).map((r,i)=>`<article><span>${String(i+1).padStart(2,'0')} · ${esc(r.host||v10Host(r.url))}</span><h4>${esc(r.title||r.host)}</h4><p>${esc(r.snippet||'Public website result.')}</p><a href="${v9ReaderRoute(r.url)}" data-route>Read inside Babel →</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map site →</a></article>`).join('')}</div>`:'<p class="v9-none">No public websites returned.</p>'}</section>
    <section id="v10-related" class="v10-dossier-section"><div class="v10-section-head"><span>13 / CONNECTIONS</span><h3>Related knowledge</h3><small>${related.length} branches</small></div><div class="v10-related-cloud">${related.map(x=>v10SearchLink(x.title)).join('')}</div></section>
    <details class="v10-provenance"><summary>Source provenance and research notes</summary><p>Babel renders normalized research inside this site. Source addresses remain provenance so results can be checked rather than treated as unsourced generated text.</p><div>${[...(d.notes||[])].map(x=>`<span>${esc(x)}</span>`).join('')||'<span>All requested source adapters returned without a recorded adapter error.</span>'}</div></details>
  </article>`;
}

async function v10SearchPage(){
  setTitle('Search Everywhere');await loadExplore();const p=new URLSearchParams(location.search),initial=p.get('q')||'';
  app.innerHTML=`<div class="page v10-search-page"><header class="v10-compact-head"><div><span>UNIVERSAL INDEX / DOSSIER ENGINE</span><h1>Search Everywhere</h1></div><p>One query becomes a complete internal research dossier: readable knowledge, structured facts, media, scholarship, archives, code, websites, signals, graphs, mathematical spaces, and your private notes.</p></header><form class="v10-main-search" id="v10SearchForm"><input id="v10SearchQ" value="${esc(initial)}" autocomplete="off" placeholder="Search any word, person, website, theory, file, number, skill, myth, question..."><button>Build dossier</button></form><div id="v10SearchOut">${initial?'<div class="v9-loading">Building Babel dossier...</div>':v10DefaultIndex()}</div></div>`;
  const run=async q=>{if(!q)return;history.replaceState({},'',v9SearchRoute(q));setTitle(`Search: ${q}`);const out=document.querySelector('#v10SearchOut');out.innerHTML='<div class="v10-loading-ledger"><b>BUILDING DOSSIER</b><span>Reference</span><span>structured data</span><span>media</span><span>scholarship</span><span>archives</span><span>web</span><span>signals</span></div>';
    const [dd,ww,tt]=await Promise.allSettled([json(`/api/dossier?q=${encodeURIComponent(q)}`),json(`/api/websearch?q=${encodeURIComponent(q)}`),json(`/api/trends?q=${encodeURIComponent(q)}`)]);
    const d=dd.status==='fulfilled'?dd.value:{query:q,notes:['Dossier endpoint unavailable'],media:[],papers:[],archives:[],projects:[],discussions:[],coverage:[],related:[],facts:[],lexicon:[]};const web=ww.status==='fulfilled'?ww.value:{results:[]};const trends=tt.status==='fulfilled'?tt.value:null;
    let topPage=null;const first=(web.results||[])[0];if(first?.url){try{topPage=await json(`/api/reader?url=${encodeURIComponent(first.url)}`)}catch{}}
    out.innerHTML=v10RenderDossier(q,d,web,topPage,trends);
    document.querySelector('[data-expand-prose]')?.addEventListener('click',e=>{document.querySelectorAll('.v10-prose .v10-deep').forEach(x=>x.classList.add('show'));e.currentTarget.remove()});
    v10BindSearchables();
  };
  document.querySelector('#v10SearchForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v10SearchQ').value.trim();if(q)run(q)};v10BindSearchables();if(initial)run(initial);
}

function v10WebLanding(){
  return `<section class="v10-web-landmarks"><div class="v9-section-title"><span>VERIFIED WEB LANDMARKS</span><small>open inside Babel</small></div><div>${[
    ['The End of the Internet','hmpg.net','https://hmpg.net/','Internet folklore landmark'],
    ['HitBoyXx23','hitboyxx23.dev','https://hitboyxx23.dev/stack/','Public website anchor'],
    ['Library of Babel','libraryofbabel.info','https://libraryofbabel.info/','External Babel project'],
    ['Network of Babel','networkofbabel.com','https://networkofbabel.com/','External Babel project'],
    ['Wikipedia','wikipedia.org','https://en.wikipedia.org/','Reference encyclopedia'],
    ['Internet Archive','archive.org','https://archive.org/','Public web archive']
  ].map(([t,h,u,d])=>`<article><span>${esc(h)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p><a href="${v9ReaderRoute(u)}" data-route>Read inside Babel →</a><a href="/network?q=${encodeURIComponent(u)}" data-route>Map website →</a></article>`).join('')}</div></section>`;
}

const v10OldWebPage=webPage;
webPage=async function(){
  await v10OldWebPage();const out=document.querySelector('#v8WebOut');if(out&&!new URLSearchParams(location.search).get('q')){out.innerHTML=v10WebLanding();wireRoutes()}
};

const v10OldPiPage=piPage;
piPage=async function(){
  await v10OldPiPage();const page=document.querySelector('.v7-pi-page,.v7-pi');if(!page)return;const search=document.querySelector('#piSearch')?.closest('section,form')||document.querySelector('#piSearch');
  const info=document.createElement('section');info.className='v10-pi-index';info.innerHTML=`<div class="v9-section-title"><span>PI INDEX</span><small>literal data + deterministic phrase mapping</small></div><div class="v10-pi-cards"><article><span>CORPUS</span><b>1,000,000</b><small>verified decimal digits</small></article><article><span>SEARCH</span><b>Exact</b><small>literal digit occurrence matching</small></article><article><span>WORDS</span><b>Mapped</b><small>stable SHA-256 coordinate plus explicit encodings</small></article><article><span>FUTURES</span><b>Signals</b><small>π selects branches, evidence comes from measured public data</small></article></div><div class="v10-pi-examples">${['hitboyxx23','314159','20010911','time travel','lucid dreaming'].map(x=>v10SearchLink(x,`Search Babel: ${x}`)).join('')}</div>`;
  if(search?.parentNode)search.parentNode.insertBefore(info,search.nextSibling);else page.prepend(info);v10BindSearchables();
};

const v10OldFutures=futuresPage;
futuresPage=function(){
  v10OldFutures();if(new URLSearchParams(location.search).get('q'))return;const out=document.querySelector('#v9FutureOut');if(!out)return;out.innerHTML=`<section class="v10-observatory"><div class="v9-section-title"><span>FUTURES OBSERVATORY</span><small>measured inputs, scenario outputs</small></div><div class="v10-observatory-grid">${[
    ['ATTENTION','Wikipedia page views','30-day total + week-over-week change'],
    ['DISCUSSION','Hacker News stories','public discussion count'],
    ['RESEARCH','OpenAlex works','recent scholarly activity'],
    ['ARCHIVE','Internet Archive matches','preserved public material'],
    ['BUILDING','GitHub repositories','recent repository activity']
  ].map(([a,b,c])=>`<article><span>${a}</span><h3>${b}</h3><p>${c}</p></article>`).join('')}</div><div class="v10-observatory-start"><span>START WITH A SUBJECT</span>${['artificial intelligence','fusion energy','virtual reality','robotics','quantum computing','indie games'].map(x=>v10SearchLink(x,`Measure ${x}`)).join('')}</div><p class="v10-observatory-note">Babel does not invent event probabilities. It measures present public signals, then shows scenario branches and what evidence would support or weaken each branch.</p></section>`;document.querySelectorAll('[data-v10-search]').forEach(b=>b.onclick=()=>route(`/futures?q=${encodeURIComponent(b.dataset.v10Search)}`));
};

function v10EnhanceHome(){
  const home=document.querySelector('.v9-home');if(!home)return;const feature=document.createElement('section');feature.className='v10-home-atlas';const topics=v7Curated();feature.innerHTML=`<div class="v9-section-title"><span>THE LIVING INDEX</span><small>browse without searching</small></div><div class="v10-home-columns"><div><h2>Knowledge foundations</h2><div>${topics.slice(0,20).map(t=>v10SearchLink(t.title)).join('')}</div></div><div><h2>Research instruments</h2><div>${BABEL_SYSTEMS.slice(0,16).map(s=>`<a href="${esc(s.route)}" data-route>${esc(s.name)} <span>${esc(s.kind)}</span></a>`).join('')}</div></div></div>`;home.appendChild(feature);v10BindSearchables();
}

const v10OldHome=universeHome;
universeHome=function(){v10OldHome();v10EnhanceHome()};

renderRoute=async function(){
  window.scrollTo(0,0);document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===location.pathname));const p=location.pathname;
  if(p==='/')return universeHome();if(p==='/search')return v10SearchPage();if(p==='/reader')return v9ReaderPage();if(p==='/archive')return v9ArchivePage();if(p==='/terminus')return v9TerminusPage();if(p==='/systems')return systemsPage();if(p==='/research')return researchPage();if(p==='/explore')return explore();if(p==='/network')return network();if(p==='/web')return webPage();if(p==='/web-network')return webNetworkPage();if(p==='/library')return library();if(p==='/lexicon')return lexiconPage();if(p==='/pi')return piPage();if(p==='/numbers')return numbersPage();if(p==='/universe-numbers')return universeNumbersPage();if(p==='/palace')return palacePage();if(p==='/learn')return learnPage();if(p==='/dreams')return dreamsPage();if(p==='/paranormal')return paranormalPage();if(p==='/futures')return futuresPage();if(p==='/people')return peoplePage();if(p==='/beliefs')return beliefsPage();if(p==='/myths')return mythsPage();if(p==='/probability')return probabilityPage();if(p==='/possibilities')return possibilitiesPage();if(p==='/timeline')return timelinePage();if(p==='/media')return mediaPage();if(p==='/sources')return sourcesPage();if(p==='/end')return route('/terminus',{replace:true});if(p==='/infinite')return route('/search',{replace:true});if(p==='/workbench')return workbench();if(p==='/about')return about();if(p.startsWith('/topic/'))return topicPage(decodeURIComponent(p.split('/')[2]||''));return notFound();
};

setTimeout(()=>{v10InstallSelectionSearch();try{renderRoute()}catch{}},0);
