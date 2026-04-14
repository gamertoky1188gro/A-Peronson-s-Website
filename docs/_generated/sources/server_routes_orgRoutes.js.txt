    1 | import { Router } from 'express'
    2 | import memberRoutes from './memberRoutes.js'
    3 | import orgOperationsRoutes from './orgOperationsRoutes.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | router.use('/members', memberRoutes)
    8 | router.use('/operations', orgOperationsRoutes)
    9 | router.use('/ops', orgOperationsRoutes)
   10 | 
   11 | export default router
   12 | 