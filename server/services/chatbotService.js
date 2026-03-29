import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { moderateTextOrRedact } from './policyService.js'
import { createNotification } from './notificationService.js'
import { addLeadNoteForMatch } from './leadService.js'
import { getRequirementById, updateRequirement } from './requirementService.js'
import { listKnowledge } from './assistantService.js'

const USERS_FILE = 'users.json'
const MESSAGES_FILE = 'messages.json'
const MESSAGE_REQUESTS_FILE = 'message_requests.json'
const LEADS_FILE = 'leads.json'

const QUALIFICATION_FIELDS = [
  { key: 'quantity', label: 'quantity', question: 'What total quantity are you targeting?' },
  { key: 'moq', label: 'MOQ', question: 'What MOQ per color/style do you need?' },
  { key: 'price_range', label: 'price range', question: 'What target price range per unit should we plan for?' },
  { key: 'material', label: 'fabric/material', question: 'Which fabric or material do you prefer?' },
  { key: 'delivery_timeline', label: 'lead time', question: 'What delivery timeline or lead time do you need?' },
  { key: 'size_range', label: 'size range', question: 'What size range should we support?' },
  { key: 'color_pantone', label: 'colors/Pantone', question: 'Any target colors or Pantone references?' },
  { key: 'customization_capabilities', label: 'customization', question: 'Do you need customization or tech pack acceptance?' },
]

function parseMarketplaceMatchId(matchId = '') {
  const parts = String(matchId || '').split(':')
  if (parts.length !== 2) return null
  const requirementId = sanitizeString(parts[0], 120)
  const factoryId = sanitizeString(parts[1], 120)
  if (!requirementId || !factoryId) return null
  return { requirementId, factoryId }
}

function normalizeList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.map((v) => String(v || '').trim()).filter(Boolean)
  return String(value || '').split(',').map((v) => v.trim()).filter(Boolean)
}

function buildCompanyFacts(user) {
  const profile = user?.profile || {}
  const certifications = normalizeList(profile.certifications || profile.certification || profile.certs)
  const categories = normalizeList(profile.categories || profile.category || profile.tags)
  const capacity = sanitizeString(profile.capacity || profile.monthly_capacity || '', 120)
  const moq = sanitizeString(profile.moq || profile.minimum_order || '', 120)
  const leadTime = sanitizeString(profile.lead_time_days || profile.lead_time || '', 120)
  const country = sanitizeString(profile.country || '', 80)

  return {
    certifications,
    categories,
    capacity,
    moq,
    leadTime,
    country,
  }
}

function keywordIncludes(text, keywords = []) {
  const lower = String(text || '').toLowerCase()
  return keywords.some((k) => lower.includes(String(k || '').toLowerCase()))
}

function scoreKnowledgeMatch(questionText, entry) {
  const q = String(questionText || '').toLowerCase()
  const question = String(entry?.question || '').toLowerCase()
  const keywords = Array.isArray(entry?.keywords) ? entry.keywords : []
  let score = 0
  if (question && (q.includes(question) || question.includes(q))) score += 3
  for (const keyword of keywords) {
    if (keyword && q.includes(String(keyword).toLowerCase())) score += 1
  }
  return score
}

function findKnowledgeAnswer(questionText, entries = []) {
  let best = null
  let bestScore = 0
  for (const entry of entries) {
    const score = scoreKnowledgeMatch(questionText, entry)
    if (score > bestScore) {
      best = entry
      bestScore = score
    }
  }
  if (!best || bestScore <= 0) return null
  return { answer: best.answer, entry: best, score: bestScore }
}

