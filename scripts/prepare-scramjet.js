const fs=require('fs');
const path=require('path');

function copyTree(src,dst){
  fs.rmSync(dst,{recursive:true,force:true});
  fs.mkdirSync(dst,{recursive:true});
  for(const entry of fs.readdirSync(src,{withFileTypes:true})){
    const a=path.join(src,entry.name),b=path.join(dst,entry.name);
    if(entry.isDirectory()) copyTreeInto(a,b); else fs.copyFileSync(a,b);
  }
}
function copyTreeInto(src,dst){
  fs.mkdirSync(dst,{recursive:true});
  for(const entry of fs.readdirSync(src,{withFileTypes:true})){
    const a=path.join(src,entry.name),b=path.join(dst,entry.name);
    if(entry.isDirectory()) copyTreeInto(a,b); else fs.copyFileSync(a,b);
  }
}
function dirOf(specifier){return path.dirname(require.resolve(specifier));}

const root=path.resolve(__dirname,'..');
const out=path.join(root,'public');
try{
  const {scramjetPath}=require('@mercuryworkshop/scramjet/path');
  const controllerPath=dirOf('@mercuryworkshop/scramjet-controller');
  const utilsPath=dirOf('@mercuryworkshop/scramjet-utils');
  const libcurlPath=dirOf('@mercuryworkshop/libcurl-transport');
  const bareTransportPath=dirOf('@mercuryworkshop/bare-transport');

  for(const old of ['scramjet','baremux','libcurl','scram','controller','utils','baremod']){
    fs.rmSync(path.join(out,old),{recursive:true,force:true});
  }
  fs.rmSync(path.join(out,'scramjet-sw.js'),{force:true});
  fs.rmSync(path.join(out,'scramjet-v2-sw.js'),{force:true});

  copyTree(scramjetPath,path.join(out,'scram'));
  copyTree(controllerPath,path.join(out,'controller'));
  copyTree(utilsPath,path.join(out,'utils'));
  copyTree(libcurlPath,path.join(out,'libcurl'));
  copyTree(bareTransportPath,path.join(out,'baremod'));

  // Scramjet 2's controller.sw.js is a library, not a complete service worker.
  // The wrapper below is the required routing layer documented by the v2 controller.
  const sw=`/* Website Of Babel Scramjet 2 service worker */\n`+
`importScripts('/controller/controller.sw.js');\n`+
`self.addEventListener('fetch',event=>{\n`+
`  try{\n`+
`    if(self.$scramjetController && $scramjetController.shouldRoute(event)){\n`+
`      event.respondWith($scramjetController.route(event));\n`+
`    }\n`+
`  }catch(error){\n`+
`    console.error('[Babel Scramjet SW] route error',error);\n`+
`  }\n`+
`});\n`+
`self.addEventListener('install',()=>self.skipWaiting());\n`+
`self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));\n`;
  fs.writeFileSync(path.join(out,'scramjet-v2-sw.js'),sw);

  const required=[
    path.join(out,'scram','scramjet.js'),
    path.join(out,'scram','scramjet.wasm'),
    path.join(out,'controller','controller.api.js'),
    path.join(out,'controller','controller.inject.js'),
    path.join(out,'controller','controller.sw.js'),
    path.join(out,'utils','scramjet-utils.js'),
    path.join(out,'libcurl','index.mjs'),
    path.join(out,'baremod','index.mjs'),
    path.join(out,'scramjet-v2-sw.js')
  ];
  for(const file of required)if(!fs.existsSync(file))throw new Error(`Missing Scramjet v2 build asset: ${path.relative(root,file)}`);
  console.log('Prepared Scramjet v2 assets: core, controller, utils, Bare transport, optional libcurl transport and routing service worker.');
}catch(err){
  console.error('Scramjet v2 asset preparation failed:',err.stack||err.message);
  process.exitCode=1;
}
