const {slugify,buildTopic,seedTopics}=require('../knowledge');
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
module.exports=async(req,res)=>{
  try{
    let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body)}catch{body={}}}
    const raw=req.method==='GET'?(req.query?.q||req.query?.slug):(body.query||body.slug);
    const query=String(raw||'').trim().slice(0,180);
    if(!query)return send(res,400,{error:'Missing topic query.'});
    const slug=slugify(query);
    const curated=seedTopics().find(t=>t.slug===slug);
    if(curated)return send(res,200,{topic:buildTopic(curated.slug),persistence:'curated',created:false});
    const topic=buildTopic(query);topic.kind='temporary';topic.dek=`A temporary research orientation for ${topic.title}. It is not published or saved to the shared site.`;return send(res,200,{topic,persistence:'temporary',created:false,temporary:true});
  }catch(err){return send(res,500,{error:'Babel could not open this topic.',detail:process.env.NODE_ENV==='development'?String(err.message||err):undefined})}
};
