const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));

function rmrf(p){
  if(!fs.existsSync(p)) return false;
  const st = fs.statSync(p);
  if(st.isFile()){
    fs.unlinkSync(p); return true;
  }
  for(const e of fs.readdirSync(p)){
    rmrf(path.join(p,e));
  }
  fs.rmdirSync(p); return true;
}

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}); }

function cleanMavenTarget(){
  const p = path.join(root,'backend','target');
  if(rmrf(p)) console.log('Eliminado:', p);
}

function cleanNodeModules(){
  // Por defecto NO borramos node_modules. Solo si se pasa --delete-node-modules
  if(!args.has('--delete-node-modules')){
    console.log('Omitido: node_modules (use --delete-node-modules para borrarlos)');
    return;
  }
  const dirs = [path.join(root,'frontend','node_modules'), path.join(root,'tools','node_modules')];
  for(const d of dirs){ if(rmrf(d)) console.log('Eliminado:', d); }
}

function cleanStaticAssets(){
  // Mantener el index.html y los assets más recientes index-*.js y index-*.css
  const assets = path.join(root,'backend','src','main','resources','static','assets');
  if(!fs.existsSync(assets)) return;
  const files = fs.readdirSync(assets);
  const js = files.filter(f=>/^index-.*\.js$/.test(f)).map(f=>({f, t: fs.statSync(path.join(assets,f)).mtimeMs})).sort((a,b)=>b.t-a.t);
  const css = files.filter(f=>/^index-.*\.css$/.test(f)).map(f=>({f, t: fs.statSync(path.join(assets,f)).mtimeMs})).sort((a,b)=>b.t-a.t);
  const keep = new Set();
  if(js[0]) keep.add(js[0].f);
  if(css[0]) keep.add(css[0].f);
  for(const f of files){
    if(/^index-.*\.(js|css)$/.test(f) && !keep.has(f)){
      rmrf(path.join(assets,f));
      console.log('Eliminado asset viejo:', f);
    }
  }
}

function main(){
  cleanMavenTarget();
  cleanNodeModules();
  cleanStaticAssets();
  console.log('Limpieza completada.');
}

if(require.main===module) main();
