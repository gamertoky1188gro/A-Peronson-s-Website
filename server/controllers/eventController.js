import { trackEvent } from '../services/analyticsService.js'
import { sanitizeString } from '../utils/validators.js'

function sanitizeMetadata(meta) {
  if (!meta || typeof meta !== 'object') return {}
  const out = {}

  for (const [key, value] of Object.entries(meta)) {
    const safeKey = sanitizeString(String(key || ''), 60)
    if (!safeKey) continue

    if (typeof value === 'string') out[safeKey] = sanitizeString(value, 240)
    else if (typeof value === 'number' && Number.isFinite(value)) out[safeKey] = value
    else if (typeof value === 'boolean') out[safeKey] = value
  }

  return out
}

function buildActorId(req, clientId) {
  // Track authenticated users by user id; anonymous visitors by a stable client id (localStorage).
  if (req.user?.id) return String(req.user.id)

  const safeClientId = sanitizeString(String(clientId || ''), 120)
  if (safeClientId) return `anon:${safeClientId}`
  return 'anon'
}

function countryFromHeaders(req) {
  const candidates = [
    req.headers['cf-ipcountry'],
    req.headers['x-vercel-ip-country'],
    req.headers['x-geo-country'],
    req.headers['x-appengine-country'],
    req.headers['x-country'],
    req.headers['x-forwarded-country'],
  ]
  const raw = candidates.find((value) => value && String(value).trim() && String(value).toLowerCase() !== 'unknown')
  if (!raw) return ''
  const cleaned = sanitizeString(String(raw), 60).trim()
  if (!cleaned || cleaned === 'XX') return ''
  return cleaned
}

export async function postEvent(req, res) {
  const type = sanitizeString(String(req.body?.type || ''), 60).toLowerCase()
  if (!type) return res.status(400).json({ error: 'type is required' })

  const entityType = sanitizeString(String(req.body?.entity_type || req.body?.entityType || ''), 80)
  const entityId = sanitizeString(String(req.body?.entity_id || req.body?.entityId || ''), 160)
  const clientId = sanitizeString(String(req.body?.client_id || req.body?.clientId || ''), 120)
  const metadata = sanitizeMetadata(req.body?.metadata)
  const country = sanitizeString(
    String(req.body?.country || metadata.country || countryFromHeaders(req) || ''),
    60,
  )

  const enrichedMeta = {
    ...metadata,
    ...(entityType ? { entity_type: entityType } : {}),
    ...(clientId ? { client_id: clientId } : {}),
    ...(country ? { country } : {}),
    // Keep these short to avoid logging sensitive data.
    user_agent: sanitizeString(String(req.headers['user-agent'] || ''), 180),
  }

  await trackEvent({
    type,
    actor_id: buildActorId(req, clientId),
    entity_id: entityId || (entityType ? `type:${entityType}` : ''),
    metadata: enrichedMeta,
  })

  return res.status(201).json({ ok: true })
}
