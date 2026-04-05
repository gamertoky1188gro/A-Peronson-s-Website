import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAdminSecurity } from '../middleware/adminSecurity.js'
import { requireAdminStepUp } from '../middleware/adminStepUp.js'
import { requireDualExportApproval } from '../middleware/adminDualConfirm.js'
import { adminAuditLogger } from '../middleware/adminAudit.js'
import {
  approveDocument,
  approveVideo,
  assignSupportTicket,
  assignAccountManager,
  listSupportTicketsAdminController,
  listReportsAudit,
  listSystemReportsAudit,
  listProductAppealReportsAudit,
  listContentReportsAudit,
  pendingDocuments,
  pendingVideos,
  rejectDocument,
  rejectVideo,
  resolveReportAudit,
  subscriptionsAudit,
  updateSupportTicket,
  usersAudit,
  verificationAudit,
  violationsAudit,
} from '../controllers/adminController.js'
import { listModerationProducts, updateModerationProduct } from '../controllers/moderationController.js'
import { adminAction as adminActionController, adminAuditLog as adminAuditLogController, adminDataExport as adminDataExportController, adminEmailExport as adminEmailExportController, adminGetConfig as adminGetConfigController, adminMasterOverview as adminMasterOverviewController, adminUpdateConfig as adminUpdateConfigController } from '../controllers/adminMasterController.js'
import { adminCatalogOverview } from '../controllers/adminCatalogController.js'
import { getServerAdminStateController, serverAdminActionController } from '../controllers/serverAdminController.js'
import { getCmsStateController, cmsActionController } from '../controllers/cmsController.js'
import { getSecurityStateController, securityActionController } from '../controllers/securityController.js'
import { integrationActionController, integrationEmailStatusController, integrationOpenSearchStatusController, integrationStatusController } from '../controllers/integrationController.js'
import {
  approveOrderCertificationAdmin,
  attachOrderCertificationEvidenceAdmin,
  listOrderCertificationsAdmin,
  revokeOrderCertificationAdmin,
} from '../controllers/orderCertificationAdminController.js'
import {
  listAiAuditLogs,
  listCallsAdmin,
  listContractsAdmin,
  listCouponReport,
  listDisputesAdmin,
  exportEmailSegmentAdmin,
  listFraudReviewAdmin,
  listInvoicesAdmin,
  listMatchesAdmin,
  listOrgOwnershipAdmin,
  listPartnerRequestsAdmin,
  listPaymentProofsAdmin,
  listPayoutsAdmin,
  listRefundsAdmin,
  listRequirementsAdmin,
  listSearchAlertsAdmin,
  listSearchUsageAdmin,
  listSignupsAdmin,
  listStrikeHistoryAdmin,
  listSubscriptionHistoryAdmin,
  listWalletLedgerAdmin,
  listWalletHistoryAdmin,
} from '../controllers/adminOpsController.js'

const router = Router()

