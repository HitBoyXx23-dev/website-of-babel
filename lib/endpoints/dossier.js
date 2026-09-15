const store=require('../store');

function send(res,status,data){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
  res.end(JSON.stringify(data));
}
async function getJSON(url,ms=8000,headers={}){
  const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);
  try{
    const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':'WebsiteOfBabel/10.0 (public research dossier)',...headers}});
    if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);
    return await r.json();
  }finally{clearTimeout(t)}
}
function clean(s=''){return String(s).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/\s+/g,' ').trim()}
function paragraphs(s=''){
  return String(s).split(/\n{2,}|\r\n\r\n/).map(clean).filter(x=>x.length>35).slice(0,40).map(x=>x.slice(0,2400));
}
function uniq(rows,key='url'){
  const seen=new Set();return rows.filter(x=>{const k=x?.[key]||x?.title;if(!k||seen.has(k))return false;seen.add(k);return true});
}
function safeLabel(v){return clean(v||'').slice(0,260)}
function wikiUrl(title){return `https://en.wikipedia.org/wiki/${encodeURIComponent(String(title||'').replace(/ /g,'_'))}`}

const PROP_ALLOW=['P31','P279','P361','P17','P19','P20','P106','P108','P69','P571','P577','P580','P582','P50','P170','P495','P136','P1412','P569','P570','P856','P2048','P2044','P2046','P2047','P2049','P2050','P2067'];
function claimRaw(claim){
  const snak=claim?.mainsnak?.datavalue;if(!snak)return null;const v=snak.value;
  if(snak.type==='wikibase-entityid')return {type:'entity',value:v?.id||null};
  if(snak.type==='time')return {type:'time',value:String(v?.time||'').replace(/^\+/,'').replace(/T00:00:00Z$/,'')};
  if(snak.type==='quantity')return {type:'quantity',value:v?.amount?String(v.amount).replace(/^\+/,''):null,unit:v?.unit||null};
  if(snak.type==='monolingualtext')return {type:'text',value:v?.text||null};
  if(snak.type==='string'||snak.type==='url'||snak.type==='external-id')return {type:snak.type,value:String(v||'')};
  return null;
}

async function wikipedia(q,notes){
  try{
    const enc=encodeURIComponent(q);
    const search=await getJSON(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${enc}&srlimit=8&utf8=1&format=json&origin=*`);
    const hits=search.query?.search||[];if(!hits.length)return {match:null,related:[]};
    const exact=hits.find(x=>x.title.toLowerCase()===q.toLowerCase());const picked=exact||hits[0];
    const title=picked.title;
    const page=await getJSON(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts%7Cpageimages%7Ccategories%7Clinks%7Cinfo&titles=${encodeURIComponent(title)}&explaintext=1&exsectionformat=plain&piprop=thumbnail&pithumbsize=1200&cllimit=50&pllimit=80&inprop=url&format=json&origin=*`);
    const p=Object.values(page.query?.pages||{})[0]||{};
    const extract=String(p.extract||'');
    return {
      match:{title:p.title||title,url:p.fullurl||wikiUrl(title),summary:paragraphs(extract)[0]||clean(picked.snippet||''),paragraphs:paragraphs(extract),image:p.thumbnail?.source||null,categories:(p.categories||[]).map(x=>String(x.title||'').replace(/^Category:/,'')).slice(0,30),links:(p.links||[]).map(x=>x.title).filter(Boolean).slice(0,70)},
      related:hits.filter(x=>x.title!==title).map(x=>({title:x.title,snippet:clean(x.snippet),url:wikiUrl(x.title)})).slice(0,7)
    };
  }catch(e){notes.push('Wikipedia dossier unavailable');return {match:null,related:[]}}
}

async function wiktionary(q,notes){
  try{
    const d=await getJSON(`https://en.wiktionary.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=4&prop=extracts&explaintext=1&exintro=1&format=json&origin=*`);
    return Object.values(d.query?.pages||{}).map(x=>({title:x.title,definition:clean(x.extract||'').slice(0,1800),url:`https://en.wiktionary.org/wiki/${encodeURIComponent(x.title.replace(/ /g,'_'))}`})).filter(x=>x.definition).slice(0,4);
  }catch(e){notes.push('Wiktionary unavailable');return []}
}

