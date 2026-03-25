import { deny, hasRole } from '../utils/permissions.js'

function normalizeIp(ip = '') {
  const value = String(ip || '').trim()
  if (!value) return ''
  if (value.startsWith('::ffff:')) return value.replace('::ffff:', '')
  return value
}

function normalizeDevice(value = '') {
  return String(value || '').trim().toLowerCase()
}

function isAllowedIp(req) {
  const raw = process.env.ADMIN_IP_ALLOWLIST || ''
  const allowlist = raw.split(',').map((v) => normalizeIp(v)).filter(Boolean)
  if (!allowlist.length) return true
  const reqIp = normalizeIp(req.ip)
  return allowlist.includes(reqIp)
}

function isAllowedDevice(req) {
  const raw = process.env.ADMIN_DEVICE_ALLOWLIST || ''
  const allowlist = raw.split(',').map((v) => normalizeDevice(v)).filter(Boolean)
  if (!allowlist.length) return true
  const deviceId = normalizeDevice(req.headers['x-admin-device'])
  if (!deviceId) return false
  req.adminDeviceId = deviceId
  return allowlist.includes(deviceId)
}

export function requireAdminSecurity(req, res, next) {
  if (!req.user || !hasRole(req.user, 'owner', 'admin')) {
    return deny(res)
  }

  if (!isAllowedIp(req)) {
    return res.status(403).json({ error: 'Admin access denied from this IP.' })
  }

  if (!isAllowedDevice(req)) {
    return res.status(403).json({ error: 'Admin access denied for this device.' })
  }

  const requiredMfa = String(process.env.ADMIN_MFA_CODE || '').trim()
  if (requiredMfa) {
    const provided = String(req.headers['x-admin-mfa'] || '').trim()
    if (!provided || provided !== requiredMfa) {
      return res.status(403).json({ error: 'Admin MFA code required.' })
    }
  }

  return next()
}
