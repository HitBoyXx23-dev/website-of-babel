const crypto=require('crypto');
const seed=[...require('../data/seed'),...require('../data/extra-seed'),...require('../data/domain-seed')];
const bySlug=new Map(seed.map(x=>[x.slug,x]));
function slugify(input){return String(input||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'untitled'}
function titleCase(s){return String(s).replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function classify(q){
  const x=q.toLowerCase();
  if(/time|quantum|physics|black hole|wormhole|relativ/.test(x))return ['Physics','Research / theoretical'];
  if(/math|\bpi\b|π|number|geometry|algebra|calculus|dimension/.test(x))return ['Mathematics','Established / mathematical'];
  if(/memory|hypno|mind|learn|loci|dream|lucid|meditat|sleep/.test(x))return ['Mind','Evidence varies by claim'];
  if(/ghost|spirit|paranormal|precog|remote view|psychic|medium|haunt/.test(x))return ['Paranormal & Folklore','Historical / cultural; supernatural claims unverified'];
  if(/religion|theolog|christian|islam|muslim|jew|hindu|buddh|sikh|tao|shinto|faith|god|deity/.test(x))return ['Religion & Philosophy','Historical / theological / cultural'];
  if(/forecast|future|trend|scenario|prediction/.test(x))return ['Futures','Probabilistic / evidence varies by method'];
  if(/gambl|casino|roulette|poker|betting|odds|probabil/.test(x))return ['Probability & Society','Established mathematics / behavioral risk'];
  if(/dark web|tor|onion|privacy|osint|people search/.test(x))return ['Research & Computing','Practical / source dependent'];
  if(/fight|boxing|martial|judo|wrestl|bjj|karate|kickbox/.test(x))return ['Skills','Practical skill domain'];
  if(/cook|bake|recipe|bread|cake|pastry|food|cuisine|kitchen|grill|roast|ferment/.test(x))return ['Cooking & Food','Practical / culinary knowledge'];
  if(/language|linguistic|grammar|phonetic|translation|spanish|french|german|japanese|korean|arabic|hindi|mandarin/.test(x))return ['Human Languages','Linguistic / cultural knowledge'];
  if(/country|nation|capital|geography|territor/.test(x))return ['World','Geographic / political reference'];
  if(/sexual|sex |adult|18\+|porn|erotic|contracept|sti|consent|kink/.test(x))return ['Mature Knowledge','Educational / health / cultural'];
  if(/code|program|javascript|typescript|python|rust|golang|java|computer|software|web/.test(x))return ['Computing','Practical / technical'];
  if(/history|ancient|empire|war|civilization/.test(x))return ['History','Historical research'];
  if(/qi|ki|occult|alchemy|esoteric|astral|chakra/.test(x))return ['Traditions','Historical / traditional; claims vary'];
  return ['General','Open research'];
}
function genericSections(title,category){
  return [
    {title:'Orientation',body:`This entry was created because someone searched for ${title}. It starts as an index rather than pretending to be a finished authority. The first job is to define the term, identify its major interpretations, and separate well-supported claims from speculation.`,points:['Definitions and terminology','Major branches or interpretations','What would count as good evidence']},
    {title:'Research map',body:`Study ${title} from more than one direction. Babel keeps scientific, historical, practical, cultural, and speculative material visibly separated so that interesting ideas do not become false claims by formatting alone.`,points:[`Primary sources related to ${title}`,`Modern scholarship and reference works`,`Criticism, limitations, and competing explanations`]},
    {title:'Learn and build',body:`A useful ${category.toLowerCase()} entry should eventually become more than a page. It can grow into a lesson, timeline, diagram, experiment, code project, memory route, glossary, or comparison as people explore it.`}
  ];
}
function makeRelated(q){
  const words=q.toLowerCase().split(/\s+/).filter(w=>w.length>2);
  const base=[...words,`${q} history`,`${q} theory`,`${q} evidence`,`${q} practice`,`${q} criticism`];
  return [...new Set(base.map(slugify).filter(Boolean))].slice(0,7);
}
function sourcesFor(q){
  const e=encodeURIComponent(q);
  return [
    {name:'Wikipedia',note:'orientation and references',url:`https://en.wikipedia.org/wiki/Special:Search?search=${e}`},
    {name:'Google Scholar',note:'papers and scholarly citations',url:`https://scholar.google.com/scholar?q=${e}`},
    {name:'Internet Archive',note:'books, scans, and historical material',url:`https://archive.org/search?query=${e}`},
    {name:'Semantic Scholar',note:'research literature',url:`https://www.semanticscholar.org/search?q=${e}`}
  ];
}
function buildTopic(query){
  const clean=String(query||'').trim().replace(/\s+/g,' ').slice(0,180);
  const slug=slugify(clean);
  const curated=bySlug.get(slug);
  const now=new Date().toISOString();
  if(curated)return {...curated,id:crypto.createHash('sha256').update(slug).digest('hex').slice(0,12),kind:'curated',createdAt:now,updatedAt:now,sources:sourcesFor(curated.title)};
  const [category,evidence]=classify(clean);
  const title=titleCase(clean);
  return {
    id:crypto.createHash('sha256').update(slug).digest('hex').slice(0,12),slug,title,category,evidence,kind:'created',createdAt:now,updatedAt:now,
    dek:`A newly created Babel index for ${title}, ready to grow through research, references, connected concepts, and user demand.`,
    tags:[category.toLowerCase(),'created entry','research index'],sections:genericSections(title,category),related:makeRelated(clean),sources:sourcesFor(clean)
  };
}
function seedTopics(){return seed.map(t=>({...t,kind:'curated'}))}
module.exports={slugify,buildTopic,seedTopics,sourcesFor};
