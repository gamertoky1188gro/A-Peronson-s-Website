    1 | import crypto from 'crypto'
    2 | import { exec } from 'child_process'
    3 | import util from 'util'
    4 | import fs from 'fs/promises'
    5 | import path from 'path'
    6 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    7 | 
    8 | const execAsync = util.promisify(exec)
    9 | const EXEC_ENABLED = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ENABLED || '').toLowerCase())
   10 | const EXEC_TIMEOUT_MS = Number(process.env.ADMIN_EXEC_TIMEOUT_MS || 12_000)
   11 | const EXEC_ALLOW_ANY = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ALLOW_ANY || '').toLowerCase())
   12 | const EXEC_ALLOWLIST = new Set(
   13 |   String(process.env.ADMIN_EXEC_ALLOWLIST || '')
   14 |     .split(',')
   15 |     .map((v) => v.trim())
   16 |     .filter(Boolean),
   17 | )
   18 | 
   19 | const STATE_FILE = 'server_admin_state.json'
   20 | const FILE_MANAGER_ROOT = path.join(process.cwd(), 'server', 'file_manager')
   21 | const DEFAULT_STATE = {
   22 |   web_server: {
   23 |     type: '',
   24 |     status: '',
   25 |     config: '',
   26 |     updated_at: '',
   27 |   },
   28 |   php: {
   29 |     version: '',
   30 |     available: [],
   31 |     updated_at: '',
   32 |   },
   33 |   databases: [],
   34 |   db_admin_sessions: [],
   35 |   domains: [],
   36 |   dns_records: [],
   37 |   apps: [],
   38 |   files: [],
   39 |   rbac_roles: [],
   40 |   task_queues: [],
   41 |   automation: {
   42 |     auto_updates: false,
   43 |     patch_window: '',
   44 |     last_run_at: '',
   45 |   },
   46 |   security: {
   47 |     mfa_required: false,
   48 |     ssh_key_control: false,
   49 |     ids_status: '',
   50 |     last_scan_at: '',
   51 |   },
   52 |   backups: {
   53 |     providers: [],
   54 |     last_restore_at: '',
   55 |   },
   56 |   alerts: [],
   57 |   logs: [],
   58 | }
   59 | 
   60 | function toId(value) {
   61 |   return String(value || '').trim()
   62 | }
   63 | 
   64 | function truncate(value, max = 4000) {
   65 |   const text = String(value || '')
   66 |   if (text.length <= max) return text
   67 |   return `${text.slice(0, max)}...`
   68 | }
   69 | 
   70 | async function runCommand(command) {
   71 |   if (!EXEC_ENABLED) {
   72 |     return { ok: false, simulated: true, stdout: '', stderr: '', exitCode: null }
   73 |   }
   74 | 
   75 |   if (!EXEC_ALLOW_ANY && EXEC_ALLOWLIST.size > 0) {
   76 |     const allowed = [...EXEC_ALLOWLIST].some((prefix) => command.startsWith(prefix))
   77 |     if (!allowed) {
   78 |       return { ok: false, simulated: false, stdout: '', stderr: 'Command not allowlisted.', exitCode: 1 }
   79 |     }
   80 |   }
   81 | 
   82 |   try {
   83 |     const { stdout, stderr } = await execAsync(command, { timeout: EXEC_TIMEOUT_MS, windowsHide: true })
   84 |     return { ok: true, simulated: false, stdout: truncate(stdout), stderr: truncate(stderr), exitCode: 0 }
   85 |   } catch (error) {
   86 |     return {
   87 |       ok: false,
   88 |       simulated: false,
   89 |       stdout: truncate(error?.stdout || ''),
   90 |       stderr: truncate(error?.stderr || error?.message || ''),
   91 |       exitCode: typeof error?.code === 'number' ? error.code : 1,
   92 |     }
   93 |   }
   94 | }
   95 | 
   96 | async function safeReadFile(filePath) {
   97 |   try {
   98 |     return await fs.readFile(filePath, 'utf8')
   99 |   } catch {
  100 |     return ''
  101 |   }
  102 | }
  103 | 
  104 | async function detectWebServer() {
  105 |   if (process.platform === 'win32') {
  106 |     const result = await runCommand('powershell -NoProfile -Command "Get-Service -Name nginx,Apache2,httpd,W3SVC -ErrorAction SilentlyContinue | Select-Object Name,Status,DisplayName | ConvertTo-Json"')
  107 |     if (!result.ok || !result.stdout) return { type: '', status: '' }
  108 |     try {
  109 |       const parsed = JSON.parse(result.stdout)
  110 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  111 |       const picked = rows.find((row) => row?.Name) || rows[0]
  112 |       if (!picked) return { type: '', status: '' }
  113 |       return {
  114 |         type: String(picked.Name || ''),
  115 |         status: String(picked.Status || ''),
  116 |       }
  117 |     } catch {
  118 |       return { type: '', status: '' }
  119 |     }
  120 |   }
  121 |   const result = await runCommand('systemctl list-units --type=service --no-pager --no-legend | grep -E "nginx|apache|httpd" | head -n 1')
  122 |   if (!result.ok || !result.stdout) return { type: '', status: '' }
  123 |   const parts = result.stdout.trim().split(/\s+/g)
  124 |   return { type: parts[0] || '', status: parts[2] || '' }
  125 | }
  126 | 
  127 | async function readWebServerConfig(serverType) {
  128 |   if (!serverType) return ''
  129 |   const normalized = String(serverType).toLowerCase()
  130 |   if (normalized.includes('nginx')) {
  131 |     const paths = [
  132 |       path.join('C:\\', 'nginx', 'conf', 'nginx.conf'),
  133 |       '/etc/nginx/nginx.conf',
  134 |     ]
  135 |     for (const p of paths) {
  136 |       const raw = await safeReadFile(p)
  137 |       if (raw) return raw.slice(0, 4000)
  138 |     }
  139 |   }
  140 |   if (normalized.includes('apache') || normalized.includes('httpd') || normalized.includes('w3svc')) {
  141 |     const paths = [
  142 |       path.join('C:\\', 'Apache24', 'conf', 'httpd.conf'),
  143 |       '/etc/apache2/apache2.conf',
  144 |       '/etc/httpd/conf/httpd.conf',
  145 |     ]
  146 |     for (const p of paths) {
  147 |       const raw = await safeReadFile(p)
  148 |       if (raw) return raw.slice(0, 4000)
  149 |     }
  150 |   }
  151 |   return ''
  152 | }
  153 | 
  154 | async function detectPhpVersion() {
  155 |   const result = await runCommand('php -v')
  156 |   if (!result.ok || !result.stdout) return { version: '', available: [] }
  157 |   const match = result.stdout.match(/PHP\s+([\d.]+)/i)
  158 |   const version = match ? match[1] : ''
  159 |   return { version, available: version ? [version] : [] }
  160 | }
  161 | 
  162 | async function detectDatabases() {
  163 |   if (process.platform === 'win32') {
  164 |     const result = await runCommand(`powershell -NoProfile -Command "Get-Service -Name 'postgresql*','mysql*','mariadb*','MongoDB','MSSQL*','Redis*' -ErrorAction SilentlyContinue | Select-Object Name,Status,DisplayName | ConvertTo-Json"`)
  165 |     if (!result.ok || !result.stdout) return []
  166 |     try {
  167 |       const parsed = JSON.parse(result.stdout)
  168 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  169 |       return rows.filter(Boolean).map((row) => ({
  170 |         id: String(row?.Name || crypto.randomUUID()),
  171 |         type: String(row?.Name || '').toLowerCase(),
  172 |         host: 'localhost',
  173 |         status: String(row?.Status || '').toLowerCase(),
  174 |         last_backup_at: '',
  175 |       }))
  176 |     } catch {
  177 |       return []
  178 |     }
  179 |   }
  180 |   const result = await runCommand('systemctl list-units --type=service --no-pager --no-legend | grep -E "postgres|mysql|mariadb|mongo|redis" | head -n 10')
  181 |   if (!result.ok || !result.stdout) return []
  182 |   return result.stdout.split('\n').filter(Boolean).map((line) => {
  183 |     const parts = line.trim().split(/\s+/g)
  184 |     return {
  185 |       id: parts[0] || crypto.randomUUID(),
  186 |       type: parts[0] || '',
  187 |       host: 'localhost',
  188 |       status: parts[2] || '',
  189 |       last_backup_at: '',
  190 |     }
  191 |   })
  192 | }
  193 | 
  194 | export async function getServerAdminState() {
  195 |   const current = await readLocalJson(STATE_FILE, DEFAULT_STATE)
  196 |   const [webServerDetected, phpDetected, databases] = await Promise.all([
  197 |     detectWebServer(),
  198 |     detectPhpVersion(),
  199 |     detectDatabases(),
  200 |   ])
  201 |   const webConfig = await readWebServerConfig(webServerDetected.type)
  202 |   return {
  203 |     ...DEFAULT_STATE,
  204 |     ...current,
  205 |     web_server: {
  206 |       ...DEFAULT_STATE.web_server,
  207 |       ...(current.web_server || {}),
  208 |       type: webServerDetected.type || current.web_server?.type || '',
  209 |       status: webServerDetected.status || current.web_server?.status || '',
  210 |       config: webConfig || current.web_server?.config || '',
  211 |     },
  212 |     php: {
  213 |       ...DEFAULT_STATE.php,
  214 |       ...(current.php || {}),
  215 |       version: phpDetected.version || current.php?.version || '',
  216 |       available: phpDetected.available.length ? phpDetected.available : (current.php?.available || []),
  217 |     },
  218 |     databases: databases.length ? databases : (current.databases || []),
  219 |     db_admin_ui: {
  220 |       phpmyadmin_url: process.env.PHPMYADMIN_URL || current.db_admin_ui?.phpmyadmin_url || '',
  221 |       configured: Boolean(process.env.PHPMYADMIN_URL || current.db_admin_ui?.phpmyadmin_url),
  222 |     },
  223 |     backups: { ...DEFAULT_STATE.backups, ...(current.backups || {}) },
  224 |     security: { ...DEFAULT_STATE.security, ...(current.security || {}) },
  225 |   }
  226 | }
  227 | 
  228 | async function updateState(updater) {
  229 |   return updateLocalJson(STATE_FILE, updater, DEFAULT_STATE)
  230 | }
  231 | 
  232 | function appendLog(state, entry) {
  233 |   const logs = Array.isArray(state.logs) ? state.logs : []
  234 |   state.logs = [entry, ...logs].slice(0, 100)
  235 |   return state
  236 | }
  237 | 
  238 | export async function performServerAdminAction(action = '', payload = {}) {
  239 |   const actionId = crypto.randomUUID()
  240 |   const now = new Date().toISOString()
  241 |   let updated = null
  242 | 
  243 |   if (action === 'webserver.update_config') {
  244 |     updated = await updateState((state) => {
  245 |       state.web_server = {
  246 |         ...state.web_server,
  247 |         type: payload.type || state.web_server.type,
  248 |         config: String(payload.config || '').trim() || state.web_server.config,
  249 |         updated_at: now,
  250 |       }
  251 |       return appendLog(state, { id: actionId, action, at: now })
  252 |     })
  253 |   } else if (action === 'webserver.restart') {
  254 |     updated = await updateState((state) => appendLog(state, { id: actionId, action, at: now }))
  255 |   } else if (action === 'php.set_version') {
  256 |     updated = await updateState((state) => {
  257 |       const version = String(payload.version || '').trim()
  258 |       if (version) {
  259 |         state.php = { ...state.php, version, updated_at: now }
  260 |       }
  261 |       return appendLog(state, { id: actionId, action, at: now, payload: { version } })
  262 |     })
  263 |   } else if (action === 'db.add') {
  264 |     updated = await updateState((state) => {
  265 |       const db = {
  266 |         id: payload.id || actionId,
  267 |         type: payload.type || 'postgres',
  268 |         host: payload.host || 'localhost',
  269 |         status: payload.status || 'online',
  270 |         last_backup_at: '',
  271 |       }
  272 |       state.databases = [...(state.databases || []), db]
  273 |       return appendLog(state, { id: actionId, action, at: now, payload: db })
  274 |     })
  275 |   } else if (action === 'db.backup') {
  276 |     updated = await updateState((state) => {
  277 |       const dbId = String(payload.db_id || '').trim()
  278 |       state.databases = (state.databases || []).map((db) => (
  279 |         String(db.id) === dbId ? { ...db, last_backup_at: now } : db
  280 |       ))
  281 |       return appendLog(state, { id: actionId, action, at: now, payload: { db_id: dbId } })
  282 |     })
  283 |   } else if (action === 'db.admin.open') {
  284 |     updated = await updateState((state) => {
  285 |       const session = {
  286 |         id: actionId,
  287 |         db_id: payload.db_id || 'primary',
  288 |         opened_at: now,
  289 |         status: 'active',
  290 |       }
  291 |       state.db_admin_sessions = [session, ...(state.db_admin_sessions || [])].slice(0, 20)
  292 |       return appendLog(state, { id: actionId, action, at: now, payload: session })
  293 |     })
  294 |   } else if (action === 'domain.add') {
  295 |     updated = await updateState((state) => {
  296 |       const domain = { id: actionId, domain: payload.domain || 'example.com', status: 'active', created_at: now }
  297 |       state.domains = [...(state.domains || []), domain]
  298 |       return appendLog(state, { id: actionId, action, at: now, payload: domain })
  299 |     })
  300 |   } else if (action === 'dns.record.add') {
  301 |     updated = await updateState((state) => {
  302 |       const record = {
  303 |         id: actionId,
  304 |         domain: payload.domain || 'example.com',
  305 |         type: payload.type || 'A',
  306 |         name: payload.name || '@',
  307 |         value: payload.value || '',
  308 |         ttl: Number(payload.ttl || 3600),
  309 |       }
  310 |       state.dns_records = [...(state.dns_records || []), record]
  311 |       return appendLog(state, { id: actionId, action, at: now, payload: record })
  312 |     })
  313 |   } else if (action === 'app.install') {
  314 |     updated = await updateState((state) => {
  315 |       const app = { id: actionId, name: payload.name || 'app', version: payload.version || 'latest', status: 'installed', installed_at: now }
  316 |       state.apps = [...(state.apps || []), app]
  317 |       return appendLog(state, { id: actionId, action, at: now, payload: app })
  318 |     })
  319 |   } else if (action === 'file.write') {
  320 |     updated = await updateState((state) => {
  321 |       const requested = String(payload.path || `${actionId.slice(0, 6)}.txt`).trim()
  322 |       const safePath = path.join(FILE_MANAGER_ROOT, requested)
  323 |       const relPath = path.relative(FILE_MANAGER_ROOT, safePath)
  324 |       if (relPath.startsWith('..')) {
  325 |         throw new Error('Invalid path')
  326 |       }
  327 |       const entry = {
  328 |         id: actionId,
  329 |         path: safePath,
  330 |         content: String(payload.content || '').slice(0, 4000),
  331 |         updated_at: now,
  332 |       }
  333 |       fs.mkdir(FILE_MANAGER_ROOT, { recursive: true }).catch(() => {})
  334 |       fs.writeFile(safePath, String(payload.content || ''), 'utf8').catch(() => {})
  335 |       const existing = (state.files || []).find((f) => String(f.path) === String(safePath))
  336 |       state.files = existing
  337 |         ? (state.files || []).map((f) => (String(f.path) === String(safePath) ? entry : f))
  338 |         : [...(state.files || []), entry]
  339 |       return appendLog(state, { id: actionId, action, at: now, payload: { path: safePath } })
  340 |     })
  341 |   } else if (action === 'rbac.role.create') {
  342 |     updated = await updateState((state) => {
  343 |       const roleId = toId(payload.id || payload.name || actionId)
  344 |       const role = {
  345 |         id: roleId,
  346 |         name: payload.name || roleId,
  347 |         permissions: Array.isArray(payload.permissions) ? payload.permissions : String(payload.permissions || '').split(',').filter(Boolean),
  348 |         users: [],
  349 |       }
  350 |       state.rbac_roles = [...(state.rbac_roles || []), role]
  351 |       return appendLog(state, { id: actionId, action, at: now, payload: role })
  352 |     })
  353 |   } else if (action === 'rbac.role.assign') {
  354 |     updated = await updateState((state) => {
  355 |       const roleId = toId(payload.role_id)
  356 |       const userId = toId(payload.user_id)
  357 |       state.rbac_roles = (state.rbac_roles || []).map((role) => {
  358 |         if (String(role.id) !== roleId) return role
  359 |         const users = new Set(role.users || [])
  360 |         if (userId) users.add(userId)
  361 |         return { ...role, users: [...users] }
  362 |       })
  363 |       return appendLog(state, { id: actionId, action, at: now, payload: { role_id: roleId, user_id: userId } })
  364 |     })
  365 |   } else if (action === 'queue.create') {
  366 |     updated = await updateState((state) => {
  367 |       const queue = { id: actionId, name: payload.name || 'queue', pending: 0, status: 'active' }
  368 |       state.task_queues = [...(state.task_queues || []), queue]
  369 |       return appendLog(state, { id: actionId, action, at: now, payload: queue })
  370 |     })
  371 |   } else if (action === 'queue.enqueue') {
  372 |     updated = await updateState((state) => {
  373 |       const queueId = toId(payload.queue_id)
  374 |       state.task_queues = (state.task_queues || []).map((queue) => (
  375 |         String(queue.id) === queueId ? { ...queue, pending: Number(queue.pending || 0) + 1 } : queue
  376 |       ))
  377 |       return appendLog(state, { id: actionId, action, at: now, payload: { queue_id: queueId } })
  378 |     })
  379 |   } else if (action === 'automation.toggle_updates') {
  380 |     updated = await updateState((state) => {
  381 |       state.automation = {
  382 |         ...state.automation,
  383 |         auto_updates: Boolean(payload.enabled),
  384 |         patch_window: payload.patch_window || state.automation.patch_window,
  385 |       }
  386 |       return appendLog(state, { id: actionId, action, at: now, payload })
  387 |     })
  388 |   } else if (action === 'security.ids.scan') {
  389 |     updated = await updateState((state) => {
  390 |       state.security = { ...state.security, ids_status: 'scanning', last_scan_at: now }
  391 |       return appendLog(state, { id: actionId, action, at: now })
  392 |     })
  393 |   } else if (action === 'backup.provider.update') {
  394 |     updated = await updateState((state) => {
  395 |       const providerId = toId(payload.id)
  396 |       state.backups.providers = (state.backups.providers || []).map((provider) => (
  397 |         String(provider.id) === providerId
  398 |           ? { ...provider, bucket: payload.bucket || provider.bucket, enabled: payload.enabled !== undefined ? Boolean(payload.enabled) : provider.enabled }
  399 |           : provider
  400 |       ))
  401 |       return appendLog(state, { id: actionId, action, at: now, payload: { id: providerId } })
  402 |     })
  403 |   } else if (action === 'backup.restore') {
  404 |     updated = await updateState((state) => {
  405 |       state.backups.last_restore_at = now
  406 |       return appendLog(state, { id: actionId, action, at: now })
  407 |     })
  408 |   }
  409 | 
  410 |   if (!updated) {
  411 |     return { ok: false, error: 'Unsupported action' }
  412 |   }
  413 |   return { ok: true, state: updated }
  414 | }
  415 | 