    1 | import {
    2 |   createDraftContract,
    3 |   deleteDocument,
    4 |   listContracts,
    5 |   listContractAudit,
    6 |   listDocuments,
    7 |   registerExternalDocument,
    8 |   saveDocumentMetadata,
    9 |   updateContractArtifact,
   10 |   updateContractSignatures,
   11 | } from '../services/documentService.js'
   12 | import { createSignSession, handleSignCallback } from '../services/eSignService.js'
   13 | import { normalizeProviderWebhook } from '../services/eSignCallbackMapper.js'
   14 | import crypto from 'crypto'
   15 | import { updateLocalJson } from '../utils/localStore.js'
   16 | import { deny, handleControllerError } from '../utils/permissions.js'
   17 | import { ensureEntitlement } from '../services/entitlementService.js'
   18 | import { logInfo, logError } from '../utils/logger.js'
   19 | import { recordFailedWebhook } from '../services/esignRetryService.js'
   20 | 
   21 | export async function uploadDocument(req, res) {
   22 |   if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
   23 |   try {
   24 |     const entityType = req.body?.entity_type || 'verification'
   25 |     const entityId = req.body?.entity_id || req.user.id
   26 |     const doc = await saveDocumentMetadata(req.user.id, entityType, entityId, req.body?.type || 'other', req.file)
   27 |     return res.status(201).json(doc)
   28 |   } catch (error) {
   29 |     return handleControllerError(res, error)
   30 |   }
   31 | }
   32 | 
   33 | export async function registerDocumentUrl(req, res) {
   34 |   try {
   35 |     const entityType = req.body?.entity_type || 'verification'
   36 |     const entityId = req.body?.entity_id || req.user.id
   37 |     const url = req.body?.url || req.body?.file_path || ''
   38 |     const doc = await registerExternalDocument(req.user.id, entityType, entityId, req.body?.type || 'image', url)
   39 |     return res.status(201).json(doc)
   40 |   } catch (error) {
   41 |     return handleControllerError(res, error)
   42 |   }
   43 | }
   44 | 
   45 | export async function getDocuments(req, res) {
   46 |   const entityType = req.query.entity_type || 'verification'
   47 |   const entityId = req.query.entity_id || req.user.id
   48 |   const docs = await listDocuments(entityType, entityId)
   49 |   return res.json(docs)
   50 | }
   51 | 
   52 | export async function removeDocument(req, res) {
   53 |   const result = await deleteDocument(req.params.documentId, req.user)
   54 |   if (result === 'forbidden') return deny(res)
   55 |   if (!result) return res.status(404).json({ error: 'Document not found' })
   56 |   return res.json({ ok: true })
   57 | }
   58 | 
   59 | export async function createContractDraft(req, res) {
   60 |   try {
   61 |     const contract = await createDraftContract(req.user, req.body || {})
   62 |     return res.status(201).json(contract)
   63 |   } catch (error) {
   64 |     return handleControllerError(res, error)
   65 |   }
   66 | }
   67 | 
   68 | export async function getContracts(req, res) {
   69 |   const contracts = await listContracts(req.user)
   70 |   return res.json(contracts)
   71 | }
   72 | 
   73 | export async function getContractAudit(req, res) {
   74 |   try {
   75 |     await ensureEntitlement(req.user, 'contract_history_audit', 'Premium plan required for contract audit trail.')
   76 |     const audit = await listContractAudit(req.user, req.params.contractId)
   77 |     if (audit === 'forbidden') return deny(res)
   78 |     if (!audit) return res.status(404).json({ error: 'Contract not found' })
   79 |     return res.json(audit)
   80 |   } catch (error) {
   81 |     return handleControllerError(res, error)
   82 |   }
   83 | }
   84 | 
   85 | export async function patchContractSignatures(req, res) {
   86 |   const result = await updateContractSignatures(req.params.contractId, req.body || {}, req.user)
   87 |   if (result === 'forbidden') return deny(res)
   88 |   if (!result) return res.status(404).json({ error: 'Contract not found' })
   89 |   return res.json(result)
   90 | }
   91 | 
   92 | export async function patchContractArtifact(req, res) {
   93 |   const result = await updateContractArtifact(req.params.contractId, req.body || {}, req.user)
   94 |   if (result === 'forbidden') return deny(res)
   95 |   if (!result) return res.status(404).json({ error: 'Contract not found' })
   96 |   return res.json(result)
   97 | }
   98 | 
   99 | export async function createContractSignSession(req, res) {
  100 |   try {
  101 |     const result = await createSignSession(req.params.contractId, req.user)
  102 |     return res.json(result)
  103 |   } catch (error) {
  104 |     return handleControllerError(res, error)
  105 |   }
  106 | }
  107 | 
  108 | export async function createContractSignCallback(req, res) {
  109 |   try {
  110 |     // Enhanced webhook validation: support HMAC signature, timestamp tolerance, and replay protection
  111 |     const secret = String(process.env.ESIGN_WEBHOOK_SECRET || '')
  112 |     const toleranceSeconds = Number(process.env.ESIGN_WEBHOOK_TOLERANCE_SECONDS || 300)
  113 |     const retentionMs = Number(process.env.ESIGN_WEBHOOK_NONCE_RETENTION_MS || 24 * 60 * 60 * 1000)
  114 | 
  115 |     const signatureHeader = String(req.headers['x-esign-signature'] || req.headers['x-hub-signature'] || '')
  116 |     const incomingSecretHeader = String(req.headers['x-esign-secret'] || req.query?.secret || '')
  117 | 
  118 |     // Log receipt of webhook (do not log full payload for privacy/security)
  119 |     try {
  120 |       logInfo('esign_webhook_received', { contractId: req.params.contractId, hasSignature: Boolean(signatureHeader), hasSecret: Boolean(incomingSecretHeader) })
  121 |     } catch {
  122 |       void 0
  123 |     }
  124 | 
  125 |     if (secret) {
  126 |       if (signatureHeader) {
  127 |         // Support formats: 't=timestamp,v1=hex' or 'sha256=hex' or raw hex
  128 |         let timestamp = null
  129 |         let signature = null
  130 |         const parts = signatureHeader.split(',').map((p) => p.trim())
  131 |         for (const p of parts) {
  132 |           if (p.startsWith('t=')) timestamp = p.slice(2)
  133 |           if (p.startsWith('v1=')) signature = p.slice(3)
  134 |           if (p.startsWith('sha256=')) signature = p.slice('sha256='.length)
  135 |         }
  136 |         if (!signature && parts.length === 1) signature = parts[0]
  137 | 
  138 |         if (!signature) return res.status(403).json({ error: 'Signature missing' })
  139 | 
  140 |         const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}), 'utf8')
  141 |         const payloadString = raw.toString('utf8')
  142 | 
  143 |         if (timestamp) {
  144 |           const tsNum = Number(timestamp)
  145 |           if (!Number.isFinite(tsNum) || Math.abs(Date.now() - tsNum * 1000) > toleranceSeconds * 1000) {
  146 |             return res.status(403).json({ error: 'Webhook timestamp outside tolerance' })
  147 |           }
  148 | 
  149 |           const signedPayload = `${timestamp}.${payloadString}`
  150 |           const expectedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
  151 |           try {
  152 |             const sigBuf = Buffer.from(signature, 'hex')
  153 |             const expectedBuf = Buffer.from(expectedSig, 'hex')
  154 |             if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
  155 |               return res.status(403).json({ error: 'Invalid signature' })
  156 |             }
  157 |           } catch {
  158 |             return res.status(403).json({ error: 'Invalid signature format' })
  159 |           }
  160 | 
  161 |           // Replay protection: store processed signatures in local app state
  162 |           try {
  163 |             await updateLocalJson('esign_webhook_nonces', (existing = []) => {
  164 |               const nowTs = Date.now()
  165 |               const arr = Array.isArray(existing) ? existing.filter((e) => nowTs - (e.ts || 0) <= retentionMs) : []
  166 |               if (arr.find((e) => e.sig === signature)) {
  167 |                 const err = new Error('Replay detected')
  168 |                 err.status = 403
  169 |                 throw err
  170 |               }
  171 |               arr.push({ sig: signature, ts: nowTs })
  172 |               return arr
  173 |             }, [])
  174 |           } catch (e) {
  175 |             if (e && e.status === 403) return res.status(403).json({ error: 'Replay detected' })
  176 |             throw e
  177 |           }
  178 |         } else {
  179 |           // No timestamp: fall back to static secret header check
  180 |           if (!incomingSecretHeader || incomingSecretHeader !== secret) {
  181 |             return res.status(403).json({ error: 'Forbidden' })
  182 |           }
  183 |         }
  184 |       } else {
  185 |         // No signature header: fall back to static secret header / query param
  186 |         if (!incomingSecretHeader || incomingSecretHeader !== secret) {
  187 |           return res.status(403).json({ error: 'Forbidden' })
  188 |         }
  189 |       }
  190 |     }
  191 | 
  192 |     const contractId = req.params.contractId
  193 |     let payload = {}
  194 |     if (Buffer.isBuffer(req.body)) {
  195 |       try {
  196 |         payload = JSON.parse(req.body.toString('utf8'))
  197 |       } catch {
  198 |         payload = {}
  199 |       }
  200 |     } else {
  201 |       payload = req.body || {}
  202 |     }
  203 | 
  204 |     // Best-effort normalize provider webhook shapes into our internal payload
  205 |     try {
  206 |       const normalized = normalizeProviderWebhook(payload, req.headers || {})
  207 |       if (normalized && (normalized.buyer_signed || normalized.factory_signed)) {
  208 |         payload = { ...payload, ...normalized }
  209 |       }
  210 |     } catch {
  211 |       void 0
  212 |     }
  213 | 
  214 |     try {
  215 |       const updated = await handleSignCallback(contractId, payload)
  216 |       try {
  217 |         logInfo('esign_webhook_processed', {
  218 |           contractId,
  219 |           buyer_signature_state: updated?.buyer_signature_state,
  220 |           factory_signature_state: updated?.factory_signature_state,
  221 |           artifact_status: updated?.artifact?.status,
  222 |         })
  223 |       } catch {
  224 |         void 0
  225 |       }
  226 |       return res.json({ ok: true, contract: updated })
  227 |     } catch (innerErr) {
  228 |       // If processing failed, persist for retry and return error
  229 |       try {
  230 |         await recordFailedWebhook({ contractId, payload, headers: { signature: signatureHeader || null }, error: innerErr?.message || String(innerErr) })
  231 |       } catch (recErr) {
  232 |         try { logError('esign_webhook_record_failed', recErr) } catch { void 0 }
  233 |       }
  234 |       throw innerErr
  235 |     }
  236 |   } catch (error) {
  237 |     try { logError('esign_webhook_processing_error', error) } catch { void 0 }
  238 |     return handleControllerError(res, error)
  239 |   }
  240 | }
  241 | 