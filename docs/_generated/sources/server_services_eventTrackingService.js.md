    1 | import { ingestEvent } from './eventIngestionService.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | 
    4 | function inferActorType(actorId = '') {
    5 |   const raw = String(actorId || '')
    6 |   if (!raw) return 'unknown'
    7 |   if (raw.startsWith('anon:')) return 'anonymous'
    8 |   return 'user'
    9 | }
   10 | 
   11 | export async function trackEventWithTaxonomy({
   12 |   type,
   13 |   actor_id,
   14 |   entity_id,
   15 |   metadata = {},
   16 |   sourceModule = 'backend',
   17 |   actorType = '',
   18 |   orgOwnerId = '',
   19 |   entityType = '',
   20 |   sessionId = 'server',
   21 |   idempotencyKey = '',
   22 |   allowUnknownTypes = false,
   23 | } = {}) {
   24 |   const safeEntityId = sanitizeString(String(entity_id || metadata?.entity_id || ''), 180)
   25 |   const safeEntityType = sanitizeString(String(entityType || metadata?.entity_type || ''), 80)
   26 | 
   27 |   return ingestEvent({
   28 |     type,
   29 |     actor_id,
   30 |     entity_id: safeEntityId || (safeEntityType ? `type:${safeEntityType}` : 'unknown'),
   31 |     metadata,
   32 |     idempotency_key: idempotencyKey,
   33 |     context: {
   34 |       actorType: sanitizeString(String(actorType || metadata?.actor_type || inferActorType(actor_id)), 60),
   35 |       orgOwnerId: sanitizeString(String(orgOwnerId || metadata?.org_owner_id || actor_id || 'unknown'), 120),
   36 |       entityType: safeEntityType || 'unknown',
   37 |       entityId: safeEntityId || 'unknown',
   38 |       sourceModule: sanitizeString(String(sourceModule || metadata?.source_module || 'backend'), 80),
   39 |       sessionId: sanitizeString(String(sessionId || metadata?.session_id || 'server'), 180),
   40 |     },
   41 |   }, {
   42 |     sourceModule,
   43 |     allowUnknownTypes,
   44 |   })
   45 | }
   46 | 
   47 | export const trackEvent = trackEventWithTaxonomy
   48 | 