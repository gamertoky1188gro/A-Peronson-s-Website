    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { moderateTextOrRedact } from './policyService.js'
    5 | import { createNotification } from './notificationService.js'
    6 | import { addLeadNoteForMatch } from './leadService.js'
    7 | import { getRequirementById, updateRequirement } from './requirementService.js'
    8 | import { listKnowledge } from './assistantService.js'
    9 | 
   10 | const USERS_FILE = 'users.json'
   11 | const MESSAGES_FILE = 'messages.json'
   12 | const MESSAGE_REQUESTS_FILE = 'message_requests.json'
   13 | const LEADS_FILE = 'leads.json'
   14 | 
   15 | const QUALIFICATION_FIELDS = [
   16 |   { key: 'quantity', label: 'quantity', question: 'What total quantity are you targeting?' },
   17 |   { key: 'moq', label: 'MOQ', question: 'What MOQ per color/style do you need?' },
   18 |   { key: 'price_range', label: 'price range', question: 'What target price range per unit should we plan for?' },
   19 |   { key: 'material', label: 'fabric/material', question: 'Which fabric or material do you prefer?' },
   20 |   { key: 'delivery_timeline', label: 'lead time', question: 'What delivery timeline or lead time do you need?' },
   21 |   { key: 'size_range', label: 'size range', question: 'What size range should we support?' },
   22 |   { key: 'color_pantone', label: 'colors/Pantone', question: 'Any target colors or Pantone references?' },
   23 |   { key: 'customization_capabilities', label: 'customization', question: 'Do you need customization or tech pack acceptance?' },
   24 | ]
   25 | 
   26 | function parseMarketplaceMatchId(matchId = '') {
   27 |   const parts = String(matchId || '').split(':')
   28 |   if (parts.length !== 2) return null
   29 |   const requirementId = sanitizeString(parts[0], 120)
   30 |   const factoryId = sanitizeString(parts[1], 120)
   31 |   if (!requirementId || !factoryId) return null
   32 |   return { requirementId, factoryId }
   33 | }
   34 | 
   35 | function normalizeList(value) {
   36 |   if (!value) return []
   37 |   if (Array.isArray(value)) return value.map((v) => String(v || '').trim()).filter(Boolean)
   38 |   return String(value || '').split(',').map((v) => v.trim()).filter(Boolean)
   39 | }
   40 | 
   41 | function buildCompanyFacts(user) {
   42 |   const profile = user?.profile || {}
   43 |   const certifications = normalizeList(profile.certifications || profile.certification || profile.certs)
   44 |   const categories = normalizeList(profile.categories || profile.category || profile.tags)
   45 |   const capacity = sanitizeString(profile.capacity || profile.monthly_capacity || '', 120)
   46 |   const moq = sanitizeString(profile.moq || profile.minimum_order || '', 120)
   47 |   const leadTime = sanitizeString(profile.lead_time_days || profile.lead_time || '', 120)
   48 |   const country = sanitizeString(profile.country || '', 80)
   49 | 
   50 |   return {
   51 |     certifications,
   52 |     categories,
   53 |     capacity,
   54 |     moq,
   55 |     leadTime,
   56 |     country,
   57 |   }
   58 | }
   59 | 
   60 | function keywordIncludes(text, keywords = []) {
   61 |   const lower = String(text || '').toLowerCase()
   62 |   return keywords.some((k) => lower.includes(String(k || '').toLowerCase()))
   63 | }
   64 | 
   65 | function scoreKnowledgeMatch(questionText, entry) {
   66 |   const q = String(questionText || '').toLowerCase()
   67 |   const question = String(entry?.question || '').toLowerCase()
   68 |   const keywords = Array.isArray(entry?.keywords) ? entry.keywords : []
   69 |   let score = 0
   70 |   if (question && (q.includes(question) || question.includes(q))) score += 3
   71 |   for (const keyword of keywords) {
   72 |     if (keyword && q.includes(String(keyword).toLowerCase())) score += 1
   73 |   }
   74 |   return score
   75 | }
   76 | 
   77 | function findKnowledgeAnswer(questionText, entries = []) {
   78 |   let best = null
   79 |   let bestScore = 0
   80 |   for (const entry of entries) {
   81 |     const score = scoreKnowledgeMatch(questionText, entry)
   82 |     if (score > bestScore) {
   83 |       best = entry
   84 |       bestScore = score
   85 |     }
   86 |   }
   87 |   if (!best || bestScore <= 0) return null
   88 |   return { answer: best.answer, entry: best, score: bestScore }
   89 | }
   90 | 
   91 | function botMatchResponse({ question = '', companyUser }) {
   92 |   const q = String(question || '').toLowerCase()
   93 |   const facts = buildCompanyFacts(companyUser)
   94 | 
   95 |   // Simple high-signal Q/A patterns (MVP) based on project.md.
   96 |   if (keywordIncludes(q, ['moq', 'minimum order', 'min order', 'minimum quantity'])) {
   97 |     if (facts.moq) return `Our minimum order quantity (MOQ) is **${facts.moq}**.`
   98 |     return null
   99 |   }
  100 | 
  101 |   if (keywordIncludes(q, ['lead time', 'delivery', 'timeline'])) {
  102 |     if (facts.leadTime) return `Typical lead time is **${facts.leadTime} days** (depends on fabric and trims).`
  103 |     return null
  104 |   }
  105 | 
  106 |   if (keywordIncludes(q, ['capacity', 'monthly', 'production'])) {
  107 |     if (facts.capacity) return `Our production capacity is **${facts.capacity}**.`
  108 |     return null
  109 |   }
  110 | 
  111 |   if (keywordIncludes(q, ['cert', 'certification', 'compliance', 'audit'])) {
  112 |     if (facts.certifications.length) return `Certifications: **${facts.certifications.join(', ')}**.`
  113 |     return `We support document-based verification. If you need specific compliance documents, please mention the requirement.`
  114 |   }
  115 | 
  116 |   if (keywordIncludes(q, ['category', 'product', 'items', 'what do you make', 'specialize'])) {
  117 |     if (facts.categories.length) return `We focus on: **${facts.categories.join(', ')}**.`
  118 |     return null
  119 |   }
  120 | 
  121 |   if (keywordIncludes(q, ['country', 'location', 'where are you'])) {
  122 |     if (facts.country) return `We are based in **${facts.country}**.`
  123 |     return null
  124 |   }
  125 | 
  126 |   return null
  127 | }
  128 | 
  129 | function extractNumberFromText(text, pattern) {
  130 |   if (!text) return null
  131 |   const match = text.match(pattern)
  132 |   if (!match) return null
  133 |   const raw = String(match[1] || '').replace(/,/g, '')
  134 |   const value = Number(raw)
  135 |   return Number.isFinite(value) ? value : null
  136 | }
  137 | 
  138 | function extractRangeFromText(text, pattern) {
  139 |   if (!text) return null
  140 |   const match = text.match(pattern)
  141 |   if (!match) return null
  142 |   const min = String(match[1] || '').replace(/,/g, '')
  143 |   const max = String(match[2] || '').replace(/,/g, '')
  144 |   const minVal = Number(min)
  145 |   const maxVal = Number(max)
  146 |   if (!Number.isFinite(minVal)) return null
  147 |   if (!Number.isFinite(maxVal)) return `${minVal}`
  148 |   return `${minVal}-${maxVal}`
  149 | }
  150 | 
  151 | function computeMissingFields(requirement) {
  152 |   if (!requirement) return []
  153 |   return QUALIFICATION_FIELDS.filter((field) => {
  154 |     const value = requirement[field.key]
  155 |     if (typeof value === 'boolean') return false
  156 |     return !String(value || '').trim()
  157 |   })
  158 | }
  159 | 
  160 | function computeQualificationScore(requirement, companyUser) {
  161 |   const missing = computeMissingFields(requirement)
  162 |   const completeness = 1 - (missing.length / Math.max(1, QUALIFICATION_FIELDS.length))
  163 | 
  164 |   const facts = buildCompanyFacts(companyUser)
  165 |   const reqCategory = String(requirement?.category || requirement?.industry || requirement?.product || '').toLowerCase().trim()
  166 |   const companyCategories = facts.categories.map((c) => String(c || '').toLowerCase().trim()).filter(Boolean)
  167 | 
  168 |   let fitScore = 0.5
  169 |   if (reqCategory && companyCategories.length) {
  170 |     fitScore = companyCategories.some((c) => c.includes(reqCategory) || reqCategory.includes(c)) ? 0.85 : 0.35
  171 |   }
  172 | 
  173 |   const score = (0.7 * completeness) + (0.3 * fitScore)
  174 |   return { score: Math.max(0, Math.min(1, Math.round(score * 100) / 100)), missing, fitScore }
  175 | }
  176 | 
  177 | function buildQualificationQuestion(missing) {
  178 |   if (!missing.length) return ''
  179 |   const toAsk = missing.slice(0, 2).map((field) => field.question)
  180 |   if (toAsk.length === 1) return toAsk[0]
  181 |   return `${toAsk[0]} Also, ${toAsk[1].toLowerCase()}`
  182 | }
  183 | 
  184 | function extractRequirementPatch(message, requirement) {
  185 |   const text = String(message || '')
  186 |   const lower = text.toLowerCase()
  187 |   const patch = {}
  188 |   const notes = []
  189 | 
  190 |   if (!requirement?.moq) {
  191 |     const moqVal = extractNumberFromText(lower, /\bmoq\b[^\d]{0,10}(\d[\d,]*)/i)
  192 |       ?? extractNumberFromText(lower, /\bminimum order\b[^\d]{0,10}(\d[\d,]*)/i)
  193 |     if (moqVal) {
  194 |       patch.moq = String(moqVal)
  195 |       notes.push(`MOQ: ${moqVal}`)
  196 |     }
  197 |   }
  198 | 
  199 |   if (!requirement?.quantity) {
  200 |     const qtyVal = extractNumberFromText(lower, /\b(qty|quantity|pcs|pieces)\b[^\d]{0,10}(\d[\d,]*)/i)
  201 |     if (qtyVal) {
  202 |       patch.quantity = String(qtyVal)
  203 |       notes.push(`Quantity: ${qtyVal}`)
  204 |     }
  205 |   }
  206 | 
  207 |   if (!requirement?.price_range) {
  208 |     const range = extractRangeFromText(text, /\$?\s?(\d+(?:\.\d+)?)\s*(?:-|to)\s*\$?\s?(\d+(?:\.\d+)?)/i)
  209 |     if (range) {
  210 |       patch.price_range = range
  211 |       notes.push(`Price range: ${range}`)
  212 |     } else {
  213 |       const single = extractNumberFromText(text, /\bprice\b[^\d]{0,10}(\d+(?:\.\d+)?)/i)
  214 |       if (single) {
  215 |         patch.price_range = `${single}`
  216 |         notes.push(`Price: ${single}`)
  217 |       }
  218 |     }
  219 |   }
  220 | 
  221 |   if (!requirement?.delivery_timeline && !requirement?.timeline_days) {
  222 |     const lead = extractNumberFromText(lower, /\b(lead time|leadtime|delivery|timeline)\b[^\d]{0,10}(\d{1,3})/i)
  223 |     if (lead) {
  224 |       patch.timeline_days = String(lead)
  225 |       notes.push(`Lead time: ${lead} days`)
  226 |     }
  227 |   }
  228 | 
  229 |   if (!requirement?.size_range) {
  230 |     const sizeMatch = text.match(/\b(XXS|XS|S|M|L|XL|XXL)\s*(?:-|to)\s*(XXS|XS|S|M|L|XL|XXL)\b/i)
  231 |     if (sizeMatch) {
  232 |       const sizeRange = `${sizeMatch[1].toUpperCase()}-${sizeMatch[2].toUpperCase()}`
  233 |       patch.size_range = sizeRange
  234 |       notes.push(`Size range: ${sizeRange}`)
  235 |     }
  236 |   }
  237 | 
  238 |   if (!requirement?.color_pantone) {
  239 |     const pantone = text.match(/pantone\s*([A-Za-z0-9-]+)/i)
  240 |     if (pantone) {
  241 |       patch.color_pantone = pantone[1]
  242 |       notes.push(`Pantone: ${pantone[1]}`)
  243 |     }
  244 |   }
  245 | 
  246 |   return { patch, notes }
  247 | }
  248 | 
  249 | function shouldAttemptBot({ requestState, messageCount }) {
  250 |   // project.md: bot should handle the initial/general part of the conversation.
  251 |   // We treat "pending request" threads as eligible, and also very early threads.
  252 |   if (requestState?.status === 'pending') return true
  253 |   if (Number(messageCount || 0) <= 2) return true
  254 |   return false
  255 | }
  256 | 
  257 | async function findAssignedAgentForMatch(matchId, orgOwnerId) {
  258 |   const leads = await readJson(LEADS_FILE)
  259 |   const lead = Array.isArray(leads)
  260 |     ? leads.find((l) => String(l.match_id || '') === String(matchId || '') && String(l.org_owner_id || '') === String(orgOwnerId || ''))
  261 |     : null
  262 |   return lead?.assigned_agent_id ? String(lead.assigned_agent_id) : ''
  263 | }
  264 | 
  265 | function resolveOrgOwnerForCompany(companyUser) {
  266 |   // Agents belong to an org owner; main accounts are their own org owner.
  267 |   const role = String(companyUser?.role || '').toLowerCase()
  268 |   if (role === 'agent' && companyUser?.org_owner_id) return String(companyUser.org_owner_id)
  269 |   return String(companyUser?.id || '')
  270 | }
  271 | 
  272 | function sanitizeAutoReply(raw = {}) {
  273 |   const payload = raw && typeof raw === 'object' ? raw : {}
  274 |   return {
  275 |     enabled: payload.enabled === undefined ? true : Boolean(payload.enabled),
  276 |     greeting: sanitizeString(payload.greeting || '', 240),
  277 |     signature: sanitizeString(payload.signature || '', 200),
  278 |     fallback: sanitizeString(payload.fallback || '', 400),
  279 |     tone: sanitizeString(payload.tone || '', 80),
  280 |     qualification_prompt: sanitizeString(payload.qualification_prompt || '', 240),
  281 |   }
  282 | }
  283 | 
  284 | export async function getChatbotSettings(userId) {
  285 |   const users = await readJson(USERS_FILE)
  286 |   const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(userId || '')) : null
  287 |   if (!user) return null
  288 |   const autoReply = sanitizeAutoReply(user.profile?.auto_reply || {})
  289 |   return {
  290 |     user_id: user.id,
  291 |     chatbot_enabled: Boolean(user.chatbot_enabled || user?.profile?.chatbot_enabled),
  292 |     handoff_mode: String(user.handoff_mode || user?.profile?.handoff_mode || 'notify_agent'),
  293 |     auto_reply: autoReply,
  294 |   }
  295 | }
  296 | 
  297 | export async function updateChatbotSettings(userId, payload = {}) {
  298 |   const users = await readJson(USERS_FILE)
  299 |   const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
  300 |   if (idx < 0) return null
  301 | 
  302 |   const current = users[idx]
  303 |   const autoReply = sanitizeAutoReply(payload.auto_reply || payload.autoReply || current.profile?.auto_reply || {})
  304 |   const chatbotEnabled = payload.chatbot_enabled === undefined ? Boolean(current.chatbot_enabled) : Boolean(payload.chatbot_enabled)
  305 |   const handoffMode = sanitizeString(payload.handoff_mode || payload.handoffMode || current.handoff_mode || 'notify_agent', 80) || 'notify_agent'
  306 | 
  307 |   const nextProfile = {
  308 |     ...(current.profile || {}),
  309 |     chatbot_enabled: chatbotEnabled,
  310 |     handoff_mode: handoffMode,
  311 |     auto_reply: autoReply,
  312 |   }
  313 | 
  314 |   users[idx] = {
  315 |     ...current,
  316 |     chatbot_enabled: chatbotEnabled,
  317 |     handoff_mode: handoffMode,
  318 |     profile: nextProfile,
  319 |     updated_at: new Date().toISOString(),
  320 |   }
  321 | 
  322 |   await writeJson(USERS_FILE, users)
  323 |   return {
  324 |     user_id: users[idx].id,
  325 |     chatbot_enabled: chatbotEnabled,
  326 |     handoff_mode: handoffMode,
  327 |     auto_reply: autoReply,
  328 |   }
  329 | }
  330 | 
  331 | export async function getChatbotProfileSummary(targetUserId) {
  332 |   const users = await readJson(USERS_FILE)
  333 |   const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(targetUserId || '')) : null
  334 |   if (!user) return null
  335 | 
  336 |   return {
  337 |     user_id: user.id,
  338 |     chatbot_enabled: Boolean(user.chatbot_enabled || user?.profile?.chatbot_enabled),
  339 |     handoff_mode: String(user.handoff_mode || user?.profile?.handoff_mode || 'notify_agent'),
  340 |   }
  341 | }
  342 | 
  343 | export async function maybeGenerateBotReply({ match_id, sender_id, message }) {
  344 |   const matchId = sanitizeString(String(match_id || ''), 160)
  345 |   const senderId = sanitizeString(String(sender_id || ''), 120)
  346 |   const question = sanitizeString(String(message || ''), 1200)
  347 |   if (!matchId || !senderId || !question) return { reply: null, reason: 'invalid_input' }
  348 | 
  349 |   const users = await readJson(USERS_FILE)
  350 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  351 | 
  352 |   // Determine the company-side user that would "own" the bot in this thread.
  353 |   const marketplace = parseMarketplaceMatchId(matchId)
  354 |   if (!marketplace) return { reply: null, reason: 'unsupported_match' }
  355 | 
  356 |   const companyUser = usersById.get(String(marketplace.factoryId)) || null
  357 |   if (!companyUser) return { reply: null, reason: 'company_missing' }
  358 | 
  359 |   // Ignore bot replies to the company/agent sending messages themselves.
  360 |   if (String(companyUser.id || '') === String(senderId || '')) {
  361 |     return { reply: null, reason: 'sender_is_company' }
  362 |   }
  363 | 
  364 |   const enabled = Boolean(companyUser.chatbot_enabled || companyUser?.profile?.chatbot_enabled)
  365 |   if (!enabled) return { reply: null, reason: 'disabled' }
  366 | 
  367 |   const autoReplySettings = sanitizeAutoReply(companyUser?.profile?.auto_reply || {})
  368 |   if (autoReplySettings.enabled === false) return { reply: null, reason: 'auto_reply_disabled' }
  369 | 
  370 |   const [messages, requests] = await Promise.all([
  371 |     readJson(MESSAGES_FILE),
  372 |     readJson(MESSAGE_REQUESTS_FILE),
  373 |   ])
  374 | 
  375 |   const threadMessages = Array.isArray(messages) ? messages.filter((m) => String(m.match_id || '') === matchId) : []
  376 |   const requestState = Array.isArray(requests) ? requests.find((r) => String(r.thread_id || '') === matchId) : null
  377 | 
  378 |   if (!shouldAttemptBot({ requestState, messageCount: threadMessages.length })) {
  379 |     return { reply: null, reason: 'not_initial' }
  380 |   }
  381 | 
  382 |   const requirement = await getRequirementById(marketplace.requirementId)
  383 |   const isBuyerSender = String(requirement?.buyer_id || '') === String(senderId || '')
  384 | 
  385 |   let knowledgeAnswer = null
  386 |   try {
  387 |     const orgOwnerId = resolveOrgOwnerForCompany(companyUser)
  388 |     const entries = await listKnowledge(orgOwnerId)
  389 |     knowledgeAnswer = findKnowledgeAnswer(question, entries)
  390 |   } catch {
  391 |     knowledgeAnswer = null
  392 |   }
  393 | 
  394 |   let qualificationQuestion = ''
  395 |   if (isBuyerSender && requirement) {
  396 |     const { patch, notes } = extractRequirementPatch(question, requirement)
  397 |     if (Object.keys(patch || {}).length > 0) {
  398 |       try {
  399 |         await updateRequirement(requirement.id, patch, { id: 'system', role: 'admin' })
  400 |       } catch {
  401 |         // ignore patch failures
  402 |       }
  403 | 
  404 |       const noteLines = notes.length ? `AI pre-qual captured: ${notes.join(', ')}` : 'AI pre-qual captured details.'
  405 |       await addLeadNoteForMatch({
  406 |         matchId,
  407 |         orgOwnerId: companyUser.id,
  408 |         note: noteLines,
  409 |         authorId: 'system',
  410 |       })
  411 |     }
  412 | 
  413 |     const updatedRequirement = Object.keys(patch || {}).length ? { ...requirement, ...patch } : requirement
  414 |     const missingFields = computeMissingFields(updatedRequirement)
  415 |     qualificationQuestion = buildQualificationQuestion(missingFields)
  416 |     if (autoReplySettings.qualification_prompt) {
  417 |       qualificationQuestion = autoReplySettings.qualification_prompt
  418 |     }
  419 |     if (qualificationQuestion) {
  420 |       await addLeadNoteForMatch({
  421 |         matchId,
  422 |         orgOwnerId: companyUser.id,
  423 |         note: `AI pre-qual question asked: ${qualificationQuestion}`,
  424 |         authorId: 'system',
  425 |       })
  426 |     }
  427 | 
  428 |     const { score, missing, fitScore } = computeQualificationScore(updatedRequirement, companyUser)
  429 |     const summaryLine = [
  430 |       `AI Pre-Qual Summary: Score ${score}`,
  431 |       missing.length ? `Missing: ${missing.map((m) => m.label).join(', ')}` : 'Missing: none',
  432 |       `Fit: ${fitScore >= 0.7 ? 'high' : fitScore >= 0.45 ? 'medium' : 'low'}`,
  433 |     ].join(' | ')
  434 |     await addLeadNoteForMatch({
  435 |       matchId,
  436 |       orgOwnerId: companyUser.id,
  437 |       note: summaryLine,
  438 |       authorId: 'system',
  439 |     })
  440 |   }
  441 | 
  442 |   let rawReply = knowledgeAnswer?.answer || ''
  443 |   if (!rawReply) {
  444 |     rawReply = botMatchResponse({ question, companyUser })
  445 |   }
  446 |   if (!rawReply && qualificationQuestion) {
  447 |     rawReply = qualificationQuestion
  448 |   } else if (rawReply && qualificationQuestion) {
  449 |     rawReply = `${rawReply}\n\nQuick check: ${qualificationQuestion}`
  450 |   }
  451 |   if (!rawReply && autoReplySettings.fallback) {
  452 |     rawReply = autoReplySettings.fallback
  453 |   }
  454 |   if (!rawReply) {
  455 |     // Handoff: notify org owner + assigned agent if any.
  456 |     const orgOwnerId = resolveOrgOwnerForCompany(companyUser)
  457 |     const assignedAgentId = await findAssignedAgentForMatch(matchId, orgOwnerId)
  458 | 
  459 |     await createNotification(orgOwnerId, {
  460 |       type: 'chatbot_handoff',
  461 |       entity_type: 'chat_thread',
  462 |       entity_id: matchId,
  463 |       message: `Chatbot needs human follow-up for: "${question.slice(0, 120)}"`,
  464 |       meta: { match_id: matchId, company_id: companyUser.id },
  465 |     })
  466 | 
  467 |     if (assignedAgentId && assignedAgentId !== orgOwnerId) {
  468 |       await createNotification(assignedAgentId, {
  469 |         type: 'chatbot_handoff',
  470 |         entity_type: 'chat_thread',
  471 |         entity_id: matchId,
  472 |         message: `Assigned lead needs follow-up: "${question.slice(0, 120)}"`,
  473 |         meta: { match_id: matchId, company_id: companyUser.id },
  474 |       })
  475 |     }
  476 | 
  477 |     return { reply: null, reason: 'handoff' }
  478 |   }
  479 | 
  480 |   // Run moderation on bot reply as well (avoid accidental policy leakage).
  481 |   let safeReply = rawReply
  482 |   try {
  483 |     const moderated = await moderateTextOrRedact({
  484 |       actor: companyUser,
  485 |       text: rawReply,
  486 |       entity_type: 'chatbot_reply',
  487 |       entity_id: matchId,
  488 |     })
  489 |     safeReply = moderated.text
  490 |   } catch {
  491 |     // silent
  492 |   }
  493 | 
  494 |   const signature = autoReplySettings.signature ? `\n\n${autoReplySettings.signature}` : ''
  495 |   const greeting = autoReplySettings.greeting ? `${autoReplySettings.greeting}\n\n` : ''
  496 |   const toneHint = autoReplySettings.tone ? `Tone: ${autoReplySettings.tone}. ` : ''
  497 |   const finalReply = `${greeting}${toneHint}${safeReply}${signature}`.trim()
  498 | 
  499 |   const entry = {
  500 |     id: crypto.randomUUID(),
  501 |     match_id: matchId,
  502 |     sender_id: String(companyUser.id),
  503 |     sender_name: sanitizeString(companyUser.name || companyUser.email || 'GarTexHub Bot', 120),
  504 |     sender_role: companyUser.role || '',
  505 |     message: finalReply,
  506 |     type: 'bot',
  507 |     timestamp: new Date().toISOString(),
  508 |     moderated: false,
  509 |     moderation_reason: '',
  510 |     meta: { bot: true },
  511 |   }
  512 | 
  513 |   const nextMessages = Array.isArray(messages) ? [...messages, entry] : [entry]
  514 |   await writeJson(MESSAGES_FILE, nextMessages)
  515 | 
  516 |   return { reply: entry, reason: 'ok' }
  517 | }
  518 | 