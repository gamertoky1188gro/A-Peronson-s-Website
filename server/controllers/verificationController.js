import { findUserById, setUserVerification } from '../services/userService.js'
import { adminApproveVerification, getVerification, revokeExpiredVerifications, upsertVerification } from '../services/verificationService.js'

export async function getMyVerification(req, res) {
  const rec = await getVerification(req.user.id)
  return res.json(rec || { user_id: req.user.id, verified: false, missing_required: [] })
}

export async function submitMyVerification(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  try {
    const rec = await upsertVerification(user, req.body?.documents || {})
    return res.json(rec)
  } catch (error) {
    const status = Number(error?.statusCode) || 400
    return res.status(status).json({ error: error?.message || 'Verification data is invalid' })
  }
}

export async function adminApprove(req, res) {
  const rec = await adminApproveVerification(req.params.userId)
  if (!rec) return res.status(404).json({ error: 'Verification record not found' })
  await setUserVerification(req.params.userId, rec.verified)
  return res.json(rec)
}

export async function adminRevokeExpired(req, res) {
  const updated = await revokeExpiredVerifications()
  return res.json({ ok: true, total: updated.length })
}
