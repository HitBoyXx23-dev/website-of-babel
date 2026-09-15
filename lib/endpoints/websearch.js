const store=require('../store');

function send(res,status,data){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=86400');
  res.end(JSON.stringify(data));
}
function clean(s=''){return String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim()}
function decodeUrl(href=''){
  try{const u=new URL(href.startsWith('//')?'https:'+href:href,'https://duckduckgo.com/');const target=u.searchParams.get('uddg');return target?decodeURIComponent(target):u.href}catch{return href}
}
function host(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch{return''}}
function uniq(rows){const seen=new Set();return rows.filter(r=>{if(!r?.url||!/^https?:\/\//i.test(r.url)||/(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(r.url))return false;const k=r.url.replace(/\/$/,'');if(seen.has(k))return false;seen.add(k);r.host=r.host||host(r.url);return true})}
async function fetchJSON(url,opts={},timeout=5500){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{...opts,signal:c.signal});if(!r.ok)throw new Error(String(r.status));return await r.json()}finally{clearTimeout(t)}}
async function fetchText(url,opts={},timeout=6500){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{...opts,signal:c.signal});if(!r.ok)throw new Error(String(r.status));return await r.text()}finally{clearTimeout(t)}}

const anchors=[
  {terms:['hitboyxx23','hitboyxx23-dev','hitboy'],title:'HitBoyXx23',url:'https://hitboyxx23.dev/stack/',snippet:'HitBoyXx23 public website and technology stack.',source:'Verified web anchor',kind:'profile'},
  {terms:['hitboyxx23','hitboy'],title:'HitBoyXx23 on itch.io',url:'https://hitboyxx23.itch.io/shadow-game',snippet:'Public HitBoyXx23 itch.io page.',source:'Verified web anchor',kind:'profile'},
  {terms:['hitboyxx23','hitboy'],title:'HitBoyXx23 on Audiomack',url:'https://audiomack.com/hitboyxx23',snippet:'Public HitBoyXx23 artist page.',source:'Verified web anchor',kind:'profile'},
  {terms:['end of the internet','the end of the internet','last page internet','end internet','internet end'],title:'The End of the Internet',url:'https://hmpg.net/',snippet:'The classic hmpg.net page that announces you have reached the end of the Internet.',source:'Canonical Babel anchor',kind:'website'},
  {terms:['library of babel'],title:'Library of Babel',url:'https://libraryofbabel.info/',snippet:'The public Library of Babel project.',source:'Verified web anchor',kind:'website'},
  {terms:['network of babel'],title:'Network of Babel',url:'https://networkofbabel.com/',snippet:'The public Network of Babel website.',source:'Verified web anchor',kind:'website'}
];
function anchorMatches(q){const s=q.toLowerCase();return anchors.filter(a=>a.terms.some(t=>s.includes(t)||t.includes(s))).map(a=>({...a}))}

