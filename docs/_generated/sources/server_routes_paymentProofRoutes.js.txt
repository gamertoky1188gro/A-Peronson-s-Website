    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import { getPaymentProofs, patchPaymentProof, postPaymentProof } from '../controllers/paymentProofController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.get('/', requireAuth, allowRoles('buyer', 'factory', 'buying_house', 'admin', 'owner', 'agent'), getPaymentProofs)
    8 | router.post('/', requireAuth, allowRoles('buyer', 'factory', 'buying_house', 'admin', 'owner', 'agent'), postPaymentProof)
    9 | router.patch('/:proofId', requireAuth, allowRoles('factory', 'buying_house', 'admin', 'owner'), patchPaymentProof)
   10 | 
   11 | export default router
   12 | 