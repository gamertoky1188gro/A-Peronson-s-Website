    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const STORE_FILE = 'order_certifications.json'
    6 | const CONTRACTS_FILE = 'documents.json'
    7 | 
    8 | function nowIso() {
    9 |   return new Date().toISOString()
   10 | }
   11 | 
   12 | function normalizeEvidence(list = []) {
   13 |   if (!Array.isArray(list)) return []
   14 |   const cleaned = list
   15 |     .map((entry) => sanitizeString(String(entry || ''), 120))
   16 |     .filter(Boolean)
   17 |   return [...new Set(cleaned)]
   18 | }
   19 | 
   20 | function normalizeStatus(value) {
   21 |   const raw = sanitizeString(String(value || ''), 40).toLowerCase()
   22 |   if (['certified', 'pending', 'revoked'].includes(raw)) return raw
   23 |   return 'pending'
   24 | }
   25 | 
   26 | function normalizeNote(value) {
   27 |   return sanitizeString(String(value || ''), 320)
   28 | }
   29 | 
   30 | function normalizeIssuedBy(value) {
   31 |   return sanitizeString(String(value || ''), 120)
   32 | }
   33 | 
   34 | async function upsertOrderCertification(userId, patch = {}) {
   35 |   const id = sanitizeString(String(userId || ''), 120)
   36 |   if (!id) return null
   37 |   let updated = null
   38 | 
   39 |   await updateLocalJson(STORE_FILE, (rows = []) => {
   40 |     const next = Array.isArray(rows) ? rows : []
   41 |     const idx = next.findIndex((row) => String(row?.user_id || '') === id)
   42 |     const incomingEvidence = patch.evidence_contract_ids !== undefined
   43 |       ? normalizeEvidence(patch.evidence_contract_ids)
   44 |       : null
   45 |     const issuedBy = patch.issued_by !== undefined ? normalizeIssuedBy(patch.issued_by) : null
   46 |     const note = patch.note !== undefined ? normalizeNote(patch.note) : null
   47 |     const status = patch.status !== undefined ? normalizeStatus(patch.status) : null
   48 | 
   49 |     if (idx < 0) {
   50 |       const created = {
   51 |         user_id: id,
   52 |         status: status || 'pending',
   53 |         issued_at: patch.issued_at || null,
   54 |         issued_by: issuedBy || null,
   55 |         evidence_contract_ids: incomingEvidence || [],
   56 |         note: note || '',
   57 |         created_at: nowIso(),
   58 |         updated_at: nowIso(),
   59 |       }
   60 |       next.push(created)
   61 |       updated = created
   62 |       return next
   63 |     }
   64 | 
   65 |     const current = next[idx]
   66 |     const mergedEvidence = incomingEvidence
   67 |       ? normalizeEvidence([...(current.evidence_contract_ids || []), ...incomingEvidence])
   68 |       : normalizeEvidence(current.evidence_contract_ids || [])
   69 |     updated = {
   70 |       ...current,
   71 |       status: status || current.status || 'pending',
   72 |       issued_at: patch.issued_at !== undefined ? patch.issued_at : (current.issued_at || null),
   73 |       issued_by: issuedBy !== null ? issuedBy : (current.issued_by || null),
   74 |       evidence_contract_ids: mergedEvidence,
   75 |       note: note !== null ? note : (current.note || ''),
   76 |       updated_at: nowIso(),
   77 |     }
   78 |     next[idx] = updated
   79 |     return next
   80 |   }, [])
   81 | 
   82 |   return updated
   83 | }
   84 | 
   85 | export async function listOrderCertifications({ status } = {}) {
   86 |   const rows = await readLocalJson(STORE_FILE, [])
   87 |   const list = Array.isArray(rows) ? rows : []
   88 |   const normalizedStatus = status ? normalizeStatus(status) : ''
   89 |   if (!normalizedStatus) return list
   90 |   return list.filter((row) => normalizeStatus(row?.status) === normalizedStatus)
   91 | }
   92 | 
   93 | export async function getOrderCertification(userId) {
   94 |   const id = sanitizeString(String(userId || ''), 120)
   95 |   if (!id) return null
   96 |   const rows = await readLocalJson(STORE_FILE, [])
   97 |   const list = Array.isArray(rows) ? rows : []
   98 |   return list.find((row) => String(row?.user_id || '') === id) || null
   99 | }
  100 | 
  101 | export async function getOrderCertificationSummary(userId) {
  102 |   const id = sanitizeString(String(userId || ''), 120)
  103 |   if (!id) return null
  104 |   const [record, docs] = await Promise.all([
  105 |     getOrderCertification(id),
  106 |     readJson(CONTRACTS_FILE),
  107 |   ])
  108 | 
  109 |   const contracts = Array.isArray(docs) ? docs : []
  110 |   const signedContracts = contracts.filter((doc) => {
  111 |     if (String(doc.entity_type || '').toLowerCase() !== 'contract') return false
  112 |     if (String(doc.lifecycle_status || '').toLowerCase() !== 'signed') return false
  113 |     return String(doc.buyer_id || '') === id || String(doc.factory_id || '') === id
  114 |   }).length
  115 | 
  116 |   return {
  117 |     user_id: id,
  118 |     status: normalizeStatus(record?.status),
  119 |     issued_at: record?.issued_at || null,
  120 |     issued_by: record?.issued_by || null,
  121 |     evidence_contract_ids: normalizeEvidence(record?.evidence_contract_ids || []),
  122 |     note: record?.note || '',
  123 |     signed_contracts: signedContracts,
  124 |   }
  125 | }
  126 | 
  127 | export async function approveOrderCertification(userId, { issuedBy, evidenceContractIds, note } = {}) {
  128 |   return upsertOrderCertification(userId, {
  129 |     status: 'certified',
  130 |     issued_at: nowIso(),
  131 |     issued_by: issuedBy,
  132 |     evidence_contract_ids: evidenceContractIds,
  133 |     note,
  134 |   })
  135 | }
  136 | 
  137 | export async function revokeOrderCertification(userId, { issuedBy, note } = {}) {
  138 |   return upsertOrderCertification(userId, {
  139 |     status: 'revoked',
  140 |     issued_by: issuedBy,
  141 |     note,
  142 |   })
  143 | }
  144 | 
  145 | export async function addOrderCertificationEvidence(userId, evidenceContractIds = [], { issuedBy, note } = {}) {
  146 |   return upsertOrderCertification(userId, {
  147 |     status: 'pending',
  148 |     issued_by: issuedBy,
  149 |     evidence_contract_ids: evidenceContractIds,
  150 |     note,
  151 |   })
  152 | }
  153 | 
  154 | export async function recordCertificationEvidenceFromContract(contract) {
  155 |   if (!contract || String(contract.entity_type || '').toLowerCase() !== 'contract') return []
  156 |   const status = String(contract.lifecycle_status || '').toLowerCase()
  157 |   if (status !== 'signed') return []
  158 | 
  159 |   const buyerId = sanitizeString(String(contract.buyer_id || ''), 120)
  160 |   const factoryId = sanitizeString(String(contract.factory_id || ''), 120)
  161 |   const contractId = sanitizeString(String(contract.id || ''), 120)
  162 |   if (!contractId) return []
  163 | 
  164 |   const updated = []
  165 |   if (buyerId) {
  166 |     updated.push(await addOrderCertificationEvidence(buyerId, [contractId], { note: 'Signed contract evidence' }))
  167 |   }
  168 |   if (factoryId && factoryId !== buyerId) {
  169 |     updated.push(await addOrderCertificationEvidence(factoryId, [contractId], { note: 'Signed contract evidence' }))
  170 |   }
  171 |   return updated.filter(Boolean)
  172 | }
  173 | 
  174 | export async function getOrderCertificationMap() {
  175 |   const rows = await readLocalJson(STORE_FILE, [])
  176 |   const list = Array.isArray(rows) ? rows : []
  177 |   return new Map(list.map((row) => [String(row.user_id || ''), row]))
  178 | }
  179 | 