function botMatchResponse({ question = '', companyUser }) {
  const q = String(question || '').toLowerCase()
  const facts = buildCompanyFacts(companyUser)

  // Simple high-signal Q/A patterns (MVP) based on project.md.
  if (keywordIncludes(q, ['moq', 'minimum order', 'min order', 'minimum quantity'])) {
    if (facts.moq) return `Our minimum order quantity (MOQ) is **${facts.moq}**.`
    return null
  }

  if (keywordIncludes(q, ['lead time', 'delivery', 'timeline'])) {
    if (facts.leadTime) return `Typical lead time is **${facts.leadTime} days** (depends on fabric and trims).`
    return null
  }

  if (keywordIncludes(q, ['capacity', 'monthly', 'production'])) {
    if (facts.capacity) return `Our production capacity is **${facts.capacity}**.`
    return null
  }

  if (keywordIncludes(q, ['cert', 'certification', 'compliance', 'audit'])) {
    if (facts.certifications.length) return `Certifications: **${facts.certifications.join(', ')}**.`
    return `We support document-based verification. If you need specific compliance documents, please mention the requirement.`
  }

  if (keywordIncludes(q, ['category', 'product', 'items', 'what do you make', 'specialize'])) {
    if (facts.categories.length) return `We focus on: **${facts.categories.join(', ')}**.`
    return null
  }

  if (keywordIncludes(q, ['country', 'location', 'where are you'])) {
    if (facts.country) return `We are based in **${facts.country}**.`
    return null
  }

  return null
}

