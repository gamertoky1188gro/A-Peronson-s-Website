import {
  createDraftContract,
  deleteDocument,
  listContracts,
  listContractAudit,
  listDocuments,
  registerExternalDocument,
  saveDocumentMetadata,
  updateContractArtifact,
  updateContractSignatures,
} from '../services/documentService.js'
import { createSignSession, handleSignCallback } from '../services/eSignService.js'
import { normalizeProviderWebhook } from '../services/eSignCallbackMapper.js'
import crypto from 'crypto'
import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
import { deny, handleControllerError } from '../utils/permissions.js'
import { ensureEntitlement } from '../services/entitlementService.js'
import { logInfo, logError } from '../utils/logger.js'
import { recordFailedWebhook } from '../services/esignRetryService.js'

export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const entityType = req.body?.entity_type || 'verification'
    const entityId = req.body?.entity_id || req.user.id
    const doc = await saveDocumentMetadata(req.user.id, entityType, entityId, req.body?.type || 'other', req.file)
    return res.status(201).json(doc)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function registerDocumentUrl(req, res) {
  try {
    const entityType = req.body?.entity_type || 'verification'
    const entityId = req.body?.entity_id || req.user.id
    const url = req.body?.url || req.body?.file_path || ''
    const doc = await registerExternalDocument(req.user.id, entityType, entityId, req.body?.type || 'image', url)
    return res.status(201).json(doc)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function getDocuments(req, res) {
  const entityType = req.query.entity_type || 'verification'
  const entityId = req.query.entity_id || req.user.id
  const docs = await listDocuments(entityType, entityId)
  return res.json(docs)
}

export async function removeDocument(req, res) {
  const result = await deleteDocument(req.params.documentId, req.user)
  if (result === 'forbidden') return deny(res)
  if (!result) return res.status(404).json({ error: 'Document not found' })
  return res.json({ ok: true })
}

export async function createContractDraft(req, res) {
  try {
    const contract = await createDraftContract(req.user, req.body || {})
    return res.status(201).json(contract)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function getContracts(req, res) {
  const contracts = await listContracts(req.user)
  return res.json(contracts)
}

export async function getContractAudit(req, res) {
  try {
    await ensureEntitlement(req.user, 'contract_history_audit', 'Premium plan required for contract audit trail.')
    const audit = await listContractAudit(req.user, req.params.contractId)
    if (audit === 'forbidden') return deny(res)
    if (!audit) return res.status(404).json({ error: 'Contract not found' })
    return res.json(audit)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function patchContractSignatures(req, res) {
  const result = await updateContractSignatures(req.params.contractId, req.body || {}, req.user)
  if (result === 'forbidden') return deny(res)
  if (!result) return res.status(404).json({ error: 'Contract not found' })
  return res.json(result)
}

export async function patchContractArtifact(req, res) {
  const result = await updateContractArtifact(req.params.contractId, req.body || {}, req.user)
  if (result === 'forbidden') return deny(res)
  if (!result) return res.status(404).json({ error: 'Contract not found' })
  return res.json(result)
}

export async function createContractSignSession(req, res) {
  try {
    const result = await createSignSession(req.params.contractId, req.user)
    return res.json(result)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function createContractSignCallback(req, res) {
  try {
    // Enhanced webhook validation: support HMAC signature, timestamp tolerance, and replay protection
    const secret = String(process.env.ESIGN_WEBHOOK_SECRET || '')
    const toleranceSeconds = Number(process.env.ESIGN_WEBHOOK_TOLERANCE_SECONDS || 300)
    const retentionMs = Number(process.env.ESIGN_WEBHOOK_NONCE_RETENTION_MS || 24 * 60 * 60 * 1000)

    const signatureHeader = String(req.headers['x-esign-signature'] || req.headers['x-hub-signature'] || '')
    const incomingSecretHeader = String(req.headers['x-esign-secret'] || req.query?.secret || '')

    // Log receipt of webhook (do not log full payload for privacy/security)
    try {
      logInfo('esign_webhook_received', { contractId: req.params.contractId, hasSignature: Boolean(signatureHeader), hasSecret: Boolean(incomingSecretHeader) })
    } catch {
      // ignore logging errors
    }

    if (secret) {
      if (signatureHeader) {
        // Support formats: 't=timestamp,v1=hex' or 'sha256=hex' or raw hex
        let timestamp = null
        let signature = null
        const parts = signatureHeader.split(',').map((p) => p.trim())
        for (const p of parts) {
          if (p.startsWith('t=')) timestamp = p.slice(2)
          if (p.startsWith('v1=')) signature = p.slice(3)
          if (p.startsWith('sha256=')) signature = p.slice('sha256='.length)
        }
        if (!signature && parts.length === 1) signature = parts[0]

        if (!signature) return res.status(403).json({ error: 'Signature missing' })

        const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}), 'utf8')
        const payloadString = raw.toString('utf8')

        if (timestamp) {
          const tsNum = Number(timestamp)
          if (!Number.isFinite(tsNum) || Math.abs(Date.now() - tsNum * 1000) > toleranceSeconds * 1000) {
            return res.status(403).json({ error: 'Webhook timestamp outside tolerance' })
          }

          const signedPayload = `${timestamp}.${payloadString}`
          const expectedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
          try {
            const sigBuf = Buffer.from(signature, 'hex')
            const expectedBuf = Buffer.from(expectedSig, 'hex')
            if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
              return res.status(403).json({ error: 'Invalid signature' })
            }
          } catch (e) {
            return res.status(403).json({ error: 'Invalid signature format' })
          }

          // Replay protection: store processed signatures in local app state
          try {
            await updateLocalJson('esign_webhook_nonces', (existing = []) => {
              const nowTs = Date.now()
              const arr = Array.isArray(existing) ? existing.filter((e) => nowTs - (e.ts || 0) <= retentionMs) : []
              if (arr.find((e) => e.sig === signature)) {
                const err = new Error('Replay detected')
                err.status = 403
                throw err
              }
              arr.push({ sig: signature, ts: nowTs })
              return arr
            }, [])
          } catch (e) {
            if (e && e.status === 403) return res.status(403).json({ error: 'Replay detected' })
            throw e
          }
        } else {
          // No timestamp: fall back to static secret header check
          if (!incomingSecretHeader || incomingSecretHeader !== secret) {
            return res.status(403).json({ error: 'Forbidden' })
          }
        }
      } else {
        // No signature header: fall back to static secret header / query param
        if (!incomingSecretHeader || incomingSecretHeader !== secret) {
          return res.status(403).json({ error: 'Forbidden' })
        }
      }
    }

    const contractId = req.params.contractId
    let payload = {}
    if (Buffer.isBuffer(req.body)) {
      try {
        payload = JSON.parse(req.body.toString('utf8'))
      } catch {
        payload = {}
      }
    } else {
      payload = req.body || {}
    }

    // Best-effort normalize provider webhook shapes into our internal payload
    try {
      const normalized = normalizeProviderWebhook(payload, req.headers || {})
      if (normalized && (normalized.buyer_signed || normalized.factory_signed)) {
        payload = { ...payload, ...normalized }
      }
    } catch {
      // ignore mapping errors and use raw payload
    }

    try {
      const updated = await handleSignCallback(contractId, payload)
      try {
        logInfo('esign_webhook_processed', {
          contractId,
          buyer_signature_state: updated?.buyer_signature_state,
          factory_signature_state: updated?.factory_signature_state,
          artifact_status: updated?.artifact?.status,
        })
      } catch {
        // silent
      }
      return res.json({ ok: true, contract: updated })
    } catch (innerErr) {
      // If processing failed, persist for retry and return error
      try {
        await recordFailedWebhook({ contractId, payload, headers: { signature: signatureHeader || null }, error: innerErr?.message || String(innerErr) })
      } catch (recErr) {
        try { logError('esign_webhook_record_failed', recErr) } catch {}
      }
      throw innerErr
    }
  } catch (error) {
    try { logError('esign_webhook_processing_error', error) } catch {}
    return handleControllerError(res, error)
  }
}
