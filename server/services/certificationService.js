import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const CERT_FILE = 'certifications.json'
const DOCS_FILE = 'documents.json'

function nowIso() {
  return new Date().toISOString()
}

export async function ensureCertificationForContract(contract) {
  if (!contract || contract.entity_type !== 'contract') return null
  const status = String(contract.lifecycle_status || '').toLowerCase()
  if (status !== 'signed') return null

  const certs = await readJson(CERT_FILE)
  const rows = Array.isArray(certs) ? certs : []
  const existing = rows.find((c) => String(c.contract_id) === String(contract.id || ''))
  if (existing) return existing

  const entry = {
    id: crypto.randomUUID(),
    contract_id: sanitizeString(String(contract.id || ''), 120),
    buyer_id: sanitizeString(String(contract.buyer_id || ''), 120),
    factory_id: sanitizeString(String(contract.factory_id || ''), 120),
    status: 'certified',
    issued_at: nowIso(),
  }
  rows.push(entry)
  await writeJson(CERT_FILE, rows)
  return entry
}

export async function listCertificationsForOrg(orgId) {
  const certs = await readJson(CERT_FILE)
  const rows = Array.isArray(certs) ? certs : []
  return rows.filter((c) => String(c.factory_id || '') === String(orgId || '') || String(c.buyer_id || '') === String(orgId || ''))
}

export async function getCertificationSummary(orgId) {
  const contracts = await readJson(DOCS_FILE)
  const rows = Array.isArray(contracts) ? contracts : []
  const orgContracts = rows.filter((d) => d.entity_type === 'contract' && (String(d.factory_id || '') === String(orgId || '') || String(d.buyer_id || '') === String(orgId || '')))
  const signed = orgContracts.filter((c) => String(c.lifecycle_status || '').toLowerCase() === 'signed')
  const status = signed.length ? 'certified' : 'pending'
  return {
    org_id: orgId,
    status,
    signed_contracts: signed.length,
  }
}
