    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { debitWallet } from './walletService.js'
    5 | import { trackEvent } from './eventTrackingService.js'
    6 | 
    7 | const FILE = 'boosts.json'
    8 | 
    9 | const DEFAULTS = {
   10 |   durationDays: Number(process.env.BOOST_DEFAULT_DURATION_DAYS || 7),
   11 |   multiplier: Number(process.env.BOOST_DEFAULT_MULTIPLIER || 1.5),
   12 |   priceUsd: Number(process.env.BOOST_DEFAULT_PRICE_USD || 9.99),
   13 | }
   14 | 
   15 | const ALLOWED_SCOPES = new Set(['feed', 'profile'])
   16 | 
   17 | function nowIso() {
   18 |   return new Date().toISOString()
   19 | }
   20 | 
   21 | function addDaysIso(days) {
   22 |   const safeDays = Number(days) > 0 ? Number(days) : DEFAULTS.durationDays
   23 |   return new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000).toISOString()
   24 | }
   25 | 
   26 | function normalizeScope(scope) {
   27 |   const value = sanitizeString(String(scope || ''), 20).toLowerCase()
   28 |   return ALLOWED_SCOPES.has(value) ? value : 'feed'
   29 | }
   30 | 
   31 | function normalizeMultiplier(multiplier) {
   32 |   const value = Number(multiplier)
   33 |   if (!Number.isFinite(value) || value <= 1) return DEFAULTS.multiplier
   34 |   return Math.min(3, Math.max(1.05, value))
   35 | }
   36 | 
   37 | function normalizePrice(priceUsd) {
   38 |   const value = Number(priceUsd)
   39 |   if (!Number.isFinite(value) || value <= 0) return DEFAULTS.priceUsd
   40 |   return Math.round(value * 100) / 100
   41 | }
   42 | 
   43 | function isActiveBoost(boost) {
   44 |   if (!boost) return false
   45 |   if (String(boost.status || '').toLowerCase() !== 'active') return false
   46 |   const now = Date.now()
   47 |   const startsAt = new Date(boost.starts_at).getTime()
   48 |   const endsAt = new Date(boost.ends_at).getTime()
   49 |   if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false
   50 |   return now >= startsAt && now <= endsAt
   51 | }
   52 | 
   53 | export async function getActiveBoostMap(scope = '') {
   54 |   const normalizedScope = scope ? normalizeScope(scope) : ''
   55 |   const boosts = await readJson(FILE)
   56 |   const rows = Array.isArray(boosts) ? boosts : []
   57 |   const activeByUser = {}
   58 | 
   59 |   rows.forEach((boost) => {
   60 |     if (!isActiveBoost(boost)) return
   61 |     if (normalizedScope && String(boost.scope || '').toLowerCase() !== normalizedScope) return
   62 |     const userId = String(boost.user_id || '')
   63 |     if (!userId) return
   64 |     const multiplier = Number(boost.multiplier || 1)
   65 |     if (!Number.isFinite(multiplier) || multiplier <= 1) return
   66 |     const current = Number(activeByUser[userId] || 1)
   67 |     if (multiplier > current) activeByUser[userId] = multiplier
   68 |   })
   69 | 
   70 |   return activeByUser
   71 | }
   72 | 
   73 | export async function listBoostsForUser(userId) {
   74 |   const boosts = await readJson(FILE)
   75 |   return boosts.filter((b) => String(b.user_id) === String(userId || ''))
   76 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   77 | }
   78 | 
   79 | export async function getActiveBoostsForUser(userId, scope = '') {
   80 |   const normalizedScope = scope ? normalizeScope(scope) : ''
   81 |   const boosts = await listBoostsForUser(userId)
   82 |   return boosts.filter((b) => {
   83 |     if (normalizedScope && String(b.scope || '').toLowerCase() !== normalizedScope) return false
   84 |     return isActiveBoost(b)
   85 |   })
   86 | }
   87 | 
   88 | export async function getActiveBoostMultiplier(userId, scope = '') {
   89 |   const active = await getActiveBoostsForUser(userId, scope)
   90 |   if (!active.length) return 1
   91 |   const maxMultiplier = active.reduce((acc, b) => Math.max(acc, Number(b.multiplier || 1)), 1)
   92 |   return Number.isFinite(maxMultiplier) && maxMultiplier > 1 ? maxMultiplier : 1
   93 | }
   94 | 
   95 | export async function purchaseBoost(userId, payload = {}) {
   96 |   const boosts = await readJson(FILE)
   97 |   const scope = normalizeScope(payload.scope)
   98 |   const durationDays = Number(payload.duration_days || payload.durationDays || DEFAULTS.durationDays)
   99 |   const multiplier = normalizeMultiplier(payload.multiplier)
  100 |   const priceUsd = normalizePrice(payload.price_usd)
  101 | 
  102 |   const hasActive = boosts.some((b) =>
  103 |     String(b.user_id) === String(userId || '')
  104 |     && String(b.scope || '').toLowerCase() === scope
  105 |     && isActiveBoost(b)
  106 |   )
  107 |   if (hasActive) return 'active_exists'
  108 | 
  109 |   await debitWallet({
  110 |     userId,
  111 |     amountUsd: priceUsd,
  112 |     reason: 'boost_purchase',
  113 |     ref: `boost:${scope}`,
  114 |     metadata: { scope, multiplier, duration_days: durationDays },
  115 |   })
  116 | 
  117 |   const now = nowIso()
  118 |   const row = {
  119 |     id: crypto.randomUUID(),
  120 |     user_id: String(userId),
  121 |     scope,
  122 |     multiplier,
  123 |     status: 'active',
  124 |     starts_at: now,
  125 |     ends_at: addDaysIso(durationDays),
  126 |     price_usd: priceUsd,
  127 |     created_at: now,
  128 |     cancelled_at: null,
  129 |   }
  130 | 
  131 |   boosts.push(row)
  132 |   await writeJson(FILE, boosts)
  133 | 
  134 |   await trackEvent({
  135 |     type: 'boost_purchase',
  136 |     actor_id: String(userId),
  137 |     entity_id: row.id,
  138 |     metadata: { scope, multiplier, duration_days: durationDays, price_usd: priceUsd },
  139 |   })
  140 | 
  141 |   return row
  142 | }
  143 | 
  144 | export async function cancelBoost(userId, boostId) {
  145 |   const boosts = await readJson(FILE)
  146 |   const idx = boosts.findIndex((b) => String(b.id) === String(boostId || ''))
  147 |   if (idx < 0) return null
  148 |   if (String(boosts[idx].user_id) !== String(userId || '')) return 'forbidden'
  149 | 
  150 |   const next = {
  151 |     ...boosts[idx],
  152 |     status: 'cancelled',
  153 |     cancelled_at: nowIso(),
  154 |   }
  155 |   boosts[idx] = next
  156 |   await writeJson(FILE, boosts)
  157 | 
  158 |   await trackEvent({
  159 |     type: 'boost_cancelled',
  160 |     actor_id: String(userId),
  161 |     entity_id: next.id,
  162 |     metadata: { scope: next.scope },
  163 |   })
  164 | 
  165 |   return next
  166 | }
  167 | 
  168 | export async function expireBoosts() {
  169 |   const boosts = await readJson(FILE)
  170 |   let changed = false
  171 |   const now = Date.now()
  172 |   const next = boosts.map((b) => {
  173 |     if (String(b.status || '').toLowerCase() !== 'active') return b
  174 |     const endsAt = new Date(b.ends_at).getTime()
  175 |     if (!Number.isFinite(endsAt) || endsAt >= now) return b
  176 |     changed = true
  177 |     return { ...b, status: 'expired' }
  178 |   })
  179 | 
  180 |   if (changed) await writeJson(FILE, next)
  181 |   return next
  182 | }
  183 | 