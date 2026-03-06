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

const smallTalkRules = [
  {
    source: 'smalltalk:greeting',
    keywords: ['hi', 'hello', 'hey', 'goodmorning', 'goodafternoon', 'goodevening'],
    response: 'Greet the user briefly and offer textile business help.',
  },
  {
    source: 'smalltalk:identity',
    keywords: ['name', 'whoareyou', 'whatsyourname', 'whatisyourname'],
    response: 'Introduce yourself as GarTex Assistant in one short sentence.',
  },
]

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html'])
const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vite'])
const MAX_FILES_TO_SCAN = 400
const MAX_FILE_BYTES = 80_000
const MAX_MATCHED_SNIPPETS = 4
const MAX_SNIPPET_LENGTH = 320
const MAX_CONTEXT_CHARS = 1_600
const MAX_KNOWLEDGE_CONTEXT_CHARS = 1_200
const LOCAL_LLM_ENDPOINT = process.env.LOCAL_LLM_ENDPOINT || 'http://127.0.0.1:8080/v1/chat/completions'
const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL || 'Qwen2.5-0.5B-Instruct-Q4_K_M.gguf'
const LOCAL_LLM_TIMEOUT_MS = Number(process.env.LOCAL_LLM_TIMEOUT_MS || 12000)
const MAX_AI_ANSWER_CHARS = 700

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

function compactTokenKey(token = '') {
  return String(token || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
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

function findBestKeywordRule(questionText, rules = []) {
  const normalizedQuestion = normalize(questionText)
  const compactQuestion = compactTokenKey(normalizedQuestion)
  const rawQuestionTokens = normalizedQuestion.split(/[^a-z0-9]+/).filter(Boolean)
  const compactQuestionTokens = new Set(rawQuestionTokens.map((token) => compactTokenKey(token)).filter(Boolean))

  let bestRule = null
  let bestRuleScore = 0

  for (const rule of rules) {
    const normalizedKeywords = rule.keywords.map((keyword) => compactTokenKey(keyword)).filter(Boolean)
    let score = 0
    for (const keyword of normalizedKeywords) {
      if (!keyword) continue
      if (compactQuestionTokens.has(keyword)) {
        score += 1
        continue
      }
      if (keyword.length > 3 && compactQuestion.includes(keyword)) score += 1
    }

    if (score > bestRuleScore) {
      bestRule = rule
      bestRuleScore = score
    }
  }

  return { bestRule, bestRuleScore }
}

function buildKnowledgeContext(questionText, entries) {
  const rankedEntries = entries
    .map((entry) => ({
      entry,
      score: scoreMatch(questionText, entry.question, entry.keywords),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const lines = rankedEntries.map((item, index) => {
    const entry = item.entry
    const keywords = Array.isArray(entry.keywords) ? entry.keywords.join(', ') : ''
    return `${index + 1}. (${entry.type}) Q: ${entry.question}\nA: ${entry.answer}${keywords ? `\nK: ${keywords}` : ''}`
  })

  const { bestRule: bestGlobalRule, bestRuleScore: bestGlobalRuleScore } = findBestKeywordRule(questionText, globalRules)
  if (bestGlobalRule && bestGlobalRuleScore > 0) {
    lines.push(`Global guidance: ${bestGlobalRule.response}`)
  }

  const { bestRule: bestSmallTalkRule, bestRuleScore: bestSmallTalkScore } = findBestKeywordRule(questionText, smallTalkRules)
  if (bestSmallTalkRule && bestSmallTalkScore > 0) {
    lines.push(`Tone guidance: ${bestSmallTalkRule.response}`)
  }

  return sanitizeString(lines.join('\n\n'), MAX_KNOWLEDGE_CONTEXT_CHARS)
}

function buildAgentPrompt(questionText, codeContext, knowledgeContext) {
  const sections = [
    'You are GarTex Assistant for textile business workflows.',
    'Always answer the user directly. Keep responses practical and concise.',
    'If code context is present, use it as supporting evidence. If absent, still answer based on general textile/business knowledge.',
  ]

  if (knowledgeContext) {
    sections.push(`Knowledge context:\n${knowledgeContext}`)
  }

  if (codeContext?.summary || codeContext?.prompt_context) {
    const codeBlock = [
      codeContext.summary ? `Relevant files: ${codeContext.summary}` : '',
      codeContext.prompt_context ? `Code snippets:\n${codeContext.prompt_context}` : '',
    ].filter(Boolean).join('\n\n')
    sections.push(codeBlock)
  }

  sections.push(`User question: ${questionText}`)
  return sections.join('\n\n')
}

async function generateDynamicAnswer(questionText, codeContext, knowledgeContext) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), LOCAL_LLM_TIMEOUT_MS)

  try {
    const prompt = buildAgentPrompt(questionText, codeContext, knowledgeContext)
    const response = await fetch(LOCAL_LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: LOCAL_LLM_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful GarTex assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 220,
      }),
      signal: controller.signal,
    })

    if (!response.ok) return null
    const payload = await response.json()
    const messageText = payload?.choices?.[0]?.message?.content || ''
    const cleaned = sanitizeString(messageText, MAX_AI_ANSWER_CHARS)
    return cleaned || null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
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

function buildMatchedResponse({ matchedAnswer, source, score, fallbackReason = null, matchedType = null, codeContext = null, knowledgeContext = '' }) {
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
      knowledge_context: knowledgeContext,
    },
  }
}

export async function assistantReply(orgId, question = '') {
  const questionText = sanitizeString(question, 800)
  const codeContext = await searchCodeContext(questionText)
  const entries = await listKnowledge(orgId)
  const knowledgeContext = buildKnowledgeContext(questionText, entries)

  const dynamicAnswer = await generateDynamicAnswer(questionText, codeContext, knowledgeContext)
  if (dynamicAnswer) {
    return buildMatchedResponse({
      matchedAnswer: dynamicAnswer,
      source: 'dynamic_ai:local_llm',
      score: 2,
      fallbackReason: 'ai_generated_response',
      matchedType: 'dynamic_ai',
      codeContext,
      knowledgeContext,
    })
  }

  return {
    forward_to_agent: true,
    agent_prompt_context: {
      question: questionText,
      code_summary: codeContext.summary,
      compact_code_context: codeContext.prompt_context,
      compact_knowledge_context: knowledgeContext,
      max_context_chars: MAX_CONTEXT_CHARS,
    },
    metadata: {
      matched_source: null,
      matched_type: null,
      confidence: 0,
      fallback_reason: 'local_llm_unavailable',
      code_context: codeContext,
      knowledge_context: knowledgeContext,
    },
  }
}
