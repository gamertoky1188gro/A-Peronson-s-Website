    1 | import { Router } from 'express'
    2 | import { systemAbout, systemHome, systemMeta, systemPolicies, systemPricing } from '../controllers/systemController.js'
    3 | 
    4 | const router = Router()
    5 | 
    6 | router.get('/meta', systemMeta)
    7 | router.get('/home', systemHome)
    8 | router.get('/pricing', systemPricing)
    9 | router.get('/about', systemAbout)
   10 | router.get('/policies', systemPolicies)
   11 | 
   12 | export default router
   13 | 