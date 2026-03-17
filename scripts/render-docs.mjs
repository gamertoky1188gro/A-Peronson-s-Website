import fs from 'fs/promises'
import path from 'path'

/**
 * Docs Renderer
 * -------------
 * Reads: docs/_generated/index.json (produced by generate-docs-index.mjs)
 * Writes:
 *   - docs/pages/*.md (overwrites existing)
 *   - docs/server/*.md (updates key backend docs; adds Profile.md if needed)
 *   - docs/DOCS_CONVENTIONS.md
 *   - updates docs/pages/README.md and docs/server/README.md
 *
 * Philosophy:
 *   - Deterministic output: stable ordering and consistent headings.
 *   - Ultra-detailed: every className block + copy inventory + API -> backend mapping.
 *   - Everything inline (even for large pages like chat/call), as requested.
 */

const REPO_ROOT = process.cwd()
const GENERATED_INDEX = path.join(REPO_ROOT, 'docs', '_generated', 'index.json')

const DOCS_PAGES_DIR = path.join(REPO_ROOT, 'docs', 'pages')
const DOCS_SERVER_DIR = path.join(REPO_ROOT, 'docs', 'server')

const REQUIRED_ROLES = ['buyer', 'buying_house', 'factory', 'owner', 'admin', 'agent']

const PAGE_CONFIG = [
  // Public
  { route: '/', name: 'TexHub', file: 'TexHub.md', src: 'src/pages/TexHub.jsx', access: 'Public' },
  { route: '/pricing', name: 'Pricing', file: 'Pricing.md', src: 'src/pages/Pricing.jsx', access: 'Public' },
  { route: '/about', name: 'About', file: 'About.md', src: 'src/pages/About.jsx', access: 'Public' },
  { route: '/terms', name: 'Terms', file: 'Terms.md', src: 'src/pages/Terms.jsx', access: 'Public' },
  { route: '/privacy', name: 'Privacy', file: 'Privacy.md', src: 'src/pages/Privacy.jsx', access: 'Public' },
  { route: '/help', name: 'HelpCenter', file: 'HelpCenter.md', src: 'src/pages/HelpCenter.jsx', access: 'Public' },
  { route: '/login', name: 'Login', file: 'Login.md', src: 'src/pages/auth/Login.jsx', access: 'Public' },
  { route: '/signup', name: 'Signup', file: 'Signup.md', src: 'src/pages/auth/Signup.jsx', access: 'Public' },
  { route: '/access-denied', name: 'AccessDenied', file: 'AccessDenied.md', src: 'src/pages/AccessDenied.jsx', access: 'Public' },

  // Protected
  { route: '/feed', name: 'MainFeed', file: 'MainFeed.md', src: 'src/pages/MainFeed.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/search', name: 'SearchResults', file: 'SearchResults.md', src: 'src/pages/SearchResults.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/buyer/:id', name: 'BuyerProfile', file: 'BuyerProfile.md', src: 'src/pages/BuyerProfile.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/factory/:id', name: 'FactoryProfile', file: 'FactoryProfile.md', src: 'src/pages/FactoryProfile.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/buying-house/:id', name: 'BuyingHouseProfile', file: 'BuyingHouseProfile.md', src: 'src/pages/BuyingHouseProfile.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/contracts', name: 'ContractVault', file: 'ContractVault.md', src: 'src/pages/ContractVault.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/notifications', name: 'NotificationsCenter', file: 'NotificationsCenter.md', src: 'src/pages/NotificationsCenter.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/chat', name: 'ChatInterface', file: 'ChatInterface.md', src: 'src/pages/ChatInterface.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/call', name: 'CallInterface', file: 'CallInterface.md', src: 'src/pages/CallInterface.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/verification', name: 'VerificationPage', file: 'VerificationPage.md', src: 'src/pages/VerificationPage.jsx', access: 'Protected', roles: REQUIRED_ROLES },
  { route: '/verification-center', name: 'VerificationCenter', file: 'VerificationCenter.md', src: 'src/pages/VerificationPage.jsx', access: 'Protected', roles: REQUIRED_ROLES, aliasOf: '/verification' },
]

const CUSTOM_CSS_NAMES = [
  'nav-glass',
  'spotlight-card',
  'skeleton',
  'neo-page',
  'neo-panel',
  'cyberpunk-page',
  'cyberpunk-card',
  'assistant-orb-btn',
  'legal-weave',
  'signature-draw',
  'verified-shimmer',
  'verified-pulse',
  'conic-beam',
]

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function mdEscape(text) {
  return String(text || '').replaceAll('|', '\\|')
}

