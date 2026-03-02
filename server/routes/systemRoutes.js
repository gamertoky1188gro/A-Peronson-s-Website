import { Router } from 'express'
import { systemMeta } from '../controllers/systemController.js'

const router = Router()

router.get('/meta', systemMeta)

export default router
