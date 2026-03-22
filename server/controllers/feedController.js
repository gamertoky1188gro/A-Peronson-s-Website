import { getCombinedFeed } from '../services/feedService.js'

export async function combinedFeed(req, res) {
  const unique = req.query.unique === 'true'
  const type = req.query.type || 'all'
  const category = req.query.category || ''
  const cursor = Number.isFinite(Number(req.query.cursor)) ? Math.max(0, Math.floor(Number(req.query.cursor))) : 0
  const limitRaw = Number.isFinite(Number(req.query.limit)) ? Math.floor(Number(req.query.limit)) : 12
  const limit = Math.min(50, Math.max(1, limitRaw))
  const data = await getCombinedFeed({ unique, type, category, cursor, limit, viewer: req.user })
  return res.json(data)
}
