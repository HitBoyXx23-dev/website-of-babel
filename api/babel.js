const handlers = {
  'browser-config': require('../lib/endpoints/browser-config'),
  'catalog': require('../lib/endpoints/catalog'),
  'country': require('../lib/endpoints/country'),
  'dossier': require('../lib/endpoints/dossier'),
  'explore': require('../lib/endpoints/explore'),
  'media-search': require('../lib/endpoints/media-search'),
  'reader': require('../lib/endpoints/reader'),
  'recipes': require('../lib/endpoints/recipes'),
  'research': require('../lib/endpoints/research'),
  'stats': require('../lib/endpoints/stats'),
  'topic': require('../lib/endpoints/topic'),
  'trends': require('../lib/endpoints/trends'),
  'webgraph': require('../lib/endpoints/webgraph'),
  'websearch': require('../lib/endpoints/websearch')
};

let bareServer = null;
function getBareServer(){
  if(bareServer)return bareServer;
  const mod=require('@tomphttp/bare-server-node');
  const createBareServer=mod.createBareServer||mod.default?.createBareServer;
  if(typeof createBareServer!=='function')throw new Error('Bare server package did not export createBareServer.');
  const ipaddr=require('ipaddr.js');
  bareServer=createBareServer('/bare/',{
    connectionLimiter:{
      maxConnectionsPerIP:2000,
      windowDuration:60,
      blockDuration:10
    },
    filterRemote(url){
      const hostname=String(url.hostname||'').replace(/^\[|\]$/g,'');
      if(ipaddr.isValid(hostname)&&ipaddr.parse(hostname).range()!=='unicast'){
        throw new RangeError('Forbidden IP');
      }
    }
  });
  return bareServer;
}
function bareRequestUrl(req){
  const path=String(req.query?.path||'').replace(/^\/+/, '');
  const qs=new URLSearchParams();
  for(const [key,value] of Object.entries(req.query||{})){
    if(key==='endpoint'||key==='path'||value==null)continue;
    if(Array.isArray(value))for(const item of value)qs.append(key,String(item));
    else qs.append(key,String(value));
  }
  const query=qs.toString();
  return `/bare/${path}${query?`?${query}`:''}`;
}
function sendUnknown(res,endpoint){
  res.statusCode=404;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  return res.end(JSON.stringify({
    error:'Unknown Babel API endpoint.',
    endpoint,
    available:[...Object.keys(handlers),'bare']
  }));
}

module.exports = async function babelApi(req, res) {
  const endpoint = String(req.query?.endpoint || '').trim().toLowerCase();

  // Scramjet 2 serverless transport. This stays inside the same Vercel function
  // so the Hobby deployment still has one Serverless Function total.
  if(endpoint==='bare'){
    try{
      req.url=bareRequestUrl(req);
      const bare=getBareServer();
      if(!bare.shouldRoute(req))return sendUnknown(res,'bare');
      return bare.routeRequest(req,res);
    }catch(error){
      if(res.headersSent)return;
      res.statusCode=502;
      res.setHeader('Content-Type','application/json; charset=utf-8');
      res.setHeader('Cache-Control','no-store');
      return res.end(JSON.stringify({error:'Babel Bare transport failed.',detail:process.env.NODE_ENV==='development'?String(error?.stack||error):undefined}));
    }
  }

  const handler = handlers[endpoint];
  if (!handler) return sendUnknown(res,endpoint);

  try {
    return await handler(req, res);
  } catch (error) {
    if (res.headersSent) return;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({
      error: 'Babel API request failed.',
      endpoint,
      detail: process.env.NODE_ENV === 'development' ? String(error?.stack || error) : undefined
    }));
  }
};
