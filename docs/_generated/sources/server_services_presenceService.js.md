    1 | const presence = new Map()
    2 | 
    3 | export function setUserOnline(userId) {
    4 |   if (!userId) return
    5 |   presence.set(String(userId), { status: 'online', last_seen: Date.now() })
    6 | }
    7 | 
    8 | export function setUserOffline(userId) {
    9 |   if (!userId) return
   10 |   presence.set(String(userId), { status: 'offline', last_seen: Date.now() })
   11 | }
   12 | 
   13 | export function getPresenceSnapshot(userIds = []) {
   14 |   const ids = Array.isArray(userIds) && userIds.length > 0 ? userIds.map(String) : Array.from(presence.keys())
   15 |   const snapshot = {}
   16 |   ids.forEach((id) => {
   17 |     const entry = presence.get(id)
   18 |     snapshot[id] = entry || { status: 'offline', last_seen: null }
   19 |   })
   20 |   return snapshot
   21 | }
   22 | 
   23 | export function touchUser(userId) {
   24 |   if (!userId) return
   25 |   const existing = presence.get(String(userId))
   26 |   if (existing?.status === 'online') {
   27 |     presence.set(String(userId), { status: 'online', last_seen: existing.last_seen || Date.now() })
   28 |   }
   29 | }
   30 | 