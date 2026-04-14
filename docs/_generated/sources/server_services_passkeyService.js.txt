    1 | import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
    2 | import { isoCBOR } from '@simplewebauthn/server/helpers'
    3 | import prisma from '../utils/prisma.js'
    4 | import { findUserByEmail, findUserById, findUserByMemberId } from './userService.js'
    5 | 
    6 | const PASSKEY_STATE_KEY = 'passkeys'
    7 | const CHALLENGE_TTL_MS = 5 * 60 * 1000
    8 | const registrationChallenges = new Map()
    9 | const authenticationChallenges = new Map()
   10 | const DISCOVERABLE_KEY = 'discoverable'
   11 | 
   12 | function pruneExpired(map) {
   13 |   const now = Date.now()
   14 |   for (const [key, value] of map.entries()) {
   15 |     if (!value || now > value.expiresAt) {
   16 |       map.delete(key)
   17 |     }
   18 |   }
   19 | }
   20 | 
   21 | function storeChallenge(map, key, challenge) {
   22 |   pruneExpired(map)
   23 |   map.set(String(key), { challenge, expiresAt: Date.now() + CHALLENGE_TTL_MS })
   24 | }
   25 | 
   26 | function readChallenge(map, key) {
   27 |   pruneExpired(map)
   28 |   const entry = map.get(String(key))
   29 |   return entry?.challenge || ''
   30 | }
   31 | 
   32 | function normalizeOrigin(req) {
   33 |   const origin = String(req.headers.origin || '').trim()
   34 |   if (origin) return origin
   35 |   const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'http')
   36 |   const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
   37 |   if (!host) return ''
   38 |   return `${proto}://${host}`
   39 | }
   40 | 
   41 | function resolveRpId(req, origin) {
   42 |   try {
   43 |     const target = origin || normalizeOrigin(req)
   44 |     if (target) return new URL(target).hostname
   45 |   } catch {
   46 |     // fallthrough
   47 |   }
   48 |   const host = String(req.hostname || '').trim()
   49 |   return host.includes(':') ? host.split(':')[0] : host
   50 | }
   51 | 
   52 | function toBuffer(value = '') {
   53 |   if (!value) return Buffer.alloc(0)
   54 |   return Buffer.from(value, 'base64url')
   55 | }
   56 | 
   57 | function encodeBase64Url(buffer) {
   58 |   if (!buffer) return ''
   59 |   return Buffer.from(buffer).toString('base64url')
   60 | }
   61 | 
   62 | function normalizeBase64Url(value) {
   63 |   if (!value || typeof value !== 'string') return ''
   64 |   const trimmed = value.trim()
   65 |   if (!trimmed) return ''
   66 |   if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed
   67 |   try {
   68 |     return Buffer.from(trimmed, 'base64').toString('base64url')
   69 |   } catch {
   70 |     return ''
   71 |   }
   72 | }
   73 | 
   74 | function normalizeCredentialId(credentialID, credential) {
   75 |   if (typeof credentialID === 'string') {
   76 |     const normalized = normalizeBase64Url(credentialID)
   77 |     if (normalized) return normalized
   78 |   }
   79 |   if (credentialID) {
   80 |     const encoded = encodeBase64Url(credentialID)
   81 |     if (encoded) return encoded
   82 |   }
   83 |   const rawId = credential?.rawId
   84 |   if (rawId && typeof rawId !== 'string') {
   85 |     const rawEncoded = encodeBase64Url(rawId)
   86 |     if (rawEncoded) return rawEncoded
   87 |   }
   88 |   return normalizeBase64Url(credential?.id)
   89 |     || normalizeBase64Url(typeof rawId === 'string' ? rawId : '')
   90 | }
   91 | 
   92 | function isCosePublicKey(value) {
   93 |   if (!value || typeof value !== 'string') return false
   94 |   try {
   95 |     const decoded = isoCBOR.decodeFirst(toBuffer(value))
   96 |     return Boolean(decoded && typeof decoded.get === 'function')
   97 |   } catch {
   98 |     return false
   99 |   }
  100 | }
  101 | 
  102 | function toUserIdBuffer(value) {
  103 |   return Buffer.from(String(value || ''), 'utf8')
  104 | }
  105 | 
  106 | function sanitizePasskeys(passkeys = []) {
  107 |   return (Array.isArray(passkeys) ? passkeys : []).map((key) => ({
  108 |     id: key.id,
  109 |     name: key.name || '',
  110 |     created_at: key.created_at || '',
  111 |     last_used_at: key.last_used_at || '',
  112 |     transports: Array.isArray(key.transports) ? key.transports : [],
  113 |   }))
  114 | }
  115 | 
  116 | function sanitizeStoredPasskeys(passkeys = []) {
  117 |   return (Array.isArray(passkeys) ? passkeys : []).map((key) => ({
  118 |     id: key.id,
  119 |     publicKey: key.publicKey,
  120 |     counter: Number(key.counter || 0),
  121 |     name: key.name || '',
  122 |     transports: Array.isArray(key.transports) ? key.transports : [],
  123 |     created_at: key.created_at || '',
  124 |     last_used_at: key.last_used_at || '',
  125 |   }))
  126 | }
  127 | 
  128 | function isStoredPasskeyValid(key) {
  129 |   return Boolean(
  130 |     key
  131 |     && typeof key.id === 'string'
  132 |     && key.id.trim()
  133 |     && typeof key.publicKey === 'string'
  134 |     && key.publicKey.trim()
  135 |     && isCosePublicKey(key.publicKey),
  136 |   )
  137 | }
  138 | 
  139 | async function readPasskeyState() {
  140 |   const record = await prisma.appState.findUnique({ where: { key: PASSKEY_STATE_KEY } })
  141 |   const data = record?.data
  142 |   const passkeys = (data && typeof data === 'object' && Array.isArray(data.passkeys)) ? data.passkeys : []
  143 |   const cleaned = passkeys.filter(isStoredPasskeyValid)
  144 |   if (cleaned.length !== passkeys.length) {
  145 |     await writePasskeyState(cleaned)
  146 |   }
  147 |   return cleaned
  148 | }
  149 | 
  150 | async function writePasskeyState(passkeys) {
  151 |   const data = { passkeys }
  152 |   await prisma.appState.upsert({
  153 |     where: { key: PASSKEY_STATE_KEY },
  154 |     update: { data },
  155 |     create: { key: PASSKEY_STATE_KEY, data },
  156 |   })
  157 | }
  158 | 
  159 | async function syncUserProfilePasskeys(userId, passkeys) {
  160 |   const user = await findUserById(userId)
  161 |   if (!user) return
  162 |   const profile = user.profile && typeof user.profile === 'object' ? user.profile : {}
  163 |   const nextProfile = { ...profile, passkeys: sanitizeStoredPasskeys(passkeys) }
  164 |   try {
  165 |     await prisma.user.update({ where: { id: userId }, data: { profile: nextProfile } })
  166 |   } catch (error) {
  167 |     // Non-blocking: profile sync failures should not block passkey flow
  168 |     // but log to help debug missing passkey lists.
  169 |     console.error('[passkeys] Failed to sync user profile passkeys', error)
  170 |   }
  171 | }
  172 | 
  173 | async function listPasskeysByUser(userId) {
  174 |   const user = await findUserById(userId)
  175 |   if (!user) return []
  176 |   const profileRaw = Array.isArray(user.profile?.passkeys) ? user.profile.passkeys : []
  177 |   const profileKeys = profileRaw.filter(isStoredPasskeyValid)
  178 |   if (profileRaw.length && profileKeys.length !== profileRaw.length) {
  179 |     await syncUserProfilePasskeys(userId, profileKeys)
  180 |   }
  181 |   const profileWithUser = profileKeys.map((key) => ({ ...key, user_id: userId }))
  182 |   const passkeys = await readPasskeyState()
  183 |   const stateKeys = passkeys.filter((key) => String(key.user_id) === String(userId))
  184 |   const merged = [...profileWithUser]
  185 |   stateKeys.forEach((key) => {
  186 |     if (!merged.some((existing) => existing.id === key.id)) {
  187 |       merged.push(key)
  188 |     }
  189 |   })
  190 |   if (merged.length && profileKeys.length !== merged.length) {
  191 |     await syncUserProfilePasskeys(userId, merged)
  192 |   }
  193 |   return merged
  194 | }
  195 | 
  196 | async function findPasskeyByCredentialId(credentialId) {
  197 |   if (!credentialId) return null
  198 |   const passkeys = await readPasskeyState()
  199 |   return passkeys.find((key) => key.id === credentialId) || null
  200 | }
  201 | 
  202 | export async function listUserPasskeys(userId) {
  203 |   const user = await findUserById(userId)
  204 |   if (!user) return []
  205 |   let passkeys = await listPasskeysByUser(userId)
  206 |   if (!passkeys.length) {
  207 |     const fallback = Array.isArray(user.profile?.passkeys) ? user.profile.passkeys : []
  208 |     passkeys = fallback.filter(isStoredPasskeyValid).map((key) => ({ ...key, user_id: userId }))
  209 |     if (passkeys.length) {
  210 |       const all = await readPasskeyState()
  211 |       const merged = [...all, ...passkeys.filter((key) => !all.some((p) => p.id === key.id))]
  212 |       await writePasskeyState(merged)
  213 |     }
  214 |   }
  215 |   return sanitizePasskeys(passkeys)
  216 | }
  217 | 
  218 | export async function removeUserPasskey(userId, credentialId) {
  219 |   const user = await findUserById(userId)
  220 |   if (!user) return null
  221 |   const passkeys = await readPasskeyState()
  222 |   const next = passkeys.filter((key) => !(String(key.user_id) === String(userId) && key.id === credentialId))
  223 |   await writePasskeyState(next)
  224 |   const remaining = next.filter((key) => String(key.user_id) === String(userId))
  225 |   await syncUserProfilePasskeys(userId, remaining)
  226 |   return sanitizePasskeys(remaining)
  227 | }
  228 | 
  229 | export async function createRegistrationOptions({ userId, req, rpName = 'GartexHub' }) {
  230 |   const user = await findUserById(userId)
  231 |   if (!user) {
  232 |     const err = new Error('User not found')
  233 |     err.status = 404
  234 |     throw err
  235 |   }
  236 |   const origin = normalizeOrigin(req)
  237 |   const rpID = resolveRpId(req, origin) || String(process.env.PASSKEY_RP_ID || '')
  238 |   if (!rpID) {
  239 |     const err = new Error('Passkey RP ID is missing')
  240 |     err.status = 500
  241 |     throw err
  242 |   }
  243 |   const passkeys = await listPasskeysByUser(user.id)
  244 |   const options = await generateRegistrationOptions({
  245 |     rpName,
  246 |     rpID,
  247 |     userID: toUserIdBuffer(user.id),
  248 |     userName: user.email || user.name || user.id,
  249 |     userDisplayName: user.name || user.email || 'User',
  250 |     attestationType: 'none',
  251 |     authenticatorSelection: {
  252 |       residentKey: 'preferred',
  253 |       userVerification: 'preferred',
  254 |     },
  255 |     excludeCredentials: passkeys.map((key) => ({
  256 |       id: key.id,
  257 |       type: 'public-key',
  258 |       transports: Array.isArray(key.transports) ? key.transports : undefined,
  259 |     })),
  260 |   })
  261 |   if (!options?.challenge) {
  262 |     const err = new Error('Passkey registration options missing challenge')
  263 |     err.status = 500
  264 |     throw err
  265 |   }
  266 | 
  267 |   storeChallenge(registrationChallenges, user.id, options.challenge)
  268 |   return { options, origin, rpID }
  269 | }
  270 | 
  271 | export async function verifyRegistration({ userId, req, credential, nickname }) {
  272 |   const user = await findUserById(userId)
  273 |   if (!user) {
  274 |     const err = new Error('User not found')
  275 |     err.status = 404
  276 |     throw err
  277 |   }
  278 |   const origin = normalizeOrigin(req)
  279 |   const rpID = resolveRpId(req, origin)
  280 |   const expectedChallenge = readChallenge(registrationChallenges, user.id)
  281 |   if (!expectedChallenge) {
  282 |     const err = new Error('Registration challenge expired')
  283 |     err.status = 400
  284 |     throw err
  285 |   }
  286 | 
  287 |   const verification = await verifyRegistrationResponse({
  288 |     response: credential,
  289 |     expectedChallenge,
  290 |     expectedOrigin: origin,
  291 |     expectedRPID: rpID,
  292 |     requireUserVerification: false,
  293 |   })
  294 | 
  295 |   if (!verification?.verified || !verification.registrationInfo) {
  296 |     const err = new Error('Passkey registration failed')
  297 |     err.status = 400
  298 |     throw err
  299 |   }
  300 | 
  301 |   const registrationInfo = verification.registrationInfo
  302 |   const credentialInfo = registrationInfo?.credential || {}
  303 |   const credentialID = credentialInfo?.id ?? registrationInfo?.credentialID
  304 |   const credentialPublicKey = credentialInfo?.publicKey ?? registrationInfo?.credentialPublicKey
  305 |   const counter = credentialInfo?.counter ?? registrationInfo?.counter
  306 |   const normalizedPublicKey = typeof credentialPublicKey === 'string'
  307 |     ? normalizeBase64Url(credentialPublicKey)
  308 |     : encodeBase64Url(credentialPublicKey)
  309 |   if (!normalizedPublicKey) {
  310 |     const err = new Error('Passkey public key missing')
  311 |     err.status = 400
  312 |     throw err
  313 |   }
  314 |   const normalizedCredentialId = normalizeCredentialId(credentialID, credential)
  315 |   if (!normalizedCredentialId) {
  316 |     const err = new Error('Passkey credential id missing')
  317 |     err.status = 400
  318 |     throw err
  319 |   }
  320 |   const passkey = {
  321 |     id: normalizedCredentialId,
  322 |     publicKey: normalizedPublicKey,
  323 |     counter: Number(counter || 0),
  324 |     name: String(nickname || '').trim(),
  325 |     transports: Array.isArray(credentialInfo?.transports)
  326 |       ? credentialInfo.transports
  327 |       : (Array.isArray(credential.response?.transports) ? credential.response.transports : []),
  328 |     created_at: new Date().toISOString(),
  329 |     last_used_at: null,
  330 |   }
  331 | 
  332 |   const existing = await listPasskeysByUser(user.id)
  333 |   if (existing.some((key) => key.id === passkey.id)) {
  334 |     return sanitizePasskeys(existing)
  335 |   }
  336 |   const allPasskeys = await readPasskeyState()
  337 |   const next = [...allPasskeys, { ...passkey, user_id: user.id }]
  338 |   await writePasskeyState(next)
  339 |   await syncUserProfilePasskeys(user.id, next.filter((key) => String(key.user_id) === String(user.id)))
  340 | 
  341 |   return sanitizePasskeys(next.filter((key) => String(key.user_id) === String(user.id)))
  342 | }
  343 | 
  344 | export async function createAuthenticationOptions({ identifier, req }) {
  345 |   const identifierRaw = String(identifier || '').trim()
  346 |   let allowCredentials
  347 |   let user = null
  348 |   let useDiscoverable = false
  349 | 
  350 |   if (identifierRaw) {
  351 |     user = identifierRaw.includes('@')
  352 |       ? await findUserByEmail(identifierRaw)
  353 |       : await findUserByMemberId(identifierRaw)
  354 |     if (!user) {
  355 |       const err = new Error('User not found')
  356 |       err.status = 404
  357 |       throw err
  358 |     }
  359 |     let passkeys = await listPasskeysByUser(user.id)
  360 |     if (!passkeys.length) {
  361 |       passkeys = (Array.isArray(user.profile?.passkeys) ? user.profile.passkeys : [])
  362 |         .filter(isStoredPasskeyValid)
  363 |     }
  364 |     if (passkeys.length) {
  365 |       allowCredentials = passkeys.map((key) => ({
  366 |         id: key.id,
  367 |         type: 'public-key',
  368 |         transports: Array.isArray(key.transports) ? key.transports : undefined,
  369 |       }))
  370 |     } else {
  371 |       // Fallback to discoverable credentials so users can still pick a passkey
  372 |       // even if server-side passkey list is out of sync.
  373 |       user = null
  374 |       useDiscoverable = true
  375 |     }
  376 |   }
  377 | 
  378 |   const rpID = resolveRpId(req, normalizeOrigin(req)) || String(process.env.PASSKEY_RP_ID || '')
  379 |   if (!rpID) {
  380 |     const err = new Error('Passkey RP ID is missing')
  381 |     err.status = 500
  382 |     throw err
  383 |   }
  384 |   const options = await generateAuthenticationOptions({
  385 |     rpID,
  386 |     userVerification: 'preferred',
  387 |     allowCredentials,
  388 |   })
  389 |   if (!options?.challenge) {
  390 |     const err = new Error('Passkey authentication options missing challenge')
  391 |     err.status = 500
  392 |     throw err
  393 |   }
  394 | 
  395 |   const challengeKey = user?.id || DISCOVERABLE_KEY
  396 |   storeChallenge(authenticationChallenges, challengeKey, options.challenge)
  397 |   return { options, user, discoverable: useDiscoverable }
  398 | }
  399 | 
  400 | export async function verifyAuthentication({ identifier, req, credential }) {
  401 |   const identifierRaw = String(identifier || '').trim()
  402 |   const credentialId = normalizeCredentialId(null, credential)
  403 |   let user = null
  404 |   if (identifierRaw) {
  405 |     user = identifierRaw.includes('@')
  406 |       ? await findUserByEmail(identifierRaw)
  407 |       : await findUserByMemberId(identifierRaw)
  408 |   } else {
  409 |     user = await findUserByPasskeyId(credentialId)
  410 |   }
  411 |   let passkey = await findPasskeyByCredentialId(credentialId)
  412 |   if (!passkey && user) {
  413 |     const fallback = Array.isArray(user.profile?.passkeys) ? user.profile.passkeys : []
  414 |     const match = fallback.find((key) => key?.id === credentialId)
  415 |     if (match && isStoredPasskeyValid(match)) {
  416 |       passkey = { ...match, user_id: user.id }
  417 |       const all = await readPasskeyState()
  418 |       if (!all.some((p) => p.id === passkey.id)) {
  419 |         await writePasskeyState([...all, passkey])
  420 |       }
  421 |     }
  422 |   }
  423 |   if (!passkey) {
  424 |     const err = new Error('Passkey not registered')
  425 |     err.status = 400
  426 |     throw err
  427 |   }
  428 |   if (!user) {
  429 |     user = await findUserById(passkey.user_id)
  430 |   }
  431 |   if (!user) {
  432 |     const err = new Error('User not found')
  433 |     err.status = 404
  434 |     throw err
  435 |   }
  436 |   const expectedChallenge = readChallenge(authenticationChallenges, identifierRaw ? user.id : DISCOVERABLE_KEY)
  437 |     || readChallenge(authenticationChallenges, DISCOVERABLE_KEY)
  438 |   if (!expectedChallenge) {
  439 |     const err = new Error('Authentication challenge expired')
  440 |     err.status = 400
  441 |     throw err
  442 |   }
  443 | 
  444 |   const origin = normalizeOrigin(req)
  445 |   const rpID = resolveRpId(req, origin)
  446 | 
  447 |   const verification = await verifyAuthenticationResponse({
  448 |     response: credential,
  449 |     expectedChallenge,
  450 |     expectedOrigin: origin,
  451 |     expectedRPID: rpID,
  452 |     requireUserVerification: false,
  453 |     credential: {
  454 |       id: passkey.id,
  455 |       publicKey: toBuffer(passkey.publicKey),
  456 |       counter: Number(passkey.counter || 0),
  457 |     },
  458 |   })
  459 | 
  460 |   if (!verification?.verified || !verification.authenticationInfo) {
  461 |     const err = new Error('Passkey authentication failed')
  462 |     err.status = 400
  463 |     throw err
  464 |   }
  465 | 
  466 |   const { newCounter } = verification.authenticationInfo
  467 |   const allPasskeys = await readPasskeyState()
  468 |   const updated = allPasskeys.map((key) => (
  469 |     key.id === passkey.id
  470 |       ? {
  471 |         ...key,
  472 |         counter: Number(newCounter || key.counter || 0),
  473 |         last_used_at: new Date().toISOString(),
  474 |       }
  475 |       : key
  476 |   ))
  477 |   await writePasskeyState(updated)
  478 |   await syncUserProfilePasskeys(user.id, updated.filter((key) => String(key.user_id) === String(user.id)))
  479 | 
  480 |   return { user, passkey: { id: passkey.id, name: passkey.name || '' } }
  481 | }
  482 | 
  483 | export async function findUserByPasskeyId(credentialId) {
  484 |   const passkey = await findPasskeyByCredentialId(credentialId)
  485 |   if (!passkey) return null
  486 |   return findUserById(passkey.user_id)
  487 | }
  488 | 