    1 | import { getNetworkInventory, getNetworkOverview, performNetworkAction } from '../services/networkService.js'
    2 | 
    3 | export async function networkOverview(req, res) {
    4 |   const data = await getNetworkOverview()
    5 |   return res.json(data)
    6 | }
    7 | 
    8 | export async function networkInventory(req, res) {
    9 |   const data = await getNetworkInventory()
   10 |   return res.json(data)
   11 | }
   12 | 
   13 | export async function networkAction(req, res) {
   14 |   const action = String(req.body?.action || '').trim()
   15 |   if (!action) return res.status(400).json({ error: 'action is required' })
   16 |   const payload = req.body?.payload || {}
   17 |   const result = await performNetworkAction(action, payload)
   18 |   return res.json(result)
   19 | }
   20 | 
   21 | 