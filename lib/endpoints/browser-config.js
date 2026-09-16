module.exports=async function browserConfig(req,res){
  const remote=String(process.env.SCRAMJET_BROWSER_URL||'').trim();
  const wisp=String(process.env.SCRAMJET_WISP_URL||'').trim();
  const requested=String(process.env.SCRAMJET_TRANSPORT||'').trim().toLowerCase();
  const transport=requested==='wisp'&&wisp?'wisp':'bare';
  res.statusCode=200;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  res.end(JSON.stringify({
    mode:'reader',
    integratedScramjet:true,
    engine:'Scramjet 2',
    engineVersion:'2.0.67-alpha.2',
    transport,
    scramjetUrl:remote,
    wispUrl:wisp,
    bareUrl:'/bare/',
    serviceWorker:'/scramjet-v2-sw.js',
    scramjetCore:'/scram/scramjet.js',
    scramjetPath:'/scram/scramjet.js',
    wasmPath:'/scram/scramjet.wasm',
    injectPath:'/controller/controller.inject.js',
    controllerApi:'/controller/controller.api.js',
    utilsScript:'/utils/scramjet-utils.js',
    libcurlModule:'/libcurl/index.mjs',
    bareModule:'/baremod/index.mjs',
    note:transport==='bare'
      ?'Scramjet 2 uses the same-deployment Bare HTTP transport on Vercel. Ordinary pages work without a third-party Wisp relay; target WebSockets are not available on the serverless transport.'
      :'Scramjet 2 uses the configured Wisp relay through libcurl transport.'
  }));
};
