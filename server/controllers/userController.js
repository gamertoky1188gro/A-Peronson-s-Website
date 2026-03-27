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
  searchUsers,
  sendFriendRequest,
  setUserVerification,
  updateProfile,
} from '../services/userService.js'

export async function me(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password_hash: _passwordHash, ...safeUser } = user
  return res.json(safeUser)
}

export async function updateMyProfile(req, res) {
  const user = await updateProfile(req.user.id, req.body || {})
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
