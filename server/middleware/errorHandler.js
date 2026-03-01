import { logError } from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  logError('Unhandled API error', err)
  if (res.headersSent) return next(err)
  return res.status(500).json({ error: 'Internal server error' })
}