function extractNumberFromText(text, pattern) {
  if (!text) return null
  const match = text.match(pattern)
  if (!match) return null
  const raw = String(match[1] || '').replace(/,/g, '')
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

function extractRangeFromText(text, pattern) {
  if (!text) return null
  const match = text.match(pattern)
  if (!match) return null
  const min = String(match[1] || '').replace(/,/g, '')
  const max = String(match[2] || '').replace(/,/g, '')
  const minVal = Number(min)
  const maxVal = Number(max)
  if (!Number.isFinite(minVal)) return null
  if (!Number.isFinite(maxVal)) return `${minVal}`
  return `${minVal}-${maxVal}`
}

function computeMissingFields(requirement) {
  if (!requirement) return []
  return QUALIFICATION_FIELDS.filter((field) => {
    const value = requirement[field.key]
    if (typeof value === 'boolean') return false
    return !String(value || '').trim()
  })
}

function computeQualificationScore(requirement, companyUser) {
  const missing = computeMissingFields(requirement)
  const completeness = 1 - (missing.length / Math.max(1, QUALIFICATION_FIELDS.length))

  const facts = buildCompanyFacts(companyUser)
  const reqCategory = String(requirement?.category || requirement?.industry || requirement?.product || '').toLowerCase().trim()
  const companyCategories = facts.categories.map((c) => String(c || '').toLowerCase().trim()).filter(Boolean)

  let fitScore = 0.5
  if (reqCategory && companyCategories.length) {
    fitScore = companyCategories.some((c) => c.includes(reqCategory) || reqCategory.includes(c)) ? 0.85 : 0.35
  }

  const score = (0.7 * completeness) + (0.3 * fitScore)
  return { score: Math.max(0, Math.min(1, Math.round(score * 100) / 100)), missing, fitScore }
}

function buildQualificationQuestion(missing) {
  if (!missing.length) return ''
  const toAsk = missing.slice(0, 2).map((field) => field.question)
  if (toAsk.length === 1) return toAsk[0]
  return `${toAsk[0]} Also, ${toAsk[1].toLowerCase()}`
}

function extractRequirementPatch(message, requirement) {
  const text = String(message || '')
  const lower = text.toLowerCase()
  const patch = {}
  const notes = []

  if (!requirement?.moq) {
    const moqVal = extractNumberFromText(lower, /\bmoq\b[^\d]{0,10}(\d[\d,]*)/i)
      ?? extractNumberFromText(lower, /\bminimum order\b[^\d]{0,10}(\d[\d,]*)/i)
    if (moqVal) {
      patch.moq = String(moqVal)
      notes.push(`MOQ: ${moqVal}`)
    }
  }

  if (!requirement?.quantity) {
    const qtyVal = extractNumberFromText(lower, /\b(qty|quantity|pcs|pieces)\b[^\d]{0,10}(\d[\d,]*)/i)
    if (qtyVal) {
      patch.quantity = String(qtyVal)
      notes.push(`Quantity: ${qtyVal}`)
    }
  }

  if (!requirement?.price_range) {
    const range = extractRangeFromText(text, /\$?\s?(\d+(?:\.\d+)?)\s*(?:-|to)\s*\$?\s?(\d+(?:\.\d+)?)/i)
    if (range) {
      patch.price_range = range
      notes.push(`Price range: ${range}`)
    } else {
      const single = extractNumberFromText(text, /\bprice\b[^\d]{0,10}(\d+(?:\.\d+)?)/i)
      if (single) {
        patch.price_range = `${single}`
        notes.push(`Price: ${single}`)
      }
    }
  }

  if (!requirement?.delivery_timeline && !requirement?.timeline_days) {
    const lead = extractNumberFromText(lower, /\b(lead time|leadtime|delivery|timeline)\b[^\d]{0,10}(\d{1,3})/i)
    if (lead) {
      patch.timeline_days = String(lead)
      notes.push(`Lead time: ${lead} days`)
    }
  }

  if (!requirement?.size_range) {
    const sizeMatch = text.match(/\b(XXS|XS|S|M|L|XL|XXL)\s*(?:-|to)\s*(XXS|XS|S|M|L|XL|XXL)\b/i)
    if (sizeMatch) {
      const sizeRange = `${sizeMatch[1].toUpperCase()}-${sizeMatch[2].toUpperCase()}`
      patch.size_range = sizeRange
      notes.push(`Size range: ${sizeRange}`)
    }
  }

  if (!requirement?.color_pantone) {
    const pantone = text.match(/pantone\s*([A-Za-z0-9-]+)/i)
    if (pantone) {
      patch.color_pantone = pantone[1]
      notes.push(`Pantone: ${pantone[1]}`)
    }
  }

  return { patch, notes }
}

function shouldAttemptBot({ requestState, messageCount }) {
  // project.md: bot should handle the initial/general part of the conversation.
  // We treat "pending request" threads as eligible, and also very early threads.
  if (requestState?.status === 'pending') return true
  if (Number(messageCount || 0) <= 2) return true
  return false
}

async function findAssignedAgentForMatch(matchId, orgOwnerId) {
  const leads = await readJson(LEADS_FILE)
  const lead = Array.isArray(leads)
    ? leads.find((l) => String(l.match_id || '') === String(matchId || '') && String(l.org_owner_id || '') === String(orgOwnerId || ''))
    : null
  return lead?.assigned_agent_id ? String(lead.assigned_agent_id) : ''
}

function resolveOrgOwnerForCompany(companyUser) {
  // Agents belong to an org owner; main accounts are their own org owner.
  const role = String(companyUser?.role || '').toLowerCase()
  if (role === 'agent' && companyUser?.org_owner_id) return String(companyUser.org_owner_id)
  return String(companyUser?.id || '')
}

function sanitizeAutoReply(raw = {}) {
  const payload = raw && typeof raw === 'object' ? raw : {}
  return {
    enabled: payload.enabled === undefined ? true : Boolean(payload.enabled),
    greeting: sanitizeString(payload.greeting || '', 240),
    signature: sanitizeString(payload.signature || '', 200),
    fallback: sanitizeString(payload.fallback || '', 400),
    tone: sanitizeString(payload.tone || '', 80),
    qualification_prompt: sanitizeString(payload.qualification_prompt || '', 240),
  }
}

export async function getChatbotSettings(userId) {
  const users = await readJson(USERS_FILE)
  const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(userId || '')) : null
  if (!user) return null
  const autoReply = sanitizeAutoReply(user.profile?.auto_reply || {})
  return {
    user_id: user.id,
    chatbot_enabled: Boolean(user.chatbot_enabled || user?.profile?.chatbot_enabled),
    handoff_mode: String(user.handoff_mode || user?.profile?.handoff_mode || 'notify_agent'),
    auto_reply: autoReply,
  }
}