async function duck(q){
  try{
    const html=await fetchText(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,{headers:{'User-Agent':'Mozilla/5.0 (compatible; WebsiteOfBabel/12.0)','Accept-Language':'en-US,en;q=0.8'}});
    const rows=[];
    let m;const re=/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    while((m=re.exec(html))&&rows.length<50){
      const after=html.slice(re.lastIndex,re.lastIndex+1400);const sn=after.match(/class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);
      rows.push({title:clean(m[2]),url:decodeUrl(m[1]),snippet:clean(sn?.[1]||''),source:'DuckDuckGo',kind:'website'});
    }
    return rows;
  }catch{return []}
}
async function brave(q){
  const key=process.env.BRAVE_SEARCH_API_KEY;if(!key)return [];
  try{const d=await fetchJSON(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=20`,{headers:{'Accept':'application/json','X-Subscription-Token':key}});return (d.web?.results||[]).map(x=>({title:x.title||x.url,url:x.url,snippet:clean(x.description||''),source:'Brave Search',kind:'website',thumbnail:x.thumbnail?.src||x.profile?.img||''}))}catch{return []}
}
async function wikipedia(q){
  try{const d=await fetchJSON(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=12&format=json&origin=*`,{headers:{'User-Agent':'WebsiteOfBabel/12.0'}});return (d.query?.search||[]).map(x=>({title:x.title,url:`https://en.wikipedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g,'_'))}`,snippet:clean(x.snippet),source:'Wikipedia',kind:'reference'}))}catch{return []}
}
function ghHeaders(){const h={'User-Agent':'WebsiteOfBabel/12.0','Accept':'application/vnd.github+json'};if(process.env.GITHUB_TOKEN)h.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;return h}
async function githubUsers(q){
  try{const d=await fetchJSON(`https://api.github.com/search/users?q=${encodeURIComponent(q)}&per_page=12`,{headers:ghHeaders()});return (d.items||[]).map(x=>({title:x.login,url:x.html_url,snippet:`GitHub account · score ${Number(x.score||0).toFixed(2)}`,source:'GitHub users',kind:'profile',avatar:x.avatar_url||''}))}catch{return []}
}
async function gitlabUsers(q){
  try{const d=await fetchJSON(`https://gitlab.com/api/v4/users?search=${encodeURIComponent(q)}&per_page=12`,{headers:{'User-Agent':'WebsiteOfBabel/12.0'}});return (Array.isArray(d)?d:[]).map(x=>({title:x.name||x.username,url:x.web_url,snippet:`@${x.username} · GitLab account`,source:'GitLab users',kind:'profile',avatar:x.avatar_url||''}))}catch{return []}
}
async function stackUsers(q){
  try{const d=await fetchJSON(`https://api.stackexchange.com/2.3/users?site=stackoverflow&pagesize=12&order=desc&sort=reputation&inname=${encodeURIComponent(q)}`);return (d.items||[]).map(x=>({title:x.display_name,url:x.link,snippet:`Stack Overflow · ${Number(x.reputation||0).toLocaleString()} reputation`,source:'Stack Overflow users',kind:'profile',avatar:x.profile_image||''}))}catch{return []}
}
async function exactHandleChecks(q){
  const name=q.trim();if(!/^[A-Za-z0-9_.-]{2,40}$/.test(name))return [];
  const jobs=[];
  jobs.push((async()=>{try{const x=await fetchJSON(`https://api.github.com/users/${encodeURIComponent(name)}`,{headers:ghHeaders()});return {title:x.name?`${x.name} (@${x.login})`:x.login,url:x.html_url,snippet:x.bio||`GitHub profile · ${x.public_repos||0} public repositories`,source:'Exact handle check · GitHub',kind:'profile',avatar:x.avatar_url||''}}catch{return null}})());
  jobs.push((async()=>{try{const x=await fetchJSON(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(name)}`);const u=Array.isArray(x)?x[0]:null;return u?{title:u.name||u.username,url:u.web_url,snippet:`@${u.username} · GitLab profile`,source:'Exact handle check · GitLab',kind:'profile',avatar:u.avatar_url||''}:null}catch{return null}})());
  jobs.push((async()=>{try{const x=await fetchJSON(`https://hacker-news.firebaseio.com/v0/user/${encodeURIComponent(name)}.json`);return x?{title:x.id,url:`https://news.ycombinator.com/user?id=${encodeURIComponent(x.id)}`,snippet:`Hacker News user · karma ${Number(x.karma||0).toLocaleString()}`,source:'Exact handle check · Hacker News',kind:'profile'}:null}catch{return null}})());
  jobs.push((async()=>{try{const x=await fetchJSON(`https://www.reddit.com/user/${encodeURIComponent(name)}/about.json`,{headers:{'User-Agent':'WebsiteOfBabel/12.0'}});const u=x?.data;return u?{title:`u/${u.name}`,url:`https://www.reddit.com/user/${encodeURIComponent(u.name)}/`,snippet:`Reddit account · karma ${Number((u.total_karma??((u.link_karma||0)+(u.comment_karma||0)))||0).toLocaleString()}`,source:'Exact handle check · Reddit',kind:'profile',avatar:u.icon_img||''}:null}catch{return null}})());
  return (await Promise.all(jobs)).filter(Boolean);
}

module.exports=async(req,res)=>{
  const q=String(req.query?.q||'').trim().slice(0,240);
  if(!q)return send(res,400,{error:'Missing search query.'});
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();
  if(!(await store.rateLimit(`websearch:${ip}`,45)))return send(res,429,{error:'Too many searches. Try again shortly.'});
  const pinned=anchorMatches(q);
  const [br,ddg,wiki,gh,gl,so,exact]=await Promise.all([brave(q),duck(q),wikipedia(q),githubUsers(q),gitlabUsers(q),stackUsers(q),exactHandleChecks(q)]);
  const results=uniq([...pinned,...exact,...br,...ddg,...gh,...gl,...so,...wiki]).slice(0,90);
  const providers={anchors:pinned.length,exactHandles:exact.length,brave:br.length,duckduckgo:ddg.length,github:gh.length,gitlab:gl.length,stackoverflow:so.length,wikipedia:wiki.length};
  return send(res,200,{query:q,results,count:results.length,providers,live:ddg.length>0||br.length>0,note:'Results combine public web search, reference search, developer-network search, and exact handle checks. Matching handles across services are not proof that the accounts belong to the same person.'});
};
