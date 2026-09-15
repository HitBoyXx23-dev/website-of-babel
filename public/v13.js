/* Website Of Babel v13: unified search, dossier, media, tools, and simplified shell. */
const V13_VERSION='13.0.0';

function v13InstallShell(){
  const brand=document.querySelector('.brand');if(brand)brand.innerHTML='<span class="brand-name">Website Of Babel</span>';
  const nav=document.querySelector('#nav');if(nav)nav.innerHTML=`
    <a href="/search" data-route>Search</a>
    <a href="/explore" data-route>Explore</a>
    <a href="/network" data-route>Network</a>
    <a href="/media" data-route>Media</a>
    <a href="/tools" data-route>Tools</a>
    <a href="/browser" data-route>Browser</a>
    <a href="/arcade" data-route>Games</a>
    <a href="/systems" data-route>More</a>
    <button class="global-search-button" id="globalSearchButton" aria-label="Search everything">Search /</button>
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme"><span id="themeIcon">◐</span></button>`;
  document.querySelector('#globalSearchButton')?.addEventListener('click',()=>route('/search'));
  const theme=document.querySelector('#themeToggle');if(theme)theme.onclick=()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem(themeKey,next);applyTheme(next)};
  const mobile=document.querySelector('#mobileNav');if(mobile)mobile.onclick=()=>nav?.classList.toggle('open');
  const foot=document.querySelector('.footer');if(foot)foot.innerHTML='<div><strong>Website Of Babel</strong><br>One index for knowledge, media, web, mathematics, tools, and exploration.</div><div>Public information is retrieved on demand. Personal notes stay on this device.</div>';
  wireRoutes();
}
function v13RouteCard(title,href,desc){return `<a href="${href}" data-route><b>${esc(title)}</b><span>${esc(desc)}</span></a>`}
function v13SearchChip(q,label=q){return `<button class="v13-chip" data-v13-q="${esc(q)}">${esc(label)}</button>`}
function v13Bind(root=document){
  root.querySelectorAll('[data-v13-q]').forEach(x=>x.onclick=()=>route(v9SearchRoute(x.dataset.v13Q)));
  root.querySelectorAll('[data-v13-reader]').forEach(x=>x.onclick=()=>route(v9ReaderRoute(x.dataset.v13Reader)));
  wireRoutes();
}
function v13DefaultIndex(){
  const groups=[
    ['Knowledge',[['Programming','/code','languages, APIs, algorithms'],['Food','/food','recipes, baking, food science'],['Languages','/languages','human languages and scripts'],['World','/world','countries, places, cultures'],['Paranormal','/paranormal','ghosts, spirits, folklore'],['Mature','/mature','18+ educational knowledge']]],
    ['Explore',[['Network','/network','websites, people, concepts'],['Library','/library','deterministic text space'],['Pi','/pi','digits, words, coordinates'],['Numbers','/numbers','constants, integers, rationals'],['Futures','/futures','signals and scenarios'],['Mind Palace','/palace','method of loci']]],
    ['Media + Web',[['Media','/media','images, video, audio, files'],['Browser','/browser','Reader + Scramjet adapter'],['Archive','/archive','Internet Archive objects'],['People','/people','public people and usernames'],['Web','/web','public website discovery'],['Rules','/rules','internet culture']]],
    ['Tools',[['Calculator','/tools#calculator','scientific calculator'],['Converters','/tools#convert','units and number bases'],['Text tools','/tools#text','JSON, URL, hashes'],['Games','/arcade','built-in browser games'],['Research','/research','sources and evidence'],['Systems','/systems','every Babel system']]]
  ];
  return `<div class="v13-index">${groups.map(([name,items])=>`<div class="v13-index-row"><strong>${esc(name)}</strong><div class="v13-index-links">${items.map(x=>v13RouteCard(x[0],x[1],x[2])).join('')}</div></div>`).join('')}</div>`;
}

