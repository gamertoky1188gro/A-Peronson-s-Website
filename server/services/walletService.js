import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const USERS_FILE = 'users.json'
const HISTORY_FILE = 'wallet_history.json'
const COUPON_CODES_FILE = 'coupon_codes.json'
const COUPON_REDEMPTIONS_FILE = 'coupon_redemptions.json'

function toAmount(value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return 0
  return Math.round(num * 100) / 100
}

export async function getWallet(userId) {
  const users = await readJson(USERS_FILE)
  const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(userId || '')) : null
  if (!user) return null
  return {
    user_id: user.id,
    balance_usd: Math.round(Number(user.wallet_balance_usd || 0) * 100) / 100,
    restricted_balance_usd: Math.round(Number(user.wallet_restricted_usd || 0) * 100) / 100,
  }
}

export async function listWalletHistory(userId, limit = 50) {
  const history = await readJson(HISTORY_FILE)
  const rows = Array.isArray(history) ? history : []
  const filtered = rows
    .filter((r) => String(r.user_id) === String(userId || ''))
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  return filtered.slice(0, Math.max(1, Math.min(200, Number(limit) || 50)))
}

export async function debitWallet({ userId, amountUsd, reason = '', ref = '', metadata = {}, allowRestricted = false }) {
  const amount = toAmount(amountUsd)
  if (!amount) {
    const err = new Error('Invalid amount')
    err.status = 400
    throw err
  }

  const users = await readJson(USERS_FILE)
  const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
  if (idx < 0) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }

  const currentBalance = Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100
  const currentRestricted = Math.round(Number(users[idx].wallet_restricted_usd || 0) * 100) / 100
  const available = allowRestricted ? currentBalance + currentRestricted : currentBalance
  if (available < amount) {
    const err = new Error(`Insufficient wallet balance. Needed $${amount.toFixed(2)}.`)
    err.status = 402
    err.code = 'WALLET_INSUFFICIENT'
    err.balance_usd = currentBalance
    err.restricted_balance_usd = currentRestricted
    throw err
  }

  let restrictedUsed = 0
  let unrestrictedUsed = amount
  if (allowRestricted && currentRestricted > 0) {
    restrictedUsed = Math.min(currentRestricted, amount)
    unrestrictedUsed = Math.max(0, amount - restrictedUsed)
  }

  const nextRestricted = Math.round((currentRestricted - restrictedUsed) * 100) / 100
  const nextBalance = Math.round((currentBalance - unrestrictedUsed) * 100) / 100
  users[idx] = {
    ...users[idx],
    wallet_balance_usd: nextBalance,
    wallet_restricted_usd: nextRestricted,
    wallet_updated_at: new Date().toISOString(),
  }
  await writeJson(USERS_FILE, users)

  const history = await readJson(HISTORY_FILE)
  const rows = Array.isArray(history) ? history : []
  const row = {
    id: crypto.randomUUID(),
    user_id: users[idx].id,
    kind: 'debit',
    amount_usd: amount,
    balance_after_usd: nextBalance,
    reason: sanitizeString(String(reason || ''), 80),
    ref: sanitizeString(String(ref || ''), 160),
    meta: metadata && typeof metadata === 'object'
      ? { ...metadata, restricted_used_usd: restrictedUsed, restricted_balance_after_usd: nextRestricted }
      : { restricted_used_usd: restrictedUsed, restricted_balance_after_usd: nextRestricted },
    created_at: new Date().toISOString(),
  }
  rows.push(row)
  await writeJson(HISTORY_FILE, rows)

  return { wallet: { user_id: users[idx].id, balance_usd: nextBalance, restricted_balance_usd: nextRestricted }, entry: row }
}

function normalizeCouponCode(code = '') {
  return sanitizeString(String(code || ''), 80).trim().toUpperCase()
}

function nowIso() {
  return new Date().toISOString()
}

function isExpired(expiresAt) {
  if (!expiresAt) return false
  const ts = new Date(expiresAt).getTime()
  if (!Number.isFinite(ts)) return false
  return ts < Date.now()
}

export async function assertCouponRedeemable(code, userId = '') {
  const normalized = normalizeCouponCode(code)
  if (!normalized) {
    const err = new Error('Coupon code is required')
    err.status = 400
    throw err
  }

  const [codes, redemptions] = await Promise.all([
    readJson(COUPON_CODES_FILE),
    readJson(COUPON_REDEMPTIONS_FILE),
  ])

  const coupon = (Array.isArray(codes) ? codes : []).find((row) => String(row.code || '').toUpperCase() === normalized)
  if (!coupon || !coupon.active) {
    const err = new Error('Invalid or inactive coupon code')
    err.status = 404
    throw err
  }
  if (isExpired(coupon.expires_at)) {
    const err = new Error('Coupon code has expired')
    err.status = 410
    throw err
  }

  const allRedemptions = Array.isArray(redemptions) ? redemptions : []
  if (coupon.max_redemptions && allRedemptions.filter((r) => r.code_id === coupon.id).length >= coupon.max_redemptions) {
    const err = new Error('Coupon code has reached its redemption limit')
    err.status = 409
    throw err
  }

  if (userId) {
    const already = allRedemptions.some((r) => r.code_id === coupon.id && String(r.user_id) === String(userId))
    if (already) {
      const err = new Error('Coupon code already redeemed')
      err.status = 409
      throw err
    }
  }

  return coupon
}

export async function redeemCouponForUser({ userId, code }) {
  const normalized = normalizeCouponCode(code)
  const coupon = await assertCouponRedeemable(normalized, userId)
  const amount = toAmount(coupon.amount_usd || 0)
  if (!amount) {
    const err = new Error('Coupon amount is invalid')
    err.status = 400
    throw err
  }

  const users = await readJson(USERS_FILE)
  const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
  if (idx < 0) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }

  const currentRestricted = Math.round(Number(users[idx].wallet_restricted_usd || 0) * 100) / 100
  const nextRestricted = Math.round((currentRestricted + amount) * 100) / 100
  users[idx] = { ...users[idx], wallet_restricted_usd: nextRestricted, wallet_updated_at: nowIso() }
  await writeJson(USERS_FILE, users)

  const redemptions = await readJson(COUPON_REDEMPTIONS_FILE)
  const nextRedemptions = Array.isArray(redemptions) ? redemptions : []
  const redemption = {
    id: crypto.randomUUID(),
    code_id: coupon.id,
    user_id: users[idx].id,
    amount_usd: amount,
    redeemed_at: nowIso(),
  }
  nextRedemptions.push(redemption)
  await writeJson(COUPON_REDEMPTIONS_FILE, nextRedemptions)

  const history = await readJson(HISTORY_FILE)
  const rows = Array.isArray(history) ? history : []
  const historyRow = {
    id: crypto.randomUUID(),
    user_id: users[idx].id,
    kind: 'credit',
    amount_usd: amount,
    balance_after_usd: Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100,
    reason: 'coupon_redeem',
    ref: `coupon:${coupon.code}`,
    meta: { restricted_credit: true, restricted_balance_after_usd: nextRestricted },
    created_at: nowIso(),
  }
  rows.push(historyRow)
  await writeJson(HISTORY_FILE, rows)

  return {
    wallet: {
      user_id: users[idx].id,
      balance_usd: Math.round(Number(users[idx].wallet_balance_usd || 0) * 100) / 100,
      restricted_balance_usd: nextRestricted,
    },
    redemption,
  }
}
