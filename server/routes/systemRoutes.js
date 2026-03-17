import { Router } from 'express'
import { systemAbout, systemHome, systemMeta, systemPricing } from '../controllers/systemController.js'

const router = Router()

router.get('/meta', systemMeta)
router.get('/home', systemHome)
router.get('/pricing', systemPricing)
router.get('/about', systemAbout)

export default router