universeHome=function(){
  setTitle('');
  app.innerHTML=`<div class="v13-wrap v13-home">
    <h1 class="v13-wordmark">Everything, through one search.</h1>
    <p class="v13-sub">Website Of Babel searches knowledge, websites, public people and usernames, images, video, audio, files, code, books, research, countries, languages, recipes, mathematics, archives, games, and connected ideas without making every room a separate starting point.</p>
    <form class="v13-search" id="v13HomeForm"><input id="v13HomeQ" autocomplete="off" autofocus placeholder="Search anything"><button>Search</button></form>
    <div class="v13-shortcuts">${['hitboyxx23','the end of the internet','Python','Japan','sourdough bread','lucid dreaming','ghosts','Doom','pi','2^128','Japanese'].map(x=>v13SearchChip(x)).join('')}</div>
    ${v13DefaultIndex()}
  </div>`;
  document.querySelector('#v13HomeForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v13HomeQ').value.trim();if(q)route(v9SearchRoute(q))};v13Bind();
};

class V13CalcParser{
  constructor(s){this.s=s.replace(/π/gi,'pi');this.i=0}
  peek(){return this.s[this.i]||''} skip(){while(/\s/.test(this.peek()))this.i++}
  eat(c){this.skip();if(this.s.slice(this.i,this.i+c.length)===c){this.i+=c.length;return true}return false}
  number(){this.skip();const m=this.s.slice(this.i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);if(!m)throw Error('Expected number');this.i+=m[0].length;return Number(m[0])}
  name(){this.skip();const m=this.s.slice(this.i).match(/^[A-Za-z_][A-Za-z0-9_]*/);if(!m)return'';this.i+=m[0].length;return m[0].toLowerCase()}
  primary(){this.skip();if(this.eat('+'))return this.primary();if(this.eat('-'))return -this.primary();if(this.eat('(')){const v=this.expr();if(!this.eat(')'))throw Error('Missing )');return v}if(/[0-9.]/.test(this.peek()))return this.number();const n=this.name();if(!n)throw Error('Unexpected token');if(n==='pi')return Math.PI;if(n==='e')return Math.E;const fn={sqrt:Math.sqrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,round:Math.round};if(fn[n]){if(!this.eat('('))throw Error(`Expected ( after ${n}`);const v=this.expr();if(!this.eat(')'))throw Error('Missing )');return fn[n](v)}throw Error(`Unknown name ${n}`)}
  power(){let v=this.primary();this.skip();if(this.eat('^'))v=Math.pow(v,this.power());return v}
  term(){let v=this.power();for(;;){if(this.eat('*'))v*=this.power();else if(this.eat('/'))v/=this.power();else if(this.eat('%'))v%=this.power();else break}return v}
  expr(){let v=this.term();for(;;){if(this.eat('+'))v+=this.term();else if(this.eat('-'))v-=this.term();else break}return v}
  parse(){const v=this.expr();this.skip();if(this.i!==this.s.length)throw Error('Unexpected input');if(!Number.isFinite(v))throw Error('Result is not finite');return v}
}
function v13TryCalc(q){
  const s=String(q||'').trim();if(!s||s.length>160)return null;
  if(!/[0-9π()+\-*/%^]/.test(s)&&!/^\s*(sqrt|sin|cos|tan|abs|ln|log|exp|floor|ceil|round|pi|e)\b/i.test(s))return null;
  if(/[^0-9A-Za-z_π.()+\-*/%^\s]/.test(s))return null;
  const names=(s.match(/[A-Za-z_][A-Za-z0-9_]*/g)||[]).map(x=>x.toLowerCase());
  const allowed=new Set(['pi','e','sqrt','sin','cos','tan','asin','acos','atan','abs','ln','log','exp','floor','ceil','round']);
  if(names.some(x=>!allowed.has(x)))return null;
  try{return {ok:true,value:new V13CalcParser(s).parse()}}catch(e){return {ok:false,error:e.message}}
}
function v13FormatNumber(n){if(Number.isInteger(n)&&Math.abs(n)<1e21)return n.toLocaleString('en-US',{maximumFractionDigits:0});return Number(n).toLocaleString('en-US',{maximumSignificantDigits:15})}
function v13CalcBlock(q){const c=v13TryCalc(q);if(!c)return'';return `<section class="v13-calc" data-kind="tools"><span class="v13-kicker">CALCULATOR</span>${c.ok?`<div class="v13-calc-result">${esc(v13FormatNumber(c.value))}</div><small>${esc(q)} · computed locally, no AI estimate</small>`:`<b>Could not calculate</b><p>${esc(c.error)}</p>`}<div class="v13-shortcuts"><a class="v13-chip" href="/tools#calculator" data-route>Open calculator</a></div></section>`}

