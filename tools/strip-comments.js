const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');
let stripCss = null;
try {
  const m = require('strip-css-comments');
  stripCss = typeof m === 'function' ? m : (m && m.default ? m.default : null);
} catch {}

const repoRoot = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'target', '.vscode', '.idea', 'generated-sources', 'generated-test-sources']);

function isTextFile(file) {
  // Por seguridad, excluimos .js/.jsx (pueden contener URLs http:// que confunden los quitadores de comentarios)
  return /(\.(java|sql|css|html|htm|xml|properties))$/i.test(file);
}

function stripHtml(content) {
  return content.replace(/<!--([\s\S]*?)-->/g, '');
}

function stripProperties(content) {
  return content
    .split(/\r?\n/)
    .filter(line => !/^\s*[#!]/.test(line))
    .join('\n');
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  const ext = path.extname(file).toLowerCase();

  try {
    if (ext === '.css') {
      if (!stripCss) throw new Error('stripCss not available');
      content = stripCss(content, { preserve: false });
    } else if (ext === '.java') {
      content = strip(content, { language: 'java' });
    } else if (ext === '.sql') {
      content = strip(content, { language: 'sql' });
    } else if (ext === '.html' || ext === '.htm' || ext === '.xml') {
      content = stripHtml(content);
    } else if (ext === '.properties') {
      content = stripProperties(content);
    }
  } catch (e) {
    console.warn(`No se pudo procesar ${file}: ${e.message}`);
    return { file, changed: false, error: e.message };
  }

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    return { file, changed: true };
  }
  return { file, changed: false };
}

function walk(dir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(p, results);
    } else if (ent.isFile() && isTextFile(ent.name)) {
      if (p === __filename) continue; // no auto-modificarse
      const r = processFile(p);
      results.push(r);
    }
  }
}

function main() {
  const results = [];
  walk(repoRoot, results);
  const changed = results.filter(r => r.changed).length;
  const failed = results.filter(r => r.error).length;
  console.log(`Procesados: ${results.length}. Modificados: ${changed}. Fallidos: ${failed}.`);
}

if (require.main === module) {
  main();
}
