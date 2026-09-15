/* Website Of Babel v17: occult/esoteric archive + dual cultivation atlas. */
const V17_VERSION='17.0.0';

const V17_OCCULT=[
  'Witchcraft','History of Witchcraft','Wicca','Modern Paganism','Folk Magic','Cunning Folk','Ceremonial Magic','Ritual Magic','Grimoires','Key of Solomon','Lesser Key of Solomon','Picatrix','Book of Abramelin','Chaos Magic','Sigils','Talismans and Amulets','Protective Magic','Curses and Hexes','Divination','Tarot','Astrology','I Ching Divination','Runes and Modern Divination','Scrying','Automatic Writing','Mediumship','Séance','Spiritualism','Ancestor Veneration','Necromancy','Demonology','Angelology','Goetia','Theurgy','Hermeticism','Hermetic Qabalah','Kabbalah','Alchemy','Planetary Magic','Herbal Magic and Folklore','Magic Circles','Pentagrams','Occult Symbols','Western Esotericism','Theosophy','Rosicrucianism','Hermetic Order of the Golden Dawn','Enochian Magic','Occultism','Witch Trials','Salem Witch Trials','Witches in Folklore','Witchcraft in Fiction'
];
const V17_FARM=[
  'Cultivation: Agriculture','Farming','Agriculture','Crop Cultivation','Soil Science','Soil Fertility','Composting','Irrigation','Hydroponics','Aeroponics','Aquaponics','Greenhouse Growing','Vertical Farming','Permaculture','Agroecology','Regenerative Agriculture','Organic Farming','Precision Agriculture','Plant Propagation','Seed Starting','Grafting','Pruning','Plant Nutrition','Integrated Pest Management','Plant Pathology','Weed Science','Crop Rotation','Cover Crops','Grain Farming','Rice Cultivation','Wheat Cultivation','Maize Cultivation','Orchards','Viticulture','Horticulture','Market Gardening','Urban Farming','Indoor Growing','Agricultural Robotics','Agricultural Drones','Farm Economics','Food Systems'
];
const V17_QI=[
  'Qi Cultivation','Qigong','Neigong','Neidan / Internal Alchemy','Daoist Cultivation','Dantian','Jing, Qi, Shen','Meridians in Chinese Medicine','Microcosmic Orbit','Embryonic Breathing','Standing Meditation / Zhan Zhuang','Taijiquan / Tai Chi','Baguazhang','Xingyiquan','Internal Martial Arts','Breath Training','Daoyin','Five Animals Qigong','Eight Brocades / Baduanjin','Yijinjing','Marrow-Washing Traditions','Cultivation Realms in Fiction','Xianxia','Xuanhuan','Wuxia','Immortality Cultivation Traditions','Qi Deviation / Zouhuo Rumo','Cultivation Meditation','Cultivation Games','Cultivation Webnovels'
];
function v17Chip(q){return `<button class="v17-chip" data-v17-q="${esc(q)}">${esc(q)}</button>`}
function v17Bind(root=document){root.querySelectorAll('[data-v17-q]').forEach(b=>b.onclick=()=>route(v9SearchRoute(b.dataset.v17Q)));wireRoutes()}
function v17Head(code,title,desc){return `<header class="v17-head"><span>${esc(code)}</span><h1>${esc(title)}</h1><p>${esc(desc)}</p><form class="v17-search" data-v17-search><input placeholder="Search this subject across all of Babel"><button>SEARCH</button></form></header>`}
function v17WireSearch(root=document){root.querySelectorAll('[data-v17-search]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const q=f.querySelector('input').value.trim();if(q)route(v9SearchRoute(q))})}

function v17OccultPage(){
  setTitle('Occult & Esoteric');
  app.innerHTML=`<div class="v13-wrap v13-page v17-page">${v17Head('BABEL SUBJECT ATLAS / OCCULT','Occult & Esoteric','Witchcraft, magic, grimoires, divination, ritual traditions, spirits, alchemy, astrology, esotericism, religious history, folklore, manuscripts, modern movements, criticism, and cultural context. Historical practice and supernatural claims are labeled separately.')}
  <section class="v17-ledger"><div><b>${V17_OCCULT.length}</b><span>curated foundations</span></div><div><b>HISTORY</b><span>texts · trials · movements</span></div><div><b>PRACTICE</b><span>ritual · symbols · divination</span></div><div><b>EVIDENCE</b><span>claims stay classified</span></div></section>
  <section class="v17-section"><div class="v17-section-title"><span>INDEX</span><h2>Witchcraft, magic, and esoteric traditions</h2></div><div class="v17-chip-grid">${V17_OCCULT.map(v17Chip).join('')}</div></section>
  <section class="v17-split"><article><span>HOW BABEL TREATS THIS MATERIAL</span><h2>Document the practice. Classify the claim.</h2><p>Babel can show what a grimoire says, how a ritual was historically performed, what a religious community believes, how a symbol changed over time, and what practitioners report. That does not automatically establish a supernatural mechanism.</p><ul><li>Primary texts and manuscript traditions</li><li>Religious studies, anthropology, archaeology, and history</li><li>Practitioner accounts and modern communities</li><li>Skeptical and scientific evaluation of empirical claims</li><li>Literature, film, games, and internet folklore</li></ul></article><article><span>EXPLORE</span><h2>From manuscripts to modern culture.</h2><p>Search a spell name, occult author, symbol, spirit catalogue, historical trial, magical order, tarot card, grimoire, tradition, or fictional system. Search Everywhere will build a dossier with available images, scans, papers, archives, public webpages, and related nodes.</p><div class="v17-mini-links">${['grimoires','witch trials','tarot history','occult symbols','ceremonial magic','folk magic','alchemy manuscripts','spiritualism'].map(v17Chip).join('')}</div></article></section></div>`;
  v17WireSearch();v17Bind();
}

function v17CultivationPage(){
  setTitle('Cultivation');
  app.innerHTML=`<div class="v13-wrap v13-page v17-page">${v17Head('BABEL SUBJECT ATLAS / CULTIVATION','Cultivation','One word, multiple worlds: agriculture and plant cultivation on one side; qi, Daoist self-cultivation, internal martial arts, and cultivation fiction on the other.')}
  <section class="v17-dual"><article><span>LAND / PLANTS / FOOD</span><h2>Agricultural cultivation</h2><p>Soil, crops, water, nutrients, greenhouses, hydroponics, propagation, pests, precision farming, harvests, farm economics, and food systems.</p><b>${V17_FARM.length} foundations</b></article><article><span>BODY / MIND / TRADITION</span><h2>Qi cultivation</h2><p>Qigong, neigong, neidan, dantian, breath and standing practice, Daoist cultivation, internal martial arts, plus xianxia and fictional cultivation realms.</p><b>${V17_QI.length} foundations</b></article></section>
  <section class="v17-section"><div class="v17-section-title"><span>01 / AGRICULTURE</span><h2>Grow plants, soil, farms, and food systems</h2></div><div class="v17-chip-grid">${V17_FARM.map(v17Chip).join('')}</div></section>
  <section class="v17-section"><div class="v17-section-title"><span>02 / QI + INTERNAL CULTIVATION</span><h2>Tradition, practice, martial arts, and physiology</h2></div><div class="v17-note"><b>Evidence rule</b><span>Breathing, exercise, balance, relaxation, movement, and meditation can have measurable effects. Traditional qi language is preserved in context, while extraordinary supernatural-energy claims are not presented as established physiology.</span></div><div class="v17-chip-grid">${V17_QI.map(v17Chip).join('')}</div></section>
  <section class="v17-section"><div class="v17-section-title"><span>03 / FICTION</span><h2>Cultivation worlds and progression systems</h2></div><div class="v17-fiction-grid"><button data-v17-q="xianxia cultivation realms"><b>Xianxia realms</b><span>qi condensation → foundations → cores → souls → ascension and thousands of invented variations</span></button><button data-v17-q="cultivation webnovels"><b>Webnovels</b><span>sects, spiritual roots, tribulations, alchemy, artifacts, manuals, reincarnation</span></button><button data-v17-q="cultivation games"><b>Games</b><span>turn cultivation ideas into progression systems, crafting, combat, sect management, and simulation</span></button><button data-v17-q="wuxia vs xianxia vs xuanhuan"><b>Genre map</b><span>compare martial heroes, immortality cultivation, mythology, fantasy, and invented cosmologies</span></button></div></section>
  <section class="v17-split"><article><span>REAL-WORLD AGRICULTURE</span><h2>Measure what grows.</h2><p>Agricultural pages connect theory to actual quantities: soil pH, nutrient tests, water, temperature, humidity, germination, spacing, pest counts, yields, costs, storage, and climate. Search a crop to build a full dossier around it.</p></article><article><span>QI / CULTIVATION STUDY</span><h2>Keep tradition and measurable effects together without confusing them.</h2><p>Babel can document lineage terminology, historical texts, forms, meditation instructions, biomechanics, breathing, modern research, martial applications, fictional adaptations, and criticism in one place.</p></article></section></div>`;
  v17WireSearch();v17Bind();
}

const v17BaseHome=universeHome;
universeHome=function(){
  v17BaseHome();
  const grid=document.querySelector('.v16-box-grid');if(grid&&!grid.querySelector('[href="/cultivation"]')){
    const cult=document.createElement('a');cult.href='/cultivation';cult.setAttribute('data-route','');cult.innerHTML='<span>GROW</span><h2>Cultivation</h2><p>Farming · crops · soil · hydroponics · qi · qigong · neidan · xianxia</p><i>OPEN →</i>';
    const occ=document.createElement('a');occ.href='/occult';occ.setAttribute('data-route','');occ.innerHTML='<span>ARCANA</span><h2>Occult + Witchcraft</h2><p>Witchcraft · grimoires · divination · ritual · alchemy · esotericism</p><i>OPEN →</i>';
    grid.append(cult,occ);
  }
  const quick=document.querySelector('.v16-quick');if(quick){['witchcraft','qi cultivation','hydroponics','xianxia'].forEach(q=>{if([...quick.querySelectorAll('button')].some(b=>b.textContent===q))return;const b=document.createElement('button');b.dataset.v16Q=q;b.textContent=q;b.onclick=()=>route(v9SearchRoute(q));quick.appendChild(b)})}
  wireRoutes();
};

const v17BaseSystems=systemsPage;
systemsPage=function(){
  v17BaseSystems();
  const page=document.querySelector('.page,.v13-wrap');if(!page||page.querySelector('#v17Systems'))return;
  const s=document.createElement('section');s.id='v17Systems';s.className='v17-system-additions';s.innerHTML=`<div class="v17-section-title"><span>NEW SUBJECT SYSTEMS</span><h2>Traditions and cultivation</h2></div><div class="v17-system-grid"><a href="/occult" data-route><b>Occult & Esoteric</b><span>witchcraft, grimoires, ritual magic, divination, alchemy, esotericism</span></a><a href="/cultivation" data-route><b>Cultivation</b><span>agriculture, farming, soil, hydroponics, qigong, neidan, xianxia</span></a></div>`;page.prepend(s);wireRoutes();
};

const v17BaseRender=renderRoute;
renderRoute=async function(){
  const p=location.pathname;if(p==='/occult')return v17OccultPage();if(p==='/cultivation')return v17CultivationPage();return v17BaseRender();
};
setTimeout(()=>{try{if(location.pathname==='/'||location.pathname==='/occult'||location.pathname==='/cultivation'||location.pathname==='/systems')renderRoute()}catch(e){console.error('v17 render failed',e)}},0);
