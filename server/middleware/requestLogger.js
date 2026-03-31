import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { getDbStatus } from '../utils/db.js'

const SENSITIVE_KEYS = new Set(['password', 'token', 'authorization', 'secret', 'otp', 'passkey'])

function redactValue(value) {
  if (Array.isArray(value)) return value.map((entry) => redactValue(entry))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, entry] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(String(key).toLowerCase())) {
        out[key] = '[redacted]'
      } else {
        out[key] = redactValue(entry)
      }
    }
    return out
  }
  return value
}

function decodeAuthSubject(authHeader = '') {
  const header = String(authHeader || '')
  if (!header.startsWith('Bearer ')) return {}
  const token = header.slice(7).trim()
  if (!token) return {}
  const decoded = jwt.decode(token) || {}
  return {
    user_id: decoded.id || decoded.sub || '',
    role: decoded.role || '',
  }
}

export function requestLogger({ timeoutMs = 45000 } = {}) {
  return (req, res, next) => {
    const requestId = crypto.randomUUID()
    const startedAt = Date.now()
    const authInfo = decodeAuthSubject(req.headers.authorization)
    const dbStatus = getDbStatus()
    const body = redactValue(req.body || {})
    const bodyBytes = Buffer.byteLength(JSON.stringify(body || {}))

    const startPayload = {
      level: 'info',
      event: 'request_start',
      request_id: requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      query: req.query || {},
      ip: req.ip,
      user_agent: req.headers['user-agent'] || '',
      user_id: authInfo.user_id || '',
      role: authInfo.role || '',
      body_bytes: bodyBytes,
      body,
      db_connected: dbStatus.connected,
    }
    console.log(JSON.stringify(startPayload))

    let responseBytes = 0
    const originalWrite = res.write.bind(res)
    const originalEnd = res.end.bind(res)

    res.write = (chunk, encoding, cb) => {
      if (chunk) {
        responseBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding)
      }
      return originalWrite(chunk, encoding, cb)
    }

    res.end = (chunk, encoding, cb) => {
      if (chunk) {
        responseBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding)
      }
      return originalEnd(chunk, encoding, cb)
    }

    const timer = setTimeout(() => {
      if (res.headersSent) return
      res.status(504).json({ error: 'Request timeout' })
      const duration = Date.now() - startedAt
      console.log(JSON.stringify({
        level: 'error',
        event: 'request_timeout',
        request_id: requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        status: 504,
        duration_ms: duration,
        response_bytes: responseBytes,
      }))
    }, timeoutMs)

    function finalize(eventName = 'request_end') {
      clearTimeout(timer)
      const duration = Date.now() - startedAt
      const status = res.statusCode
      console.log(JSON.stringify({
        level: status >= 500 ? 'error' : 'info',
        event: eventName,
        request_id: requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        status,
        duration_ms: duration,
        response_bytes: responseBytes,
      }))
    }

    res.on('finish', () => finalize('request_end'))
    res.on('close', () => {
      if (!res.writableEnded) {
        finalize('request_aborted')
      }
    })

    return next()
  }
}
