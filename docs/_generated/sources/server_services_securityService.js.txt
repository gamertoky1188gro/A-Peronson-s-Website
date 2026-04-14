    1 | import crypto from 'crypto'
    2 | import { exec } from 'child_process'
    3 | import util from 'util'
    4 | import fs from 'fs/promises'
    5 | import path from 'path'
    6 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    7 | import { readAuditLog } from '../utils/auditStore.js'
    8 | 
    9 | const execAsync = util.promisify(exec)
   10 | const EXEC_ENABLED = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ENABLED || '').toLowerCase())
   11 | const EXEC_TIMEOUT_MS = Number(process.env.ADMIN_EXEC_TIMEOUT_MS || 12_000)
   12 | const EXEC_ALLOW_ANY = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ALLOW_ANY || '').toLowerCase())
   13 | const EXEC_ALLOWLIST = new Set(
   14 |   String(process.env.ADMIN_EXEC_ALLOWLIST || '')
   15 |     .split(',')
   16 |     .map((v) => v.trim())
   17 |     .filter(Boolean),
   18 | )
   19 | 
   20 | const IMMUTABLE_DIR = path.join(process.cwd(), 'server', 'immutable_backups')
   21 | 
   22 | const STATE_FILE = 'security_state.json'
   23 | const DEFAULT_STATE = {
   24 |   zero_trust: {
   25 |     enabled: false,
   26 |     policy: '',
   27 |   },
   28 |   admin_auth: {
   29 |     mfa_code: '',
   30 |     device_allowlist: [],
   31 |     passkeys: [],
   32 |   },
   33 |   mfa: {
   34 |     required: false,
   35 |     methods: [],
   36 |   },
   37 |   session: {
   38 |     timeout_minutes: 0,
   39 |     device_fingerprinting: false,
   40 |   },
   41 |   ip_whitelist: [],
   42 |   geo_fence: {
   43 |     enabled: false,
   44 |     countries: [],
   45 |   },
   46 |   tamper_proof_logs: {
   47 |     enabled: false,
   48 |     storage: '',
   49 |     last_hash_at: '',
   50 |   },
   51 |   encryption: {
   52 |     key_rotation_days: 0,
   53 |     last_rotated_at: '',
   54 |   },
   55 |   incidents: [],
   56 |   data_exports: {
   57 |     dual_approval: false,
   58 |     pending: [],
   59 |   },
   60 |   forensic_logs: [],
   61 |   immutable_backups: {
   62 |     enabled: false,
   63 |     last_snapshot_at: '',
   64 |   },
   65 | }
   66 | 
   67 | function envBool(value) {
   68 |   if (value === undefined || value === null) return undefined
   69 |   return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
   70 | }
   71 | 
   72 | function envList(value) {
   73 |   if (!value) return []
   74 |   return String(value).split(',').map((v) => v.trim()).filter(Boolean)
   75 | }
   76 | 
   77 | async function runCommand(command) {
   78 |   if (!EXEC_ENABLED) {
   79 |     return { ok: false, simulated: true, stdout: '', stderr: '', exitCode: null }
   80 |   }
   81 |   if (!EXEC_ALLOW_ANY && EXEC_ALLOWLIST.size > 0) {
   82 |     const allowed = [...EXEC_ALLOWLIST].some((prefix) => command.startsWith(prefix))
   83 |     if (!allowed) {
   84 |       return { ok: false, simulated: false, stdout: '', stderr: 'Command not allowlisted.', exitCode: 1 }
   85 |     }
   86 |   }
   87 |   try {
   88 |     const { stdout, stderr } = await execAsync(command, { timeout: EXEC_TIMEOUT_MS, windowsHide: true })
   89 |     return { ok: true, simulated: false, stdout: stdout || '', stderr: stderr || '', exitCode: 0 }
   90 |   } catch (error) {
   91 |     return {
   92 |       ok: false,
   93 |       simulated: false,
   94 |       stdout: error?.stdout || '',
   95 |       stderr: error?.stderr || error?.message || '',
   96 |       exitCode: typeof error?.code === 'number' ? error.code : 1,
   97 |     }
   98 |   }
   99 | }
  100 | 
  101 | async function listSecurityEvents() {
  102 |   if (!EXEC_ENABLED) return []
  103 |   if (process.platform === 'win32') {
  104 |     const result = await runCommand('powershell -NoProfile -Command "Get-WinEvent -LogName Security -MaxEvents 10 | Select-Object TimeCreated,Id,LevelDisplayName,Message | ConvertTo-Json"')
  105 |     if (!result.ok || !result.stdout) return []
  106 |     try {
  107 |       const parsed = JSON.parse(result.stdout)
  108 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  109 |       return rows.map((row) => ({
  110 |         id: crypto.randomUUID(),
  111 |         at: row?.TimeCreated ? new Date(row.TimeCreated).toISOString() : new Date().toISOString(),
  112 |         level: row?.LevelDisplayName || '',
  113 |         message: String(row?.Message || '').slice(0, 240),
  114 |         code: row?.Id || '',
  115 |       }))
  116 |     } catch {
  117 |       return []
  118 |     }
  119 |   }
  120 |   const authLog = await runCommand('tail -n 20 /var/log/auth.log')
  121 |   if (authLog.ok && authLog.stdout) {
  122 |     return authLog.stdout.split('\n').filter(Boolean).map((line) => ({
  123 |       id: crypto.randomUUID(),
  124 |       at: new Date().toISOString(),
  125 |       level: 'auth',
  126 |       message: line.slice(0, 240),
  127 |     }))
  128 |   }
  129 |   const secureLog = await runCommand('tail -n 20 /var/log/secure')
  130 |   if (!secureLog.ok || !secureLog.stdout) return []
  131 |   return secureLog.stdout.split('\n').filter(Boolean).map((line) => ({
  132 |     id: crypto.randomUUID(),
  133 |     at: new Date().toISOString(),
  134 |     level: 'auth',
  135 |     message: line.slice(0, 240),
  136 |   }))
  137 | }
  138 | 
  139 | function hashAuditLog(entries = []) {
  140 |   const hash = crypto.createHash('sha256')
  141 |   entries.forEach((entry) => {
  142 |     hash.update(JSON.stringify(entry))
  143 |   })
  144 |   return hash.digest('hex')
  145 | }
  146 | 
  147 | export async function getSecurityState() {
  148 |   const current = await readLocalJson(STATE_FILE, DEFAULT_STATE)
  149 |   const auditLog = await readAuditLog()
  150 |   const lastHashAt = auditLog.length ? auditLog[auditLog.length - 1]?.at || '' : ''
  151 |   const auditHash = auditLog.length ? hashAuditLog(auditLog) : ''
  152 |   const systemEvents = await listSecurityEvents()
  153 |   const envMfaRequired = envBool(process.env.ADMIN_MFA_REQUIRED)
  154 |   const envIpAllow = envList(process.env.ADMIN_IP_ALLOWLIST)
  155 |   const envDeviceAllow = envList(process.env.ADMIN_DEVICE_ALLOWLIST)
  156 |   const envTimeout = Number(process.env.ADMIN_STEPUP_MAX_MINUTES || 0)
  157 |   const mfaEnabled = envMfaRequired !== undefined ? envMfaRequired : Boolean(process.env.ADMIN_MFA_CODE)
  158 |   const deviceFingerprinting = envDeviceAllow.length > 0 ? true : undefined
  159 |   return {
  160 |     ...DEFAULT_STATE,
  161 |     ...current,
  162 |     admin_auth: {
  163 |       ...DEFAULT_STATE.admin_auth,
  164 |       ...(current.admin_auth || {}),
  165 |     },
  166 |     zero_trust: { ...DEFAULT_STATE.zero_trust, ...(current.zero_trust || {}) },
  167 |     mfa: {
  168 |       ...DEFAULT_STATE.mfa,
  169 |       ...(current.mfa || {}),
  170 |       required: current.mfa?.required ?? mfaEnabled,
  171 |       methods: current.mfa?.methods?.length ? current.mfa.methods : envList(process.env.ADMIN_MFA_METHODS),
  172 |     },
  173 |     session: {
  174 |       ...DEFAULT_STATE.session,
  175 |       ...(current.session || {}),
  176 |       timeout_minutes: current.session?.timeout_minutes || (Number.isFinite(envTimeout) ? envTimeout : 0),
  177 |       device_fingerprinting: current.session?.device_fingerprinting ?? deviceFingerprinting ?? false,
  178 |     },
  179 |     ip_whitelist: current.ip_whitelist?.length ? current.ip_whitelist : envIpAllow,
  180 |     geo_fence: { ...DEFAULT_STATE.geo_fence, ...(current.geo_fence || {}) },
  181 |     encryption: { ...DEFAULT_STATE.encryption, ...(current.encryption || {}) },
  182 |     data_exports: { ...DEFAULT_STATE.data_exports, ...(current.data_exports || {}), dual_approval: true },
  183 |     immutable_backups: { ...DEFAULT_STATE.immutable_backups, ...(current.immutable_backups || {}) },
  184 |     tamper_proof_logs: {
  185 |       ...DEFAULT_STATE.tamper_proof_logs,
  186 |       ...(current.tamper_proof_logs || {}),
  187 |       enabled: true,
  188 |       storage: 'audit-log-chain',
  189 |       last_hash_at: lastHashAt,
  190 |       hash: auditHash,
  191 |     },
  192 |     system_events: systemEvents,
  193 |   }
  194 | }
  195 | 
  196 | export async function getAdminAuthConfig() {
  197 |   const current = await readLocalJson(STATE_FILE, DEFAULT_STATE)
  198 |   const adminAuth = { ...DEFAULT_STATE.admin_auth, ...(current.admin_auth || {}) }
  199 |   const envMfa = String(process.env.ADMIN_MFA_CODE || '').trim()
  200 |   const envDevices = envList(process.env.ADMIN_DEVICE_ALLOWLIST)
  201 |   const envIps = envList(process.env.ADMIN_IP_ALLOWLIST)
  202 |   return {
  203 |     mfa_code: adminAuth.mfa_code || envMfa,
  204 |     device_allowlist: adminAuth.device_allowlist?.length ? adminAuth.device_allowlist : envDevices,
  205 |     ip_allowlist: envIps,
  206 |     passkeys: adminAuth.passkeys || [],
  207 |   }
  208 | }
  209 | 
  210 | async function updateState(updater) {
  211 |   return updateLocalJson(STATE_FILE, updater, DEFAULT_STATE)
  212 | }
  213 | 
  214 | export async function performSecurityAction(action = '', payload = {}) {
  215 |   const actionId = crypto.randomUUID()
  216 |   const now = new Date().toISOString()
  217 |   let updated = null
  218 | 
  219 |   if (action === 'security.zero_trust.toggle') {
  220 |     updated = await updateState((state) => {
  221 |       state.zero_trust = { ...state.zero_trust, enabled: Boolean(payload.enabled) }
  222 |       return state
  223 |     })
  224 |   } else if (action === 'security.mfa.require') {
  225 |     const methods = Array.isArray(payload.methods)
  226 |       ? payload.methods
  227 |       : String(payload.methods || '').split(',').map((v) => v.trim()).filter(Boolean)
  228 |     updated = await updateState((state) => {
  229 |       state.mfa = { ...state.mfa, required: Boolean(payload.required), methods: methods.length ? methods : state.mfa.methods }
  230 |       return state
  231 |     })
  232 |   } else if (action === 'security.session.timeout') {
  233 |     updated = await updateState((state) => {
  234 |       state.session = { ...state.session, timeout_minutes: Number(payload.timeout_minutes || 30) }
  235 |       return state
  236 |     })
  237 |   } else if (action === 'security.device_fingerprint') {
  238 |     updated = await updateState((state) => {
  239 |       state.session = { ...state.session, device_fingerprinting: Boolean(payload.enabled) }
  240 |       return state
  241 |     })
  242 |   } else if (action === 'security.ip.allowlist') {
  243 |     const list = Array.isArray(payload.ip_whitelist)
  244 |       ? payload.ip_whitelist
  245 |       : String(payload.ip_whitelist || '').split(',').map((v) => v.trim()).filter(Boolean)
  246 |     updated = await updateState((state) => {
  247 |       state.ip_whitelist = list
  248 |       return state
  249 |     })
  250 |   } else if (action === 'security.geo_fence') {
  251 |     updated = await updateState((state) => {
  252 |       state.geo_fence = {
  253 |         enabled: Boolean(payload.enabled),
  254 |         countries: Array.isArray(payload.countries) ? payload.countries : String(payload.countries || '').split(',').map((v) => v.trim()).filter(Boolean),
  255 |       }
  256 |       return state
  257 |     })
  258 |   } else if (action === 'security.encryption.rotate') {
  259 |     updated = await updateState((state) => {
  260 |       state.encryption = { ...state.encryption, last_rotated_at: now }
  261 |       return state
  262 |     })
  263 |   } else if (action === 'security.incident.create') {
  264 |     updated = await updateState((state) => {
  265 |       const incident = { id: actionId, title: payload.title || 'Incident', status: 'open', created_at: now, severity: payload.severity || 'medium' }
  266 |       state.incidents = [incident, ...(state.incidents || [])]
  267 |       return state
  268 |     })
  269 |   } else if (action === 'security.incident.resolve') {
  270 |     updated = await updateState((state) => {
  271 |       state.incidents = (state.incidents || []).map((inc) => (
  272 |         String(inc.id) === String(payload.id) ? { ...inc, status: 'resolved', resolved_at: now } : inc
  273 |       ))
  274 |       return state
  275 |     })
  276 |   } else if (action === 'security.export.request') {
  277 |     updated = await updateState((state) => {
  278 |       const req = { id: actionId, dataset: payload.dataset || 'export', requested_at: now, status: 'pending' }
  279 |       state.data_exports.pending = [req, ...(state.data_exports.pending || [])]
  280 |       return state
  281 |     })
  282 |   } else if (action === 'security.export.approve') {
  283 |     updated = await updateState((state) => {
  284 |       state.data_exports.pending = (state.data_exports.pending || []).map((req) => (
  285 |         String(req.id) === String(payload.id) ? { ...req, status: 'approved', approved_at: now } : req
  286 |       ))
  287 |       return state
  288 |     })
  289 |   } else if (action === 'security.forensic.log') {
  290 |     updated = await updateState((state) => {
  291 |       const entry = { id: actionId, message: payload.message || 'Forensic entry', created_at: now }
  292 |       state.forensic_logs = [entry, ...(state.forensic_logs || [])].slice(0, 100)
  293 |       return state
  294 |     })
  295 |   } else if (action === 'security.immutable.snapshot') {
  296 |     const auditLog = await readAuditLog()
  297 |     const auditHash = auditLog.length ? hashAuditLog(auditLog) : crypto.randomUUID()
  298 |     await fs.mkdir(IMMUTABLE_DIR, { recursive: true }).catch(() => {})
  299 |     const fileName = `immutable-${now.replace(/[:.]/g, '-')}.json`
  300 |     const payloadOut = { created_at: now, audit_hash: auditHash, entries: auditLog.slice(-200) }
  301 |     await fs.writeFile(path.join(IMMUTABLE_DIR, fileName), JSON.stringify(payloadOut, null, 2), 'utf8').catch(() => {})
  302 |     updated = await updateState((state) => {
  303 |       state.immutable_backups = { ...state.immutable_backups, last_snapshot_at: now, last_hash: auditHash, last_file: fileName }
  304 |       return state
  305 |     })
  306 |   }
  307 |   else if (action === 'security.admin.mfa.set') {
  308 |     const code = String(payload.code || '').trim()
  309 |     updated = await updateState((state) => {
  310 |       state.admin_auth = { ...(state.admin_auth || {}), mfa_code: code }
  311 |       return state
  312 |     })
  313 |   } else if (action === 'security.admin.device.add') {
  314 |     const deviceId = String(payload.device_id || '').trim().toLowerCase()
  315 |     if (!deviceId) return { ok: false, error: 'Missing device ID' }
  316 |     updated = await updateState((state) => {
  317 |       const list = new Set(state.admin_auth?.device_allowlist || [])
  318 |       list.add(deviceId)
  319 |       state.admin_auth = { ...(state.admin_auth || {}), device_allowlist: Array.from(list) }
  320 |       return state
  321 |     })
  322 |   } else if (action === 'security.admin.device.remove') {
  323 |     const deviceId = String(payload.device_id || '').trim().toLowerCase()
  324 |     updated = await updateState((state) => {
  325 |       const list = (state.admin_auth?.device_allowlist || []).filter((id) => String(id).toLowerCase() !== deviceId)
  326 |       state.admin_auth = { ...(state.admin_auth || {}), device_allowlist: list }
  327 |       return state
  328 |     })
  329 |   } else if (action === 'security.admin.passkey.add') {
  330 |     const passkey = String(payload.passkey || '').trim()
  331 |     if (!passkey) return { ok: false, error: 'Missing passkey' }
  332 |     updated = await updateState((state) => {
  333 |       const list = new Set(state.admin_auth?.passkeys || [])
  334 |       list.add(passkey)
  335 |       state.admin_auth = { ...(state.admin_auth || {}), passkeys: Array.from(list) }
  336 |       return state
  337 |     })
  338 |   } else if (action === 'security.admin.passkey.remove') {
  339 |     const passkey = String(payload.passkey || '').trim()
  340 |     updated = await updateState((state) => {
  341 |       const list = (state.admin_auth?.passkeys || []).filter((key) => key !== passkey)
  342 |       state.admin_auth = { ...(state.admin_auth || {}), passkeys: list }
  343 |       return state
  344 |     })
  345 |   }
  346 | 
  347 |   if (!updated) {
  348 |     return { ok: false, error: 'Unsupported action' }
  349 |   }
  350 |   return { ok: true, state: updated }
  351 | }
  352 | 