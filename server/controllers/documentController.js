import {
  createDraftContract,
  deleteDocument,
  listContracts,
  listDocuments,
  saveDocumentMetadata,
  updateContractArtifact,
  updateContractSignatures,
} from '../services/documentService.js'
import { deny, handleControllerError } from '../utils/permissions.js'

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
