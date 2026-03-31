import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { findUserByEmail, findUserById, findUserByMemberId } from './userService.js'

const USERS_FILE = 'users.json'
const CHALLENGE_TTL_MS = 5 * 60 * 1000
const registrationChallenges = new Map()
const authenticationChallenges = new Map()
const DISCOVERABLE_KEY = 'discoverable'

function pruneExpired(map) {
  const now = Date.now()
  for (const [key, value] of map.entries()) {
    if (!value || now > value.expiresAt) {
      map.delete(key)
    }
  }
}

function storeChallenge(map, key, challenge) {
  pruneExpired(map)
  map.set(String(key), { challenge, expiresAt: Date.now() + CHALLENGE_TTL_MS })
}

function readChallenge(map, key) {
  pruneExpired(map)
  const entry = map.get(String(key))
  return entry?.challenge || ''
}

function normalizeOrigin(req) {
  const origin = String(req.headers.origin || '').trim()
  if (origin) return origin
  const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'http')
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
  if (!host) return ''
  return `${proto}://${host}`
}

function resolveRpId(req, origin) {
  try {
    const target = origin || normalizeOrigin(req)
    if (target) return new URL(target).hostname
  } catch {
    // fallthrough
  }
  const host = String(req.hostname || '').trim()
  return host.includes(':') ? host.split(':')[0] : host
}

function toBuffer(value = '') {
  if (!value) return Buffer.alloc(0)
  return Buffer.from(value, 'base64url')
}

function encodeBase64Url(buffer) {
  if (!buffer) return ''
  return Buffer.from(buffer).toString('base64url')
}

function toUserIdBuffer(value) {
  return Buffer.from(String(value || ''), 'utf8')
}

function sanitizePasskeys(passkeys = []) {
  return (Array.isArray(passkeys) ? passkeys : []).map((key) => ({
    id: key.id,
    name: key.name || '',
    created_at: key.created_at || '',
    last_used_at: key.last_used_at || '',
    transports: Array.isArray(key.transports) ? key.transports : [],
  }))
}

export async function listUserPasskeys(userId) {
  const user = await findUserById(userId)
  if (!user) return []
  return sanitizePasskeys(user.passkeys || [])
}

export async function removeUserPasskey(userId, credentialId) {
  const users = await readJson(USERS_FILE)
  const index = users.findIndex((u) => String(u.id) === String(userId))
  if (index < 0) return null
  const passkeys = Array.isArray(users[index].passkeys) ? users[index].passkeys : []
  const next = passkeys.filter((key) => key.id !== credentialId)
  users[index] = { ...users[index], passkeys: next }
  await writeJson(USERS_FILE, users)
  return sanitizePasskeys(next)
}

export async function createRegistrationOptions({ userId, req, rpName = 'GartexHub' }) {
  const user = await findUserById(userId)
  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  const origin = normalizeOrigin(req)
  const rpID = resolveRpId(req, origin) || String(process.env.PASSKEY_RP_ID || '')
  if (!rpID) {
    const err = new Error('Passkey RP ID is missing')
    err.status = 500
    throw err
  }
  const passkeys = Array.isArray(user.passkeys) ? user.passkeys : []
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: toUserIdBuffer(user.id),
    userName: user.email || user.name || user.id,
    userDisplayName: user.name || user.email || 'User',
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    excludeCredentials: passkeys.map((key) => ({
      id: toBuffer(key.id),
      type: 'public-key',
      transports: Array.isArray(key.transports) ? key.transports : undefined,
    })),
  })
  if (!options?.challenge) {
    const err = new Error('Passkey registration options missing challenge')
    err.status = 500
    throw err
  }

  storeChallenge(registrationChallenges, user.id, options.challenge)
  return { options, origin, rpID }
}

