    1 | import crypto from 'crypto'
    2 | import { updateJson } from '../utils/jsonStore.js'
    3 | import { sanitizePlatformAnalytics, getAnalyticsGovernanceConfig, checkAnalyticsAccessPolicy } from './analyticsGovernanceService.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | 
    6 | export async function exportAnalytics(user = {}, rawPayload = {}) {
    7 |   const governance = await getAnalyticsGovernanceConfig()
    8 |   // Check access policy for exports
    9 |   const policy = checkAnalyticsAccessPolicy(user, governance, { mode: 'export' })
   10 | 
   11 |   const auditEntryBase = {
   12 |     id: crypto.randomUUID(),
   13 |     type: 'analytics_export',
   14 |     actor_id: sanitizeString(String(user?.id || ''), 120) || null,
   15 |     actor_role: String(user?.role || '').toLowerCase() || null,
   16 |     requested_at: new Date().toISOString(),
   17 |     allowed: Boolean(policy.allowed),
   18 |     governance: { ...governance },
   19 |   }
   20 | 
   21 |   // Record an audit entry regardless of outcome
   22 |   try {
   23 |     await updateJson('event_logs.json', (existing) => {
   24 |       const arr = Array.isArray(existing) ? existing.slice() : []
   25 |       arr.push({ ...auditEntryBase, payload: policy.allowed ? (rawPayload || {}) : undefined })
   26 |       return arr
   27 |     })
   28 |   } catch (e) {
   29 |     // best-effort: don't fail export on audit write error
   30 |     console.debug('audit write failed', e?.message || e)
   31 |   }
   32 | 
   33 |   if (!policy.allowed) {
   34 |     const err = new Error('Analytics export denied by governance policy')
   35 |     err.status = 403
   36 |     err.code = 'ANALYTICS_EXPORT_DENIED'
   37 |     throw err
   38 |   }
   39 | 
   40 |   // Sanitize payload according to governance
   41 |   const sanitized = sanitizePlatformAnalytics(rawPayload || {}, governance)
   42 | 
   43 |   // Update audit record to include sanitized result and timestamp
   44 |   try {
   45 |     await updateJson('event_logs.json', (existing) => {
   46 |       const arr = Array.isArray(existing) ? existing.slice() : []
   47 |       const idx = arr.findIndex((r) => r.id === auditEntryBase.id)
   48 |       const now = new Date().toISOString()
   49 |       const entry = {
   50 |         ...auditEntryBase,
   51 |         allowed: true,
   52 |         completed_at: now,
   53 |         exported_at: now,
   54 |         result: sanitized.report || sanitized,
   55 |       }
   56 |       if (idx === -1) arr.push(entry)
   57 |       else arr[idx] = entry
   58 |       return arr
   59 |     })
   60 |   } catch (e) {
   61 |     // swallow
   62 |     console.debug('audit finalize failed', e?.message || e)
   63 |   }
   64 | 
   65 |   return { export_id: auditEntryBase.id, sanitized }
   66 | }
   67 | 
   68 | export default { exportAnalytics }
   69 | 