const fs = require('fs');
const path = require('path');

const root = process.cwd();
const listFile = path.join(root, 'scripts', 'file_list_all_filtered.txt');
const outFile = path.join(root, 'temp13.md');
const repoUrlBase = 'https://github.com/gamertoky1188gro/A-Peronson-s-Website/blob/main/';

function inferDescription(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath).toLowerCase();
  if (name === 'package.json') return 'NPM manifest (dependencies, scripts)';
  if (name === 'package-lock.json') return 'NPM lockfile';
  if (name === 'readme.md') return 'Project documentation / README';
  if (ext === '.md') return 'Markdown documentation or notes';
  if (ext === '.json') return 'JSON data or config file';
  if (ext === '.html') return 'HTML page/template';
  if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less') return 'Stylesheet';
  if (ext === '.js' || ext === '.mjs' || ext === '.cjs') {
    if (/react|jsx|component/i.test(content)) return 'JavaScript (React) component or module';
    return 'JavaScript source file or module';
  }
  if (ext === '.ts' || ext === '.tsx') return 'TypeScript source or React TypeScript component';
  if (ext === '.py') return 'Python script/module';
  if (ext === '.sh' || ext === '.ps1') return 'Shell/PowerShell script';
  if (path.basename(filePath) === 'Dockerfile') return 'Dockerfile (container build)';
  if (path.basename(filePath) === 'Makefile') return 'Makefile (build rules)';
  return `${ext || 'file'} — implementation or config`;
}

function findLinkedFiles(root, filePath, content) {
  const links = new Set();
  const dir = path.dirname(path.join(root, filePath));
  const importRegex = /import\s+(?:[^'";]+from\s+)?["'](\.\/.+?|\..+?)["']/g;
  const requireRegex = /require\(["'](\.\/.+?|\..+?)["']\)/g;
  const genericRegex = /["'](\.\/.+?\.[a-zA-Z0-9_\-]+)["']/g;
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      const resolved = path.normalize(path.join(dir, rel));
      links.add(path.relative(root, resolved).replace(/\\/g, '/'));
    } catch(e){}
  }
  while ((m = requireRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      const resolved = path.normalize(path.join(dir, rel));
      links.add(path.relative(root, resolved).replace(/\\/g, '/'));
    } catch(e){}
  }
  while ((m = genericRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      if (rel.startsWith('./') || rel.startsWith('../')) {
        const resolved = path.normalize(path.join(dir, rel));
        links.add(path.relative(root, resolved).replace(/\\/g, '/'));
      }
    } catch(e){}
  }
  return Array.from(links).filter(Boolean);
}

let list;
try {
  list = fs.readFileSync(listFile, 'utf8').split(/\r?\n/).filter(Boolean);
} catch(e) {
  console.error('Could not read file list:', e.message); process.exit(1);
}

const header = [];
header.push('# temp13.md — Repository file index');
header.push('');
header.push('Format: file git url | description | linked files | lines | words | chars');
header.push('');
header.push('| File | Description | Linked Files | Lines | Words | Chars |');
header.push('|---|---|---|---:|---:|---:|');

const rows = [];
for (const rel of list) {
  const abs = path.join(root, rel);
  let content = '';
  try { content = fs.readFileSync(abs, 'utf8'); } catch(e) { content = ''; }
  const desc = inferDescription(rel, content.slice(0,400));
  const linkedArr = findLinkedFiles(root, rel, content);
  const linked = linkedArr.length ? linkedArr.join(', ') : '—';
  const lines = content ? content.split(/\r?\n/).length : 0;
  const words = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const chars = content ? content.length : 0;
  const url = repoUrlBase + rel.split('/').map(encodeURIComponent).join('/');
  // escape pipe in URL/strings
  const safeUrl = url.replace(/\|/g, '%7C');
  const safeDesc = desc.replace(/\|/g, '%7C');
  const safeLinked = linked.replace(/\|/g, '%7C');
  rows.push(`| ${safeUrl} | ${safeDesc} | ${safeLinked} | ${lines} | ${words} | ${chars} |`);
}

const contentOut = header.concat(rows).join('\n');
fs.writeFileSync(outFile, contentOut, 'utf8');
console.log('Wrote', outFile, 'with', rows.length, 'rows');
