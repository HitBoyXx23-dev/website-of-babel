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
    const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':'WebsiteOfBabel/16.0',Accept:'application/json',...headers}});
    if(!r.ok)throw new Error(String(r.status));
    return await r.json();
  }finally{clearTimeout(t)}
}
function clean(s=''){return String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/\s+/g,' ').trim()}
function isYouTube(value=''){return /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(String(value))}
function safeItem(x){
  if(!x)return null;
  const refs=[x.url,x.original,x.sourceUrl,x.embed,x.thumbnail].filter(Boolean);
  if(refs.some(isYouTube))return null;
  return x;
}
function uniq(rows){const seen=new Set();return rows.map(safeItem).filter(Boolean).filter(x=>{const k=x.original||x.embed||x.sourceUrl||x.url||x.title;if(!k||seen.has(k))return false;seen.add(k);return true})}

async function commons(q){
  try{
    const d=await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=45&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=1400&format=json&origin=*`);
    return Object.values(d.query?.pages||{}).map(x=>{const i=x.imageinfo?.[0];if(!i)return null;const mime=i.mime||'';const type=mime.startsWith('image/')?'image':mime.startsWith('audio/')?'audio':mime.startsWith('video/')?'video':'file';return {type,title:clean(i.extmetadata?.ObjectName?.value||x.title||'Media').replace(/^File:/,''),url:i.thumburl||i.url,thumbnail:i.thumburl||'',original:i.url,sourceUrl:i.descriptionurl||i.url,source:'Wikimedia Commons',license:clean(i.extmetadata?.LicenseShortName?.value||''),creator:clean(i.extmetadata?.Artist?.value||''),mime};}).filter(Boolean);
  }catch{return []}
}
async function openverse(q,kind){
  try{
    const endpoint=kind==='audio'?'audio':'images';
    const d=await getJSON(`https://api.openverse.org/v1/${endpoint}/?q=${encodeURIComponent(q)}&page_size=30`,7500);
    return (d.results||[]).map(x=>({type:kind,title:x.title||'Untitled',url:kind==='audio'?(x.url||x.audio_set?.frontend_url):(x.thumbnail||x.url),thumbnail:kind==='image'?(x.thumbnail||x.url):'',original:x.url||'',sourceUrl:x.foreign_landing_url||x.detail_url||x.url||'',source:'Openverse',license:[x.license,x.license_version].filter(Boolean).join(' '),creator:x.creator||'',provider:x.provider||''}));
  }catch{return []}
}
async function archive(q){
  try{
    const query=`(${q}) AND (mediatype:(movies OR audio OR texts OR software OR image))`;
    const d=await getJSON(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year&fl[]=mediatype&fl[]=creator&rows=45&page=1&output=json`,9000);
    return (d.response?.docs||[]).map(x=>({type:x.mediatype==='movies'?'video':x.mediatype==='audio'?'audio':x.mediatype==='texts'?'document':x.mediatype==='software'?'software':x.mediatype==='image'?'image':'file',title:x.title||x.identifier,url:`https://archive.org/download/${encodeURIComponent(x.identifier)}/__ia_thumb.jpg`,thumbnail:`https://archive.org/download/${encodeURIComponent(x.identifier)}/__ia_thumb.jpg`,sourceUrl:`https://archive.org/details/${encodeURIComponent(x.identifier)}`,embed:(x.mediatype==='movies'||x.mediatype==='audio')?`https://archive.org/embed/${encodeURIComponent(x.identifier)}`:'',identifier:x.identifier,source:'Internet Archive',year:x.year||null,creator:Array.isArray(x.creator)?x.creator.join(', '):(x.creator||''),description:clean(Array.isArray(x.description)?x.description[0]:x.description||'').slice(0,500)}));
  }catch{return []}
}
async function nasa(q){
  try{
    const d=await getJSON(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image,video,audio&page_size=35`,9000);
    return (d.collection?.items||[]).map(item=>{const meta=item.data?.[0]||{},type=meta.media_type||'file',preview=(item.links||[]).find(x=>x.rel==='preview')?.href||(item.links||[])[0]?.href||'';return {type,title:meta.title||'NASA media',url:preview,thumbnail:preview,original:'',sourceUrl:meta.nasa_id?`https://images.nasa.gov/details-${encodeURIComponent(meta.nasa_id)}`:'https://images.nasa.gov/',source:'NASA Image and Video Library',creator:meta.photographer||meta.secondary_creator||'',year:meta.date_created?String(meta.date_created).slice(0,4):'',description:clean(meta.description||meta.description_508||'').slice(0,500),nasaId:meta.nasa_id||'',manifest:item.href||''};}).filter(x=>x.url||x.sourceUrl);
  }catch{return []}
}
async function peertube(q){
  try{
    const d=await getJSON(`https://sepiasearch.org/api/v1/search/videos?search=${encodeURIComponent(q)}&count=25&sort=-match`,9000);
    return (d.data||[]).map(x=>{const page=x.url||x.videoUrl||'';let embed=x.embedUrl||'';if(!embed&&page&&x.uuid){try{const u=new URL(page);embed=`${u.origin}/videos/embed/${x.uuid}`}catch{}}
      return {type:'video',title:x.name||x.title||'PeerTube video',url:x.thumbnailUrl||x.thumbnailPath||'',thumbnail:x.thumbnailUrl||x.thumbnailPath||'',embed,sourceUrl:page,source:'PeerTube / Sepia Search',creator:x.accountDisplayName||x.channelDisplayName||x.account?.displayName||'',description:clean(x.description||'').slice(0,500),duration:x.duration||null};
    }).filter(x=>x.sourceUrl||x.embed);
  }catch{return []}
}

module.exports=async(req,res)=>{
  const q=String(req.query?.q||'').trim().slice(0,180);
  if(!q)return send(res,400,{error:'Missing media query.'},'no-store');
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();
  if(!(await store.rateLimit(`media:${ip}`,40)))return send(res,429,{error:'Too many media searches. Try again shortly.'},'no-store');
  const providers=['Wikimedia Commons','Openverse','Internet Archive','NASA Image and Video Library','PeerTube / Sepia Search'];
  const [cm,ovImages,ovAudio,ia,na,pt]=await Promise.all([commons(q),openverse(q,'image'),openverse(q,'audio'),archive(q),nasa(q),peertube(q)]);
  const items=uniq([...cm,...ovImages,...ovAudio,...ia,...na,...pt]).slice(0,180);
  const counts=items.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{});
  return send(res,200,{query:q,count:items.length,counts,providers,items,note:'Babel combines public media catalogs and excludes YouTube links. License and provenance stay attached to each source record.'});
};
