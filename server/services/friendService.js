import { readJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const CONNECTION_FILE = 'user_connections.json'

export function buildFriendMatchId(userA, userB) {
  const ids = [sanitizeString(String(userA || ''), 120), sanitizeString(String(userB || ''), 120)].filter(Boolean).sort()
  if (ids.length !== 2) return ''
  return `friend:${ids[0]}:${ids[1]}`
}

export async function isFriendConnected(userA, userB) {
  if (!userA || !userB || userA === userB) return false
  const rows = await readJson(CONNECTION_FILE)
  return rows.some(
    (row) => row.type === 'friend' && row.status === 'active'
      && ((row.requester_id === userA && row.receiver_id === userB) || (row.requester_id === userB && row.receiver_id === userA)),
  )
}