export async function updateChatbotSettings(userId, payload = {}) {
  const users = await readJson(USERS_FILE)
  const idx = Array.isArray(users) ? users.findIndex((u) => String(u.id) === String(userId || '')) : -1
  if (idx < 0) return null

  const current = users[idx]
  const autoReply = sanitizeAutoReply(payload.auto_reply || payload.autoReply || current.profile?.auto_reply || {})
  const chatbotEnabled = payload.chatbot_enabled === undefined ? Boolean(current.chatbot_enabled) : Boolean(payload.chatbot_enabled)
  const handoffMode = sanitizeString(payload.handoff_mode || payload.handoffMode || current.handoff_mode || 'notify_agent', 80) || 'notify_agent'

  const nextProfile = {
    ...(current.profile || {}),
    chatbot_enabled: chatbotEnabled,
    handoff_mode: handoffMode,
    auto_reply: autoReply,
  }

  users[idx] = {
    ...current,
    chatbot_enabled: chatbotEnabled,
    handoff_mode: handoffMode,
    profile: nextProfile,
    updated_at: new Date().toISOString(),
  }

  await writeJson(USERS_FILE, users)
  return {
    user_id: users[idx].id,
    chatbot_enabled: chatbotEnabled,
    handoff_mode: handoffMode,
    auto_reply: autoReply,
  }
}

export async function getChatbotProfileSummary(targetUserId) {
  const users = await readJson(USERS_FILE)
  const user = Array.isArray(users) ? users.find((u) => String(u.id) === String(targetUserId || '')) : null
  if (!user) return null

  return {
    user_id: user.id,
    chatbot_enabled: Boolean(user.chatbot_enabled || user?.profile?.chatbot_enabled),
    handoff_mode: String(user.handoff_mode || user?.profile?.handoff_mode || 'notify_agent'),
  }
}

