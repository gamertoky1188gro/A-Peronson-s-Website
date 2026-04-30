    1 | import { getCrmProfileSummary, getCrmRelationshipTimeline } from '../services/crmService.js'
    2 | import { handleControllerError } from '../utils/permissions.js'
    3 | 
    4 | export async function crmProfileSummary(req, res) {
    5 |   try {
    6 |     const result = await getCrmProfileSummary(req.user, req.params.targetId, {
    7 |       match_id: req.query?.match_id,
    8 |       from: req.query?.from,
    9 |       to: req.query?.to,
   10 |     })
   11 |     if (result?.error === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   12 |     if (result?.error) return res.status(404).json({ error: result.error })
   13 |     return res.json(result)
   14 |   } catch (error) {
   15 |     return handleControllerError(res, error)
   16 |   }
   17 | }
   18 | 
   19 | export async function crmRelationshipTimeline(req, res) {
   20 |   try {
   21 |     const result = await getCrmRelationshipTimeline(req.user, req.params.counterpartyId, {
   22 |       match_id: req.query?.match_id,
   23 |       from: req.query?.from,
   24 |       to: req.query?.to,
   25 |     })
   26 |     if (result?.error === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   27 |     if (result?.error) return res.status(404).json({ error: result.error })
   28 |     return res.json(result)
   29 |   } catch (error) {
   30 |     return handleControllerError(res, error)
   31 |   }
   32 | }
   33 | 