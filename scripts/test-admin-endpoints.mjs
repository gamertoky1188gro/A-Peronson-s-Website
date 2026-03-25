const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://gartex:GartexP%40ss123@localhost:3306/gartexhub'
process.env.ADMIN_MFA_CODE = process.env.ADMIN_MFA_CODE || '123456'
process.env.ADMIN_IP_ALLOWLIST = process.env.ADMIN_IP_ALLOWLIST || '127.0.0.1,::1'
process.env.ADMIN_DEVICE_ALLOWLIST = process.env.ADMIN_DEVICE_ALLOWLIST || 'local-dev-device'
process.env.ADMIN_STEPUP_CODE = process.env.ADMIN_STEPUP_CODE || 'stepup-7890'
process.env.ADMIN_EXPORT_CODE_PRIMARY = process.env.ADMIN_EXPORT_CODE_PRIMARY || 'export-primary'
process.env.ADMIN_EXPORT_CODE_SECONDARY = process.env.ADMIN_EXPORT_CODE_SECONDARY || 'export-secondary'
process.env.ADMIN_EXEC_ENABLED = process.env.ADMIN_EXEC_ENABLED || 'true'
process.env.ADMIN_EXEC_ALLOW_ANY = process.env.ADMIN_EXEC_ALLOW_ANY || 'false'
process.env.ADMIN_EXEC_ALLOWLIST = process.env.ADMIN_EXEC_ALLOWLIST || 'powershell -NoProfile -Command,systemctl,ps,df,kill,echo,ping,tracert,traceroute,netsh,ufw,apt-get,apt,winget,schtasks,snmpwalk,ip,tail,timedatectl,useradd,userdel,passwd,usermod,gpasswd,tzutil,w32tm,getent,awk,head,crontab,php,iostat,command,certbot,tar,dnf,yum'
process.env.ADMIN_EXEC_TIMEOUT_MS = process.env.ADMIN_EXEC_TIMEOUT_MS || '12000'

await import('../server/server.js')
await sleep(1500)

const base = 'http://localhost:4000/api'
const adminEmail = 'admin@gartexhub.local'
const adminPass = 'Admin123!'

async function jsonFetch(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const error = new Error(data?.error || `HTTP ${res.status}`)
    error.status = res.status
    error.payload = data
    throw error
  }
  return data
}

try {
  await jsonFetch('/auth/register', {
    method: 'POST',
    body: { name: 'Admin', email: adminEmail, password: adminPass, role: 'admin' },
  })
} catch (error) {
  if (error.status !== 409) throw error
}

const login = await jsonFetch('/auth/login', {
  method: 'POST',
  body: { identifier: adminEmail, password: adminPass },
})

const token = login.token
const headers = {
  Authorization: `Bearer ${token}`,
  'x-admin-mfa': '123456',
  'x-admin-device': 'local-dev-device',
}
const stepHeaders = {
  ...headers,
  'x-admin-stepup': 'stepup-7890',
  'x-admin-stepup-at': new Date().toISOString(),
}

const master = await jsonFetch('/admin/master', { headers })
const actionRes = await jsonFetch('/admin/actions', {
  method: 'POST',
  headers: stepHeaders,
  body: { action: 'users.export_emails', payload: {} },
})
const infra = await jsonFetch('/infra/overview', { headers })
const infraState = await jsonFetch('/infra/state', { headers })
const infraAction = await jsonFetch('/infra/actions', {
  method: 'POST',
  headers: stepHeaders,
  body: { action: 'backup.run', payload: {} },
})
const network = await jsonFetch('/network/overview', { headers })
const networkInventory = await jsonFetch('/network/inventory', { headers })
const verificationQueue = await jsonFetch('/verification/admin/queue', { headers })
const contracts = await jsonFetch('/admin/contracts', { headers })
const disputes = await jsonFetch('/admin/disputes', { headers })
const partners = await jsonFetch('/admin/partner-requests', { headers })
const catalog = await jsonFetch('/admin/catalog', { headers })
const serverAdminState = await jsonFetch('/admin/server-admin/state', { headers })
const cmsState = await jsonFetch('/admin/cms/state', { headers })
const securityState = await jsonFetch('/admin/security/state', { headers })

console.log('admin_master_ok', master.summary?.users?.total ?? 0)
console.log('admin_action_ok', actionRes.ok)
console.log('infra_ok', infra.platform || 'unknown')
console.log('infra_state_rules', infraState.firewall_rules?.length ?? 0)
console.log('infra_action_status', infraAction.status || 'unknown')
console.log('network_ok', network.device_total ?? 0)
console.log('network_inventory_ok', networkInventory.devices?.length ?? 0)
console.log('verification_queue_ok', verificationQueue.items?.length ?? 0)
console.log('contracts_ok', contracts.items?.length ?? 0)
console.log('disputes_ok', disputes.items?.length ?? 0)
console.log('partners_ok', partners.items?.length ?? 0)
console.log('catalog_ok', Object.keys(catalog || {}).length)
console.log('server_admin_ok', serverAdminState.web_server?.type || 'none')
console.log('cms_ok', cmsState.theme?.active || 'none')
console.log('security_ok', securityState.zero_trust?.enabled ? 'on' : 'off')

process.exit(0)
