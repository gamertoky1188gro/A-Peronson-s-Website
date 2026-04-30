    1 | import crypto from 'crypto'
    2 | import { updateLocalJson } from '../utils/localStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | const FILE = 'refund_log.json'
    6 | 
    7 | export async function recordRefund({ userId, amountUsd, reason = '', ref = '', actorId = '' }) {
    8 |   const entry = {
    9 |     id: crypto.randomUUID(),
   10 |     user_id: sanitizeString(String(userId || ''), 120),
   11 |     amount_usd: Number(amountUsd || 0),
   12 |     reason: sanitizeString(String(reason || ''), 120),
   13 |     ref: sanitizeString(String(ref || ''), 200),
   14 |     actor_id: sanitizeString(String(actorId || ''), 120),
   15 |     created_at: new Date().toISOString(),
   16 |   }
   17 | 
   18 |   await updateLocalJson(FILE, (rows) => {
   19 |     const next = Array.isArray(rows) ? rows : []
   20 |     next.push(entry)
   21 |     return next
   22 |   }, [])
   23 | 
   24 |   return entry
   25 | }
   26 | 