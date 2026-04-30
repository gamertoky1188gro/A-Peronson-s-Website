    1 | import crypto from 'crypto'
    2 | import { exec } from 'child_process'
    3 | import util from 'util'
    4 | import os from 'os'
    5 | import fs from 'fs/promises'
    6 | import path from 'path'
    7 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
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
   20 | const STATE_FILE = 'network_state.json'
   21 | const BACKUP_DIR = path.join(process.cwd(), 'server', 'network_backups')
   22 | const DEFAULT_INVENTORY = {
   23 |   devices: [],
   24 |   alerts: [],
   25 |   topology: { nodes: [], links: [] },
   26 |   vlans: [],
   27 |   ipam_reservations: [],
   28 |   dhcp_pools: [],
   29 |   vpn_tunnels: [],
   30 |   tunnels: [],
   31 |   qos_policies: [],
   32 |   traffic_shapes: [],
   33 |   config_backups: [],
   34 |   firmware_jobs: [],
   35 |   config_audit: [],
   36 |   clients: [],
   37 |   ids_alerts: [],
   38 |   auth_servers: [],
   39 |   rogue_aps: [],
   40 |   flow_stats: [],
   41 |   alert_integrations: [],
   42 |   firewall_policies: [],
   43 |   bulk_config_jobs: [],
   44 |   config_restore_jobs: [],
   45 |   discovery_jobs: [],
   46 | }
   47 | 
   48 | function mergeInventory(current = {}) {
   49 |   const merged = { ...DEFAULT_INVENTORY, ...current }
   50 |   merged.devices = Array.isArray(current.devices) ? current.devices : DEFAULT_INVENTORY.devices
   51 |   merged.alerts = Array.isArray(current.alerts) ? current.alerts : DEFAULT_INVENTORY.alerts
   52 |   merged.topology = current.topology || DEFAULT_INVENTORY.topology
   53 |   merged.vlans = Array.isArray(current.vlans) ? current.vlans : DEFAULT_INVENTORY.vlans
   54 |   merged.ipam_reservations = Array.isArray(current.ipam_reservations) ? current.ipam_reservations : []
   55 |   merged.dhcp_pools = Array.isArray(current.dhcp_pools) ? current.dhcp_pools : []
   56 |   merged.vpn_tunnels = Array.isArray(current.vpn_tunnels) ? current.vpn_tunnels : []
   57 |   merged.tunnels = Array.isArray(current.tunnels) ? current.tunnels : []
   58 |   merged.qos_policies = Array.isArray(current.qos_policies) ? current.qos_policies : []
   59 |   merged.traffic_shapes = Array.isArray(current.traffic_shapes) ? current.traffic_shapes : []
   60 |   merged.config_backups = Array.isArray(current.config_backups) ? current.config_backups : []
   61 |   merged.firmware_jobs = Array.isArray(current.firmware_jobs) ? current.firmware_jobs : []
   62 |   merged.config_audit = Array.isArray(current.config_audit) ? current.config_audit : []
   63 |   merged.clients = Array.isArray(current.clients) ? current.clients : []
   64 |   merged.ids_alerts = Array.isArray(current.ids_alerts) ? current.ids_alerts : []
   65 |   merged.auth_servers = Array.isArray(current.auth_servers) ? current.auth_servers : []
   66 |   merged.rogue_aps = Array.isArray(current.rogue_aps) ? current.rogue_aps : []
   67 |   merged.flow_stats = Array.isArray(current.flow_stats) ? current.flow_stats : []
   68 |   merged.alert_integrations = Array.isArray(current.alert_integrations) ? current.alert_integrations : []
   69 |   merged.firewall_policies = Array.isArray(current.firewall_policies) ? current.firewall_policies : []
   70 |   merged.bulk_config_jobs = Array.isArray(current.bulk_config_jobs) ? current.bulk_config_jobs : []
   71 |   merged.config_restore_jobs = Array.isArray(current.config_restore_jobs) ? current.config_restore_jobs : []
   72 |   merged.discovery_jobs = Array.isArray(current.discovery_jobs) ? current.discovery_jobs : []
   73 |   return merged
   74 | }
   75 | 
   76 | async function getDynamicInterfaces() {
   77 |   const interfaces = os.networkInterfaces()
   78 |   return Object.entries(interfaces).flatMap(([name, entries]) => {
   79 |     const rows = Array.isArray(entries) ? entries : []
   80 |     return rows.map((entry, idx) => ({
   81 |       id: `${name}-${idx}`,
   82 |       name,
   83 |       type: 'interface',
   84 |       ip: entry.address,
   85 |       mac: entry.mac,
   86 |       status: entry.internal ? 'internal' : 'up',
   87 |       family: entry.family,
   88 |     }))
   89 |   })
   90 | }
   91 | 
   92 | async function getDynamicClients() {
   93 |   if (process.platform === 'win32') {
   94 |     const result = await runCommand('powershell -NoProfile -Command "Get-NetNeighbor -AddressFamily IPv4 | Select-Object -First 40 IPAddress,LinkLayerAddress,State,InterfaceAlias | ConvertTo-Json"')
   95 |     if (!result.ok || !result.stdout) return []
   96 |     try {
   97 |       const parsed = JSON.parse(result.stdout)
   98 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
   99 |       return rows.map((row) => ({
  100 |         id: `${row?.IPAddress}`,
  101 |         ip: row?.IPAddress,
  102 |         mac: row?.LinkLayerAddress,
  103 |         status: row?.State,
  104 |         interface: row?.InterfaceAlias,
  105 |       }))
  106 |     } catch {
  107 |       return []
  108 |     }
  109 |   }
  110 |   const result = await runCommand('ip neigh show | head -n 40')
  111 |   if (!result.ok || !result.stdout) return []
  112 |   return result.stdout.split('\n').filter(Boolean).map((line, idx) => ({
  113 |     id: `neigh-${idx}`,
  114 |     ip: line.split(' ')[0],
  115 |     mac: line.split(' ')[4] || '',
  116 |     status: line.split(' ')[5] || '',
  117 |   }))
  118 | }
  119 | 
  120 | async function getDynamicTopology(devices = []) {
  121 |   const nodes = devices.map((device) => ({ id: device.id, label: device.name || device.id }))
  122 |   const gateway = await getDefaultGateway()
  123 |   if (gateway) {
  124 |     nodes.unshift({ id: `gateway-${gateway}`, label: `Gateway ${gateway}` })
  125 |   }
  126 |   const links = []
  127 |   if (nodes.length > 1) {
  128 |     for (let i = 1; i < nodes.length; i += 1) {
  129 |       links.push({ source: nodes[0].id, target: nodes[i].id })
  130 |     }
  131 |   }
  132 |   return { nodes, links }
  133 | }
  134 | 
  135 | async function listConfigBackups() {
  136 |   try {
  137 |     const entries = await fs.readdir(BACKUP_DIR, { withFileTypes: true })
  138 |     const files = entries.filter((entry) => entry.isFile()).slice(0, 50)
  139 |     const rows = await Promise.all(files.map(async (file) => {
  140 |       const filePath = path.join(BACKUP_DIR, file.name)
  141 |       const stats = await fs.stat(filePath)
  142 |       const parts = file.name.split('-')
  143 |       const deviceId = parts.length >= 2 ? parts[1] : 'host'
  144 |       return {
  145 |         id: file.name,
  146 |         device_id: deviceId,
  147 |         file: file.name,
  148 |         size_bytes: stats.size,
  149 |         created_at: stats.mtime ? new Date(stats.mtime).toISOString() : '',
  150 |         status: 'available',
  151 |       }
  152 |     }))
  153 |     return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
  154 |   } catch {
  155 |     return []
  156 |   }
  157 | }
  158 | 
  159 | async function listFirmwareJobs() {
  160 |   if (!EXEC_ENABLED) return []
  161 |   if (process.platform === 'win32') {
  162 |     const result = await runCommand('powershell -NoProfile -Command "Get-WmiObject Win32_PnPSignedDriver | Select-Object -First 25 DeviceName,DriverVersion,DriverDate | ConvertTo-Json"')
  163 |     if (!result.ok || !result.stdout) return []
  164 |     try {
  165 |       const parsed = JSON.parse(result.stdout)
  166 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  167 |       return rows.map((row) => ({
  168 |         id: crypto.randomUUID(),
  169 |         device_id: String(row?.DeviceName || 'driver'),
  170 |         version: String(row?.DriverVersion || ''),
  171 |         status: 'installed',
  172 |         created_at: row?.DriverDate ? new Date(row.DriverDate).toISOString() : new Date().toISOString(),
  173 |       }))
  174 |     } catch {
  175 |       return []
  176 |     }
  177 |   }
  178 |   const fwup = await runCommand('command -v fwupdmgr')
  179 |   if (fwup.ok && fwup.stdout) {
  180 |     const result = await runCommand('fwupdmgr get-updates')
  181 |     if (!result.ok || !result.stdout) return []
  182 |     return result.stdout.split('\n').filter(Boolean).slice(0, 20).map((line) => ({
  183 |       id: crypto.randomUUID(),
  184 |       device_id: line.trim().slice(0, 60),
  185 |       version: '',
  186 |       status: 'available',
  187 |       created_at: new Date().toISOString(),
  188 |     }))
  189 |   }
  190 |   return []
  191 | }
  192 | 
  193 | async function listQosPolicies() {
  194 |   if (!EXEC_ENABLED) return []
  195 |   if (process.platform === 'win32') {
  196 |     const result = await runCommand('powershell -NoProfile -Command "Get-NetQosPolicy | Select-Object -First 25 Name,AppPathNameMatchCondition,IPDstPortStart,IPDstPortEnd,DSCPAction | ConvertTo-Json"')
  197 |     if (!result.ok || !result.stdout) return []
  198 |     try {
  199 |       const parsed = JSON.parse(result.stdout)
  200 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  201 |       return rows.map((row) => ({
  202 |         id: crypto.randomUUID(),
  203 |         name: String(row?.Name || 'policy'),
  204 |         app: String(row?.AppPathNameMatchCondition || ''),
  205 |         ports: row?.IPDstPortStart ? `${row.IPDstPortStart}-${row.IPDstPortEnd || row.IPDstPortStart}` : '',
  206 |         dscp: row?.DSCPAction ?? '',
  207 |         created_at: new Date().toISOString(),
  208 |       }))
  209 |     } catch {
  210 |       return []
  211 |     }
  212 |   }
  213 |   const result = await runCommand('tc qdisc show')
  214 |   if (!result.ok || !result.stdout) return []
  215 |   return result.stdout.split('\n').filter(Boolean).slice(0, 25).map((line) => ({
  216 |     id: crypto.randomUUID(),
  217 |     name: line.trim().split(/\s+/g).slice(0, 3).join(' '),
  218 |     policy: line.trim(),
  219 |     created_at: new Date().toISOString(),
  220 |   }))
  221 | }
  222 | 
  223 | async function listTrafficShapes() {
  224 |   if (!EXEC_ENABLED) return []
  225 |   if (process.platform === 'win32') {
  226 |     const result = await runCommand('powershell -NoProfile -Command "Get-NetQosPolicy | Select-Object -First 25 Name,ThrottleRateAction | ConvertTo-Json"')
  227 |     if (!result.ok || !result.stdout) return []
  228 |     try {
  229 |       const parsed = JSON.parse(result.stdout)
  230 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  231 |       return rows.map((row) => ({
  232 |         id: crypto.randomUUID(),
  233 |         name: String(row?.Name || 'shape'),
  234 |         limit: row?.ThrottleRateAction ?? '',
  235 |         created_at: new Date().toISOString(),
  236 |       }))
  237 |     } catch {
  238 |       return []
  239 |     }
  240 |   }
  241 |   const result = await runCommand('tc -s qdisc show')
  242 |   if (!result.ok || !result.stdout) return []
  243 |   return result.stdout.split('\n').filter(Boolean).slice(0, 25).map((line) => ({
  244 |     id: crypto.randomUUID(),
  245 |     name: line.trim().split(/\s+/g).slice(0, 3).join(' '),
  246 |     limit: line.trim(),
  247 |     created_at: new Date().toISOString(),
  248 |   }))
  249 | }
  250 | 
  251 | async function getDefaultGateway() {
  252 |   if (!EXEC_ENABLED) return ''
  253 |   if (process.platform === 'win32') {
  254 |     const result = await runCommand('powershell -NoProfile -Command "Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Sort-Object RouteMetric | Select-Object -First 1 -ExpandProperty NextHop"')
  255 |     return result.ok ? String(result.stdout || '').trim() : ''
  256 |   }
  257 |   const result = await runCommand("ip route | grep '^default' | head -n 1")
  258 |   if (!result.ok || !result.stdout) return ''
  259 |   const parts = result.stdout.trim().split(/\s+/g)
  260 |   const idx = parts.indexOf('via')
  261 |   return idx >= 0 ? (parts[idx + 1] || '') : ''
  262 | }
  263 | 
  264 | async function sendAlertIntegrations(inventory, alert) {
  265 |   const integrations = Array.isArray(inventory.alert_integrations) ? inventory.alert_integrations : []
  266 |   if (!integrations.length || typeof fetch !== 'function') return []
  267 |   const results = []
  268 |   for (const integration of integrations) {
  269 |     const type = String(integration.type || '').toLowerCase()
  270 |     if (!integration.target) continue
  271 |     if (type === 'webhook' || type === 'slack') {
  272 |       try {
  273 |         const payload = {
  274 |           id: alert.id,
  275 |           message: alert.message,
  276 |           severity: alert.severity,
  277 |           created_at: alert.created_at,
  278 |         }
  279 |         const res = await fetch(integration.target, {
  280 |           method: 'POST',
  281 |           headers: { 'content-type': 'application/json' },
  282 |           body: JSON.stringify(payload),
  283 |         })
  284 |         results.push({ id: integration.id, status: res.ok ? 'sent' : 'failed', code: res.status })
  285 |       } catch (error) {
  286 |         results.push({ id: integration.id, status: 'failed', error: String(error?.message || 'error') })
  287 |       }
  288 |     }
  289 |   }
  290 |   return results
  291 | }
  292 | 
  293 | async function getDynamicTunnels() {
  294 |   if (!EXEC_ENABLED) return []
  295 |   if (process.platform === 'win32') {
  296 |     const result = await runCommand('powershell -NoProfile -Command "Get-Process -Name ngrok,cloudflared -ErrorAction SilentlyContinue | Select-Object Name,Id,Path | ConvertTo-Json"')
  297 |     if (!result.ok || !result.stdout) return []
  298 |     try {
  299 |       const parsed = JSON.parse(result.stdout)
  300 |       const rows = Array.isArray(parsed) ? parsed : [parsed]
  301 |       return rows.map((row) => ({
  302 |         id: String(row?.Id || ''),
  303 |         name: String(row?.Name || ''),
  304 |         status: 'running',
  305 |         path: row?.Path || '',
  306 |         provider: String(row?.Name || '').toLowerCase().includes('cloudflared') ? 'cloudflared' : 'ngrok',
  307 |       }))
  308 |     } catch {
  309 |       return []
  310 |     }
  311 |   }
  312 |   const result = await runCommand("ps -eo pid,comm | grep -E 'ngrok|cloudflared' | head -n 10")
  313 |   if (!result.ok || !result.stdout) return []
  314 |   return result.stdout.split('\n').filter(Boolean).map((line) => {
  315 |     const parts = line.trim().split(/\s+/g)
  316 |     const name = parts[1] || ''
  317 |     return {
  318 |       id: parts[0] || crypto.randomUUID(),
  319 |       name,
  320 |       status: 'running',
  321 |       provider: name.includes('cloudflared') ? 'cloudflared' : 'ngrok',
  322 |     }
  323 |   })
  324 | }
  325 | 
  326 | function parsePingStats(output = '') {
  327 |   if (!output) return null
  328 |   if (process.platform === 'win32') {
  329 |     const avgMatch = output.match(/Average = (\d+)ms/i)
  330 |     const lossMatch = output.match(/(\d+)%\s*loss/i)
  331 |     const avg = avgMatch ? Number(avgMatch[1]) : null
  332 |     const loss = lossMatch ? Number(lossMatch[1]) : null
  333 |     return {
  334 |       latency_ms: Number.isFinite(avg) ? avg : null,
  335 |       jitter_ms: null,
  336 |       packet_loss_pct: Number.isFinite(loss) ? loss : null,
  337 |     }
  338 |   }
  339 |   const statMatch = output.match(/rtt .* = ([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+)/)
  340 |   const lossMatch = output.match(/(\d+)% packet loss/i)
  341 |   const avg = statMatch ? Number(statMatch[2]) : null
  342 |   const jitter = statMatch ? Number(statMatch[4]) : null
  343 |   const loss = lossMatch ? Number(lossMatch[1]) : null
  344 |   return {
  345 |     latency_ms: Number.isFinite(avg) ? avg : null,
  346 |     jitter_ms: Number.isFinite(jitter) ? jitter : null,
  347 |     packet_loss_pct: Number.isFinite(loss) ? loss : null,
  348 |   }
  349 | }
  350 | 
  351 | async function getTrafficSummary() {
  352 |   if (!EXEC_ENABLED) {
  353 |     return { bandwidth_mbps: null, latency_ms: null, jitter_ms: null, packet_loss_pct: null }
  354 |   }
  355 |   const pingCmd = process.platform === 'win32' ? 'ping -n 4 8.8.8.8' : 'ping -c 4 8.8.8.8'
  356 |   const result = await runCommand(pingCmd)
  357 |   const stats = result.ok ? parsePingStats(result.stdout) : null
  358 |   return {
  359 |     bandwidth_mbps: null,
  360 |     latency_ms: stats?.latency_ms ?? null,
  361 |     jitter_ms: stats?.jitter_ms ?? null,
  362 |     packet_loss_pct: stats?.packet_loss_pct ?? null,
  363 |   }
  364 | }
  365 | 
  366 | async function getState() {
  367 |   return readLocalJson(STATE_FILE, DEFAULT_INVENTORY)
  368 | }
  369 | 
  370 | async function updateInventory(updater) {
  371 |   const current = await getState()
  372 |   const next = mergeInventory(await updater(current))
  373 |   await updateLocalJson(STATE_FILE, () => next, DEFAULT_INVENTORY)
  374 |   return next
  375 | }
  376 | 
  377 | export async function getNetworkInventory() {
  378 |   const state = await getState()
  379 |   const devices = await getDynamicInterfaces()
  380 |   const clients = await getDynamicClients()
  381 |   const tunnels = await getDynamicTunnels()
  382 |   const topology = await getDynamicTopology(devices)
  383 |   const [configBackups, firmwareJobs, qosPolicies, trafficShapes] = await Promise.all([
  384 |     listConfigBackups(),
  385 |     listFirmwareJobs(),
  386 |     listQosPolicies(),
  387 |     listTrafficShapes(),
  388 |   ])
  389 |   return mergeInventory({
  390 |     ...state,
  391 |     devices,
  392 |     clients,
  393 |     topology,
  394 |     tunnels,
  395 |     config_backups: configBackups.length ? configBackups : (state.config_backups || []),
  396 |     firmware_jobs: firmwareJobs.length ? firmwareJobs : (state.firmware_jobs || []),
  397 |     qos_policies: qosPolicies.length ? qosPolicies : (state.qos_policies || []),
  398 |     traffic_shapes: trafficShapes.length ? trafficShapes : (state.traffic_shapes || []),
  399 |   })
  400 | }
  401 | 
  402 | async function runCommand(command) {
  403 |   if (!EXEC_ENABLED) {
  404 |     return { ok: false, simulated: true, stdout: '', stderr: '', exitCode: null }
  405 |   }
  406 |   if (!EXEC_ALLOW_ANY && EXEC_ALLOWLIST.size > 0) {
  407 |     const allowed = [...EXEC_ALLOWLIST].some((prefix) => command.startsWith(prefix))
  408 |     if (!allowed) {
  409 |       return { ok: false, simulated: false, stdout: '', stderr: 'Command not allowlisted.', exitCode: 1 }
  410 |     }
  411 |   }
  412 |   try {
  413 |     const { stdout, stderr } = await execAsync(command, { timeout: EXEC_TIMEOUT_MS, windowsHide: true })
  414 |     return { ok: true, simulated: false, stdout: stdout || '', stderr: stderr || '', exitCode: 0 }
  415 |   } catch (error) {
  416 |     return {
  417 |       ok: false,
  418 |       simulated: false,
  419 |       stdout: error?.stdout || '',
  420 |       stderr: error?.stderr || error?.message || '',
  421 |       exitCode: typeof error?.code === 'number' ? error.code : 1,
  422 |     }
  423 |   }
  424 | }
  425 | 
  426 | function appendConfigAudit(inventory, entry) {
  427 |   const audit = Array.isArray(inventory.config_audit) ? inventory.config_audit : []
  428 |   inventory.config_audit = [entry, ...audit].slice(0, 50)
  429 |   return inventory
  430 | }
  431 | 
  432 | export async function getNetworkOverview() {
  433 |   const inventory = await getNetworkInventory()
  434 |   const devices = inventory.devices || []
  435 |   const alerts = inventory.alerts || []
  436 |   const up = devices.filter((d) => d.status === 'up').length
  437 |   const down = devices.filter((d) => d.status !== 'up').length
  438 |   const trafficSummary = await getTrafficSummary()
  439 | 
  440 |   return {
  441 |     generated_at: new Date().toISOString(),
  442 |     device_total: devices.length,
  443 |     device_up: up,
  444 |     device_down: down,
  445 |     alert_count: alerts.length,
  446 |     alerts,
  447 |     traffic_summary: trafficSummary,
  448 |   }
  449 | }
  450 | 
  451 | export async function performNetworkAction(action = '', payload = {}) {
  452 |   const actionId = crypto.randomUUID()
  453 |   const requestedAt = new Date().toISOString()
  454 |   const response = {
  455 |     action_id: actionId,
  456 |     action,
  457 |     requested_at: requestedAt,
  458 |     payload,
  459 |     simulated: !EXEC_ENABLED,
  460 |     status: EXEC_ENABLED ? 'executed' : 'queued',
  461 |     result: null,
  462 |     inventory: null,
  463 |   }
  464 | 
  465 |   let command = ''
  466 |   if (action === 'diagnostic.ping') {
  467 |     const target = String(payload?.target || '').trim()
  468 |     command = process.platform === 'win32' ? `ping -n 4 ${target}` : `ping -c 4 ${target}`
  469 |   } else if (action === 'diagnostic.traceroute') {
  470 |     const target = String(payload?.target || '').trim()
  471 |     command = process.platform === 'win32' ? `tracert ${target}` : `traceroute ${target}`
  472 |   } else if (action === 'vlan.create') {
  473 |     const vlanId = Number(payload?.vlan_id || payload?.id)
  474 |     const name = String(payload?.name || `VLAN ${vlanId}`).trim()
  475 |     const subnet = String(payload?.subnet || '').trim()
  476 |     const gateway = String(payload?.gateway || '').trim()
  477 |     if (!Number.isFinite(vlanId)) {
  478 |       response.result = { ok: false, message: 'vlan_id is required.' }
  479 |       return response
  480 |     }
  481 |     response.inventory = await updateInventory((inventory) => {
  482 |       const vlans = Array.isArray(inventory.vlans) ? inventory.vlans : []
  483 |       const exists = vlans.find((v) => Number(v.id) === vlanId)
  484 |       const next = exists
  485 |         ? vlans.map((v) => (Number(v.id) === vlanId ? { ...v, name, subnet, gateway, updated_at: requestedAt } : v))
  486 |         : [...vlans, { id: vlanId, name, subnet, gateway, status: 'active', created_at: requestedAt }]
  487 |       return appendConfigAudit({ ...inventory, vlans: next }, {
  488 |         id: actionId,
  489 |         action: 'vlan.create',
  490 |         created_at: requestedAt,
  491 |         payload: { vlanId, name, subnet },
  492 |       })
  493 |     })
  494 |   } else if (action === 'vlan.delete') {
  495 |     const vlanId = Number(payload?.vlan_id || payload?.id)
  496 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  497 |       ...inventory,
  498 |       vlans: (inventory.vlans || []).filter((v) => Number(v.id) !== vlanId),
  499 |     }, {
  500 |       id: actionId,
  501 |       action: 'vlan.delete',
  502 |       created_at: requestedAt,
  503 |       payload: { vlanId },
  504 |     }))
  505 |   } else if (action === 'ipam.reserve') {
  506 |     const ip = String(payload?.ip || '').trim()
  507 |     const owner = String(payload?.owner || payload?.user || '').trim()
  508 |     if (!ip) {
  509 |       response.result = { ok: false, message: 'ip is required.' }
  510 |       return response
  511 |     }
  512 |     response.inventory = await updateInventory((inventory) => {
  513 |       const reservations = Array.isArray(inventory.ipam_reservations) ? inventory.ipam_reservations : []
  514 |       const next = [...reservations, { id: actionId, ip, owner, note: payload?.note || '', created_at: requestedAt }]
  515 |       return appendConfigAudit({ ...inventory, ipam_reservations: next }, {
  516 |         id: actionId,
  517 |         action: 'ipam.reserve',
  518 |         created_at: requestedAt,
  519 |         payload: { ip, owner },
  520 |       })
  521 |     })
  522 |   } else if (action === 'ipam.release') {
  523 |     const ip = String(payload?.ip || '').trim()
  524 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  525 |       ...inventory,
  526 |       ipam_reservations: (inventory.ipam_reservations || []).filter((row) => row.ip !== ip),
  527 |     }, {
  528 |       id: actionId,
  529 |       action: 'ipam.release',
  530 |       created_at: requestedAt,
  531 |       payload: { ip },
  532 |     }))
  533 |   } else if (action === 'dhcp.pool.add') {
  534 |     const name = String(payload?.name || `Pool ${actionId.slice(0, 6)}`).trim()
  535 |     const start = String(payload?.start_ip || '').trim()
  536 |     const end = String(payload?.end_ip || '').trim()
  537 |     const subnet = String(payload?.subnet || '').trim()
  538 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  539 |       ...inventory,
  540 |       dhcp_pools: [...(inventory.dhcp_pools || []), { id: actionId, name, start_ip: start, end_ip: end, subnet, status: 'active', created_at: requestedAt }],
  541 |     }, {
  542 |       id: actionId,
  543 |       action: 'dhcp.pool.add',
  544 |       created_at: requestedAt,
  545 |       payload: { name, start, end },
  546 |     }))
  547 |   } else if (action === 'dhcp.pool.remove') {
  548 |     const poolId = String(payload?.pool_id || payload?.id || '').trim()
  549 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  550 |       ...inventory,
  551 |       dhcp_pools: (inventory.dhcp_pools || []).filter((pool) => String(pool.id) !== poolId),
  552 |     }, {
  553 |       id: actionId,
  554 |       action: 'dhcp.pool.remove',
  555 |       created_at: requestedAt,
  556 |       payload: { poolId },
  557 |     }))
  558 |   } else if (action === 'config.backup') {
  559 |     const deviceId = String(payload?.device_id || '').trim()
  560 |     const backupId = deviceId || 'host'
  561 |     const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  562 |     const fileName = `config-${backupId}-${timestamp}.txt`
  563 |     await fs.mkdir(BACKUP_DIR, { recursive: true }).catch(() => {})
  564 |     let snapshot = 'snapshot unavailable'
  565 |     if (EXEC_ENABLED) {
  566 |       const cmd = process.platform === 'win32'
  567 |         ? 'powershell -NoProfile -Command "ipconfig /all; route print"'
  568 |         : 'ip addr show; ip route'
  569 |       const result = await runCommand(cmd)
  570 |       snapshot = result.ok ? result.stdout : result.stderr || 'snapshot failed'
  571 |     }
  572 |     await fs.writeFile(path.join(BACKUP_DIR, fileName), String(snapshot || ''), 'utf8').catch(() => {})
  573 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  574 |       ...inventory,
  575 |       config_backups: [
  576 |         { id: actionId, device_id: deviceId || 'host', file: fileName, created_at: requestedAt, status: EXEC_ENABLED ? 'completed' : 'queued' },
  577 |         ...(inventory.config_backups || []),
  578 |       ].slice(0, 30),
  579 |     }, {
  580 |       id: actionId,
  581 |       action: 'config.backup',
  582 |       created_at: requestedAt,
  583 |       payload: { deviceId },
  584 |     }))
  585 |   } else if (action === 'firmware.update') {
  586 |     const deviceId = String(payload?.device_id || '').trim()
  587 |     const version = String(payload?.version || '').trim()
  588 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  589 |       ...inventory,
  590 |       firmware_jobs: [
  591 |         { id: actionId, device_id: deviceId, version, status: 'scheduled', created_at: requestedAt },
  592 |         ...(inventory.firmware_jobs || []),
  593 |       ].slice(0, 40),
  594 |     }, {
  595 |       id: actionId,
  596 |       action: 'firmware.update',
  597 |       created_at: requestedAt,
  598 |       payload: { deviceId, version },
  599 |     }))
  600 |   } else if (action === 'device.reboot') {
  601 |     const deviceId = String(payload?.device_id || '').trim()
  602 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  603 |       ...inventory,
  604 |       devices: (inventory.devices || []).map((device) => (
  605 |         String(device.id) === deviceId ? { ...device, status: 'restarting', updated_at: requestedAt } : device
  606 |       )),
  607 |     }, {
  608 |       id: actionId,
  609 |       action: 'device.reboot',
  610 |       created_at: requestedAt,
  611 |       payload: { deviceId },
  612 |     }))
  613 |   } else if (action === 'vpn.create') {
  614 |     const name = String(payload?.name || `VPN ${actionId.slice(0, 4)}`).trim()
  615 |     const endpoint = String(payload?.endpoint || '').trim()
  616 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  617 |       ...inventory,
  618 |       vpn_tunnels: [...(inventory.vpn_tunnels || []), { id: actionId, name, endpoint, status: 'active', created_at: requestedAt }],
  619 |     }, {
  620 |       id: actionId,
  621 |       action: 'vpn.create',
  622 |       created_at: requestedAt,
  623 |       payload: { name, endpoint },
  624 |     }))
  625 |   } else if (action === 'vpn.delete') {
  626 |     const tunnelId = String(payload?.tunnel_id || payload?.id || '').trim()
  627 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  628 |       ...inventory,
  629 |       vpn_tunnels: (inventory.vpn_tunnels || []).filter((tunnel) => String(tunnel.id) !== tunnelId),
  630 |     }, {
  631 |       id: actionId,
  632 |       action: 'vpn.delete',
  633 |       created_at: requestedAt,
  634 |       payload: { tunnelId },
  635 |     }))
  636 |   } else if (action === 'qos.update') {
  637 |     const name = String(payload?.name || `QoS ${actionId.slice(0, 4)}`).trim()
  638 |     const policy = String(payload?.policy || '').trim()
  639 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  640 |       ...inventory,
  641 |       qos_policies: [...(inventory.qos_policies || []), { id: actionId, name, policy, created_at: requestedAt }],
  642 |     }, {
  643 |       id: actionId,
  644 |       action: 'qos.update',
  645 |       created_at: requestedAt,
  646 |       payload: { name, policy },
  647 |     }))
  648 |   } else if (action === 'traffic.shape') {
  649 |     const name = String(payload?.name || `Shape ${actionId.slice(0, 4)}`).trim()
  650 |     const limit = String(payload?.limit || '').trim()
  651 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  652 |       ...inventory,
  653 |       traffic_shapes: [...(inventory.traffic_shapes || []), { id: actionId, name, limit, created_at: requestedAt }],
  654 |     }, {
  655 |       id: actionId,
  656 |       action: 'traffic.shape',
  657 |       created_at: requestedAt,
  658 |       payload: { name, limit },
  659 |     }))
  660 |   } else if (action === 'alert.create') {
  661 |     const severity = String(payload?.severity || 'medium').trim()
  662 |     const message = String(payload?.message || 'Network alert').trim()
  663 |     response.inventory = await updateInventory((inventory) => ({
  664 |       ...inventory,
  665 |       alerts: [{ id: actionId, severity, message, created_at: requestedAt }, ...(inventory.alerts || [])].slice(0, 50),
  666 |     }))
  667 |     const results = await sendAlertIntegrations(response.inventory, { id: actionId, severity, message, created_at: requestedAt })
  668 |     response.result = { ok: true, integrations: results }
  669 |   } else if (action === 'alert.resolve') {
  670 |     const alertId = String(payload?.alert_id || '').trim()
  671 |     response.inventory = await updateInventory((inventory) => ({
  672 |       ...inventory,
  673 |       alerts: (inventory.alerts || []).filter((alert) => String(alert.id) !== alertId),
  674 |     }))
  675 |   } else if (action === 'security.ids.scan') {
  676 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  677 |       ...inventory,
  678 |       ids_alerts: [
  679 |         { id: actionId, severity: 'low', message: 'IDS scan completed', created_at: requestedAt },
  680 |         ...(inventory.ids_alerts || []),
  681 |       ].slice(0, 50),
  682 |     }, {
  683 |       id: actionId,
  684 |       action: 'security.ids.scan',
  685 |       created_at: requestedAt,
  686 |       payload: {},
  687 |     }))
  688 |   } else if (action === 'security.rogue_scan') {
  689 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  690 |       ...inventory,
  691 |       rogue_aps: [
  692 |         { id: actionId, ssid: payload.ssid || 'Unknown AP', mac: payload.mac || '00:00:00:00:00:00', detected_at: requestedAt },
  693 |         ...(inventory.rogue_aps || []),
  694 |       ].slice(0, 50),
  695 |     }, {
  696 |       id: actionId,
  697 |       action: 'security.rogue_scan',
  698 |       created_at: requestedAt,
  699 |       payload: { ssid: payload.ssid },
  700 |     }))
  701 |   } else if (action === 'security.auth_server.add') {
  702 |     const server = {
  703 |       id: actionId,
  704 |       type: payload.type || 'radius',
  705 |       host: payload.host || '10.0.0.10',
  706 |       status: 'active',
  707 |       created_at: requestedAt,
  708 |     }
  709 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  710 |       ...inventory,
  711 |       auth_servers: [...(inventory.auth_servers || []), server],
  712 |     }, {
  713 |       id: actionId,
  714 |       action: 'security.auth_server.add',
  715 |       created_at: requestedAt,
  716 |       payload: server,
  717 |     }))
  718 |   } else if (action === 'security.firewall.policy.add') {
  719 |     const policy = {
  720 |       id: actionId,
  721 |       name: payload.name || 'policy',
  722 |       action: payload.action || 'allow',
  723 |       source: payload.source || 'any',
  724 |       destination: payload.destination || 'any',
  725 |       created_at: requestedAt,
  726 |     }
  727 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  728 |       ...inventory,
  729 |       firewall_policies: [...(inventory.firewall_policies || []), policy],
  730 |     }, {
  731 |       id: actionId,
  732 |       action: 'security.firewall.policy.add',
  733 |       created_at: requestedAt,
  734 |       payload: policy,
  735 |     }))
  736 |   } else if (action === 'netflow.refresh') {
  737 |     const stat = {
  738 |       id: actionId,
  739 |       top_talkers: payload.top_talkers || ['10.0.0.12', '10.0.0.15'],
  740 |       total_flows: Number(payload.total_flows || 1200),
  741 |       created_at: requestedAt,
  742 |     }
  743 |     response.inventory = await updateInventory((inventory) => ({
  744 |       ...inventory,
  745 |       flow_stats: [stat, ...(inventory.flow_stats || [])].slice(0, 20),
  746 |     }))
  747 |   } else if (action === 'diagnostic.snmp') {
  748 |     const target = String(payload?.target || '').trim()
  749 |     command = process.platform === 'win32' ? `snmpwalk -v2c -c public ${target}` : `snmpwalk -v2c -c public ${target}`
  750 |   } else if (action === 'config.deploy') {
  751 |     const job = { id: actionId, name: payload.name || 'bulk-config', status: 'scheduled', created_at: requestedAt }
  752 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  753 |       ...inventory,
  754 |       bulk_config_jobs: [job, ...(inventory.bulk_config_jobs || [])].slice(0, 20),
  755 |     }, {
  756 |       id: actionId,
  757 |       action: 'config.deploy',
  758 |       created_at: requestedAt,
  759 |       payload: job,
  760 |     }))
  761 |   } else if (action === 'config.restore') {
  762 |     const job = { id: actionId, device_id: payload.device_id || '', status: 'queued', created_at: requestedAt }
  763 |     response.inventory = await updateInventory((inventory) => appendConfigAudit({
  764 |       ...inventory,
  765 |       config_restore_jobs: [job, ...(inventory.config_restore_jobs || [])].slice(0, 20),
  766 |     }, {
  767 |       id: actionId,
  768 |       action: 'config.restore',
  769 |       created_at: requestedAt,
  770 |       payload: job,
  771 |     }))
  772 |   } else if (action === 'device.discovery') {
  773 |     const device = {
  774 |       id: payload.device_id || `dev-${actionId.slice(0, 4)}`,
  775 |       type: payload.type || 'switch',
  776 |       name: payload.name || 'Discovered device',
  777 |       ip: payload.ip || '10.0.0.50',
  778 |       status: 'up',
  779 |       firmware: payload.firmware || 'v1.0',
  780 |       location: payload.location || 'Unknown',
  781 |     }
  782 |     response.inventory = await updateInventory((inventory) => ({
  783 |       ...inventory,
  784 |       devices: [...(inventory.devices || []), device],
  785 |       discovery_jobs: [
  786 |         { id: actionId, status: 'completed', created_at: requestedAt, device_id: device.id },
  787 |         ...(inventory.discovery_jobs || []),
  788 |       ].slice(0, 20),
  789 |     }))
  790 |   } else if (action === 'alert.integration.add') {
  791 |     const integration = {
  792 |       id: actionId,
  793 |       type: payload.type || 'email',
  794 |       target: payload.target || 'ops@example.com',
  795 |       status: 'active',
  796 |     }
  797 |     response.inventory = await updateInventory((inventory) => ({
  798 |       ...inventory,
  799 |       alert_integrations: [...(inventory.alert_integrations || []), integration],
  800 |     }))
  801 |   }
  802 | 
  803 |   if (!command) {
  804 |     response.result = response.inventory ? { ok: true, message: 'Network action applied.' } : { ok: false, message: 'Unsupported network action.' }
  805 |     return response
  806 |   }
  807 | 
  808 |   if (!EXEC_ENABLED) {
  809 |     response.result = { ok: true, simulated: true, message: 'Simulation mode: network action queued.' }
  810 |     return response
  811 |   }
  812 | 
  813 |   response.result = await runCommand(command)
  814 |   return response
  815 | }
  816 | 