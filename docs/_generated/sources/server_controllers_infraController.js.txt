    1 | import { getInfraState, getSystemOverview, listProcesses, listServices, listStorage, performInfraAction } from '../services/infraService.js'
    2 | 
    3 | export async function infraOverview(req, res) {
    4 |   const data = await getSystemOverview()
    5 |   return res.json(data)
    6 | }
    7 | 
    8 | export async function infraProcesses(req, res) {
    9 |   const data = await listProcesses()
   10 |   return res.json({ items: data })
   11 | }
   12 | 
   13 | export async function infraServices(req, res) {
   14 |   const data = await listServices()
   15 |   return res.json({ items: data })
   16 | }
   17 | 
   18 | export async function infraStorage(req, res) {
   19 |   const data = await listStorage()
   20 |   return res.json({ items: data })
   21 | }
   22 | 
   23 | export async function infraState(req, res) {
   24 |   const data = await getInfraState()
   25 |   return res.json(data)
   26 | }
   27 | 
   28 | export async function infraAction(req, res) {
   29 |   const action = String(req.body?.action || '').trim()
   30 |   if (!action) return res.status(400).json({ error: 'action is required' })
   31 |   const payload = req.body?.payload || {}
   32 |   const result = await performInfraAction(action, payload)
   33 |   return res.json(result)
   34 | }
   35 | 