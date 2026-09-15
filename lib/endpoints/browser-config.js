module.exports=async function browserConfig(req,res){
  const remote=String(process.env.SCRAMJET_BROWSER_URL||'').trim();
  const wisp=String(process.env.SCRAMJET_WISP_URL||'wss://wisp.mercurywork.shop/').trim();
  res.statusCode=200;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  res.end(JSON.stringify({
    mode:'reader',
    integratedScramjet:true,
    scramjetUrl:remote,
    wispUrl:wisp,
    serviceWorker:'/scramjet-sw.js',
    prefix:'/service/',
    note:'Integrated Scramjet 1.x assets are bundled at build time. A Wisp-compatible relay is required for network transport; SCRAMJET_WISP_URL can override the default relay.'
  }));
};
