import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { getProducts, postProduct, searchProducts } from '../controllers/productController.js'

const router = Router()
router.get('/', requireAuth, getProducts)
router.get('/search', requireAuth, searchProducts)
router.post('/', requireAuth, allowRoles('factory', 'buying_house', 'admin'), postProduct)
export default router
