    1 | import { exec } from 'child_process'
    2 | import util from 'util'
    3 | import { getAdminConfig } from './adminConfigService.js'
    4 | import { getOpenSearchStatus, ensureOpenSearchIndices, reindexAll as opensearchReindexAll, reindexOrg as opensearchReindexOrg } from './openSearchService.js'
    5 | import { getEmailDeliveryStatus } from './emailService.js'
    6 | 
    7 | const execAsync = util.promisify(exec)
    8 | const EXEC_ENABLED = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ENABLED || '').toLowerCase())
    9 | const EXEC_TIMEOUT_MS = Number(process.env.ADMIN_EXEC_TIMEOUT_MS || 12_000)
   10 | const EXEC_ALLOW_ANY = ['true', '1', 'yes'].includes(String(process.env.ADMIN_EXEC_ALLOW_ANY || '').toLowerCase())
   11 | const EXEC_ALLOWLIST = new Set(
   12 |   String(process.env.ADMIN_EXEC_ALLOWLIST || '')
   13 |     .split(',')
   14 |     .map((v) => v.trim())
   15 |     .filter(Boolean),
   16 | )
   17 | 
   18 | function isConfigured(value) {
   19 |   return Boolean(value && String(value).trim())
   20 | }
   21 | 
   22 | async function runCommand(command) {
   23 |   if (!EXEC_ENABLED) return { ok: false, stdout: '', stderr: 'exec_disabled' }
   24 |   if (!EXEC_ALLOW_ANY && EXEC_ALLOWLIST.size > 0) {
   25 |     const allowed = [...EXEC_ALLOWLIST].some((prefix) => command.startsWith(prefix))
   26 |     if (!allowed) return { ok: false, stdout: '', stderr: 'not_allowlisted' }
   27 |   }
   28 |   try {
   29 |     const { stdout } = await execAsync(command, { timeout: EXEC_TIMEOUT_MS, windowsHide: true })
   30 |     return { ok: true, stdout: String(stdout || '').trim(), stderr: '' }
   31 |   } catch (error) {
   32 |     return { ok: false, stdout: String(error?.stdout || '').trim(), stderr: String(error?.stderr || error?.message || '') }
   33 |   }
   34 | }
   35 | 
   36 | async function detectInstallerSource() {
   37 |   if (process.platform === 'win32') {
   38 |     return { os: 'windows', source: 'winget', available: true }
   39 |   }
   40 |   const dnf = await runCommand('command -v dnf')
   41 |   if (dnf.ok && dnf.stdout) return { os: 'linux', source: 'dnf', available: true }
   42 |   const yum = await runCommand('command -v yum')
   43 |   if (yum.ok && yum.stdout) return { os: 'linux', source: 'yum', available: true }
   44 |   const apt = await runCommand('command -v apt')
   45 |   if (apt.ok && apt.stdout) return { os: 'linux', source: 'apt', available: true }
   46 |   return { os: process.platform, source: 'unknown', available: false }
   47 | }
   48 | 
   49 | export async function getIntegrationStatus() {
   50 |   const config = await getAdminConfig()
   51 |   const installer = await detectInstallerSource()
   52 |   const emailStatus = await getEmailDeliveryStatus()
   53 |   const opensearchConfig = config?.integrations?.opensearch || {}
   54 |   const opensearchUrl = String(opensearchConfig?.url || '')
   55 |   const opensearchEnabled = Boolean(opensearchConfig?.enabled)
   56 |   const opensearchUrlSet = isConfigured(opensearchUrl)
   57 | 
   58 |   return {
   59 |     signature: {
   60 |       provider: process.env.SIGNATURE_PROVIDER || '',
   61 |       configured: isConfigured(process.env.SIGNATURE_CLIENT_ID) && isConfigured(process.env.SIGNATURE_CLIENT_SECRET),
   62 |     },
   63 |     bank_validation: {
   64 |       provider: process.env.BANK_API_BASE || '',
   65 |       configured: isConfigured(process.env.BANK_API_KEY),
   66 |     },
   67 |     ids_ips: {
   68 |       source: process.env.IDS_SOURCE || '',
   69 |       configured: isConfigured(process.env.IDS_LOG_PATH) || isConfigured(process.env.IDS_API_URL),
   70 |     },
   71 |     radius: {
   72 |       configured: isConfigured(process.env.RADIUS_HOST) && isConfigured(process.env.RADIUS_SECRET),
   73 |     },
   74 |     tacacs: {
   75 |       configured: isConfigured(process.env.TACACS_HOST) && isConfigured(process.env.TACACS_SECRET),
   76 |     },
   77 |     rogue_ap: {
   78 |       configured: isConfigured(process.env.WIFI_CONTROLLER_API),
   79 |     },
   80 |     netflow: {
   81 |       configured: isConfigured(process.env.NETFLOW_COLLECTOR) || isConfigured(process.env.NETFLOW_API),
   82 |     },
   83 |     alert_delivery: {
   84 |       slack: isConfigured(process.env.SLACK_WEBHOOK_URL) || (config.integrations?.webhooks || []).length > 0,
   85 |       sms: isConfigured(process.env.SMS_PROVIDER) && isConfigured(process.env.SMS_API_KEY),
   86 |       email: isConfigured(process.env.SMTP_HOST) && isConfigured(process.env.SMTP_USER),
   87 |     },
   88 |     backups: {
   89 |       s3: isConfigured(process.env.S3_BUCKET) && isConfigured(process.env.S3_ACCESS_KEY),
   90 |       gcs: isConfigured(process.env.GCS_BUCKET) && isConfigured(process.env.GCS_ACCESS_KEY),
   91 |       spaces: isConfigured(process.env.SPACES_BUCKET) && isConfigured(process.env.SPACES_ACCESS_KEY),
   92 |     },
   93 |     phpmyadmin: {
   94 |       url: process.env.PHPMYADMIN_URL || '',
   95 |       configured: isConfigured(process.env.PHPMYADMIN_URL),
   96 |     },
   97 |     installers: installer,
   98 |     registrar: {
   99 |       provider: process.env.REGISTRAR_PROVIDER || '',
  100 |       configured: isConfigured(process.env.REGISTRAR_API_TOKEN),
  101 |     },
  102 |     opensearch: {
  103 |       enabled: opensearchEnabled,
  104 |       url_set: opensearchUrlSet,
  105 |       configured: Boolean(opensearchEnabled && opensearchUrlSet),
  106 |       index_prefix: String(opensearchConfig?.index_prefix || ''),
  107 |     },
  108 |     email_notifications: emailStatus,
  109 |   }
  110 | }
  111 | 
  112 | export async function runIntegrationAction(action = '', payload = {}) {
  113 |   const safeAction = String(action || '').trim()
  114 |   const data = payload && typeof payload === 'object' ? payload : {}
  115 | 
  116 |   if (!safeAction) return { ok: false, action: safeAction, error: 'action_required' }
  117 | 
  118 |   if (safeAction === 'opensearch.test_connection') {
  119 |     const status = await getOpenSearchStatus()
  120 |     return { ok: Boolean(status?.reachable), action: safeAction, status }
  121 |   }
  122 | 
  123 |   if (safeAction === 'opensearch.ensure_indices') {
  124 |     const result = await ensureOpenSearchIndices()
  125 |     return { ok: Boolean(result?.ok), action: safeAction, result }
  126 |   }
  127 | 
  128 |   if (safeAction === 'opensearch.reindex_all') {
  129 |     const reset = data.reset === true || String(data.reset || '').toLowerCase() === 'true'
  130 |     const result = await opensearchReindexAll({ reset })
  131 |     return { ok: Boolean(result?.ok), action: safeAction, result }
  132 |   }
  133 | 
  134 |   if (safeAction === 'opensearch.reindex_org') {
  135 |     const orgId = String(data.org_id || data.orgId || '').trim()
  136 |     const result = await opensearchReindexOrg(orgId)
  137 |     return { ok: Boolean(result?.ok), action: safeAction, result }
  138 |   }
  139 | 
  140 |   return {
  141 |     ok: false,
  142 |     action: safeAction,
  143 |     error: 'unsupported_action',
  144 |     status: await getIntegrationStatus(),
  145 |   }
  146 | }
  147 | 