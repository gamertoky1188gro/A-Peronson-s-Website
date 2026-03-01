import { findUserById, listUsers, updateProfile, setUserVerification, deleteUser } from '../services/userService.js'

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
