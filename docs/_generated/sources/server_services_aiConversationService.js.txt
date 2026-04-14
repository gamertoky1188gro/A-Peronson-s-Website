    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { assistantReply } from './assistantService.js'
    4 | import { addLeadNoteForMatch } from './leadService.js'
    5 | import { getRequirementById } from './requirementService.js'
    6 | 
    7 | const USERS_FILE = 'users.json'
    8 | const MESSAGES_FILE = 'messages.json'
    9 | const LEADS_FILE = 'leads.json'
   10 | const LEAD_NOTES_FILE = 'lead_notes.json'
   11 | 
   12 | const SUMMARY_PREFIX = 'AI Summary:'
   13 | const NEGOTIATION_PREFIX = 'AI Negotiation:'
   14 | 
   15 | function parseMarketplaceMatchId(matchId = '') {
   16 |   const parts = String(matchId || '').split(':')
   17 |   if (parts.length !== 2) return null
   18 |   const requirementId = sanitizeString(parts[0], 120)
   19 |   const supplierId = sanitizeString(parts[1], 120)
   20 |   if (!requirementId || !supplierId) return null
   21 |   return { requirementId, supplierId }
   22 | }
   23 | 
   24 | function resolveOrgOwnerIdForUser(user) {
   25 |   if (!user) return ''
   26 |   if (String(user.role || '').toLowerCase() === 'agent') {
   27 |     return sanitizeString(String(user.org_owner_id || ''), 120)
   28 |   }
   29 |   return sanitizeString(String(user.id || ''), 120)
   30 | }
   31 | 
   32 | function normalizeMessageLine(message, usersById) {
   33 |   const sender = usersById.get(String(message.sender_id || ''))
   34 |   const name = sanitizeString(sender?.name || sender?.email || 'User', 80)
   35 |   const role = sanitizeString(sender?.role || '', 40)
   36 |   const body = sanitizeString(message.message || '', 400)
   37 |   return `${name}${role ? ` (${role})` : ''}: ${body}`
   38 | }
   39 | 
   40 | function pickRecentMessages(messages = [], limit = 18) {
   41 |   const sorted = [...messages].sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0))
   42 |   return sorted.slice(-limit)
   43 | }
   44 | 
   45 | function buildRequirementContext(requirement) {
   46 |   if (!requirement) return ''
   47 |   const lines = []
   48 |   if (requirement.title) lines.push(`Title: ${requirement.title}`)
   49 |   if (requirement.request_type) lines.push(`Type: ${requirement.request_type}`)
   50 |   if (requirement.quantity) lines.push(`Quantity: ${requirement.quantity}`)
   51 |   if (requirement.moq) lines.push(`MOQ: ${requirement.moq}`)
   52 |   if (requirement.price_range) lines.push(`Target price: ${requirement.price_range}`)
   53 |   if (requirement.timeline_days || requirement.delivery_timeline) {
   54 |     lines.push(`Timeline: ${requirement.timeline_days || requirement.delivery_timeline}`)
   55 |   }
   56 |   if (requirement.material) lines.push(`Material: ${requirement.material}`)
   57 |   if (requirement.color_pantone) lines.push(`Colors: ${requirement.color_pantone}`)
   58 |   return lines.join(' | ')
   59 | }
   60 | 
   61 | function fallbackSummary(messages, requirement) {
   62 |   const recent = pickRecentMessages(messages, 5)
   63 |   const last = recent[recent.length - 1]
   64 |   const lastLine = last ? sanitizeString(last.message || '', 220) : ''
   65 |   const requirementLine = buildRequirementContext(requirement)
   66 | 
   67 |   const bullets = [
   68 |     requirementLine ? `Buyer request: ${requirementLine}` : 'Buyer request: details in chat.',
   69 |     `Recent message count: ${messages.length}. Latest note: ${lastLine || 'No recent message.'}`,
   70 |     'Next step: confirm pricing, MOQ, and delivery timeline before contract.',
   71 |   ]
   72 | 
   73 |   return bullets.map((b) => `- ${b}`).join('\n')
   74 | }
   75 | 
   76 | async function generateAiText(prompt) {
   77 |   const response = await assistantReply('public_ws', prompt)
   78 |   const text = sanitizeString(response?.matched_answer || response?.answer || '', 1200)
   79 |   return text || ''
   80 | }
   81 | 
   82 | function extractSection(text, label) {
   83 |   const safeLabel = String(label || '').replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')
   84 |   const pattern = new RegExp(`${safeLabel}\\s*:\\s*([\\s\\S]*?)(?=\\n[A-Za-z\\s]+\\s*:|$)`, 'i')
   85 |   const match = String(text || '').match(pattern)
   86 |   return match ? sanitizeString(match[1].trim(), 600) : ''
   87 | }
   88 | 
   89 | export async function generateConversationSummary(matchId) {
   90 |   const safeMatchId = sanitizeString(String(matchId || ''), 180)
   91 |   if (!safeMatchId) return null
   92 | 
   93 |   const [messages, users] = await Promise.all([
   94 |     readJson(MESSAGES_FILE),
   95 |     readJson(USERS_FILE),
   96 |   ])
   97 | 
   98 |   const threadMessages = (Array.isArray(messages) ? messages : [])
   99 |     .filter((m) => String(m.match_id || '') === safeMatchId && String(m.message || '').trim())
  100 | 
  101 |   if (threadMessages.length === 0) return null
  102 | 
  103 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  104 |   const marketplace = parseMarketplaceMatchId(safeMatchId)
  105 |   const requirement = marketplace ? await getRequirementById(marketplace.requirementId) : null
  106 |   const summaryContext = buildRequirementContext(requirement)
  107 |   const lines = pickRecentMessages(threadMessages).map((msg) => normalizeMessageLine(msg, usersById))
  108 | 
  109 |   const prompt = [
  110 |     'Summarize this B2B buyer-supplier chat in 3 bullet points.',
  111 |     'Include current negotiation status, missing info, and a recommended next step.',
  112 |     summaryContext ? `Buyer request: ${summaryContext}` : '',
  113 |     'Conversation:',
  114 |     lines.join('\n'),
  115 |     'Return format:',
  116 |     'Summary: <short paragraph>\n',
  117 |     'Next steps: <bullets>\n',
  118 |     'Suggested reply: <1-2 sentences>',
  119 |   ].filter(Boolean).join('\n')
  120 | 
  121 |   const aiText = await generateAiText(prompt)
  122 |   if (!aiText) {
  123 |     return { summary: fallbackSummary(threadMessages, requirement), suggested_reply: '', raw: '' }
  124 |   }
  125 | 
  126 |   const summary = extractSection(aiText, 'Summary') || aiText
  127 |   const nextSteps = extractSection(aiText, 'Next steps')
  128 |   const suggestedReply = extractSection(aiText, 'Suggested reply')
  129 | 
  130 |   const formatted = [
  131 |     summary ? `- ${summary}` : '',
  132 |     nextSteps ? `- Next steps: ${nextSteps}` : '',
  133 |   ].filter(Boolean).join('\n')
  134 | 
  135 |   return {
  136 |     summary: formatted || aiText,
  137 |     suggested_reply: suggestedReply,
  138 |     raw: aiText,
  139 |   }
  140 | }
  141 | 
  142 | function pickLatestNote(notes = [], prefix = '') {
  143 |   const candidates = notes
  144 |     .filter((note) => String(note.note || '').startsWith(prefix))
  145 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  146 |   return candidates[0] || null
  147 | }
  148 | 
  149 | async function shouldAutoSummarize(matchId, orgOwnerId) {
  150 |   const leads = await readJson(LEADS_FILE)
  151 |   const lead = (Array.isArray(leads) ? leads : [])
  152 |     .find((row) => String(row.match_id || '') === String(matchId || '') && String(row.org_owner_id || '') === String(orgOwnerId || ''))
  153 | 
  154 |   if (!lead) return false
  155 | 
  156 |   const notes = await readJson(LEAD_NOTES_FILE)
  157 |   const leadNotes = (Array.isArray(notes) ? notes : []).filter((n) => String(n.lead_id || '') === String(lead.id))
  158 |   const latest = pickLatestNote(leadNotes, SUMMARY_PREFIX)
  159 | 
  160 |   if (!latest) return true
  161 | 
  162 |   const lastSummaryAt = new Date(latest.created_at || 0).getTime()
  163 |   if (!Number.isFinite(lastSummaryAt)) return true
  164 | 
  165 |   const messages = await readJson(MESSAGES_FILE)
  166 |   const threadMessages = (Array.isArray(messages) ? messages : []).filter((m) => String(m.match_id || '') === String(matchId || ''))
  167 | 
  168 |   const sinceSummary = threadMessages.filter((m) => new Date(m.timestamp || 0).getTime() > lastSummaryAt)
  169 |   if (sinceSummary.length >= 6) return true
  170 | 
  171 |   const hoursSince = (Date.now() - lastSummaryAt) / (1000 * 60 * 60)
  172 |   return hoursSince >= 24
  173 | }
  174 | 
  175 | export async function autoSummarizeMatch({ matchId, orgOwnerId }) {
  176 |   const safeMatchId = sanitizeString(String(matchId || ''), 180)
  177 |   const safeOrgId = sanitizeString(String(orgOwnerId || ''), 120)
  178 |   if (!safeMatchId || !safeOrgId) return null
  179 | 
  180 |   const shouldRun = await shouldAutoSummarize(safeMatchId, safeOrgId)
  181 |   if (!shouldRun) return null
  182 | 
  183 |   const summary = await generateConversationSummary(safeMatchId)
  184 |   if (!summary?.summary) return null
  185 | 
  186 |   const note = `${SUMMARY_PREFIX} ${summary.summary}${summary.suggested_reply ? `\nSuggested reply: ${summary.suggested_reply}` : ''}`
  187 |   await addLeadNoteForMatch({ matchId: safeMatchId, orgOwnerId: safeOrgId, note, authorId: 'system' })
  188 |   return summary
  189 | }
  190 | 
  191 | export async function generateNegotiationHelper(matchId) {
  192 |   const safeMatchId = sanitizeString(String(matchId || ''), 180)
  193 |   if (!safeMatchId) return null
  194 | 
  195 |   const [messages, users] = await Promise.all([
  196 |     readJson(MESSAGES_FILE),
  197 |     readJson(USERS_FILE),
  198 |   ])
  199 | 
  200 |   const threadMessages = (Array.isArray(messages) ? messages : [])
  201 |     .filter((m) => String(m.match_id || '') === safeMatchId && String(m.message || '').trim())
  202 | 
  203 |   if (threadMessages.length === 0) return null
  204 | 
  205 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  206 |   const marketplace = parseMarketplaceMatchId(safeMatchId)
  207 |   const requirement = marketplace ? await getRequirementById(marketplace.requirementId) : null
  208 |   const summaryContext = buildRequirementContext(requirement)
  209 |   const lines = pickRecentMessages(threadMessages, 12).map((msg) => normalizeMessageLine(msg, usersById))
  210 | 
  211 |   const prompt = [
  212 |     'You are a negotiation assistant for B2B textile sourcing.',
  213 |     'Give negotiation guidance based on the chat. Provide: Key risks, Missing info, Suggested reply.',
  214 |     summaryContext ? `Buyer request: ${summaryContext}` : '',
  215 |     'Conversation:',
  216 |     lines.join('\n'),
  217 |     'Return format:',
  218 |     'Key risks: <bullets>\n',
  219 |     'Missing info: <bullets>\n',
  220 |     'Suggested reply: <1-2 sentences>\n',
  221 |     'Strategy note: <short paragraph>',
  222 |   ].filter(Boolean).join('\n')
  223 | 
  224 |   const aiText = await generateAiText(prompt)
  225 |   if (!aiText) {
  226 |     return {
  227 |       guidance: 'Focus on MOQ, pricing, and delivery timeline. Confirm materials and compliance needs before final quote.',
  228 |       suggested_reply: 'Thanks for the details. Could you confirm MOQ, target price range, and delivery timeline so we can quote accurately?',
  229 |       raw: '',
  230 |     }
  231 |   }
  232 | 
  233 |   const risks = extractSection(aiText, 'Key risks')
  234 |   const missing = extractSection(aiText, 'Missing info')
  235 |   const reply = extractSection(aiText, 'Suggested reply')
  236 |   const strategy = extractSection(aiText, 'Strategy note')
  237 | 
  238 |   const guidance = [
  239 |     risks ? `Key risks: ${risks}` : '',
  240 |     missing ? `Missing info: ${missing}` : '',
  241 |     strategy ? `Strategy: ${strategy}` : '',
  242 |   ].filter(Boolean).join('\n')
  243 | 
  244 |   return {
  245 |     guidance: guidance || aiText,
  246 |     suggested_reply: reply,
  247 |     raw: aiText,
  248 |   }
  249 | }
  250 | 
  251 | export async function recordNegotiationNote({ matchId, orgOwnerId, helper }) {
  252 |   const safeMatchId = sanitizeString(String(matchId || ''), 180)
  253 |   const safeOrgId = sanitizeString(String(orgOwnerId || ''), 120)
  254 |   if (!safeMatchId || !safeOrgId || !helper?.guidance) return null
  255 | 
  256 |   const note = `${NEGOTIATION_PREFIX} ${helper.guidance}${helper.suggested_reply ? `\nSuggested reply: ${helper.suggested_reply}` : ''}`
  257 |   await addLeadNoteForMatch({ matchId: safeMatchId, orgOwnerId: safeOrgId, note, authorId: 'system' })
  258 |   return note
  259 | }
  260 | 
  261 | export async function recordSummaryNote({ matchId, orgOwnerId, summary }) {
  262 |   const safeMatchId = sanitizeString(String(matchId || ''), 180)
  263 |   const safeOrgId = sanitizeString(String(orgOwnerId || ''), 120)
  264 |   if (!safeMatchId || !safeOrgId || !summary?.summary) return null
  265 | 
  266 |   const note = `${SUMMARY_PREFIX} ${summary.summary}${summary.suggested_reply ? `\\nSuggested reply: ${summary.suggested_reply}` : ''}`
  267 |   await addLeadNoteForMatch({ matchId: safeMatchId, orgOwnerId: safeOrgId, note, authorId: 'system' })
  268 |   return note
  269 | }
  270 | 
  271 | export async function resolveOrgOwnerFromMatch(matchId, senderId) {
  272 |   const users = await readJson(USERS_FILE)
  273 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  274 |   if (senderId) {
  275 |     const sender = usersById.get(String(senderId))
  276 |     const orgOwnerId = resolveOrgOwnerIdForUser(sender)
  277 |     if (orgOwnerId) return orgOwnerId
  278 |   }
  279 | 
  280 |   const marketplace = parseMarketplaceMatchId(matchId)
  281 |   if (marketplace) {
  282 |     const supplierUser = usersById.get(String(marketplace.supplierId))
  283 |     const orgOwnerId = resolveOrgOwnerIdForUser(supplierUser)
  284 |     if (orgOwnerId) return orgOwnerId
  285 |   }
  286 | 
  287 |   return ''
  288 | }
  289 | 
  290 | export function pickLatestAiSummary(notes = []) {
  291 |   return pickLatestNote(notes, SUMMARY_PREFIX)
  292 | }
  293 | 
  294 | export function pickLatestNegotiationNote(notes = []) {
  295 |   return pickLatestNote(notes, NEGOTIATION_PREFIX)
  296 | }
  297 | 