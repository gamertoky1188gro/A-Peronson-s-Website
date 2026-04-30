    1 | import crypto from 'crypto'
    2 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    3 | import { logInfo, logError } from '../utils/logger.js'
    4 | import { handleSignCallback } from './eSignService.js'
    5 | 
    6 | const KEY = 'esign_webhook_failures'
    7 | const DEFAULT_INTERVAL_MS = Number(process.env.ESIGN_WEBHOOK_RETRY_INTERVAL_MS || 60_000)
    8 | const MAX_ATTEMPTS = Number(process.env.ESIGN_WEBHOOK_MAX_ATTEMPTS || 5)
    9 | const BACKOFF_BASE_MS = Number(process.env.ESIGN_WEBHOOK_RETRY_BACKOFF_MS || 10_000)
   10 | 
   11 | export async function recordFailedWebhook({ contractId, payload = {}, headers = {}, error = '' }) {
   12 |   const id = crypto.randomUUID()
   13 |   const now = Date.now()
   14 |   await updateLocalJson(KEY, (existing = []) => {
   15 |     const arr = Array.isArray(existing) ? existing.slice() : []
   16 |     arr.push({
   17 |       id,
   18 |       contractId: String(contractId || ''),
   19 |       payload: payload || {},
   20 |       headers: headers || {},
   21 |       attempts: 0,
   22 |       firstFailedAt: now,
   23 |       lastAttemptAt: now,
   24 |       lastError: String(error || ''),
   25 |     })
   26 |     return arr
   27 |   }, [])
   28 |   logInfo('esign_webhook_failure_recorded', { id, contractId })
   29 |   return id
   30 | }
   31 | 
   32 | export function startEsignWebhookRetryWorker() {
   33 |   const intervalMs = Math.max(10_000, DEFAULT_INTERVAL_MS)
   34 |   setInterval(async () => {
   35 |     try {
   36 |       const now = Date.now()
   37 |       const list = await readLocalJson(KEY, [])
   38 |       if (!Array.isArray(list) || list.length === 0) return
   39 | 
   40 |       const next = []
   41 |       for (const item of list) {
   42 |         try {
   43 |           const attempts = Number(item.attempts || 0)
   44 |           if (attempts >= MAX_ATTEMPTS) {
   45 |             logError('esign_webhook_failure_dropped', { id: item.id, contractId: item.contractId, attempts })
   46 |             continue
   47 |           }
   48 | 
   49 |           const lastAttemptAt = Number(item.lastAttemptAt || item.firstFailedAt || 0)
   50 |           const requiredDelay = BACKOFF_BASE_MS * Math.pow(2, attempts)
   51 |           if (now - lastAttemptAt < requiredDelay) {
   52 |             next.push(item)
   53 |             continue
   54 |           }
   55 | 
   56 |           // Retry by calling internal handler directly (bypasses HMAC validation)
   57 |           await handleSignCallback(item.contractId, item.payload)
   58 |           logInfo('esign_webhook_retry_success', { id: item.id, contractId: item.contractId })
   59 |         } catch (err) {
   60 |           item.attempts = Number(item.attempts || 0) + 1
   61 |           item.lastAttemptAt = now
   62 |           item.lastError = String(err?.message || err)
   63 |           logError('esign_webhook_retry_failed', { id: item.id, contractId: item.contractId, attempts: item.attempts, error: item.lastError })
   64 |           next.push(item)
   65 |         }
   66 |       }
   67 | 
   68 |       await updateLocalJson(KEY, () => next, [])
   69 |     } catch (err) {
   70 |       logError('esign_webhook_retry_worker_error', err)
   71 |     }
   72 |   }, intervalMs).unref()
   73 | 
   74 |   logInfo('esign_webhook_retry_worker_started', { intervalMs })
   75 | }
   76 | 
   77 | export default { recordFailedWebhook, startEsignWebhookRetryWorker }
   78 | 