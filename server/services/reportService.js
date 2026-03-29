import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { createNotification } from './notificationService.js'

const FILE = 'reports.json'

export async function createReport({ actor, entity_type, entity_id, reason = '', metadata = {} }) {
  const reports = await readJson(FILE)
  const rows = Array.isArray(reports) ? reports : []

  const safeMeta = metadata && typeof metadata === 'object' ? metadata : {}

  const row = {
    id: crypto.randomUUID(),
    status: 'open',
    entity_type: sanitizeString(String(entity_type || ''), 60),
    entity_id: sanitizeString(String(entity_id || ''), 160),
    reason: sanitizeString(String(reason || ''), 400),
    actor_id: sanitizeString(String(actor?.id || ''), 120),
    actor_name: sanitizeString(String(actor?.name || actor?.email || ''), 120),
    meta: safeMeta,
    created_at: new Date().toISOString(),
    resolved_at: '',
    resolved_by: '',
    resolution_action: '',
    resolution_note: '',
  }

  rows.push(row)
  await writeJson(FILE, rows)

  // Notify owner/admin so moderation stays "safe by design" (project.md).
  const users = await readJson('users.json')
  const admins = Array.isArray(users) ? users.filter((u) => ['owner', 'admin'].includes(String(u.role || '').toLowerCase())) : []
  await Promise.all(admins.map((admin) => createNotification(admin.id, {
    type: 'report_created',
    entity_type: row.entity_type,
    entity_id: row.entity_id,
    message: `New report: ${row.reason || 'Report submitted'}`,
    meta: { report_id: row.id },
  })))

  return row
}

export async function listReports() {
  const reports = await readJson(FILE)
  const rows = Array.isArray(reports) ? reports : []
  return rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
}

export async function resolveReport(reportId, actor, payload = {}) {
  const id = sanitizeString(String(reportId || ''), 120)
  const reports = await readJson(FILE)
  const rows = Array.isArray(reports) ? reports : []
  const idx = rows.findIndex((r) => String(r.id) === id)
  if (idx < 0) return null

  rows[idx] = {
    ...rows[idx],
    status: 'resolved',
    resolved_at: new Date().toISOString(),
    resolved_by: sanitizeString(String(actor?.id || ''), 120),
    resolution_action: sanitizeString(String(payload.action || ''), 80),
    resolution_note: sanitizeString(String(payload.note || ''), 400),
  }

  await writeJson(FILE, rows)
  return rows[idx]
}
