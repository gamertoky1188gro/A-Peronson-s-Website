import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { getDocuments, removeDocument, uploadDocument } from '../controllers/documentController.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } })
const router = Router()

router.post('/', requireAuth, upload.single('file'), uploadDocument)
router.get('/', requireAuth, getDocuments)
router.delete('/:documentId', requireAuth, removeDocument)

export default router
