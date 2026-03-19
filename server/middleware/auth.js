import jwt from 'jsonwebtoken'
import { deny, hasRole } from '../utils/permissions.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mvp-dev-secret'
const JWT_ISSUER = process.env.JWT_ISSUER || 'gartexhub-api'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'gartexhub-client'

export function signToken(user) {
  // Token includes only the fields needed for server-side authorization/scoping.
  // Agents are enterprise sub-accounts, so we include `org_owner_id` and `member_id` to support:
  // - scoping records to the owning organization
  // - single-field "Agent ID" login UX (email-or-agent-id)
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
    org_owner_id: user.org_owner_id || '',
    member_id: user.member_id || '',
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '12h',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    subject: user.id,
  })
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function optionalAuth(req, _res, next) {
  // Allows endpoints to accept both authenticated and anonymous requests.
  // If a JWT is provided and valid, we populate `req.user`. Otherwise we continue with `req.user = null`.
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    req.user = null
    return next()
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })
  } catch {
    req.user = null
  }

  return next()
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !hasRole(req.user, ...roles)) {
      return deny(res)
    }
    return next()
  }
}
