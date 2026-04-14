    1 | import crypto from 'crypto'
    2 | import path from 'path'
    3 | import fs from 'fs/promises'
    4 | import { readJson, writeJson, updateJson } from '../utils/jsonStore.js'
    5 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    6 | import { sanitizeString } from '../utils/validators.js'
    7 | import { canAccessContract, canManagePartnerNetwork, canModifyContract, isAgent, isOwnerOrAdmin, scopeRecordsForUser } from '../utils/permissions.js'
    8 | import { trackEvent } from './eventTrackingService.js'
    9 | import { ensureCertificationForContract } from './certificationService.js'
   10 | import { markLeadConvertedFromContract } from './leadService.js'
   11 | import { recordWorkflowEvent } from './workflowLifecycleService.js'
   12 | 
   13 | const FILE = 'documents.json'
   14 | const CONTRACT_AUDIT_FILE = 'contract_audit.json'
   15 | const PAYMENT_PROOFS_FILE = 'payment_proofs.json'
   16 | 
   17 | const SIGNATURE_STATES = new Set(['pending', 'signed'])
   18 | const ARTIFACT_STATES = new Set(['draft', 'generated', 'locked', 'archived'])
   19 | const MEDIA_REVIEW_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])
   20 | const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm'])
   21 | const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
   22 | 
   23 | function toIsoNow() {
   24 |   return new Date().toISOString()
   25 | }
   26 | 
   27 | function normalizeContractLifecycle(contract) {
   28 |   if (contract.artifact?.status === 'archived' || contract.archived_at) return 'archived'
   29 |   if (contract.is_draft) return 'draft'
   30 |   if (
   31 |     contract.buyer_signature_state === 'signed' &&
   32 |     contract.factory_signature_state === 'signed' &&
   33 |     ['generated', 'locked'].includes(contract.artifact?.status)
   34 |   ) {
   35 |     return 'signed'
   36 |   }
   37 |   return 'pending_signature'
   38 | }
   39 | 
   40 | function canViewContractBankingReferences(actor, contract) {
   41 |   if (!actor || !contract) return false
   42 |   if (isOwnerOrAdmin(actor)) return true
   43 |   const actorId = String(actor.id || '')
   44 |   if (!actorId) return false
   45 |   return (
   46 |     actorId === String(contract.uploaded_by) ||
   47 |     actorId === String(contract.buyer_id) ||
   48 |     actorId === String(contract.factory_id)
   49 |   )
   50 | }
   51 | 
   52 | function presentContractForActor(contract, actor) {
   53 |   if (!contract) return contract
   54 | 
   55 |   const normalizedPdfPath = (() => {
   56 |     const pdfPath = contract.artifact?.pdf_path || ''
   57 |     if (!pdfPath) return ''
   58 |     if (pdfPath.startsWith('/uploads/')) return pdfPath
   59 |     const normalized = String(pdfPath).replace(/\\/g, '/')
   60 |     const idx = normalized.indexOf('server/uploads/')
   61 |     if (idx >= 0) {
   62 |       const suffix = normalized.slice(idx + 'server/uploads/'.length)
   63 |       return `/uploads/${suffix.replace(/^\/+/, '')}`
   64 |     }
   65 |     return pdfPath
   66 |   })()
   67 | 
   68 |   const base = {
   69 |     ...contract,
   70 |     artifact: contract.artifact
   71 |       ? { ...contract.artifact, pdf_path: normalizedPdfPath }
   72 |       : contract.artifact,
   73 |   }
   74 | 
   75 |   if (canViewContractBankingReferences(actor, contract)) return base
   76 |   return {
   77 |     ...base,
   78 |     bank_name: '',
   79 |     beneficiary_name: '',
   80 |     transaction_reference: '',
   81 |     artifact: base.artifact
   82 |       ? { ...base.artifact, pdf_path: '' }
   83 |       : base.artifact,
   84 |   }
   85 | }
   86 | 
   87 | function sanitizeSignatureState(value, fallback = 'pending') {
   88 |   const normalized = sanitizeString(value || fallback, 20).toLowerCase()
   89 |   return SIGNATURE_STATES.has(normalized) ? normalized : fallback
   90 | }
   91 | 
   92 | function sanitizeArtifactState(value, fallback = 'draft') {
   93 |   const normalized = sanitizeString(value || fallback, 20).toLowerCase()
   94 |   return ARTIFACT_STATES.has(normalized) ? normalized : fallback
   95 | }
   96 | 
   97 | function ensureAllowed(file) {
   98 |   const ext = path.extname(file.originalname || '').toLowerCase()
   99 |   const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.mp4', '.webm']
  100 |   if (!allowed.includes(ext)) throw new Error('Invalid file type')
  101 | }
  102 | 
  103 | function getMediaModerationResult(file) {
  104 |   const name = String(file?.originalname || '').toLowerCase()
  105 |   const ext = path.extname(file?.originalname || '').toLowerCase()
  106 |   const flags = []
  107 | 
  108 |   if (MEDIA_REVIEW_EXTENSIONS.has(ext)) {
  109 |     flags.push(`media_type:${ext.replace('.', '')}`)
  110 |   }
  111 |   if (VIDEO_EXTENSIONS.has(ext)) {
  112 |     flags.push(`media_type:${ext.replace('.', '')}`)
  113 |   }
  114 | 
  115 |   for (const keyword of PROHIBITED_MEDIA_KEYWORDS) {
  116 |     if (name.includes(keyword)) flags.push(`prohibited_keyword:${keyword}`)
  117 |   }
  118 | 
  119 |   const requiresReview = flags.length > 0 || VIDEO_EXTENSIONS.has(ext)
  120 |   return {
  121 |     flags,
  122 |     moderation_status: requiresReview ? 'pending_review' : 'approved',
  123 |   }
  124 | }
  125 | 
  126 | function getMediaModerationResultFromUrl(url) {
  127 |   const flags = []
  128 |   const raw = String(url || '').trim()
  129 |   const internal = raw.startsWith('/uploads/') || raw.startsWith('uploads/') || raw.includes('server/uploads/')
  130 |   let ext = ''
  131 | 
  132 |   if (internal) {
  133 |     ext = path.extname(raw).toLowerCase()
  134 |   } else {
  135 |     let parsed = null
  136 |     try {
  137 |       parsed = new URL(url)
  138 |     } catch {
  139 |       flags.push('invalid_url')
  140 |     }
  141 | 
  142 |     if (parsed && !['http:', 'https:'].includes(parsed.protocol)) {
  143 |       flags.push('invalid_url_protocol')
  144 |     }
  145 | 
  146 |     ext = parsed ? path.extname(parsed.pathname || '').toLowerCase() : ''
  147 |   }
  148 |   if (ext && MEDIA_REVIEW_EXTENSIONS.has(ext)) {
  149 |     flags.push(`media_type:${ext.replace('.', '')}`)
  150 |   }
  151 | 
  152 |   const searchable = String(url || '').toLowerCase()
  153 |   for (const keyword of PROHIBITED_MEDIA_KEYWORDS) {
  154 |     if (searchable.includes(keyword)) flags.push(`prohibited_keyword:${keyword}`)
  155 |   }
  156 | 
  157 |   const requiresReview = flags.length > 0
  158 |   return {
  159 |     flags,
  160 |     moderation_status: requiresReview ? 'pending_review' : 'approved',
  161 |   }
  162 | }
  163 | 
  164 | function ensureAllowedUrl(url) {
  165 |   const raw = String(url || '').trim()
  166 |   const internal = raw.startsWith('/uploads/') || raw.startsWith('uploads/') || raw.includes('server/uploads/')
  167 |   if (!internal) throw new Error('Only internal media URLs are allowed')
  168 |   const ext = path.extname(raw).toLowerCase()
  169 |   if (!MEDIA_REVIEW_EXTENSIONS.has(ext)) throw new Error('Only .png, .jpg, .jpeg images are supported')
  170 | }
  171 | 
  172 | function escapePdfText(value = '') {
  173 |   return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  174 | }
  175 | 
  176 | function buildSimpleContractPdf(contract) {
  177 |   const lines = [
  178 |     'A-Personson Contract Artifact',
  179 |     `Contract Number: ${contract.contract_number || contract.id}`,
  180 |     `Title: ${contract.title || 'Contract'}`,
  181 |     `Buyer: ${contract.buyer_name || 'N/A'} (${contract.buyer_id || 'N/A'})`,
  182 |     `Factory: ${contract.factory_name || 'N/A'} (${contract.factory_id || 'N/A'})`,
  183 |     contract.bank_name ? `Bank: ${contract.bank_name}` : '',
  184 |     contract.beneficiary_name ? `Beneficiary: ${contract.beneficiary_name}` : '',
  185 |     contract.transaction_reference ? `Transaction Reference: ${contract.transaction_reference}` : '',
  186 |     `Buyer Signature Timestamp: ${contract.buyer_signed_at || 'N/A'}`,
  187 |     `Factory Signature Timestamp: ${contract.factory_signed_at || 'N/A'}`,
  188 |     `Generated At: ${toIsoNow()}`,
  189 |   ].filter(Boolean)
  190 | 
  191 |   const contentLines = lines.map((line, idx) => `BT /F1 12 Tf 50 ${760 - (idx * 22)} Td (${escapePdfText(line)}) Tj ET`).join('\n')
  192 |   const contentStream = `${contentLines}\n`
  193 | 
  194 |   const objects = []
  195 |   objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  196 |   objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
  197 |   objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')
  198 |   objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n')
  199 |   objects.push(`5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}endstream\nendobj\n`)
  200 | 
  201 |   let offset = 0
  202 |   let pdf = '%PDF-1.4\n'
  203 |   offset = Buffer.byteLength(pdf, 'utf8')
  204 |   const xrefOffsets = [0]
  205 | 
  206 |   for (const object of objects) {
  207 |     xrefOffsets.push(offset)
  208 |     pdf += object
  209 |     offset = Buffer.byteLength(pdf, 'utf8')
  210 |   }
  211 | 
  212 |   const xrefStart = offset
  213 |   pdf += `xref\n0 ${objects.length + 1}\n`
  214 |   pdf += '0000000000 65535 f \n'
  215 |   for (const objOffset of xrefOffsets.slice(1)) {
  216 |     pdf += `${String(objOffset).padStart(10, '0')} 00000 n \n`
  217 |   }
  218 | 
  219 |   pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  220 |   return Buffer.from(pdf, 'utf8')
  221 | }
  222 | 
  223 | export async function generateContractArtifact(contract) {
  224 |   const generatedAt = toIsoNow()
  225 |   const generationVersion = Number(contract.artifact?.version || 0) + 1
  226 |   const pdfBuffer = buildSimpleContractPdf(contract)
  227 |   const pdfHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex')
  228 | 
  229 |   const uploadsDir = path.join(process.cwd(), 'server', 'uploads', 'contracts')
  230 |   await fs.mkdir(uploadsDir, { recursive: true })
  231 | 
  232 |   const safeContractNumber = sanitizeString(contract.contract_number || contract.id, 80).replace(/[^a-zA-Z0-9_-]/g, '_')
  233 |   const fileName = `${safeContractNumber || contract.id}-v${generationVersion}.pdf`
  234 |   const filePath = path.join(uploadsDir, fileName)
  235 |   await fs.writeFile(filePath, pdfBuffer)
  236 | 
  237 |   return {
  238 |     pdf_path: `/uploads/contracts/${fileName}`,
  239 |     pdf_hash: pdfHash,
  240 |     status: 'generated',
  241 |     generated_at: generatedAt,
  242 |     version: generationVersion,
  243 |     signer_ids: {
  244 |       buyer_id: sanitizeString(contract.buyer_id || '', 120),
  245 |       factory_id: sanitizeString(contract.factory_id || '', 120),
  246 |     },
  247 |     signature_timestamps: {
  248 |       buyer_signed_at: contract.buyer_signed_at || '',
  249 |       factory_signed_at: contract.factory_signed_at || '',
  250 |     },
  251 |   }
  252 | }
  253 | 
  254 | // Render the contract PDF as a Buffer without persisting artifact metadata.
  255 | export function renderContractPdfBuffer(contract) {
  256 |   return buildSimpleContractPdf(contract)
  257 | }
  258 | 
  259 | export async function saveDocumentMetadata(ownerId, entityType, entityId, type, file) {
  260 |   const docs = await readJson(FILE)
  261 |   ensureAllowed(file)
  262 |   const moderation = getMediaModerationResult(file)
  263 |   const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  264 |   const targetPath = path.join(process.cwd(), 'server', 'uploads', safeName)
  265 |   await fs.writeFile(targetPath, file.buffer)
  266 | 
  267 |   const doc = {
  268 |     id: crypto.randomUUID(),
  269 |     uploaded_by: ownerId,
  270 |     entity_type: sanitizeString(entityType, 60),
  271 |     entity_id: sanitizeString(entityId, 100),
  272 |     file_path: path.relative(process.cwd(), targetPath),
  273 |     type: sanitizeString(type || 'other', 60),
  274 |     moderation_status: moderation.moderation_status,
  275 |     moderation_flags: moderation.flags,
  276 |     created_at: new Date().toISOString(),
  277 |   }
  278 | 
  279 |   docs.push(doc)
  280 |   await writeJson(FILE, docs)
  281 |   if (doc.entity_type === 'company_product' && String(doc.type || '').toLowerCase().includes('image')) {
  282 |     await trackEvent({
  283 |       type: 'product_image_uploaded',
  284 |       actor_id: ownerId,
  285 |       entity_id: doc.entity_id,
  286 |       metadata: { document_id: doc.id },
  287 |     })
  288 |   }
  289 |   if (doc.entity_type === 'company_product' && String(doc.type || '').toLowerCase().includes('video')) {
  290 |     await trackEvent({
  291 |       type: 'product_video_uploaded',
  292 |       actor_id: ownerId,
  293 |       entity_id: doc.entity_id,
  294 |       metadata: { document_id: doc.id },
  295 |     })
  296 |   }
  297 |   return doc
  298 | }
  299 | 
  300 | async function hasAcceptedPaymentProof(contractId) {
  301 |   const proofs = await readJson(PAYMENT_PROOFS_FILE)
  302 |   return (Array.isArray(proofs) ? proofs : []).some((proof) => {
  303 |     if (String(proof.contract_id || '') !== String(contractId || '')) return false
  304 |     const type = String(proof.type || '').toLowerCase()
  305 |     const status = String(proof.status || '').toLowerCase()
  306 |     if (type === 'bank_transfer') return status === 'received'
  307 |     if (type === 'lc') return status === 'accepted'
  308 |     return false
  309 |   })
  310 | }
  311 | 
  312 | async function checkPaymentProof(contractId) {
  313 |   return hasAcceptedPaymentProof(contractId)
  314 | }
  315 | 
  316 | export async function registerExternalDocument(ownerId, entityType, entityId, type, url) {
  317 |   const docs = await readJson(FILE)
  318 |   const safeUrl = sanitizeString(String(url || ''), 600)
  319 |   if (!safeUrl) throw new Error('Media URL is required')
  320 |   ensureAllowedUrl(safeUrl)
  321 |   const moderation = getMediaModerationResultFromUrl(safeUrl)
  322 | 
  323 |   const doc = {
  324 |     id: crypto.randomUUID(),
  325 |     uploaded_by: ownerId,
  326 |     entity_type: sanitizeString(entityType, 60),
  327 |     entity_id: sanitizeString(entityId, 100),
  328 |     file_path: safeUrl,
  329 |     type: sanitizeString(type || 'image', 60),
  330 |     moderation_status: moderation.moderation_status,
  331 |     moderation_flags: moderation.flags,
  332 |     created_at: new Date().toISOString(),
  333 |   }
  334 | 
  335 |   docs.push(doc)
  336 |   await writeJson(FILE, docs)
  337 |   if (doc.entity_type === 'company_product' && String(doc.type || '').toLowerCase().includes('image')) {
  338 |     await trackEvent({
  339 |       type: 'product_image_registered',
  340 |       actor_id: ownerId,
  341 |       entity_id: doc.entity_id,
  342 |       metadata: { document_id: doc.id },
  343 |     })
  344 |   }
  345 |   return doc
  346 | }
  347 | 
  348 | export async function listDocuments(entityType, entityId) {
  349 |   const docs = await readJson(FILE)
  350 |   return docs.filter((d) => d.entity_type === entityType && d.entity_id === entityId)
  351 | }
  352 | 
  353 | export async function deleteDocument(docId, actor) {
  354 |   const docs = await readJson(FILE)
  355 |   const target = docs.find((d) => d.id === docId)
  356 |   if (!target) return false
  357 |   if (!isOwnerOrAdmin(actor) && target.uploaded_by !== actor.id) return 'forbidden'
  358 | 
  359 |   const next = docs.filter((d) => d.id !== docId)
  360 |   await writeJson(FILE, next)
  361 |   return true
  362 | }
  363 | 
  364 | export async function createDraftContract(actor, payload = {}) {
  365 |   if (isAgent(actor) || !canManagePartnerNetwork(actor)) {
  366 |     const err = new Error('Forbidden')
  367 |     err.status = 403
  368 |     throw err
  369 |   }
  370 | 
  371 |   const ownerId = actor.id
  372 |   const docs = await readJson(FILE)
  373 |   const contract = {
  374 |     id: crypto.randomUUID(),
  375 |     entity_type: 'contract',
  376 |     contract_number: sanitizeString(payload.contract_number || `CN-${Date.now()}`, 80),
  377 |     title: sanitizeString(payload.title || 'Draft Contract', 160),
  378 |     buyer_name: sanitizeString(payload.buyer_name || '', 160),
  379 |     factory_name: sanitizeString(payload.factory_name || '', 160),
  380 |     buyer_id: sanitizeString(payload.buyer_id || '', 120),
  381 |     factory_id: sanitizeString(payload.factory_id || '', 120),
  382 |     bank_name: sanitizeString(payload.bank_name || '', 120),
  383 |     beneficiary_name: sanitizeString(payload.beneficiary_name || '', 120),
  384 |     transaction_reference: sanitizeString(payload.transaction_reference || '', 160),
  385 |     is_draft: true,
  386 |     buyer_signature_state: 'pending',
  387 |     factory_signature_state: 'pending',
  388 |     buyer_signed_at: '',
  389 |     factory_signed_at: '',
  390 |     artifact: {
  391 |       pdf_path: '',
  392 |       pdf_hash: '',
  393 |       status: 'draft',
  394 |       generated_at: '',
  395 |       version: 0,
  396 |       signer_ids: {
  397 |         buyer_id: '',
  398 |         factory_id: '',
  399 |       },
  400 |       signature_timestamps: {
  401 |         buyer_signed_at: '',
  402 |         factory_signed_at: '',
  403 |       },
  404 |     },
  405 |     uploaded_by: ownerId,
  406 |     created_at: toIsoNow(),
  407 |     updated_at: toIsoNow(),
  408 |   }
  409 |   contract.lifecycle_status = normalizeContractLifecycle(contract)
  410 |   docs.push(contract)
  411 |   await writeJson(FILE, docs)
  412 |   await trackEvent({ type: 'contract_created', actor_id: actor.id, entity_id: contract.id })
  413 |   await recordWorkflowEvent('contract_created', {
  414 |     contract_id: contract.id,
  415 |     requirement_id: payload.requirement_id,
  416 |     product_id: payload.product_id,
  417 |     match_id: payload.match_id,
  418 |     chat_thread_id: payload.match_id,
  419 |   }, { actor_id: actor.id }).catch(() => null)
  420 |   await appendContractAudit(contract.id, actor.id, 'contract_created', { title: contract.title })
  421 |   return contract
  422 | }
  423 | 
  424 | async function appendContractAudit(contractId, actorId, action, metadata = {}) {
  425 |   try {
  426 |     const row = {
  427 |       id: crypto.randomUUID(),
  428 |       contract_id: String(contractId || ''),
  429 |       actor_id: actorId || null,
  430 |       action: String(action || ''),
  431 |       metadata: metadata || {},
  432 |       created_at: new Date().toISOString(),
  433 |     }
  434 |     // Use the simple JSON store in test mode to avoid hitting Prisma/DB.
  435 |     if (process.env.NODE_ENV === 'test') {
  436 |       await updateJson(CONTRACT_AUDIT_FILE, (existing = []) => {
  437 |         const arr = Array.isArray(existing) ? existing.slice() : []
  438 |         arr.push(row)
  439 |         return arr
  440 |       })
  441 |     } else {
  442 |       await updateLocalJson(CONTRACT_AUDIT_FILE, (existing = []) => {
  443 |         const arr = Array.isArray(existing) ? existing.slice() : []
  444 |         arr.push(row)
  445 |         return arr
  446 |       }, [])
  447 |     }
  448 |   } catch {
  449 |     void 0
  450 |   }
  451 | }
  452 | 
  453 | export async function listContracts(actor) {
  454 |   const docs = await readJson(FILE)
  455 |   const contracts = docs.filter((d) => d.entity_type === 'contract')
  456 |   const scoped = scopeRecordsForUser(actor, contracts, {
  457 |     idFields: ['uploaded_by', 'buyer_id', 'factory_id'],
  458 |     assignmentFields: ['assigned_agent_id', 'agent_id'],
  459 |   })
  460 | 
  461 |   return scoped
  462 |     .map((c) => ({ ...c, lifecycle_status: normalizeContractLifecycle(c) }))
  463 |     .map((c) => presentContractForActor(c, actor))
  464 | }
  465 | 
  466 | export async function listContractAudit(actor, contractId) {
  467 |   const id = sanitizeString(String(contractId || ''), 120)
  468 |   if (!id) return null
  469 |   const docs = await readJson(FILE)
  470 |   const contract = docs.find((d) => d.entity_type === 'contract' && String(d.id) === id) || null
  471 |   if (!contract) return null
  472 |   if (!canAccessContract(actor, contract)) return 'forbidden'
  473 |   // Use the lightweight JSON store during tests to avoid DB dependency/timeouts.
  474 |   const auditRows = process.env.NODE_ENV === 'test'
  475 |     ? await readJson(CONTRACT_AUDIT_FILE)
  476 |     : await readLocalJson(CONTRACT_AUDIT_FILE, [])
  477 |   const items = (Array.isArray(auditRows) ? auditRows : [])
  478 |     .filter((row) => String(row.contract_id || '') === id)
  479 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  480 | 
  481 |   return { contract_id: id, items }
  482 | }
  483 | 
  484 | export async function updateContractSignatures(contractId, patch = {}, actor) {
  485 |   const docs = await readJson(FILE)
  486 |   const idx = docs.findIndex((d) => d.id === contractId && d.entity_type === 'contract')
  487 |   if (idx < 0) return null
  488 |   const existing = docs[idx]
  489 |   if (!canModifyContract(actor, existing)) return 'forbidden'
  490 | 
  491 |   const previousBuyerState = existing.buyer_signature_state
  492 |   const previousFactoryState = existing.factory_signature_state
  493 | 
  494 |   const nextBuyerState = patch.buyer_signature_state !== undefined
  495 |     ? sanitizeSignatureState(patch.buyer_signature_state, existing.buyer_signature_state)
  496 |     : existing.buyer_signature_state
  497 |   const nextFactoryState = patch.factory_signature_state !== undefined
  498 |     ? sanitizeSignatureState(patch.factory_signature_state, existing.factory_signature_state)
  499 |     : existing.factory_signature_state
  500 | 
  501 |   const paymentProofOk = await checkPaymentProof(existing.id)
  502 | 
  503 |   const next = {
  504 |     ...existing,
  505 |     is_draft: patch.is_draft !== undefined ? Boolean(patch.is_draft) : existing.is_draft,
  506 |     buyer_signature_state: nextBuyerState,
  507 |     factory_signature_state: nextFactoryState,
  508 |     buyer_signed_at: nextBuyerState === 'signed'
  509 |       ? (existing.buyer_signed_at || toIsoNow())
  510 |       : '',
  511 |     factory_signed_at: nextFactoryState === 'signed'
  512 |       ? (existing.factory_signed_at || toIsoNow())
  513 |       : '',
  514 |     updated_at: toIsoNow(),
  515 |   }
  516 | 
  517 |   const bothSigned = next.buyer_signature_state === 'signed' && next.factory_signature_state === 'signed'
  518 |   const hasGeneratedArtifact = Boolean(next.artifact?.generated_at && next.artifact?.pdf_hash && next.artifact?.pdf_path)
  519 |   if (bothSigned) {
  520 |     next.is_draft = false
  521 |   }
  522 |   if (bothSigned && !hasGeneratedArtifact) {
  523 |     next.artifact = await generateContractArtifact(next)
  524 |   }
  525 | 
  526 |   next.lifecycle_status = normalizeContractLifecycle(next)
  527 |   docs[idx] = next
  528 |   await writeJson(FILE, docs)
  529 | 
  530 |   
  531 | 
  532 |   if (previousBuyerState !== nextBuyerState && nextBuyerState === 'signed') {
  533 |     await trackEvent({ type: 'contract_buyer_signed', actor_id: actor.id, entity_id: next.id })
  534 |     await appendContractAudit(next.id, actor.id, 'buyer_signed', { previous: previousBuyerState, now: nextBuyerState })
  535 |   }
  536 |   if (previousFactoryState !== nextFactoryState && nextFactoryState === 'signed') {
  537 |     await trackEvent({ type: 'contract_factory_signed', actor_id: actor.id, entity_id: next.id })
  538 |     await appendContractAudit(next.id, actor.id, 'factory_signed', { previous: previousFactoryState, now: nextFactoryState })
  539 |   }
  540 |   if (next.lifecycle_status === 'signed') {
  541 |     await trackEvent({ type: 'contract_signed', actor_id: actor.id, entity_id: next.id })
  542 |     if (process.env.NODE_ENV !== 'test') {
  543 |       await ensureCertificationForContract(next)
  544 |       await markLeadConvertedFromContract({ buyerId: next.buyer_id, factoryId: next.factory_id, contractId: next.id })
  545 |       await recordWorkflowEvent('contract_signed', { contract_id: next.id }, { actor_id: actor.id }).catch(() => null)
  546 |     }
  547 |     await appendContractAudit(next.id, actor.id, 'contract_signed', { artifact: next.artifact || null })
  548 |   }
  549 |   return { ...presentContractForActor(next, actor), payment_proof_ok: paymentProofOk }
  550 | }
  551 | 
  552 | export async function updateContractArtifact(contractId, patch = {}, actor) {
  553 |   const docs = await readJson(FILE)
  554 |   const idx = docs.findIndex((d) => d.id === contractId && d.entity_type === 'contract')
  555 |   if (idx < 0) return null
  556 |   const existing = docs[idx]
  557 |   if (!canModifyContract(actor, existing)) return 'forbidden'
  558 | 
  559 |   const previousStatus = existing.artifact?.status || 'draft'
  560 |   const artifactStatus = patch.status !== undefined
  561 |     ? sanitizeArtifactState(patch.status, existing.artifact?.status || 'draft')
  562 |     : (existing.artifact?.status || 'draft')
  563 | 
  564 |   const paymentProofOk = await checkPaymentProof(existing.id)
  565 | 
  566 |   const hasGeneratedArtifact = Boolean(existing.artifact?.generated_at && existing.artifact?.pdf_hash && existing.artifact?.pdf_path)
  567 |   if (['locked', 'archived'].includes(artifactStatus) && !hasGeneratedArtifact) {
  568 |     const err = new Error('Only generated artifacts can be locked or archived.')
  569 |     err.status = 400
  570 |     throw err
  571 |   }
  572 | 
  573 |   const next = {
  574 |     ...existing,
  575 |     is_draft: artifactStatus === 'draft' ? existing.is_draft : false,
  576 |     artifact: {
  577 |       ...(existing.artifact || {}),
  578 |       status: artifactStatus,
  579 |       pdf_path: existing.artifact?.pdf_path || '',
  580 |       pdf_hash: existing.artifact?.pdf_hash || '',
  581 |       generated_at: existing.artifact?.generated_at || '',
  582 |       version: Number(existing.artifact?.version || 0),
  583 |       signer_ids: {
  584 |         buyer_id: existing.artifact?.signer_ids?.buyer_id || '',
  585 |         factory_id: existing.artifact?.signer_ids?.factory_id || '',
  586 |       },
  587 |       signature_timestamps: {
  588 |         buyer_signed_at: existing.artifact?.signature_timestamps?.buyer_signed_at || '',
  589 |         factory_signed_at: existing.artifact?.signature_timestamps?.factory_signed_at || '',
  590 |       },
  591 |     },
  592 |     archived_at: artifactStatus === 'archived' ? toIsoNow() : existing.archived_at,
  593 |     updated_at: toIsoNow(),
  594 |   }
  595 | 
  596 |   next.lifecycle_status = normalizeContractLifecycle(next)
  597 |   docs[idx] = next
  598 |   await writeJson(FILE, docs)
  599 | 
  600 |   if (previousStatus !== artifactStatus && artifactStatus === 'locked') {
  601 |     await trackEvent({ type: 'contract_locked', actor_id: actor.id, entity_id: next.id })
  602 |     await appendContractAudit(next.id, actor.id, 'artifact_locked', { previous: previousStatus, now: artifactStatus })
  603 |   }
  604 |   if (previousStatus !== artifactStatus && artifactStatus === 'archived') {
  605 |     await trackEvent({ type: 'contract_archived', actor_id: actor.id, entity_id: next.id })
  606 |     await appendContractAudit(next.id, actor.id, 'artifact_archived', { previous: previousStatus, now: artifactStatus })
  607 |   }
  608 |   return { ...presentContractForActor(next, actor), payment_proof_ok: paymentProofOk }
  609 | }
  610 | 