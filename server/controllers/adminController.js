import { readJson } from '../utils/jsonStore.js'

export async function verificationAudit(req, res) {
  const verification = await readJson('verification.json')
  return res.json(verification)
}

export async function subscriptionsAudit(req, res) {
  const subscriptions = await readJson('subscriptions.json')
  return res.json(subscriptions)
}

export async function usersAudit(req, res) {
  const users = await readJson('users.json')
  return res.json(users.map((user) => {
    const safe = { ...user }
    delete safe.password_hash
    return safe
  }))
}
