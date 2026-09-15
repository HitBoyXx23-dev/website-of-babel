const dns=require('dns').promises;
const net=require('net');

function privateIP(ip){
  if(net.isIP(ip)===4){
    const a=ip.split('.').map(Number);
    return a[0]===10||a[0]===127||a[0]===0||(a[0]===169&&a[1]===254)||(a[0]===172&&a[1]>=16&&a[1]<=31)||(a[0]===192&&a[1]===168)||(a[0]>=224);
  }
  if(net.isIP(ip)===6){const x=ip.toLowerCase();return x==='::1'||x==='::'||x.startsWith('fc')||x.startsWith('fd')||x.startsWith('fe80:')}
  return true;
}
async function validatePublicURL(raw){
  let u;try{u=new URL(raw)}catch{throw new Error('Invalid URL.')}
  if(!['http:','https:'].includes(u.protocol))throw new Error('Only public HTTP(S) URLs are supported.');
  if(u.hostname.endsWith('.onion'))throw new Error('.onion addresses are not crawled by the Vercel web crawler.');
  if(['localhost','localhost.localdomain'].includes(u.hostname.toLowerCase()))throw new Error('Local addresses are blocked.');
  if(net.isIP(u.hostname)){if(privateIP(u.hostname))throw new Error('Private/local addresses are blocked.')}else{
    const rows=await dns.lookup(u.hostname,{all:true,verbatim:true});
    if(!rows.length||rows.some(r=>privateIP(r.address)))throw new Error('Host resolves to a private or unsupported address.');
  }
  u.username='';u.password='';u.hash='';return u;
}
function decodeEntities(s=''){return String(s).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/&#(\d+);/g,(_,n)=>{try{return String.fromCodePoint(Number(n))}catch{return''}})}
function clean(s=''){return decodeEntities(String(s).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}
function attr(tag,name){const m=String(tag).match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`,'i'));return m?decodeEntities(m[1]):''}
function canonicalHost(h=''){return String(h).toLowerCase().replace(/^www\./,'')}
function sameSite(a,b){return canonicalHost(a)===canonicalHost(b)}
function normalizeURL(value,base){
  try{
    const u=new URL(value,base);
    if(!['http:','https:'].includes(u.protocol))return'';
    u.username='';u.password='';u.hash='';
    if((u.protocol==='https:'&&u.port==='443')||(u.protocol==='http:'&&u.port==='80'))u.port='';
    // Tracking parameters create fake graph duplicates.
    for(const k of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid|mc_cid|mc_eid)$/i.test(k))u.searchParams.delete(k);
    return u.href;
  }catch{return''}
}
function pageMeta(html,url){
  const u=new URL(url);
  const title=clean((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||u.pathname.split('/').filter(Boolean).pop()||u.hostname).slice(0,220);
  const metas=html.match(/<meta\b[^>]*>/gi)||[];let description='';
  for(const tag of metas){const name=(attr(tag,'name')||attr(tag,'property')).toLowerCase();if(name==='description'||name==='og:description'){description=clean(attr(tag,'content')).slice(0,420);if(description)break}}
  return {title,description};
}
function extractLinks(html,base){
  const out=[];const re=/<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let m;
  while((m=re.exec(html))&&out.length<1200){
    const url=normalizeURL(m[1],base);if(!url)continue;
    const text=clean(m[2]).slice(0,180);
    out.push({url,text});
  }
  const seen=new Set();return out.filter(x=>{const k=x.url.replace(/\/$/,'');if(seen.has(k))return false;seen.add(k);return true});
}
async function fetchHTML(start,{timeout=6500,maxBytes=2200000,userAgent='WebsiteOfBabelCrawler/21.0'}={}){
  let current=await validatePublicURL(start);
  for(let i=0;i<4;i++){
    const c=new AbortController();const t=setTimeout(()=>c.abort(),timeout);let r;
    try{r=await fetch(current,{redirect:'manual',signal:c.signal,headers:{'User-Agent':userAgent,'Accept':'text/html,application/xhtml+xml;q=0.9,*/*;q=0.2','Accept-Language':'en-US,en;q=0.8'}})}finally{clearTimeout(t)}
    if(r.status>=300&&r.status<400&&r.headers.get('location')){current=await validatePublicURL(new URL(r.headers.get('location'),current).href);continue}
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const type=(r.headers.get('content-type')||'').toLowerCase();if(!type.includes('text/html')&&!type.includes('application/xhtml+xml'))throw new Error('Not an HTML page.');
    const declared=Number(r.headers.get('content-length')||0);if(declared>maxBytes)throw new Error('Page is too large to crawl.');
    const buf=await r.arrayBuffer();if(buf.byteLength>maxBytes)throw new Error('Page is too large to crawl.');
    return {url:current.href,html:new TextDecoder().decode(buf)};
  }
  throw new Error('Too many redirects.');
}
async function sitemapURLs(root,max=100){
  const base=new URL(root);const candidates=[new URL('/sitemap.xml',base).href,new URL('/sitemap_index.xml',base).href];const urls=[];
  for(const candidate of candidates){
    try{
      const u=await validatePublicURL(candidate);const c=new AbortController();const t=setTimeout(()=>c.abort(),3500);let r;
      try{r=await fetch(u,{signal:c.signal,headers:{'User-Agent':'WebsiteOfBabelCrawler/21.0','Accept':'application/xml,text/xml,*/*;q=0.2'}})}finally{clearTimeout(t)}
      if(!r.ok)continue;const text=await r.text();let m;const re=/<loc>\s*([^<]+)\s*<\/loc>/gi;
      while((m=re.exec(text))&&urls.length<max){const href=normalizeURL(decodeEntities(m[1]),base);if(href&&sameSite(new URL(href).hostname,base.hostname))urls.push(href)}
    }catch{}
  }
  return [...new Set(urls)].slice(0,max);
}
async function crawlSite(start,{depth=2,maxPages=30,maxNodes=180,maxEdges=260,includeSitemap=true}={}){
  const initial=await validatePublicURL(start);const rootHost=initial.hostname;
  const queue=[{url:initial.href,depth:0,via:''}];
  if(includeSitemap){for(const u of await sitemapURLs(initial.href,Math.min(80,maxPages*3)))queue.push({url:u,depth:Math.min(1,depth),via:'sitemap'})}
  const visited=new Set(),nodes=new Map(),edges=[],flatLinks=new Map(),pages=[];
  while(queue.length&&visited.size<maxPages){
    const job=queue.shift();const key=job.url.replace(/\/$/,'');if(visited.has(key))continue;visited.add(key);
    let page;try{page=await fetchHTML(job.url)}catch{continue}
    const url=normalizeURL(page.url,page.url);const meta=pageMeta(page.html,url);const pageURL=new URL(url);
    const pageNode={url,title:meta.title||pageURL.pathname||pageURL.hostname,description:meta.description,host:pageURL.hostname,path:pageURL.pathname||'/',sameSite:sameSite(pageURL.hostname,rootHost),depth:job.depth,type:'page'};
    nodes.set(url,pageNode);pages.push(pageNode);
    const links=extractLinks(page.html,url);
    for(const link of links){
      if(edges.length>=maxEdges||nodes.size>=maxNodes)break;
      const target=normalizeURL(link.url,url);if(!target)continue;const tu=new URL(target),internal=sameSite(tu.hostname,rootHost);
      const targetNode=nodes.get(target)||{url:target,title:link.text||tu.pathname.split('/').filter(Boolean).pop()||tu.hostname,description:'',host:tu.hostname,path:tu.pathname||'/',sameSite:internal,depth:job.depth+1,type:internal?'page':'external'};
      if(!nodes.has(target))nodes.set(target,targetNode);
      if(!flatLinks.has(target))flatLinks.set(target,{...targetNode,text:link.text,via:url});
      edges.push({from:url,to:target,internal});
      if(internal&&job.depth<depth&&!visited.has(target.replace(/\/$/,'')))queue.push({url:target,depth:job.depth+1,via:url});
    }
  }
  const root=pages[0]||{url:initial.href,title:initial.hostname,description:'',host:initial.hostname,path:initial.pathname||'/',sameSite:true,depth:0,type:'page'};
  return {root,pages,nodes:[...nodes.values()].slice(0,maxNodes),edges:edges.slice(0,maxEdges),links:[...flatLinks.values()].slice(0,maxNodes)};
}
function queryToURL(q){
  const s=String(q||'').trim();if(!s)return'';
  try{if(/^https?:\/\//i.test(s))return new URL(s).href}catch{}
  // A domain, optionally followed by a path. Avoid treating ordinary dotted prose as a host.
  if(/^(?:[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(s))return `https://${s}`;
  return'';
}
module.exports={privateIP,validatePublicURL,clean,attr,canonicalHost,sameSite,normalizeURL,pageMeta,extractLinks,fetchHTML,sitemapURLs,crawlSite,queryToURL};
