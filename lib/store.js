// Public Website Of Babel is read-only. This module only provides a short-lived
// in-process request limiter for Vercel Functions. It stores no user-created content.
const buckets=new Map();
function config(){return {enabled:false,mode:'read-only'}}
async function getTopic(){return null}
async function saveTopic(){return false}
async function recentTopics(){return []}
async function countTopics(){return 0}
async function rateLimit(key,limit=45){
  const now=Date.now(),minute=Math.floor(now/60000),k=`${key}:${minute}`;
  const n=(buckets.get(k)||0)+1;buckets.set(k,n);
  if(buckets.size>2500){for(const x of buckets.keys()){const m=Number(x.split(':').pop());if(m<minute-2)buckets.delete(x)}}
  return n<=limit;
}
module.exports={config,getTopic,saveTopic,recentTopics,countTopics,rateLimit};
