    1 | import { Router } from 'express'
    2 | import { requireAuth } from '../middleware/auth.js'
    3 | import { requireAdminSecurity } from '../middleware/adminSecurity.js'
    4 | import { requireAdminStepUp } from '../middleware/adminStepUp.js'
    5 | import { requireDualExportApproval } from '../middleware/adminDualConfirm.js'
    6 | import { adminAuditLogger } from '../middleware/adminAudit.js'
    7 | import {
    8 |   approveDocument,
    9 |   approveVideo,
   10 |   assignSupportTicket,
   11 |   assignAccountManager,
   12 |   listSupportTicketsAdminController,
   13 |   listReportsAudit,
   14 |   listSystemReportsAudit,
   15 |   listProductAppealReportsAudit,
   16 |   listContentReportsAudit,
   17 |   pendingDocuments,
   18 |   pendingVideos,
   19 |   rejectDocument,
   20 |   rejectVideo,
   21 |   resolveReportAudit,
   22 |   subscriptionsAudit,
   23 |   updateSupportTicket,
   24 |   usersAudit,
   25 |   verificationAudit,
   26 |   violationsAudit,
   27 | } from '../controllers/adminController.js'
   28 | import { listEsignFailures, retryEsignFailure, deleteEsignFailure } from '../controllers/adminController.js'
   29 | import { listModerationProducts, updateModerationProduct } from '../controllers/moderationController.js'
   30 | import { adminAction as adminActionController, adminAuditLog as adminAuditLogController, adminDataExport as adminDataExportController, adminEmailExport as adminEmailExportController, adminGetConfig as adminGetConfigController, adminMasterOverview as adminMasterOverviewController, adminUpdateConfig as adminUpdateConfigController } from '../controllers/adminMasterController.js'
   31 | import { adminCatalogOverview } from '../controllers/adminCatalogController.js'
   32 | import { getServerAdminStateController, serverAdminActionController } from '../controllers/serverAdminController.js'
   33 | import { getCmsStateController, cmsActionController } from '../controllers/cmsController.js'
   34 | import { getSecurityStateController, securityActionController } from '../controllers/securityController.js'
   35 | import { integrationActionController, integrationEmailStatusController, integrationOpenSearchStatusController, integrationStatusController } from '../controllers/integrationController.js'
   36 | import {
   37 |   approveOrderCertificationAdmin,
   38 |   attachOrderCertificationEvidenceAdmin,
   39 |   listOrderCertificationsAdmin,
   40 |   revokeOrderCertificationAdmin,
   41 | } from '../controllers/orderCertificationAdminController.js'
   42 | import {
   43 |   listAiAuditLogs,
   44 |   listCallsAdmin,
   45 |   listContractsAdmin,
   46 |   listCouponReport,
   47 |   listDisputesAdmin,
   48 |   exportEmailSegmentAdmin,
   49 |   listFraudReviewAdmin,
   50 |   listInvoicesAdmin,
   51 |   listMatchesAdmin,
   52 |   listOrgOwnershipAdmin,
   53 |   listPartnerRequestsAdmin,
   54 |   listPaymentProofsAdmin,
   55 |   listPayoutsAdmin,
   56 |   listRefundsAdmin,
   57 |   listRequirementsAdmin,
   58 |   listSearchAlertsAdmin,
   59 |   listSearchUsageAdmin,
   60 |   listSignupsAdmin,
   61 |   listStrikeHistoryAdmin,
   62 |   listSubscriptionHistoryAdmin,
   63 |   listWalletLedgerAdmin,
   64 |   listWalletHistoryAdmin,
   65 | } from '../controllers/adminOpsController.js'
   66 | import {
   67 |   applyGovernanceEnforcementController,
   68 |   createGovernancePolicyVersionController,
   69 |   evaluateTrustController,
   70 |   fileGovernanceAppealController,
   71 |   generateGovernanceMonthlyReportController,
   72 |   listGovernanceEnforcementHistoryController,
   73 |   listGovernancePoliciesController,
   74 |   listGovernanceTemplateController,
   75 |   resolveGovernanceAppealController,
   76 |   saveGovernanceTemplateController,
   77 |   simulateGovernancePolicyController,
   78 |   trustSignalsController,
   79 |   upsertGovernancePolicyController,
   80 | } from '../controllers/governanceController.js'
   81 | 
   82 | const router = Router()
   83 | 
   84 | router.get('/users', requireAuth, requireAdminSecurity, adminAuditLogger(), usersAudit)
   85 | router.get('/verification', requireAuth, requireAdminSecurity, adminAuditLogger(), verificationAudit)
   86 | router.get('/subscriptions', requireAuth, requireAdminSecurity, adminAuditLogger(), subscriptionsAudit)
   87 | router.get('/violations', requireAuth, requireAdminSecurity, adminAuditLogger(), violationsAudit)
   88 | router.get('/videos/pending', requireAuth, requireAdminSecurity, adminAuditLogger(), pendingVideos)
   89 | router.post('/videos/:productId/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveVideo)
   90 | router.post('/videos/:productId/reject', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), rejectVideo)
   91 | router.get('/media/pending', requireAuth, requireAdminSecurity, adminAuditLogger(), pendingDocuments)
   92 | router.post('/media/:documentId/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveDocument)
   93 | router.post('/media/:documentId/reject', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), rejectDocument)
   94 | router.get('/reports', requireAuth, requireAdminSecurity, adminAuditLogger(), listReportsAudit)
   95 | router.get('/reports/system', requireAuth, requireAdminSecurity, adminAuditLogger(), listSystemReportsAudit)
   96 | router.get('/reports/product-appeals', requireAuth, requireAdminSecurity, adminAuditLogger(), listProductAppealReportsAudit)
   97 | router.get('/reports/content', requireAuth, requireAdminSecurity, adminAuditLogger(), listContentReportsAudit)
   98 | router.post('/reports/:reportId/resolve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), resolveReportAudit)
   99 | router.get('/moderation/products', requireAuth, requireAdminSecurity, adminAuditLogger(), listModerationProducts)
  100 | router.patch('/moderation/products/:productId', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), updateModerationProduct)
  101 | router.get('/support/tickets', requireAuth, requireAdminSecurity, adminAuditLogger(), listSupportTicketsAdminController)
  102 | router.post('/support/assign', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), assignSupportTicket)
  103 | router.patch('/support/:ticketId', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), updateSupportTicket)
  104 | router.post('/account-manager/assign', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), assignAccountManager)
  105 | router.get('/order-certifications', requireAuth, requireAdminSecurity, adminAuditLogger(), listOrderCertificationsAdmin)
  106 | router.post('/order-certifications/evidence', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), attachOrderCertificationEvidenceAdmin)
  107 | router.post('/order-certifications/approve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), approveOrderCertificationAdmin)
  108 | router.post('/order-certifications/revoke', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), revokeOrderCertificationAdmin)
  109 | router.get('/contracts', requireAuth, requireAdminSecurity, adminAuditLogger(), listContractsAdmin)
  110 | router.get('/disputes', requireAuth, requireAdminSecurity, adminAuditLogger(), listDisputesAdmin)
  111 | router.get('/partner-requests', requireAuth, requireAdminSecurity, adminAuditLogger(), listPartnerRequestsAdmin)
  112 | router.get('/calls', requireAuth, requireAdminSecurity, adminAuditLogger(), listCallsAdmin)
  113 | router.get('/payment-proofs', requireAuth, requireAdminSecurity, adminAuditLogger(), listPaymentProofsAdmin)
  114 | router.get('/wallet/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listWalletHistoryAdmin)
  115 | router.get('/wallet/ledger', requireAuth, requireAdminSecurity, adminAuditLogger(), listWalletLedgerAdmin)
  116 | router.get('/search/alerts', requireAuth, requireAdminSecurity, adminAuditLogger(), listSearchAlertsAdmin)
  117 | router.get('/search/usage', requireAuth, requireAdminSecurity, adminAuditLogger(), listSearchUsageAdmin)
  118 | router.get('/matches', requireAuth, requireAdminSecurity, adminAuditLogger(), listMatchesAdmin)
  119 | router.get('/requirements', requireAuth, requireAdminSecurity, adminAuditLogger(), listRequirementsAdmin)
  120 | router.get('/subscriptions/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listSubscriptionHistoryAdmin)
  121 | router.get('/coupons/report', requireAuth, requireAdminSecurity, adminAuditLogger(), listCouponReport)
  122 | router.get('/invoices', requireAuth, requireAdminSecurity, adminAuditLogger(), listInvoicesAdmin)
  123 | router.get('/payouts', requireAuth, requireAdminSecurity, adminAuditLogger(), listPayoutsAdmin)
  124 | router.get('/refunds', requireAuth, requireAdminSecurity, adminAuditLogger(), listRefundsAdmin)
  125 | router.get('/ai/audit', requireAuth, requireAdminSecurity, adminAuditLogger(), listAiAuditLogs)
  126 | router.get('/signups', requireAuth, requireAdminSecurity, adminAuditLogger(), listSignupsAdmin)
  127 | router.get('/strikes', requireAuth, requireAdminSecurity, adminAuditLogger(), listStrikeHistoryAdmin)
  128 | router.get('/fraud/verification', requireAuth, requireAdminSecurity, adminAuditLogger(), listFraudReviewAdmin)
  129 | router.get('/orgs/ownership', requireAuth, requireAdminSecurity, adminAuditLogger(), listOrgOwnershipAdmin)
  130 | router.get('/catalog', requireAuth, requireAdminSecurity, adminAuditLogger(), adminCatalogOverview)
  131 | router.get('/server-admin/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getServerAdminStateController)
  132 | router.post('/server-admin/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), serverAdminActionController)
  133 | router.get('/cms/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getCmsStateController)
  134 | router.post('/cms/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), cmsActionController)
  135 | router.get('/security/state', requireAuth, requireAdminSecurity, adminAuditLogger(), getSecurityStateController)
  136 | router.post('/security/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), securityActionController)
  137 | router.get('/integrations/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationStatusController)
  138 | router.get('/integrations/opensearch/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationOpenSearchStatusController)
  139 | router.get('/integrations/email/status', requireAuth, requireAdminSecurity, adminAuditLogger(), integrationEmailStatusController)
  140 | router.post('/integrations/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), integrationActionController)
  141 | 
  142 | router.get('/governance/policies', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernancePoliciesController)
  143 | router.post('/governance/policies', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), upsertGovernancePolicyController)
  144 | router.post('/governance/policy-versions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), createGovernancePolicyVersionController)
  145 | router.post('/governance/simulate', requireAuth, requireAdminSecurity, adminAuditLogger(), simulateGovernancePolicyController)
  146 | router.get('/governance/trust/signals', requireAuth, requireAdminSecurity, adminAuditLogger(), trustSignalsController)
  147 | router.post('/governance/trust/evaluate', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), evaluateTrustController)
  148 | router.post('/governance/enforcement/apply', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), applyGovernanceEnforcementController)
  149 | router.get('/governance/enforcement/history', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernanceEnforcementHistoryController)
  150 | router.get('/governance/templates', requireAuth, requireAdminSecurity, adminAuditLogger(), listGovernanceTemplateController)
  151 | router.post('/governance/templates', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), saveGovernanceTemplateController)
  152 | router.post('/governance/appeals', requireAuth, adminAuditLogger(), fileGovernanceAppealController)
  153 | router.post('/governance/appeals/resolve', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), resolveGovernanceAppealController)
  154 | router.post('/governance/reports/monthly', requireAuth, requireAdminSecurity, adminAuditLogger(), generateGovernanceMonthlyReportController)
  155 | 
  156 | router.get('/master', requireAuth, requireAdminSecurity, adminAuditLogger(), adminMasterOverviewController)
  157 | router.post('/actions', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger({
  158 |   actionResolver: (req) => String(req.body?.action || 'admin.action'),
  159 | }), adminActionController)
  160 | router.get('/audit', requireAuth, requireAdminSecurity, adminAuditLogger(), adminAuditLogController)
  161 | router.get('/config', requireAuth, requireAdminSecurity, adminAuditLogger(), adminGetConfigController)
  162 | router.patch('/config', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), adminUpdateConfigController)
  163 | router.get('/emails/export', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), adminEmailExportController)
  164 | router.get('/emails/segments/export', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), exportEmailSegmentAdmin)
  165 | router.get('/exports/run', requireAuth, requireAdminSecurity, requireDualExportApproval, adminAuditLogger(), adminDataExportController)
  166 | 
  167 | router.get('/esign-failures', requireAuth, requireAdminSecurity, adminAuditLogger(), listEsignFailures)
  168 | router.post('/esign-failures/:id/retry', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), retryEsignFailure)
  169 | router.delete('/esign-failures/:id', requireAuth, requireAdminSecurity, requireAdminStepUp, adminAuditLogger(), deleteEsignFailure)
  170 | 
  171 | export default router
  172 | 