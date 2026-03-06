import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
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

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html'])
const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vite'])
const MAX_FILES_TO_SCAN = 400
const MAX_FILE_BYTES = 80_000
const MAX_MATCHED_SNIPPETS = 4
const MAX_SNIPPET_LENGTH = 320
const MAX_CONTEXT_CHARS = 1_600

let codeFileCache = {
  expiresAt: 0,
  files: [],
}

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

async function collectCodeFiles(dirPath, collector, limit = MAX_FILES_TO_SCAN) {
  if (collector.length >= limit) return

  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (collector.length >= limit) return

    const resolvedPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) continue
      await collectCodeFiles(resolvedPath, collector, limit)
      continue
    }

    if (!entry.isFile()) continue
    const extension = path.extname(entry.name).toLowerCase()
    if (!CODE_EXTENSIONS.has(extension)) continue
    collector.push(resolvedPath)
  }
}

async function getCodeFiles() {
  const now = Date.now()
  if (codeFileCache.expiresAt > now && codeFileCache.files.length > 0) {
    return codeFileCache.files
  }

  const files = []
  await collectCodeFiles(process.cwd(), files)
  codeFileCache = {
    files,
    expiresAt: now + 60_000,
  }
  return files
}

function findBestSnippet(content, tokens) {
  const lines = content.split('\n')
  let best = { score: 0, line: '', lineNumber: 1 }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index]
    const normalizedLine = normalize(rawLine)
    if (!normalizedLine) continue

    let score = 0
    for (const token of tokens) {
      if (normalizedLine.includes(token)) score += 1
    }

    if (score > best.score) {
      best = {
        score,
        line: sanitizeString(rawLine.trim(), MAX_SNIPPET_LENGTH),
        lineNumber: index + 1,
      }
    }
  }

  return best.score > 0 ? best : null
}

async function searchCodeContext(questionText) {
  const tokens = tokenize(questionText)
  if (tokens.length === 0) {
    return {
      summary: '',
      snippets: [],
      prompt_context: '',
    }
  }

  const files = await getCodeFiles()
  const matches = []

  for (const filePath of files) {
    let stat
    try {
      stat = await fs.stat(filePath)
    } catch {
      continue
    }
    if (!stat.isFile() || stat.size > MAX_FILE_BYTES) continue

    let content = ''
    try {
      content = await fs.readFile(filePath, 'utf8')
    } catch {
      continue
    }

    const relativePath = path.relative(process.cwd(), filePath)
    const fileTokens = tokenize(relativePath)

    let score = 0
    for (const token of tokens) {
      if (fileTokens.includes(token)) score += 2
      if (normalize(content).includes(token)) score += 1
    }

    if (score === 0) continue

    const bestSnippet = findBestSnippet(content, tokens)
    matches.push({
      path: relativePath,
      score: score + (bestSnippet?.score || 0),
      snippet: bestSnippet,
    })
  }

  const topMatches = matches
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHED_SNIPPETS)

  const snippets = topMatches.map((match) => ({
    file: match.path,
    score: match.score,
    line: match.snippet?.lineNumber || null,
    snippet: match.snippet?.line || '',
  }))

  const summary = snippets
    .map((item) => `${item.file}${item.line ? `:${item.line}` : ''}`)
    .join(', ')

  let promptContext = snippets
    .map((item) => `[${item.file}${item.line ? `:${item.line}` : ''}] ${item.snippet}`)
    .join('\n')
  promptContext = sanitizeString(promptContext, MAX_CONTEXT_CHARS)

  return {
    summary,
    snippets,
    prompt_context: promptContext,
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

function buildMatchedResponse({ matchedAnswer, source, score, fallbackReason = null, matchedType = null, codeContext = null }) {
  return {
    matched_answer: matchedAnswer,
    source,
    confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
    metadata: {
      matched_source: source,
      matched_type: matchedType,
      confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
      fallback_reason: fallbackReason,
      code_context: codeContext,
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
  const codeContext = await searchCodeContext(questionText)
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
      codeContext,
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
      codeContext,
    })
  }

  return {
    forward_to_agent: true,
    agent_prompt_context: {
      question: questionText,
      code_summary: codeContext.summary,
      compact_code_context: codeContext.prompt_context,
      max_context_chars: MAX_CONTEXT_CHARS,
    },
    metadata: {
      matched_source: null,
      matched_type: null,
      confidence: 0,
      fallback_reason: 'no_keyword_match',
      code_context: codeContext,
    },
  }
}