async function wikidata(q,notes){
  try{
    const s=await getJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&uselang=en&limit=3&format=json&origin=*`);
    const top=s.search?.[0];if(!top)return {entity:null,facts:[]};
    const id=top.id;
    const d=await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(id)}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks&languages=en&format=json&origin=*`);
    const ent=d.entities?.[id];if(!ent)return {entity:null,facts:[]};
    const raw=[];const entityIds=new Set();
    for(const pid of PROP_ALLOW){for(const c of (ent.claims?.[pid]||[]).slice(0,4)){const val=claimRaw(c);if(!val?.value)continue;raw.push({pid,...val});if(val.type==='entity')entityIds.add(val.value)}}
    const ids=[...entityIds].slice(0,70);let valueLabels={};
    if(ids.length){try{const r=await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('%7C')}&props=labels&languages=en&format=json&origin=*`);for(const [qid,e] of Object.entries(r.entities||{}))valueLabels[qid]=e.labels?.en?.value||qid}catch{}}
    let propLabels={};
    try{const r=await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${PROP_ALLOW.join('%7C')}&props=labels&languages=en&format=json&origin=*`);for(const [pid,e] of Object.entries(r.entities||{}))propLabels[pid]=e.labels?.en?.value||pid}catch{}
    const isHuman=(ent.claims?.P31||[]).some(c=>claimRaw(c)?.value==='Q5');
    const facts=raw.filter(x=>!(isHuman&&['P19','P20'].includes(x.pid))).map(x=>({property:propLabels[x.pid]||x.pid,value:x.type==='entity'?(valueLabels[x.value]||x.value):x.value,type:x.type,unit:x.unit||null})).slice(0,36);
    return {entity:{id,label:ent.labels?.en?.value||top.label||id,description:ent.descriptions?.en?.value||top.description||'',isHuman,wikipedia:ent.sitelinks?.enwiki?.title?wikiUrl(ent.sitelinks.enwiki.title):null},facts};
  }catch(e){notes.push('Wikidata unavailable');return {entity:null,facts:[]}}
}

async function commons(q,notes){
  try{
    const d=await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=1200&format=json&origin=*`);
    const media=[];
    for(const x of Object.values(d.query?.pages||{})){
      const ii=x.imageinfo?.[0];if(!ii)continue;const mime=ii.mime||'';const title=safeLabel(ii.extmetadata?.ObjectName?.value||x.title||'Media').replace(/^File:/,'');
      if(mime.startsWith('image/'))media.push({type:'image',source:'Wikimedia Commons',title,url:ii.thumburl||ii.url,original:ii.url,sourceUrl:ii.descriptionurl||ii.url,license:safeLabel(ii.extmetadata?.LicenseShortName?.value||''),credit:safeLabel(ii.extmetadata?.Artist?.value||'')});
      else if(mime.startsWith('video/')||mime.startsWith('audio/'))media.push({type:mime.startsWith('video/')?'video':'audio',source:'Wikimedia Commons',title,url:ii.url,sourceUrl:ii.descriptionurl||ii.url,license:safeLabel(ii.extmetadata?.LicenseShortName?.value||'')});
    }
    return media.slice(0,18);
  }catch(e){notes.push('Wikimedia Commons unavailable');return []}
}

async function openalex(q,notes){
  try{
    const d=await getJSON(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=12`);
    return (d.results||[]).map(x=>({title:x.display_name||'Untitled work',year:x.publication_year||null,citations:x.cited_by_count??null,type:x.type||'work',venue:x.primary_location?.source?.display_name||'',authors:(x.authorships||[]).slice(0,5).map(a=>a.author?.display_name).filter(Boolean),url:x.doi||x.primary_location?.landing_page_url||x.id,openAccess:x.open_access?.is_oa||false})).slice(0,12);
  }catch(e){notes.push('OpenAlex unavailable');return []}
}

