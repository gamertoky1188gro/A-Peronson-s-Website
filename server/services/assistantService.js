import crypto from 'crypto'
import { readJson, updateJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'assistant_knowledge.json'

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

function mapKnowledgeRow(row) {
  return {
    id: row.id,
    org_id: row.org_id,
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

function buildMatchedResponse(matchedAnswer, source, score) {
  return {
    matched_answer: matchedAnswer,
    source,
    confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
  }
}

export async function assistantReply(orgId, question = '') {
  const questionText = sanitizeString(question, 800)
  const entries = await listKnowledge(orgId)

  let bestEntry = null
  let bestEntryScore = 0
  for (const entry of entries) {
    const score = scoreMatch(questionText, entry.question, entry.keywords)
    if (score > bestEntryScore) {
      bestEntry = entry
      bestEntryScore = score
    }
  }

  if (bestEntry && bestEntryScore > 0) {
    return buildMatchedResponse(bestEntry.answer, 'org_knowledge', bestEntryScore)
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
    return buildMatchedResponse(bestRule.response, bestRule.source, bestRuleScore)
  }

  return {
    forward_to_agent: true,
  }
}
