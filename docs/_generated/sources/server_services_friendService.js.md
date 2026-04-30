    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | 
    4 | const CONNECTION_FILE = 'user_connections.json'
    5 | 
    6 | export function buildFriendMatchId(userA, userB) {
    7 |   const ids = [sanitizeString(String(userA || ''), 120), sanitizeString(String(userB || ''), 120)].filter(Boolean).sort()
    8 |   if (ids.length !== 2) return ''
    9 |   return `friend:${ids[0]}:${ids[1]}`
   10 | }
   11 | 
   12 | export async function listFriendConnectionsForUser(userId) {
   13 |   const actorId = sanitizeString(String(userId || ''), 120)
   14 |   if (!actorId) return []
   15 | 
   16 |   const rows = await readJson(CONNECTION_FILE)
   17 |   return rows
   18 |     .filter((row) => row.requester_id === actorId || row.receiver_id === actorId)
   19 |     .filter((row) => row.type === 'friend' || row.type === 'friend_request')
   20 |     .map((row) => {
   21 |       const otherUserId = row.requester_id === actorId ? row.receiver_id : row.requester_id
   22 |       return {
   23 |         ...row,
   24 |         other_user_id: otherUserId,
   25 |         match_id: buildFriendMatchId(actorId, otherUserId),
   26 |       }
   27 |     })
   28 |     .filter((row) => row.match_id)
   29 | }
   30 | 
   31 | function isLegacyFriendActive(row) {
   32 |   return row.type === 'friend_request' && ['accepted', 'active'].includes(String(row.status || '').toLowerCase())
   33 | }
   34 | 
   35 | export async function hasFriendRelationship(userA, userB, { includePending = false } = {}) {
   36 |   if (!userA || !userB || userA === userB) return false
   37 |   const rows = await readJson(CONNECTION_FILE)
   38 | 
   39 |   return rows.some((row) => {
   40 |     const samePair =
   41 |       (row.requester_id === userA && row.receiver_id === userB)
   42 |       || (row.requester_id === userB && row.receiver_id === userA)
   43 | 
   44 |     if (!samePair) return false
   45 | 
   46 |     const status = String(row.status || '').toLowerCase()
   47 |     if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
   48 |     if (isLegacyFriendActive(row)) return true
   49 |     if (includePending && row.type === 'friend_request' && status === 'pending') return true
   50 |     return false
   51 |   })
   52 | }
   53 | 
   54 | export async function isFriendConnected(userA, userB) {
   55 |   return hasFriendRelationship(userA, userB)
   56 | }
   57 | 