router.get('/users', requireAuth, requireAdminSecurity, adminAuditLogger(), usersAudit)
router.get('/verification', requireAuth, requireAdminSecurity, adminAuditLogger(), verificationAudit)
router.get('/subscriptions', requireAuth, requireAdminSecurity, adminAuditLogger(), subscriptionsAudit)
router.get('/violations', requireAuth, requireAdminSecurity, adminAuditLogger(), violationsAudit)
router.get('/videos/pending', requireAuth, requireAdminSecurity, adminAuditLogger(), pendingVideos)
router.post('/videos/:productId/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveVideo)
router.post('/videos/:productId/reject', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), rejectVideo)
router.get('/media/pending', requireAuth, requireAdminSecurity, adminAuditLogger(), pendingDocuments)
router.post('/media/:documentId/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveDocument)
router.post('/media/:documentId/reject', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), rejectDocument)
router.get('/reports', requireAuth, requireAdminSecurity, adminAuditLogger(), listReportsAudit)
router.get('/reports/system', requireAuth, requireAdminSecurity, adminAuditLogger(), listSystemReportsAudit)
router.get('/reports/product-appeals', requireAuth, requireAdminSecurity, adminAuditLogger(), listProductAppealReportsAudit)
router.get('/reports/content', requireAuth, requireAdminSecurity, adminAuditLogger(), listContentReportsAudit)
router.post('/reports/:reportId/resolve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), resolveReportAudit)
router.get('/moderation/products', requireAuth, requireAdminSecurity, adminAuditLogger(), listModerationProducts)
router.patch('/moderation/products/:productId', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), updateModerationProduct)
router.get('/support/tickets', requireAuth, requireAdminSecurity, adminAuditLogger(), listSupportTicketsAdminController)
router.post('/support/assign', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), assignSupportTicket)
router.patch('/support/:ticketId', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), updateSupportTicket)
router.post('/account-manager/assign', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), assignAccountManager)
router.get('/order-certifications', requireAuth, requireAdminSecurity, adminAuditLogger(), listOrderCertificationsAdmin)
router.post('/order-certifications/evidence', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), attachOrderCertificationEvidenceAdmin)
router.post('/order-certifications/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveOrderCertificationAdmin)
router.post('/order-certifications/revoke', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), revokeOrderCertificationAdmin)
router.get('/contracts', requireAuth, requireAdminSecurity, adminAuditLogger(), listContractsAdmin)
router.get('/disputes', requireAuth, requireAdminSecurity, adminAuditLogger(), listDisputesAdmin)
router.get('/partner-requests', requireAuth, requireAdminSecurity, adminAuditLogger(), listPartnerRequestsAdmin)
router.get('/calls', requireAuth, requireAdminSecurity, adminAuditLogger(), listCallsAdmin)
router.get('/payment-proofs', requireAuth, requireAdminSecurity, adminAuditLogger(), listPaymentProofsAdmin)
router.get('/wallet/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listWalletHistoryAdmin)
router.get('/wallet/ledger', requireAuth, requireAdminSecurity, adminAuditLogger(), listWalletLedgerAdmin)
router.get('/search/alerts', requireAuth, requireAdminSecurity, adminAuditLogger(), listSearchAlertsAdmin)
router.get('/search/usage', requireAuth, requireAdminSecurity, adminAuditLogger(), listSearchUsageAdmin)
router.get('/matches', requireAuth, requireAdminSecurity, adminAuditLogger(), listMatchesAdmin)
router.get('/requirements', requireAuth, requireAdminSecurity, adminAuditLogger(), listRequirementsAdmin)
router.get('/subscriptions/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listSubscriptionHistoryAdmin)
router.get('/coupons/report', requireAuth, requireAdminSecurity, adminAuditLogger(), listCouponReport)
router.get('/invoices', requireAuth, requireAdminSecurity, adminAuditLogger(), listInvoicesAdmin)
router.get('/payouts', requireAuth, requireAdminSecurity, adminAuditLogger(), listPayoutsAdmin)
router.get('/refunds', requireAuth, requireAdminSecurity, adminAuditLogger(), listRefundsAdmin)
router.get('/ai/audit', requireAuth, requireAdminSecurity, adminAuditLogger(), listAiAuditLogs)
router.get('/signups', requireAuth, requireAdminSecurity, adminAuditLogger(), listSignupsAdmin)
router.get('/strikes', requireAuth, requireAdminSecurity, adminAuditLogger(), listStrikeHistoryAdmin)
router.get('/fraud/verification', requireAuth, requireAdminSecurity, adminAuditLogger(), listFraudReviewAdmin)
router.get('/orgs/ownership', requireAuth, requireAdminSecurity, adminAuditLogger(), listOrgOwnershipAdmin)
router.get('/catalog', requireAuth, requireAdminSecurity, adminAuditLogger(), adminCatalogOverview)
router.get('/server-admin/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getServerAdminStateController)
router.post('/server-admin/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), serverAdminActionController)
router.get('/cms/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getCmsStateController)
router.post('/cms/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), cmsActionController)
router.get('/security/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getSecurityStateController)
router.post('/security/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), securityActionController)
router.get('/integrations/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationStatusController)
router.get('/integrations/opensearch/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationOpenSearchStatusController)
router.get('/integrations/email/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationEmailStatusController)
router.post('/integrations/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), integrationActionController)

router.get('/master', requireAuth, requireAdminSecurity, adminAuditLogger(), adminMasterOverviewController)
router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
  actionResolver: (req) => String(req.body?.action || 'admin.action'),
}), adminActionController)
router.get('/audit', requireAuth, requireAdminSecurity, adminAuditLogger(), adminAuditLogController)
router.get('/config', requireAuth, requireAdminSecurity, adminAuditLogger(), adminGetConfigController)
router.patch('/config', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), adminUpdateConfigController)
router.get('/emails/export', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), adminEmailExportController)
router.get('/emails/segments/export', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), exportEmailSegmentAdmin)
router.get('/exports/run', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), adminDataExportController)

export default router
