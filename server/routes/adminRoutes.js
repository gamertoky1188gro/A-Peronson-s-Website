import { Router } from 'express'
import { allowRoles, requireAuth } from '../middleware/auth.js'
import {
  approveDocument,
  approveVideo,
  listReportsAudit,
  pendingDocuments,
  pendingVideos,
  rejectDocument,
  rejectVideo,
  resolveReportAudit,
  subscriptionsAudit,
  usersAudit,
  verificationAudit,
  violationsAudit,
} from '../controllers/adminController.js'

const router = Router()

router.get('/users', requireAuth, allowRoles('owner', 'admin'), usersAudit)
router.get('/verification', requireAuth, allowRoles('owner', 'admin'), verificationAudit)
router.get('/subscriptions', requireAuth, allowRoles('owner', 'admin'), subscriptionsAudit)
router.get('/violations', requireAuth, allowRoles('owner', 'admin'), violationsAudit)
router.get('/videos/pending', requireAuth, allowRoles('owner', 'admin'), pendingVideos)
router.post('/videos/:productId/approve', requireAuth, allowRoles('owner', 'admin'), approveVideo)
router.post('/videos/:productId/reject', requireAuth, allowRoles('owner', 'admin'), rejectVideo)
router.get('/media/pending', requireAuth, allowRoles('owner', 'admin'), pendingDocuments)
router.post('/media/:documentId/approve', requireAuth, allowRoles('owner', 'admin'), approveDocument)
router.post('/media/:documentId/reject', requireAuth, allowRoles('owner', 'admin'), rejectDocument)
router.get('/reports', requireAuth, allowRoles('owner', 'admin'), listReportsAudit)
router.post('/reports/:reportId/resolve', requireAuth, allowRoles('owner', 'admin'), resolveReportAudit)

export default router
