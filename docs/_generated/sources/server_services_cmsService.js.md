    1 | import crypto from 'crypto'
    2 | import fs from 'fs/promises'
    3 | import path from 'path'
    4 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    5 | 
    6 | const STATE_FILE = 'cms_state.json'
    7 | const DEFAULT_STATE = {
    8 |   articles: [],
    9 |   pages: [],
   10 |   media: [],
   11 |   versions: [],
   12 |   theme: {
   13 |     active: '',
   14 |     options: [],
   15 |   },
   16 |   seo: {
   17 |     default_title: '',
   18 |     meta_description: '',
   19 |     social_image: '',
   20 |   },
   21 |   cache: {
   22 |     last_cleared_at: '',
   23 |   },
   24 |   env: {
   25 |     vars: {},
   26 |   },
   27 |   deployments: [],
   28 |   backups: [],
   29 |   cron_scripts: [],
   30 | }
   31 | 
   32 | const CONTENT_DIR = path.join(process.cwd(), 'server', 'content')
   33 | const MEDIA_DIR = path.join(process.cwd(), 'server', 'uploads')
   34 | 
   35 | function entryIdFromTitle(title = '') {
   36 |   return String(title || 'content')
   37 |     .toLowerCase()
   38 |     .replace(/[^a-z0-9]+/g, '-')
   39 |     .replace(/^-+|-+$/g, '')
   40 |     .slice(0, 40) || 'content'
   41 | }
   42 | 
   43 | async function listContentFiles() {
   44 |   try {
   45 |     const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true })
   46 |     return entries.filter((e) => e.isFile() && ['.md', '.html'].includes(path.extname(e.name).toLowerCase()))
   47 |   } catch {
   48 |     return []
   49 |   }
   50 | }
   51 | 
   52 | async function readContentFile(fileName) {
   53 |   try {
   54 |     const filePath = path.join(CONTENT_DIR, fileName)
   55 |     const content = await fs.readFile(filePath, 'utf8')
   56 |     return content
   57 |   } catch {
   58 |     return ''
   59 |   }
   60 | }
   61 | 
   62 | async function listMediaFiles() {
   63 |   try {
   64 |     const entries = await fs.readdir(MEDIA_DIR, { withFileTypes: true })
   65 |     return entries.filter((e) => e.isFile()).slice(0, 50)
   66 |   } catch {
   67 |     return []
   68 |   }
   69 | }
   70 | 
   71 | export async function getCmsState() {
   72 |   const current = await readLocalJson(STATE_FILE, DEFAULT_STATE)
   73 |   const files = await listContentFiles()
   74 |   const articles = []
   75 |   const pages = []
   76 |   for (const file of files) {
   77 |     const ext = path.extname(file.name).toLowerCase()
   78 |     const raw = await readContentFile(file.name)
   79 |     const item = {
   80 |       id: file.name,
   81 |       title: file.name.replace(ext, ''),
   82 |       status: 'published',
   83 |       updated_at: current.articles?.find((a) => a.id === file.name)?.updated_at || '',
   84 |       content_length: raw.length,
   85 |     }
   86 |     if (file.name.toLowerCase().startsWith('page-')) {
   87 |       pages.push(item)
   88 |     } else {
   89 |       articles.push(item)
   90 |     }
   91 |   }
   92 |   const mediaFiles = await listMediaFiles()
   93 |   const media = mediaFiles.map((file) => ({
   94 |     id: file.name,
   95 |     name: file.name,
   96 |     type: path.extname(file.name).replace('.', ''),
   97 |     url: `/uploads/${file.name}`,
   98 |     uploaded_at: file.mtime ? new Date(file.mtime).toISOString() : '',
   99 |   }))
  100 |   return {
  101 |     ...DEFAULT_STATE,
  102 |     ...current,
  103 |     articles: articles.length ? articles : (current.articles || []),
  104 |     pages: pages.length ? pages : (current.pages || []),
  105 |     media: media.length ? media : (current.media || []),
  106 |     theme: { ...DEFAULT_STATE.theme, ...(current.theme || {}) },
  107 |     seo: { ...DEFAULT_STATE.seo, ...(current.seo || {}) },
  108 |     cache: { ...DEFAULT_STATE.cache, ...(current.cache || {}) },
  109 |     env: { ...DEFAULT_STATE.env, ...(current.env || {}) },
  110 |   }
  111 | }
  112 | 
  113 | async function updateState(updater) {
  114 |   return updateLocalJson(STATE_FILE, updater, DEFAULT_STATE)
  115 | }
  116 | 
  117 | export async function performCmsAction(action = '', payload = {}) {
  118 |   const actionId = crypto.randomUUID()
  119 |   const now = new Date().toISOString()
  120 |   let updated = null
  121 | 
  122 |   if (action === 'cms.article.create') {
  123 |     updated = await updateState((state) => {
  124 |       const entry = { id: actionId, title: payload.title || 'Untitled', status: payload.status || 'draft', author: payload.author || 'admin', updated_at: now }
  125 |       state.articles = [...(state.articles || []), entry]
  126 |       return state
  127 |     })
  128 |     if (payload?.content) {
  129 |       await fs.mkdir(CONTENT_DIR, { recursive: true }).catch(() => {})
  130 |       await fs.writeFile(path.join(CONTENT_DIR, `${entryIdFromTitle(payload.title || 'article')}-${actionId}.md`), String(payload.content), 'utf8').catch(() => {})
  131 |     }
  132 |   } else if (action === 'cms.page.create') {
  133 |     updated = await updateState((state) => {
  134 |       const entry = { id: actionId, title: payload.title || 'New Page', slug: payload.slug || `page-${actionId.slice(0, 4)}`, status: payload.status || 'draft', updated_at: now }
  135 |       state.pages = [...(state.pages || []), entry]
  136 |       return state
  137 |     })
  138 |     if (payload?.content) {
  139 |       await fs.mkdir(CONTENT_DIR, { recursive: true }).catch(() => {})
  140 |       await fs.writeFile(path.join(CONTENT_DIR, `page-${payload.slug || actionId}.md`), String(payload.content), 'utf8').catch(() => {})
  141 |     }
  142 |   } else if (action === 'cms.media.upload') {
  143 |     updated = await updateState((state) => {
  144 |       const entry = { id: actionId, name: payload.name || 'media', type: payload.type || 'image', url: payload.url || '', uploaded_at: now }
  145 |       state.media = [...(state.media || []), entry]
  146 |       return state
  147 |     })
  148 |   } else if (action === 'cms.version.rollback') {
  149 |     updated = await updateState((state) => {
  150 |       state.versions = [
  151 |         { id: actionId, content_id: payload.content_id || '', version: payload.version || 'latest', created_at: now, note: 'rollback' },
  152 |         ...(state.versions || []),
  153 |       ]
  154 |       return state
  155 |     })
  156 |   } else if (action === 'cms.theme.switch') {
  157 |     updated = await updateState((state) => {
  158 |       state.theme = { ...state.theme, active: payload.theme || state.theme.active }
  159 |       return state
  160 |     })
  161 |   } else if (action === 'cms.seo.update') {
  162 |     updated = await updateState((state) => {
  163 |       state.seo = {
  164 |         ...state.seo,
  165 |         default_title: payload.default_title ?? state.seo.default_title,
  166 |         meta_description: payload.meta_description ?? state.seo.meta_description,
  167 |         social_image: payload.social_image ?? state.seo.social_image,
  168 |       }
  169 |       return state
  170 |     })
  171 |   } else if (action === 'cms.cache.clear') {
  172 |     updated = await updateState((state) => {
  173 |       state.cache = { ...state.cache, last_cleared_at: now }
  174 |       return state
  175 |     })
  176 |   } else if (action === 'cms.env.update') {
  177 |     let vars = payload.vars
  178 |     if (typeof vars === 'string') {
  179 |       try {
  180 |         vars = JSON.parse(vars)
  181 |       } catch {
  182 |         vars = {}
  183 |       }
  184 |     }
  185 |     updated = await updateState((state) => {
  186 |       state.env = { ...state.env, vars: { ...(state.env?.vars || {}), ...(vars || {}) } }
  187 |       return state
  188 |     })
  189 |   } else if (action === 'cms.deploy.run') {
  190 |     updated = await updateState((state) => {
  191 |       const entry = { id: actionId, status: 'running', branch: payload.branch || 'main', started_at: now }
  192 |       state.deployments = [entry, ...(state.deployments || [])].slice(0, 20)
  193 |       return state
  194 |     })
  195 |   } else if (action === 'cms.backup.run') {
  196 |     updated = await updateState((state) => {
  197 |       const entry = { id: actionId, status: 'completed', provider: payload.provider || 'local', created_at: now }
  198 |       state.backups = [entry, ...(state.backups || [])].slice(0, 20)
  199 |       return state
  200 |     })
  201 |   } else if (action === 'cms.cron.add') {
  202 |     updated = await updateState((state) => {
  203 |       const entry = { id: actionId, schedule: payload.schedule || '0 2 * * *', command: payload.command || 'backup', status: 'active' }
  204 |       state.cron_scripts = [...(state.cron_scripts || []), entry]
  205 |       return state
  206 |     })
  207 |   } else if (action === 'cms.cron.remove') {
  208 |     updated = await updateState((state) => {
  209 |       state.cron_scripts = (state.cron_scripts || []).filter((script) => String(script.id) !== String(payload.id))
  210 |       return state
  211 |     })
  212 |   }
  213 | 
  214 |   if (!updated) {
  215 |     return { ok: false, error: 'Unsupported action' }
  216 |   }
  217 |   return { ok: true, state: updated }
  218 | }
  219 | 