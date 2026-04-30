    1 | import { getCmsState, performCmsAction } from '../services/cmsService.js'
    2 | 
    3 | export async function getCmsStateController(req, res) {
    4 |   const state = await getCmsState()
    5 |   return res.json(state)
    6 | }
    7 | 
    8 | export async function cmsActionController(req, res) {
    9 |   const action = req.body?.action || ''
   10 |   const payload = req.body?.payload || {}
   11 |   const result = await performCmsAction(action, payload)
   12 |   return res.json(result)
   13 | }
   14 | 