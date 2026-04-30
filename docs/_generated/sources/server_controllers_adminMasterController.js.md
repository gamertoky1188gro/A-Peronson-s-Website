    1 | import crypto from 'crypto'
    2 | import { getAdminMasterSummary } from '../services/adminMasterService.js'
    3 | import { readAuditLog } from '../utils/auditStore.js'
    4 | import { getAdminConfig, updateAdminConfig } from '../services/adminConfigService.js'
    5 | import { listUsers } from '../services/userService.js'
    6 | import { performAdminAction } from '../services/adminActionService.js'
    7 | import { handleControllerError } from '../utils/permissions.js'
    8 | import { readJson } from '../utils/jsonStore.js'
    9 | 
   10 | export async function adminMasterOverview(req, res) {
   11 |   const summary = await getAdminMasterSummary(req.user)
   12 |   return res.json(summary)
   13 | }
   14 | 
   15 | export async function adminAction(req, res) {
   16 |   const action = String(req.body?.action || '').trim()
   17 |   if (!action) return res.status(400).json({ error: 'action is required' })
   18 |   try {
   19 |     const result = await performAdminAction(action, req.body?.payload || {}, req.user)
   20 |     return res.json({ ok: true, action_id: crypto.randomUUID(), result })
   21 |   } catch (error) {
   22 |     return handleControllerError(res, error)
   23 |   }
   24 | }
   25 | 
   26 | export async function adminAuditLog(req, res) {
   27 |   const items = await readAuditLog()
   28 |   const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 100)))
   29 |   return res.json({ items: items.slice(-limit).reverse() })
   30 | }
   31 | 
   32 | export async function adminGetConfig(req, res) {
   33 |   const config = await getAdminConfig()
   34 |   return res.json(config)
   35 | }
   36 | 
   37 | export async function adminUpdateConfig(req, res) {
   38 |   const patch = req.body || {}
   39 |   const config = await updateAdminConfig(patch)
   40 |   return res.json(config)
   41 | }
   42 | 
   43 | export async function adminEmailExport(req, res) {
   44 |   const users = await listUsers()
   45 |   const emails = users.map((u) => u.email).filter(Boolean)
   46 |   const csv = ['email', ...emails].join('\n')
   47 |   res.setHeader('Content-Type', 'text/csv')
   48 |   res.setHeader('Content-Disposition', 'attachment; filename="gartexhub_emails.csv"')
   49 |   return res.send(csv)
   50 | }
   51 | 
   52 | function toCsv(rows = []) {
   53 |   if (!rows.length) return ''
   54 |   const headers = Object.keys(rows[0])
   55 |   const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
   56 |   const lines = [
   57 |     headers.join(','),
   58 |     ...rows.map((row) => headers.map((key) => escape(row[key])).join(',')),
   59 |   ]
   60 |   return lines.join('\n')
   61 | }
   62 | 
   63 | export async function adminDataExport(req, res) {
   64 |   const dataset = String(req.query?.dataset || '').trim()
   65 |   const format = String(req.query?.format || 'json').toLowerCase()
   66 |   if (!dataset) return res.status(400).json({ error: 'dataset is required' })
   67 | 
   68 |   let data = null
   69 |   try {
   70 |     data = await readJson(`${dataset}.json`)
   71 |   } catch {
   72 |     return res.status(404).json({ error: 'dataset not found' })
   73 |   }
   74 | 
   75 |   if (format === 'csv') {
   76 |     const rows = Array.isArray(data) ? data : [data]
   77 |     const csv = toCsv(rows)
   78 |     res.setHeader('Content-Type', 'text/csv')
   79 |     res.setHeader('Content-Disposition', `attachment; filename="${dataset}.csv"`)
   80 |     return res.send(csv)
   81 |   }
   82 | 
   83 |   res.setHeader('Content-Type', 'application/json')
   84 |   return res.json({ dataset, items: data })
   85 | }
   86 | 