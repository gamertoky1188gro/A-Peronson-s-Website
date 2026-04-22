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

function parseCsv(value = '') {
  return String(value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function isOwnerAllowlisted(user) {
  const emails = parseCsv(process.env.ADMIN_OWNER_EMAILS).map((v) => v.toLowerCase())
  const ids = parseCsv(process.env.ADMIN_OWNER_IDS)
  if (!emails.length && !ids.length) return true

  const userId = String(user?.id || '').trim()
  const userEmail = String(user?.email || '').trim().toLowerCase()
  return (userId && ids.includes(userId)) || (userEmail && emails.includes(userEmail))
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
  // Skip security checks in development if explicitly allowed
  if (process.env.ADMIN_EXEC_ALLOW_ANY === 'true') {
    return next()
  }

  if (!req.user || !hasRole(req.user, 'owner', 'admin')) {
    return deny(res)
  }

  // DEV MODE: Allow localhost/local network without further checks
  const clientIp = normalizeIp(req.ip)
  if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
    return next()
  }

  if (!isOwnerAllowlisted(req.user)) {
    return res.status(403).json({ error: 'Owner-only admin access is enabled.' })
  }

  const authConfig = await getAdminAuthConfig()

  // 1. IP Check (Always required if configured)
  if (!isAllowedIp(req, authConfig.ip_allowlist)) {
    return res.status(403).json({ error: 'Admin access denied from this IP.' })
  }

  // 2. OR Logic: Any of these satisfy the security requirement
  const passkeyLogin = Boolean(req.user?.auth_via_passkey)
  const hasPasskeyHeader = Array.isArray(authConfig.passkeys) && authConfig.passkeys.length && 
    authConfig.passkeys.includes(String(req.headers['x-admin-passkey'] || '').trim())

  const requiredMfa = String(authConfig.mfa_code || '').trim()
  const hasValidMfa = requiredMfa && String(req.headers['x-admin-mfa'] || '').trim() === requiredMfa

  const stepUpCode = String(process.env.ADMIN_STEPUP_CODE || '').trim()
  const hasValidStepUp = stepUpCode && String(req.headers['x-admin-stepup'] || '').trim() === stepUpCode

  const isApprovedDevice = isAllowedDevice(req, authConfig.device_allowlist)

  // If the device is already on the allowlist AND no MFA/StepUp is globally enforced, allow.
  // Otherwise, require at least one proof of identity.
  const anyProofProvided = passkeyLogin || hasPasskeyHeader || hasValidMfa || hasValidStepUp

  if (isApprovedDevice || anyProofProvided) {
    return next()
  }

  return res.status(403).json({ 
    error: 'Admin security verification required. Use MFA, Passkey, or Setup code to unlock.' 
  })
}
