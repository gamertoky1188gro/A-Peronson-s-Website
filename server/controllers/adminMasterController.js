import crypto from 'crypto'
import { getAdminMasterSummary } from '../services/adminMasterService.js'
import { readAuditLog } from '../utils/auditStore.js'
import { getAdminConfig, updateAdminConfig } from '../services/adminConfigService.js'
import { listUsers } from '../services/userService.js'
import { performAdminAction } from '../services/adminActionService.js'
import { handleControllerError } from '../utils/permissions.js'
import { readJson } from '../utils/jsonStore.js'

export async function adminMasterOverview(req, res) {
  const summary = await getAdminMasterSummary(req.user)
  return res.json(summary)
}

export async function adminAction(req, res) {
  const action = String(req.body?.action || '').trim()
  if (!action) return res.status(400).json({ error: 'action is required' })
  try {
    const result = await performAdminAction(action, req.body?.payload || {}, req.user)
    return res.json({ ok: true, action_id: crypto.randomUUID(), result })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function adminAuditLog(req, res) {
  const items = await readAuditLog()
  const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 100)))
  return res.json({ items: items.slice(-limit).reverse() })
}

export async function adminGetConfig(req, res) {
  const config = await getAdminConfig()
  return res.json(config)
}

export async function adminUpdateConfig(req, res) {
  const patch = req.body || {}
  const config = await updateAdminConfig(patch)
  return res.json(config)
}

export async function adminEmailExport(req, res) {
  const users = await listUsers()
  const emails = users.map((u) => u.email).filter(Boolean)
  const csv = ['email', ...emails].join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="gartexhub_emails.csv"')
  return res.send(csv)
}

function toCsv(rows = []) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((key) => escape(row[key])).join(',')),
  ]
  return lines.join('\n')
}

export async function adminDataExport(req, res) {
  const dataset = String(req.query?.dataset || '').trim()
  const format = String(req.query?.format || 'json').toLowerCase()
  if (!dataset) return res.status(400).json({ error: 'dataset is required' })

  let data = null
  try {
    data = await readJson(`${dataset}.json`)
  } catch {
    return res.status(404).json({ error: 'dataset not found' })
  }

  if (format === 'csv') {
    const rows = Array.isArray(data) ? data : [data]
    const csv = toCsv(rows)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${dataset}.csv"`)
    return res.send(csv)
  }

  res.setHeader('Content-Type', 'application/json')
  return res.json({ dataset, items: data })
}
