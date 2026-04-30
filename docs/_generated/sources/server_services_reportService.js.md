    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { createNotification } from './notificationService.js'
    5 | 
    6 | const FILE = 'reports.json'
    7 | 
    8 | export async function createReport({ actor, entity_type, entity_id, reason = '', metadata = {} }) {
    9 |   const reports = await readJson(FILE)
   10 |   const rows = Array.isArray(reports) ? reports : []
   11 | 
   12 |   const safeMeta = metadata && typeof metadata === 'object' ? metadata : {}
   13 | 
   14 |   const row = {
   15 |     id: crypto.randomUUID(),
   16 |     status: 'open',
   17 |     entity_type: sanitizeString(String(entity_type || ''), 60),
   18 |     entity_id: sanitizeString(String(entity_id || ''), 160),
   19 |     reason: sanitizeString(String(reason || ''), 400),
   20 |     actor_id: sanitizeString(String(actor?.id || ''), 120),
   21 |     actor_name: sanitizeString(String(actor?.name || actor?.email || ''), 120),
   22 |     meta: safeMeta,
   23 |     created_at: new Date().toISOString(),
   24 |     resolved_at: '',
   25 |     resolved_by: '',
   26 |     resolution_action: '',
   27 |     resolution_note: '',
   28 |   }
   29 | 
   30 |   rows.push(row)
   31 |   await writeJson(FILE, rows)
   32 | 
   33 |   // Notify owner/admin so moderation stays "safe by design" (project.md).
   34 |   const users = await readJson('users.json')
   35 |   const admins = Array.isArray(users) ? users.filter((u) => ['owner', 'admin'].includes(String(u.role || '').toLowerCase())) : []
   36 |   await Promise.all(admins.map((admin) => createNotification(admin.id, {
   37 |     type: 'report_created',
   38 |     entity_type: row.entity_type,
   39 |     entity_id: row.entity_id,
   40 |     message: `New report: ${row.reason || 'Report submitted'}`,
   41 |     meta: { report_id: row.id },
   42 |   })))
   43 | 
   44 |   return row
   45 | }
   46 | 
   47 | export async function listReports() {
   48 |   const reports = await readJson(FILE)
   49 |   const rows = Array.isArray(reports) ? reports : []
   50 |   return rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   51 | }
   52 | 
   53 | export async function resolveReport(reportId, actor, payload = {}) {
   54 |   const id = sanitizeString(String(reportId || ''), 120)
   55 |   const reports = await readJson(FILE)
   56 |   const rows = Array.isArray(reports) ? reports : []
   57 |   const idx = rows.findIndex((r) => String(r.id) === id)
   58 |   if (idx < 0) return null
   59 | 
   60 |   rows[idx] = {
   61 |     ...rows[idx],
   62 |     status: 'resolved',
   63 |     resolved_at: new Date().toISOString(),
   64 |     resolved_by: sanitizeString(String(actor?.id || ''), 120),
   65 |     resolution_action: sanitizeString(String(payload.action || ''), 80),
   66 |     resolution_note: sanitizeString(String(payload.note || ''), 400),
   67 |   }
   68 | 
   69 |   await writeJson(FILE, rows)
   70 |   return rows[idx]
   71 | }
   72 | 