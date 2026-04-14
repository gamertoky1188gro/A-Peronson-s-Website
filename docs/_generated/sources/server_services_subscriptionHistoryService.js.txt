    1 | import crypto from 'crypto'
    2 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const FILE = 'subscription_history.json'
    6 | 
    7 | function nowIso() {
    8 |   return new Date().toISOString()
    9 | }
   10 | 
   11 | export async function listSubscriptionHistory({ userId } = {}) {
   12 |   const rows = await readLocalJson(FILE, [])
   13 |   const filtered = userId
   14 |     ? rows.filter((row) => String(row.user_id) === String(userId))
   15 |     : rows
   16 |   return filtered.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
   17 | }
   18 | 
   19 | export async function recordSubscriptionEvent({
   20 |   userId,
   21 |   plan,
   22 |   previousPlan,
   23 |   action,
   24 |   actorId,
   25 |   source = 'system',
   26 |   note = '',
   27 | }) {
   28 |   const entry = {
   29 |     id: crypto.randomUUID(),
   30 |     user_id: sanitizeString(String(userId || ''), 120),
   31 |     plan: sanitizeString(String(plan || ''), 40),
   32 |     previous_plan: sanitizeString(String(previousPlan || ''), 40),
   33 |     action: sanitizeString(String(action || ''), 80),
   34 |     actor_id: sanitizeString(String(actorId || ''), 120),
   35 |     source: sanitizeString(String(source || ''), 80),
   36 |     note: sanitizeString(String(note || ''), 240),
   37 |     created_at: nowIso(),
   38 |   }
   39 | 
   40 |   await updateLocalJson(FILE, (rows) => {
   41 |     const next = Array.isArray(rows) ? rows : []
   42 |     next.push(entry)
   43 |     return next
   44 |   }, [])
   45 | 
   46 |   return entry
   47 | }
   48 | 