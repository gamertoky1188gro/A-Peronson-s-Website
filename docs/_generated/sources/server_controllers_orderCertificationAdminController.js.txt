    1 | import { addOrderCertificationEvidence, approveOrderCertification, listOrderCertifications, revokeOrderCertification } from '../services/orderCertificationService.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { findUserById } from '../services/userService.js'
    4 | 
    5 | function normalizeIds(value) {
    6 |   if (Array.isArray(value)) return value.map((v) => sanitizeString(String(v || ''), 120)).filter(Boolean)
    7 |   return String(value || '')
    8 |     .split(',')
    9 |     .map((entry) => sanitizeString(entry.trim(), 120))
   10 |     .filter(Boolean)
   11 | }
   12 | 
   13 | async function ensureUserExists(userId) {
   14 |   const user = await findUserById(userId)
   15 |   if (!user) {
   16 |     const err = new Error('User not found')
   17 |     err.status = 404
   18 |     throw err
   19 |   }
   20 |   return user
   21 | }
   22 | 
   23 | export async function listOrderCertificationsAdmin(req, res) {
   24 |   const status = sanitizeString(String(req.query?.status || ''), 40)
   25 |   const items = await listOrderCertifications({ status })
   26 |   return res.json({ items })
   27 | }
   28 | 
   29 | export async function approveOrderCertificationAdmin(req, res) {
   30 |   try {
   31 |     const userId = sanitizeString(String(req.body?.user_id || ''), 120)
   32 |     if (!userId) return res.status(400).json({ error: 'user_id is required' })
   33 |     await ensureUserExists(userId)
   34 |     const evidence = normalizeIds(req.body?.evidence_contract_ids || req.body?.evidence_ids)
   35 |     const note = sanitizeString(String(req.body?.note || ''), 320)
   36 |     const record = await approveOrderCertification(userId, {
   37 |       issuedBy: req.user?.id,
   38 |       evidenceContractIds: evidence,
   39 |       note,
   40 |     })
   41 |     return res.json({ record })
   42 |   } catch (err) {
   43 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to approve certification' })
   44 |   }
   45 | }
   46 | 
   47 | export async function revokeOrderCertificationAdmin(req, res) {
   48 |   try {
   49 |     const userId = sanitizeString(String(req.body?.user_id || ''), 120)
   50 |     if (!userId) return res.status(400).json({ error: 'user_id is required' })
   51 |     await ensureUserExists(userId)
   52 |     const note = sanitizeString(String(req.body?.note || ''), 320)
   53 |     const record = await revokeOrderCertification(userId, { issuedBy: req.user?.id, note })
   54 |     return res.json({ record })
   55 |   } catch (err) {
   56 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to revoke certification' })
   57 |   }
   58 | }
   59 | 
   60 | export async function attachOrderCertificationEvidenceAdmin(req, res) {
   61 |   try {
   62 |     const userId = sanitizeString(String(req.body?.user_id || ''), 120)
   63 |     if (!userId) return res.status(400).json({ error: 'user_id is required' })
   64 |     await ensureUserExists(userId)
   65 |     const evidence = normalizeIds(req.body?.evidence_contract_ids || req.body?.evidence_ids)
   66 |     if (!evidence.length) return res.status(400).json({ error: 'evidence_contract_ids are required' })
   67 |     const note = sanitizeString(String(req.body?.note || ''), 320)
   68 |     const record = await addOrderCertificationEvidence(userId, evidence, { issuedBy: req.user?.id, note })
   69 |     return res.json({ record })
   70 |   } catch (err) {
   71 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to attach evidence' })
   72 |   }
   73 | }
   74 | 