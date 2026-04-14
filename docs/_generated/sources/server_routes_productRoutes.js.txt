    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import validateFiltersMiddleware from '../middleware/validateSearchFilters.js'
    4 | import { deleteProduct, getMyViewedProducts, getProducts, postProduct, recordProductView, searchProducts, updateProduct } from '../controllers/productController.js'
    5 | 
    6 | const router = Router()
    7 | router.get('/', requireAuth, getProducts)
    8 | router.get('/search', requireAuth, validateFiltersMiddleware, searchProducts)
    9 | router.get('/views/me', requireAuth, getMyViewedProducts)
   10 | router.post('/', requireAuth, allowRoles('factory', 'buying_house', 'admin', 'agent'), postProduct)
   11 | router.patch('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin', 'agent'), updateProduct)
   12 | router.delete('/:productId', requireAuth, allowRoles('factory', 'buying_house', 'admin', 'agent'), deleteProduct)
   13 | router.post('/:productId/view', requireAuth, recordProductView)
   14 | export default router
   15 | 