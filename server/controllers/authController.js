import { findUserByEmail, findUserById, findUserByMemberId, registerUser, verifyPassword } from '../services/userService.js'
import { assertCouponRedeemable } from '../services/walletService.js'
import { signToken } from '../middleware/auth.js'
import { requireFields, validateEmail, validateRole } from '../utils/validators.js'
import {
  createAuthenticationOptions,
  createRegistrationOptions,
  listUserPasskeys,
  removeUserPasskey,
  verifyAuthentication,
  verifyRegistration,
} from '../services/passkeyService.js'
import { getEntitlements } from '../services/entitlementService.js'

function sanitizeUser(user) {
  if (!user) return null
  const { password_hash: _passwordHash, passkeys, ...safe } = user
  return {
    ...safe,
    passkeys: Array.isArray(passkeys)
      ? passkeys.map((key) => ({
        id: key.id,
        name: key.name || '',
        created_at: key.created_at || '',
        last_used_at: key.last_used_at || '',
        transports: Array.isArray(key.transports) ? key.transports : [],
      }))
      : [],
  }
}

export async function register(req, res) {
  const missing = requireFields(req.body, ['name', 'email', 'password', 'role'])
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
  if (!validateEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
  if (!validateRole(req.body.role)) return res.status(400).json({ error: 'Invalid role' })

  const existing = await findUserByEmail(req.body.email)
  if (existing) return res.status(409).json({ error: 'Email already used' })

  if (req.body?.coupon_code) {
    try {
      await assertCouponRedeemable(req.body.coupon_code)
    } catch (error) {
      return res.status(error.status || 400).json({ error: error.message || 'Invalid coupon code' })
    }
  }

  const user = await registerUser(req.body)
  const token = signToken(user)
  const entitlements = await getEntitlements(user)
  return res.status(201).json({ user: { ...sanitizeUser(user), entitlements }, token })
}

export async function login(req, res) {
  // UX: login uses a single field on the client ("Email or Agent ID").
  // For backwards compatibility we still accept `email`, but the preferred field is `identifier`.
  const missing = requireFields(req.body, ['password'])
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })

  const identifierRaw = String(req.body?.identifier || req.body?.email || '').trim()
  if (!identifierRaw) return res.status(400).json({ error: 'Missing fields: identifier' })

  // If identifier looks like an email -> normal user login. Otherwise -> agent login by `member_id`.
  const user = identifierRaw.includes('@') ? await findUserByEmail(identifierRaw) : await findUserByMemberId(identifierRaw)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  if (String(user.status || '').toLowerCase() === 'deleted') {
    return res.status(403).json({ error: 'Account deleted' })
  }

  const ok = await verifyPassword(user, req.body.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signToken(user, { authViaPasskey: false })
  const entitlements = await getEntitlements(user)
  return res.json({ user: { ...sanitizeUser(user), entitlements }, token })
}


export async function me(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const entitlements = await getEntitlements(user)
  return res.json({ user: { ...sanitizeUser(user), entitlements } })
}

export async function logout(req, res) {
  return res.json({ ok: true, message: 'Logout handled on client by dropping JWT' })
}

export async function passkeyRegistrationOptions(req, res) {
  try {
    const { options } = await createRegistrationOptions({
      userId: req.user.id,
      req,
      rpName: process.env.PASSKEY_RP_NAME || 'GartexHub',
    })
    return res.json({ options })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Unable to create passkey options' })
  }
}

export async function passkeyRegistrationVerify(req, res) {
  try {
    const credential = req.body?.credential
    if (!credential) return res.status(400).json({ error: 'Missing credential' })
    const nickname = req.body?.nickname || ''
    const passkeys = await verifyRegistration({ userId: req.user.id, req, credential, nickname })
    return res.json({ passkeys })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Passkey registration failed' })
  }
}

export async function passkeyLoginOptions(req, res) {
  try {
    const identifier = req.body?.identifier
    const { options } = await createAuthenticationOptions({ identifier, req })
    return res.json({ options })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Unable to create passkey options' })
  }
}

export async function passkeyLoginVerify(req, res) {
  try {
    const identifier = req.body?.identifier
    const credential = req.body?.credential
    if (!credential) return res.status(400).json({ error: 'Missing credential' })
    const result = await verifyAuthentication({ identifier, req, credential })
    const user = result?.user
    const passkey = result?.passkey || null
    if (String(user.status || '').toLowerCase() === 'deleted') {
      return res.status(403).json({ error: 'Account deleted' })
    }
    const token = signToken(user, { authViaPasskey: true })
    const entitlements = await getEntitlements(user)
    return res.json({ user: { ...sanitizeUser(user), entitlements }, token, passkey })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Passkey login failed' })
  }
}

export async function passkeyList(req, res) {
  try {
    const passkeys = await listUserPasskeys(req.user.id)
    return res.json({ passkeys })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Unable to load passkeys' })
  }
}

export async function passkeyRemove(req, res) {
  try {
    const credentialId = String(req.params.credentialId || '').trim()
    if (!credentialId) return res.status(400).json({ error: 'Missing credential id' })
    const passkeys = await removeUserPasskey(req.user.id, credentialId)
    return res.json({ passkeys })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Unable to remove passkey' })
  }
}
