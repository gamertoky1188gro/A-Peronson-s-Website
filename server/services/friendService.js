import { readJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const CONNECTION_FILE = 'user_connections.json'

export function buildFriendMatchId(userA, userB) {
  const ids = [sanitizeString(String(userA || ''), 120), sanitizeString(String(userB || ''), 120)].filter(Boolean).sort()
  if (ids.length !== 2) return ''
  return `friend:${ids[0]}:${ids[1]}`
}

export async function listFriendConnectionsForUser(userId) {
  const actorId = sanitizeString(String(userId || ''), 120)
  if (!actorId) return []

  const rows = await readJson(CONNECTION_FILE)
  return rows
    .filter((row) => row.requester_id === actorId || row.receiver_id === actorId)
    .filter((row) => row.type === 'friend' || row.type === 'friend_request')
    .map((row) => {
      const otherUserId = row.requester_id === actorId ? row.receiver_id : row.requester_id
      return {
        ...row,
        other_user_id: otherUserId,
        match_id: buildFriendMatchId(actorId, otherUserId),
      }
    })
    .filter((row) => row.match_id)
}

export async function hasFriendRelationship(userA, userB, { includePending = false } = {}) {
  if (!userA || !userB || userA === userB) return false
  const rows = await readJson(CONNECTION_FILE)

  return rows.some((row) => {
    const samePair =
      (row.requester_id === userA && row.receiver_id === userB)
      || (row.requester_id === userB && row.receiver_id === userA)

    if (!samePair) return false
    if (row.type === 'friend' && row.status === 'active') return true
    if (includePending && row.type === 'friend_request' && row.status === 'pending') return true
    return false
  })
}

export async function isFriendConnected(userA, userB) {
  return hasFriendRelationship(userA, userB)
}
