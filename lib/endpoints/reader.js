const dns=require('dns').promises;
const net=require('net');
const store=require('../store');

function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');res.end(JSON.stringify(data))}
function privateIP(ip){
  if(net.isIP(ip)===4){const a=ip.split('.').map(Number);return a[0]===10||a[0]===127||a[0]===0||(a[0]===169&&a[1]===254)||(a[0]===172&&a[1]>=16&&a[1]<=31)||(a[0]===192&&a[1]===168)||(a[0]>=224)}
  if(net.isIP(ip)===6){const x=ip.toLowerCase();return x==='::1'||x==='::'||x.startsWith('fc')||x.startsWith('fd')||x.startsWith('fe80:')}
  return true;
}
async function validate(raw){
  let u;try{u=new URL(raw)}catch{throw new Error('Enter a complete public http or https URL.')}
  if(!['http:','https:'].includes(u.protocol))throw new Error('Only http and https URLs are supported.');
  if(u.hostname.endsWith('.onion'))throw new Error('.onion pages require a separately configured Tor index and cannot be fetched by the Vercel reader.');
  if(['localhost','localhost.localdomain'].includes(u.hostname.toLowerCase()))throw new Error('Local addresses are blocked.');
  if(net.isIP(u.hostname)){if(privateIP(u.hostname))throw new Error('Private and local network addresses are blocked.')}else{
    const rows=await dns.lookup(u.hostname,{all:true,verbatim:true});
    if(!rows.length||rows.some(r=>privateIP(r.address)))throw new Error('That host resolves to a private or unsupported address.');
  }
  u.username='';u.password='';u.hash='';return u;
}
function decodeEntities(s=''){return String(s).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/&#(\d+);/g,(_,n)=>{try{return String.fromCodePoint(Number(n))}catch{return''}})}
function clean(s=''){return decodeEntities(String(s).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}
function attr(tag,name){const m=String(tag).match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`,'i'));return m?decodeEntities(m[1]):''}
function meta(html,key){const tags=html.match(/<meta\b[^>]*>/gi)||[];for(const t of tags){const n=(attr(t,'name')||attr(t,'property')).toLowerCase();if(n===key.toLowerCase())return attr(t,'content')}return''}
function absolute(value,base){try{const u=new URL(value,base);if(!['http:','https:'].includes(u.protocol))return'';u.hash='';return u.href}catch{return''}}
async function fetchPage(start){
  let current=await validate(start);
  for(let i=0;i<4;i++){
    const c=new AbortController();const t=setTimeout(()=>c.abort(),8000);let r;
    try{r=await fetch(current,{redirect:'manual',signal:c.signal,headers:{'User-Agent':'WebsiteOfBabelReader/10.0','Accept':'text/html,text/plain,application/xhtml+xml;q=0.9,*/*;q=0.2'}})}finally{clearTimeout(t)}
    if(r.status>=300&&r.status<400&&r.headers.get('location')){current=await validate(new URL(r.headers.get('location'),current).href);continue}
    if(!r.ok)throw new Error(`Page returned HTTP ${r.status}.`);
    const type=(r.headers.get('content-type')||'').toLowerCase();const length=Number(r.headers.get('content-length')||0);
    if(length>5000000)throw new Error('This resource is too large for the on-demand Babel Reader preview.');
    if(!type.includes('text/html')&&!type.includes('application/xhtml+xml')&&!type.includes('text/plain')){
      return {url:current.href,type,resource:true,length:length||null};
    }
    const buf=await r.arrayBuffer();if(buf.byteLength>5000000)throw new Error('This page is too large for the on-demand Babel Reader preview.');
    return {url:current.href,type,html:new TextDecoder().decode(buf),resource:false,length:buf.byteLength};
  }
  throw new Error('Too many redirects.');
}
function extractSections(html){
  const body=(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)||[])[1]||html;
  const stripped=body.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi,' ').replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi,' ').replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi,' ').replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi,' ');
  const blocks=[];const re=/<(h1|h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;let m;
  while((m=re.exec(stripped))&&blocks.length<180){const text=clean(m[2]);if(text.length<24)continue;blocks.push({kind:m[1].toLowerCase().startsWith('h')?'heading':'text',text:text.slice(0,900)})}
  const sections=[];let current={title:'Overview',body:[]};
  for(const b of blocks){if(b.kind==='heading'){if(current.body.length)sections.push(current);current={title:b.text.slice(0,160),body:[]};if(sections.length>=30)break}else if(current.body.join(' ').length<3200)current.body.push(b.text)}
  if(current.body.length&&sections.length<30)sections.push(current);
  return sections.map(s=>({title:s.title,text:s.body.join(' ').slice(0,3200)})).filter(s=>s.text);
}
function extractMedia(html,base){
  const images=[];const videos=[];const audio=[];const files=[];let m;
  const blocked=u=>/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(String(u||''));
  const imgRe=/<img\b[^>]*>/gi;while((m=imgRe.exec(html))&&images.length<45){const tag=m[0],src=absolute(attr(tag,'src')||attr(tag,'data-src')||attr(tag,'data-lazy-src'),base);if(!src||blocked(src))continue;const alt=clean(attr(tag,'alt')).slice(0,180);if(/sprite|logo|icon|avatar/i.test(src)&&!alt)continue;images.push({url:src,alt})}
  for(const key of ['og:image','twitter:image']){const u=absolute(meta(html,key),base);if(u&&!blocked(u))images.unshift({url:u,alt:''})}
  const vidRe=/<(?:video|source|iframe)\b[^>]*>/gi;while((m=vidRe.exec(html))&&videos.length<35){const tag=m[0],src=absolute(attr(tag,'src'),base);if(!src||blocked(src))continue;if(/vimeo\.com|archive\.org|peertube|\.mp4(?:\?|$)|\.webm(?:\?|$)|\.ogv(?:\?|$)|\.m3u8(?:\?|$)/i.test(src))videos.push({url:src})}
  for(const key of ['og:video','og:video:url','og:video:secure_url']){const u=absolute(meta(html,key),base);if(u&&!blocked(u))videos.unshift({url:u})}
  const audioRe=/<(?:audio|source)\b[^>]*>/gi;while((m=audioRe.exec(html))&&audio.length<25){const src=absolute(attr(m[0],'src'),base);if(src&&!blocked(src)&&/\.mp3(?:\?|$)|\.ogg(?:\?|$)|\.wav(?:\?|$)|\.flac(?:\?|$)|\.m4a(?:\?|$)|archive\.org/i.test(src))audio.push({url:src})}
  for(const key of ['og:audio','og:audio:url','og:audio:secure_url']){const u=absolute(meta(html,key),base);if(u&&!blocked(u))audio.unshift({url:u})}
  const linkRe=/<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>/gi;while((m=linkRe.exec(html))&&files.length<60){const u=absolute(m[1],base);if(!u||blocked(u))continue;if(/\.(pdf|epub|zip|7z|rar|tar|gz|csv|json|xml|txt|md|docx?|xlsx?|pptx?|odt|ods)(?:\?|$)/i.test(u))files.push({url:u,type:(u.match(/\.([a-z0-9]+)(?:\?|$)/i)||[])[1]||'file'})}
  const unique=a=>[...new Map(a.map(x=>[x.url,x])).values()];
  return {images:unique(images).slice(0,30),videos:unique(videos).slice(0,20),audio:unique(audio).slice(0,15),files:unique(files).slice(0,40)};
}
function extractLinks(html,base){const out=[];const re=/<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let m;while((m=re.exec(html))&&out.length<500){const url=absolute(m[1],base);if(!url)continue;out.push({url,host:new URL(url).hostname.replace(/^www\./,''),text:clean(m[2]).slice(0,140)})}return [...new Map(out.map(x=>[x.url,x])).values()].slice(0,150)}

module.exports=async(req,res)=>{
  const raw=String(req.query?.url||'').trim().slice(0,3200);if(!raw)return send(res,400,{error:'Missing URL.'});
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();if(!(await store.rateLimit(`reader:${ip}`,160)))return send(res,429,{error:'Too many reader requests. Try again shortly.'});
  try{
    const page=await fetchPage(raw);const u=new URL(page.url);
    if(page.resource)return send(res,200,{url:page.url,host:u.hostname.replace(/^www\./,''),resource:true,contentType:page.type,size:page.length,title:u.pathname.split('/').filter(Boolean).pop()||u.hostname,description:'This public resource is indexed by Babel, but the on-demand reader does not copy large or non-HTML files. Use its metadata and connected source systems instead.',sections:[],images:[],videos:[],audio:[],files:[],links:[]});
    const html=page.html;const title=clean((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||u.hostname).slice(0,220);
    const description=clean(meta(html,'description')||meta(html,'og:description')).slice(0,700);
    const media=extractMedia(html,page.url);const links=extractLinks(html,page.url);
    return send(res,200,{url:page.url,host:u.hostname.replace(/^www\./,''),resource:false,contentType:page.type,size:page.length,title,description,sections:extractSections(html),images:media.images,videos:media.videos,audio:media.audio,files:media.files,links,generatedAt:new Date().toISOString(),note:'Babel Reader is an on-demand normalized preview. It does not claim to mirror or permanently store the source page.'});
  }catch(e){return send(res,400,{error:String(e.message||e)})}
};
