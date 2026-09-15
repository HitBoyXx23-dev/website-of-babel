module.exports=async function browserConfig(req,res){
  const remote=String(process.env.SCRAMJET_BROWSER_URL||'').trim();
  const wisp=String(process.env.SCRAMJET_WISP_URL||'wss://wisp.mercurywork.shop/').trim();
  res.statusCode=200;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  res.end(JSON.stringify({
    mode:'reader',
    integratedScramjet:true,
    engine:'Scramjet 2',
    engineVersion:'2.0.67-alpha.2',
    scramjetUrl:remote,
    wispUrl:wisp,
    serviceWorker:'/scramjet-v2-sw.js',
    scramjetPath:'/scram/scramjet.js',
    wasmPath:'/scram/scramjet.wasm',
    injectPath:'/controller/controller.inject.js',
    controllerApi:'/controller/controller.api.js',
    utilsScript:'/utils/scramjet-utils.js',
    libcurlModule:'/libcurl/index.mjs',
    note:'Scramjet 2.x uses the controller + proxy-transports architecture. BareMux is not used.'
  }));
};
