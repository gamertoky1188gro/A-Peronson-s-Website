    1 | import {
    2 |   adminForceLogout as adminForceLogoutUser,
    3 |   adminLockMessaging as adminLockMessagingUser,
    4 |   adminSetPassword as adminSetPasswordUser,
    5 |   adminUpdateUser as adminUpdateUserRecord,
    6 |   deleteUserWithPassword,
    7 |   deleteUser,
    8 |   findUserById,
    9 |   followUser,
   10 |   listUsers,
   11 |   listUsersByIds,
   12 |   listEarlyVerifiedFactories,
   13 |   searchUsers,
   14 |   sendFriendRequest,
   15 |   setUserVerification,
   16 |   updateProfile,
   17 | } from '../services/userService.js'
   18 | import { getEntitlements } from '../services/entitlementService.js'
   19 | import { ensureEntitlement } from '../services/entitlementService.js'
   20 | import { ACTIONS, authorize, buildCapabilityPayload } from '../services/authorizationService.js'
   21 | 
   22 | export async function me(req, res) {
   23 |   const user = await findUserById(req.user.id)
   24 |   if (!user) return res.status(404).json({ error: 'User not found' })
   25 |   const { password_hash: _passwordHash, ...safeUser } = user
   26 |   const entitlements = await getEntitlements(user)
   27 |   const capabilities = buildCapabilityPayload(user)
   28 |   return res.json({ ...safeUser, entitlements, capabilities })
   29 | }
   30 | 
   31 | export async function updateMyProfile(req, res) {
   32 |   const actor = await findUserById(req.user.id)
   33 |   if (!actor) return res.status(404).json({ error: 'User not found' })
   34 |   const profilePatch = req.body || {}
   35 |   const orgSettingFields = ['brand_logo_url', 'brand_cover_url', 'brand_color', 'brand_accent', 'brand_tagline', 'brand_website', 'brand_name', 'account_manager_name', 'account_manager_email', 'account_manager_phone']
   36 |   const touchesOrgSettings = Object.keys(profilePatch).some((field) => orgSettingFields.includes(field))
   37 |   if (touchesOrgSettings) {
   38 |     await authorize(actor, ACTIONS.ORG_SETTINGS_MANAGE, { section: 'branding', org_id: actor.org_owner_id || actor.id })
   39 |   }
   40 |   const user = await updateProfile(req.user.id, profilePatch)
   41 |   if (!user) return res.status(404).json({ error: 'User not found' })
   42 |   return res.json(user)
   43 | }
   44 | 
   45 | export async function searchUsersController(req, res) {
   46 |   const q = String(req.query?.q || '')
   47 |   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
   48 |   res.set('Pragma', 'no-cache')
   49 |   res.set('Expires', '0')
   50 |   res.set('Surrogate-Control', 'no-store')
   51 |   return res.status(200).json({ users: await searchUsers(req.user.id, q) })
   52 | }
   53 | 
   54 | export async function lookupUsers(req, res) {
   55 |   const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
   56 |   return res.status(200).json({ users: await listUsersByIds(ids) })
   57 | }
   58 | 
   59 | export async function listEarlyVerifiedFactoriesController(req, res) {
   60 |   await ensureEntitlement(req.user, 'early_access_verified_factories', 'Premium plan required for early access to verified factories.')
   61 |   const days = Number(req.query?.days || 30)
   62 |   const limit = Number(req.query?.limit || 20)
   63 |   const factories = await listEarlyVerifiedFactories({ days, limit })
   64 |   return res.status(200).json({ items: factories })
   65 | }
   66 | 
   67 | export async function followUserController(req, res) {
   68 |   const targetId = String(req.params.userId || '')
   69 |   if (!targetId || targetId === req.user.id) {
   70 |     return res.status(400).json({ error: 'Invalid target user' })
   71 |   }
   72 | 
   73 |   const target = await findUserById(targetId)
   74 |   if (!target) return res.status(404).json({ error: 'Target user not found' })
   75 | 
   76 |   const relation = await followUser(req.user.id, targetId)
   77 |   return res.status(201).json({ relation })
   78 | }
   79 | 
   80 | export async function friendRequestController(req, res) {
   81 |   const targetId = String(req.params.userId || '')
   82 |   if (!targetId || targetId === req.user.id) {
   83 |     return res.status(400).json({ error: 'Invalid target user' })
   84 |   }
   85 | 
   86 |   const target = await findUserById(targetId)
   87 |   if (!target) return res.status(404).json({ error: 'Target user not found' })
   88 | 
   89 |   const relation = await sendFriendRequest(req.user.id, targetId)
   90 |   return res.status(201).json({ relation })
   91 | }
   92 | 
   93 | export async function adminListUsers(req, res) {
   94 |   return res.json(await listUsers())
   95 | }
   96 | 
   97 | export async function adminVerifyUser(req, res) {
   98 |   const user = await setUserVerification(req.params.userId, req.body?.verified)
   99 |   if (!user) return res.status(404).json({ error: 'User not found' })
  100 |   return res.json(user)
  101 | }
  102 | 
  103 | export async function adminDeleteUser(req, res) {
  104 |   const deleted = await deleteUser(req.params.userId)
  105 |   if (!deleted) return res.status(404).json({ error: 'User not found' })
  106 |   return res.json({ ok: true })
  107 | }
  108 | 
  109 | export async function adminUpdateUser(req, res) {
  110 |   const updated = await adminUpdateUserRecord(req.params.userId, req.body || {})
  111 |   if (!updated) return res.status(404).json({ error: 'User not found' })
  112 |   return res.json(updated)
  113 | }
  114 | 
  115 | export async function adminResetPassword(req, res) {
  116 |   const newPassword = String(req.body?.new_password || '')
  117 |   if (!newPassword || newPassword.length < 6) {
  118 |     return res.status(400).json({ error: 'new_password must be at least 6 characters' })
  119 |   }
  120 |   const updated = await adminSetPasswordUser(req.params.userId, newPassword)
  121 |   if (!updated) return res.status(404).json({ error: 'User not found' })
  122 |   return res.json({ ok: true })
  123 | }
  124 | 
  125 | export async function adminForceLogout(req, res) {
  126 |   const updated = await adminForceLogoutUser(req.params.userId)
  127 |   if (!updated) return res.status(404).json({ error: 'User not found' })
  128 |   return res.json({ ok: true })
  129 | }
  130 | 
  131 | export async function adminLockMessaging(req, res) {
  132 |   const hours = Number(req.body?.lock_hours || 0)
  133 |   const updated = await adminLockMessagingUser(req.params.userId, hours)
  134 |   if (!updated) return res.status(404).json({ error: 'User not found' })
  135 |   return res.json({ ok: true })
  136 | }
  137 | 
  138 | export async function deleteMyAccount(req, res) {
  139 |   try {
  140 |     const password = String(req.body?.password || '')
  141 |     if (!password) return res.status(400).json({ error: 'password is required' })
  142 |     const deleted = await deleteUserWithPassword(req.user.id, password)
  143 |     if (!deleted) return res.status(404).json({ error: 'User not found' })
  144 |     return res.json({ ok: true })
  145 |   } catch (err) {
  146 |     return res.status(err.status || 400).json({ error: err.message || 'Unable to delete account' })
  147 |   }
  148 | }
  149 | 