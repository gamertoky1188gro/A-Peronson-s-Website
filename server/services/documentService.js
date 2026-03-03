import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { canManagePartnerNetwork, canModifyContract, isAgent, isOwnerOrAdmin, scopeRecordsForUser } from '../utils/permissions.js'

const FILE = 'documents.json'

const SIGNATURE_STATES = new Set(['pending', 'signed'])
const ARTIFACT_STATES = new Set(['draft', 'generated', 'locked', 'archived'])

function toIsoNow() {
  return new Date().toISOString()
}

function normalizeContractLifecycle(contract) {
  if (contract.artifact?.status === 'archived' || contract.archived_at) return 'archived'
  if (contract.is_draft) return 'draft'
  if (
    contract.buyer_signature_state === 'signed' &&
    contract.factory_signature_state === 'signed' &&
    ['generated', 'locked'].includes(contract.artifact?.status)
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

function escapePdfText(value = '') {
  return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildSimpleContractPdf(contract) {
  const lines = [
    'A-Personson Contract Artifact',
    `Contract Number: ${contract.contract_number || contract.id}`,
    `Title: ${contract.title || 'Contract'}`,
    `Buyer: ${contract.buyer_name || 'N/A'} (${contract.buyer_id || 'N/A'})`,
    `Factory: ${contract.factory_name || 'N/A'} (${contract.factory_id || 'N/A'})`,
    `Buyer Signature Timestamp: ${contract.buyer_signed_at || 'N/A'}`,
    `Factory Signature Timestamp: ${contract.factory_signed_at || 'N/A'}`,
    `Generated At: ${toIsoNow()}`,
  ]

  const contentLines = lines.map((line, idx) => `BT /F1 12 Tf 50 ${760 - (idx * 22)} Td (${escapePdfText(line)}) Tj ET`).join('\n')
  const contentStream = `${contentLines}\n`

  const objects = []
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n')
  objects.push(`5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}endstream\nendobj\n`)

  let offset = 0
  let pdf = '%PDF-1.4\n'
  offset = Buffer.byteLength(pdf, 'utf8')
  const xrefOffsets = [0]

  for (const object of objects) {
    xrefOffsets.push(offset)
    pdf += object
    offset = Buffer.byteLength(pdf, 'utf8')
  }

  const xrefStart = offset
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (const objOffset of xrefOffsets.slice(1)) {
    pdf += `${String(objOffset).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'utf8')
}

async function generateContractArtifact(contract) {
  const generatedAt = toIsoNow()
  const generationVersion = Number(contract.artifact?.version || 0) + 1
  const pdfBuffer = buildSimpleContractPdf(contract)
  const pdfHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex')

  const uploadsDir = path.join(process.cwd(), 'server', 'uploads', 'contracts')
  await fs.mkdir(uploadsDir, { recursive: true })

  const safeContractNumber = sanitizeString(contract.contract_number || contract.id, 80).replace(/[^a-zA-Z0-9_-]/g, '_')
  const fileName = `${safeContractNumber || contract.id}-v${generationVersion}.pdf`
  const filePath = path.join(uploadsDir, fileName)
  await fs.writeFile(filePath, pdfBuffer)

  return {
    pdf_path: path.relative(process.cwd(), filePath),
    pdf_hash: pdfHash,
    status: 'generated',
    generated_at: generatedAt,
    version: generationVersion,
    signer_ids: {
      buyer_id: sanitizeString(contract.buyer_id || '', 120),
      factory_id: sanitizeString(contract.factory_id || '', 120),
    },
    signature_timestamps: {
      buyer_signed_at: contract.buyer_signed_at || '',
      factory_signed_at: contract.factory_signed_at || '',
    },
  }
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
  if (!isOwnerOrAdmin(actor) && target.uploaded_by !== actor.id) return 'forbidden'

  const next = docs.filter((d) => d.id !== docId)
  await writeJson(FILE, next)
  return true
}

export async function createDraftContract(actor, payload = {}) {
  if (isAgent(actor) || !canManagePartnerNetwork(actor)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const ownerId = actor.id
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
    buyer_signed_at: '',
    factory_signed_at: '',
    artifact: {
      pdf_path: '',
      pdf_hash: '',
      status: 'draft',
      generated_at: '',
      version: 0,
      signer_ids: {
        buyer_id: '',
        factory_id: '',
      },
      signature_timestamps: {
        buyer_signed_at: '',
        factory_signed_at: '',
      },
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
  const scoped = scopeRecordsForUser(actor, contracts, {
    idFields: ['uploaded_by', 'buyer_id', 'factory_id'],
    assignmentFields: ['assigned_agent_id', 'agent_id'],
  })

  return scoped
    .map((c) => ({ ...c, lifecycle_status: normalizeContractLifecycle(c) }))
}

export async function updateContractSignatures(contractId, patch = {}, actor) {
  const docs = await readJson(FILE)
  const idx = docs.findIndex((d) => d.id === contractId && d.entity_type === 'contract')
  if (idx < 0) return null
  const existing = docs[idx]
  if (!canModifyContract(actor, existing)) return 'forbidden'

  const nextBuyerState = patch.buyer_signature_state !== undefined
    ? sanitizeSignatureState(patch.buyer_signature_state, existing.buyer_signature_state)
    : existing.buyer_signature_state
  const nextFactoryState = patch.factory_signature_state !== undefined
    ? sanitizeSignatureState(patch.factory_signature_state, existing.factory_signature_state)
    : existing.factory_signature_state

  const next = {
    ...existing,
    is_draft: patch.is_draft !== undefined ? Boolean(patch.is_draft) : existing.is_draft,
    buyer_signature_state: nextBuyerState,
    factory_signature_state: nextFactoryState,
    buyer_signed_at: nextBuyerState === 'signed'
      ? (existing.buyer_signed_at || toIsoNow())
      : '',
    factory_signed_at: nextFactoryState === 'signed'
      ? (existing.factory_signed_at || toIsoNow())
      : '',
    updated_at: toIsoNow(),
  }

  const bothSigned = next.buyer_signature_state === 'signed' && next.factory_signature_state === 'signed'
  const hasGeneratedArtifact = Boolean(next.artifact?.generated_at && next.artifact?.pdf_hash && next.artifact?.pdf_path)
  if (bothSigned && !hasGeneratedArtifact) {
    next.artifact = await generateContractArtifact(next)
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
  if (!canModifyContract(actor, existing)) return 'forbidden'

  const artifactStatus = patch.status !== undefined
    ? sanitizeArtifactState(patch.status, existing.artifact?.status || 'draft')
    : (existing.artifact?.status || 'draft')

  const hasGeneratedArtifact = Boolean(existing.artifact?.generated_at && existing.artifact?.pdf_hash && existing.artifact?.pdf_path)
  if (['locked', 'archived'].includes(artifactStatus) && !hasGeneratedArtifact) {
    const err = new Error('Only generated artifacts can be locked or archived.')
    err.status = 400
    throw err
  }

  const next = {
    ...existing,
    is_draft: artifactStatus === 'draft' ? existing.is_draft : false,
    artifact: {
      ...(existing.artifact || {}),
      status: artifactStatus,
      pdf_path: existing.artifact?.pdf_path || '',
      pdf_hash: existing.artifact?.pdf_hash || '',
      generated_at: existing.artifact?.generated_at || '',
      version: Number(existing.artifact?.version || 0),
      signer_ids: {
        buyer_id: existing.artifact?.signer_ids?.buyer_id || '',
        factory_id: existing.artifact?.signer_ids?.factory_id || '',
      },
      signature_timestamps: {
        buyer_signed_at: existing.artifact?.signature_timestamps?.buyer_signed_at || '',
        factory_signed_at: existing.artifact?.signature_timestamps?.factory_signed_at || '',
      },
    },
    archived_at: artifactStatus === 'archived' ? toIsoNow() : existing.archived_at,
    updated_at: toIsoNow(),
  }

  next.lifecycle_status = normalizeContractLifecycle(next)
  docs[idx] = next
  await writeJson(FILE, docs)
  return next
}
