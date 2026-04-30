    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { createNotification } from './notificationService.js'
    5 | 
    6 | const USERS_FILE = 'users.json'
    7 | const VIOLATIONS_FILE = 'violations.json'
    8 | 
    9 | const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
   10 | const URL_REGEX = /(https?:\/\/|www\.)\S+/i
   11 | const DOMAIN_REGEX = /\b[a-z0-9.-]+\.(com|net|org|io|me|bd|uk|co|in|pk|cn|ru|jp|sg|my|ae|sa|de|fr|it|es|nl|eu|us)\b/i
   12 | const PHONE_REGEX = /(?:\+?\d[\d\s\-().]{8,}\d)/
   13 | 
   14 | const CONTACT_KEYWORDS = [
   15 |   // English
   16 |   'whatsapp',
   17 |   'wa.me',
   18 |   'wa',
   19 |   'telegram',
   20 |   'tg',
   21 |   'imo',
   22 |   'wechat',
   23 |   'line',
   24 |   'viber',
   25 |   'signal',
   26 |   'facebook',
   27 |   'fb',
   28 |   'instagram',
   29 |   'ig',
   30 |   'messenger',
   31 |   'freelancer',
   32 |   'fiverr',
   33 |   // Bangla (best-effort)
   34 |   'হোয়াটসঅ্যাপ',
   35 |   'হোয়াটসঅ্যাপ',
   36 |   'টেলিগ্রাম',
   37 |   'ইমো',
   38 |   'উইচ্যাট',
   39 |   'ফেসবুক',
   40 |   'ইনস্টাগ্রাম',
   41 |   'মেসেঞ্জার',
   42 | ]
   43 | 
   44 | const OBSCENE_KEYWORDS = [
   45 |   'porn',
   46 |   'xxx',
   47 |   'nude',
   48 |   'sex',
   49 |   'fuck',
   50 |   'blowjob',
   51 |   'pussy',
   52 |   'dick',
   53 |   // Bangla
   54 |   'অশ্লীল',
   55 |   'নগ্ন',
   56 |   'পর্ন',
   57 | ]
   58 | 
   59 | function digitsOnly(value = '') {
   60 |   return String(value || '').replace(/\D/g, '')
   61 | }
   62 | 
   63 | const NUMBER_WORDS = new Map([
   64 |   ['zero', '0'],
   65 |   ['oh', '0'],
   66 |   ['one', '1'],
   67 |   ['two', '2'],
   68 |   ['three', '3'],
   69 |   ['four', '4'],
   70 |   ['five', '5'],
   71 |   ['six', '6'],
   72 |   ['seven', '7'],
   73 |   ['eight', '8'],
   74 |   ['nine', '9'],
   75 |   ['ten', '10'],
   76 | ])
   77 | 
   78 | function looksLikePhone(match = '') {
   79 |   const digits = digitsOnly(match)
   80 |   // Keep it strict-ish to avoid matching quantities: 10+ digits is usually a phone number.
   81 |   return digits.length >= 10
   82 | }
   83 | 
   84 | function normalizeText(text) {
   85 |   return String(text || '').trim()
   86 | }
   87 | 
   88 | function lower(text) {
   89 |   return normalizeText(text).toLowerCase()
   90 | }
   91 | 
   92 | function normalizeNumberWords(text = '') {
   93 |   let output = lower(text)
   94 |   for (const [word, digit] of NUMBER_WORDS.entries()) {
   95 |     const pattern = new RegExp(`\\b${word}\\b`, 'g')
   96 |     output = output.replace(pattern, digit)
   97 |   }
   98 |   return output
   99 | }
  100 | 
  101 | function hasSplitEmailTokens(text = '') {
  102 |   const l = normalizeNumberWords(text)
  103 |   const hasAt = /\b(at|\(at\)|@)\b/.test(l)
  104 |   const hasDot = /\b(dot|\(dot\)|\.)\b/.test(l)
  105 |   const hasTld = /\b(com|net|org|io|me|bd|uk|co|in|pk|cn|ru|jp|sg|my|ae|sa|de|fr|it|es|nl|eu|us)\b/.test(l)
  106 |   const hasProvider = /(gmail|yahoo|hotmail|outlook|icloud)/.test(l)
  107 |   return (hasAt && hasDot && hasTld) || (hasProvider && hasAt && hasDot)
  108 | }
  109 | 
  110 | function scanOutsideContact(text) {
  111 |   const raw = normalizeText(text)
  112 |   if (!raw) return null
  113 | 
  114 |   const normalized = normalizeNumberWords(raw)
  115 | 
  116 |   if (EMAIL_REGEX.test(raw) || EMAIL_REGEX.test(normalized)) {
  117 |     return { kind: 'outside_contact', reason: 'email_detected', signals: ['email'] }
  118 |   }
  119 | 
  120 |   if (URL_REGEX.test(raw) || DOMAIN_REGEX.test(raw) || URL_REGEX.test(normalized) || DOMAIN_REGEX.test(normalized)) {
  121 |     return { kind: 'outside_contact', reason: 'url_detected', signals: ['url'] }
  122 |   }
  123 | 
  124 |   const phoneMatch = normalized.match(PHONE_REGEX) || raw.match(PHONE_REGEX)
  125 |   if (phoneMatch && looksLikePhone(phoneMatch[0] || '')) {
  126 |     return { kind: 'outside_contact', reason: 'phone_detected', signals: ['phone'] }
  127 |   }
  128 | 
  129 |   const l = normalized
  130 |   const keywordHit = CONTACT_KEYWORDS.find((k) => l.includes(k))
  131 |   if (keywordHit) {
  132 |     // If the user references an outside platform AND includes an identifier-like signal, treat it as sharing.
  133 |     const identifierSignal = /[@.]|\b(id|username|user|handle|contact|call|dm)\b/.test(l) || looksLikePhone(l)
  134 |     return {
  135 |       kind: 'outside_contact',
  136 |       reason: identifierSignal ? `platform_contact:${keywordHit}` : `platform_reference:${keywordHit}`,
  137 |       signals: ['platform'],
  138 |     }
  139 |   }
  140 | 
  141 |   // Split email patterns (e.g., "name at gmail dot com").
  142 |   if (hasSplitEmailTokens(l)) {
  143 |     return { kind: 'outside_contact', reason: 'split_email_pattern', signals: ['split_email'] }
  144 |   }
  145 | 
  146 |   return null
  147 | }
  148 | 
  149 | function scanObscene(text) {
  150 |   const raw = normalizeText(text)
  151 |   if (!raw) return null
  152 |   const l = lower(raw)
  153 |   const hit = OBSCENE_KEYWORDS.find((k) => l.includes(k))
  154 |   if (!hit) return null
  155 |   return { kind: 'obscene', reason: `obscene_keyword:${hit}`, signals: ['obscene'] }
  156 | }
  157 | 
  158 | export function scanPolicyText(text) {
  159 |   // Order matters: outside-contact is the highest business risk.
  160 |   return scanOutsideContact(text) || scanObscene(text) || null
  161 | }
  162 | 
  163 | function scanOutsideContactAcrossTexts(texts = []) {
  164 |   const parts = Array.isArray(texts) ? texts.map((t) => String(t || '').trim()).filter(Boolean) : []
  165 |   if (!parts.length) return null
  166 | 
  167 |   const joined = parts.join(' ')
  168 |   const l = normalizeNumberWords(joined)
  169 | 
  170 |   // Split phone numbers across multiple messages: joining + digit extraction catches it.
  171 |   const digits = digitsOnly(l)
  172 |   if (digits.length >= 10) {
  173 |     return { kind: 'outside_contact', reason: 'phone_detected_split', signals: ['phone_split'] }
  174 |   }
  175 | 
  176 |   // Split email patterns across messages (best-effort): "name" + "gmail" + "at" + "dot" + "com".
  177 |   if (hasSplitEmailTokens(l)) {
  178 |     return { kind: 'outside_contact', reason: 'split_email_pattern_across_messages', signals: ['split_email'] }
  179 |   }
  180 | 
  181 |   // Platform keyword split + identifier-like signals.
  182 |   const keywordHit = CONTACT_KEYWORDS.find((k) => l.includes(k))
  183 |   if (keywordHit) {
  184 |     const identifierSignal = /[@.]|\b(id|username|user|handle|contact|call|dm)\b/.test(l) || digits.length >= 8
  185 |     if (identifierSignal) {
  186 |       return { kind: 'outside_contact', reason: `platform_contact_split:${keywordHit}`, signals: ['platform'] }
  187 |     }
  188 |   }
  189 | 
  190 |   return null
  191 | }
  192 | 
  193 | function penaltyForStrike(strikes) {
  194 |   // Shaun requirement (project.md):
  195 |   // - First 3 strikes: delete + warn (no restriction window).
  196 |   // - Then: 24h → 48h → 7d → ban.
  197 |   if (strikes <= 3) return { action: 'warn', restrict_hours: 0, ban: false }
  198 |   if (strikes === 4) return { action: 'restrict', restrict_hours: 24, ban: false }
  199 |   if (strikes === 5) return { action: 'restrict', restrict_hours: 48, ban: false }
  200 |   if (strikes === 6) return { action: 'restrict', restrict_hours: 24 * 7, ban: false }
  201 |   return { action: 'ban', restrict_hours: 0, ban: true }
  202 | }
  203 | 
  204 | function restrictionUntil(hours) {
  205 |   if (!hours || hours <= 0) return null
  206 |   return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
  207 | }
  208 | 
  209 | export function assertMessagingAllowed(user) {
  210 |   if (!user) return
  211 |   const status = String(user.status || 'active').toLowerCase()
  212 |   if (status === 'banned') {
  213 |     const err = new Error('Your account has been banned due to repeated policy violations.')
  214 |     err.status = 403
  215 |     err.code = 'ACCOUNT_BANNED'
  216 |     throw err
  217 |   }
  218 | 
  219 |   const untilRaw = String(user.messaging_restricted_until || '').trim()
  220 |   if (!untilRaw) return
  221 |   const until = new Date(untilRaw)
  222 |   if (Number.isNaN(until.getTime())) return
  223 |   if (until.getTime() <= Date.now()) return
  224 | 
  225 |   const err = new Error(`Messaging is restricted until ${until.toLocaleString()}. Please review policy notifications.`)
  226 |   err.status = 403
  227 |   err.code = 'MESSAGING_RESTRICTED'
  228 |   err.restricted_until = untilRaw
  229 |   throw err
  230 | }
  231 | 
  232 | export async function recordPolicyViolation({ actor_id, kind, reason, entity_type = '', entity_id = '', content = '', metadata = {} }) {
  233 |   const actorId = sanitizeString(String(actor_id || ''), 120)
  234 |   if (!actorId) return null
  235 | 
  236 |   const users = await readJson(USERS_FILE)
  237 |   const idx = users.findIndex((u) => String(u.id) === actorId)
  238 |   if (idx < 0) return null
  239 | 
  240 |   const user = users[idx]
  241 |   const prevStrikes = Number(user.policy_strikes || 0)
  242 |   const strikes = Math.max(0, prevStrikes) + 1
  243 |   const penalty = penaltyForStrike(strikes)
  244 |   const nextRestrictionUntil = penalty.restrict_hours ? restrictionUntil(penalty.restrict_hours) : ''
  245 | 
  246 |   // Keep the longest restriction window if multiple violations happen close together.
  247 |   const currentUntil = String(user.messaging_restricted_until || '').trim()
  248 |   const keepUntil = (() => {
  249 |     if (!currentUntil) return nextRestrictionUntil
  250 |     if (!nextRestrictionUntil) return currentUntil
  251 |     return new Date(nextRestrictionUntil).getTime() > new Date(currentUntil).getTime() ? nextRestrictionUntil : currentUntil
  252 |   })()
  253 | 
  254 |   users[idx] = {
  255 |     ...user,
  256 |     policy_strikes: strikes,
  257 |     messaging_restricted_until: keepUntil,
  258 |     status: penalty.ban ? 'banned' : (user.status || 'active'),
  259 |     policy_updated_at: new Date().toISOString(),
  260 |   }
  261 | 
  262 |   await writeJson(USERS_FILE, users)
  263 | 
  264 |   const violations = await readJson(VIOLATIONS_FILE)
  265 |   const row = {
  266 |     id: crypto.randomUUID(),
  267 |     actor_id: actorId,
  268 |     kind: sanitizeString(String(kind || ''), 60),
  269 |     reason: sanitizeString(String(reason || ''), 120),
  270 |     entity_type: sanitizeString(String(entity_type || ''), 60),
  271 |     entity_id: sanitizeString(String(entity_id || ''), 160),
  272 |     snippet: sanitizeString(String(content || ''), 240),
  273 |     strikes,
  274 |     action: penalty.action,
  275 |     restrict_hours: penalty.restrict_hours,
  276 |     messaging_restricted_until: keepUntil,
  277 |     meta: metadata && typeof metadata === 'object' ? metadata : {},
  278 |     created_at: new Date().toISOString(),
  279 |   }
  280 |   violations.push(row)
  281 |   await writeJson(VIOLATIONS_FILE, violations)
  282 | 
  283 |   const guidance = 'Sharing phone numbers, emails, WhatsApp/Telegram, social links, or outside contact methods is not allowed on GarTexHub. Use the built-in chat/call system.'
  284 |   const escalation = 'Enforcement ladder: 3 warnings → 24h restriction → 48h restriction → 7d restriction → permanent ban.'
  285 |   const penaltyLine = penalty.ban
  286 |     ? 'Your account is now banned due to repeated violations.'
  287 |     : (keepUntil ? `Messaging restricted until ${keepUntil}.` : 'This is a warning. Repeated violations will lead to restrictions/bans.')
  288 | 
  289 |   await createNotification(actorId, {
  290 |     type: 'policy_violation',
  291 |     entity_type: entity_type || 'policy',
  292 |     entity_id: entity_id || actorId,
  293 |     message: `Policy violation detected (${row.reason}). Content removed. ${penaltyLine} ${escalation}`,
  294 |     meta: {
  295 |       strikes,
  296 |       kind: row.kind,
  297 |       guidance,
  298 |       escalation,
  299 |       messaging_restricted_until: keepUntil,
  300 |     },
  301 |   })
  302 | 
  303 |   const adminTargets = users.filter((u) => ['owner', 'admin'].includes(String(u.role || '').toLowerCase()))
  304 |   await Promise.all(adminTargets.map((admin) => createNotification(admin.id, {
  305 |     type: 'policy_violation_admin',
  306 |     entity_type: entity_type || 'policy',
  307 |     entity_id: entity_id || actorId,
  308 |     message: `Policy violation by ${user.name || user.email || actorId} (${row.reason}). Strike ${strikes}. Action: ${penalty.action}.`,
  309 |     meta: {
  310 |       actor_id: actorId,
  311 |       strikes,
  312 |       action: penalty.action,
  313 |       messaging_restricted_until: keepUntil,
  314 |     },
  315 |   })))
  316 | 
  317 |   return row
  318 | }
  319 | 
  320 | export async function moderateTextOrRedact({ actor, text, entity_type = '', entity_id = '' }) {
  321 |   const raw = normalizeText(text)
  322 |   const scan = scanPolicyText(raw)
  323 |   if (!scan) return { text: raw, moderated: false, reason: '' }
  324 | 
  325 |   await recordPolicyViolation({
  326 |     actor_id: actor?.id,
  327 |     kind: scan.kind,
  328 |     reason: scan.reason,
  329 |     entity_type,
  330 |     entity_id,
  331 |     content: raw,
  332 |   })
  333 | 
  334 |   const redacted = scan.kind === 'outside_contact'
  335 |     ? '[Removed: outside contact sharing is not allowed]'
  336 |     : '[Removed: content violates platform policy]'
  337 | 
  338 |   return { text: redacted, moderated: true, reason: scan.reason }
  339 | }
  340 | 
  341 | export async function moderateTextOrRedactWithContext({ actor, text, context_texts = [], entity_type = '', entity_id = '' }) {
  342 |   // First run the single-message scan.
  343 |   const single = await moderateTextOrRedact({ actor, text, entity_type, entity_id })
  344 |   if (single.moderated) return single
  345 | 
  346 |   // Then run a "conversation-level" scan (project.md): catch split outside-contact sharing tricks.
  347 |   const scan = scanOutsideContactAcrossTexts([...(Array.isArray(context_texts) ? context_texts : []), single.text])
  348 |   if (!scan) return single
  349 | 
  350 |   await recordPolicyViolation({
  351 |     actor_id: actor?.id,
  352 |     kind: scan.kind,
  353 |     reason: scan.reason,
  354 |     entity_type,
  355 |     entity_id,
  356 |     content: single.text,
  357 |     metadata: { signals: scan.signals, context_window: Math.min(6, (context_texts || []).length + 1) },
  358 |   })
  359 | 
  360 |   return { text: '[Removed: outside contact sharing is not allowed]', moderated: true, reason: scan.reason }
  361 | }
  362 | 