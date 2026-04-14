    1 | import fs from 'fs/promises'
    2 | import path from 'path'
    3 | import crypto from 'crypto'
    4 | import { trackEvent as persistEvent } from './analyticsService.js'
    5 | import { sanitizeString } from '../utils/validators.js'
    6 | import { logInfo, logWarn } from '../utils/logger.js'
    7 | 
    8 | const TAXONOMY_PATH = path.join(process.cwd(), 'shared', 'event-taxonomy.json')
    9 | const DEFAULT_SCHEMA_VERSION = '1.0.0'
   10 | const DEFAULT_SOURCE_MODULE = 'backend'
   11 | const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000
   12 | const NOISY_EVENTS = new Set(['page_view', 'click', 'search_filters_changed'])
   13 | 
   14 | const qualityState = {
   15 |   unknown_types: {},
   16 |   missing_required_fields: {},
   17 |   dropped_events: 0,
   18 |   ingested_events: 0,
   19 |   deduped_events: 0,
   20 | }
   21 | 
   22 | const recentIdempotency = new Map()
   23 | let taxonomyPromise = null
   24 | 
   25 | function touchMetric(bucket, key) {
   26 |   bucket[key] = (bucket[key] || 0) + 1
   27 | }
   28 | 
   29 | function compactDedupCache() {
   30 |   const now = Date.now()
   31 |   for (const [key, expiresAt] of recentIdempotency.entries()) {
   32 |     if (expiresAt <= now) recentIdempotency.delete(key)
   33 |   }
   34 | }
   35 | 
   36 | async function loadTaxonomy() {
   37 |   if (!taxonomyPromise) {
   38 |     taxonomyPromise = fs
   39 |       .readFile(TAXONOMY_PATH, 'utf8')
   40 |       .then((raw) => JSON.parse(raw))
   41 |       .catch(() => ({
   42 |         version: DEFAULT_SCHEMA_VERSION,
   43 |         canonical_events: [],
   44 |         required_context_dimensions: [],
   45 |         required_fields: ['type'],
   46 |         event_requirements: {},
   47 |       }))
   48 |   }
   49 |   return taxonomyPromise
   50 | }
   51 | 
   52 | function normalizeEventType(type) {
   53 |   return sanitizeString(String(type || ''), 80).toLowerCase().replace(/\s+/g, '_')
   54 | }
   55 | 
   56 | function normalizeContext(context = {}, base = {}) {
   57 |   return {
   58 |     actorType: sanitizeString(String(context.actorType || base.actorType || 'unknown'), 60) || 'unknown',
   59 |     orgOwnerId: sanitizeString(String(context.orgOwnerId || base.orgOwnerId || 'unknown'), 120) || 'unknown',
   60 |     entityType: sanitizeString(String(context.entityType || base.entityType || 'unknown'), 80) || 'unknown',
   61 |     entityId: sanitizeString(String(context.entityId || base.entityId || 'unknown'), 160) || 'unknown',
   62 |     sourceModule: sanitizeString(String(context.sourceModule || base.sourceModule || DEFAULT_SOURCE_MODULE), 80) || DEFAULT_SOURCE_MODULE,
   63 |     sessionId: sanitizeString(String(context.sessionId || base.sessionId || 'server'), 180) || 'server',
   64 |   }
   65 | }
   66 | 
   67 | function buildIdempotencyKey({ providedKey, type, actorId, entityId, sessionId }) {
   68 |   const provided = sanitizeString(String(providedKey || ''), 200)
   69 |   if (provided) return provided
   70 |   if (!NOISY_EVENTS.has(type)) return ''
   71 | 
   72 |   const minuteBucket = Math.floor(Date.now() / 15000)
   73 |   const stable = `${type}|${actorId || 'unknown'}|${entityId || 'unknown'}|${sessionId || 'server'}|${minuteBucket}`
   74 |   return crypto.createHash('sha256').update(stable).digest('hex')
   75 | }
   76 | 
   77 | function validateRequiredMetadata(metadata, requiredKeys = [], eventType = '') {
   78 |   const missing = []
   79 |   for (const key of requiredKeys) {
   80 |     const value = metadata?.[key]
   81 |     if (value === undefined || value === null || String(value).trim() === '') missing.push(key)
   82 |   }
   83 |   if (missing.length) touchMetric(qualityState.missing_required_fields, `${eventType}:${missing.join(',')}`)
   84 |   return missing
   85 | }
   86 | 
   87 | export async function ingestEvent(payload = {}, options = {}) {
   88 |   compactDedupCache()
   89 |   const taxonomy = await loadTaxonomy()
   90 | 
   91 |   const type = normalizeEventType(payload.type)
   92 |   const actorId = sanitizeString(String(payload.actor_id || ''), 160)
   93 |   const entityId = sanitizeString(String(payload.entity_id || ''), 180)
   94 |   const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {}
   95 | 
   96 |   const context = normalizeContext(payload.context, {
   97 |     entityId,
   98 |     sourceModule: options.sourceModule,
   99 |     actorType: options.actorType,
  100 |     orgOwnerId: options.orgOwnerId,
  101 |     entityType: options.entityType,
  102 |     sessionId: options.sessionId,
  103 |   })
  104 | 
  105 |   if (!type || !actorId || !entityId) {
  106 |     qualityState.dropped_events += 1
  107 |     touchMetric(qualityState.missing_required_fields, 'base_required_fields')
  108 |     return { accepted: false, reason: 'missing_required_fields' }
  109 |   }
  110 | 
  111 |   const canonicalEvents = new Set(Array.isArray(taxonomy.canonical_events) ? taxonomy.canonical_events : [])
  112 |   const allowUnknownTypes = options.allowUnknownTypes === true
  113 |   if (!canonicalEvents.has(type) && !allowUnknownTypes) {
  114 |     qualityState.dropped_events += 1
  115 |     touchMetric(qualityState.unknown_types, type)
  116 |     return { accepted: false, reason: 'unknown_event_type', type }
  117 |   }
  118 | 
  119 |   const metadataRequirements = taxonomy?.event_requirements?.[type] || []
  120 |   const missingMetadata = validateRequiredMetadata(metadata, metadataRequirements, type)
  121 |   if (missingMetadata.length) {
  122 |     qualityState.dropped_events += 1
  123 |     return { accepted: false, reason: 'missing_required_metadata', missing: missingMetadata }
  124 |   }
  125 | 
  126 |   const idempotencyKey = buildIdempotencyKey({
  127 |     providedKey: payload.idempotency_key || metadata.idempotency_key || options.idempotencyKey,
  128 |     type,
  129 |     actorId,
  130 |     entityId,
  131 |     sessionId: context.sessionId,
  132 |   })
  133 | 
  134 |   if (idempotencyKey) {
  135 |     if (recentIdempotency.has(idempotencyKey)) {
  136 |       qualityState.deduped_events += 1
  137 |       return { accepted: false, reason: 'duplicate_event', idempotency_key: idempotencyKey }
  138 |     }
  139 | 
  140 |     recentIdempotency.set(idempotencyKey, Date.now() + IDEMPOTENCY_TTL_MS)
  141 |   }
  142 | 
  143 |   const enrichedMetadata = {
  144 |     ...metadata,
  145 |     context,
  146 |     schema_version: sanitizeString(String(payload.schema_version || taxonomy.version || DEFAULT_SCHEMA_VERSION), 20),
  147 |     idempotency_key: idempotencyKey,
  148 |     received_at: new Date().toISOString(),
  149 |   }
  150 | 
  151 |   await persistEvent({
  152 |     type,
  153 |     actor_id: actorId,
  154 |     entity_id: entityId,
  155 |     metadata: enrichedMetadata,
  156 |   })
  157 | 
  158 |   qualityState.ingested_events += 1
  159 |   return { accepted: true, type, idempotency_key: idempotencyKey, schema_version: enrichedMetadata.schema_version }
  160 | }
  161 | 
  162 | export function startEventQualityReporter() {
  163 |   const intervalMs = Math.max(60_000, Number(process.env.EVENT_QUALITY_REPORT_INTERVAL_MS || 15 * 60 * 1000))
  164 |   setInterval(() => {
  165 |     logInfo('event-quality-report', {
  166 |       ingested_events: qualityState.ingested_events,
  167 |       dropped_events: qualityState.dropped_events,
  168 |       deduped_events: qualityState.deduped_events,
  169 |       unknown_types: qualityState.unknown_types,
  170 |       missing_required_fields: qualityState.missing_required_fields,
  171 |     })
  172 |   }, intervalMs).unref()
  173 | 
  174 |   logWarn('event-quality-report-enabled', { interval_ms: intervalMs })
  175 | }
  176 | 
  177 | export async function isKnownEventType(type) {
  178 |   const taxonomy = await loadTaxonomy()
  179 |   return new Set(taxonomy.canonical_events || []).has(normalizeEventType(type))
  180 | }
  181 | 