import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const USERS_FILE = 'users.json'
const HISTORY_FILE = 'wallet_history.json'

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

export async function debitWallet({ userId, amountUsd, reason = '', ref = '', metadata = {} }) {
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
  if (currentBalance < amount) {
    const err = new Error(`Insufficient wallet balance. Needed $${amount.toFixed(2)}.`)
    err.status = 402
    err.code = 'WALLET_INSUFFICIENT'
    err.balance_usd = currentBalance
    throw err
  }

  const nextBalance = Math.round((currentBalance - amount) * 100) / 100
  users[idx] = { ...users[idx], wallet_balance_usd: nextBalance, wallet_updated_at: new Date().toISOString() }
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
    meta: metadata && typeof metadata === 'object' ? metadata : {},
    created_at: new Date().toISOString(),
  }
  rows.push(row)
  await writeJson(HISTORY_FILE, rows)

  return { wallet: { user_id: users[idx].id, balance_usd: nextBalance }, entry: row }
}

