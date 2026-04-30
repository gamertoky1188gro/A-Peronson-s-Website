    1 | import crypto from 'crypto'
    2 | import fs from 'fs/promises'
    3 | import path from 'path'
    4 | import { readJson, updateJson } from '../utils/jsonStore.js'
    5 | import { sanitizeString } from '../utils/validators.js'
    6 | import { logError, logInfo } from '../utils/logger.js'
    7 | import { updateLocalJson } from '../utils/localStore.js'
    8 | 
    9 | const FILE = 'assistant_knowledge.json'
   10 | const KNOWLEDGE_TYPES = {
   11 |   FAQ: 'faq',
   12 |   FACT: 'fact',
   13 | }
   14 | 
   15 | const globalRules = [
   16 |   {
   17 |     source: 'global_rule:onboarding',
   18 |     keywords: ['setup', 'onboarding', 'profile'],
   19 |     response: 'Start with onboarding: profile image, organization name, and category selection.',
   20 |   },
   21 |   {
   22 |     source: 'global_rule:verification',
   23 |     keywords: ['verification', 'badge', 'verified'],
   24 |     response: 'Submit required verification documents, keep premium active, then request admin approval.',
   25 |   },
   26 |   {
   27 |     source: 'global_rule:subscription',
   28 |     keywords: ['subscription', 'premium', 'plan'],
   29 |     response: 'Premium unlocks higher visibility and advanced analytics for your account type.',
   30 |   },
   31 |   {
   32 |     source: 'global_rule:help',
   33 |     keywords: ['help', 'support'],
   34 |     response: 'I can route you to Help Center and suggest next dashboard actions.',
   35 |   },
   36 | ]
   37 | 
   38 | const smallTalkRules = [
   39 |   {
   40 |     source: 'smalltalk:greeting',
   41 |     keywords: ['hi', 'hello', 'hey', 'goodmorning', 'goodafternoon', 'goodevening'],
   42 |     response: 'Greet the user briefly and offer textile business help.',
   43 |   },
   44 |   {
   45 |     source: 'smalltalk:identity',
   46 |     keywords: ['name', 'whoareyou', 'whatsyourname', 'whatisyourname'],
   47 |     response: 'Introduce yourself as GarTex Assistant in one short sentence.',
   48 |   },
   49 | ]
   50 | 
   51 | const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html'])
   52 | const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vite'])
   53 | const MAX_FILES_TO_SCAN = 400
   54 | const MAX_FILE_BYTES = 80_000
   55 | const MAX_MATCHED_SNIPPETS = 4
   56 | const MAX_SNIPPET_LENGTH = 320
   57 | const MAX_CONTEXT_CHARS = 1_600
   58 | const MAX_KNOWLEDGE_CONTEXT_CHARS = 1_200
   59 | const LOCAL_LLM_ENDPOINT = process.env.LOCAL_LLM_ENDPOINT || 'http://127.0.0.1:8080/v1/chat/completions'
   60 | const LOCAL_LLM_FALLBACK_ENDPOINT = process.env.LOCAL_LLM_FALLBACK_ENDPOINT || 'http://127.0.0.1:8080/completion'
   61 | const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL || 'Qwen2.5-0.5B-Instruct-Q4_K_M.gguf'
   62 | const LOCAL_LLM_TIMEOUT_MS = Number(process.env.LOCAL_LLM_TIMEOUT_MS || 25000)
   63 | const MAX_AI_ANSWER_CHARS = 700
   64 | const CODE_CONTEXT_HINTS = new Set(['api', 'route', 'server', 'controller', 'service', 'code', 'bug', 'error', 'endpoint', 'json', 'database', 'model', 'function'])
   65 | 
   66 | let codeFileCache = {
   67 |   expiresAt: 0,
   68 |   files: [],
   69 | }
   70 | 
   71 | function normalize(text = '') {
   72 |   return sanitizeString(String(text || '').toLowerCase(), 500)
   73 | }
   74 | 
   75 | function tokenize(text = '') {
   76 |   return normalize(text).split(/[^a-z0-9]+/).filter((word) => word.length > 2)
   77 | }
   78 | 
   79 | function compactTokenKey(token = '') {
   80 |   return String(token || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
   81 | }
   82 | 
   83 | function scoreMatch(questionText, candidateQuestion, candidateKeywords = []) {
   84 |   const normalizedQuestion = normalize(questionText)
   85 |   const normalizedCandidate = normalize(candidateQuestion)
   86 |   const questionTokens = tokenize(normalizedQuestion)
   87 | 
   88 |   let score = 0
   89 |   if (normalizedCandidate && (normalizedQuestion.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedQuestion))) {
   90 |     score += 2
   91 |   }
   92 | 
   93 |   const keywordSet = new Set(candidateKeywords.map((keyword) => normalize(keyword)).filter(Boolean))
   94 |   for (const token of questionTokens) {
   95 |     if (keywordSet.has(token)) score += 1
   96 |   }
   97 |   return score
   98 | }
   99 | 
  100 | function normalizeType(type) {
  101 |   const normalized = sanitizeString(type, 30).toLowerCase()
  102 |   return normalized === KNOWLEDGE_TYPES.FACT ? KNOWLEDGE_TYPES.FACT : KNOWLEDGE_TYPES.FAQ
  103 | }
  104 | 
  105 | function mapKnowledgeRow(row) {
  106 |   return {
  107 |     id: row.id,
  108 |     org_id: row.org_id,
  109 |     type: normalizeType(row.type),
  110 |     question: row.question,
  111 |     answer: row.answer,
  112 |     keywords: Array.isArray(row.keywords) ? row.keywords : [],
  113 |     updated_at: row.updated_at,
  114 |     created_at: row.created_at,
  115 |   }
  116 | }
  117 | 
  118 | async function collectCodeFiles(dirPath, collector, limit = MAX_FILES_TO_SCAN) {
  119 |   if (collector.length >= limit) return
  120 | 
  121 |   const entries = await fs.readdir(dirPath, { withFileTypes: true })
  122 |   for (const entry of entries) {
  123 |     if (collector.length >= limit) return
  124 | 
  125 |     const resolvedPath = path.join(dirPath, entry.name)
  126 |     if (entry.isDirectory()) {
  127 |       if (SKIP_DIRECTORIES.has(entry.name)) continue
  128 |       await collectCodeFiles(resolvedPath, collector, limit)
  129 |       continue
  130 |     }
  131 | 
  132 |     if (!entry.isFile()) continue
  133 |     const extension = path.extname(entry.name).toLowerCase()
  134 |     if (!CODE_EXTENSIONS.has(extension)) continue
  135 |     collector.push(resolvedPath)
  136 |   }
  137 | }
  138 | 
  139 | async function getCodeFiles() {
  140 |   const now = Date.now()
  141 |   if (codeFileCache.expiresAt > now && codeFileCache.files.length > 0) {
  142 |     return codeFileCache.files
  143 |   }
  144 | 
  145 |   const files = []
  146 |   await collectCodeFiles(process.cwd(), files)
  147 |   codeFileCache = {
  148 |     files,
  149 |     expiresAt: now + 60_000,
  150 |   }
  151 |   return files
  152 | }
  153 | 
  154 | function findBestSnippet(content, tokens) {
  155 |   const lines = content.split('\n')
  156 |   let best = { score: 0, line: '', lineNumber: 1 }
  157 | 
  158 |   for (let index = 0; index < lines.length; index += 1) {
  159 |     const rawLine = lines[index]
  160 |     const normalizedLine = normalize(rawLine)
  161 |     if (!normalizedLine) continue
  162 | 
  163 |     let score = 0
  164 |     for (const token of tokens) {
  165 |       if (normalizedLine.includes(token)) score += 1
  166 |     }
  167 | 
  168 |     if (score > best.score) {
  169 |       best = {
  170 |         score,
  171 |         line: sanitizeString(rawLine.trim(), MAX_SNIPPET_LENGTH),
  172 |         lineNumber: index + 1,
  173 |       }
  174 |     }
  175 |   }
  176 | 
  177 |   return best.score > 0 ? best : null
  178 | }
  179 | 
  180 | async function searchCodeContext(questionText) {
  181 |   const tokens = tokenize(questionText)
  182 |   if (tokens.length === 0) {
  183 |     return {
  184 |       summary: '',
  185 |       snippets: [],
  186 |       prompt_context: '',
  187 |     }
  188 |   }
  189 | 
  190 |   const files = await getCodeFiles()
  191 |   const matches = []
  192 | 
  193 |   for (const filePath of files) {
  194 |     let stat
  195 |     try {
  196 |       stat = await fs.stat(filePath)
  197 |     } catch {
  198 |       continue
  199 |     }
  200 |     if (!stat.isFile() || stat.size > MAX_FILE_BYTES) continue
  201 | 
  202 |     let content = ''
  203 |     try {
  204 |       content = await fs.readFile(filePath, 'utf8')
  205 |     } catch {
  206 |       continue
  207 |     }
  208 | 
  209 |     const relativePath = path.relative(process.cwd(), filePath)
  210 |     const fileTokens = tokenize(relativePath)
  211 | 
  212 |     let score = 0
  213 |     for (const token of tokens) {
  214 |       if (fileTokens.includes(token)) score += 2
  215 |       if (normalize(content).includes(token)) score += 1
  216 |     }
  217 | 
  218 |     if (score === 0) continue
  219 | 
  220 |     const bestSnippet = findBestSnippet(content, tokens)
  221 |     matches.push({
  222 |       path: relativePath,
  223 |       score: score + (bestSnippet?.score || 0),
  224 |       snippet: bestSnippet,
  225 |     })
  226 |   }
  227 | 
  228 |   const topMatches = matches
  229 |     .sort((a, b) => b.score - a.score)
  230 |     .slice(0, MAX_MATCHED_SNIPPETS)
  231 | 
  232 |   const snippets = topMatches.map((match) => ({
  233 |     file: match.path,
  234 |     score: match.score,
  235 |     line: match.snippet?.lineNumber || null,
  236 |     snippet: match.snippet?.line || '',
  237 |   }))
  238 | 
  239 |   const summary = snippets
  240 |     .map((item) => `${item.file}${item.line ? `:${item.line}` : ''}`)
  241 |     .join(', ')
  242 | 
  243 |   let promptContext = snippets
  244 |     .map((item) => `[${item.file}${item.line ? `:${item.line}` : ''}] ${item.snippet}`)
  245 |     .join('\n')
  246 |   promptContext = sanitizeString(promptContext, MAX_CONTEXT_CHARS)
  247 | 
  248 |   return {
  249 |     summary,
  250 |     snippets,
  251 |     prompt_context: promptContext,
  252 |   }
  253 | }
  254 | 
  255 | function findBestKeywordRule(questionText, rules = []) {
  256 |   const normalizedQuestion = normalize(questionText)
  257 |   const compactQuestion = compactTokenKey(normalizedQuestion)
  258 |   const rawQuestionTokens = normalizedQuestion.split(/[^a-z0-9]+/).filter(Boolean)
  259 |   const compactQuestionTokens = new Set(rawQuestionTokens.map((token) => compactTokenKey(token)).filter(Boolean))
  260 | 
  261 |   let bestRule = null
  262 |   let bestRuleScore = 0
  263 | 
  264 |   for (const rule of rules) {
  265 |     const normalizedKeywords = rule.keywords.map((keyword) => compactTokenKey(keyword)).filter(Boolean)
  266 |     let score = 0
  267 |     for (const keyword of normalizedKeywords) {
  268 |       if (!keyword) continue
  269 |       if (compactQuestionTokens.has(keyword)) {
  270 |         score += 1
  271 |         continue
  272 |       }
  273 |       if (keyword.length > 3 && compactQuestion.includes(keyword)) score += 1
  274 |     }
  275 | 
  276 |     if (score > bestRuleScore) {
  277 |       bestRule = rule
  278 |       bestRuleScore = score
  279 |     }
  280 |   }
  281 | 
  282 |   return { bestRule, bestRuleScore }
  283 | }
  284 | 
  285 | function shouldSearchCodeContext(questionText) {
  286 |   const tokens = tokenize(questionText)
  287 |   if (tokens.length < 3) return false
  288 |   return tokens.some((token) => CODE_CONTEXT_HINTS.has(token))
  289 | }
  290 | 
  291 | function buildKnowledgeContext(questionText, entries) {
  292 |   const rankedEntries = entries
  293 |     .map((entry) => ({
  294 |       entry,
  295 |       score: scoreMatch(questionText, entry.question, entry.keywords),
  296 |     }))
  297 |     .filter((item) => item.score > 0)
  298 |     .sort((a, b) => b.score - a.score)
  299 |     .slice(0, 3)
  300 | 
  301 |   const lines = rankedEntries.map((item, index) => {
  302 |     const entry = item.entry
  303 |     const keywords = Array.isArray(entry.keywords) ? entry.keywords.join(', ') : ''
  304 |     return `${index + 1}. (${entry.type}) Q: ${entry.question}\nA: ${entry.answer}${keywords ? `\nK: ${keywords}` : ''}`
  305 |   })
  306 | 
  307 |   const { bestRule: bestGlobalRule, bestRuleScore: bestGlobalRuleScore } = findBestKeywordRule(questionText, globalRules)
  308 |   if (bestGlobalRule && bestGlobalRuleScore > 0) {
  309 |     lines.push(`Global guidance: ${bestGlobalRule.response}`)
  310 |   }
  311 | 
  312 |   const { bestRule: bestSmallTalkRule, bestRuleScore: bestSmallTalkScore } = findBestKeywordRule(questionText, smallTalkRules)
  313 |   if (bestSmallTalkRule && bestSmallTalkScore > 0) {
  314 |     lines.push(`Tone guidance: ${bestSmallTalkRule.response}`)
  315 |   }
  316 | 
  317 |   return sanitizeString(lines.join('\n\n'), MAX_KNOWLEDGE_CONTEXT_CHARS)
  318 | }
  319 | 
  320 | function buildAgentPrompt(questionText, codeContext, knowledgeContext) {
  321 |   const sections = [
  322 |     'You are GarTex Assistant for textile business workflows.',
  323 |     'Always answer the user directly. Keep responses practical and concise.',
  324 |     'Do not use generic fallback text like "I am sorry, I could not find an answer".',
  325 |     'Do not introduce yourself unless user asks who you are.',
  326 |     'If code context is present, use it as supporting evidence. If absent, still answer based on general textile/business knowledge.',
  327 |   ]
  328 | 
  329 |   if (knowledgeContext) {
  330 |     sections.push(`Knowledge context:\n${knowledgeContext}`)
  331 |   }
  332 | 
  333 |   if (codeContext?.summary || codeContext?.prompt_context) {
  334 |     const codeBlock = [
  335 |       codeContext.summary ? `Relevant files: ${codeContext.summary}` : '',
  336 |       codeContext.prompt_context ? `Code snippets:\n${codeContext.prompt_context}` : '',
  337 |     ].filter(Boolean).join('\n\n')
  338 |     sections.push(codeBlock)
  339 |   }
  340 | 
  341 |   sections.push(`User question: ${questionText}`)
  342 |   return sections.join('\n\n')
  343 | }
  344 | 
  345 | async function callChatCompletions(prompt, signal) {
  346 |   const response = await fetch(LOCAL_LLM_ENDPOINT, {
  347 |     method: 'POST',
  348 |     headers: { 'content-type': 'application/json' },
  349 |     body: JSON.stringify({
  350 |       model: LOCAL_LLM_MODEL,
  351 |       messages: [
  352 |         { role: 'system', content: 'You are a helpful GarTex assistant.' },
  353 |         { role: 'user', content: prompt },
  354 |       ],
  355 |       temperature: 0.2,
  356 |       max_tokens: 220,
  357 |     }),
  358 |     signal,
  359 |   })
  360 | 
  361 |   if (!response.ok) return null
  362 |   const payload = await response.json()
  363 |   return sanitizeString(payload?.choices?.[0]?.message?.content || '', MAX_AI_ANSWER_CHARS) || null
  364 | }
  365 | 
  366 | async function callLegacyCompletion(prompt, signal) {
  367 |   const response = await fetch(LOCAL_LLM_FALLBACK_ENDPOINT, {
  368 |     method: 'POST',
  369 |     headers: { 'content-type': 'application/json' },
  370 |     body: JSON.stringify({
  371 |       model: LOCAL_LLM_MODEL,
  372 |       prompt,
  373 |       temperature: 0.2,
  374 |       n_predict: 220,
  375 |     }),
  376 |     signal,
  377 |   })
  378 | 
  379 |   if (!response.ok) return null
  380 |   const payload = await response.json()
  381 |   return sanitizeString(payload?.content || payload?.response || '', MAX_AI_ANSWER_CHARS) || null
  382 | }
  383 | 
  384 | async function runWithTimeout(callback) {
  385 |   const controller = new AbortController()
  386 |   const timeout = setTimeout(() => controller.abort(), LOCAL_LLM_TIMEOUT_MS)
  387 |   try {
  388 |     return await callback(controller.signal)
  389 |   } finally {
  390 |     clearTimeout(timeout)
  391 |   }
  392 | }
  393 | 
  394 | async function generateDynamicAnswer(questionText, codeContext, knowledgeContext) {
  395 |   try {
  396 |     const prompt = buildAgentPrompt(questionText, codeContext, knowledgeContext)
  397 |     logInfo('Assistant sending request to local LLM', {
  398 |       endpoint: LOCAL_LLM_ENDPOINT,
  399 |       model: LOCAL_LLM_MODEL,
  400 |       prompt_chars: prompt.length,
  401 |       timeout_ms: LOCAL_LLM_TIMEOUT_MS,
  402 |     })
  403 | 
  404 |     const chatResult = await runWithTimeout((signal) => callChatCompletions(prompt, signal))
  405 |     if (chatResult) {
  406 |       logInfo('Assistant received response from local LLM chat endpoint')
  407 |       return chatResult
  408 |     }
  409 | 
  410 |     logInfo('Assistant chat endpoint returned no response, trying completion endpoint', {
  411 |       endpoint: LOCAL_LLM_FALLBACK_ENDPOINT,
  412 |     })
  413 | 
  414 |     const completionResult = await runWithTimeout((signal) => callLegacyCompletion(prompt, signal))
  415 |     if (completionResult) {
  416 |       logInfo('Assistant received response from local LLM completion endpoint')
  417 |       return completionResult
  418 |     }
  419 | 
  420 |     return null
  421 |   } catch (error) {
  422 |     logError('Assistant local LLM request failed', error)
  423 |     return null
  424 |   }
  425 | }
  426 | 
  427 | export async function listKnowledge(orgId) {
  428 |   const rows = await readJson(FILE)
  429 |   return rows
  430 |     .filter((row) => row.org_id === orgId)
  431 |     .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  432 |     .map(mapKnowledgeRow)
  433 | }
  434 | 
  435 | export async function createKnowledgeEntry(orgId, payload) {
  436 |   const type = normalizeType(payload?.type)
  437 |   const question = sanitizeString(payload?.question, 280)
  438 |   const answer = sanitizeString(payload?.answer, 1200)
  439 |   const keywords = Array.isArray(payload?.keywords)
  440 |     ? payload.keywords.map((k) => sanitizeString(k, 80).toLowerCase()).filter(Boolean)
  441 |     : []
  442 | 
  443 |   if (!question || !answer) {
  444 |     const error = new Error('question and answer are required')
  445 |     error.status = 400
  446 |     throw error
  447 |   }
  448 | 
  449 |   const now = new Date().toISOString()
  450 |   const entry = {
  451 |     id: crypto.randomUUID(),
  452 |     org_id: orgId,
  453 |     type,
  454 |     question,
  455 |     answer,
  456 |     keywords,
  457 |     created_at: now,
  458 |     updated_at: now,
  459 |   }
  460 | 
  461 |   await updateJson(FILE, (rows) => {
  462 |     rows.push(entry)
  463 |     return rows
  464 |   })
  465 |   return mapKnowledgeRow(entry)
  466 | }
  467 | 
  468 | export async function updateKnowledgeEntry(orgId, entryId, payload) {
  469 |   let updated = null
  470 |   await updateJson(FILE, (rows) => {
  471 |     const index = rows.findIndex((row) => row.id === entryId && row.org_id === orgId)
  472 |     if (index < 0) {
  473 |       const error = new Error('Knowledge entry not found')
  474 |       error.status = 404
  475 |       throw error
  476 |     }
  477 | 
  478 |     const current = rows[index]
  479 |     const type = payload?.type === undefined ? normalizeType(current.type) : normalizeType(payload.type)
  480 |     const question = payload?.question === undefined ? current.question : sanitizeString(payload.question, 280)
  481 |     const answer = payload?.answer === undefined ? current.answer : sanitizeString(payload.answer, 1200)
  482 |     const keywords = payload?.keywords === undefined
  483 |       ? current.keywords
  484 |       : (Array.isArray(payload.keywords) ? payload.keywords.map((k) => sanitizeString(k, 80).toLowerCase()).filter(Boolean) : [])
  485 | 
  486 |     if (!question || !answer) {
  487 |       const error = new Error('question and answer are required')
  488 |       error.status = 400
  489 |       throw error
  490 |     }
  491 | 
  492 |     updated = {
  493 |       ...current,
  494 |       type,
  495 |       question,
  496 |       answer,
  497 |       keywords,
  498 |       updated_at: new Date().toISOString(),
  499 |     }
  500 |     rows[index] = updated
  501 |     return rows
  502 |   })
  503 | 
  504 |   return mapKnowledgeRow(updated)
  505 | }
  506 | 
  507 | export async function deleteKnowledgeEntry(orgId, entryId) {
  508 |   let deleted = false
  509 |   await updateJson(FILE, (rows) => {
  510 |     const next = rows.filter((row) => !(row.id === entryId && row.org_id === orgId))
  511 |     deleted = next.length !== rows.length
  512 |     return next
  513 |   })
  514 |   return deleted
  515 | }
  516 | 
  517 | function buildMatchedResponse({ matchedAnswer, source, score, fallbackReason = null, matchedType = null, codeContext = null, knowledgeContext = '' }) {
  518 |   return {
  519 |     matched_answer: matchedAnswer,
  520 |     source,
  521 |     confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
  522 |     metadata: {
  523 |       matched_source: source,
  524 |       matched_type: matchedType,
  525 |       confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
  526 |       fallback_reason: fallbackReason,
  527 |       code_context: codeContext,
  528 |       knowledge_context: knowledgeContext,
  529 |     },
  530 |   }
  531 | }
  532 | 
  533 | export async function assistantReply(orgId, question = '') {
  534 |   const questionText = sanitizeString(question, 800)
  535 |   const codeContext = shouldSearchCodeContext(questionText)
  536 |     ? await searchCodeContext(questionText)
  537 |     : { summary: '', snippets: [], prompt_context: '' }
  538 |   const entries = await listKnowledge(orgId)
  539 |   const knowledgeContext = buildKnowledgeContext(questionText, entries)
  540 | 
  541 |     const dynamicAnswer = await generateDynamicAnswer(questionText, codeContext, knowledgeContext)
  542 |     if (dynamicAnswer) {
  543 |       await updateLocalJson('ai_response_audit.json', (rows = []) => {
  544 |         const next = Array.isArray(rows) ? rows : []
  545 |         next.push({
  546 |           id: crypto.randomUUID(),
  547 |           question: questionText,
  548 |           answer: dynamicAnswer,
  549 |           source: 'local_llm',
  550 |           created_at: new Date().toISOString(),
  551 |         })
  552 |         return next.slice(-500)
  553 |       }, [])
  554 |       return buildMatchedResponse({
  555 |         matchedAnswer: dynamicAnswer,
  556 |         source: 'dynamic_ai:local_llm',
  557 |       score: 2,
  558 |       fallbackReason: 'ai_generated_response',
  559 |       matchedType: 'dynamic_ai',
  560 |       codeContext,
  561 |       knowledgeContext,
  562 |     })
  563 |   }
  564 | 
  565 |   return {
  566 |     forward_to_agent: true,
  567 |     agent_prompt_context: {
  568 |       question: questionText,
  569 |       code_summary: codeContext.summary,
  570 |       compact_code_context: codeContext.prompt_context,
  571 |       compact_knowledge_context: knowledgeContext,
  572 |       max_context_chars: MAX_CONTEXT_CHARS,
  573 |     },
  574 |     metadata: {
  575 |       matched_source: null,
  576 |       matched_type: null,
  577 |       confidence: 0,
  578 |       fallback_reason: 'local_llm_unavailable',
  579 |       code_context: codeContext,
  580 |       knowledge_context: knowledgeContext,
  581 |     },
  582 |   }
  583 | }
  584 | 