const {seedTopics}=require('../knowledge');
module.exports=async(req,res)=>{
  res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
  res.end(JSON.stringify({curated:seedTopics(),recent:[],persistence:'read-only'}));
};
