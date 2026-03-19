import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { createNotification } from '../services/notificationService.js'
import { listReports, resolveReport } from '../services/reportService.js'

function toPublicFileUrl(filePath = '') {
  if (!filePath) return ''
  const normalized = String(filePath).replace(/\\/g, '/')
  if (normalized.startsWith('/uploads/')) return normalized
  const idx = normalized.indexOf('server/uploads/')
  if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
  return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
}

export async function verificationAudit(req, res) {
  const verification = await readJson('verification.json')
  return res.json(verification)
}

export async function subscriptionsAudit(req, res) {
  const subscriptions = await readJson('subscriptions.json')
  return res.json(subscriptions)
}

export async function usersAudit(req, res) {
  const users = await readJson('users.json')
  return res.json(users.map((user) => {
    const safe = { ...user }
    delete safe.password_hash
    return safe
  }))
}

export async function violationsAudit(req, res) {
  const violations = await readJson('violations.json')
  const sorted = Array.isArray(violations)
    ? violations.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    : []
  return res.json(sorted)
}

export async function pendingVideos(req, res) {
  const products = await readJson('company_products.json')
  const items = Array.isArray(products) ? products : []
  const pending = items.filter((p) => {
    const status = String(p.video_review_status || '').toLowerCase()
    return Boolean(p.video_url) && status !== 'approved'
  }).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))

  return res.json({ items: pending })
}

export async function approveVideo(req, res) {
  const productId = sanitizeString(String(req.params.productId || ''), 120)
  const products = await readJson('company_products.json')
  const items = Array.isArray(products) ? products : []
  const idx = items.findIndex((p) => String(p.id) === productId)
  if (idx < 0) return res.status(404).json({ error: 'Product not found' })

  items[idx] = {
    ...items[idx],
    video_review_status: 'approved',
    video_restricted: false,
    video_reviewed_at: new Date().toISOString(),
    video_review_reason: '',
  }
  await writeJson('company_products.json', items)

  const companyId = String(items[idx].company_id || '').trim()
  if (companyId) {
    await createNotification(companyId, {
      type: 'video_review_approved',
      entity_type: 'company_product',
      entity_id: items[idx].id,
      message: `Your video was approved: "${items[idx].title || 'Product'}"`,
      meta: { product_id: items[idx].id },
    })
  }

  return res.json({ ok: true, item: items[idx] })
}

export async function rejectVideo(req, res) {
  const productId = sanitizeString(String(req.params.productId || ''), 120)
  const reason = sanitizeString(String(req.body?.reason || 'Rejected by moderator'), 240)
  const products = await readJson('company_products.json')
  const items = Array.isArray(products) ? products : []
  const idx = items.findIndex((p) => String(p.id) === productId)
  if (idx < 0) return res.status(404).json({ error: 'Product not found' })

  items[idx] = {
    ...items[idx],
    video_review_status: 'rejected',
    video_restricted: true,
    video_reviewed_at: new Date().toISOString(),
    video_review_reason: reason,
  }
  await writeJson('company_products.json', items)

  const companyId = String(items[idx].company_id || '').trim()
  if (companyId) {
    await createNotification(companyId, {
      type: 'video_review_rejected',
      entity_type: 'company_product',
      entity_id: items[idx].id,
      message: `Your video was rejected: "${items[idx].title || 'Product'}". Reason: ${reason}`,
      meta: { product_id: items[idx].id, reason },
    })
  }

  return res.json({ ok: true, item: items[idx] })
}

export async function pendingDocuments(req, res) {
  const docs = await readJson('documents.json')
  const items = Array.isArray(docs) ? docs : []
  const pending = items.filter((d) => String(d.moderation_status || '').toLowerCase() === 'pending_review')
    .map((d) => ({
      ...d,
      public_url: toPublicFileUrl(d.file_path || d.url || ''),
    }))
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  return res.json({ items: pending })
}

export async function approveDocument(req, res) {
  const docId = sanitizeString(String(req.params.documentId || ''), 120)
  const docs = await readJson('documents.json')
  const items = Array.isArray(docs) ? docs : []
  const idx = items.findIndex((d) => String(d.id) === docId)
  if (idx < 0) return res.status(404).json({ error: 'Document not found' })

  items[idx] = {
    ...items[idx],
    moderation_status: 'approved',
  }
  await writeJson('documents.json', items)

  const ownerId = String(items[idx].uploaded_by || items[idx].entity_id || '').trim()
  if (ownerId) {
    await createNotification(ownerId, {
      type: 'media_review_approved',
      entity_type: items[idx].entity_type || 'document',
      entity_id: items[idx].entity_id || items[idx].id,
      message: 'Your uploaded document was approved by moderation.',
      meta: { document_id: items[idx].id },
    })
  }

  return res.json({ ok: true, item: items[idx] })
}

export async function rejectDocument(req, res) {
  const docId = sanitizeString(String(req.params.documentId || ''), 120)
  const reason = sanitizeString(String(req.body?.reason || 'Rejected by moderator'), 240)
  const docs = await readJson('documents.json')
  const items = Array.isArray(docs) ? docs : []
  const idx = items.findIndex((d) => String(d.id) === docId)
  if (idx < 0) return res.status(404).json({ error: 'Document not found' })

  const flags = Array.isArray(items[idx].moderation_flags) ? items[idx].moderation_flags : []
  items[idx] = {
    ...items[idx],
    moderation_status: 'rejected',
    moderation_flags: [...flags, `rejected:${reason}`],
  }
  await writeJson('documents.json', items)

  const ownerId = String(items[idx].uploaded_by || items[idx].entity_id || '').trim()
  if (ownerId) {
    await createNotification(ownerId, {
      type: 'media_review_rejected',
      entity_type: items[idx].entity_type || 'document',
      entity_id: items[idx].entity_id || items[idx].id,
      message: `Your uploaded document was rejected by moderation. Reason: ${reason}`,
      meta: { document_id: items[idx].id, reason },
    })
  }

  return res.json({ ok: true, item: items[idx] })
}

export async function listReportsAudit(req, res) {
  const items = await listReports()
  return res.json({ items })
}

export async function resolveReportAudit(req, res) {
  const updated = await resolveReport(req.params.reportId, req.user, req.body || {})
  if (!updated) return res.status(404).json({ error: 'Report not found' })
  return res.json({ ok: true, item: updated })
}
