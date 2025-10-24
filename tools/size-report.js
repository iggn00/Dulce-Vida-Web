const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SKIP = new Set(['.git', '.vscode', '.idea', 'node_modules']);

function getSize(p){
  try{
    const stat = fs.statSync(p);
    if(stat.isFile()) return stat.size;
    if(stat.isDirectory()){
      const entries = fs.readdirSync(p);
      let total = 0;
      for(const e of entries){
        if(SKIP.has(e)) continue;
        total += getSize(path.join(p,e));
      }
      return total;
    }
    return 0;
  }catch{
    return 0;
  }
}

function listTopDirs(){
  const entries = fs.readdirSync(root).filter(n=>!SKIP.has(n));
  const rows = entries.map(n=>{
    const p = path.join(root,n);
    return { name: n, size: getSize(p) };
  }).sort((a,b)=>b.size-a.size);
  console.log('Top nivel en repo (MB):');
  for(const r of rows){
    console.log(r.name.padEnd(18), (r.size/1024/1024).toFixed(2));
  }
}

function listTopFiles(limit=20){
  const files = [];
  function walk(p){
    try{
      const st = fs.statSync(p);
      if(st.isFile()) files.push({p, s: st.size});
      else if(st.isDirectory()){
        if(p.includes(path.sep+'.git'+path.sep)) return;
        for(const e of fs.readdirSync(p)) walk(path.join(p,e));
      }
    }catch{}
  }
  walk(root);
  files.sort((a,b)=>b.s-a.s);
  console.log(`\nTop ${limit} archivos (MB):`);
  for(const f of files.slice(0,limit)){
    console.log((f.s/1024/1024).toFixed(2).padStart(8), f.p.replace(root+path.sep,''));
  }
}

listTopDirs();
listTopFiles();
