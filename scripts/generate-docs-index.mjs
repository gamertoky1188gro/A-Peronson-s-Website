import fs from 'fs/promises'
import path from 'path'

/**
 * Documentation Index Generator
 * -----------------------------
 * Goal:
 *   Produce a machine-readable index for ultra-detailed docs generation:
 *   - 1-based line references (path:line)
 *   - 3–4 line snippets for every referenced item
 *   - Extract: imports, apiRequest calls, className blocks, visible copy, section tags
 *
 * Output:
 *   - docs/_generated/index.json
 *   - docs/_generated/sources/<sanitized-path>.txt (line-numbered source snapshots)
 *
 * Notes:
 *   - This is intentionally heuristic and regex-based (fast + dependency-free).
 *   - The renderer will include "best effort" inventories and point back to sources
 *     so humans can validate any edge cases.
 */

const REPO_ROOT = process.cwd()
const GENERATED_DIR = path.join(REPO_ROOT, 'docs', '_generated')
const SOURCES_DIR = path.join(GENERATED_DIR, 'sources')

const FRONTEND_PAGES = [
  // Public pages
  'src/pages/TexHub.jsx',
  'src/pages/Pricing.jsx',
  'src/pages/About.jsx',
  'src/pages/Terms.jsx',
  'src/pages/Privacy.jsx',
  'src/pages/HelpCenter.jsx',
  'src/pages/auth/Login.jsx',
  'src/pages/auth/Signup.jsx',
  'src/pages/AccessDenied.jsx',

  // Protected pages
  'src/pages/MainFeed.jsx',
  'src/pages/SearchResults.jsx',
  'src/pages/BuyerProfile.jsx',
  'src/pages/FactoryProfile.jsx',
  'src/pages/BuyingHouseProfile.jsx',
  'src/pages/ContractVault.jsx',
  'src/pages/NotificationsCenter.jsx',
  'src/pages/ChatInterface.jsx',
  'src/pages/CallInterface.jsx',
  'src/pages/VerificationPage.jsx',
]

const STYLE_SOURCES = ['src/App.css', 'src/index.css']

const BACKEND_ENTRY = [
  'server/server.js',
  'server/routes',
  'server/controllers',
  'server/services',
  'server/utils/jsonStore.js',
  'server/database',
]

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function sanitizeForFilename(p) {
  return toPosix(p).replaceAll('/', '_').replaceAll(':', '_')
}

function snippet(lines, lineNumber1Based, count = 4) {
  const start = Math.max(1, lineNumber1Based)
  const end = Math.min(lines.length, start + count - 1)
  const out = []
  for (let i = start; i <= end; i += 1) {
    out.push(lines[i - 1])
  }
  return out.join('\n')
}

async function listFilesUnder(relDir) {
  const absDir = path.join(REPO_ROOT, relDir)
  const entries = await fs.readdir(absDir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const rel = path.join(relDir, entry.name)
    if (entry.isDirectory()) {
      const nested = await listFilesUnder(rel)
      out.push(...nested)
    } else {
      out.push(toPosix(rel))
    }
  }
  return out
}

function extractImports(lines) {
  const imports = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.startsWith('import ')) continue
    const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/)
    const source = fromMatch ? fromMatch[1] : ''
    imports.push({
      line: i + 1,
      source,
      code: snippet(lines, i + 1, 3),
    })
  }
  return imports
}

