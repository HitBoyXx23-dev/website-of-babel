const fs=require('fs');
const crypto=require('crypto');
const path=require('path');
const root=path.resolve(__dirname,'..');
const meta=JSON.parse(fs.readFileSync(path.join(root,'public/data/math-constants.json'),'utf8'));
const prefixes={
  pi:'314159265358979323846264338327950288419716939937510',
  e:'271828182845904523536028747135266249775724709369995',
  phi:'161803398874989484820458683436563811772030917980576',
  sqrt2:'141421356237309504880168872420969807856967187537694',
  sqrt3:'173205080756887729352744634150587236694280525381038',
  ln2:'069314718055994530941723212145817656807550013436025'
};
for(const [name,m] of Object.entries(meta)){
  const file=path.join(root,'public',m.file);
  const digits=fs.readFileSync(file,'utf8').replace(/\D/g,'');
  const hash=crypto.createHash('sha256').update(digits).digest('hex');
  if(digits.length!==m.digits)throw new Error(`${name}: expected ${m.digits} digits, got ${digits.length}`);
  if(!digits.startsWith(prefixes[name]))throw new Error(`${name}: known-prefix check failed`);
  if(hash!==m.sha256)throw new Error(`${name}: SHA-256 mismatch`);
  console.log(`verified ${name}: ${digits.length.toLocaleString()} digits · ${hash.slice(0,16)}…`);
}
const universe=JSON.parse(fs.readFileSync(path.join(root,'public/data/universe-numbers.json'),'utf8'));
if(!Array.isArray(universe.groups)||universe.groups.length<3)throw new Error('universe-numbers.json missing groups');
for(const group of universe.groups){
  if(!group.source||!/^https:\/\//.test(group.source))throw new Error(`source missing: ${group.name}`);
  if(!Array.isArray(group.items)||!group.items.length)throw new Error(`items missing: ${group.name}`);
}
console.log(`verified universe number groups: ${universe.groups.length}`);
