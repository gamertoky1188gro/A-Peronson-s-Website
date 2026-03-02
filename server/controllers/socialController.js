import { addAction, addComment, listInteractions } from '../services/socialService.js'

export async function createComment(req, res) {
  const text = req.body?.text || ''
  if (!text.trim()) return res.status(400).json({ error: 'Comment text required' })
  const row = await addComment(req.user, req.params.entityType, req.params.entityId, text)
  return res.status(201).json(row)
}

export async function createShare(req, res) {
  const row = await addAction(req.user, req.params.entityType, req.params.entityId, 'share')
  return res.status(201).json(row)
}

export async function createReport(req, res) {
  const row = await addAction(req.user, req.params.entityType, req.params.entityId, 'report', req.body?.reason || '')
  return res.status(201).json(row)
}

export async function getEntityInteractions(req, res) {
  return res.json(await listInteractions(req.params.entityType, req.params.entityId))
}