async function archive(q,notes){
  try{
    const d=await getJSON(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year&fl[]=mediatype&fl[]=creator&rows=16&page=1&output=json`);
    return (d.response?.docs||[]).map(x=>({identifier:x.identifier,title:x.title||x.identifier,description:clean(Array.isArray(x.description)?x.description[0]:x.description||'').slice(0,800),year:x.year||null,mediatype:x.mediatype||'item',creator:Array.isArray(x.creator)?x.creator.join(', '):(x.creator||''),url:`https://archive.org/details/${encodeURIComponent(x.identifier)}`,embed:`https://archive.org/embed/${encodeURIComponent(x.identifier)}`,thumbnail:`https://archive.org/download/${encodeURIComponent(x.identifier)}/__ia_thumb.jpg`})).slice(0,16);
  }catch(e){notes.push('Internet Archive unavailable');return []}
}

async function github(q,notes){
  try{
    const d=await getJSON(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=10`,7000,{'Accept':'application/vnd.github+json'});
    return (d.items||[]).map(x=>({name:x.full_name,title:x.name,description:x.description||'',stars:x.stargazers_count||0,language:x.language||'',updated:x.updated_at||null,url:x.html_url,homepage:x.homepage||''})).slice(0,10);
  }catch(e){notes.push('GitHub search unavailable');return []}
}

async function hn(q,notes){
  try{
    const d=await getJSON(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=10`);
    return (d.hits||[]).map(x=>({title:x.title||x.story_title||'Discussion',points:x.points??0,comments:x.num_comments??0,created:x.created_at||null,url:x.url||`https://news.ycombinator.com/item?id=${x.objectID}`})).slice(0,10);
  }catch(e){notes.push('Hacker News unavailable');return []}
}

async function recentCoverage(q,notes){
  try{
    const d=await getJSON(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=ArtList&maxrecords=10&format=json`,7000);
    return (d.articles||[]).map(x=>({title:x.title||'',domain:x.domain||'',language:x.language||'',sourceCountry:x.sourcecountry||'',seen:x.seendate||'',url:x.url||''})).filter(x=>x.title&&x.url).slice(0,10);
  }catch(e){notes.push('Recent coverage index unavailable');return []}
}

async function countryProfile(q){
  try{
    const d=await getJSON(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=true&fields=name,cca2,cca3,capital,region,subregion,population,area,languages,currencies,timezones,continents,borders,latlng,flags,coatOfArms,startOfWeek,idd,tld`,6500);
    const x=Array.isArray(d)?d[0]:null;if(!x)return null;
    return {name:x.name?.common||q,officialName:x.name?.official||'',cca2:x.cca2||'',cca3:x.cca3||'',capital:x.capital||[],region:x.region||'',subregion:x.subregion||'',population:x.population||0,area:x.area||0,languages:Object.values(x.languages||{}),currencies:Object.values(x.currencies||{}).map(c=>({name:c.name,symbol:c.symbol||''})),timezones:x.timezones||[],continents:x.continents||[],borders:x.borders||[],latlng:x.latlng||[],flag:x.flags?.svg||x.flags?.png||'',coatOfArms:x.coatOfArms?.svg||x.coatOfArms?.png||'',startOfWeek:x.startOfWeek||'',callingCode:(x.idd?.root||'')+(x.idd?.suffixes?.[0]||''),tld:x.tld||[]};
  }catch{return null}
}
function looksFood(q){return /\b(recipe|recipes|cook|cooking|bake|baking|bread|cake|cookie|pastry|pasta|soup|stew|cuisine|food|dish|meal|dessert|chicken|beef|pork|fish|rice|noodle|pizza|ramen|curry)\b/i.test(q)}
async function recipeMatches(q){
  try{
    const term=q.replace(/\b(recipe|recipes|cook|cooking|bake|baking)\b/gi,'').trim()||q;
    const d=await getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`,6500);
    return (d.meals||[]).slice(0,10).map(m=>{const ingredients=[];for(let i=1;i<=20;i++){const ingredient=String(m[`strIngredient${i}`]||'').trim();const measure=String(m[`strMeasure${i}`]||'').trim();if(ingredient)ingredients.push({ingredient,measure})}return {id:m.idMeal,title:m.strMeal||'Recipe',category:m.strCategory||'',area:m.strArea||'',image:m.strMealThumb||'',instructions:String(m.strInstructions||'').trim(),ingredients,tags:String(m.strTags||'').split(',').map(x=>x.trim()).filter(Boolean),video:''}})
  }catch{return []}
}

module.exports=async(req,res)=>{
  const q=String(req.query?.q||'').trim().slice(0,180);if(!q)return send(res,400,{error:'Missing dossier query.'});
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();if(!(await store.rateLimit(`dossier:${ip}`,30)))return send(res,429,{error:'Too many dossier requests. Try again shortly.'});
  const notes=[];
  const [wiki,lexicon,wd,media,papers,archives,projects,discussions,coverage,country,recipes]=await Promise.all([
    wikipedia(q,notes),wiktionary(q,notes),wikidata(q,notes),commons(q,notes),openalex(q,notes),archive(q,notes),github(q,notes),hn(q,notes),recentCoverage(q,notes),countryProfile(q),recipeMatches(q)
  ]);
  const years=[];for(const p of papers)if(p.year)years.push({year:Number(p.year),label:p.title,type:'paper'});for(const a of archives)if(a.year&&Number.isFinite(Number(a.year)))years.push({year:Number(a.year),label:a.title,type:'archive'});
  years.sort((a,b)=>a.year-b.year);
  const related=uniq([...(wiki.related||[]),...((wiki.match?.links||[]).slice(0,24).map(title=>({title,url:wikiUrl(title),snippet:''})))],'title').slice(0,28);
  return send(res,200,{query:q,generatedAt:new Date().toISOString(),encyclopedia:wiki.match,related,lexicon,wikidata:wd.entity,facts:wd.facts,media,papers,archives,projects,discussions,coverage,country,recipes,timeline:years.slice(0,30),notes,message:'Babel Dossier combines public reference, structured-data, scholarship, archive, code, media, and discussion indexes into one internal research view. Source provenance remains visible, but exploration stays inside Babel.'});
};
