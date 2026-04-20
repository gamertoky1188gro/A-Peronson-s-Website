import { deny, hasRole } from '../utils/permissions.js'
import { getAdminAuthConfig } from '../services/securityService.js'

function normalizeIp(ip = '') {
  const value = String(ip || '').trim()
  if (!value) return ''
  if (value.startsWith('::ffff:')) return value.replace('::ffff:', '')
  return value
}

function normalizeDevice(value = '') {
  return String(value || '').trim().toLowerCase()
}

function isAllowedIp(req, allowlistRaw = []) {
  const allowlist = Array.isArray(allowlistRaw) ? allowlistRaw.map((v) => normalizeIp(v)).filter(Boolean) : []
  if (!allowlist.length) return true
  const reqIp = normalizeIp(req.ip)
  return allowlist.includes(reqIp)
}

function isAllowedDevice(req, allowlistRaw = []) {
  const allowlist = Array.isArray(allowlistRaw) ? allowlistRaw.map((v) => normalizeDevice(v)).filter(Boolean) : []
  if (!allowlist.length) return true
  const deviceId = normalizeDevice(req.headers['x-admin-device'])
  if (!deviceId) return false
  req.adminDeviceId = deviceId
  return allowlist.includes(deviceId)
}

export async function requireAdminSecurity(req, res, next) {
  if (!req.user || !hasRole(req.user, 'owner', 'admin')) {
    return deny(res)
  }

  const passkeyLogin = Boolean(req.user?.auth_via_passkey)
  const authConfig = await getAdminAuthConfig()

  if (!isAllowedIp(req, authConfig.ip_allowlist)) {
    return res.status(403).json({ error: 'Admin access denied from this IP.' })
  }

  if (!isAllowedDevice(req, authConfig.device_allowlist) && !passkeyLogin) {
    return res.status(403).json({ error: 'Admin access denied for this device.' })
  }

  const requiredMfa = String(authConfig.mfa_code || '').trim()
  if (requiredMfa) {
    const provided = String(req.headers['x-admin-mfa'] || '').trim()
    if (!provided || provided !== requiredMfa) {
      return res.status(403).json({ error: 'Admin MFA code required.' })
    }
  }

  if (Array.isArray(authConfig.passkeys) && authConfig.passkeys.length) {
    const provided = String(req.headers['x-admin-passkey'] || '').trim()
    if ((!provided || !authConfig.passkeys.includes(provided)) && !passkeyLogin) {
      return res.status(403).json({ error: 'Admin passkey required.' })
    }
  }

  return next()
}
