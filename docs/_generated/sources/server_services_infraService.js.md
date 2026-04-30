    1 | import os from 'os'
    2 | import path from 'path'
    3 | import fs from 'fs/promises'
    4 | import { exec } from 'child_process'
    5 | import util from 'util'
    6 | import crypto from 'crypto'
    7 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    8 | import { readAuditLog } from '../utils/auditStore.js'
    9 | 
   10 | const execAsync = util.promisify(exec)
   11 | const EXEC_ENABLED = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ENABLED || '').toLowerCase())
   12 | const EXEC_TIMEOUT_MS = Number(process.env.ADMIN_EXEC_TIMEOUT_MS || 12_000)
   13 | const EXEC_ALLOW_ANY = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ALLOW_ANY || '').toLowerCase())
   14 | const EXEC_ALLOWLIST = new Set(
   15 |   String(process.env.ADMIN_EXEC_ALLOWLIST || '')
   16 |     .split(',')
   17 |     .map((v) => v.trim())
   18 |     .filter(Boolean),
   19 | )
   20 | 
   21 | const STATE_FILE = 'infra_state.json'
   22 | const DEFAULT_STATE = {
   23 |   firewall_rules: [],
   24 |   packages: [],
   25 |   cron_jobs: [],
   26 |   updates: [],
   27 |   os_users: [],
   28 |   ssh_keys: [],
   29 |   ssl_certs: [],
   30 |   logs: [],
   31 |   security_audit: [],
   32 |   zombie_processes: [],
   33 |   network_settings: {
   34 |     interfaces: [],
   35 |     dns_servers: [],
   36 |     vlan: [],
   37 |     ip_assignments: [],
   38 |   },
   39 |   time_settings: {
   40 |     timezone: '',
   41 |     ntp_servers: [],
   42 |     last_sync_at: '',
   43 |   },
   44 |   update_policy: {
   45 |     auto_updates: false,
   46 |     patch_window: '',
   47 |   },
   48 |   backups: {
   49 |     retention_days: 0,
   50 |     last_run_at: '',
   51 |     last_status: '',
   52 |     history: [],
   53 |   },
   54 |   last_actions: [],
   55 | }
   56 | 
   57 | function truncate(value, max = 4000) {
   58 |   const text = String(value || '')
   59 |   if (text.length <= max) return text
   60 |   return `${text.slice(0, max)}...`
   61 | }
   62 | 
   63 | function normalizePort(value) {
   64 |   const port = Number(value)
   65 |   if (!Number.isInteger(port) || port < 1 || port > 65535) return 0
   66 |   return port
   67 | }
   68 | 
   69 | function normalizeProtocol(value) {
   70 |   const proto = String(value || 'tcp').toLowerCase()
   71 |   return proto === 'udp' ? 'udp' : 'tcp'
   72 | }
   73 | 
   74 | function isWindows() {
   75 |   return process.platform === 'win32'
   76 | }
   77 | 
   78 | let lastNetSample = {
   79 |   at: 0,
   80 |   bytes: 0,
   81 | }
   82 | 
   83 | async function getNetworkBytes() {
   84 |   if (isWindows()) {
   85 |     const result = await runCommand('powershell -NoProfile -Command "Get-Counter \\"\\\\Network Interface(*)\\\\Bytes Total/sec\\" | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue | Measure-Object -Sum | Select-Object -ExpandProperty Sum"')
   86 |     if (!result.ok || !result.stdout) return null
   87 |     const value = Number(String(result.stdout).trim())
   88 |     return Number.isFinite(value) ? value : null
   89 |   }
   90 |   const raw = await readTextFile('/proc/net/dev')
   91 |   if (!raw) return null
   92 |   const lines = raw.split('\n').slice(2).filter(Boolean)
   93 |   let total = 0
   94 |   lines.forEach((line) => {
   95 |     const parts = line.replace(/\s+/g, ' ').trim().split(' ')
   96 |     const bytes = Number(parts[1] || 0)
   97 |     total += Number.isFinite(bytes) ? bytes : 0
   98 |   })
   99 |   return total
  100 | }
  101 | 
  102 | async function getBandwidthMbps() {
  103 |   const now = Date.now()
  104 |   const bytes = await getNetworkBytes()
  105 |   if (bytes === null) return null
  106 |   if (!lastNetSample.at) {
  107 |     lastNetSample = { at: now, bytes }
  108 |     return null
  109 |   }
  110 |   const elapsed = Math.max(1, (now - lastNetSample.at) / 1000)
  111 |   const delta = Math.max(0, bytes - lastNetSample.bytes)
  112 |   lastNetSample = { at: now, bytes }
  113 |   const bps = delta / elapsed
  114 |   return Math.round((bps * 8) / 1_000_000 * 100) / 100
  115 | }
  116 | 
  117 | async function getDiskIops() {
  118 |   if (isWindows()) {
  119 |     const result = await runCommand('powershell -NoProfile -Command "Get-Counter \\"\\\\PhysicalDisk(_Total)\\\\Disk Transfers/sec\\" | Select-Object -ExpandProperty CounterSamples | Select-Object -First 1 -ExpandProperty CookedValue"')
  120 |     if (!result.ok || !result.stdout) return null
  121 |     const value = Number(String(result.stdout).trim())
  122 |     return Number.isFinite(value) ? Math.round(value) : null
  123 |   }
  124 |   const result = await runCommand('iostat -d 1 2')
  125 |   if (!result.ok || !result.stdout) return null
  126 |   const lines = result.stdout.split('\n').filter((line) => line.trim())
  127 |   const last = lines.slice(-1)[0] || ''
  128 |   const parts = last.trim().split(/\s+/g)
  129 |   const value = Number(parts[1])
  130 |   return Number.isFinite(value) ? Math.round(value) : null
  131 | }
  132 | 
  133 | async function readTextFile(filePath) {
  134 |   try {
  135 |     return await fs.readFile(filePath, 'utf8')
  136 |   } catch {
  137 |     return ''
  138 |   }
  139 | }
  140 | 
  141 | async function listOsUsers() {
  142 |   if (isWindows()) {
  143 |     const result = await runCommand('powershell -NoProfile -Command "Get-LocalUser | Select-Object -First 60 Name,Enabled,LastLogon | ConvertTo-Json"')
  144 |     if (!result.ok || !result.stdout) return []
  145 |     try {
  146 |       const parsed = JSON.parse(result.stdout)
  147 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  148 |       return rows.map((row) => ({
  149 |         id: String(row?.Name || ''),
  150 |         username: String(row?.Name || ''),
  151 |         status: row?.Enabled ? 'active' : 'disabled',
  152 |         last_logon: row?.LastLogon || '',
  153 |       }))
  154 |     } catch {
  155 |       return []
  156 |     }
  157 |   }
  158 |   const result = await runCommand("getent passwd | awk -F: '{print $1}' | head -n 60")
  159 |   if (!result.ok || !result.stdout) return []
  160 |   return result.stdout.split('\n').filter(Boolean).map((name) => ({ id: name, username: name, status: 'active' }))
  161 | }
  162 | 
  163 | async function listFirewallRules() {
  164 |   if (isWindows()) {
  165 |     const result = await runCommand('powershell -NoProfile -Command "Get-NetFirewallRule | Select-Object -First 60 DisplayName,Enabled,Action,Direction,Profile | ConvertTo-Json"')
  166 |     if (!result.ok || !result.stdout) return []
  167 |     try {
  168 |       const parsed = JSON.parse(result.stdout)
  169 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  170 |       return rows.map((row, idx) => ({
  171 |         id: String(idx),
  172 |         action: String(row?.Action || '').toLowerCase(),
  173 |         name: String(row?.DisplayName || ''),
  174 |         direction: String(row?.Direction || ''),
  175 |         enabled: Boolean(row?.Enabled),
  176 |         profile: String(row?.Profile || ''),
  177 |       }))
  178 |     } catch {
  179 |       return []
  180 |     }
  181 |   }
  182 |   const result = await runCommand('ufw status numbered')
  183 |   if (!result.ok || !result.stdout) return []
  184 |   return result.stdout.split('\n').slice(2).filter(Boolean).map((line, idx) => ({
  185 |     id: String(idx),
  186 |     name: line.trim(),
  187 |   }))
  188 | }
  189 | 
  190 | async function listCronJobs() {
  191 |   if (isWindows()) {
  192 |     const result = await runCommand('schtasks /Query /FO CSV /V')
  193 |     if (!result.ok || !result.stdout) return []
  194 |     const lines = result.stdout.split('\n').slice(1, 20).filter(Boolean)
  195 |     return lines.map((line, idx) => ({
  196 |       id: String(idx),
  197 |       name: line.split('","')[0].replace(/^"/, ''),
  198 |       schedule: 'windows',
  199 |       command: line,
  200 |       status: line.includes('Ready') ? 'active' : 'disabled',
  201 |     }))
  202 |   }
  203 |   const result = await runCommand('crontab -l')
  204 |   if (!result.ok || !result.stdout) return []
  205 |   return result.stdout.split('\n').filter((line) => line.trim() && !line.startsWith('#')).map((line, idx) => ({
  206 |     id: String(idx),
  207 |     name: `cron-${idx + 1}`,
  208 |     schedule: line.split(' ').slice(0, 5).join(' '),
  209 |     command: line.split(' ').slice(5).join(' '),
  210 |     status: 'active',
  211 |   }))
  212 | }
  213 | 
  214 | async function listPackages() {
  215 |   if (isWindows()) {
  216 |     const result = await runCommand('powershell -NoProfile -Command "Get-Package | Select-Object -First 80 Name,Version | ConvertTo-Json"')
  217 |     if (!result.ok || !result.stdout) return []
  218 |     try {
  219 |       const parsed = JSON.parse(result.stdout)
  220 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  221 |       return rows.map((row) => ({ name: String(row?.Name || ''), version: String(row?.Version || '') }))
  222 |     } catch {
  223 |       return []
  224 |     }
  225 |   }
  226 |   const dnfCheck = await runCommand('command -v dnf')
  227 |   if (dnfCheck.ok && dnfCheck.stdout) {
  228 |     const result = await runCommand('dnf list installed | head -n 80')
  229 |     if (!result.ok || !result.stdout) return []
  230 |     return result.stdout.split('\n').slice(1).filter(Boolean).map((line) => {
  231 |       const [name, version] = line.replace(/\s+/g, ' ').trim().split(' ')
  232 |       return { name: (name || '').split('.')[0], version: version || '' }
  233 |     })
  234 |   }
  235 |   const yumCheck = await runCommand('command -v yum')
  236 |   if (yumCheck.ok && yumCheck.stdout) {
  237 |     const result = await runCommand('yum list installed | head -n 80')
  238 |     if (!result.ok || !result.stdout) return []
  239 |     return result.stdout.split('\n').slice(1).filter(Boolean).map((line) => {
  240 |       const [name, version] = line.replace(/\s+/g, ' ').trim().split(' ')
  241 |       return { name: (name || '').split('.')[0], version: version || '' }
  242 |     })
  243 |   }
  244 |   const result = await runCommand("apt list --installed 2>/dev/null | head -n 80")
  245 |   if (!result.ok || !result.stdout) return []
  246 |   return result.stdout.split('\n').slice(1).filter(Boolean).map((line) => {
  247 |     const [name, version] = line.split(' ')
  248 |     return { name: (name || '').split('/')[0], version: version || '' }
  249 |   })
  250 | }
  251 | 
  252 | async function listSshKeys() {
  253 |   const keys = []
  254 |   const home = os.homedir()
  255 |   const authPath = path.join(home, '.ssh', 'authorized_keys')
  256 |   const raw = await readTextFile(authPath)
  257 |   if (raw) {
  258 |     raw.split('\n').filter(Boolean).forEach((line, idx) => {
  259 |       keys.push({
  260 |         id: `local-${idx}`,
  261 |         label: line.split(' ').slice(2).join(' ') || `key-${idx + 1}`,
  262 |         fingerprint: crypto.createHash('sha256').update(line).digest('hex').slice(0, 16),
  263 |       })
  264 |     })
  265 |   }
  266 |   if (isWindows()) {
  267 |     try {
  268 |       const usersDir = path.join(process.env.SystemDrive || 'C:\\', 'Users')
  269 |       const entries = await fs.readdir(usersDir, { withFileTypes: true })
  270 |       for (const entry of entries.filter((e) => e.isDirectory())) {
  271 |         const filePath = path.join(usersDir, entry.name, '.ssh', 'authorized_keys')
  272 |         const content = await readTextFile(filePath)
  273 |         if (!content) continue
  274 |         content.split('\n').filter(Boolean).forEach((line, idx) => {
  275 |           keys.push({
  276 |             id: `user-${entry.name}-${idx}`,
  277 |             label: line.split(' ').slice(2).join(' ') || `${entry.name}-key-${idx + 1}`,
  278 |             fingerprint: crypto.createHash('sha256').update(line).digest('hex').slice(0, 16),
  279 |           })
  280 |         })
  281 |       }
  282 |     } catch {
  283 |       // ignore
  284 |     }
  285 |   } else {
  286 |     try {
  287 |       const homes = await fs.readdir('/home', { withFileTypes: true })
  288 |       for (const entry of homes.filter((e) => e.isDirectory())) {
  289 |         const filePath = path.join('/home', entry.name, '.ssh', 'authorized_keys')
  290 |         const content = await readTextFile(filePath)
  291 |         if (!content) continue
  292 |         content.split('\n').filter(Boolean).forEach((line, idx) => {
  293 |           keys.push({
  294 |             id: `user-${entry.name}-${idx}`,
  295 |             label: line.split(' ').slice(2).join(' ') || `${entry.name}-key-${idx + 1}`,
  296 |             fingerprint: crypto.createHash('sha256').update(line).digest('hex').slice(0, 16),
  297 |           })
  298 |         })
  299 |       }
  300 |     } catch {
  301 |       // ignore
  302 |     }
  303 |   }
  304 |   return keys
  305 | }
  306 | 
  307 | async function listSslCerts() {
  308 |   const certs = []
  309 |   const linuxDir = '/etc/letsencrypt/live'
  310 |   const winDir = path.join(process.env.ProgramData || 'C:\\ProgramData', 'letsencrypt', 'live')
  311 |   const dir = isWindows() ? winDir : linuxDir
  312 |   try {
  313 |     const entries = await fs.readdir(dir, { withFileTypes: true })
  314 |     entries.filter((e) => e.isDirectory()).forEach((e) => {
  315 |       certs.push({ id: e.name, domain: e.name, status: 'active', issuer: 'LetsEncrypt' })
  316 |     })
  317 |   } catch {
  318 |     return []
  319 |   }
  320 |   return certs
  321 | }
  322 | 
  323 | async function getDnsServers() {
  324 |   if (isWindows()) {
  325 |     const result = await runCommand('powershell -NoProfile -Command "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -First 4 -ExpandProperty ServerAddresses | ConvertTo-Json"')
  326 |     if (!result.ok || !result.stdout) return []
  327 |     try {
  328 |       const parsed = JSON.parse(result.stdout)
  329 |       return Array.isArray(parsed) ? parsed : [parsed]
  330 |     } catch {
  331 |       return []
  332 |     }
  333 |   }
  334 |   const raw = await readTextFile('/etc/resolv.conf')
  335 |   return raw.split('\n').filter((line) => line.startsWith('nameserver')).map((line) => line.split(' ')[1])
  336 | }
  337 | 
  338 | async function getTimezone() {
  339 |   if (isWindows()) {
  340 |     const result = await runCommand('tzutil /g')
  341 |     return result.stdout?.trim() || ''
  342 |   }
  343 |   const result = await runCommand('timedatectl show -p Timezone --value')
  344 |   return result.stdout?.trim() || ''
  345 | }
  346 | 
  347 | async function getNtpStatus() {
  348 |   if (isWindows()) {
  349 |     const result = await runCommand('w32tm /query /status')
  350 |     return result.stdout ? new Date().toISOString() : ''
  351 |   }
  352 |   const result = await runCommand('timedatectl timesync-status')
  353 |   return result.stdout ? new Date().toISOString() : ''
  354 | }
  355 | 
  356 | export async function getInfraState() {
  357 |   const current = await readLocalJson(STATE_FILE, DEFAULT_STATE)
  358 |   const [osUsers, firewallRules, cronJobs, packages, sshKeys, sslCerts, dnsServers, timezone, ntpStatus, auditLog] = await Promise.all([
  359 |     listOsUsers(),
  360 |     listFirewallRules(),
  361 |     listCronJobs(),
  362 |     listPackages(),
  363 |     listSshKeys(),
  364 |     listSslCerts(),
  365 |     getDnsServers(),
  366 |     getTimezone(),
  367 |     getNtpStatus(),
  368 |     readAuditLog(),
  369 |   ])
  370 |   const infraAudit = auditLog.filter((entry) => String(entry.path || '').includes('/api/infra')).slice(-80)
  371 |   return {
  372 |     ...DEFAULT_STATE,
  373 |     ...current,
  374 |     firewall_rules: firewallRules,
  375 |     packages,
  376 |     cron_jobs: cronJobs,
  377 |     os_users: osUsers,
  378 |     ssh_keys: sshKeys,
  379 |     ssl_certs: sslCerts,
  380 |     security_audit: infraAudit,
  381 |     backups: { ...DEFAULT_STATE.backups, ...(current.backups || {}) },
  382 |     network_settings: {
  383 |       ...(DEFAULT_STATE.network_settings || {}),
  384 |       ...(current.network_settings || {}),
  385 |       dns_servers: dnsServers,
  386 |       interfaces: Object.keys(os.networkInterfaces() || {}).map((name) => ({ name })),
  387 |     },
  388 |     time_settings: { ...DEFAULT_STATE.time_settings, ...(current.time_settings || {}), timezone, last_sync_at: ntpStatus },
  389 |     update_policy: { ...DEFAULT_STATE.update_policy, ...(current.update_policy || {}) },
  390 |   }
  391 | }
  392 | 
  393 | async function updateInfraState(updater) {
  394 |   return updateLocalJson(STATE_FILE, updater, DEFAULT_STATE)
  395 | }
  396 | 
  397 | function appendAction(state, entry) {
  398 |   const next = { ...state }
  399 |   const log = Array.isArray(next.last_actions) ? next.last_actions : []
  400 |   const updated = [entry, ...log].slice(0, 20)
  401 |   next.last_actions = updated
  402 |   return next
  403 | }
  404 | 
  405 | async function runCommand(command) {
  406 |   if (!EXEC_ENABLED) {
  407 |     return { ok: false, simulated: true, stdout: '', stderr: '', exitCode: null }
  408 |   }
  409 | 
  410 |   if (!EXEC_ALLOW_ANY && EXEC_ALLOWLIST.size > 0) {
  411 |     const allowed = [...EXEC_ALLOWLIST].some((prefix) => command.startsWith(prefix))
  412 |     if (!allowed) {
  413 |       return { ok: false, simulated: false, stdout: '', stderr: 'Command not allowlisted.', exitCode: 1 }
  414 |     }
  415 |   }
  416 | 
  417 |   try {
  418 |     const { stdout, stderr } = await execAsync(command, { timeout: EXEC_TIMEOUT_MS, windowsHide: true })
  419 |     return {
  420 |       ok: true,
  421 |       simulated: false,
  422 |       stdout: truncate(stdout),
  423 |       stderr: truncate(stderr),
  424 |       exitCode: 0,
  425 |     }
  426 |   } catch (error) {
  427 |     return {
  428 |       ok: false,
  429 |       simulated: false,
  430 |       stdout: truncate(error?.stdout || ''),
  431 |       stderr: truncate(error?.stderr || error?.message || ''),
  432 |       exitCode: typeof error?.code === 'number' ? error.code : 1,
  433 |     }
  434 |   }
  435 | }
  436 | 
  437 | async function getDiskUsage() {
  438 |   if (isWindows()) {
  439 |     const cmd = 'powershell -NoProfile -Command "Get-PSDrive -PSProvider FileSystem | Select-Object Name,Used,Free | ConvertTo-Json"'
  440 |     const result = await runCommand(cmd)
  441 |     if (!result.ok || !result.stdout) return []
  442 |     try {
  443 |       const parsed = JSON.parse(result.stdout)
  444 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  445 |       return rows.map((row) => ({
  446 |         mount: String(row?.Name || ''),
  447 |         used_bytes: Number(row?.Used || 0),
  448 |         free_bytes: Number(row?.Free || 0),
  449 |       }))
  450 |     } catch {
  451 |       return []
  452 |     }
  453 |   }
  454 | 
  455 |   const cmd = 'df -kP'
  456 |   const result = await runCommand(cmd)
  457 |   if (!result.ok || !result.stdout) return []
  458 |   const lines = result.stdout.split('\n').slice(1).filter(Boolean)
  459 |   return lines.map((line) => {
  460 |     const parts = line.replace(/\s+/g, ' ').trim().split(' ')
  461 |     return {
  462 |       mount: parts[5] || '',
  463 |       used_bytes: Number(parts[2] || 0) * 1024,
  464 |       free_bytes: Number(parts[3] || 0) * 1024,
  465 |     }
  466 |   })
  467 | }
  468 | 
  469 | async function getProcessList() {
  470 |   if (isWindows()) {
  471 |     const cmd = 'powershell -NoProfile -Command "Get-Process | Select-Object -First 60 Id,ProcessName,CPU,WS | ConvertTo-Json"'
  472 |     const result = await runCommand(cmd)
  473 |     if (!result.ok || !result.stdout) return []
  474 |     try {
  475 |       const parsed = JSON.parse(result.stdout)
  476 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  477 |       return rows.map((row) => ({
  478 |         pid: Number(row?.Id),
  479 |         name: String(row?.ProcessName || ''),
  480 |         cpu: Number(row?.CPU || 0),
  481 |         memory_bytes: Number(row?.WS || 0),
  482 |       }))
  483 |     } catch {
  484 |       return []
  485 |     }
  486 |   }
  487 | 
  488 |   const cmd = 'ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -n 30'
  489 |   const result = await runCommand(cmd)
  490 |   if (!result.ok || !result.stdout) return []
  491 |   const lines = result.stdout.split('\n').slice(1).filter(Boolean)
  492 |   return lines.map((line) => {
  493 |     const parts = line.trim().split(/\s+/g)
  494 |     return {
  495 |       pid: Number(parts[0] || 0),
  496 |       name: parts[1] || '',
  497 |       cpu: Number(parts[2] || 0),
  498 |       memory_percent: Number(parts[3] || 0),
  499 |     }
  500 |   })
  501 | }
  502 | 
  503 | async function getServiceList() {
  504 |   if (isWindows()) {
  505 |     const cmd = 'powershell -NoProfile -Command "Get-Service | Select-Object -First 80 Name,DisplayName,Status,StartType | ConvertTo-Json"'
  506 |     const result = await runCommand(cmd)
  507 |     if (!result.ok || !result.stdout) return []
  508 |     try {
  509 |       const parsed = JSON.parse(result.stdout)
  510 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  511 |       return rows.map((row) => ({
  512 |         name: String(row?.Name || ''),
  513 |         display_name: String(row?.DisplayName || ''),
  514 |         status: String(row?.Status || ''),
  515 |         start_type: String(row?.StartType || ''),
  516 |       }))
  517 |     } catch {
  518 |       return []
  519 |     }
  520 |   }
  521 | 
  522 |   const cmd = 'systemctl list-units --type=service --no-pager --no-legend | head -n 40'
  523 |   const result = await runCommand(cmd)
  524 |   if (!result.ok || !result.stdout) return []
  525 |   return result.stdout.split('\n').filter(Boolean).map((line) => {
  526 |     const parts = line.trim().split(/\s+/g)
  527 |     return {
  528 |       name: parts[0] || '',
  529 |       status: parts[2] || '',
  530 |       description: parts.slice(4).join(' '),
  531 |     }
  532 |   })
  533 | }
  534 | 
  535 | export async function getSystemOverview() {
  536 |   const cpus = os.cpus()
  537 |   const totalMem = os.totalmem()
  538 |   const freeMem = os.freemem()
  539 |   const load = os.loadavg()
  540 |   const disks = await getDiskUsage()
  541 |   const processes = await getProcessList()
  542 |   const services = await getServiceList()
  543 |   const interfaces = os.networkInterfaces()
  544 |   const ifaceCount = Object.keys(interfaces || {}).length
  545 |   const bandwidthEstimate = await getBandwidthMbps()
  546 |   const diskIops = await getDiskIops()
  547 | 
  548 |   return {
  549 |     generated_at: new Date().toISOString(),
  550 |     platform: os.platform(),
  551 |     release: os.release(),
  552 |     hostname: os.hostname(),
  553 |     uptime_seconds: os.uptime(),
  554 |     cpu: {
  555 |       cores: cpus.length,
  556 |       model: cpus[0]?.model || '',
  557 |       load_1m: load[0] || 0,
  558 |       load_5m: load[1] || 0,
  559 |       load_15m: load[2] || 0,
  560 |     },
  561 |     memory: {
  562 |       total_bytes: totalMem,
  563 |       free_bytes: freeMem,
  564 |       used_bytes: Math.max(0, totalMem - freeMem),
  565 |     },
  566 |     storage: disks,
  567 |     io: {
  568 |       disk_iops: diskIops,
  569 |     },
  570 |     network: {
  571 |       interfaces: ifaceCount,
  572 |       bandwidth_mbps: bandwidthEstimate || null,
  573 |     },
  574 |     processes,
  575 |     services,
  576 |     exec_enabled: EXEC_ENABLED,
  577 |   }
  578 | }
  579 | 
  580 | export async function listProcesses() {
  581 |   return getProcessList()
  582 | }
  583 | 
  584 | export async function listServices() {
  585 |   return getServiceList()
  586 | }
  587 | 
  588 | export async function listStorage() {
  589 |   return getDiskUsage()
  590 | }
  591 | 
  592 | export async function performInfraAction(action = '', payload = {}) {
  593 |   const actionId = crypto.randomUUID()
  594 |   const name = String(action || '')
  595 |   const requestedAt = new Date().toISOString()
  596 | 
  597 |   const response = {
  598 |     action_id: actionId,
  599 |     action: name,
  600 |     requested_at: requestedAt,
  601 |     payload,
  602 |     simulated: !EXEC_ENABLED,
  603 |     status: EXEC_ENABLED ? 'executed' : 'queued',
  604 |     result: null,
  605 |     state: null,
  606 |   }
  607 |   let command = ''
  608 |   let stateUpdater = null
  609 | 
  610 |   if (name === 'firewall.allow_port' || name === 'firewall.block_port') {
  611 |     const port = normalizePort(payload?.port)
  612 |     const protocol = normalizeProtocol(payload?.protocol)
  613 |     const actionType = name === 'firewall.allow_port' ? 'allow' : 'block'
  614 |     const description = String(payload?.description || '').trim()
  615 |     if (!port) {
  616 |       response.result = { ok: false, message: 'Valid port is required.' }
  617 |       return response
  618 |     }
  619 |     const systemName = `Admin${actionType}-${port}-${protocol}-${actionId.slice(0, 6)}`
  620 |     stateUpdater = (state) => {
  621 |       const rules = Array.isArray(state.firewall_rules) ? state.firewall_rules : []
  622 |       const nextRule = {
  623 |         id: actionId,
  624 |         action: actionType,
  625 |         port,
  626 |         protocol,
  627 |         source: String(payload?.source || 'any'),
  628 |         description,
  629 |         system_name: systemName,
  630 |         created_at: requestedAt,
  631 |         updated_at: requestedAt,
  632 |       }
  633 |       return { ...state, firewall_rules: [...rules, nextRule] }
  634 |     }
  635 |     command = isWindows()
  636 |       ? `netsh advfirewall firewall add rule name="${systemName}" dir=in action=${actionType} protocol=${protocol} localport=${port}`
  637 |       : actionType === 'allow'
  638 |         ? `ufw allow ${port}/${protocol}`
  639 |         : `ufw deny ${port}/${protocol}`
  640 |   } else if (name === 'firewall.remove_rule') {
  641 |     const ruleId = String(payload?.rule_id || '').trim()
  642 |     if (!ruleId) {
  643 |       response.result = { ok: false, message: 'rule_id is required.' }
  644 |       return response
  645 |     }
  646 |     const current = await getInfraState()
  647 |     const rule = (current.firewall_rules || []).find((r) => String(r.id) === ruleId)
  648 |     stateUpdater = (state) => ({
  649 |       ...state,
  650 |       firewall_rules: (state.firewall_rules || []).filter((r) => String(r.id) !== ruleId),
  651 |     })
  652 |     if (rule) {
  653 |       const protocol = rule.protocol || 'tcp'
  654 |       const port = rule.port || ''
  655 |       const actionType = rule.action || 'allow'
  656 |       if (isWindows()) {
  657 |         const systemName = rule.system_name || `Admin${actionType}-${port}-${protocol}`
  658 |         command = `netsh advfirewall firewall delete rule name="${systemName}"`
  659 |       } else {
  660 |         command = actionType === 'allow'
  661 |           ? `ufw delete allow ${port}/${protocol}`
  662 |           : `ufw delete deny ${port}/${protocol}`
  663 |       }
  664 |     }
  665 |   } else if (name === 'package.update') {
  666 |     const mode = String(payload?.mode || 'check').toLowerCase()
  667 |     const apply = payload?.apply === true || String(payload?.apply || '').toLowerCase() === 'true'
  668 |     const updateId = crypto.randomUUID()
  669 |     stateUpdater = (state) => {
  670 |       const updates = Array.isArray(state.updates) ? state.updates : []
  671 |       updates.unshift({
  672 |         id: updateId,
  673 |         mode,
  674 |         apply,
  675 |         status: EXEC_ENABLED && apply ? 'applied' : 'queued',
  676 |         requested_at: requestedAt,
  677 |       })
  678 |       return { ...state, updates: updates.slice(0, 40) }
  679 |     }
  680 |     if (isWindows()) {
  681 |       command = apply
  682 |         ? 'powershell -NoProfile -Command "winget upgrade --all --accept-package-agreements --accept-source-agreements --silent"'
  683 |         : 'powershell -NoProfile -Command "winget upgrade"'
  684 |     } else {
  685 |       const dnf = await runCommand('command -v dnf')
  686 |       const yum = await runCommand('command -v yum')
  687 |       if (dnf.ok && dnf.stdout) {
  688 |         command = apply ? 'dnf upgrade -y' : 'dnf check-update'
  689 |       } else if (yum.ok && yum.stdout) {
  690 |         command = apply ? 'yum update -y' : 'yum check-update'
  691 |       } else {
  692 |         command = apply
  693 |           ? 'apt-get update && apt-get upgrade -y'
  694 |           : 'apt-get update'
  695 |       }
  696 |     }
  697 |   } else if (name === 'package.install') {
  698 |     const pkg = String(payload?.package || payload?.name || '').trim()
  699 |     if (!pkg) {
  700 |       response.result = { ok: false, message: 'package name is required.' }
  701 |       return response
  702 |     }
  703 |     stateUpdater = (state) => {
  704 |       const packages = Array.isArray(state.packages) ? state.packages : []
  705 |       const existing = packages.find((row) => row.name === pkg)
  706 |       const nextRow = { name: pkg, status: 'installed', updated_at: requestedAt }
  707 |       const next = existing
  708 |         ? packages.map((row) => (row.name === pkg ? { ...row, ...nextRow } : row))
  709 |         : [...packages, nextRow]
  710 |       return { ...state, packages: next }
  711 |     }
  712 |     if (isWindows()) {
  713 |       command = `powershell -NoProfile -Command "winget install --id ${pkg} --accept-package-agreements --accept-source-agreements --silent"`
  714 |     } else {
  715 |       const dnf = await runCommand('command -v dnf')
  716 |       const yum = await runCommand('command -v yum')
  717 |       command = dnf.ok && dnf.stdout
  718 |         ? `dnf install -y ${pkg}`
  719 |         : yum.ok && yum.stdout
  720 |           ? `yum install -y ${pkg}`
  721 |           : `apt-get install -y ${pkg}`
  722 |     }
  723 |   } else if (name === 'package.remove') {
  724 |     const pkg = String(payload?.package || payload?.name || '').trim()
  725 |     if (!pkg) {
  726 |       response.result = { ok: false, message: 'package name is required.' }
  727 |       return response
  728 |     }
  729 |     stateUpdater = (state) => ({
  730 |       ...state,
  731 |       packages: (state.packages || []).filter((row) => row.name !== pkg),
  732 |     })
  733 |     if (isWindows()) {
  734 |       command = `powershell -NoProfile -Command "winget uninstall --id ${pkg} --silent"`
  735 |     } else {
  736 |       const dnf = await runCommand('command -v dnf')
  737 |       const yum = await runCommand('command -v yum')
  738 |       command = dnf.ok && dnf.stdout
  739 |         ? `dnf remove -y ${pkg}`
  740 |         : yum.ok && yum.stdout
  741 |           ? `yum remove -y ${pkg}`
  742 |           : `apt-get remove -y ${pkg}`
  743 |     }
  744 |   } else if (name === 'cron.add') {
  745 |     const schedule = String(payload?.schedule || '').trim()
  746 |     const taskCommand = String(payload?.command || '').trim()
  747 |     const label = String(payload?.name || 'Scheduled job').trim()
  748 |     if (!schedule || !taskCommand) {
  749 |       response.result = { ok: false, message: 'schedule and command are required.' }
  750 |       return response
  751 |     }
  752 |     const jobId = crypto.randomUUID()
  753 |     stateUpdater = (state) => {
  754 |       const jobs = Array.isArray(state.cron_jobs) ? state.cron_jobs : []
  755 |       const nextJob = {
  756 |         id: jobId,
  757 |         name: label,
  758 |         schedule,
  759 |         command: taskCommand,
  760 |         status: 'active',
  761 |         created_at: requestedAt,
  762 |         updated_at: requestedAt,
  763 |       }
  764 |       return { ...state, cron_jobs: [...jobs, nextJob] }
  765 |     }
  766 |     command = isWindows()
  767 |       ? `schtasks /Create /SC DAILY /TN "AdminJob-${jobId.slice(0, 6)}" /TR "${taskCommand}" /ST 02:00`
  768 |       : 'echo "Cron job scheduled"'
  769 |   } else if (name === 'cron.remove') {
  770 |     const jobId = String(payload?.job_id || '').trim()
  771 |     if (!jobId) {
  772 |       response.result = { ok: false, message: 'job_id is required.' }
  773 |       return response
  774 |     }
  775 |     stateUpdater = (state) => ({
  776 |       ...state,
  777 |       cron_jobs: (state.cron_jobs || []).filter((job) => String(job.id) !== jobId),
  778 |     })
  779 |     command = isWindows()
  780 |       ? `schtasks /Delete /TN "AdminJob-${jobId.slice(0, 6)}" /F`
  781 |       : 'echo "Cron job removed"'
  782 |   } else if (name === 'cron.toggle') {
  783 |     const jobId = String(payload?.job_id || '').trim()
  784 |     const enabled = payload?.enabled !== undefined ? Boolean(payload.enabled) : true
  785 |     if (!jobId) {
  786 |       response.result = { ok: false, message: 'job_id is required.' }
  787 |       return response
  788 |     }
  789 |     stateUpdater = (state) => ({
  790 |       ...state,
  791 |       cron_jobs: (state.cron_jobs || []).map((job) => (
  792 |         String(job.id) === jobId
  793 |           ? { ...job, status: enabled ? 'active' : 'disabled', updated_at: requestedAt }
  794 |           : job
  795 |       )),
  796 |     })
  797 |     command = isWindows()
  798 |       ? `schtasks /Change /TN "AdminJob-${jobId.slice(0, 6)}" ${enabled ? '/ENABLE' : '/DISABLE'}`
  799 |       : 'echo "Cron job toggled"'
  800 |   } else if (name === 'log.collect') {
  801 |     const level = String(payload?.level || 'info').trim()
  802 |     const message = String(payload?.message || 'System log collected').trim()
  803 |     stateUpdater = (state) => {
  804 |       const logs = Array.isArray(state.logs) ? state.logs : []
  805 |       const entry = { id: actionId, level, message, created_at: requestedAt }
  806 |       return { ...state, logs: [entry, ...logs].slice(0, 200) }
  807 |     }
  808 |     command = isWindows()
  809 |       ? 'powershell -NoProfile -Command "Get-EventLog -LogName System -Newest 20"'
  810 |       : 'tail -n 20 /var/log/syslog'
  811 |   } else if (name === 'log.rotate') {
  812 |     stateUpdater = (state) => ({ ...state, logs: [] })
  813 |     command = isWindows()
  814 |       ? 'powershell -NoProfile -Command "Write-Output \'Logs rotated\'"'
  815 |       : 'echo "Logs rotated"'
  816 |   } else if (name === 'process.scan_zombies') {
  817 |     const processList = await getProcessList()
  818 |     stateUpdater = (state) => {
  819 |       const zombies = processList
  820 |         .filter((proc) => Number(proc.cpu || 0) === 0)
  821 |         .slice(0, 10)
  822 |         .map((proc) => ({ ...proc, state: 'zombie', detected_at: requestedAt }))
  823 |       return { ...state, zombie_processes: zombies }
  824 |     }
  825 |     command = isWindows()
  826 |       ? 'powershell -NoProfile -Command "Get-Process | Where-Object { $_.CPU -eq $null } | Select-Object -First 5"'
  827 |       : 'ps -eo pid,stat,comm | grep Z'
  828 |   } else if (name === 'os.user.create') {
  829 |     const username = String(payload?.username || '').trim()
  830 |     if (!username) {
  831 |       response.result = { ok: false, message: 'username is required.' }
  832 |       return response
  833 |     }
  834 |     stateUpdater = (state) => {
  835 |       const users = Array.isArray(state.os_users) ? state.os_users : []
  836 |       const entry = {
  837 |         id: actionId,
  838 |         username,
  839 |         role: payload?.role || 'user',
  840 |         status: 'active',
  841 |         created_at: requestedAt,
  842 |       }
  843 |       return { ...state, os_users: [...users, entry] }
  844 |     }
  845 |     command = isWindows()
  846 |       ? `net user ${username} /add`
  847 |       : `useradd ${username}`
  848 |   } else if (name === 'os.user.delete') {
  849 |     const username = String(payload?.username || '').trim()
  850 |     stateUpdater = (state) => ({
  851 |       ...state,
  852 |       os_users: (state.os_users || []).filter((u) => String(u.username) !== username),
  853 |     })
  854 |     command = isWindows()
  855 |       ? `net user ${username} /delete`
  856 |       : `userdel ${username}`
  857 |   } else if (name === 'os.user.reset') {
  858 |     const username = String(payload?.username || '').trim()
  859 |     stateUpdater = (state) => ({
  860 |       ...state,
  861 |       os_users: (state.os_users || []).map((u) => (
  862 |         String(u.username) === username ? { ...u, password_reset_at: requestedAt } : u
  863 |       )),
  864 |     })
  865 |     command = isWindows()
  866 |       ? `net user ${username} *`
  867 |       : `passwd ${username}`
  868 |   } else if (name === 'os.user.sudo') {
  869 |     const username = String(payload?.username || '').trim()
  870 |     const enabled = payload?.enabled !== undefined ? Boolean(payload.enabled) : true
  871 |     stateUpdater = (state) => ({
  872 |       ...state,
  873 |       os_users: (state.os_users || []).map((u) => (
  874 |         String(u.username) === username ? { ...u, sudo: enabled, updated_at: requestedAt } : u
  875 |       )),
  876 |     })
  877 |     command = isWindows()
  878 |       ? 'powershell -NoProfile -Command "Write-Output \'Sudo privileges updated\'"'
  879 |       : enabled ? `usermod -aG sudo ${username}` : `gpasswd -d ${username} sudo`
  880 |   } else if (name === 'ssh.key.add') {
  881 |     const label = String(payload?.label || `key-${actionId.slice(0, 6)}`).trim()
  882 |     const fingerprint = String(payload?.fingerprint || '').trim()
  883 |     stateUpdater = (state) => {
  884 |       const keys = Array.isArray(state.ssh_keys) ? state.ssh_keys : []
  885 |       return { ...state, ssh_keys: [...keys, { id: actionId, label, fingerprint, created_at: requestedAt }] }
  886 |     }
  887 |     command = isWindows()
  888 |       ? 'powershell -NoProfile -Command "Write-Output \'SSH key added\'"'
  889 |       : 'echo "ssh key added"'
  890 |   } else if (name === 'ssh.key.remove') {
  891 |     const keyId = String(payload?.key_id || '').trim()
  892 |     stateUpdater = (state) => ({
  893 |       ...state,
  894 |       ssh_keys: (state.ssh_keys || []).filter((k) => String(k.id) !== keyId),
  895 |     })
  896 |     command = isWindows()
  897 |       ? 'powershell -NoProfile -Command "Write-Output \'SSH key removed\'"'
  898 |       : 'echo "ssh key removed"'
  899 |   } else if (name === 'ssl.cert.issue' || name === 'ssl.cert.renew' || name === 'ssl.cert.revoke') {
  900 |     const domain = String(payload?.domain || '').trim()
  901 |     if (!domain) {
  902 |       response.result = { ok: false, message: 'domain is required.' }
  903 |       return response
  904 |     }
  905 |     const status = name === 'ssl.cert.revoke' ? 'revoked' : 'active'
  906 |     stateUpdater = (state) => {
  907 |       const certs = Array.isArray(state.ssl_certs) ? state.ssl_certs : []
  908 |       const existing = certs.find((c) => String(c.domain) === domain)
  909 |       const entry = existing
  910 |         ? { ...existing, status, updated_at: requestedAt }
  911 |         : { id: actionId, domain, status, issuer: 'LetsEncrypt', issued_at: requestedAt, updated_at: requestedAt }
  912 |       const next = existing
  913 |         ? certs.map((c) => (String(c.domain) === domain ? entry : c))
  914 |         : [...certs, entry]
  915 |       return { ...state, ssl_certs: next }
  916 |     }
  917 |     if (isWindows()) {
  918 |       command = 'powershell -NoProfile -Command "Write-Output \'SSL action queued\'"'
  919 |     } else if (name === 'ssl.cert.revoke') {
  920 |       command = `certbot revoke --cert-name ${domain} --reason cessationOfOperation`
  921 |     } else if (name === 'ssl.cert.renew') {
  922 |       command = `certbot renew --cert-name ${domain}`
  923 |     } else {
  924 |       command = `certbot certonly --standalone -d ${domain} --agree-tos --non-interactive`
  925 |     }
  926 |   } else if (name === 'backup.retention') {
  927 |     const days = Number(payload?.retention_days || payload?.days || 7)
  928 |     stateUpdater = (state) => ({
  929 |       ...state,
  930 |       backups: { ...(state.backups || {}), retention_days: days },
  931 |     })
  932 |     command = isWindows()
  933 |       ? 'powershell -NoProfile -Command "Write-Output \'Backup retention updated\'"'
  934 |       : 'echo "backup retention updated"'
  935 |   } else if (name === 'backup.restore') {
  936 |     stateUpdater = (state) => {
  937 |       const history = Array.isArray(state.backups?.history) ? state.backups.history : []
  938 |       const entry = { id: actionId, restored_at: requestedAt, status: 'completed' }
  939 |       return {
  940 |         ...state,
  941 |         backups: { ...(state.backups || {}), history: [entry, ...history].slice(0, 20) },
  942 |       }
  943 |     }
  944 |     command = isWindows()
  945 |       ? 'powershell -NoProfile -Command "Write-Output \'Restore started\'"'
  946 |       : 'echo "restore started"'
  947 |   } else if (name === 'network.interface.update') {
  948 |     const iface = String(payload?.interface || payload?.name || '').trim()
  949 |     const ip = String(payload?.ip || '').trim()
  950 |     stateUpdater = (state) => {
  951 |       const interfaces = Array.isArray(state.network_settings?.interfaces) ? state.network_settings.interfaces : []
  952 |       const next = interfaces.some((i) => String(i.name) === iface)
  953 |         ? interfaces.map((i) => (String(i.name) === iface ? { ...i, ip, updated_at: requestedAt } : i))
  954 |         : [...interfaces, { name: iface, ip, updated_at: requestedAt }]
  955 |       return { ...state, network_settings: { ...state.network_settings, interfaces: next } }
  956 |     }
  957 |     command = isWindows()
  958 |       ? `netsh interface ip set address name="${iface}" static ${ip}`
  959 |       : `ip addr add ${ip} dev ${iface}`
  960 |   } else if (name === 'network.dns.update') {
  961 |     const servers = Array.isArray(payload?.servers)
  962 |       ? payload.servers
  963 |       : String(payload?.servers || '').split(',').map((v) => v.trim()).filter(Boolean)
  964 |     stateUpdater = (state) => ({
  965 |       ...state,
  966 |       network_settings: { ...state.network_settings, dns_servers: servers },
  967 |     })
  968 |     command = isWindows()
  969 |       ? 'powershell -NoProfile -Command "Write-Output \'DNS updated\'"'
  970 |       : 'echo "dns updated"'
  971 |   } else if (name === 'system.timezone.set') {
  972 |     const zone = String(payload?.timezone || '').trim()
  973 |     stateUpdater = (state) => ({
  974 |       ...state,
  975 |       time_settings: { ...state.time_settings, timezone: zone || state.time_settings.timezone },
  976 |     })
  977 |     command = isWindows()
  978 |       ? `tzutil /s "${zone}"`
  979 |       : `timedatectl set-timezone ${zone}`
  980 |   } else if (name === 'system.ntp.sync') {
  981 |     stateUpdater = (state) => ({
  982 |       ...state,
  983 |       time_settings: { ...state.time_settings, last_sync_at: requestedAt },
  984 |     })
  985 |     command = isWindows()
  986 |       ? 'w32tm /resync'
  987 |       : 'timedatectl timesync-status'
  988 |   } else if (name === 'update.policy') {
  989 |     const enabled = payload?.auto_updates !== undefined ? Boolean(payload.auto_updates) : undefined
  990 |     const window = String(payload?.patch_window || '').trim()
  991 |     stateUpdater = (state) => ({
  992 |       ...state,
  993 |       update_policy: {
  994 |         auto_updates: enabled !== undefined ? enabled : state.update_policy.auto_updates,
  995 |         patch_window: window || state.update_policy.patch_window,
  996 |       },
  997 |     })
  998 |     command = isWindows()
  999 |       ? 'powershell -NoProfile -Command "Write-Output \'Update policy set\'"'
 1000 |       : 'echo "update policy set"'
 1001 |   } else if (name === 'service.restart') {
 1002 |     const target = String(payload?.service || '').trim()
 1003 |     command = isWindows()
 1004 |       ? `powershell -NoProfile -Command "Restart-Service -Name '${target}' -ErrorAction Stop"`
 1005 |       : `systemctl restart ${target}`
 1006 |   } else if (name === 'service.stop') {
 1007 |     const target = String(payload?.service || '').trim()
 1008 |     command = isWindows()
 1009 |       ? `powershell -NoProfile -Command "Stop-Service -Name '${target}' -ErrorAction Stop"`
 1010 |       : `systemctl stop ${target}`
 1011 |   } else if (name === 'service.start') {
 1012 |     const target = String(payload?.service || '').trim()
 1013 |     command = isWindows()
 1014 |       ? `powershell -NoProfile -Command "Start-Service -Name '${target}' -ErrorAction Stop"`
 1015 |       : `systemctl start ${target}`
 1016 |   } else if (name === 'process.kill') {
 1017 |     const pid = Number(payload?.pid || 0)
 1018 |     command = isWindows()
 1019 |       ? `powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`
 1020 |       : `kill -9 ${pid}`
 1021 |   } else if (name === 'backup.run') {
 1022 |     stateUpdater = (state) => ({
 1023 |       ...state,
 1024 |       backups: {
 1025 |         ...(state.backups || {}),
 1026 |         last_run_at: requestedAt,
 1027 |         last_status: EXEC_ENABLED ? 'started' : 'queued',
 1028 |         history: [
 1029 |           { id: actionId, started_at: requestedAt, status: EXEC_ENABLED ? 'started' : 'queued' },
 1030 |           ...((state.backups || {}).history || []),
 1031 |         ].slice(0, 20),
 1032 |       },
 1033 |     })
 1034 |     const backupDir = path.join(process.cwd(), 'server', 'backups')
 1035 |     const backupName = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`
 1036 |     const backupPath = path.join(backupDir, backupName)
 1037 |     await fs.mkdir(backupDir, { recursive: true }).catch(() => {})
 1038 |     command = isWindows()
 1039 |       ? `powershell -NoProfile -Command "Compress-Archive -Path '${path.join(process.cwd(), 'server', 'database', '*')}' -DestinationPath '${backupPath}' -Force"`
 1040 |       : `tar -czf ${backupPath} -C ${path.join(process.cwd(), 'server', 'database')} .`
 1041 |   } else if (name === 'command.execute') {
 1042 |     const raw = String(payload?.command || '').trim()
 1043 |     command = raw
 1044 |   }
 1045 | 
 1046 |   if (stateUpdater) {
 1047 |     response.state = await updateInfraState(stateUpdater)
 1048 |   }
 1049 | 
 1050 |   if (!command) {
 1051 |     response.result = { ok: Boolean(stateUpdater), message: 'Unknown or unsupported action.' }
 1052 |     return response
 1053 |   }
 1054 | 
 1055 |   if (!EXEC_ENABLED) {
 1056 |     response.result = { ok: true, simulated: true, message: 'Simulation mode: no system command executed.' }
 1057 |   } else {
 1058 |     response.result = await runCommand(command)
 1059 |   }
 1060 | 
 1061 |   response.state = response.state || await getInfraState()
 1062 |   await updateInfraState((state) => appendAction(state, {
 1063 |     id: actionId,
 1064 |     action: name,
 1065 |     at: requestedAt,
 1066 |     status: response.result?.ok ? 'ok' : 'error',
 1067 |     payload,
 1068 |     message: response.result?.stderr || response.result?.stdout || '',
 1069 |   }))
 1070 |   return response
 1071 | }
 1072 | 