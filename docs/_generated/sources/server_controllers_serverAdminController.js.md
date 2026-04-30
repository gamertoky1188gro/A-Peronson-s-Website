    1 | import { getServerAdminState, performServerAdminAction } from '../services/serverAdminService.js'
    2 | 
    3 | export async function getServerAdminStateController(req, res) {
    4 |   const state = await getServerAdminState()
    5 |   return res.json(state)
    6 | }
    7 | 
    8 | export async function serverAdminActionController(req, res) {
    9 |   const action = req.body?.action || ''
   10 |   const payload = req.body?.payload || {}
   11 |   const result = await performServerAdminAction(action, payload)
   12 |   return res.json(result)
   13 | }
   14 | 