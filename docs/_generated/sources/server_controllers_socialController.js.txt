    1 | import { addAction, addComment, listInteractions } from '../services/socialService.js'
    2 | 
    3 | export async function createComment(req, res) {
    4 |   const text = req.body?.text || ''
    5 |   if (!text.trim()) return res.status(400).json({ error: 'Comment text required' })
    6 |   try {
    7 |     const row = await addComment(
    8 |       req.user,
    9 |       req.params.entityType,
   10 |       req.params.entityId,
   11 |       text,
   12 |       req.body?.parent_id || ''
   13 |     )
   14 |     return res.status(201).json(row)
   15 |   } catch (err) {
   16 |     const status = err.status || 500
   17 |     return res.status(status).json({ error: err.message || 'Unable to add comment' })
   18 |   }
   19 | }
   20 | 
   21 | export async function createShare(req, res) {
   22 |   const row = await addAction(req.user, req.params.entityType, req.params.entityId, 'share')
   23 |   return res.status(201).json(row)
   24 | }
   25 | 
   26 | export async function createReport(req, res) {
   27 |   const row = await addAction(req.user, req.params.entityType, req.params.entityId, 'report', req.body?.reason || '')
   28 |   return res.status(201).json(row)
   29 | }
   30 | 
   31 | export async function getEntityInteractions(req, res) {
   32 |   return res.json(await listInteractions(req.params.entityType, req.params.entityId))
   33 | }
   34 | 
   35 | 
   36 | export async function createAction(req, res) {
   37 |   const { entityType, entityId, action } = req.body || {}
   38 |   if (!entityType || !entityId || !action) return res.status(400).json({ error: 'entityType, entityId, action required' })
   39 |   if (action === 'comment') return createComment({ ...req, params: { entityType, entityId }, body: { text: 'Comment noted' } }, res)
   40 |   if (action === 'share') return createShare({ ...req, params: { entityType, entityId } }, res)
   41 |   if (action === 'report') return createReport({ ...req, params: { entityType, entityId }, body: { reason: 'Reported from feed action' } }, res)
   42 |   const row = await addAction(req.user, entityType, entityId, action)
   43 |   return res.status(201).json(row)
   44 | }
   45 | 