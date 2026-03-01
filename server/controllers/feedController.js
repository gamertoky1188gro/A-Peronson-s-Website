import { getCombinedFeed } from '../services/feedService.js'

export async function combinedFeed(req, res) {
  const unique = req.query.unique === 'true'
  const type = req.query.type || 'all'
  const category = req.query.category || ''
  const data = await getCombinedFeed({ unique, type, category })
  return res.json(data)
}
