const store=require('../store');

function send(res,status,data,cache='s-maxage=600, stale-while-revalidate=3600'){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control',cache);
  res.end(JSON.stringify(data));
}
async function getJSON(url,ms=8000,headers={}){
  const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);
  try{
    const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':'WebsiteOfBabel/13.0',...headers}});
    if(!r.ok)throw new Error(String(r.status));
    return await r.json();
  }finally{clearTimeout(t)}
}
function clean(s=''){return String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/\s+/g,' ').trim()}
function uniq(rows){const seen=new Set();return rows.filter(x=>{const k=x.url||x.sourceUrl||x.title;if(!k||seen.has(k))return false;seen.add(k);return true})}

async function commons(q){
  try{
    const d=await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=36&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=1200&format=json&origin=*`);
    return Object.values(d.query?.pages||{}).map(x=>{const i=x.imageinfo?.[0];if(!i)return null;const mime=i.mime||'';const type=mime.startsWith('image/')?'image':mime.startsWith('audio/')?'audio':mime.startsWith('video/')?'video':'file';return {type,title:clean(i.extmetadata?.ObjectName?.value||x.title||'Media').replace(/^File:/,''),url:i.thumburl||i.url,original:i.url,sourceUrl:i.descriptionurl||i.url,source:'Wikimedia Commons',license:clean(i.extmetadata?.LicenseShortName?.value||''),creator:clean(i.extmetadata?.Artist?.value||'')};}).filter(Boolean);
  }catch{return []}
}
async function openverse(q,kind){
  try{
    const endpoint=kind==='audio'?'audio':'images';
    const d=await getJSON(`https://api.openverse.org/v1/${endpoint}/?q=${encodeURIComponent(q)}&page_size=20`,7000);
    return (d.results||[]).map(x=>({type:kind,title:x.title||'Untitled',url:kind==='audio'?(x.url||x.audio_set?.frontend_url):(x.thumbnail||x.url),original:x.url||'',sourceUrl:x.foreign_landing_url||x.detail_url||x.url||'',source:'Openverse',license:[x.license,x.license_version].filter(Boolean).join(' '),creator:x.creator||'',provider:x.provider||''}));
  }catch{return []}
}
async function archive(q){
  try{
    const query=`(${q}) AND (mediatype:(movies OR audio OR texts OR software OR image))`;
    const d=await getJSON(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year&fl[]=mediatype&fl[]=creator&rows=30&page=1&output=json`,8000);
    return (d.response?.docs||[]).map(x=>({type:x.mediatype==='movies'?'video':x.mediatype==='audio'?'audio':x.mediatype==='texts'?'document':x.mediatype==='software'?'software':'file',title:x.title||x.identifier,url:`https://archive.org/download/${encodeURIComponent(x.identifier)}/__ia_thumb.jpg`,sourceUrl:`https://archive.org/details/${encodeURIComponent(x.identifier)}`,embed:`https://archive.org/embed/${encodeURIComponent(x.identifier)}`,identifier:x.identifier,source:'Internet Archive',year:x.year||null,creator:Array.isArray(x.creator)?x.creator.join(', '):(x.creator||''),description:clean(Array.isArray(x.description)?x.description[0]:x.description||'').slice(0,500)}));
  }catch{return []}
}

module.exports=async(req,res)=>{
  const q=String(req.query?.q||'').trim().slice(0,180);
  if(!q)return send(res,400,{error:'Missing media query.'},'no-store');
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();
  if(!(await store.rateLimit(`media:${ip}`,40)))return send(res,429,{error:'Too many media searches. Try again shortly.'},'no-store');
  const [cm,ovImages,ovAudio,ia]=await Promise.all([commons(q),openverse(q,'image'),openverse(q,'audio'),archive(q)]);
  const items=uniq([...cm,...ovImages,...ovAudio,...ia]).slice(0,100);
  const counts=items.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{});
  return send(res,200,{query:q,count:items.length,counts,items,note:'Media is indexed from public catalogs. Copyright and license terms remain attached to the original source records.'});
};