function v13MediaCard(x){
  const title=x.title||'Untitled';const type=x.type||'file';const src=x.url||x.original||'';
  return `<article class="v13-media" data-kind="media ${esc(type)}">${type==='image'&&src?`<img src="${esc(src)}" alt="${esc(title)}" loading="lazy" referrerpolicy="no-referrer">`:x.thumbnail?`<img src="${esc(x.thumbnail)}" alt="${esc(title)}" loading="lazy" referrerpolicy="no-referrer">`:''}<div class="v13-media-body"><b>${esc(title)}</b><span>${esc(type)} · ${esc(x.source||'public catalog')}${x.license?` · ${esc(x.license)}`:''}</span>${type==='audio'&&x.original?`<audio controls preload="none" src="${esc(x.original)}"></audio>`:''}${x.identifier?`<a href="/archive?id=${encodeURIComponent(x.identifier)}" data-route>Open in Babel</a>`:x.sourceUrl?`<a href="${v9ReaderRoute(x.sourceUrl)}" data-route>Inspect source</a>`:''}</div></article>`;
}
function v13WebItem(r,i){return `<article class="v13-web-item" data-kind="web people"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(r.title||r.host||'Public web result')}</h3><p>${esc(r.snippet||'Public web result.')}</p><small>${esc(r.source||'web')} · ${esc(r.host||'')}</small></div><div class="v13-web-actions"><a href="${v9ReaderRoute(r.url)}" data-route>Read</a><a href="/network?q=${encodeURIComponent(r.url)}" data-route>Map</a></div></article>`}
function v13Section(label,title,count,body,kind='all'){if(!body)return'';return `<section class="v13-section" data-kind="${esc(kind)}"><div class="v13-section-head"><div><span>${esc(label)}</span><h2>${esc(title)}</h2></div>${count!==undefined?`<small>${esc(count)} items</small>`:''}</div>${body}</section>`}
function v13Dossier(q,d,web,media,trends,local=[],systems=[]){
  const enc=d.encyclopedia||null;const paras=enc?.paragraphs||[];const facts=d.facts||[];const papers=d.papers||[];const archives=d.archives||[];const projects=d.projects||[];const discussions=d.discussions||[];const coverage=d.coverage||[];const related=d.related||[];const recipes=d.recipes||[];const webRows=web.results||[];const mediaRows=media.items||d.media||[];
  const overview=enc?`<div class="v13-prose">${paras.slice(0,12).map(p=>`<p>${esc(p)}</p>`).join('')||`<p>${esc(enc.summary||'')}</p>`}</div>`:`<div class="v13-empty">No encyclopedia article matched exactly. The other indexes below may still contain material.</div>`;
  const factsHtml=facts.length?`<div class="v13-facts">${facts.slice(0,42).map(x=>`<div class="v13-fact"><span>${esc(x.property)}</span><b>${esc(x.value)}${x.unit&&x.unit!=='1'?` ${esc(x.unit)}`:''}</b></div>`).join('')}</div>`:'';
  const research=[...papers.map(x=>({tag:'paper',title:x.title,desc:[x.year,x.venue,`${x.citations??0} citations`].filter(Boolean).join(' · '),url:x.url})),...projects.map(x=>({tag:'code',title:x.name||x.title,desc:[x.language,`${x.stars||0} stars`,x.description].filter(Boolean).join(' · '),url:x.url}))];
  const archiveHtml=archives.slice(0,18).map(x=>`<article class="v13-card" data-kind="files media"><span>${esc(x.mediatype||'archive')}</span>${x.thumbnail?`<img src="${esc(x.thumbnail)}" alt="" loading="lazy">`:''}<h3>${esc(x.title)}</h3><p>${esc(x.description||[x.creator,x.year].filter(Boolean).join(' · '))}</p><a href="/archive?id=${encodeURIComponent(x.identifier)}" data-route>Open in Babel</a></article>`).join('');
  const recipesHtml=recipes.map(x=>`<article class="v13-card" data-kind="knowledge"><span>${esc([x.area,x.category].filter(Boolean).join(' · ')||'recipe')}</span>${x.image?`<img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy">`:''}<h3>${esc(x.title)}</h3><p>${esc(x.ingredients.slice(0,8).map(i=>`${i.measure} ${i.ingredient}`.trim()).join(', '))}</p><a href="${v9SearchRoute(`${x.title} recipe instructions`)}" data-route>Full recipe dossier</a></article>`).join('');
  const signals=trends?`<div class="v13-status"><div><b>${Number(trends.wikipedia?.views30d||0).toLocaleString()}</b><span>Wikipedia 30d</span></div><div><b>${trends.wikipedia?.change7d==null?'n/a':`${Number(trends.wikipedia.change7d).toFixed(1)}%`}</b><span>7d change</span></div><div><b>${Number(trends.hn?.stories30d||0).toLocaleString()}</b><span>HN stories</span></div><div><b>${Number(trends.openalex?.works||0).toLocaleString()}</b><span>Research works</span></div><div><b>${Number(trends.github?.repositories||0).toLocaleString()}</b><span>Repositories</span></div></div>`:'';
  const localIndex=[...local.map(t=>({title:t.title,desc:t.dek||t.category||'',href:`/topic/${encodeURIComponent(t.slug)}`,tag:t.category||'Babel entry'})),...systems.map(x=>({title:x.name,desc:x.desc||'',href:x.route,tag:x.kind||'system'}))];
  return `${v13CalcBlock(q)}
    ${localIndex.length?v13Section('00 / BABEL INDEX','Internal matches',localIndex.length,`<div class="v13-grid">${localIndex.slice(0,18).map(x=>`<article class="v13-card" data-kind="knowledge tools"><span>${esc(x.tag)}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><a href="${esc(x.href)}" data-route>Open</a></article>`).join('')}</div>`,'knowledge tools'):''}
    <div class="v13-dashboard"><section class="v13-panel"><span class="v13-kicker">DOSSIER</span><h2>${esc(enc?.title||d.wikidata?.label||q)}</h2><p>${esc(enc?.summary||d.wikidata?.description||`Babel combined public indexes for “${q}”.`)}</p></section><section class="v13-panel"><span class="v13-kicker">INDEX STATUS</span><div class="v13-status"><div><b>${webRows.length}</b><span>web</span></div><div><b>${mediaRows.length}</b><span>media</span></div><div><b>${papers.length}</b><span>papers</span></div><div><b>${archives.length}</b><span>archive</span></div></div></section></div>
    ${v13Section('01 / KNOWLEDGE','Overview',paras.length,overview,'knowledge')}
    ${factsHtml?v13Section('02 / STRUCTURED DATA','Facts',facts.length,factsHtml,'knowledge'):''}
    ${recipesHtml?v13Section('03 / RECIPES','Cooking and baking',recipes.length,`<div class="v13-grid">${recipesHtml}</div>`,'knowledge'):''}
    ${mediaRows.length?v13Section('04 / MEDIA','Images, audio, video, and files',mediaRows.length,`<div class="v13-media-grid">${mediaRows.slice(0,36).map(v13MediaCard).join('')}</div>`,'media'):''}
    ${research.length?v13Section('05 / RESEARCH + CODE','Papers and projects',research.length,`<div class="v13-grid">${research.slice(0,24).map(x=>`<article class="v13-card" data-kind="research code"><span>${esc(x.tag)}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc||'')}</p>${x.url?`<a href="${v9ReaderRoute(x.url)}" data-route>Inspect in Babel</a>`:''}</article>`).join('')}</div>`,'research code'):''}
    ${archiveHtml?v13Section('06 / ARCHIVE','Files and preserved objects',archives.length,`<div class="v13-grid">${archiveHtml}</div>`,'files media'):''}
    ${signals?v13Section('07 / LIVE SIGNALS','Observed public activity',undefined,signals,'futures'):''}
    ${webRows.length?v13Section('08 / PUBLIC WEB','Websites, people, usernames, and profiles',webRows.length,`<div class="v13-web-list">${webRows.slice(0,80).map(v13WebItem).join('')}</div>`,'web people'):''}
    ${[...discussions,...coverage].length?v13Section('09 / DISCUSSION + COVERAGE','Public conversation',discussions.length+coverage.length,`<div class="v13-grid">${[...discussions.map(x=>({...x,desc:`${x.points||0} points · ${x.comments||0} comments`})),...coverage.map(x=>({...x,desc:[x.domain,x.sourceCountry,x.seen].filter(Boolean).join(' · ')}))].slice(0,24).map(x=>`<article class="v13-card"><span>public signal</span><h3>${esc(x.title)}</h3><p>${esc(x.desc||'')}</p>${x.url?`<a href="${v9ReaderRoute(x.url)}" data-route>Read in Babel</a>`:''}</article>`).join('')}</div>`,'futures web'):''}
    ${related.length?v13Section('10 / CONNECTIONS','Related concepts',related.length,`<div class="v13-shortcuts">${related.slice(0,40).map(x=>v13SearchChip(x.title)).join('')}</div>`,'knowledge'):''}
    <section class="v13-section"><div class="v13-section-head"><div><span>11 / BABEL SPACES</span><h2>Continue anywhere</h2></div></div><div class="v13-shortcuts">${[['Network',`/network?q=${encodeURIComponent(q)}`],['Pi',`/pi?q=${encodeURIComponent(q)}`],['Library','/library'],['Futures',`/futures?q=${encodeURIComponent(q)}`],['Media',`/media?q=${encodeURIComponent(q)}`],['Browser','/browser']].map(([t,h])=>`<a class="v13-chip" href="${h}" data-route>${t}</a>`).join('')}</div></section>${v7NotePanel(`search:${q}`,'Notes on this search')}`;
}

async function v13SearchPage(){
  setTitle('Search');await loadExplore();const initial=new URLSearchParams(location.search).get('q')||'';
  app.innerHTML=`<div class="v13-wrap v13-page"><header class="v13-head"><div><span class="v13-kicker">UNIVERSAL INDEX</span><h1>Search everything.</h1></div><p>One query searches Babel knowledge, public web results, media, archives, papers, code, people, usernames, mathematical spaces, and tools.</p></header><div class="v13-search-sticky"><form class="v13-search" id="v13SearchForm"><input id="v13SearchQ" value="${esc(initial)}" autocomplete="off" placeholder="Word, person, username, website, file, image, question, calculation..."><button>Search</button></form><div class="v13-tabs" id="v13Tabs">${['All','Knowledge','Web','People','Media','Files','Research','Code','Futures','Tools'].map((x,i)=>`<button class="v13-tab${i===0?' active':''}" data-filter="${x.toLowerCase()}">${x}</button>`).join('')}</div></div><div id="v13SearchOut">${initial?'<div class="v13-loading">Building dossier...</div>':`${v13CalcBlock('sqrt(2)*500')}<div class="v13-empty">Search a subject or browse the index below.</div>${v13DefaultIndex()}`}</div></div>`;
  const filter=k=>{document.querySelectorAll('#v13SearchOut [data-kind]').forEach(x=>{const kinds=(x.dataset.kind||'').split(/\s+/);x.hidden=k!=='all'&&!kinds.includes(k)});document.querySelectorAll('#v13Tabs .v13-tab').forEach(x=>x.classList.toggle('active',x.dataset.filter===k))};document.querySelectorAll('#v13Tabs .v13-tab').forEach(x=>x.onclick=()=>filter(x.dataset.filter));
  const run=async q=>{if(!q)return;history.replaceState({},'',v9SearchRoute(q));setTitle(`Search: ${q}`);const out=document.querySelector('#v13SearchOut');out.innerHTML=`${v13CalcBlock(q)}<div class="v13-loading">Searching knowledge, web, media, archives, research, code, and public signals...</div>`;const local=v9CuratedMatches(q),systems=v9SystemMatches(q);const [dd,ww,mm,tt]=await Promise.allSettled([json(`/api/dossier?q=${encodeURIComponent(q)}`),json(`/api/websearch?q=${encodeURIComponent(q)}`),json(`/api/media-search?q=${encodeURIComponent(q)}`),json(`/api/trends?q=${encodeURIComponent(q)}`)]);const d=dd.status==='fulfilled'?dd.value:{query:q,media:[],papers:[],archives:[],projects:[],discussions:[],coverage:[],related:[],facts:[],recipes:[]};const web=ww.status==='fulfilled'?ww.value:{results:[]};const media=mm.status==='fulfilled'?mm.value:{items:d.media||[]};const trends=tt.status==='fulfilled'?tt.value:null;out.innerHTML=v13Dossier(q,d,web,media,trends,local,systems);v13Bind(out);v7BindNote(`search:${q}`);filter('all')};
  document.querySelector('#v13SearchForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v13SearchQ').value.trim();if(q)run(q)};if(initial)run(initial);v13Bind();
}

