const store=require('../store');
const {crawlSite,queryToURL}=require('../site-crawl');
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
module.exports=async(req,res)=>{
  const raw=String(req.query?.url||'').trim().slice(0,1800);if(!raw)return send(res,400,{error:'Missing URL.'});
  const ip=(req.headers['x-forwarded-for']||'anonymous').split(',')[0].trim();if(!(await store.rateLimit(`webgraph:${ip}`,24)))return send(res,429,{error:'Too many mapping requests. Try again shortly.'});
  let start=raw;if(!/^https?:\/\//i.test(start)){const q=queryToURL(start);if(q)start=q}
  const depth=Math.max(1,Math.min(3,Number(req.query?.depth||2)||2));
  try{
    const d=await crawlSite(start,{depth,maxPages:36,maxNodes:190,maxEdges:300,includeSitemap:true});
    const host=d.root.host;
    const links=(d.links||[]).map(x=>({url:x.url,title:x.title||x.text||x.path||x.host,text:x.text||'',path:x.path||'',host:x.host,sameSite:!!x.sameSite,depth:x.depth||1,via:x.via||d.root.url}));
    const graphNodes=(d.nodes||[]).map(x=>({url:x.url,title:x.title||x.path||x.host,description:x.description||'',path:x.path||'',host:x.host,sameSite:!!x.sameSite,depth:x.depth||0,type:x.type||'page'}));
    const graphEdges=(d.edges||[]).map(x=>({from:x.from,to:x.to,internal:!!x.internal}));
    const hosts=[...new Set(graphNodes.map(n=>n.host).filter(Boolean))];
    return send(res,200,{root:d.root,links,graphNodes,graphEdges,hosts,counts:{pages:(d.pages||[]).length,links:links.length,hosts:hosts.length,internal:graphNodes.filter(x=>x.sameSite).length,external:graphNodes.filter(x=>!x.sameSite).length,edges:graphEdges.length},depth,note:`Mapped the site up to ${depth} internal link levels with bounded crawling.`});
  }catch(e){return send(res,400,{error:String(e.message||e)})}
};
