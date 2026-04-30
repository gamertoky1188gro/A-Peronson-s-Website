    1 | import { getIntegrationStatus, runIntegrationAction } from '../services/integrationStatusService.js'
    2 | import { getOpenSearchStatus } from '../services/openSearchService.js'
    3 | import { getEmailDeliveryStatus } from '../services/emailService.js'
    4 | 
    5 | export async function integrationStatusController(req, res) {
    6 |   const status = await getIntegrationStatus()
    7 |   return res.json(status)
    8 | }
    9 | 
   10 | export async function integrationActionController(req, res) {
   11 |   const action = String(req.body?.action || '').trim()
   12 |   const payload = req.body?.payload || {}
   13 |   const result = await runIntegrationAction(action, payload)
   14 |   return res.json(result)
   15 | }
   16 | 
   17 | export async function integrationOpenSearchStatusController(req, res) {
   18 |   const status = await getOpenSearchStatus()
   19 |   return res.json(status)
   20 | }
   21 | 
   22 | export async function integrationEmailStatusController(req, res) {
   23 |   const status = await getEmailDeliveryStatus()
   24 |   return res.json(status)
   25 | }
   26 | 