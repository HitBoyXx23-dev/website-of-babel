const store=require('../store');
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');res.end(JSON.stringify(data))}
async function getJSON(url,ms=6500,headers={}){const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':'WebsiteOfBabelTrends/9.0',...headers}});if(!r.ok)throw new Error(String(r.status));return await r.json()}finally{clearTimeout(t)}}
function ymd(d){return d.toISOString().slice(0,10).replaceAll('-','')}
function iso(d){return d.toISOString().slice(0,10)}
function restricted(q){
  const s=q.toLowerCase();
  const harm=/\b(kill|killed|shot|shoot|shooting|assassinat|murder|die|death|attack|bomb|stab)\w*\b/.test(s);
  const person=/\b(president|prime minister|senator|governor|mayor|candidate|politician|celebrity|person|king|queen|pope)\b/.test(s);
  const election=/\b(election|vote|ballot|candidate|party|presidential race)\b/.test(s);
  if(harm&&person)return 'Babel does not generate forecasts about violence or death involving real people. You can research the underlying topic, historical data, or public safety information instead.';
  if(election)return 'Babel does not assign probabilities to election or candidate outcomes. This tool can still be used for non-electoral attention and research trends.';
  return '';
}
module.exports=async(req,res)=>{
  const q=String(req.query?.q||'').trim().slice(0,120);if(!q)return send(res,400,{error:'Missing trend query.'});
  const blocked=restricted(q);if(blocked)return send(res,422,{error:blocked,restricted:true});
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();if(!(await store.rateLimit(`trends:${ip}`,25)))return send(res,429,{error:'Too many trend requests.'});
  try{
    const enc=encodeURIComponent(q);const search=await getJSON(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${enc}&srlimit=5&utf8=1&format=json&origin=*`);
    const candidates=(search.query?.search||[]).map(x=>x.title);const exact=candidates.find(x=>x.toLowerCase()===q.toLowerCase());const article=exact||candidates[0]||q;
    const end=new Date();end.setUTCDate(end.getUTCDate()-1);const start=new Date(end);start.setUTCDate(start.getUTCDate()-29);const monthAgo=new Date();monthAgo.setUTCDate(monthAgo.getUTCDate()-30);const yearAgo=new Date();yearAgo.setUTCFullYear(yearAgo.getUTCFullYear()-1);
    const jobs={
      views:getJSON(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(article.replaceAll(' ','_'))}/daily/${ymd(start)}/${ymd(end)}`),
      hn:getJSON(`https://hn.algolia.com/api/v1/search_by_date?query=${enc}&tags=story&numericFilters=created_at_i>${Math.floor(Date.now()/1000)-2592000}&hitsPerPage=1`),
      openalex:getJSON(`https://api.openalex.org/works?search=${enc}&filter=from_publication_date:${iso(yearAgo)}&per-page=1`),
      archive:getJSON(`https://archive.org/advancedsearch.php?q=${enc}&fl[]=identifier&rows=0&page=1&output=json`),
      github:getJSON(`https://api.github.com/search/repositories?q=${encodeURIComponent(`${q} pushed:>${iso(monthAgo)}`)}&per_page=1`,6000,{'Accept':'application/vnd.github+json'})
    };
    const keys=Object.keys(jobs);const vals=await Promise.allSettled(Object.values(jobs));const got={};keys.forEach((k,i)=>{if(vals[i].status==='fulfilled')got[k]=vals[i].value});
    const series=(got.views?.items||[]).map(x=>({date:String(x.timestamp).slice(0,8),views:x.views||0}));const sum=a=>a.reduce((n,x)=>n+(x.views||0),0);const recent=sum(series.slice(-7)),previous=sum(series.slice(-14,-7));const momentum=previous?((recent-previous)/previous)*100:null;
    const signals=[
      {id:'wikipedia',label:'Wikipedia views / 30d',value:sum(series),available:!!series.length,kind:'attention'},
      {id:'hn',label:'Hacker News stories / 30d',value:got.hn?.nbHits??null,available:got.hn?.nbHits!=null,kind:'discussion'},
      {id:'openalex',label:'OpenAlex works / last 12m',value:got.openalex?.meta?.count??null,available:got.openalex?.meta?.count!=null,kind:'research'},
      {id:'archive',label:'Internet Archive matches',value:got.archive?.response?.numFound??null,available:got.archive?.response?.numFound!=null,kind:'archive'},
      {id:'github',label:'GitHub repos pushed / 30d',value:got.github?.total_count??null,available:got.github?.total_count!=null,kind:'building'}
    ];
    const breadth=signals.filter(x=>x.available&&Number(x.value)>0).length;
    return send(res,200,{query:q,article,candidates,series,totalViews:sum(series),last7Views:recent,previous7Views:previous,momentum,hnStories:got.hn?.nbHits??null,signals,signalBreadth:breadth,generatedAt:new Date().toISOString(),warning:'These are observed public signals and simple change calculations. They are not probabilities or proof of what will happen next.'});
  }catch(e){return send(res,502,{error:'Trend sources were unavailable.',detail:String(e.message||e)})}
};
