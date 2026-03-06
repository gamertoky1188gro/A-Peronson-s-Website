import {
  deleteUser,
  findUserById,
  followUser,
  listUsers,
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
  return res.json({ users: await searchUsers(req.user.id, q) })
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
