import { getOrgAiSettings } from './orgAiService.js'

export async function verifyExtraction(extracted = {}, orgOwnerId = null) {
  // Pluggable verifier: prefer remote LLM verifier if configured via env or per-org settings
  // Otherwise fall back to lightweight rule-based verification.
  try {
    let verifierUrl = process.env.AI_VERIFIER_URL || null
    let apiKey = process.env.AI_VERIFIER_API_KEY || null

    // allow org-level overrides from org ai settings
    if (orgOwnerId) {
      try {
        const orgSettings = await getOrgAiSettings(orgOwnerId)
        if (orgSettings && orgSettings.ai_verifier_url) verifierUrl = orgSettings.ai_verifier_url
        if (orgSettings && orgSettings.ai_verifier_api_key) apiKey = orgSettings.ai_verifier_api_key
      } catch {
        void 0
      }
    }

    if (verifierUrl) {
      const fetchFn = typeof fetch === 'function' ? fetch : null
      if (fetchFn) {
        const attempts = Number(process.env.AI_VERIFIER_RETRY_ATTEMPTS || 2)
        const timeoutMs = Number(process.env.AI_VERIFIER_TIMEOUT_MS || 10000)

        for (let attempt = 0; attempt < attempts; attempt++) {
          try {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
            const signal = controller ? controller.signal : undefined
            let timer = null
            if (controller) timer = setTimeout(() => controller.abort(), timeoutMs)

            const resp = await fetchFn(verifierUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify({ extracted }),
              signal,
            })

            if (timer) clearTimeout(timer)

            if (resp && resp.ok) {
              const json = await resp.json()
              if (json && typeof json.verified === 'boolean') {
                return { verified: Boolean(json.verified), score: Number(json.score || 0), notes: json.notes || 'verified_by_remote' }
              }
            }
          } catch (err) {
            // on last attempt, rethrow to be handled by outer catch
            if (attempt === attempts - 1) throw err
            // backoff small jitter
            await new Promise((r) => setTimeout(r, 100 * (attempt + 1)))
          }
        }
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.debug('aiVerifier remote check failed', err?.message || err)
  }

  // Fallback simple rule: require product_type for basic verification
  try {
    const verified = Boolean(extracted && extracted.product_type)
    const score = verified ? 1 : 0
    return { verified, score, notes: verified ? 'Basic rule: product_type present' : 'Missing product_type' }
  } catch {
    return { verified: false, score: 0, notes: 'verifier_error' }
  }
}

export default { verifyExtraction }
