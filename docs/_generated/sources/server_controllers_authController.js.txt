    1 | import { findUserByEmail, findUserById, findUserByMemberId, registerUser, verifyPassword } from '../services/userService.js'
    2 | import { assertCouponRedeemable } from '../services/walletService.js'
    3 | import { signToken } from '../middleware/auth.js'
    4 | import { requireFields, validateEmail, validateRole } from '../utils/validators.js'
    5 | import {
    6 |   createAuthenticationOptions,
    7 |   createRegistrationOptions,
    8 |   listUserPasskeys,
    9 |   removeUserPasskey,
   10 |   verifyAuthentication,
   11 |   verifyRegistration,
   12 | } from '../services/passkeyService.js'
   13 | import { getEntitlements } from '../services/entitlementService.js'
   14 | 
   15 | function sanitizeUser(user) {
   16 |   if (!user) return null
   17 |   const { password_hash: _passwordHash, passkeys, ...safe } = user
   18 |   return {
   19 |     ...safe,
   20 |     passkeys: Array.isArray(passkeys)
   21 |       ? passkeys.map((key) => ({
   22 |         id: key.id,
   23 |         name: key.name || '',
   24 |         created_at: key.created_at || '',
   25 |         last_used_at: key.last_used_at || '',
   26 |         transports: Array.isArray(key.transports) ? key.transports : [],
   27 |       }))
   28 |       : [],
   29 |   }
   30 | }
   31 | 
   32 | export async function register(req, res) {
   33 |   const missing = requireFields(req.body, ['name', 'email', 'password', 'role'])
   34 |   if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
   35 |   if (!validateEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
   36 |   if (!validateRole(req.body.role)) return res.status(400).json({ error: 'Invalid role' })
   37 | 
   38 |   const existing = await findUserByEmail(req.body.email)
   39 |   if (existing) return res.status(409).json({ error: 'Email already used' })
   40 | 
   41 |   if (req.body?.coupon_code) {
   42 |     try {
   43 |       await assertCouponRedeemable(req.body.coupon_code)
   44 |     } catch (error) {
   45 |       return res.status(error.status || 400).json({ error: error.message || 'Invalid coupon code' })
   46 |     }
   47 |   }
   48 | 
   49 |   const user = await registerUser(req.body)
   50 |   const token = signToken(user)
   51 |   const entitlements = await getEntitlements(user)
   52 |   return res.status(201).json({ user: { ...sanitizeUser(user), entitlements }, token })
   53 | }
   54 | 
   55 | export async function login(req, res) {
   56 |   // UX: login uses a single field on the client ("Email or Agent ID").
   57 |   // For backwards compatibility we still accept `email`, but the preferred field is `identifier`.
   58 |   const missing = requireFields(req.body, ['password'])
   59 |   if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
   60 | 
   61 |   const identifierRaw = String(req.body?.identifier || req.body?.email || '').trim()
   62 |   if (!identifierRaw) return res.status(400).json({ error: 'Missing fields: identifier' })
   63 | 
   64 |   // If identifier looks like an email -> normal user login. Otherwise -> agent login by `member_id`.
   65 |   const user = identifierRaw.includes('@') ? await findUserByEmail(identifierRaw) : await findUserByMemberId(identifierRaw)
   66 |   if (!user) return res.status(401).json({ error: 'Invalid credentials' })
   67 |   if (String(user.status || '').toLowerCase() === 'deleted') {
   68 |     return res.status(403).json({ error: 'Account deleted' })
   69 |   }
   70 | 
   71 |   const ok = await verifyPassword(user, req.body.password)
   72 |   if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
   73 | 
   74 |   const token = signToken(user, { authViaPasskey: false })
   75 |   const entitlements = await getEntitlements(user)
   76 |   return res.json({ user: { ...sanitizeUser(user), entitlements }, token })
   77 | }
   78 | 
   79 | 
   80 | export async function me(req, res) {
   81 |   const user = await findUserById(req.user.id)
   82 |   if (!user) return res.status(404).json({ error: 'User not found' })
   83 |   const entitlements = await getEntitlements(user)
   84 |   return res.json({ user: { ...sanitizeUser(user), entitlements } })
   85 | }
   86 | 
   87 | export async function logout(req, res) {
   88 |   return res.json({ ok: true, message: 'Logout handled on client by dropping JWT' })
   89 | }
   90 | 
   91 | export async function passkeyRegistrationOptions(req, res) {
   92 |   try {
   93 |     const { options } = await createRegistrationOptions({
   94 |       userId: req.user.id,
   95 |       req,
   96 |       rpName: process.env.PASSKEY_RP_NAME || 'GartexHub',
   97 |     })
   98 |     return res.json({ options })
   99 |   } catch (err) {
  100 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to create passkey options' })
  101 |   }
  102 | }
  103 | 
  104 | export async function passkeyRegistrationVerify(req, res) {
  105 |   try {
  106 |     const credential = req.body?.credential
  107 |     if (!credential) return res.status(400).json({ error: 'Missing credential' })
  108 |     const nickname = req.body?.nickname || ''
  109 |     const passkeys = await verifyRegistration({ userId: req.user.id, req, credential, nickname })
  110 |     return res.json({ passkeys })
  111 |   } catch (err) {
  112 |     return res.status(err.status || 400).json({ error: err.message || 'Passkey registration failed' })
  113 |   }
  114 | }
  115 | 
  116 | export async function passkeyLoginOptions(req, res) {
  117 |   try {
  118 |     const identifier = req.body?.identifier
  119 |     const { options } = await createAuthenticationOptions({ identifier, req })
  120 |     return res.json({ options })
  121 |   } catch (err) {
  122 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to create passkey options' })
  123 |   }
  124 | }
  125 | 
  126 | export async function passkeyLoginVerify(req, res) {
  127 |   try {
  128 |     const identifier = req.body?.identifier
  129 |     const credential = req.body?.credential
  130 |     if (!credential) return res.status(400).json({ error: 'Missing credential' })
  131 |     const result = await verifyAuthentication({ identifier, req, credential })
  132 |     const user = result?.user
  133 |     const passkey = result?.passkey || null
  134 |     if (String(user.status || '').toLowerCase() === 'deleted') {
  135 |       return res.status(403).json({ error: 'Account deleted' })
  136 |     }
  137 |     const token = signToken(user, { authViaPasskey: true })
  138 |     const entitlements = await getEntitlements(user)
  139 |     return res.json({ user: { ...sanitizeUser(user), entitlements }, token, passkey })
  140 |   } catch (err) {
  141 |     return res.status(err.status || 400).json({ error: err.message || 'Passkey login failed' })
  142 |   }
  143 | }
  144 | 
  145 | export async function passkeyList(req, res) {
  146 |   try {
  147 |     const passkeys = await listUserPasskeys(req.user.id)
  148 |     return res.json({ passkeys })
  149 |   } catch (err) {
  150 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to load passkeys' })
  151 |   }
  152 | }
  153 | 
  154 | export async function passkeyRemove(req, res) {
  155 |   try {
  156 |     const credentialId = String(req.params.credentialId || '').trim()
  157 |     if (!credentialId) return res.status(400).json({ error: 'Missing credential id' })
  158 |     const passkeys = await removeUserPasskey(req.user.id, credentialId)
  159 |     return res.json({ passkeys })
  160 |   } catch (err) {
  161 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to remove passkey' })
  162 |   }
  163 | }
  164 | 