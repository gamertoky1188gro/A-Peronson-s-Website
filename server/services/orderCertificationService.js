import { readJson } from '../utils/jsonStore.js'
import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
import { sanitizeString } from '../utils/validators.js'

const STORE_FILE = 'order_certifications.json'
const CONTRACTS_FILE = 'documents.json'

function nowIso() {
  return new Date().toISOString()
}

function normalizeEvidence(list = []) {
  if (!Array.isArray(list)) return []
  const cleaned = list
    .map((entry) => sanitizeString(String(entry || ''), 120))
    .filter(Boolean)
  return [...new Set(cleaned)]
}

function normalizeStatus(value) {
  const raw = sanitizeString(String(value || ''), 40).toLowerCase()
  if (['certified', 'pending', 'revoked'].includes(raw)) return raw
  return 'pending'
}

function normalizeNote(value) {
  return sanitizeString(String(value || ''), 320)
}

function normalizeIssuedBy(value) {
  return sanitizeString(String(value || ''), 120)
}

async function upsertOrderCertification(userId, patch = {}) {
  const id = sanitizeString(String(userId || ''), 120)
  if (!id) return null
  let updated = null

  await updateLocalJson(STORE_FILE, (rows = []) => {
    const next = Array.isArray(rows) ? rows : []
    const idx = next.findIndex((row) => String(row?.user_id || '') === id)
    const incomingEvidence = patch.evidence_contract_ids !== undefined
      ? normalizeEvidence(patch.evidence_contract_ids)
      : null
    const issuedBy = patch.issued_by !== undefined ? normalizeIssuedBy(patch.issued_by) : null
    const note = patch.note !== undefined ? normalizeNote(patch.note) : null
    const status = patch.status !== undefined ? normalizeStatus(patch.status) : null

    if (idx < 0) {
      const created = {
        user_id: id,
        status: status || 'pending',
        issued_at: patch.issued_at || null,
        issued_by: issuedBy || null,
        evidence_contract_ids: incomingEvidence || [],
        note: note || '',
        created_at: nowIso(),
        updated_at: nowIso(),
      }
      next.push(created)
      updated = created
      return next
    }

    const current = next[idx]
    const mergedEvidence = incomingEvidence
      ? normalizeEvidence([...(current.evidence_contract_ids || []), ...incomingEvidence])
      : normalizeEvidence(current.evidence_contract_ids || [])
    updated = {
      ...current,
      status: status || current.status || 'pending',
      issued_at: patch.issued_at !== undefined ? patch.issued_at : (current.issued_at || null),
      issued_by: issuedBy !== null ? issuedBy : (current.issued_by || null),
      evidence_contract_ids: mergedEvidence,
      note: note !== null ? note : (current.note || ''),
      updated_at: nowIso(),
    }
    next[idx] = updated
    return next
  }, [])

  return updated
}

export async function listOrderCertifications({ status } = {}) {
  const rows = await readLocalJson(STORE_FILE, [])
  const list = Array.isArray(rows) ? rows : []
  const normalizedStatus = status ? normalizeStatus(status) : ''
  if (!normalizedStatus) return list
  return list.filter((row) => normalizeStatus(row?.status) === normalizedStatus)
}

export async function getOrderCertification(userId) {
  const id = sanitizeString(String(userId || ''), 120)
  if (!id) return null
  const rows = await readLocalJson(STORE_FILE, [])
  const list = Array.isArray(rows) ? rows : []
  return list.find((row) => String(row?.user_id || '') === id) || null
}

export async function getOrderCertificationSummary(userId) {
  const id = sanitizeString(String(userId || ''), 120)
  if (!id) return null
  const [record, docs] = await Promise.all([
    getOrderCertification(id),
    readJson(CONTRACTS_FILE),
  ])

  const contracts = Array.isArray(docs) ? docs : []
  const signedContracts = contracts.filter((doc) => {
    if (String(doc.entity_type || '').toLowerCase() !== 'contract') return false
    if (String(doc.lifecycle_status || '').toLowerCase() !== 'signed') return false
    return String(doc.buyer_id || '') === id || String(doc.factory_id || '') === id
  }).length

  return {
    user_id: id,
    status: normalizeStatus(record?.status),
    issued_at: record?.issued_at || null,
    issued_by: record?.issued_by || null,
    evidence_contract_ids: normalizeEvidence(record?.evidence_contract_ids || []),
    note: record?.note || '',
    signed_contracts: signedContracts,
  }
}

export async function approveOrderCertification(userId, { issuedBy, evidenceContractIds, note } = {}) {
  return upsertOrderCertification(userId, {
    status: 'certified',
    issued_at: nowIso(),
    issued_by: issuedBy,
    evidence_contract_ids: evidenceContractIds,
    note,
  })
}

export async function revokeOrderCertification(userId, { issuedBy, note } = {}) {
  return upsertOrderCertification(userId, {
    status: 'revoked',
    issued_by: issuedBy,
    note,
  })
}

export async function addOrderCertificationEvidence(userId, evidenceContractIds = [], { issuedBy, note } = {}) {
  return upsertOrderCertification(userId, {
    status: 'pending',
    issued_by: issuedBy,
    evidence_contract_ids: evidenceContractIds,
    note,
  })
}

export async function recordCertificationEvidenceFromContract(contract) {
  if (!contract || String(contract.entity_type || '').toLowerCase() !== 'contract') return []
  const status = String(contract.lifecycle_status || '').toLowerCase()
  if (status !== 'signed') return []

  const buyerId = sanitizeString(String(contract.buyer_id || ''), 120)
  const factoryId = sanitizeString(String(contract.factory_id || ''), 120)
  const contractId = sanitizeString(String(contract.id || ''), 120)
  if (!contractId) return []

  const updated = []
  if (buyerId) {
    updated.push(await addOrderCertificationEvidence(buyerId, [contractId], { note: 'Signed contract evidence' }))
  }
  if (factoryId && factoryId !== buyerId) {
    updated.push(await addOrderCertificationEvidence(factoryId, [contractId], { note: 'Signed contract evidence' }))
  }
  return updated.filter(Boolean)
}

export async function getOrderCertificationMap() {
  const rows = await readLocalJson(STORE_FILE, [])
  const list = Array.isArray(rows) ? rows : []
  return new Map(list.map((row) => [String(row.user_id || ''), row]))
}
