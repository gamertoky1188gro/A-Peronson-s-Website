import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { isSubscriptionValid } from './subscriptionService.js'
import { logInfo } from '../utils/logger.js'

const FILE = 'verification.json'

const BUYER_REGIONS = {
  EU: 'EU',
  USA: 'USA',
  OTHER: 'OTHER',
}

const requiredByRoleRegion = {
  factory: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof', 'erc'],
  buying_house: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof'],
  buyer: {
    EU: ['company_registration', 'vat', 'eori', 'bank_proof'],
    USA: ['company_registration', 'ein', 'ior', 'bank_proof'],
    OTHER: ['company_registration', 'bank_proof'],
  },
}

const fieldAliases = {
  tin: ['tin', 'tin_or_ein'],
  ein: ['ein', 'tin_or_ein'],
  erc: ['erc', 'erc_or_eori'],
  eori: ['eori', 'erc_or_eori'],
}

function emptyDocs() {
  return {
    company_registration: '',
    trade_license: '',
    tin: '',
    ein: '',
    vat: '',
    eori: '',
    ior: '',
    authorized_person_nid: '',
    bank_proof: '',
    erc: '',
    tin_or_ein: '',
    erc_or_eori: '',
    optional_licenses: [],
  }
}

function sanitizeDocsPatch(documentsPatch = {}) {
  const entries = Object.entries(documentsPatch)
  const out = {}

  for (const [key, value] of entries) {
    if (key === 'optional_licenses') {
      const values = Array.isArray(value) ? value : [value]
      out.optional_licenses = values
        .map((v) => sanitizeString(String(v || ''), 240))
        .filter(Boolean)
      continue
    }

    out[key] = sanitizeString(String(value || ''), 240)
  }

  return out
}

function normalizeBuyerRegion(rawRegion) {
  const region = sanitizeString(String(rawRegion || ''), 20).toUpperCase()
  return BUYER_REGIONS[region] || BUYER_REGIONS.OTHER
}

function getRequiredFields(role, buyerRegion) {
  if (role !== 'buyer') return requiredByRoleRegion[role] || []
  return requiredByRoleRegion.buyer[buyerRegion] || requiredByRoleRegion.buyer.OTHER
}

function hasDocument(docs, field) {
  const possibleFields = fieldAliases[field] || [field]
  return possibleFields.some((name) => !!docs?.[name])
}

function buildCredibility(required, docs) {
  const completedRequired = required.filter((field) => hasDocument(docs, field)).length
  const requiredTotal = required.length
  const optionalLicenses = Array.isArray(docs?.optional_licenses) ? docs.optional_licenses.filter(Boolean) : []
  const requiredCompletionPct = requiredTotal > 0 ? (completedRequired / requiredTotal) * 100 : 100

  const requiredScore = requiredCompletionPct * 0.85
  const optionalScore = Math.min(optionalLicenses.length, 5) * 3
  const score = Math.min(100, Math.round(requiredScore + optionalScore))

  let badge = 'Basic credibility'
  if (score >= 90) badge = 'High credibility'
  else if (score >= 70) badge = 'Strong credibility'
  else if (score >= 40) badge = 'Moderate credibility'

  return {
    score,
    badge,
    completeness: `${completedRequired}/${requiredTotal} required documents submitted`,
    required_completed: completedRequired,
    required_total: requiredTotal,
    optional_licenses_count: optionalLicenses.length,
  }
}

export async function getVerification(userId) {
  const all = await readJson(FILE)
  return all.find((v) => v.user_id === userId) || null
}

export async function upsertVerification(user, documentsPatch) {
  const all = await readJson(FILE)
  const idx = all.findIndex((v) => v.user_id === user.id)
  const existing = idx >= 0 ? all[idx] : null

  const docs = {
    ...(existing?.documents || emptyDocs()),
    ...sanitizeDocsPatch(documentsPatch || {}),
  }

  const buyerRegion = user.role === 'buyer'
    ? normalizeBuyerRegion(documentsPatch?.buyer_region || existing?.buyer_region)
    : ''

  const required = getRequiredFields(user.role, buyerRegion)
  const missing_required = required.filter((key) => !hasDocument(docs, key))
  const credibility = buildCredibility(required, docs)

  const record = {
    user_id: user.id,
    role: user.role,
    buyer_region: buyerRegion,
    documents: docs,
    verified: false,
    verified_at: existing?.verified_at || '',
    subscription_valid_until: existing?.subscription_valid_until || '',
    missing_required,
    credibility,
    updated_at: new Date().toISOString(),
  }

  if (idx >= 0) all[idx] = record
  else all.push(record)

  await writeJson(FILE, all)
  logInfo('Verification documents updated', {
    user_id: user.id,
    buyer_region: buyerRegion,
    missing_required: missing_required.length,
    credibility_score: credibility.score,
  })
  return record
}

export async function adminApproveVerification(userId) {
  const all = await readJson(FILE)
  const idx = all.findIndex((v) => v.user_id === userId)
  if (idx < 0) return null

  const validSub = await isSubscriptionValid(userId)
  if (!validSub) {
    all[idx].verified = false
    all[idx].missing_required = [...(all[idx].missing_required || []), 'premium_subscription_required_for_verification']
    await writeJson(FILE, all)
    return all[idx]
  }

  if ((all[idx].missing_required || []).length > 0) {
    all[idx].verified = false
    await writeJson(FILE, all)
    return all[idx]
  }

  all[idx].verified = true
  all[idx].verified_at = new Date().toISOString()
  all[idx].subscription_valid_until = (await readJson('subscriptions.json')).find((s) => s.user_id === userId)?.end_date || ''
  await writeJson(FILE, all)
  logInfo('Verification approved', { user_id: userId })
  return all[idx]
}

export async function revokeExpiredVerifications() {
  const all = await readJson(FILE)
  const subs = await readJson('subscriptions.json')
  let changed = false

  for (const rec of all) {
    const sub = subs.find((s) => s.user_id === rec.user_id)
    const active = sub && new Date(sub.end_date).getTime() > Date.now()
    if (!active && rec.verified) {
      rec.verified = false
      rec.subscription_valid_until = sub?.end_date || ''
      changed = true
    }
  }

  if (changed) await writeJson(FILE, all)
  return all
}
