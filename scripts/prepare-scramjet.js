const fs=require('fs');
const path=require('path');

function copyTree(src,dst){
  fs.mkdirSync(dst,{recursive:true});
  for(const entry of fs.readdirSync(src,{withFileTypes:true})){
    const a=path.join(src,entry.name),b=path.join(dst,entry.name);
    if(entry.isDirectory()) copyTree(a,b); else fs.copyFileSync(a,b);
  }
}
function resolveAssets(){
  const {scramjetPath}=require('@mercuryworkshop/scramjet/path');
  const {baremuxPath}=require('@mercuryworkshop/bare-mux/node');
  let libcurlPath;
  try{({libcurlPath}=require('@mercuryworkshop/libcurl-transport'));}
  catch{libcurlPath=path.dirname(require.resolve('@mercuryworkshop/libcurl-transport'));}
  return {scramjetPath,baremuxPath,libcurlPath};
}
const root=path.resolve(__dirname,'..');
const out=path.join(root,'public');
try{
  const a=resolveAssets();
  copyTree(a.scramjetPath,path.join(out,'scramjet'));
  copyTree(a.baremuxPath,path.join(out,'baremux'));
  copyTree(a.libcurlPath,path.join(out,'libcurl'));
  console.log('Prepared Scramjet browser assets in public/.');
}catch(err){
  console.error('Scramjet asset preparation failed:',err.message);
  process.exitCode=1;
}
