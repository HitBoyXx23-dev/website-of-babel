module.exports=(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300');
  res.end(JSON.stringify({
    scramjetUrl: process.env.SCRAMJET_BROWSER_URL || '',
    mode: process.env.SCRAMJET_BROWSER_URL ? 'scramjet' : 'reader',
    note: process.env.SCRAMJET_BROWSER_URL ? 'External/self-hosted Scramjet endpoint configured.' : 'No Scramjet endpoint configured. Babel Reader remains available.'
  }));
};
