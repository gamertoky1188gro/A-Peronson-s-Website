## Commit Metadata

- **Hash:** bbe825387629d4609ef588a5e34614ce89ba515c
- **Parent:** 882c427a8f051a5170bf9b91560c3d47ebb4512a 1cac774dc741806a6e44cb612b6b26e30605f2a2
- **Author:** Cyber Code Master
- **Date:** 2026-04-13 09:45:43
- **Message:** Merge pull request #90 from gamertoky1188gro/feat/ci-reindex-contract-audit-fix

## Custom Title

Merge: Merge pull request #90 from gamertoky1188gro/feat/ci-reindex-contract-audit-fix

## High-Level Summary

Merge commit integrating changes from a feature branch into the target branch.

## File-by-File Breakdown

- **.env.example** — +30/-0 lines
- **.github/workflows/ci.yml** — +43/-0 lines
- **.github/workflows/nodejs-tests.yml** — +26/-0 lines
- **.github/workflows/opensearch-ci.yml** — +39/-0 lines
- **.gitmodules** — +3/-0 lines
- **README.md** — +542/-0 lines
- **codex-transcript-viewer** — +1/-0 lines
- **docker-compose.yml** — +16/-0 lines
- **docs/AI_PIPELINE_INTEGRATION.md** — +17/-0 lines
- **docs/eSignIntegration.md** — +48/-0 lines
- **jest.config.cjs** — +7/-0 lines
- **package-lock.json** — +18259/-0 lines
- **package.json** — +162/-0 lines
- **prisma/schema.prisma** — +2503/-0 lines
- **scripts/ci/reindex-opensearch.mjs** — +203/-0 lines
- **scripts/ci/smoke-search.mjs** — +52/-0 lines
- **scripts/debug-esign.mjs** — +21/-0 lines
- **scripts/debug-provider-call.mjs** — +20/-0 lines
- **scripts/indexer.mjs** — +36/-0 lines
- **scripts/run-integration-test.mjs** — +29/-0 lines
- **scripts/test-hallucination.mjs** — +24/-0 lines
- **server/controllers/adminController.js** — +42/-0 lines
- **server/controllers/agentSubIdController.js** — +47/-0 lines
- **server/controllers/analyticsController.js** — +401/-0 lines
- **server/controllers/assistantController.js** — +40/-0 lines
- **server/controllers/documentController.js** — +331/-0 lines
- **server/controllers/exportController.js** — +28/-0 lines
- **server/controllers/presetsController.js** — +58/-0 lines
- **server/controllers/productController.js** — +1674/-0 lines
- **server/controllers/requirementController.js** — +1786/-0 lines
- **server/controllers/systemController.js** — +606/-0 lines
- **server/database/admin_audit.json** — +174/-0 lines
- **server/evals/ai_extraction_eval.mjs** — +53/-0 lines
- **server/evals/examples.json** — +10/-0 lines
- **server/middleware/validateSearchFilters.js** — +91/-0 lines
- **server/routes/adminRoutes.js** — +337/-0 lines
- **server/routes/agentSubIdRoutes.js** — +17/-0 lines
- **server/routes/analyticsRoutes.js** — +56/-0 lines
- **server/routes/assistantRoutes.js** — +6/-0 lines
- **server/routes/devRoutes.js** — +52/-0 lines
- **server/routes/documentRoutes.js** — +6/-0 lines
- **server/routes/exportRoutes.js** — +9/-0 lines
- **server/routes/presetsRoutes.js** — +19/-0 lines
- **server/routes/productRoutes.js** — +3/-0 lines
- **server/routes/requirementRoutes.js** — +3/-0 lines
- **server/schemas/searchFilters.schema.json** — +51/-0 lines
- **server/server.js** — +1371/-0 lines
- **server/services/agentSubIdService.js** — +49/-0 lines
- **server/services/aiOrchestrationService.js** — +485/-0 lines
- **server/services/aiVerifier.js** — +75/-0 lines
- **server/services/analyticsExportService.js** — +70/-0 lines
- **server/services/analyticsService.js** — +2264/-0 lines
- **server/services/documentService.js** — +1169/-0 lines
- **server/services/eSignCallbackMapper.js** — +84/-0 lines
- **server/services/eSignProvider.js** — +45/-0 lines
- **server/services/eSignService.js** — +93/-0 lines
- **server/services/esignRetryService.js** — +77/-0 lines
- **server/services/leadReminderService.js** — +283/-0 lines
- **server/services/messageService.js** — +1115/-0 lines
- **server/services/openSearchService.js** — +1723/-0 lines
- **server/services/orgAiService.js** — +17/-0 lines
- **server/services/presetsService.js** — +82/-0 lines
- **server/services/providers/dropboxSign.js** — +39/-0 lines
- **server/services/requirementService.js** — +1010/-0 lines
- **server/tests/test_analytics_privacy.mjs** — +36/-0 lines
- **server/uploads/contracts/CN-1775497899552-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775499328875-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775499394225-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775499461897-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775499558383-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775499628612-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775500199285-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775500280481-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775500832673-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775541199846-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775543451304-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775550062710-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775551357081-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775552336057-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775552683313-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775560444347-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775560459162-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775561803128-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775564271265-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775566182419-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775566212961-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775567900838-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775567918369-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775569624073-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775569663015-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775571042921-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775571075519-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1775574768486-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776011290917-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776011308253-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776011341020-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776013907054-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776013986628-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014068054-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014223809-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014278758-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014294547-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014315562-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014418185-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014482629-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014500031-v1.pdf** — +3/-0 lines
- **server/uploads/contracts/CN-1776014533693-v1.pdf** — +3/-0 lines
- **server/utils/crmFallbackStore.js** — +66/-0 lines
- **server/utils/db.js** — +0/-2 lines
- **server/utils/hallucinationDetector.js** — +33/-0 lines
- **server/utils/jsonStore.js** — +458/-0 lines
- **server/workers/leadRemindersWorker.js** — +45/-0 lines
- **shared/ai-requirement-schema.json** — +17/-0 lines
- **src/components/profile/CrmSummaryPanel.jsx** — +2/-0 lines
- **src/lib/aiPrefill.js** — +52/-0 lines
- **src/pages/AdminPanel.jsx** — +9084/-0 lines
- **src/pages/BuyerRequestManagement.jsx** — +2965/-0 lines
- **src/pages/ContractVault.jsx** — +2547/-0 lines
- **src/pages/Insights.jsx** — +1289/-0 lines
- **src/pages/SearchResults.jsx** — +5017/-0 lines
- **src/pages/SupportReports.jsx** — +682/-0 lines
- **src/pages/TexHub.jsx** — +1866/-0 lines
- **src/pages/**tests**/searchFiltersConfig.test.js** — +78/-0 lines
- **src/pages/searchFiltersConfig.js** — +107/-0 lines
- **tests/integration/ai-postMessage-enforce.test.js** — +25/-0 lines
- **tests/integration/ai-prefill-e2e.test.js** — +71/-0 lines
- **tests/integration/aiVerifierOrgOverride.test.js** — +48/-0 lines
- **tests/integration/aiVerifierRemote.test.js** — +45/-0 lines
- **tests/integration/auditedExport.test.js** — +35/-0 lines
- **tests/integration/contractAudit.test.js** — +28/-0 lines
- **tests/integration/contractSigning.test.js** — +18/-0 lines
- **tests/integration/eSignFullFlow.test.js** — +58/-0 lines
- **tests/integration/leadReminders.test.js** — +21/-0 lines
- **tests/integration/orchestration.test.js** — +17/-0 lines
- **tests/integration/sendReply.test.js** — +22/-0 lines
- **tests/testServer.js** — +11/-0 lines
- **tests/unit/agentSubIds.test.js** — +25/-0 lines
- **tests/unit/aiPrefill.test.js** — +13/-0 lines
- **tests/unit/aiVerifier.test.js** — +17/-0 lines
- **tests/unit/analyticsGovernance.strip.test.js** — +16/-0 lines
- **tests/unit/analyticsGovernance.suppression.test.js** — +23/-0 lines
- **tests/unit/analyticsGovernance.test.js** — +17/-0 lines
- **tests/unit/analyticsService.test.js** — +17/-0 lines
- **tests/unit/eSignCallbackMapper.test.js** — +42/-0 lines
- **tests/unit/eSignProviderDropbox.test.js** — +36/-0 lines
- **tests/unit/hallucination.test.js** — +17/-0 lines
- **tests/unit/orgThresholds.test.js** — +21/-0 lines
- **tests/unit/presetsService.test.js** — +39/-0 lines
- **tests/unit/requirementMatchId.test.js** — +32/-0 lines
- **tests/unit/verifyFilterMapping.test.js** — +16/-0 lines

## Detailed Diff Analysis

Merge commit. No direct code changes in this commit itself.

## Why This Change

Standard merge to synchronize branches.

## Was It Useful

Yes

## Impact Analysis

- **Scope:** **150 files**, +63232/-2 lines
- **Risk:** Medium

## Relationships

Merge point between branches.

## Confidence Notes

High. Standard merge commit.
