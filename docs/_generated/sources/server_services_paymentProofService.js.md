    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { canAccessContract } from '../utils/permissions.js'
    5 | import { createNotification } from './notificationService.js'
    6 | import { trackEvent } from './eventTrackingService.js'
    7 | 
    8 | const FILE = 'payment_proofs.json'
    9 | const DOCUMENTS_FILE = 'documents.json'
   10 | const USERS_FILE = 'users.json'
   11 | 
   12 | const BANK_STATUSES = new Set(['pending_check', 'received', 'not_received'])
   13 | const LC_STATUSES = new Set(['pending_review', 'accepted', 'rejected'])
   14 | 
   15 | function normalizeDate(value) {
   16 |   if (!value) return null
   17 |   const date = new Date(value)
   18 |   return Number.isFinite(date.getTime()) ? date.toISOString() : null
   19 | }
   20 | 
   21 | function ensureContractAccess(actor, contract) {
   22 |   if (!actor || !contract) return false
   23 |   return canAccessContract(actor, contract)
   24 | }
   25 | 
   26 | function getContractById(contracts, id) {
   27 |   return (Array.isArray(contracts) ? contracts : []).find((row) => String(row?.id || '') === String(id)) || null
   28 | }
   29 | 
   30 | function normalizeType(value) {
   31 |   const type = String(value || '').toLowerCase().trim()
   32 |   if (type === 'bank_transfer' || type === 'bank') return 'bank_transfer'
   33 |   if (type === 'lc' || type === 'letter_of_credit') return 'lc'
   34 |   return ''
   35 | }
   36 | 
   37 | function normalizeLcType(value) {
   38 |   const type = String(value || '').toLowerCase().trim()
   39 |   if (!type) return ''
   40 |   if (type === 'sight') return 'sight'
   41 |   if (type === 'usance') return 'usance'
   42 |   return ''
   43 | }
   44 | 
   45 | function normalizeUsanceDays(value) {
   46 |   if (value === undefined || value === null || value === '') return null
   47 |   const days = Number(value)
   48 |   if (!Number.isFinite(days)) return null
   49 |   const rounded = Math.round(days)
   50 |   if (rounded <= 0) return null
   51 |   if (rounded > 365) return 365
   52 |   return rounded
   53 | }
   54 | 
   55 | function requireFields(payload, fields) {
   56 |   const missing = fields.filter((field) => !String(payload?.[field] || '').trim())
   57 |   return missing
   58 | }
   59 | 
   60 | async function notifyAdmins(message, meta = {}) {
   61 |   const users = await readJson(USERS_FILE)
   62 |   const admins = (Array.isArray(users) ? users : []).filter((u) => ['owner', 'admin'].includes(String(u?.role || '').toLowerCase()))
   63 |   for (const admin of admins) {
   64 |     await createNotification(admin.id, {
   65 |       type: 'payment_proof_review',
   66 |       entity_type: 'payment_proof',
   67 |       entity_id: meta?.proof_id || '',
   68 |       message,
   69 |       meta,
   70 |     })
   71 |   }
   72 | }
   73 | 
   74 | export async function createPaymentProof(actor, payload = {}) {
   75 |   const contractId = sanitizeString(payload.contract_id || payload.contractId || '', 120)
   76 |   if (!contractId) {
   77 |     const err = new Error('contract_id is required')
   78 |     err.status = 400
   79 |     throw err
   80 |   }
   81 | 
   82 |   const type = normalizeType(payload.type)
   83 |   if (!type) {
   84 |     const err = new Error('type must be bank_transfer or lc')
   85 |     err.status = 400
   86 |     throw err
   87 |   }
   88 | 
   89 |   const contracts = await readJson(DOCUMENTS_FILE)
   90 |   const contract = getContractById(contracts, contractId)
   91 |   if (!contract) {
   92 |     const err = new Error('Contract not found')
   93 |     err.status = 404
   94 |     throw err
   95 |   }
   96 |   if (!ensureContractAccess(actor, contract)) {
   97 |     const err = new Error('Forbidden')
   98 |     err.status = 403
   99 |     throw err
  100 |   }
  101 | 
  102 |   if (type === 'bank_transfer') {
  103 |     const missing = requireFields(payload, ['transaction_reference', 'bank_name', 'sender_account_name', 'receiver_account_name', 'transaction_date', 'amount', 'currency'])
  104 |     if (missing.length) {
  105 |       const err = new Error(`Missing fields: ${missing.join(', ')}`)
  106 |       err.status = 400
  107 |       throw err
  108 |     }
  109 |   }
  110 | 
  111 |   if (type === 'lc') {
  112 |     const missing = requireFields(payload, ['lc_number', 'issuing_bank', 'advising_bank', 'applicant_name', 'beneficiary_name', 'issue_date', 'expiry_date', 'amount', 'currency'])
  113 |     if (missing.length) {
  114 |       const err = new Error(`Missing fields: ${missing.join(', ')}`)
  115 |       err.status = 400
  116 |       throw err
  117 |     }
  118 | 
  119 |     const lcType = normalizeLcType(payload.lc_type || payload.lcType)
  120 |     if (!lcType) {
  121 |       const err = new Error('lc_type is required (sight or usance)')
  122 |       err.status = 400
  123 |       throw err
  124 |     }
  125 | 
  126 |     if (lcType === 'usance') {
  127 |       const usanceDays = normalizeUsanceDays(payload.usance_days ?? payload.usanceDays ?? payload.usance_tenor)
  128 |       if (!usanceDays) {
  129 |         const err = new Error('usance_days is required for usance LC')
  130 |         err.status = 400
  131 |         throw err
  132 |       }
  133 |     }
  134 |   }
  135 | 
  136 |   const proofs = await readJson(FILE)
  137 |   const now = new Date().toISOString()
  138 |   const row = {
  139 |     id: crypto.randomUUID(),
  140 |     contract_id: contractId,
  141 |     type,
  142 |     status: type === 'bank_transfer' ? 'pending_check' : 'pending_review',
  143 |     created_by: actor.id,
  144 |     reviewed_by: null,
  145 |     review_reason: '',
  146 |     transaction_reference: sanitizeString(payload.transaction_reference || '', 160),
  147 |     bank_name: sanitizeString(payload.bank_name || '', 120),
  148 |     sender_account_name: sanitizeString(payload.sender_account_name || '', 120),
  149 |     receiver_account_name: sanitizeString(payload.receiver_account_name || '', 120),
  150 |     transaction_date: normalizeDate(payload.transaction_date),
  151 |     amount: Number(payload.amount || 0) || null,
  152 |     currency: sanitizeString(payload.currency || '', 20),
  153 |     lc_number: sanitizeString(payload.lc_number || '', 120),
  154 |     issuing_bank: sanitizeString(payload.issuing_bank || '', 120),
  155 |     advising_bank: sanitizeString(payload.advising_bank || '', 120),
  156 |     applicant_name: sanitizeString(payload.applicant_name || '', 120),
  157 |     beneficiary_name: sanitizeString(payload.beneficiary_name || '', 120),
  158 |     issue_date: normalizeDate(payload.issue_date),
  159 |     expiry_date: normalizeDate(payload.expiry_date),
  160 |     lc_type: normalizeLcType(payload.lc_type || payload.lcType) || null,
  161 |     usance_days: normalizeUsanceDays(payload.usance_days ?? payload.usanceDays ?? payload.usance_tenor),
  162 |     document_id: sanitizeString(payload.document_id || '', 120) || null,
  163 |     document_url: sanitizeString(payload.document_url || payload.document_path || '', 600) || null,
  164 |     created_at: now,
  165 |     updated_at: now,
  166 |   }
  167 | 
  168 |   proofs.push(row)
  169 |   await writeJson(FILE, proofs)
  170 | 
  171 |   const counterpartyId = String(actor.id || '') === String(contract.buyer_id || '')
  172 |     ? String(contract.factory_id || '')
  173 |     : String(contract.buyer_id || '')
  174 | 
  175 |   if (counterpartyId) {
  176 |     await createNotification(counterpartyId, {
  177 |       type: 'payment_proof_submitted',
  178 |       entity_type: 'contract',
  179 |       entity_id: contractId,
  180 |       message: `Payment proof submitted for contract ${contract.contract_number || contractId}.`,
  181 |       meta: { contract_id: contractId, payment_proof_id: row.id, type },
  182 |     })
  183 |   }
  184 | 
  185 |   await trackEvent({ type: 'payment_proof_created', actor_id: actor.id, entity_id: row.id, metadata: { contract_id: contractId, type } })
  186 |   return row
  187 | }
  188 | 
  189 | export async function listPaymentProofsByContract(actor, contractId) {
  190 |   const id = sanitizeString(contractId || '', 120)
  191 |   if (!id) return []
  192 | 
  193 |   const contracts = await readJson(DOCUMENTS_FILE)
  194 |   const contract = getContractById(contracts, id)
  195 |   if (!contract) return []
  196 |   if (!ensureContractAccess(actor, contract)) {
  197 |     const err = new Error('Forbidden')
  198 |     err.status = 403
  199 |     throw err
  200 |   }
  201 | 
  202 |   const proofs = await readJson(FILE)
  203 |   return (Array.isArray(proofs) ? proofs : [])
  204 |     .filter((row) => String(row.contract_id || '') === id)
  205 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  206 | }
  207 | 
  208 | export async function updatePaymentProof(actor, proofId, payload = {}) {
  209 |   const id = sanitizeString(proofId || '', 120)
  210 |   if (!id) return null
  211 | 
  212 |   const proofs = await readJson(FILE)
  213 |   const idx = proofs.findIndex((row) => String(row.id || '') === id)
  214 |   if (idx < 0) return null
  215 | 
  216 |   const contracts = await readJson(DOCUMENTS_FILE)
  217 |   const contract = getContractById(contracts, proofs[idx].contract_id)
  218 |   if (!contract) return null
  219 |   if (!ensureContractAccess(actor, contract)) {
  220 |     const err = new Error('Forbidden')
  221 |     err.status = 403
  222 |     throw err
  223 |   }
  224 | 
  225 |   const type = normalizeType(proofs[idx].type)
  226 |   const nextStatus = String(payload.status || '').toLowerCase().trim()
  227 |   const allowed = type === 'bank_transfer' ? BANK_STATUSES : LC_STATUSES
  228 |   if (!allowed.has(nextStatus)) {
  229 |     const err = new Error('Invalid status')
  230 |     err.status = 400
  231 |     throw err
  232 |   }
  233 | 
  234 |   const now = new Date().toISOString()
  235 |   const next = {
  236 |     ...proofs[idx],
  237 |     status: nextStatus,
  238 |     reviewed_by: actor.id,
  239 |     review_reason: sanitizeString(payload.review_reason || '', 200),
  240 |     updated_at: now,
  241 |   }
  242 | 
  243 |   proofs[idx] = next
  244 |   await writeJson(FILE, proofs)
  245 | 
  246 |   await trackEvent({ type: 'payment_proof_status_updated', actor_id: actor.id, entity_id: next.id, metadata: { status: nextStatus } })
  247 | 
  248 |   if (['not_received', 'rejected'].includes(nextStatus)) {
  249 |     await notifyAdmins(`Payment proof requires review for contract ${contract.contract_number || contract.id}.`, {
  250 |       proof_id: next.id,
  251 |       contract_id: contract.id,
  252 |       status: nextStatus,
  253 |     })
  254 |   }
  255 | 
  256 |   return next
  257 | }
  258 | 