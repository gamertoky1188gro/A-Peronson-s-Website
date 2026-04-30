    1 | import { createPaymentProof, listPaymentProofsByContract, updatePaymentProof } from '../services/paymentProofService.js'
    2 | import { handleControllerError } from '../utils/permissions.js'
    3 | 
    4 | export async function postPaymentProof(req, res) {
    5 |   try {
    6 |     const row = await createPaymentProof(req.user, req.body || {})
    7 |     return res.status(201).json(row)
    8 |   } catch (error) {
    9 |     return handleControllerError(res, error)
   10 |   }
   11 | }
   12 | 
   13 | export async function getPaymentProofs(req, res) {
   14 |   try {
   15 |     const contractId = req.query.contract_id || req.query.contractId
   16 |     const items = await listPaymentProofsByContract(req.user, contractId)
   17 |     return res.json(items)
   18 |   } catch (error) {
   19 |     return handleControllerError(res, error)
   20 |   }
   21 | }
   22 | 
   23 | export async function patchPaymentProof(req, res) {
   24 |   try {
   25 |     const row = await updatePaymentProof(req.user, req.params.proofId, req.body || {})
   26 |     if (!row) return res.status(404).json({ error: 'Payment proof not found' })
   27 |     return res.json(row)
   28 |   } catch (error) {
   29 |     return handleControllerError(res, error)
   30 |   }
   31 | }
   32 | 