function fencedSnippet(code, lang = 'jsx') {
  return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
}

function groupTailwindTokens(tokens) {
  const groups = {
    layout: [],
    spacing: [],
    typography: [],
    color: [],
    bordersRingsShadows: [],
    responsive: [],
    dark: [],
    interaction: [],
    other: [],
  }

  const responsivePrefixes = ['sm:', 'md:', 'lg:', 'xl:', '2xl:']
  const darkPrefix = 'dark:'
  const interactionPrefixes = ['hover:', 'focus:', 'focus-within:', 'active:', 'group-hover:', 'disabled:', 'motion-safe:', 'motion-reduce:']

  const isSpacing = (t) => /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space)-/.test(t)
  const isLayout = (t) =>
    /^(flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|inset|top|left|right|bottom|z|overflow|w|h|min|max|col|row|items|justify|content|place|self|order|aspect|container|float|clear|truncate|whitespace|break|line-clamp)/.test(t)
  const isTypography = (t) => /^(text-|font-|tracking-|leading-|uppercase|lowercase|capitalize|italic|not-italic|antialiased)/.test(t)
  const isColor = (t) => /^(bg-|from-|via-|to-|fill-|stroke-|opacity-|backdrop-|text-\[|bg-\[)/.test(t)
  const isBorders = (t) => /^(border|ring|outline|shadow|rounded|divide)/.test(t)
  const isInteraction = (t) => interactionPrefixes.some((p) => t.startsWith(p)) || /^(transition|duration-|ease-|animate-|will-change|transform|scale-|translate-|rotate-)/.test(t)
  const isDark = (t) => t.startsWith(darkPrefix)
  const isResponsive = (t) => responsivePrefixes.some((p) => t.startsWith(p))

  for (const token of tokens) {
    if (!token) continue
    if (isDark(token)) groups.dark.push(token)
    else if (isResponsive(token)) groups.responsive.push(token)
    else if (isInteraction(token)) groups.interaction.push(token)
    else if (isBorders(token)) groups.bordersRingsShadows.push(token)
    else if (isColor(token)) groups.color.push(token)
    else if (isTypography(token)) groups.typography.push(token)
    else if (isSpacing(token)) groups.spacing.push(token)
    else if (isLayout(token)) groups.layout.push(token)
    else groups.other.push(token)
  }

  return groups
}

function explainToken(token) {
  // Generic explanations for common patterns.
  if (token.startsWith('p-')) return 'Padding (all sides).'
  if (token.startsWith('px-')) return 'Horizontal padding (left/right).'
  if (token.startsWith('py-')) return 'Vertical padding (top/bottom).'
  if (token.startsWith('m-')) return 'Margin (all sides).'
  if (token.startsWith('mx-')) return 'Horizontal margin (left/right).'
  if (token.startsWith('my-')) return 'Vertical margin (top/bottom).'
  if (token.startsWith('bg-')) return 'Background color/surface.'
  if (token.startsWith('text-')) return 'Text color or text sizing.'
  if (token.startsWith('rounded')) return 'Corner radius.'
  if (token.startsWith('shadow')) return 'Drop shadow depth (elevation).'
  if (token.startsWith('ring')) return 'Outline ring (often used instead of borders in dark mode).'
  if (token.startsWith('border')) return 'Border style/width/color.'
  if (token.startsWith('grid')) return 'Grid layout.'
  if (token.startsWith('flex')) return 'Flex layout.'
  if (token.includes(':')) return 'Variant prefix (responsive, dark, or interaction state).'
  return 'Utility class (see Tailwind docs or local CSS utilities for custom classes).'
}

function getAllTokens(classStrings) {
  const tokens = []
  for (const s of classStrings || []) {
    for (const t of String(s).split(/\s+/g)) tokens.push(t.trim())
  }
  return [...new Set(tokens)].filter(Boolean)
}

function findCssRefs(styleFilesByPath, className) {
  const refs = []
  const needle = `.${className}`
  for (const styleFile of styleFilesByPath.values()) {
    const lines = styleFile.lines
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes(needle)) {
        refs.push({ path: styleFile.path, line: i + 1 })
        break
      }
    }
  }
  return refs
}