function extractApiCalls(lines) {
  const apiCalls = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.includes('apiRequest(')) continue

    const firstArg = line.match(/apiRequest\(\s*([`"'][^`"']*[`"'])/)
    const endpoint = firstArg ? firstArg[1].slice(1, -1) : ''

    // Method inference: look ahead a few lines for "method: 'X'".
    let method = 'GET'
    for (let j = i; j < Math.min(lines.length, i + 10); j += 1) {
      const m = lines[j].match(/method:\s*['"]([A-Z]+)['"]/)
      if (m) {
        method = m[1]
        break
      }
      // If we hit the end of the call quickly, stop.
      if (lines[j].includes(')')) break
    }

    apiCalls.push({
      line: i + 1,
      endpoint,
      method,
      code: snippet(lines, i + 1, 4),
    })
  }
  return apiCalls
}

function extractClassBlocks(lines) {
  const blocks = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.includes('className=')) continue

    // Capture 3–4 line excerpt.
    const code = snippet(lines, i + 1, 4)

    // Attempt to extract raw class strings inside the immediate excerpt.
    // This works for:
    //   className="..."
    //   className='...'
    //   className={[ 'a b', 'c d' ].join(' ')}
    const classStrings = []
    const excerptLines = code.split('\n')
    for (const exLine of excerptLines) {
      const q = [...exLine.matchAll(/className\s*=\s*["']([^"']+)["']/g)].map((m) => m[1])
      const s = [...exLine.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])

      // Prefer the explicit className="..." matches; otherwise keep quoted fragments (best effort).
      if (q.length) classStrings.push(...q)
      else classStrings.push(...s)
    }

    blocks.push({
      line: i + 1,
      classStrings: [...new Set(classStrings)].filter(Boolean),
      code,
    })
  }
  return blocks
}

function extractSectionTags(lines) {
  const tags = []
  const tagNames = ['header', 'main', 'section', 'aside', 'footer', 'nav']
  const tagRegex = new RegExp(`<\\s*(${tagNames.join('|')})(\\s|>)`, 'i')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const m = line.match(tagRegex)
    if (!m) continue
    tags.push({
      line: i + 1,
      tag: m[1].toLowerCase(),
      code: snippet(lines, i + 1, 4),
    })
  }
  return tags
}

function extractVisibleCopy(lines) {
  const copy = []

  // 1) Simple JSX inner-text for common tags.
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'button', 'label', 'span', 'li', 'Link']
  const tagRe = new RegExp(`<\\s*(${tags.join('|')})[^>]*>([^<{][^<]*)<\\s*/\\s*\\1\\s*>`)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const m = line.match(tagRe)
    if (m) {
      const text = String(m[2] || '').replace(/\s+/g, ' ').trim()
      if (text) {
        copy.push({ line: i + 1, text, code: snippet(lines, i + 1, 4) })
      }
    }
  }

  // 2) Attribute strings that are user-facing.
  const attrPatterns = [
    /placeholder\s*=\s*["']([^"']+)["']/g,
    /aria-label\s*=\s*["']([^"']+)["']/g,
    /title\s*=\s*["']([^"']+)["']/g,
  ]
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    for (const re of attrPatterns) {
      for (const m of line.matchAll(re)) {
        const text = String(m[1] || '').trim()
        if (text) copy.push({ line: i + 1, text, code: snippet(lines, i + 1, 4) })
      }
    }
  }

  // 3) Links/buttons presence inventory (even if their content is dynamic).
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.includes('<Link') || line.includes('<button')) {
      copy.push({
        line: i + 1,
        text: '(element) ' + (line.includes('<Link') ? '<Link>' : '<button>'),
        code: snippet(lines, i + 1, 4),
      })
    }
  }

  // Deduplicate by (line,text).
  const keySet = new Set()
  const out = []
  for (const item of copy) {
    const k = `${item.line}:${item.text}`
    if (keySet.has(k)) continue
    keySet.add(k)
    out.push(item)
  }

  return out
}

async function readFileLines(relPath) {
  const absPath = path.join(REPO_ROOT, relPath)
  const raw = await fs.readFile(absPath, 'utf-8')
  // Keep exact lines as-is; line numbers in docs should match editor view.
  return raw.split(/\r?\n/g)
}

async function writeSourceSnapshot(relPath, lines) {
  const name = sanitizeForFilename(relPath) + '.txt'
  const outPath = path.join(SOURCES_DIR, name)
  const numbered = lines.map((line, idx) => `${String(idx + 1).padStart(5, ' ')} | ${line}`).join('\n')
  await fs.writeFile(outPath, numbered, 'utf-8')
  return toPosix(path.relative(REPO_ROOT, outPath))
}

