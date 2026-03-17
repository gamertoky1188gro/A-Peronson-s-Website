    1 | import { getPresenceSnapshot } from '../services/presenceService.js'
    2 | 
    3 | export function getPresence(req, res) {
    4 |   const ids = Array.isArray(req.body?.user_ids) ? req.body.user_ids : []
    5 |   const presence = getPresenceSnapshot(ids)
    6 |   return res.status(200).json({ presence })
    7 | }
    8 | 