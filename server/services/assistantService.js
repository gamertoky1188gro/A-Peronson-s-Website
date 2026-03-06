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

import axios from 'axios'

const LLAMA_SERVER_URL = process.env.LLAMA_SERVER_URL || 'http://127.0.0.1:8080'

async function callLocalLLM(systemPrompt, userQuestion) {
  try {
    const response = await axios.post(`${LLAMA_SERVER_URL}/completion`, {
      prompt: `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${userQuestion}<|im_end|>\n<|im_start|>assistant\n`,
      n_predict: 512,
      stop: ['<|im_end|>', '<|im_start|>'],
      temperature: 0.7,
    }, { timeout: 30000 })
    
    return response.data.content.trim()
  } catch (err) {
    console.error('LLM Server Error:', err.message)
    return null
  }
}

import fs from 'fs'
import path from 'path'

const TECH_FILES = [
  'src/App.jsx',
  'server/server.js',
  'server/utils/permissions.js',
  'README.md'
]

/**
 * Scans key codebase files for relevant technical context
 */
function discoverCodeContext(query) {
  const keywords = tokenize(query).filter(k => k.length > 3)
  if (keywords.length === 0) return ''

  let context = ""
  for (const relPath of TECH_FILES) {
    try {
      const fullPath = path.join(process.cwd(), relPath)
      if (!fs.existsSync(fullPath)) continue
      
      const content = fs.readFileSync(fullPath, 'utf8')
      const lines = content.split('\n')
      
      // Find lines that match keywords
      const matches = lines.filter(line => 
        keywords.some(k => line.toLowerCase().includes(k))
      ).slice(0, 5) // Limit to 5 lines per file to save model memory

      if (matches.length > 0) {
        context += `\nFrom ${relPath}:\n` + matches.join('\n')
      }
    } catch (err) {
      // Skip files that fail
    }
  }
  return context.slice(0, 800) // Hard cap on context size
}

export async function assistantReply(orgId, question = '') {
  const questionText = sanitizeString(question, 800)
  
  // 1. Try Knowledge Base Match (Fastest)
  const entries = await listKnowledge(orgId)
  const { bestEntry, bestEntryScore } = findBestMatch(questionText, entries)
  if (bestEntry && bestEntryScore > 1) {
    return buildMatchedResponse({
      matchedAnswer: bestEntry.answer,
      source: `company_data:${bestEntry.type}`,
      score: bestEntryScore,
      matchedType: bestEntry.type,
    })
  }

  // 2. Discover Technical Context from Code (Dynamic)
  const codeContext = discoverCodeContext(questionText)
  
  // 3. AI Fallback with Code Insights
  const systemPrompt = `You are the GarTex Assistant. 
Use the Technical Context below to answer the user accurately. 
Do NOT show raw code or paths unless asked. 
Be conversational.

TECHNICAL CONTEXT FOUND IN CODEBASE:
${codeContext || "No specific code matches found."}

USER QUESTION: ${questionText}`

  const aiResponse = await callLocalLLM(systemPrompt, questionText)

  if (aiResponse) {
    return {
      matched_answer: aiResponse,
      source: 'local_ai_plus_code_scan',
      confidence: 0.85,
      metadata: { matched_source: 'llama_cpp', matched_type: 'rag_completion', context_found: !!codeContext }
    }
  }

  return {
    forward_to_agent: true,
    metadata: {
      matched_source: null,
      matched_type: null,
      confidence: 0,
      fallback_reason: 'no_keyword_match_and_llm_failed',
    },
  }
}
