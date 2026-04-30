    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { createNotification } from '../services/notificationService.js'
    4 | import { listReports, resolveReport } from '../services/reportService.js'
    5 | import { adminAssignSupportTicket, adminUpdateSupportTicket, buildSupportTicketSummary, listSupportTicketsAdmin } from '../services/supportTicketService.js'
    6 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    7 | import { handleSignCallback } from '../services/eSignService.js'
    8 | import { logInfo, logError } from '../utils/logger.js'
    9 | 
   10 | function toPublicFileUrl(filePath = '') {
   11 |   if (!filePath) return ''
   12 |   const normalized = String(filePath).replace(/\\/g, '/')
   13 |   if (normalized.startsWith('/uploads/')) return normalized
   14 |   const idx = normalized.indexOf('server/uploads/')
   15 |   if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
   16 |   return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
   17 | }
   18 | 
   19 | export async function verificationAudit(req, res) {
   20 |   const verification = await readJson('verification.json')
   21 |   return res.json(verification)
   22 | }
   23 | 
   24 | export async function subscriptionsAudit(req, res) {
   25 |   const subscriptions = await readJson('subscriptions.json')
   26 |   return res.json(subscriptions)
   27 | }
   28 | 
   29 | export async function usersAudit(req, res) {
   30 |   const users = await readJson('users.json')
   31 |   return res.json(users.map((user) => {
   32 |     const safe = { ...user }
   33 |     delete safe.password_hash
   34 |     return safe
   35 |   }))
   36 | }
   37 | 
   38 | export async function violationsAudit(req, res) {
   39 |   const violations = await readJson('violations.json')
   40 |   const sorted = Array.isArray(violations)
   41 |     ? violations.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   42 |     : []
   43 |   return res.json(sorted)
   44 | }
   45 | 
   46 | export async function pendingVideos(req, res) {
   47 |   const products = await readJson('company_products.json')
   48 |   const items = Array.isArray(products) ? products : []
   49 |   const pending = items.filter((p) => {
   50 |     const status = String(p.video_review_status || '').toLowerCase()
   51 |     return Boolean(p.video_url) && status !== 'approved'
   52 |   }).sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   53 | 
   54 |   return res.json({ items: pending })
   55 | }
   56 | 
   57 | export async function approveVideo(req, res) {
   58 |   const productId = sanitizeString(String(req.params.productId || ''), 120)
   59 |   const products = await readJson('company_products.json')
   60 |   const items = Array.isArray(products) ? products : []
   61 |   const idx = items.findIndex((p) => String(p.id) === productId)
   62 |   if (idx < 0) return res.status(404).json({ error: 'Product not found' })
   63 | 
   64 |   items[idx] = {
   65 |     ...items[idx],
   66 |     video_review_status: 'approved',
   67 |     video_restricted: false,
   68 |     video_reviewed_at: new Date().toISOString(),
   69 |     video_review_reason: '',
   70 |   }
   71 |   await writeJson('company_products.json', items)
   72 | 
   73 |   const companyId = String(items[idx].company_id || '').trim()
   74 |   if (companyId) {
   75 |     await createNotification(companyId, {
   76 |       type: 'video_review_approved',
   77 |       entity_type: 'company_product',
   78 |       entity_id: items[idx].id,
   79 |       message: `Your video was approved: "${items[idx].title || 'Product'}"`,
   80 |       meta: { product_id: items[idx].id },
   81 |     })
   82 |   }
   83 | 
   84 |   return res.json({ ok: true, item: items[idx] })
   85 | }
   86 | 
   87 | export async function rejectVideo(req, res) {
   88 |   const productId = sanitizeString(String(req.params.productId || ''), 120)
   89 |   const reason = sanitizeString(String(req.body?.reason || 'Rejected by moderator'), 240)
   90 |   const products = await readJson('company_products.json')
   91 |   const items = Array.isArray(products) ? products : []
   92 |   const idx = items.findIndex((p) => String(p.id) === productId)
   93 |   if (idx < 0) return res.status(404).json({ error: 'Product not found' })
   94 | 
   95 |   items[idx] = {
   96 |     ...items[idx],
   97 |     video_review_status: 'rejected',
   98 |     video_restricted: true,
   99 |     video_reviewed_at: new Date().toISOString(),
  100 |     video_review_reason: reason,
  101 |   }
  102 |   await writeJson('company_products.json', items)
  103 | 
  104 |   const companyId = String(items[idx].company_id || '').trim()
  105 |   if (companyId) {
  106 |     await createNotification(companyId, {
  107 |       type: 'video_review_rejected',
  108 |       entity_type: 'company_product',
  109 |       entity_id: items[idx].id,
  110 |       message: `Your video was rejected: "${items[idx].title || 'Product'}". Reason: ${reason}`,
  111 |       meta: { product_id: items[idx].id, reason },
  112 |     })
  113 |   }
  114 | 
  115 |   return res.json({ ok: true, item: items[idx] })
  116 | }
  117 | 
  118 | export async function pendingDocuments(req, res) {
  119 |   const docs = await readJson('documents.json')
  120 |   const items = Array.isArray(docs) ? docs : []
  121 |   const pending = items.filter((d) => String(d.moderation_status || '').toLowerCase() === 'pending_review')
  122 |     .map((d) => ({
  123 |       ...d,
  124 |       public_url: toPublicFileUrl(d.file_path || d.url || ''),
  125 |     }))
  126 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  127 |   return res.json({ items: pending })
  128 | }
  129 | 
  130 | export async function approveDocument(req, res) {
  131 |   const docId = sanitizeString(String(req.params.documentId || ''), 120)
  132 |   const docs = await readJson('documents.json')
  133 |   const items = Array.isArray(docs) ? docs : []
  134 |   const idx = items.findIndex((d) => String(d.id) === docId)
  135 |   if (idx < 0) return res.status(404).json({ error: 'Document not found' })
  136 | 
  137 |   items[idx] = {
  138 |     ...items[idx],
  139 |     moderation_status: 'approved',
  140 |   }
  141 |   await writeJson('documents.json', items)
  142 | 
  143 |   const ownerId = String(items[idx].uploaded_by || items[idx].entity_id || '').trim()
  144 |   if (ownerId) {
  145 |     await createNotification(ownerId, {
  146 |       type: 'media_review_approved',
  147 |       entity_type: items[idx].entity_type || 'document',
  148 |       entity_id: items[idx].entity_id || items[idx].id,
  149 |       message: 'Your uploaded document was approved by moderation.',
  150 |       meta: { document_id: items[idx].id },
  151 |     })
  152 |   }
  153 | 
  154 |   return res.json({ ok: true, item: items[idx] })
  155 | }
  156 | 
  157 | export async function rejectDocument(req, res) {
  158 |   const docId = sanitizeString(String(req.params.documentId || ''), 120)
  159 |   const reason = sanitizeString(String(req.body?.reason || 'Rejected by moderator'), 240)
  160 |   const docs = await readJson('documents.json')
  161 |   const items = Array.isArray(docs) ? docs : []
  162 |   const idx = items.findIndex((d) => String(d.id) === docId)
  163 |   if (idx < 0) return res.status(404).json({ error: 'Document not found' })
  164 | 
  165 |   const flags = Array.isArray(items[idx].moderation_flags) ? items[idx].moderation_flags : []
  166 |   items[idx] = {
  167 |     ...items[idx],
  168 |     moderation_status: 'rejected',
  169 |     moderation_flags: [...flags, `rejected:${reason}`],
  170 |   }
  171 |   await writeJson('documents.json', items)
  172 | 
  173 |   const ownerId = String(items[idx].uploaded_by || items[idx].entity_id || '').trim()
  174 |   if (ownerId) {
  175 |     await createNotification(ownerId, {
  176 |       type: 'media_review_rejected',
  177 |       entity_type: items[idx].entity_type || 'document',
  178 |       entity_id: items[idx].entity_id || items[idx].id,
  179 |       message: `Your uploaded document was rejected by moderation. Reason: ${reason}`,
  180 |       meta: { document_id: items[idx].id, reason },
  181 |     })
  182 |   }
  183 | 
  184 |   return res.json({ ok: true, item: items[idx] })
  185 | }
  186 | 
  187 | export async function listReportsAudit(req, res) {
  188 |   const items = await listReports()
  189 |   return res.json({ items })
  190 | }
  191 | 
  192 | export async function listSystemReportsAudit(req, res) {
  193 |   const items = await listReports()
  194 |   const filtered = items.filter((r) => ['system_report', 'support'].includes(String(r.entity_type || '').toLowerCase()))
  195 |   return res.json({ items: filtered })
  196 | }
  197 | 
  198 | export async function listProductAppealReportsAudit(req, res) {
  199 |   const items = await listReports()
  200 |   const filtered = items.filter((r) => String(r.entity_type || '').toLowerCase() === 'product_appeal')
  201 |   return res.json({ items: filtered })
  202 | }
  203 | 
  204 | export async function listContentReportsAudit(req, res) {
  205 |   const items = await listReports()
  206 |   const filtered = items.filter((r) => String(r.entity_type || '').toLowerCase() === 'content_report')
  207 |   return res.json({ items: filtered })
  208 | }
  209 | 
  210 | export async function resolveReportAudit(req, res) {
  211 |   const updated = await resolveReport(req.params.reportId, req.user, req.body || {})
  212 |   if (!updated) return res.status(404).json({ error: 'Report not found' })
  213 |   return res.json({ ok: true, item: updated })
  214 | }
  215 | 
  216 | export async function assignSupportTicket(req, res) {
  217 |   const ticketId = sanitizeString(String(req.body?.ticket_id || ''), 120)
  218 |   if (!ticketId) return res.status(400).json({ error: 'ticket_id is required' })
  219 |   const assigneeId = sanitizeString(String(req.body?.assignee_id || ''), 120)
  220 |   const updated = await adminAssignSupportTicket(ticketId, assigneeId, req.user.id)
  221 |   if (!updated) return res.status(404).json({ error: 'Ticket not found' })
  222 |   return res.json({ ok: true, ticket: await buildSupportTicketSummary(updated) })
  223 | }
  224 | 
  225 | export async function updateSupportTicket(req, res) {
  226 |   const ticketId = sanitizeString(String(req.params.ticketId || ''), 120)
  227 |   if (!ticketId) return res.status(400).json({ error: 'ticketId is required' })
  228 |   const updated = await adminUpdateSupportTicket(ticketId, req.body || {}, req.user.id)
  229 |   if (!updated) return res.status(404).json({ error: 'Ticket not found' })
  230 |   return res.json({ ok: true, ticket: await buildSupportTicketSummary(updated) })
  231 | }
  232 | 
  233 | export async function listSupportTicketsAdminController(req, res) {
  234 |   const status = sanitizeString(String(req.query?.status || ''), 40)
  235 |   const priority = sanitizeString(String(req.query?.priority || ''), 40)
  236 |   const assignedTo = sanitizeString(String(req.query?.assigned_to || ''), 120)
  237 |   const premiumOnly = req.query?.premium_only !== undefined ? ['true', '1', 'yes'].includes(String(req.query?.premium_only).toLowerCase()) : undefined
  238 |   const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 50)))
  239 |   const offset = Math.max(0, Number(req.query?.offset || 0))
  240 |   const tickets = await listSupportTicketsAdmin({ status, priority, assignedTo, premiumOnly, limit, offset })
  241 |   const summaries = await Promise.all(tickets.map((ticket) => buildSupportTicketSummary(ticket)))
  242 |   return res.json({ items: summaries })
  243 | }
  244 | 
  245 | export async function assignAccountManager(req, res) {
  246 |   const userId = sanitizeString(String(req.body?.user_id || ''), 120)
  247 |   if (!userId) return res.status(400).json({ error: 'user_id is required' })
  248 |   const users = await readJson('users.json')
  249 |   const rows = Array.isArray(users) ? users : []
  250 |   const idx = rows.findIndex((u) => String(u.id) === userId)
  251 |   if (idx < 0) return res.status(404).json({ error: 'User not found' })
  252 | 
  253 |   const profile = { ...(rows[idx].profile || {}) }
  254 |   profile.account_manager_id = sanitizeString(String(req.body?.account_manager_id || ''), 120) || null
  255 |   profile.account_manager_name = sanitizeString(String(req.body?.account_manager_name || ''), 120)
  256 |   profile.account_manager_email = sanitizeString(String(req.body?.account_manager_email || ''), 160)
  257 |   profile.account_manager_phone = sanitizeString(String(req.body?.account_manager_phone || ''), 60)
  258 | 
  259 |   rows[idx] = { ...rows[idx], profile }
  260 |   await writeJson('users.json', rows)
  261 |   return res.json({ ok: true, user_id: rows[idx].id, profile })
  262 | }
  263 | 
  264 | // E-sign webhook failure admin helpers
  265 | export async function listEsignFailures(req, res) {
  266 |   const items = await readLocalJson('esign_webhook_failures', [])
  267 |   return res.json({ items: Array.isArray(items) ? items : [] })
  268 | }
  269 | 
  270 | export async function retryEsignFailure(req, res) {
  271 |   const id = String(req.params.id || '').trim()
  272 |   const list = await readLocalJson('esign_webhook_failures', [])
  273 |   const idx = Array.isArray(list) ? list.findIndex((it) => String(it.id) === id) : -1
  274 |   if (idx < 0) return res.status(404).json({ error: 'not_found' })
  275 |   const item = list[idx]
  276 |   try {
  277 |     await handleSignCallback(item.contractId, item.payload)
  278 |     const next = list.filter((it) => String(it.id) !== id)
  279 |     await updateLocalJson('esign_webhook_failures', () => next, [])
  280 |     logInfo('admin_esign_retry_success', { id: item.id, contractId: item.contractId })
  281 |     return res.json({ ok: true })
  282 |   } catch (err) {
  283 |     item.attempts = Number(item.attempts || 0) + 1
  284 |     item.lastAttemptAt = Date.now()
  285 |     item.lastError = String(err?.message || err)
  286 |     const next = list.map((it) => (String(it.id) === id ? item : it))
  287 |     await updateLocalJson('esign_webhook_failures', () => next, [])
  288 |     logError('admin_esign_retry_failed', { id: item.id, contractId: item.contractId, error: item.lastError })
  289 |     return res.status(500).json({ ok: false, error: 'retry_failed', message: item.lastError })
  290 |   }
  291 | }
  292 | 
  293 | export async function deleteEsignFailure(req, res) {
  294 |   const id = String(req.params.id || '').trim()
  295 |   const list = await readLocalJson('esign_webhook_failures', [])
  296 |   const next = Array.isArray(list) ? list.filter((it) => String(it.id) !== id) : []
  297 |   if (next.length === (Array.isArray(list) ? list.length : 0)) return res.status(404).json({ error: 'not_found' })
  298 |   await updateLocalJson('esign_webhook_failures', () => next, [])
  299 |   logInfo('admin_esign_failure_deleted', { id })
  300 |   return res.json({ ok: true })
  301 | }
  302 | 