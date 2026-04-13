import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  listPresetsController,
  createPresetController,
  getPresetController,
  updatePresetController,
  deletePresetController,
} from '../controllers/presetsController.js'

const router = Router()

router.get('/', requireAuth, listPresetsController)
router.post('/', requireAuth, createPresetController)
router.get('/:id', requireAuth, getPresetController)
router.patch('/:id', requireAuth, updatePresetController)
router.delete('/:id', requireAuth, deletePresetController)

export default router
