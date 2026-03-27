import { findUserByEmail, findUserById, findUserByMemberId, registerUser, verifyPassword } from '../services/userService.js'
import { assertCouponRedeemable } from '../services/walletService.js'
import { signToken } from '../middleware/auth.js'
import { requireFields, validateEmail, validateRole } from '../utils/validators.js'

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
  return res.status(201).json({ user, token })
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

  const { password_hash: _passwordHash, ...safeUser } = user
  const token = signToken(safeUser)
  return res.json({ user: safeUser, token })
}


export async function me(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { password_hash: _passwordHash, ...safeUser } = user
  return res.json({ user: safeUser })
}

export async function logout(req, res) {
  return res.json({ ok: true, message: 'Logout handled on client by dropping JWT' })
}
