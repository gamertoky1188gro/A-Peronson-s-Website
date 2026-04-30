    1 | import { getSecurityState, performSecurityAction } from '../services/securityService.js'
    2 | 
    3 | export async function getSecurityStateController(req, res) {
    4 |   const state = await getSecurityState()
    5 |   return res.json(state)
    6 | }
    7 | 
    8 | export async function securityActionController(req, res) {
    9 |   const action = req.body?.action || ''
   10 |   const payload = req.body?.payload || {}
   11 |   const result = await performSecurityAction(action, payload)
   12 |   return res.json(result)
   13 | }
   14 | 