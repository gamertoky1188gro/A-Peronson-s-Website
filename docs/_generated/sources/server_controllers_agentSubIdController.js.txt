    1 | import { listAgentSubIds, createAgentSubId, getAgentSubIdById, deleteAgentSubId } from '../services/agentSubIdService.js'
    2 | import { handleControllerError } from '../utils/permissions.js'
    3 | 
    4 | export async function listAgentSubIdsController(req, res) {
    5 |   try {
    6 |     const items = await listAgentSubIds(req.user)
    7 |     return res.json({ items })
    8 |   } catch (err) {
    9 |     return handleControllerError(res, err)
   10 |   }
   11 | }
   12 | 
   13 | export async function createAgentSubIdController(req, res) {
   14 |   try {
   15 |     const payload = req.body || {}
   16 |     const created = await createAgentSubId(req.user.id, { label: payload.label || '', metadata: payload.metadata || {} })
   17 |     return res.status(201).json(created)
   18 |   } catch (err) {
   19 |     return handleControllerError(res, err)
   20 |   }
   21 | }
   22 | 
   23 | export async function getAgentSubIdController(req, res) {
   24 |   try {
   25 |     const id = String(req.params.id || '')
   26 |     const row = await getAgentSubIdById(id)
   27 |     if (!row) return res.status(404).json({ error: 'Not found' })
   28 |     if (String(row.owner_id) !== String(req.user.id) && req.user?.role !== 'admin' && req.user?.role !== 'owner') return res.status(403).json({ error: 'Forbidden' })
   29 |     return res.json(row)
   30 |   } catch (err) {
   31 |     return handleControllerError(res, err)
   32 |   }
   33 | }
   34 | 
   35 | export async function deleteAgentSubIdController(req, res) {
   36 |   try {
   37 |     const id = String(req.params.id || '')
   38 |     const ok = await deleteAgentSubId(id, req.user)
   39 |     if (!ok) return res.status(404).json({ error: 'Not found' })
   40 |     return res.json({ ok: true })
   41 |   } catch (err) {
   42 |     if (String(err.message || '').toLowerCase().includes('forbidden')) return res.status(403).json({ error: 'Forbidden' })
   43 |     return handleControllerError(res, err)
   44 |   }
   45 | }
   46 | 
   47 | export default { listAgentSubIdsController, createAgentSubIdController, getAgentSubIdController, deleteAgentSubIdController }
   48 | 