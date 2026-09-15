const {seedTopics}=require('../knowledge');
module.exports=async(req,res)=>{
  res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
  res.end(JSON.stringify({curated:seedTopics().length,created:0,shared:false,coreSystems:22,piDigits:1000000,numberCorpora:{pi:1000000,e:250000,phi:250000,sqrt2:250000,sqrt3:250000,ln2:250000},mode:'read-only'}));
};