export async function verifyRegistration({ userId, req, credential, nickname }) {
  const user = await findUserById(userId)
  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  const origin = normalizeOrigin(req)
  const rpID = resolveRpId(req, origin)
  const expectedChallenge = readChallenge(registrationChallenges, user.id)
  if (!expectedChallenge) {
    const err = new Error('Registration challenge expired')
    err.status = 400
    throw err
  }

  const verification = await verifyRegistrationResponse({
    response: credential,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: false,
  })

  if (!verification?.verified || !verification.registrationInfo) {
    const err = new Error('Passkey registration failed')
    err.status = 400
    throw err
  }

  const { credentialID, credentialPublicKey, counter } = verification.registrationInfo
  const passkey = {
    id: encodeBase64Url(credentialID),
    publicKey: encodeBase64Url(credentialPublicKey),
    counter: Number(counter || 0),
    name: String(nickname || '').trim(),
    transports: Array.isArray(credential.response?.transports) ? credential.response.transports : [],
    created_at: new Date().toISOString(),
    last_used_at: null,
  }

  const users = await readJson(USERS_FILE)
  const index = users.findIndex((u) => String(u.id) === String(user.id))
  if (index < 0) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  const existing = Array.isArray(users[index].passkeys) ? users[index].passkeys : []
  if (existing.some((key) => key.id === passkey.id)) {
    return sanitizePasskeys(existing)
  }
  users[index] = {
    ...users[index],
    passkeys: [...existing, passkey],
  }
  await writeJson(USERS_FILE, users)

  return sanitizePasskeys(users[index].passkeys)
}

export async function createAuthenticationOptions({ identifier, req }) {
  const identifierRaw = String(identifier || '').trim()
  let allowCredentials
  let user = null

  if (identifierRaw) {
    user = identifierRaw.includes('@')
      ? await findUserByEmail(identifierRaw)
      : await findUserByMemberId(identifierRaw)
    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }
    const passkeys = Array.isArray(user.passkeys) ? user.passkeys : []
    if (!passkeys.length) {
      const err = new Error('No passkeys registered')
      err.status = 400
      throw err
    }
    allowCredentials = passkeys.map((key) => ({
      id: toBuffer(key.id),
      type: 'public-key',
      transports: Array.isArray(key.transports) ? key.transports : undefined,
    }))
  }

  const rpID = resolveRpId(req, normalizeOrigin(req)) || String(process.env.PASSKEY_RP_ID || '')
  if (!rpID) {
    const err = new Error('Passkey RP ID is missing')
    err.status = 500
    throw err
  }
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    allowCredentials,
  })
  if (!options?.challenge) {
    const err = new Error('Passkey authentication options missing challenge')
    err.status = 500
    throw err
  }

  const challengeKey = user?.id || DISCOVERABLE_KEY
  storeChallenge(authenticationChallenges, challengeKey, options.challenge)
  return { options, user }
}

export async function verifyAuthentication({ identifier, req, credential }) {
  const identifierRaw = String(identifier || '').trim()
  const credentialId = String(credential?.id || '')
  let user = null
  if (identifierRaw) {
    user = identifierRaw.includes('@')
      ? await findUserByEmail(identifierRaw)
      : await findUserByMemberId(identifierRaw)
  } else {
    user = await findUserByPasskeyId(credentialId)
  }
  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  const passkeys = Array.isArray(user.passkeys) ? user.passkeys : []
  const passkey = passkeys.find((key) => key.id === credentialId)
  if (!passkey) {
    const err = new Error('Passkey not registered')
    err.status = 400
    throw err
  }
  const expectedChallenge = readChallenge(authenticationChallenges, identifierRaw ? user.id : DISCOVERABLE_KEY)
  if (!expectedChallenge) {
    const err = new Error('Authentication challenge expired')
    err.status = 400
    throw err
  }

  const origin = normalizeOrigin(req)
  const rpID = resolveRpId(req, origin)

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: false,
    authenticator: {
      credentialID: toBuffer(passkey.id),
      credentialPublicKey: toBuffer(passkey.publicKey),
      counter: Number(passkey.counter || 0),
    },
  })

  if (!verification?.verified || !verification.authenticationInfo) {
    const err = new Error('Passkey authentication failed')
    err.status = 400
    throw err
  }

  const { newCounter } = verification.authenticationInfo
  const users = await readJson(USERS_FILE)
  const index = users.findIndex((u) => String(u.id) === String(user.id))
  if (index >= 0) {
    const stored = Array.isArray(users[index].passkeys) ? users[index].passkeys : []
    users[index] = {
      ...users[index],
      passkeys: stored.map((key) => (
        key.id === passkey.id
          ? {
            ...key,
            counter: Number(newCounter || key.counter || 0),
            last_used_at: new Date().toISOString(),
          }
          : key
      )),
    }
    await writeJson(USERS_FILE, users)
  }

  return { user, passkey: { id: passkey.id, name: passkey.name || '' } }
}

export async function findUserByPasskeyId(credentialId) {
  if (!credentialId) return null
  const users = await readJson(USERS_FILE)
  return users.find((user) => Array.isArray(user.passkeys) && user.passkeys.some((key) => key.id === credentialId))
}
