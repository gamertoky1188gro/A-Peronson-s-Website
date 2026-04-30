    1 | import { getPartnerNetwork, sendPartnerRequest, updatePartnerRequestStatus } from '../services/partnerNetworkService.js'
    2 | 
    3 | function handleError(res, error) {
    4 |   const status = Number(error?.status) || 500
    5 |   if (status === 500) return res.status(500).json({ error: 'Internal server error' })
    6 |   return res.status(status).json({ error: error.message || 'Request failed' })
    7 | }
    8 | 
    9 | export async function listPartnerNetwork(req, res) {
   10 |   try {
   11 |     const data = await getPartnerNetwork(req.user, { status: req.query.status || '' })
   12 |     return res.json(data)
   13 |   } catch (error) {
   14 |     return handleError(res, error)
   15 |   }
   16 | }
   17 | 
   18 | export async function createPartnerRequest(req, res) {
   19 |   const targetAccountId = req.body?.targetAccountId || ''
   20 |   if (!targetAccountId) return res.status(400).json({ error: 'targetAccountId is required' })
   21 | 
   22 |   try {
   23 |     const row = await sendPartnerRequest(req.user, targetAccountId)
   24 |     return res.status(201).json(row)
   25 |   } catch (error) {
   26 |     return handleError(res, error)
   27 |   }
   28 | }
   29 | 
   30 | async function handleStatusAction(req, res, action) {
   31 |   try {
   32 |     const row = await updatePartnerRequestStatus(req.user, req.params.requestId, action)
   33 |     return res.json(row)
   34 |   } catch (error) {
   35 |     return handleError(res, error)
   36 |   }
   37 | }
   38 | 
   39 | export async function acceptPartnerRequest(req, res) {
   40 |   return handleStatusAction(req, res, 'accept')
   41 | }
   42 | 
   43 | export async function rejectPartnerRequest(req, res) {
   44 |   return handleStatusAction(req, res, 'reject')
   45 | }
   46 | 
   47 | export async function cancelPartnerRequest(req, res) {
   48 |   return handleStatusAction(req, res, 'cancel')
   49 | }
   50 | 