const fs = require('fs');
const path = require('path');

const repoUrlBase = 'https://github.com/gamertoky1188gro/A-Peronson-s-Website/blob/main/';
const root = process.cwd();
const outFile = path.join(root, 'temp13.md');

const exts = new Set(['.js','.jsx','.ts','.tsx','.mjs','.cjs','.py','.html','.css','.scss','.sass','.less','.vue','.go','.rs','.php','.rb','.java','.c','.cpp','.h','.cs','.sh','.ps1','Dockerfile','Makefile','.sql','.json','.md','.xml','.yaml','.yml','.json5']);
const excludeDirs = new Set(['.git','node_modules','dist','test-results','.cache','.vscode','.github','.lfs','backups']);

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
  if (ext === '') {
    if (path.basename(filePath) === 'Dockerfile') return 'Dockerfile (container build)';
    if (path.basename(filePath) === 'Makefile') return 'Makefile (build rules)';
  }
  return `${ext || 'file'} — implementation or config (see file)`;
}

function findLinkedFiles(filePath, content) {
  const links = new Set();
  const dir = path.dirname(filePath);
  const importRegex = /import\s+(?:[^'";]+from\s+)?["'](\.\/.+?|\.\/.+?|\.\/.+?|\..+?)["']/g;
  const requireRegex = /require\(["'](\.\/.+?|\.\/.+?|\..+?)["']\)/g;
  const genericRegex = /["'](\.\/.+?\.[a-zA-Z0-9_\-]+)["']/g;
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      const resolved = path.normalize(path.join(dir, rel));
      links.add(path.relative(root, resolved));
    } catch(e){}
  }
  while ((m = requireRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      const resolved = path.normalize(path.join(dir, rel));
      links.add(path.relative(root, resolved));
    } catch(e){}
  }
  while ((m = genericRegex.exec(content)) !== null) {
    try {
      const rel = m[1];
      if (rel.startsWith('./') || rel.startsWith('../')) {
        const resolved = path.normalize(path.join(dir, rel));
        links.add(path.relative(root, resolved));
      }
    } catch(e){}
  }

  return Array.from(links).filter(Boolean);
}

function walk(dir, files) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (excludeDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, files);
    } else if (ent.isFile()) {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      const ext = path.extname(ent.name) || (ent.name === 'Dockerfile' ? 'Dockerfile' : '');
      if (exts.has(ext) || exts.has(ent.name) ) {
        files.push(rel);
      }
    }
  }
}

const files = [];
walk(root, files);

const lines = [];
lines.push('# Generated file list');
lines.push('');
lines.push('Format: file git url or git repo file location(https://github.com/gamertoky1188gro/A-Peronson-s-Website)| why its made/or description|linked with which files');
lines.push('');

for (const rel of files.sort()) {
  const abs = path.join(root, rel);
  let content = '';
  try { content = fs.readFileSync(abs, 'utf8'); } catch(e) { content = ''; }
  const desc = inferDescription(rel, content.slice(0,400));
  const linked = findLinkedFiles(rel, content).join(', ') || '—';
  const url = repoUrlBase + rel.split('/').map(encodeURIComponent).join('/');
  lines.push(`${url} | ${desc} | ${linked}`);
}

fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log('Wrote', outFile, 'with', files.length, 'entries');
