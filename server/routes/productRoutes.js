import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import { deleteProduct, getMyViewedProducts, getProducts, postProduct, recordProductView, searchProducts, updateProduct } from '../controllers/productController.js'

const router = Router()
router.get('/', requireAuth, getProducts)
router.get('/search', requireAuth, searchProducts)
router.get('/views/me', requireAuth, getMyViewedProducts)
router.post('/', requireAuth, allowRoles('factory', 'buying_house', 'admin'), postProduct)
router.patch('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin'), updateProduct)
router.delete('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin'), deleteProduct)
router.post('/:productId/view', requireAuth, recordProductView)
export default router
