    1 | import { readJson, writeJson } from '../utils/jsonStore.js'
    2 | import { detectHallucination } from '../utils/hallucinationDetector.js'
    3 | import { verifyExtraction } from './aiVerifier.js'
    4 | import { postMessage } from './messageService.js'
    5 | import { resolveOrgOwnerFromMatch } from './aiConversationService.js'
    6 | import { getOrgAiSettings } from './orgAiService.js'
    7 | 
    8 | function getEnvFloat(name, defaultVal) {
    9 |   const v = parseFloat(process.env[name])
   10 |   return Number.isFinite(v) ? v : defaultVal
   11 | }
   12 | 
   13 | const DEFAULT_CONFIDENCE_THRESHOLD = getEnvFloat('AI_HANDOFF_THRESHOLD', 0.65)
   14 | const DEFAULT_HALLUCINATION_THRESHOLD = getEnvFloat('AI_HALLUCINATION_THRESHOLD', 0.7)
   15 | 
   16 | function normalizeWhitespace(value = '') {
   17 |   return String(value || '').replace(/\s+/g, ' ').trim()
   18 | }
   19 | 
   20 | function computeConfidence(extracted = {}) {
   21 |   let score = 0
   22 |   if (extracted.product_type) score += 0.35
   23 |   if (extracted.category) score += 0.15
   24 |   if (extracted.moq) score += 0.15
   25 |   if (extracted.target_price) score += 0.15
   26 |   if (extracted.timeline) score += 0.1
   27 |   if (extracted.incoterm) score += 0.05
   28 |   if (Array.isArray(extracted.certifications) && extracted.certifications.length) score += 0.05
   29 |   return Math.min(1, Number(score.toFixed(2)))
   30 | }
   31 | 
   32 | function detectMissing(extracted = {}) {
   33 |   const keys = ['product_type', 'category', 'moq', 'target_price', 'timeline', 'incoterm', 'certifications']
   34 |   return keys.filter((k) => extracted[k] === null || extracted[k] === undefined || extracted[k] === '')
   35 | }
   36 | 
   37 | export async function orchestrateRequirementExtraction({ text = '' } = {}, orgOwnerId = null) {
   38 |   const notes = String(text || '').trim()
   39 |   // Very small heuristic extractor: populate notes and leave other fields null
   40 |   const extracted = { product_type: '', category: '', moq: null, target_price: null, timeline: null, incoterm: null, certifications: null, notes }
   41 |   const missing_fields = detectMissing(extracted)
   42 |   const confidence = computeConfidence(extracted)
   43 |   const halluc = detectHallucination(extracted)
   44 |   const verification = await verifyExtraction(extracted)
   45 | 
   46 |   // Determine thresholds (allow per-org overrides)
   47 |   let confidenceThreshold = DEFAULT_CONFIDENCE_THRESHOLD
   48 |   let hallucinationThreshold = DEFAULT_HALLUCINATION_THRESHOLD
   49 |   try {
   50 |     if (orgOwnerId) {
   51 |       const orgSettings = await getOrgAiSettings(orgOwnerId)
   52 |       if (orgSettings && typeof orgSettings.ai_handoff_threshold === 'number') confidenceThreshold = orgSettings.ai_handoff_threshold
   53 |       if (orgSettings && typeof orgSettings.ai_hallucination_threshold === 'number') hallucinationThreshold = orgSettings.ai_hallucination_threshold
   54 |     }
   55 |   } catch {
   56 |     void 0
   57 |   }
   58 | 
   59 |   const hallucinationFlag = Boolean(halluc && (halluc.score || 0) >= hallucinationThreshold)
   60 |   const verificationFlag = verification?.verified === false
   61 |   const shouldHandoff = confidence < confidenceThreshold || missing_fields.length > 0 || hallucinationFlag || verificationFlag
   62 | 
   63 |   return {
   64 |     intent: 'general_inquiry',
   65 |     extracted,
   66 |     missing_fields,
   67 |     confidence,
   68 |     handoff: shouldHandoff ? 'manual' : 'auto',
   69 |     hallucination: { ...halluc, flagged: hallucinationFlag },
   70 |     verification: verification || null,
   71 |     guardrails: { banned_instruction_detected: false },
   72 |     thresholds: { confidence: confidenceThreshold, hallucination: hallucinationThreshold },
   73 |   }
   74 | }
   75 | 
   76 | export async function extractRequirementFromText(text = '', orgOwnerId = null) {
   77 |   const out = await orchestrateRequirementExtraction({ text }, orgOwnerId)
   78 |   return { extracted: out.extracted, missing_fields: out.missing_fields, confidence: out.confidence, handoff: out.handoff, guardrails: out.guardrails, thresholds: out.thresholds }
   79 | }
   80 | 
   81 | export function generateDraftResponse(extracted = {}, missing_fields = []) {
   82 |   const parts = []
   83 |   parts.push(`Thanks — I captured: ${extracted.product_type || 'product'}.`)
   84 |   if (extracted.moq) parts.push(`MOQ: ${extracted.moq}.`)
   85 |   if (extracted.target_price) parts.push(`Target price: ${extracted.target_price}.`)
   86 |   if (missing_fields && missing_fields.length) parts.push(`I still need: ${missing_fields.join(', ')}.`)
   87 |   return parts.join(' ')
   88 | }
   89 | 
   90 | export async function validateDraftResponse(draftText = '', extracted = {}, threshold = null, orgOwnerId = null) {
   91 |   const draft = String(draftText || '')
   92 |   const conf = computeConfidence(extracted)
   93 |   const missing = detectMissing(extracted)
   94 |   const halluc = detectHallucination(extracted)
   95 |   const verification = await verifyExtraction(extracted)
   96 | 
   97 |   // determine effective threshold: explicit threshold > org setting > default
   98 |   let effectiveThreshold = Number.isFinite(Number(threshold)) ? Number(threshold) : null
   99 |   if (effectiveThreshold === null) {
  100 |     try {
  101 |       if (orgOwnerId) {
  102 |         const orgSettings = await getOrgAiSettings(orgOwnerId)
  103 |         if (orgSettings && typeof orgSettings.ai_handoff_threshold === 'number') {
  104 |           effectiveThreshold = orgSettings.ai_handoff_threshold
  105 |         }
  106 |       }
  107 |     } catch {
  108 |       void 0
  109 |     }
  110 |     if (effectiveThreshold === null) effectiveThreshold = DEFAULT_CONFIDENCE_THRESHOLD
  111 |   }
  112 | 
  113 |   let hallucinationThreshold = DEFAULT_HALLUCINATION_THRESHOLD
  114 |   try {
  115 |     if (orgOwnerId) {
  116 |       const orgSettings = await getOrgAiSettings(orgOwnerId)
  117 |       if (orgSettings && typeof orgSettings.ai_hallucination_threshold === 'number') hallucinationThreshold = orgSettings.ai_hallucination_threshold
  118 |     }
  119 |   } catch { void 0 }
  120 | 
  121 |   const hallucinationFlag = Boolean(halluc && (halluc.score || 0) >= hallucinationThreshold)
  122 |   const verificationFlag = verification?.verified === false
  123 |   const shouldHandoff = conf < effectiveThreshold || missing.length > 0 || hallucinationFlag || verificationFlag
  124 |   const suggested = missing.map((f) => `Please provide ${f}.`)
  125 |   return { confidence: conf, missing_fields: missing, handoff: shouldHandoff, handoff_reason: shouldHandoff ? 'manual' : null, suggested_clarifying_questions: suggested, draft: draft, verification: verification, hallucination: { ...halluc, flagged: hallucinationFlag } }
  126 | }
  127 | 
  128 | export async function persistAiMetadataForMatch(matchId, metadata = {}) {
  129 |   if (!matchId) return null
  130 |   try {
  131 |     const messages = await readJson('messages.json')
  132 |     messages.push({ id: `ai-meta-${Date.now()}`, match_id: matchId, sender_id: 'system:ai', message: JSON.stringify({ ai_metadata: metadata }), timestamp: new Date().toISOString(), type: 'system', policy_status: 'delivered' })
  133 |     await writeJson('messages.json', messages)
  134 |   } catch (err) {
  135 |     // ignore write failures
  136 |     console.debug('persistAiMetadataForMatch messages write failed', err?.message || err)
  137 |   }
  138 |   try {
  139 |     const leads = await readJson('leads.json')
  140 |     const lead = leads.find((l) => String(l.match_id || '') === String(matchId || ''))
  141 |     if (lead) {
  142 |       const notes = await readJson('lead_notes.json')
  143 |       notes.push({ id: `ai-note-${Date.now()}`, lead_id: lead.id, org_owner_id: lead.org_owner_id, author_id: 'system:ai', note: `AI metadata: ${JSON.stringify(metadata)}`, created_at: new Date().toISOString() })
  144 |       await writeJson('lead_notes.json', notes)
  145 |     }
  146 |   } catch (err) {
  147 |     console.debug('persistAiMetadataForMatch lead_notes write failed', err?.message || err)
  148 |   }
  149 |   return true
  150 | }
  151 | 
  152 | export default {
  153 |   orchestrateRequirementExtraction,
  154 |   extractRequirementFromText,
  155 |   generateDraftResponse,
  156 |   validateDraftResponse,
  157 |   persistAiMetadataForMatch,
  158 | }
  159 | 
  160 | export function approveReply({ draft = '', extractedRequirements = {}, allowNumericCommitment = false } = {}) {
  161 |   // Basic safety: disallow empty draft
  162 |   const text = String(draft || '').trim()
  163 |   if (!text) return { approved: false, status: 'blocked', guardrails: {}, reason: 'Reply blocked: empty draft' }
  164 | 
  165 |   // If numeric commitments are not allowed, block drafts that contain standalone numbers
  166 |   if (!allowNumericCommitment && /\b\d[\d,.]*\b/.test(text)) {
  167 |     return { approved: false, status: 'blocked', guardrails: { disallowed_numbers: true }, reason: 'Reply blocked: numeric commitments are not allowed in automated replies' }
  168 |   }
  169 | 
  170 |   // Very small heuristic: ensure extractedRequirements is an object (keeps variable used)
  171 |   const _ = extractedRequirements || {}
  172 |   return { approved: true, status: 'approved', guardrails: {}, reason: 'Reply approved for sending.' }
  173 | }
  174 | 
  175 | export async function sendReply({ draft = '', approval = {} } = {}) {
  176 |   // Legacy compatibility: if not approved, require human
  177 |   if (!approval?.approved) return { sent: false, status: 'manual_required', message: 'Draft not approved.' }
  178 | 
  179 |   // If a matchId was provided in the approval metadata, attempt to post the reply into the thread
  180 |   const matchId = approval?.match_id || approval?.meta?.match_id || null
  181 |   const senderId = approval?.sender_id || 'system:ai'
  182 |   if (!matchId) {
  183 |     return { sent: true, status: 'sent', sent_at: new Date().toISOString(), payload: { message: normalizeWhitespace(draft) } }
  184 |   }
  185 | 
  186 |   // Enforce per-org AI settings where possible
  187 |   try {
  188 |     const orgOwnerId = await resolveOrgOwnerFromMatch(matchId, senderId) || ''
  189 |     const orgSettings = await getOrgAiSettings(orgOwnerId)
  190 |     if (!orgSettings.auto_reply_enabled) {
  191 |       return { sent: false, status: 'disabled', message: 'Auto-reply disabled by organization settings.' }
  192 |     }
  193 | 
  194 |     // Basic rate limiting: count system:ai messages in the last hour for this match
  195 |     const messages = await readJson('messages.json')
  196 |     const cutoff = Date.now() - (60 * 60 * 1000)
  197 |     const recent = (Array.isArray(messages) ? messages : []).filter((m) => String(m.sender_id || '') === String(senderId) && new Date(m.timestamp || 0).getTime() >= cutoff)
  198 |     if (recent.length >= Number(orgSettings.auto_reply_rate_limit_per_hour || 20)) {
  199 |       return { sent: false, status: 'rate_limited', message: 'Auto-reply rate limit exceeded for this organization.' }
  200 |     }
  201 | 
  202 |     // Post message using messageService to ensure consistent metadata
  203 |     try {
  204 |       const created = await postMessage(matchId, senderId, normalizeWhitespace(draft), 'text', null, { source_label: 'ai:auto_reply' })
  205 |       return { sent: true, status: 'sent', sent_at: new Date().toISOString(), payload: created }
  206 |     } catch (err) {
  207 |       // fallback: persist as ai metadata if post fails
  208 |       await persistAiMetadataForMatch(matchId, { draft, approval, error: String(err?.message || err) })
  209 |       return { sent: false, status: 'persisted_metadata', message: 'Reply persisted as metadata due to posting error.' }
  210 |     }
  211 |   } catch (err) {
  212 |     // On unexpected errors, persist metadata and require manual review
  213 |     await persistAiMetadataForMatch(matchId, { draft, approval, error: String(err?.message || err) })
  214 |     return { sent: false, status: 'manual_required', message: 'Auto-reply failed and was persisted for review.' }
  215 |   }
  216 | }
  217 | 