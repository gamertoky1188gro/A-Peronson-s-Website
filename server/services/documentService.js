import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'documents.json'

const SIGNATURE_STATES = new Set(['pending', 'signed'])
const ARTIFACT_STATES = new Set(['draft', 'locked', 'archived'])

function toIsoNow() {
  return new Date().toISOString()
}

function normalizeContractLifecycle(contract) {
  if (contract.artifact?.status === 'archived' || contract.archived_at) return 'archived'
  if (contract.is_draft) return 'draft'
  if (
    contract.buyer_signature_state === 'signed' &&
    contract.factory_signature_state === 'signed' &&
    contract.artifact?.status === 'locked'
  ) {
    return 'signed'
  }
  return 'pending_signature'
}

function sanitizeSignatureState(value, fallback = 'pending') {
  const normalized = sanitizeString(value || fallback, 20).toLowerCase()
  return SIGNATURE_STATES.has(normalized) ? normalized : fallback
}

function sanitizeArtifactState(value, fallback = 'draft') {
  const normalized = sanitizeString(value || fallback, 20).toLowerCase()
  return ARTIFACT_STATES.has(normalized) ? normalized : fallback
}

function ensureAllowed(file) {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const allowed = ['.pdf', '.png', '.jpg', '.jpeg']
  if (!allowed.includes(ext)) throw new Error('Invalid file type')
}

export async function saveDocumentMetadata(ownerId, entityType, entityId, type, file) {
  const docs = await readJson(FILE)
  ensureAllowed(file)
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const targetPath = path.join(process.cwd(), 'server', 'uploads', safeName)
  await fs.writeFile(targetPath, file.buffer)

  const doc = {
    id: crypto.randomUUID(),
    uploaded_by: ownerId,
    entity_type: sanitizeString(entityType, 60),
    entity_id: sanitizeString(entityId, 100),
    file_path: path.relative(process.cwd(), targetPath),
    type: sanitizeString(type || 'other', 60),
    created_at: new Date().toISOString(),
  }

  docs.push(doc)
  await writeJson(FILE, docs)
  return doc
}

export async function listDocuments(entityType, entityId) {
  const docs = await readJson(FILE)
  return docs.filter((d) => d.entity_type === entityType && d.entity_id === entityId)
}

export async function deleteDocument(docId, actor) {
  const docs = await readJson(FILE)
  const target = docs.find((d) => d.id === docId)
  if (!target) return false
  if (actor.role !== 'admin' && target.uploaded_by !== actor.id) return 'forbidden'

  const next = docs.filter((d) => d.id !== docId)
  await writeJson(FILE, next)
  return true
}

export async function createDraftContract(ownerId, payload = {}) {
  const docs = await readJson(FILE)
  const contract = {
    id: crypto.randomUUID(),
    entity_type: 'contract',
    contract_number: sanitizeString(payload.contract_number || `CN-${Date.now()}`, 80),
    title: sanitizeString(payload.title || 'Draft Contract', 160),
    buyer_name: sanitizeString(payload.buyer_name || '', 160),
    factory_name: sanitizeString(payload.factory_name || '', 160),
    buyer_id: sanitizeString(payload.buyer_id || '', 120),
    factory_id: sanitizeString(payload.factory_id || '', 120),
    is_draft: true,
    buyer_signature_state: 'pending',
    factory_signature_state: 'pending',
    artifact: {
      pdf_path: '',
      pdf_hash: '',
      status: 'draft',
    },
    uploaded_by: ownerId,
    created_at: toIsoNow(),
    updated_at: toIsoNow(),
  }
  contract.lifecycle_status = normalizeContractLifecycle(contract)
  docs.push(contract)
  await writeJson(FILE, docs)
  return contract
}

export async function listContracts(actor) {
  const docs = await readJson(FILE)
  const contracts = docs.filter((d) => d.entity_type === 'contract')
  if (actor.role === 'admin') {
    return contracts.map((c) => ({ ...c, lifecycle_status: normalizeContractLifecycle(c) }))
  }
  return contracts
    .filter((c) => c.uploaded_by === actor.id || c.buyer_id === actor.id || c.factory_id === actor.id)
    .map((c) => ({ ...c, lifecycle_status: normalizeContractLifecycle(c) }))
}

export async function updateContractSignatures(contractId, patch = {}, actor) {
  const docs = await readJson(FILE)
  const idx = docs.findIndex((d) => d.id === contractId && d.entity_type === 'contract')
  if (idx < 0) return null
  const existing = docs[idx]
  if (actor.role !== 'admin' && ![existing.uploaded_by, existing.buyer_id, existing.factory_id].includes(actor.id)) {
    return 'forbidden'
  }

  const next = {
    ...existing,
    is_draft: patch.is_draft !== undefined ? Boolean(patch.is_draft) : existing.is_draft,
    buyer_signature_state: patch.buyer_signature_state !== undefined
      ? sanitizeSignatureState(patch.buyer_signature_state, existing.buyer_signature_state)
      : existing.buyer_signature_state,
    factory_signature_state: patch.factory_signature_state !== undefined
      ? sanitizeSignatureState(patch.factory_signature_state, existing.factory_signature_state)
      : existing.factory_signature_state,
    updated_at: toIsoNow(),
  }

  next.lifecycle_status = normalizeContractLifecycle(next)
  docs[idx] = next
  await writeJson(FILE, docs)
  return next
}

export async function updateContractArtifact(contractId, patch = {}, actor) {
  const docs = await readJson(FILE)
  const idx = docs.findIndex((d) => d.id === contractId && d.entity_type === 'contract')
  if (idx < 0) return null
  const existing = docs[idx]
  if (actor.role !== 'admin' && ![existing.uploaded_by, existing.buyer_id, existing.factory_id].includes(actor.id)) {
    return 'forbidden'
  }

  const artifactStatus = patch.status !== undefined
    ? sanitizeArtifactState(patch.status, existing.artifact?.status || 'draft')
    : (existing.artifact?.status || 'draft')

  const next = {
    ...existing,
    is_draft: artifactStatus === 'draft' ? existing.is_draft : false,
    artifact: {
      pdf_path: patch.pdf_path !== undefined ? sanitizeString(patch.pdf_path, 400) : (existing.artifact?.pdf_path || ''),
      pdf_hash: patch.pdf_hash !== undefined ? sanitizeString(patch.pdf_hash, 256) : (existing.artifact?.pdf_hash || ''),
      status: artifactStatus,
    },
    archived_at: artifactStatus === 'archived' ? toIsoNow() : existing.archived_at,
    updated_at: toIsoNow(),
  }

  next.lifecycle_status = normalizeContractLifecycle(next)
  docs[idx] = next
  await writeJson(FILE, docs)
  return next
}
