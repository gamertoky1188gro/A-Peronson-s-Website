import {
  adminForceLogout as adminForceLogoutUser,
  adminLockMessaging as adminLockMessagingUser,
  adminSetPassword as adminSetPasswordUser,
  adminUpdateUser as adminUpdateUserRecord,
  deleteUserWithPassword,
  deleteUser,
  findUserById,
  followUser,
  listUsers,
  listUsersByIds,
  listEarlyVerifiedFactories,
  searchUsers,
  sendFriendRequest,
  setUserVerification,
  updateProfile,
} from '../services/userService.js'
import { getEntitlements } from '../services/entitlementService.js'
import { ensureEntitlement } from '../services/entitlementService.js'
import { ACTIONS, authorize, buildCapabilityPayload } from '../services/authorizationService.js'

export async function me(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password_hash: _passwordHash, ...safeUser } = user
  const entitlements = await getEntitlements(user)
  const capabilities = buildCapabilityPayload(user)
  return res.json({ ...safeUser, entitlements, capabilities })
}

export async function updateMyProfile(req, res) {
  const actor = await findUserById(req.user.id)
  if (!actor) return res.status(404).json({ error: 'User not found' })
  const profilePatch = req.body || {}
  const orgSettingFields = ['brand_logo_url', 'brand_cover_url', 'brand_color', 'brand_accent', 'brand_tagline', 'brand_website', 'brand_name', 'account_manager_name', 'account_manager_email', 'account_manager_phone']
  const touchesOrgSettings = Object.keys(profilePatch).some((field) => orgSettingFields.includes(field))
  if (touchesOrgSettings) {
    await authorize(actor, ACTIONS.ORG_SETTINGS_MANAGE, { section: 'branding', org_id: actor.org_owner_id || actor.id })
  }
  const user = await updateProfile(req.user.id, profilePatch)
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json(user)
}

export async function searchUsersController(req, res) {
  const q = String(req.query?.q || '')
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  return res.status(200).json({ users: await searchUsers(req.user.id, q) })
}

export async function lookupUsers(req, res) {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
  return res.status(200).json({ users: await listUsersByIds(ids) })
}

export async function listEarlyVerifiedFactoriesController(req, res) {
  await ensureEntitlement(req.user, 'early_access_verified_factories', 'Premium plan required for early access to verified factories.')
  const days = Number(req.query?.days || 30)
  const limit = Number(req.query?.limit || 20)
  const factories = await listEarlyVerifiedFactories({ days, limit })
  return res.status(200).json({ items: factories })
}

export async function followUserController(req, res) {
  const targetId = String(req.params.userId || '')
  if (!targetId || targetId === req.user.id) {
    return res.status(400).json({ error: 'Invalid target user' })
  }

  const target = await findUserById(targetId)
  if (!target) return res.status(404).json({ error: 'Target user not found' })

  const relation = await followUser(req.user.id, targetId)
  return res.status(201).json({ relation })
}

export async function friendRequestController(req, res) {
  const targetId = String(req.params.userId || '')
  if (!targetId || targetId === req.user.id) {
    return res.status(400).json({ error: 'Invalid target user' })
  }

  const target = await findUserById(targetId)
  if (!target) return res.status(404).json({ error: 'Target user not found' })

  const relation = await sendFriendRequest(req.user.id, targetId)
  return res.status(201).json({ relation })
}

export async function adminListUsers(req, res) {
  return res.json(await listUsers())
}

export async function adminVerifyUser(req, res) {
  const user = await setUserVerification(req.params.userId, req.body?.verified)
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json(user)
}

export async function adminDeleteUser(req, res) {
  const deleted = await deleteUser(req.params.userId)
  if (!deleted) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true })
}

export async function adminUpdateUser(req, res) {
  const updated = await adminUpdateUserRecord(req.params.userId, req.body || {})
  if (!updated) return res.status(404).json({ error: 'User not found' })
  return res.json(updated)
}

export async function adminResetPassword(req, res) {
  const newPassword = String(req.body?.new_password || '')
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'new_password must be at least 6 characters' })
  }
  const updated = await adminSetPasswordUser(req.params.userId, newPassword)
  if (!updated) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true })
}

export async function adminForceLogout(req, res) {
  const updated = await adminForceLogoutUser(req.params.userId)
  if (!updated) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true })
}

export async function adminLockMessaging(req, res) {
  const hours = Number(req.body?.lock_hours || 0)
  const updated = await adminLockMessagingUser(req.params.userId, hours)
  if (!updated) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true })
}

export async function deleteMyAccount(req, res) {
  try {
    const password = String(req.body?.password || '')
    if (!password) return res.status(400).json({ error: 'password is required' })
    const deleted = await deleteUserWithPassword(req.user.id, password)
    if (!deleted) return res.status(404).json({ error: 'User not found' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Unable to delete account' })
  }
}