async function indexFrontendFile(relPath) {
  const lines = await readFileLines(relPath)
  return {
    path: toPosix(relPath),
    lineCount: lines.length,
    imports: extractImports(lines),
    apiCalls: extractApiCalls(lines),
    classBlocks: extractClassBlocks(lines),
    sectionTags: extractSectionTags(lines),
    visibleCopy: extractVisibleCopy(lines),
    sourceSnapshot: await writeSourceSnapshot(relPath, lines),
  }
}

async function indexStyleSources() {
  const out = []
  for (const rel of STYLE_SOURCES) {
    const lines = await readFileLines(rel)
    out.push({
      path: toPosix(rel),
      lineCount: lines.length,
      sourceSnapshot: await writeSourceSnapshot(rel, lines),
    })
  }
  return out
}

async function indexBackend() {
  // Backend is indexed in a looser way: we snapshot all files and let the renderer map endpoints.
  // This keeps the generator simple and avoids writing a full JS parser.
  const backendFiles = []

  // server/server.js (entry)
  backendFiles.push('server/server.js')

  // routes/controllers/services (all *.js)
  backendFiles.push(...(await listFilesUnder('server/routes')))
  backendFiles.push(...(await listFilesUnder('server/controllers')))
  backendFiles.push(...(await listFilesUnder('server/services')).filter((p) => p.endsWith('.js')))

  // jsonStore + db json
  backendFiles.push('server/utils/jsonStore.js')
  backendFiles.push(...(await listFilesUnder('server/database')).filter((p) => p.endsWith('.json')))

  // De-dupe
  const unique = [...new Set(backendFiles.map(toPosix))]

  const indexed = []
  for (const rel of unique) {
    const lines = await readFileLines(rel)
    indexed.push({
      path: toPosix(rel),
      lineCount: lines.length,
      // Lightweight “things we care about” extraction for the renderer:
      exports: lines
        .map((l, idx) => ({ l, idx }))
        .filter(({ l }) => l.includes('export '))
        .slice(0, 200)
        .map(({ l, idx }) => ({ line: idx + 1, code: snippet(lines, idx + 1, 3) })),
      apiMounts: rel === 'server/server.js'
        ? lines
            .map((l, idx) => ({ l, idx }))
            .filter(({ l }) => l.includes("app.use('/api/") || l.includes('app.get('))
            .map(({ l, idx }) => ({ line: idx + 1, code: snippet(lines, idx + 1, 2) }))
        : [],
      routeDefs: rel.startsWith('server/routes/')
        ? lines
            .map((l, idx) => ({ l, idx }))
            .filter(({ l }) => l.includes('router.get') || l.includes('router.post') || l.includes('router.patch') || l.includes('router.delete'))
            .map(({ l, idx }) => ({ line: idx + 1, code: snippet(lines, idx + 1, 2) }))
        : [],
      jsonReads: lines
        .map((l, idx) => ({ l, idx }))
        .filter(({ l }) => l.includes("readJson('") || l.includes('readJson("'))
        .map(({ l, idx }) => ({ line: idx + 1, code: snippet(lines, idx + 1, 3) })),
      sourceSnapshot: await writeSourceSnapshot(rel, lines),
    })
  }

  return indexed
}

async function main() {
  await fs.mkdir(SOURCES_DIR, { recursive: true })

  const frontend = []
  for (const rel of FRONTEND_PAGES) {
    frontend.push(await indexFrontendFile(rel))
  }

  const styles = await indexStyleSources()
  const backend = await indexBackend()

  const payload = {
    generatedAt: new Date().toISOString(),
    repoRoot: toPosix(REPO_ROOT),
    frontend,
    styles,
    backend,
  }

  await fs.writeFile(path.join(GENERATED_DIR, 'index.json'), JSON.stringify(payload, null, 2), 'utf-8')
  process.stdout.write(`Wrote ${toPosix(path.relative(REPO_ROOT, path.join(GENERATED_DIR, 'index.json')))}\n`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

