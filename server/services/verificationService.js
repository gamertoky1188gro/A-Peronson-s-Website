import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { isSubscriptionValid } from './subscriptionService.js'
import { logInfo } from '../utils/logger.js'

const FILE = 'verification.json'

const requiredByRole = {
  factory: ['company_registration', 'trade_license', 'tin_or_ein', 'authorized_person_nid', 'bank_proof', 'erc_or_eori'],
  buying_house: ['company_registration', 'trade_license', 'tin_or_ein', 'authorized_person_nid', 'bank_proof'],
  buyer: ['company_registration', 'tin_or_ein', 'bank_proof'],
}

function emptyDocs() {
  return {
    company_registration: '',
    trade_license: '',
    tin_or_ein: '',
    authorized_person_nid: '',
    bank_proof: '',
    erc_or_eori: '',
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
    ...Object.fromEntries(Object.entries(documentsPatch || {}).map(([k, v]) => [k, sanitizeString(String(v || ''), 240)])),
  }

  const required = requiredByRole[user.role] || []
  const missing_required = required.filter((key) => !docs[key])

  const record = {
    user_id: user.id,
    role: user.role,
    documents: docs,
    verified: false,
    verified_at: existing?.verified_at || '',
    subscription_valid_until: existing?.subscription_valid_until || '',
    missing_required,
    updated_at: new Date().toISOString(),
  }

  if (idx >= 0) all[idx] = record
  else all.push(record)

  await writeJson(FILE, all)
  logInfo('Verification documents updated', { user_id: user.id, missing_required: missing_required.length })
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