export async function maybeGenerateBotReply({ match_id, sender_id, message }) {
  const matchId = sanitizeString(String(match_id || ''), 160)
  const senderId = sanitizeString(String(sender_id || ''), 120)
  const question = sanitizeString(String(message || ''), 1200)
  if (!matchId || !senderId || !question) return { reply: null, reason: 'invalid_input' }

  const users = await readJson(USERS_FILE)
  const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))

  // Determine the company-side user that would "own" the bot in this thread.
  const marketplace = parseMarketplaceMatchId(matchId)
  if (!marketplace) return { reply: null, reason: 'unsupported_match' }

  const companyUser = usersById.get(String(marketplace.factoryId)) || null
  if (!companyUser) return { reply: null, reason: 'company_missing' }

  // Ignore bot replies to the company/agent sending messages themselves.
  if (String(companyUser.id || '') === String(senderId || '')) {
    return { reply: null, reason: 'sender_is_company' }
  }

  const enabled = Boolean(companyUser.chatbot_enabled || companyUser?.profile?.chatbot_enabled)
  if (!enabled) return { reply: null, reason: 'disabled' }

  const autoReplySettings = sanitizeAutoReply(companyUser?.profile?.auto_reply || {})
  if (autoReplySettings.enabled === false) return { reply: null, reason: 'auto_reply_disabled' }

  const [messages, requests] = await Promise.all([
    readJson(MESSAGES_FILE),
    readJson(MESSAGE_REQUESTS_FILE),
  ])

  const threadMessages = Array.isArray(messages) ? messages.filter((m) => String(m.match_id || '') === matchId) : []
  const requestState = Array.isArray(requests) ? requests.find((r) => String(r.thread_id || '') === matchId) : null

  if (!shouldAttemptBot({ requestState, messageCount: threadMessages.length })) {
    return { reply: null, reason: 'not_initial' }
  }

  const requirement = await getRequirementById(marketplace.requirementId)
  const isBuyerSender = String(requirement?.buyer_id || '') === String(senderId || '')

  let knowledgeAnswer = null
  try {
    const orgOwnerId = resolveOrgOwnerForCompany(companyUser)
    const entries = await listKnowledge(orgOwnerId)
    knowledgeAnswer = findKnowledgeAnswer(question, entries)
  } catch {
    knowledgeAnswer = null
  }

  let qualificationQuestion = ''
  if (isBuyerSender && requirement) {
    const { patch, notes } = extractRequirementPatch(question, requirement)
    if (Object.keys(patch || {}).length > 0) {
      try {
        await updateRequirement(requirement.id, patch, { id: 'system', role: 'admin' })
      } catch {
        // ignore patch failures
      }

      const noteLines = notes.length ? `AI pre-qual captured: ${notes.join(', ')}` : 'AI pre-qual captured details.'
      await addLeadNoteForMatch({
        matchId,
        orgOwnerId: companyUser.id,
        note: noteLines,
        authorId: 'system',
      })
    }

    const updatedRequirement = Object.keys(patch || {}).length ? { ...requirement, ...patch } : requirement
    const missingFields = computeMissingFields(updatedRequirement)
    qualificationQuestion = buildQualificationQuestion(missingFields)
    if (autoReplySettings.qualification_prompt) {
      qualificationQuestion = autoReplySettings.qualification_prompt
    }
    if (qualificationQuestion) {
      await addLeadNoteForMatch({
        matchId,
        orgOwnerId: companyUser.id,
        note: `AI pre-qual question asked: ${qualificationQuestion}`,
        authorId: 'system',
      })
    }

    const { score, missing, fitScore } = computeQualificationScore(updatedRequirement, companyUser)
    const summaryLine = [
      `AI Pre-Qual Summary: Score ${score}`,
      missing.length ? `Missing: ${missing.map((m) => m.label).join(', ')}` : 'Missing: none',
      `Fit: ${fitScore >= 0.7 ? 'high' : fitScore >= 0.45 ? 'medium' : 'low'}`,
    ].join(' | ')
    await addLeadNoteForMatch({
      matchId,
      orgOwnerId: companyUser.id,
      note: summaryLine,
      authorId: 'system',
    })
  }

  let rawReply = knowledgeAnswer?.answer || ''
  if (!rawReply) {
    rawReply = botMatchResponse({ question, companyUser })
  }
  if (!rawReply && qualificationQuestion) {
    rawReply = qualificationQuestion
  } else if (rawReply && qualificationQuestion) {
    rawReply = `${rawReply}\n\nQuick check: ${qualificationQuestion}`
  }
  if (!rawReply && autoReplySettings.fallback) {
    rawReply = autoReplySettings.fallback
  }
  if (!rawReply) {
    // Handoff: notify org owner + assigned agent if any.
    const orgOwnerId = resolveOrgOwnerForCompany(companyUser)
    const assignedAgentId = await findAssignedAgentForMatch(matchId, orgOwnerId)

    await createNotification(orgOwnerId, {
      type: 'chatbot_handoff',
      entity_type: 'chat_thread',
      entity_id: matchId,
      message: `Chatbot needs human follow-up for: "${question.slice(0, 120)}"`,
      meta: { match_id: matchId, company_id: companyUser.id },
    })

    if (assignedAgentId && assignedAgentId !== orgOwnerId) {
      await createNotification(assignedAgentId, {
        type: 'chatbot_handoff',
        entity_type: 'chat_thread',
        entity_id: matchId,
        message: `Assigned lead needs follow-up: "${question.slice(0, 120)}"`,
        meta: { match_id: matchId, company_id: companyUser.id },
      })
    }

    return { reply: null, reason: 'handoff' }
  }

  // Run moderation on bot reply as well (avoid accidental policy leakage).
  let safeReply = rawReply
  try {
    const moderated = await moderateTextOrRedact({
      actor: companyUser,
      text: rawReply,
      entity_type: 'chatbot_reply',
      entity_id: matchId,
    })
    safeReply = moderated.text
  } catch {
    // silent
  }

  const signature = autoReplySettings.signature ? `\n\n${autoReplySettings.signature}` : ''
  const greeting = autoReplySettings.greeting ? `${autoReplySettings.greeting}\n\n` : ''
  const toneHint = autoReplySettings.tone ? `Tone: ${autoReplySettings.tone}. ` : ''
  const finalReply = `${greeting}${toneHint}${safeReply}${signature}`.trim()

  const entry = {
    id: crypto.randomUUID(),
    match_id: matchId,
    sender_id: String(companyUser.id),
    sender_name: sanitizeString(companyUser.name || companyUser.email || 'GarTexHub Bot', 120),
    sender_role: companyUser.role || '',
    message: finalReply,
    type: 'bot',
    timestamp: new Date().toISOString(),
    moderated: false,
    moderation_reason: '',
    meta: { bot: true },
  }

  const nextMessages = Array.isArray(messages) ? [...messages, entry] : [entry]
  await writeJson(MESSAGES_FILE, nextMessages)

  return { reply: entry, reason: 'ok' }
}
