    1 | import { ingestEvent } from '../services/eventIngestionService.js'
    2 | import { extractClientIp, locateIp } from '../services/geoService.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | function sanitizeMetadata(meta) {
    6 |   if (!meta || typeof meta !== 'object') return {}
    7 |   const out = {}
    8 | 
    9 |   for (const [key, value] of Object.entries(meta)) {
   10 |     const safeKey = sanitizeString(String(key || ''), 60)
   11 |     if (!safeKey) continue
   12 | 
   13 |     if (typeof value === 'string') out[safeKey] = sanitizeString(value, 240)
   14 |     else if (typeof value === 'number' && Number.isFinite(value)) out[safeKey] = value
   15 |     else if (typeof value === 'boolean') out[safeKey] = value
   16 |     else if (Array.isArray(value)) {
   17 |       const cleaned = value
   18 |         .filter((item) => typeof item === 'string')
   19 |         .map((item) => sanitizeString(item, 120))
   20 |         .map((item) => String(item || '').trim())
   21 |         .filter(Boolean)
   22 |         .slice(0, 25)
   23 |       if (cleaned.length) out[safeKey] = cleaned
   24 |     }
   25 |   }
   26 | 
   27 |   return out
   28 | }
   29 | 
   30 | function buildActorId(req, clientId) {
   31 |   // Track authenticated users by user id; anonymous visitors by a stable client id (localStorage).
   32 |   if (req.user?.id) return String(req.user.id)
   33 | 
   34 |   const safeClientId = sanitizeString(String(clientId || ''), 120)
   35 |   if (safeClientId) return `anon:${safeClientId}`
   36 |   return 'anon'
   37 | }
   38 | 
   39 | function countryFromHeaders(req) {
   40 |   const candidates = [
   41 |     req.headers['cf-ipcountry'],
   42 |     req.headers['x-vercel-ip-country'],
   43 |     req.headers['x-geo-country'],
   44 |     req.headers['x-appengine-country'],
   45 |     req.headers['x-country'],
   46 |     req.headers['x-forwarded-country'],
   47 |   ]
   48 |   const raw = candidates.find((value) => value && String(value).trim() && String(value).toLowerCase() !== 'unknown')
   49 |   if (!raw) return ''
   50 |   const cleaned = sanitizeString(String(raw), 60).trim()
   51 |   if (!cleaned || cleaned === 'XX') return ''
   52 |   return cleaned
   53 | }
   54 | 
   55 | export async function postEvent(req, res) {
   56 |   const type = sanitizeString(String(req.body?.type || ''), 60).toLowerCase()
   57 |   if (!type) return res.status(400).json({ error: 'type is required' })
   58 | 
   59 |   const entityType = sanitizeString(String(req.body?.entity_type || req.body?.entityType || ''), 80)
   60 |   const entityId = sanitizeString(String(req.body?.entity_id || req.body?.entityId || ''), 160)
   61 |   const clientId = sanitizeString(String(req.body?.client_id || req.body?.clientId || ''), 120)
   62 |   const metadata = sanitizeMetadata(req.body?.metadata)
   63 |   let country = sanitizeString(
   64 |     String(req.body?.country || metadata.country || countryFromHeaders(req) || ''),
   65 |     60,
   66 |   )
   67 | 
   68 |   let geo = null
   69 |   if (!country) {
   70 |     const ip = extractClientIp(req)
   71 |     geo = await locateIp(ip)
   72 |     if (geo?.country) country = sanitizeString(geo.country, 60)
   73 |   }
   74 | 
   75 |   const enrichedMeta = {
   76 |     ...metadata,
   77 |     ...(entityType ? { entity_type: entityType } : {}),
   78 |     ...(clientId ? { client_id: clientId } : {}),
   79 |     ...(country ? { country } : {}),
   80 |     ...(geo?.city ? { city: sanitizeString(geo.city, 80) } : {}),
   81 |     ...(geo?.lat ? { lat: geo.lat } : {}),
   82 |     ...(geo?.lng ? { lng: geo.lng } : {}),
   83 |     // Keep these short to avoid logging sensitive data.
   84 |     user_agent: sanitizeString(String(req.headers['user-agent'] || ''), 180),
   85 |   }
   86 | 
   87 |   const allowUnknownTypes = String(process.env.EVENTS_ALLOW_UNKNOWN_TYPES || '').toLowerCase() === 'true'
   88 |   const result = await ingestEvent({
   89 |     type,
   90 |     actor_id: buildActorId(req, clientId),
   91 |     entity_id: entityId || (entityType ? `type:${entityType}` : ''),
   92 |     metadata: enrichedMeta,
   93 |     context: {
   94 |       actorType: req.user?.id ? 'user' : 'anonymous',
   95 |       orgOwnerId: sanitizeString(String(req.user?.org_owner_id || req.user?.id || ''), 120) || 'unknown',
   96 |       entityType: entityType || 'unknown',
   97 |       entityId: entityId || 'unknown',
   98 |       sourceModule: 'web_client',
   99 |       sessionId: sanitizeString(String(metadata.session_id || ''), 180) || 'unknown',
  100 |     },
  101 |   }, { allowUnknownTypes, sourceModule: 'event_controller' })
  102 | 
  103 |   if (!result.accepted) {
  104 |     if (result.reason === 'unknown_event_type') return res.status(400).json({ error: 'Unknown event type' })
  105 |     if (result.reason === 'duplicate_event') return res.status(202).json({ ok: true, deduped: true })
  106 |     return res.status(400).json({ error: 'Event validation failed', reason: result.reason })
  107 |   }
  108 | 
  109 |   return res.status(201).json({ ok: true, schema_version: result.schema_version })
  110 | }
  111 | 