async function v13MediaPage(){
  const initial=new URLSearchParams(location.search).get('q')||'';setTitle('Media');app.innerHTML=`<div class="v13-wrap v13-page"><header class="v13-head"><div><span class="v13-kicker">UNIVERSAL MEDIA INDEX</span><h1>Media.</h1></div><p>Search public image, audio, video, document, software, and archive catalogs. Results render inside Babel where the source format permits it.</p></header><div class="v13-search-sticky"><form class="v13-search" id="v13MediaForm"><input id="v13MediaQ" value="${esc(initial)}" placeholder="Search images, audio, video, files"><button>Search</button></form></div><div id="v13MediaOut">${initial?'<div class="v13-loading">Searching media...</div>':'<div class="v13-empty">Try a person, place, artwork, song title, historical event, software name, or subject.</div>'}</div></div>`;
  const run=async q=>{history.replaceState({},'',`/media?q=${encodeURIComponent(q)}`);const out=document.querySelector('#v13MediaOut');out.innerHTML='<div class="v13-loading">Searching Wikimedia Commons, Openverse, and Internet Archive...</div>';try{const d=await json(`/api/media-search?q=${encodeURIComponent(q)}`);out.innerHTML=`<section class="v13-section"><div class="v13-section-head"><div><span>MEDIA INDEX</span><h2>${esc(q)}</h2></div><small>${d.count||0} results</small></div><div class="v13-media-grid">${(d.items||[]).map(v13MediaCard).join('')}</div></section>`;v13Bind(out)}catch(e){out.innerHTML=`<div class="v13-error">${esc(e.message)}</div>`}};
  document.querySelector('#v13MediaForm').onsubmit=e=>{e.preventDefault();const q=document.querySelector('#v13MediaQ').value.trim();if(q)run(q)};if(initial)run(initial)
}

