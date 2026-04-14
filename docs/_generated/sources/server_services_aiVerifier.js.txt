    1 | import { getOrgAiSettings } from './orgAiService.js'
    2 | 
    3 | export async function verifyExtraction(extracted = {}, orgOwnerId = null) {
    4 |   // Pluggable verifier: prefer remote LLM verifier if configured via env or per-org settings
    5 |   // Otherwise fall back to lightweight rule-based verification.
    6 |   try {
    7 |     let verifierUrl = process.env.AI_VERIFIER_URL || null
    8 |     let apiKey = process.env.AI_VERIFIER_API_KEY || null
    9 | 
   10 |     // allow org-level overrides from org ai settings
   11 |     if (orgOwnerId) {
   12 |       try {
   13 |         const orgSettings = await getOrgAiSettings(orgOwnerId)
   14 |         if (orgSettings && orgSettings.ai_verifier_url) verifierUrl = orgSettings.ai_verifier_url
   15 |         if (orgSettings && orgSettings.ai_verifier_api_key) apiKey = orgSettings.ai_verifier_api_key
   16 |       } catch {
   17 |         void 0
   18 |       }
   19 |     }
   20 | 
   21 |     if (verifierUrl) {
   22 |       const fetchFn = typeof fetch === 'function' ? fetch : null
   23 |       if (fetchFn) {
   24 |         const attempts = Number(process.env.AI_VERIFIER_RETRY_ATTEMPTS || 2)
   25 |         const timeoutMs = Number(process.env.AI_VERIFIER_TIMEOUT_MS || 10000)
   26 | 
   27 |         for (let attempt = 0; attempt < attempts; attempt++) {
   28 |           try {
   29 |             const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
   30 |             const signal = controller ? controller.signal : undefined
   31 |             let timer = null
   32 |             if (controller) timer = setTimeout(() => controller.abort(), timeoutMs)
   33 | 
   34 |             const resp = await fetchFn(verifierUrl, {
   35 |               method: 'POST',
   36 |               headers: {
   37 |                 'Content-Type': 'application/json',
   38 |                 ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
   39 |               },
   40 |               body: JSON.stringify({ extracted }),
   41 |               signal,
   42 |             })
   43 | 
   44 |             if (timer) clearTimeout(timer)
   45 | 
   46 |             if (resp && resp.ok) {
   47 |               const json = await resp.json()
   48 |               if (json && typeof json.verified === 'boolean') {
   49 |                 return { verified: Boolean(json.verified), score: Number(json.score || 0), notes: json.notes || 'verified_by_remote' }
   50 |               }
   51 |             }
   52 |           } catch (err) {
   53 |             // on last attempt, rethrow to be handled by outer catch
   54 |             if (attempt === attempts - 1) throw err
   55 |             // backoff small jitter
   56 |             await new Promise((r) => setTimeout(r, 100 * (attempt + 1)))
   57 |           }
   58 |         }
   59 |       }
   60 |     }
   61 |   } catch (err) {
   62 |     if (process.env.NODE_ENV !== 'test') console.debug('aiVerifier remote check failed', err?.message || err)
   63 |   }
   64 | 
   65 |   // Fallback simple rule: require product_type for basic verification
   66 |   try {
   67 |     const verified = Boolean(extracted && extracted.product_type)
   68 |     const score = verified ? 1 : 0
   69 |     return { verified, score, notes: verified ? 'Basic rule: product_type present' : 'Missing product_type' }
   70 |   } catch {
   71 |     return { verified: false, score: 0, notes: 'verifier_error' }
   72 |   }
   73 | }
   74 | 
   75 | export default { verifyExtraction }
   76 | 