import jwt from 'jsonwebtoken'
import { deny, hasRole } from '../utils/permissions.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mvp-dev-secret'
const JWT_ISSUER = process.env.JWT_ISSUER || 'gartexhub-api'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'gartexhub-client'

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
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

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !hasRole(req.user, ...roles)) {
      return deny(res)
    }
    return next()
  }
}