function v13Convert(value,from,to){
  const tables={length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,ft:.3048,in:.0254,yd:.9144},mass:{kg:1,g:.001,lb:.45359237,oz:.028349523125},speed:{'m/s':1,'km/h':1/3.6,mph:.44704,knot:.514444},storage:{B:1,KB:1000,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1048576,GiB:1073741824}};
  if(from==='C'&&to==='F')return value*9/5+32;if(from==='F'&&to==='C')return (value-32)*5/9;if(from==='C'&&to==='K')return value+273.15;if(from==='K'&&to==='C')return value-273.15;if(from==='F'&&to==='K')return (value-32)*5/9+273.15;if(from==='K'&&to==='F')return (value-273.15)*9/5+32;
  for(const t of Object.values(tables))if(t[from]&&t[to])return value*t[from]/t[to];throw Error('Choose compatible units')
}
async function v13ToolsPage(){
  setTitle('Tools');app.innerHTML=`<div class="v13-wrap v13-page"><header class="v13-head"><div><span class="v13-kicker">TOOLS OF BABEL</span><h1>Calculate and transform.</h1></div><p>Useful local tools live beside the knowledge index so calculations and data transformations do not need another website.</p></header><div class="v13-tools">
    <section class="v13-tool" id="calculator"><h3>Scientific calculator</h3><div class="v13-calc-row"><input id="v13CalcInput" placeholder="sqrt(2) * 500 + 10^3"><button id="v13CalcGo">Calculate</button></div><div class="v13-tool-output" id="v13CalcOut">Supports + - * / % ^, parentheses, pi, e, sqrt, sin, cos, tan, log, ln, abs, floor, ceil, round.</div></section>
    <section class="v13-tool" id="convert"><h3>Unit converter</h3><div class="v13-calc-row"><input id="v13ConvertValue" type="number" value="1" step="any"><button id="v13ConvertGo">Convert</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><select id="v13From">${['m','km','cm','mm','mi','ft','in','yd','kg','g','lb','oz','m/s','km/h','mph','knot','B','KB','MB','GB','TB','KiB','MiB','GiB','C','F','K'].map(x=>`<option>${x}</option>`).join('')}</select><select id="v13To">${['km','m','cm','mm','mi','ft','in','yd','kg','g','lb','oz','km/h','m/s','mph','knot','KB','B','MB','GB','TB','KiB','MiB','GiB','F','C','K'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="v13-tool-output" id="v13ConvertOut"></div></section>
    <section class="v13-tool"><h3>Number bases</h3><input id="v13BaseInput" value="255" placeholder="Integer"><div class="v13-tool-output" id="v13BaseOut"></div></section>
    <section class="v13-tool" id="text"><h3>Text + JSON</h3><textarea id="v13TextInput" placeholder="Paste text or JSON"></textarea><div class="v13-shortcuts"><button class="v13-chip" id="v13JsonPretty">Pretty JSON</button><button class="v13-chip" id="v13UrlEncode">URL encode</button><button class="v13-chip" id="v13UrlDecode">URL decode</button><button class="v13-chip" id="v13Sha">SHA-256</button></div><div class="v13-tool-output" id="v13TextOut"></div></section>
  </div></div>`;
  const calc=()=>{const s=document.querySelector('#v13CalcInput').value;const c=v13TryCalc(s);document.querySelector('#v13CalcOut').textContent=c?.ok?`${v13FormatNumber(c.value)}\n${s}`:(c?.error||'Enter an expression')};document.querySelector('#v13CalcGo').onclick=calc;document.querySelector('#v13CalcInput').onkeydown=e=>{if(e.key==='Enter')calc()};
  document.querySelector('#v13ConvertGo').onclick=()=>{try{const v=Number(document.querySelector('#v13ConvertValue').value),f=document.querySelector('#v13From').value,t=document.querySelector('#v13To').value,r=v13Convert(v,f,t);document.querySelector('#v13ConvertOut').textContent=`${v} ${f} = ${v13FormatNumber(r)} ${t}`}catch(e){document.querySelector('#v13ConvertOut').textContent=e.message}};
  const bases=()=>{const raw=document.querySelector('#v13BaseInput').value.trim();try{const n=BigInt(raw);document.querySelector('#v13BaseOut').textContent=`binary  ${n.toString(2)}\noctal   ${n.toString(8)}\ndecimal ${n.toString(10)}\nhex     ${n.toString(16).toUpperCase()}\nbase36  ${n.toString(36).toUpperCase()}`}catch{document.querySelector('#v13BaseOut').textContent='Enter an integer.'}};document.querySelector('#v13BaseInput').oninput=bases;bases();
  const ti=document.querySelector('#v13TextInput'),to=document.querySelector('#v13TextOut');document.querySelector('#v13JsonPretty').onclick=()=>{try{to.textContent=JSON.stringify(JSON.parse(ti.value),null,2)}catch(e){to.textContent=e.message}};document.querySelector('#v13UrlEncode').onclick=()=>to.textContent=encodeURIComponent(ti.value);document.querySelector('#v13UrlDecode').onclick=()=>{try{to.textContent=decodeURIComponent(ti.value)}catch(e){to.textContent=e.message}};document.querySelector('#v13Sha').onclick=async()=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ti.value));to.textContent=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
}

