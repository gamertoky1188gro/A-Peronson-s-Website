import { Router } from 'express'
import memberRoutes from './memberRoutes.js'

const router = Router()

router.use('/members', memberRoutes)

export default router