function buildBackendMap(backendFiles) {
  // Build:
  //  - app.use mounts from server/server.js
  //  - router.* endpoints from routes files
  //  - controller import resolution from routes files
  const filesByPath = new Map(backendFiles.map((f) => [f.path, f]))

  const serverEntry = filesByPath.get('server/server.js')
  const mounts = []
  const imports = new Map() // varName -> route file

  if (serverEntry) {
    const lines = serverEntry.lines
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i]
      // import xxx from './routes/xxxRoutes.js'
      const im = line.match(/^import\s+(\w+)\s+from\s+['"]\.\/routes\/([^'"]+)['"]/)
      if (im) {
        imports.set(im[1], `server/routes/${im[2]}`)
      }
      const use = line.match(/app\.use\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/)
      if (use) {
        mounts.push({ line: i + 1, prefix: use[1], routerVar: use[2], routeFile: imports.get(use[2]) || '' })
      }
    }
  }

  // Route definitions for each router file.
  // We parse across multiple lines so we can capture the full middleware stack.
  const routeDefs = []
  for (const file of filesByPath.values()) {
    if (!file.path.startsWith('server/routes/') || !file.path.endsWith('.js')) continue
    const lines = file.lines

    // Controller imports in route file:
    // import { a, b } from '../controllers/xController.js'
    const controllerImports = new Map() // handler -> controllerFile
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i]
      const m = line.match(/^import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/controllers\/([^'"]+)['"]/)
      if (m) {
        const names = m[1].split(',').map((s) => s.trim()).filter(Boolean)
        for (const n of names) controllerImports.set(n, `server/controllers/${m[2]}`)
      }
    }

    // Multi-line router call extraction:
    // - Find a line containing "router.get(" etc.
    // - Accumulate until parentheses are balanced (simple counter).
    const startRe = /router\.(get|post|patch|delete)\(/
    for (let i = 0; i < lines.length; i += 1) {
      if (!startRe.test(lines[i])) continue

      const startLine = i + 1
      let text = lines[i]
      let depth = (lines[i].match(/\(/g) || []).length - (lines[i].match(/\)/g) || []).length
      let j = i
      while (depth > 0 && j + 1 < lines.length && j < i + 40) {
        j += 1
        text += '\n' + lines[j]
        depth += (lines[j].match(/\(/g) || []).length - (lines[j].match(/\)/g) || []).length
      }

      const head = text.match(/router\.(get|post|patch|delete)\(\s*['"]([^'"]+)['"]\s*,([\s\S]*)\)\s*;?/)
      if (!head) continue

      const method = head[1].toUpperCase()
      const routePath = head[2]
      const argsStr = head[3]

      // Split args on commas at top-level (ignore commas inside (), {}, []).
      const args = []
      let current = ''
      let paren = 0
      let brace = 0
      let bracket = 0
      for (const ch of argsStr) {
        if (ch === '(') paren += 1
        else if (ch === ')') paren -= 1
        else if (ch === '{') brace += 1
        else if (ch === '}') brace -= 1
        else if (ch === '[') bracket += 1
        else if (ch === ']') bracket -= 1

        if (ch === ',' && paren === 0 && brace === 0 && bracket === 0) {
          const part = current.trim()
          if (part) args.push(part)
          current = ''
          continue
        }
        current += ch
      }
      const last = current.trim()
      if (last) args.push(last)

      const handler = args.length ? args[args.length - 1].trim() : ''
      const middlewares = args.slice(0, -1).map((a) => a.trim()).filter(Boolean)

      routeDefs.push({
        routeFile: file.path,
        line: startLine,
        method,
        routePath,
        handler,
        middlewares,
        controllerFile: controllerImports.get(handler) || '',
        code: text.split('\n').slice(0, 4).join('\n'),
      })

      i = j
    }
  }

  return { mounts, routeDefs }
}

function matchApiToBackend({ endpoint, method, backendMap }) {
  // Given a frontend endpoint like "/system/home", locate:
  //  - mount: /api/system -> server/routes/systemRoutes.js
  //  - router definition: GET /home -> controller handler
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  // Find longest mount prefix that matches `/api/<prefix>` + normalized first segment.
  // We assume apiRequest uses paths relative to /api, e.g. apiRequest('/system/home').
  const segs = normalized.split('/').filter(Boolean)
  const top = segs[0] ? `/api/${segs[0]}` : ''
  const mount = backendMap.mounts.find((m) => m.prefix === top) || null
  if (!mount) return null

  const remainder = '/' + segs.slice(1).join('/')
  const def = backendMap.routeDefs.find((d) => d.routeFile === mount.routeFile && d.method === method && d.routePath === remainder) || null

  return {
    mount,
    routeDef: def,
  }
}

async function readIndex() {
  const raw = await fs.readFile(GENERATED_INDEX, 'utf-8')
  const parsed = JSON.parse(raw)

  // Attach full lines to backend/style files (for line searching).
  // The generator does not store lines to keep index.json smaller; we reconstruct from source snapshots.
  const attachLines = async (file) => {
    const absSnapshot = path.join(REPO_ROOT, file.sourceSnapshot)
    const snap = await fs.readFile(absSnapshot, 'utf-8')
    // snapshot format: "  123 | <line>"
    const lines = snap.split(/\r?\n/g).map((l) => l.replace(/^\s*\d+\s+\|\s?/, ''))
    return { ...file, lines }
  }

  const frontend = []
  for (const f of parsed.frontend) frontend.push(await attachLines(f))

  const styles = []
  for (const f of parsed.styles) styles.push(await attachLines(f))

  const backend = []
  for (const f of parsed.backend) backend.push(await attachLines(f))

  return { ...parsed, frontend, styles, backend }
}

async function writeFileEnsured(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf-8')
}

function buildPageDoc({ page, indexedPage, styleFilesByPath, backendMap }) {
  const title = `${page.name} - Route \`${page.route}\``

  const imports = indexedPage.imports || []
  const apiCalls = (indexedPage.apiCalls || []).filter((c) => c.endpoint)
  const classBlocks = indexedPage.classBlocks || []
  const visibleCopy = indexedPage.visibleCopy || []
  const sectionTags = indexedPage.sectionTags || []

  // Backend mapping table rows
  const backendRows = []
  for (const call of apiCalls) {
    const match = matchApiToBackend({ endpoint: call.endpoint, method: call.method, backendMap })
    const mount = match?.mount
    const def = match?.routeDef
    backendRows.push({
      frontend: `${call.method} ${call.endpoint} (${indexedPage.path}:${call.line})`,
      express: mount ? `${mount.prefix} -> ${mount.routeFile}:${mount.line}` : '-',
      route: def ? `${def.method} ${def.routePath} (${def.routeFile}:${def.line})` : '-',
      controller: def?.controllerFile ? `${def.controllerFile}` : '-',
      handler: def?.handler ? def.handler : '-',
    })
  }

  const customCssRefs = CUSTOM_CSS_NAMES
    .map((name) => ({ name, refs: findCssRefs(styleFilesByPath, name) }))
    .filter((r) => r.refs.length > 0)

  const childComponents = imports
    .filter((im) => im.source.startsWith('../') || im.source.startsWith('./'))
    .map((im) => `- ${im.source} (${indexedPage.path}:${im.line})`)

  const pageAccessLine = page.access === 'Protected'
    ? `**Access:** Protected (Login required). **Roles:** ${page.roles?.join(', ') || '(see router)'}`
    : '**Access:** Public'

  let md = ''
  md += `# ${title}\n\n`
  md += `${pageAccessLine}\n\n`

  if (page.aliasOf) {
    md += `> Alias: \`${page.route}\` renders the same component as \`${page.aliasOf}\`.\n\n`
  }

  md += `## 1) Purpose\n\n`
  md += `- **Why it exists:** See the route header comment in \`${indexedPage.path}\`.\n`
  md += `- **Backend interactions:** ${apiCalls.length ? 'Yes (see API map below).' : 'None (static page / client-only interactions).'}\n`
  md += `- **Primary file:** \`${indexedPage.path}\`\n`
  md += `- **Source snapshot:** \`${indexedPage.sourceSnapshot}\` (line-numbered)\n\n`

  md += `## 2) Page Structure (Components + Sections)\n\n`
  md += `### 2.1 Imported child components\n\n`
  md += childComponents.length ? `${childComponents.join('\n')}\n\n` : '_No local component imports detected._\n\n'

  md += `### 2.2 Structural section tags in JSX\n\n`
  if (!sectionTags.length) {
    md += `_No <header/main/section/aside/footer/nav> tags detected by the heuristic extractor._\n\n`
  } else {
    for (const tag of sectionTags) {
      md += `- \`${tag.tag}\` at \`${indexedPage.path}:${tag.line}\`\n`
      md += fencedSnippet(tag.code, 'jsx')
    }
  }

  md += `## 3) Styling (className blocks, utility breakdown, and custom CSS)\n\n`
  md += `### 3.1 Custom CSS utilities referenced by this page (App.css / index.css)\n\n`
  if (!customCssRefs.length) {
    md += `_No custom utility classes found in global CSS for the common class list._\n\n`
  } else {
    for (const item of customCssRefs) {
      md += `- \`.${item.name}\` definitions:\n`
      for (const ref of item.refs) md += `  - \`${ref.path}:${ref.line}\`\n`
    }
    md += '\n'
  }

  md += `### 3.2 Every className block (with grouped explanations)\n\n`
  for (const block of classBlocks) {
    const tokens = getAllTokens(block.classStrings)
    const grouped = groupTailwindTokens(tokens)

    md += `#### \`${indexedPage.path}:${block.line}\`\n`
    md += fencedSnippet(block.code, 'jsx')

    md += `**Raw class strings detected (best effort):**\n\n`
    if (!block.classStrings.length) {
      md += `- _(dynamic className; inspect the snippet above)_\n\n`
    } else {
      for (const s of block.classStrings) md += `- \`${s}\`\n`
      md += '\n'
    }

    md += `**Utility breakdown (grouped):**\n\n`
    const groupOrder = [
      ['layout', 'Layout / positioning'],
      ['spacing', 'Spacing'],
      ['typography', 'Typography'],
      ['color', 'Color / surface'],
      ['bordersRingsShadows', 'Borders / rings / shadows'],
      ['interaction', 'Interaction / motion'],
      ['responsive', 'Responsive variants'],
      ['dark', 'Dark mode variants'],
      ['other', 'Other'],
    ]

    for (const [key, label] of groupOrder) {
      const list = grouped[key] || []
      if (!list.length) continue
      md += `- **${label}:**\n`
      for (const t of list) {
        md += `  - \`${t}\` — ${explainToken(t)}\n`
      }
    }

    md += '\n'
  }

  md += `## 4) Content Inventory (all extracted visible copy + element anchors)\n\n`
  md += `> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.\n\n`

  for (const item of visibleCopy) {
    md += `- \`${indexedPage.path}:${item.line}\` — ${mdEscape(item.text)}\n`
    md += fencedSnippet(item.code, 'jsx')
  }

  md += `## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)\n\n`
  if (!backendRows.length) {
    md += `_No API calls detected in this page._\n\n`
  } else {
    md += `| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |\n`
    md += `|---|---|---|---|---|\n`
    for (const row of backendRows) {
      md += `| ${mdEscape(row.frontend)} | ${mdEscape(row.express)} | ${mdEscape(row.route)} | ${mdEscape(row.controller)} | ${mdEscape(row.handler)} |\n`
    }
    md += '\n'
  }

  md += `## 6) How to Edit Safely\n\n`
  md += `- **Change copy/text:** search in \`${indexedPage.path}\` and update the JSX text nodes or string literals (use the Content Inventory references above).\n`
  md += `- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.\n`
  md += `- **Change styling:** edit the relevant \`className\` block; for global utilities see:\n`
  md += `  - \`src/App.css\`\n`
  md += `  - \`src/index.css\` (contains global dark-mode overrides that can affect borders/shadows)\n`
  md += `- **When line numbers drift:** re-run \`npm run docs:generate\` to refresh ` + '`path:line`' + ` references.\n\n`

  return md
}

function buildServerDocIndex(backendMap) {
  // Group routeDefs by routeFile for simpler rendering.
  const map = new Map()
  for (const def of backendMap.routeDefs) {
    const key = def.routeFile
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(def)
  }
  for (const list of map.values()) list.sort((a, b) => a.line - b.line)
  return map
}

function findControllerFunction({ backendFilesByPath, controllerFile, handler }) {
  const file = backendFilesByPath.get(controllerFile)
  if (!file) return null
  const lines = file.lines

  // Common patterns:
  //   export async function handlerName(req, res) { ... }
  //   export function handlerName(req, res) { ... }
  const re = new RegExp(`export\\s+(async\\s+)?function\\s+${handler}\\s*\\(`)
  let start = -1
  for (let i = 0; i < lines.length; i += 1) {
    if (re.test(lines[i])) {
      start = i
      break
    }
  }
  if (start === -1) return null

  // Capture until next exported function or EOF (bounded).
  let end = Math.min(lines.length, start + 120)
  for (let i = start + 1; i < Math.min(lines.length, start + 260); i += 1) {
    if (lines[i].startsWith('export ') && lines[i].includes('function ') && i !== start) {
      end = i
      break
    }
  }

  return { line: start + 1, excerpt: lines.slice(start, end).join('\n') }
}

function buildServerDoc({ title, routes, mounts, backendFilesByPath }) {
  let md = `# ${title}\n\n`
  md += `This doc is generated from source snapshots with \`path:line\` references.\n\n`

  md += `## Mounted prefixes\n\n`
  for (const m of mounts) {
    md += `- \`${m.prefix}\` -> \`${m.routeFile}:${m.line}\` (router var: \`${m.routerVar}\`)\n`
  }
  md += '\n'

  md += `## Routes (ultra-detailed)\n\n`
  for (const r of routes) {
    const mount = mounts.find((m) => m.routeFile === r.routeFile) || null
    const fullPath = mount ? `${mount.prefix}${r.routePath}` : r.routePath

    md += `### ${r.method} \`${fullPath}\`\n\n`
    md += `- **Route definition:** \`${r.routeFile}:${r.line}\`\n`
    md += fencedSnippet(r.code || '', 'js')

    md += `- **Middleware stack (in order):**\n`
    if (!r.middlewares || r.middlewares.length === 0) {
      md += `  - _none detected_\n`
    } else {
      for (const mw of r.middlewares) md += `  - \`${mw}\`\n`
    }
    md += `- **Handler:** \`${r.handler || '—'}\`\n`
    md += `- **Controller file:** \`${r.controllerFile || '—'}\`\n\n`

    if (r.controllerFile && r.handler) {
      const fn = findControllerFunction({ backendFilesByPath, controllerFile: r.controllerFile, handler: r.handler })
      if (fn) {
        md += `#### Controller implementation: \`${r.controllerFile}:${fn.line}\`\n`
        md += fencedSnippet(fn.excerpt, 'js')
      } else {
        md += `_Could not locate exported function \`${r.handler}\` in \`${r.controllerFile}\`._\n\n`
      }
    }
  }

  md += `## Persistence model (JSON-backed "DB")\n\n`
  md += `- JSON helpers: \`server/utils/jsonStore.js\` (readJson/writeJson/updateJson).\n`
  md += `- Data files: \`server/database/*.json\`.\n`
  md += `- Controllers/services often read from \`users.json\`, \`messages.json\`, \`metrics.json\`, etc.\n\n`

  return md
}

async function main() {
  const index = await readIndex()

  const frontendByPath = new Map(index.frontend.map((f) => [f.path, f]))
  const styleFilesByPath = new Map(index.styles.map((f) => [f.path, f]))

  const backendMap = buildBackendMap(index.backend)
  const routesByFile = buildServerDocIndex(backendMap)

  // 1) Page docs
  for (const page of PAGE_CONFIG) {
    const indexedPage = frontendByPath.get(page.src)
    if (!indexedPage) {
      // eslint-disable-next-line no-console
      console.warn(`Missing index for ${page.src}`)
      continue
    }
    const md = buildPageDoc({ page, indexedPage, styleFilesByPath, backendMap })
    await writeFileEnsured(path.join(DOCS_PAGES_DIR, page.file), md)
  }

  // 2) Server docs (update the subset relevant to these pages; add Profile.md if not present)
  const mountsByPrefix = new Map(backendMap.mounts.map((m) => [m.prefix, m]))

  const serverDocs = [
    { title: 'System', prefixes: ['/api/system'], out: 'System.md' },
    { title: 'Auth', prefixes: ['/api/auth'], out: 'Auth.md' },
    { title: 'Feed', prefixes: ['/api/feed'], out: 'Feed.md' },
    { title: 'Requirement', prefixes: ['/api/requirements'], out: 'Requirement.md' },
    { title: 'Product', prefixes: ['/api/products'], out: 'Product.md' },
    { title: 'Profile', prefixes: ['/api/profiles'], out: 'Profile.md' },
    { title: 'Notification', prefixes: ['/api/notifications'], out: 'Notification.md' },
    { title: 'Search', prefixes: ['/api/search'], out: 'Search.md' },
    { title: 'Verification', prefixes: ['/api/verification'], out: 'Verification.md' },
    { title: 'Subscription', prefixes: ['/api/subscriptions'], out: 'Subscription.md' },
    { title: 'Message', prefixes: ['/api/messages'], out: 'Message.md' },
    { title: 'Conversation', prefixes: ['/api/conversations'], out: 'Conversation.md' },
    { title: 'CallSession', prefixes: ['/api/calls'], out: 'CallSession.md' },
    { title: 'Assistant', prefixes: ['/api/assistant'], out: 'Assistant.md' },
    { title: 'RealtimeCommunication', prefixes: [], out: 'RealtimeCommunication.md', realtimeOnly: true },
  ]

  for (const doc of serverDocs) {
    if (doc.realtimeOnly) {
      // Realtime doc: point to server/server.js WebSocket section.
      const serverEntry = index.backend.find((f) => f.path === 'server/server.js')
      let md = `# Realtime Communication (WebSocket)\n\n`
      md += `Primary file: \`server/server.js\`\n\n`
      md += `This server hosts a WebSocket server (ws) used by chat/calls/assistant.\n\n`
      if (serverEntry) {
        md += `## Key sections\n\n`
        // Best-effort: include first 40 lines + any function definitions containing "joinChatRoom" / "leaveCallRoom" / "assistant".
        md += `### Server bootstrap (excerpt)\n`
        md += fencedSnippet(serverEntry.lines.slice(0, 40).join('\n'), 'js')
      }
      await writeFileEnsured(path.join(DOCS_SERVER_DIR, doc.out), md)
      continue
    }

    const mounts = doc.prefixes.map((p) => mountsByPrefix.get(p)).filter(Boolean)
    const routeFiles = mounts.map((m) => m.routeFile).filter(Boolean)
    const routes = routeFiles.flatMap((rf) => routesByFile.get(rf) || [])
    const backendFilesByPath = new Map(index.backend.map((f) => [f.path, f]))
    const md = buildServerDoc({ title: doc.title, mounts, routes, backendFilesByPath })
    await writeFileEnsured(path.join(DOCS_SERVER_DIR, doc.out), md)
  }

  // 3) Conventions + README tweaks
  const conventions = `# Documentation Conventions\n\n` +
    `This project uses **generated, line-numbered documentation** for pages and backend endpoints.\n\n` +
    `## Line references\n\n` +
    `- Format: \`path:line\` (1-based)\n` +
    `- Example: \`src/pages/TexHub.jsx:290\`\n\n` +
    `Line numbers are derived from snapshots under \`docs/_generated/sources/\`.\n\n` +
    `## Snippets\n\n` +
    `- Each reference includes a 3-4 line fenced snippet to provide local context.\n\n` +
    `## Tailwind/CSS notes\n\n` +
    `- Page docs list every \`className\` block and group utilities into: layout, spacing, typography, color, borders/rings/shadows, interaction, responsive, dark.\n` +
    `- Custom utilities (e.g. \`.nav-glass\`, \`.spotlight-card\`, \`.skeleton\`) are referenced back to \`src/App.css\` / \`src/index.css\`.\n\n` +
    `## Regeneration\n\n` +
    `Whenever source files change, regenerate docs so references stay correct:\n\n` +
    `\`\`\`bash\nnpm run docs:generate\n\`\`\`\n`

  await writeFileEnsured(path.join(REPO_ROOT, 'docs', 'DOCS_CONVENTIONS.md'), conventions)

  // Update docs/pages/README.md and docs/server/README.md by appending a short generation note.
  const pagesReadmePath = path.join(DOCS_PAGES_DIR, 'README.md')
  const serverReadmePath = path.join(DOCS_SERVER_DIR, 'README.md')
  const genNote = `\n\n---\n\n## Line-numbered docs (generated)\n\nRun:\n\n\`\`\`bash\nnpm run docs:generate\n\`\`\`\n\nSources are snapshotted under \`docs/_generated/sources/\`.\n`

  try {
    const raw = await fs.readFile(pagesReadmePath, 'utf-8')
    if (!raw.includes('Line-numbered docs')) await fs.writeFile(pagesReadmePath, raw.trimEnd() + genNote, 'utf-8')
  } catch {
    // ignore
  }

  try {
    const raw = await fs.readFile(serverReadmePath, 'utf-8')
    if (!raw.includes('Line-numbered docs')) await fs.writeFile(serverReadmePath, raw.trimEnd() + genNote, 'utf-8')
  } catch {
    // ignore
  }

  process.stdout.write('Rendered docs/pages and docs/server\n')
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