function v13ExplorePage(){setTitle('Explore');app.innerHTML=`<div class="v13-wrap v13-page"><header class="v13-head"><div><span class="v13-kicker">BABEL DIRECTORY</span><h1>Explore.</h1></div><p>Browse the site without knowing what to search for. Every section can branch back into the universal index.</p></header>${v13DefaultIndex()}<section class="v13-section"><div class="v13-section-head"><div><span>DISCOVERY</span><h2>Start somewhere unexpected</h2></div></div><div class="v13-shortcuts">${['cryptography','Mongolian language','fermentation','black holes','Roman concrete','memory palace','web archaeology','cryptids','COBOL','quantum teleportation','sourdough microbiology','country flags','game engines','astral projection','chess openings','Unicode'].map(x=>v13SearchChip(x)).join('')}</div></section></div>`;v13Bind()}

const v13OldSystems=systemsPage;
systemsPage=function(){v13OldSystems();const page=document.querySelector('.page,.v12-page');if(page){page.classList.add('v13-wrap');const h=page.querySelector('h1');if(h)h.style.fontFamily='Arial,sans-serif'}};

renderRoute=async function(){
  v13InstallShell();window.scrollTo(0,0);const p=location.pathname;document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p));
  if(p==='/')return universeHome();if(p==='/search')return v13SearchPage();if(p==='/explore')return v13ExplorePage();if(p==='/media')return v13MediaPage();if(p==='/tools')return v13ToolsPage();if(p==='/network')return v12NetworkPage();if(p==='/web')return v12WebPage();if(p==='/people')return v12PeoplePage();if(p==='/browser')return v12BrowserPage();if(p==='/arcade')return v12ArcadePage();if(p==='/rules')return v12RulesPage();
  return v12OldRender();
};

setTimeout(()=>{try{v13InstallShell();renderRoute()}catch(e){console.error('v13 render failed',e)}},0);
