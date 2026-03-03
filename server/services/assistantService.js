import crypto from 'crypto'
import { readJson, updateJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'assistant_knowledge.json'
const KNOWLEDGE_TYPES = {
  FAQ: 'faq',
  FACT: 'fact',
}

const globalRules = [
  {
    source: 'global_rule:onboarding',
    keywords: ['setup', 'onboarding', 'profile'],
    response: 'Start with onboarding: profile image, organization name, and category selection.',
  },
  {
    source: 'global_rule:verification',
    keywords: ['verification', 'badge', 'verified'],
    response: 'Submit required verification documents, keep premium active, then request admin approval.',
  },
  {
    source: 'global_rule:subscription',
    keywords: ['subscription', 'premium', 'plan'],
    response: 'Premium unlocks higher visibility and advanced analytics for your account type.',
  },
  {
    source: 'global_rule:help',
    keywords: ['help', 'support'],
    response: 'I can route you to Help Center and suggest next dashboard actions.',
  },
]

function normalize(text = '') {
  return sanitizeString(String(text || '').toLowerCase(), 500)
}

function tokenize(text = '') {
  return normalize(text).split(/[^a-z0-9]+/).filter((word) => word.length > 2)
}

function scoreMatch(questionText, candidateQuestion, candidateKeywords = []) {
  const normalizedQuestion = normalize(questionText)
  const normalizedCandidate = normalize(candidateQuestion)
  const questionTokens = tokenize(normalizedQuestion)

  let score = 0
  if (normalizedCandidate && (normalizedQuestion.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedQuestion))) {
    score += 2
  }

  const keywordSet = new Set(candidateKeywords.map((keyword) => normalize(keyword)).filter(Boolean))
  for (const token of questionTokens) {
    if (keywordSet.has(token)) score += 1
  }
  return score
}

function normalizeType(type) {
  const normalized = sanitizeString(type, 30).toLowerCase()
  return normalized === KNOWLEDGE_TYPES.FACT ? KNOWLEDGE_TYPES.FACT : KNOWLEDGE_TYPES.FAQ
}

function mapKnowledgeRow(row) {
  return {
    id: row.id,
    org_id: row.org_id,
    type: normalizeType(row.type),
    question: row.question,
    answer: row.answer,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    updated_at: row.updated_at,
    created_at: row.created_at,
  }
}

export async function listKnowledge(orgId) {
  const rows = await readJson(FILE)
  return rows
    .filter((row) => row.org_id === orgId)
    .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
    .map(mapKnowledgeRow)
}

export async function createKnowledgeEntry(orgId, payload) {
  const type = normalizeType(payload?.type)
  const question = sanitizeString(payload?.question, 280)
  const answer = sanitizeString(payload?.answer, 1200)
  const keywords = Array.isArray(payload?.keywords)
    ? payload.keywords.map((k) => sanitizeString(k, 80).toLowerCase()).filter(Boolean)
    : []

  if (!question || !answer) {
    const error = new Error('question and answer are required')
    error.status = 400
    throw error
  }

  const now = new Date().toISOString()
  const entry = {
    id: crypto.randomUUID(),
    org_id: orgId,
    type,
    question,
    answer,
    keywords,
    created_at: now,
    updated_at: now,
  }

  await updateJson(FILE, (rows) => {
    rows.push(entry)
    return rows
  })
  return mapKnowledgeRow(entry)
}

export async function updateKnowledgeEntry(orgId, entryId, payload) {
  let updated = null
  await updateJson(FILE, (rows) => {
    const index = rows.findIndex((row) => row.id === entryId && row.org_id === orgId)
    if (index < 0) {
      const error = new Error('Knowledge entry not found')
      error.status = 404
      throw error
    }

    const current = rows[index]
    const type = payload?.type === undefined ? normalizeType(current.type) : normalizeType(payload.type)
    const question = payload?.question === undefined ? current.question : sanitizeString(payload.question, 280)
    const answer = payload?.answer === undefined ? current.answer : sanitizeString(payload.answer, 1200)
    const keywords = payload?.keywords === undefined
      ? current.keywords
      : (Array.isArray(payload.keywords) ? payload.keywords.map((k) => sanitizeString(k, 80).toLowerCase()).filter(Boolean) : [])

    if (!question || !answer) {
      const error = new Error('question and answer are required')
      error.status = 400
      throw error
    }

    updated = {
      ...current,
      type,
      question,
      answer,
      keywords,
      updated_at: new Date().toISOString(),
    }
    rows[index] = updated
    return rows
  })

  return mapKnowledgeRow(updated)
}

export async function deleteKnowledgeEntry(orgId, entryId) {
  let deleted = false
  await updateJson(FILE, (rows) => {
    const next = rows.filter((row) => !(row.id === entryId && row.org_id === orgId))
    deleted = next.length !== rows.length
    return next
  })
  return deleted
}

function buildMatchedResponse({ matchedAnswer, source, score, fallbackReason = null, matchedType = null }) {
  return {
    matched_answer: matchedAnswer,
    source,
    confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
    metadata: {
      matched_source: source,
      matched_type: matchedType,
      confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
      fallback_reason: fallbackReason,
    },
  }
}

function findBestMatch(questionText, entries) {
  let bestEntry = null
  let bestEntryScore = 0
  for (const entry of entries) {
    const score = scoreMatch(questionText, entry.question, entry.keywords)
    if (score > bestEntryScore) {
      bestEntry = entry
      bestEntryScore = score
    }
  }
  return { bestEntry, bestEntryScore }
}

export async function assistantReply(orgId, question = '') {
  const questionText = sanitizeString(question, 800)
  const entries = await listKnowledge(orgId)
  const faqEntries = entries.filter((entry) => normalizeType(entry.type) === KNOWLEDGE_TYPES.FAQ)
  const factEntries = entries.filter((entry) => normalizeType(entry.type) === KNOWLEDGE_TYPES.FACT)

  const { bestEntry: bestFaqEntry, bestEntryScore: bestFaqScore } = findBestMatch(questionText, faqEntries)
  const { bestEntry: bestFactEntry, bestEntryScore: bestFactScore } = findBestMatch(questionText, factEntries)

  const companyBestEntry = bestFaqScore >= bestFactScore ? bestFaqEntry : bestFactEntry
  const companyBestScore = Math.max(bestFaqScore, bestFactScore)

  if (companyBestEntry && companyBestScore > 0) {
    return buildMatchedResponse({
      matchedAnswer: companyBestEntry.answer,
      source: `company_data:${companyBestEntry.type}`,
      score: companyBestScore,
      matchedType: companyBestEntry.type,
    })
  }

  let bestRule = null
  let bestRuleScore = 0
  for (const rule of globalRules) {
    const score = scoreMatch(questionText, '', rule.keywords)
    if (score > bestRuleScore) {
      bestRule = rule
      bestRuleScore = score
    }
  }

  if (bestRule && bestRuleScore > 0) {
    return buildMatchedResponse({
      matchedAnswer: bestRule.response,
      source: bestRule.source,
      score: bestRuleScore,
      fallbackReason: 'no_company_data_match',
      matchedType: 'global_rule',
    })
  }

  return {
    forward_to_agent: true,
    metadata: {
      matched_source: null,
      matched_type: null,
      confidence: 0,
      fallback_reason: 'no_keyword_match',
    },
  }
}
