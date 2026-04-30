    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import {
    4 |   listPresetsController,
    5 |   createPresetController,
    6 |   getPresetController,
    7 |   updatePresetController,
    8 |   deletePresetController,
    9 | } from '../controllers/presetsController.js'
   10 | 
   11 | const router = Router()
   12 | 
   13 | router.get('/', requireAuth, listPresetsController)
   14 | router.post('/', requireAuth, createPresetController)
   15 | router.get('/:id', requireAuth, getPresetController)
   16 | router.patch('/:id', requireAuth, updatePresetController)
   17 | router.delete('/:id', requireAuth, deletePresetController)
   18 | 
   19 | export default router
   20 | 