import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'users.json'

function cleanUser(user) {
  const { password_hash: _passwordHash, ...safe } = user
  return safe
}

export async function listUsers() {
  const users = await readJson(FILE)
  return users.map(cleanUser)
}

export async function findUserByEmail(email) {
  const users = await readJson(FILE)
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function findUserById(id) {
  const users = await readJson(FILE)
  return users.find((u) => u.id === id)
}

export async function registerUser(payload) {
  const users = await readJson(FILE)
  const hash = await bcrypt.hash(payload.password, 10)

  const user = {
    id: crypto.randomUUID(),
    company_name: sanitizeString(payload.company_name, 120),
    email: payload.email.toLowerCase(),
    password_hash: hash,
    role: payload.role,
    verified: payload.role === 'admin',
    created_at: new Date().toISOString(),
    profile: {
      country: sanitizeString(payload.profile?.country || '', 120),
      export_license: sanitizeString(payload.profile?.export_license || '', 160),
      certifications: Array.isArray(payload.profile?.certifications) ? payload.profile.certifications.map((c) => sanitizeString(c, 80)) : [],
      monthly_capacity: sanitizeString(payload.profile?.monthly_capacity || '', 80),
      moq: sanitizeString(payload.profile?.moq || '', 40),
      lead_time_days: sanitizeString(payload.profile?.lead_time_days || '', 40),
      categories: Array.isArray(payload.profile?.categories) ? payload.profile.categories.map((c) => sanitizeString(c, 80)) : [],
      sourcing_preferences: Array.isArray(payload.profile?.sourcing_preferences)
        ? payload.profile.sourcing_preferences.map((s) => sanitizeString(s, 120))
        : [],
    },
  }

  users.push(user)
  await writeJson(FILE, users)
  return cleanUser(user)
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash)
}

export async function updateProfile(userId, profilePatch) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null

  const current = users[index]
  const nextProfile = {
    ...current.profile,
    ...Object.fromEntries(Object.entries(profilePatch).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => sanitizeString(String(x), 120)) : sanitizeString(String(v ?? ''), 240)])),
  }

  users[index] = { ...current, profile: nextProfile }
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function setUserVerification(userId, verified) {
  const users = await readJson(FILE)
  const index = users.findIndex((u) => u.id === userId)
  if (index < 0) return null
  users[index].verified = Boolean(verified)
  await writeJson(FILE, users)
  return cleanUser(users[index])
}

export async function deleteUser(userId) {
  const users = await readJson(FILE)
  const next = users.filter((u) => u.id !== userId)
  if (next.length === users.length) return false
  await writeJson(FILE, next)
  return true
}
