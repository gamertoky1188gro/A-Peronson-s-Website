    1 | import { appendAuditLog } from '../utils/auditStore.js'
    2 | import { readJson } from '../utils/jsonStore.js'
    3 | import { checkAnalyticsAccessPolicy, getAnalyticsGovernanceConfig, sanitizePlatformAnalytics } from '../services/analyticsGovernanceService.js'
    4 | import { getAdminConfig } from '../services/adminConfigService.js'
    5 | 
    6 | export async function exportAnalytics(req, res) {
    7 |   try {
    8 |     const config = await getAnalyticsGovernanceConfig()
    9 |     const decision = checkAnalyticsAccessPolicy(req.user, config, { mode: 'export' })
   10 |     if (!decision.allowed) return res.status(403).json({ error: 'Export not allowed', reason: decision.reason })
   11 | 
   12 |     // Read raw analytics payload and apply governance sanitization
   13 |     const raw = await readJson('analytics.json')
   14 | 
   15 |     const adminConfig = await getAdminConfig()
   16 |     const sanitized = sanitizePlatformAnalytics({ monthly_demand_trend: raw || [], price_range_demand: [], top_categories_global: [] }, adminConfig?.analytics)
   17 | 
   18 |     // Audit the export
   19 |     await appendAuditLog({ actor_id: req.user.id, action: 'analytics_export', meta: { config: decision.governance || config, export_summary: { raw_length: Array.isArray(raw) ? raw.length : 0 } }, created_at: new Date().toISOString() })
   20 | 
   21 |     return res.json({ ok: true, governance: decision.governance || config, report: sanitized.report, suppression: sanitized.suppression })
   22 |   } catch (err) {
   23 |     return res.status(500).json({ error: 'export_failed', message: String(err?.message || err) })
   24 |   }
   25 | }
   26 | 
   27 | export default { exportAnalytics }
   28 | 