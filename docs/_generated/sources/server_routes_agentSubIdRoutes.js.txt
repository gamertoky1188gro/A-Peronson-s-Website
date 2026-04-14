    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   listAgentSubIdsController,
    5 |   createAgentSubIdController,
    6 |   getAgentSubIdController,
    7 |   deleteAgentSubIdController,
    8 | } from '../controllers/agentSubIdController.js'
    9 | 
   10 | const router = Router()
   11 | 
   12 | router.get('/', requireAuth, listAgentSubIdsController)
   13 | router.post('/', requireAuth, createAgentSubIdController)
   14 | router.get('/:id', requireAuth, getAgentSubIdController)
   15 | router.delete('/:id', requireAuth, deleteAgentSubIdController)
   16 | 
   17 | export default router
   18 | 