import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import prisma from '../utils/prisma.js'
import { findUserByEmail, findUserById, findUserByMemberId } from './userService.js'

const PASSKEY_STATE_KEY = 'passkeys'
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

function isStoredPasskeyValid(key) {
  return Boolean(
    key
    && typeof key.id === 'string'
    && key.id.trim()
    && typeof key.publicKey === 'string'
    && key.publicKey.trim(),
  )
}

async function readPasskeyState() {
  const record = await prisma.appState.findUnique({ where: { key: PASSKEY_STATE_KEY } })
  const data = record?.data
  const passkeys = (data && typeof data === 'object' && Array.isArray(data.passkeys)) ? data.passkeys : []
  const cleaned = passkeys.filter(isStoredPasskeyValid)
  if (cleaned.length !== passkeys.length) {
    await writePasskeyState(cleaned)
  }
  return cleaned
}

async function writePasskeyState(passkeys) {
  const data = { passkeys }
  await prisma.appState.upsert({
    where: { key: PASSKEY_STATE_KEY },
    update: { data },
    create: { key: PASSKEY_STATE_KEY, data },
  })
}

async function listPasskeysByUser(userId) {
  const passkeys = await readPasskeyState()
  return passkeys.filter((key) => String(key.user_id) === String(userId))
}

async function findPasskeyByCredentialId(credentialId) {
  if (!credentialId) return null
  const passkeys = await readPasskeyState()
  return passkeys.find((key) => key.id === credentialId) || null
}

export async function listUserPasskeys(userId) {
  const user = await findUserById(userId)
  if (!user) return []
  const passkeys = await listPasskeysByUser(userId)
  return sanitizePasskeys(passkeys)
}

export async function removeUserPasskey(userId, credentialId) {
  const user = await findUserById(userId)
  if (!user) return null
  const passkeys = await readPasskeyState()
  const next = passkeys.filter((key) => !(String(key.user_id) === String(userId) && key.id === credentialId))
  await writePasskeyState(next)
  return sanitizePasskeys(next.filter((key) => String(key.user_id) === String(userId)))
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
  const passkeys = await listPasskeysByUser(user.id)
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

  const existing = await listPasskeysByUser(user.id)
  if (existing.some((key) => key.id === passkey.id)) {
    return sanitizePasskeys(existing)
  }
  const allPasskeys = await readPasskeyState()
  const next = [...allPasskeys, { ...passkey, user_id: user.id }]
  await writePasskeyState(next)

  return sanitizePasskeys(next.filter((key) => String(key.user_id) === String(user.id)))
}

export async function createAuthenticationOptions({ identifier, req }) {
  const identifierRaw = String(identifier || '').trim()
  let allowCredentials
  let user = null
  let useDiscoverable = false

  if (identifierRaw) {
    user = identifierRaw.includes('@')
      ? await findUserByEmail(identifierRaw)
      : await findUserByMemberId(identifierRaw)
    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }
    const passkeys = await listPasskeysByUser(user.id)
    if (passkeys.length) {
      allowCredentials = passkeys.map((key) => ({
        id: toBuffer(key.id),
        type: 'public-key',
        transports: Array.isArray(key.transports) ? key.transports : undefined,
      }))
    } else {
      // Fallback to discoverable credentials so users can still pick a passkey
      // even if server-side passkey list is out of sync.
      user = null
      useDiscoverable = true
    }
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
  return { options, user, discoverable: useDiscoverable }
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
  const passkey = await findPasskeyByCredentialId(credentialId)
  if (!passkey) {
    const err = new Error('Passkey not registered')
    err.status = 400
    throw err
  }
  if (!user) {
    user = await findUserById(passkey.user_id)
  }
  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }
  const expectedChallenge = readChallenge(authenticationChallenges, identifierRaw ? user.id : DISCOVERABLE_KEY)
    || readChallenge(authenticationChallenges, DISCOVERABLE_KEY)
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
  const allPasskeys = await readPasskeyState()
  const updated = allPasskeys.map((key) => (
    key.id === passkey.id
      ? {
        ...key,
        counter: Number(newCounter || key.counter || 0),
        last_used_at: new Date().toISOString(),
      }
      : key
  ))
  await writePasskeyState(updated)

  return { user, passkey: { id: passkey.id, name: passkey.name || '' } }
}

export async function findUserByPasskeyId(credentialId) {
  const passkey = await findPasskeyByCredentialId(credentialId)
  if (!passkey) return null
  return findUserById(passkey.user_id)
}
