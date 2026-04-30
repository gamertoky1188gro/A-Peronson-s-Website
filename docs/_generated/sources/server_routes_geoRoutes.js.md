    1 | import { Router } from 'express'
    2 | import { geoLocate, geoSearch } from '../controllers/geoController.js'
    3 | 
    4 | const router = Router()
    5 | 
    6 | router.get('/locate', geoLocate)
    7 | router.get('/search', geoSearch)
    8 | 
    9 | export default router
   10 | 