## Commit Metadata

| Field        | Value                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| **Hash**     | `9a75f8f8dca61bc04ad6c6a9bef3117e467511a6`                                             |
| **Parent**   | `bffb6fdcc8f14cb40b22067018bfba8afb08d286`                                             |
| **Author**   | gamertoky1188gro                                                                       |
| **Date**     | 2026-06-05 00:47:06 +0600                                                              |
| **Subject**  | Migrate jsonStore to Prisma: replace all readJson/writeJson with direct Prisma queries |
| **Sequence** | 0518                                                                                   |

## Custom Title

Migrate jsonStore to Prisma: Replace All readJson/writeJson with Direct Prisma Queries

## High-Level Summary

Massive commit: 69 files changed, 4597 insertions, 4722 deletions. Removes the entire `server/utils/jsonStore.js` file (442 lines) and replaces every `readJson()/writeJson()` call across ~66 server files with direct Prisma ORM queries. Also updates the Prisma schema, AGENTS.md, adds search routes/controller, and rewrites SearchResults.jsx frontend.

## File-by-File Breakdown

- **Deleted**: `server/utils/jsonStore.js` (442 lines) — the JSON file-based storage utility
- **Updated schema**: `prisma/schema.prisma` (+13 lines) — added new fields/models needed
- **Major rewrites**: analyticsService, adminActionService, adminCatalogService, aiConversationService, aiOrchestrationService, analyticsExportService, assistantService, boostService, callSessionService, chatbotService, communicationPolicyService, conversationLockService, crmService, currencyService, documentService, eSignService, emailService, enterpriseOpsService, feedPostService, feedService, friendService, industryService, leadReminderService, leadService, matchingService, messageService, notificationService, openSearchService, orderCertificationService, orgAiService, orgOperationsService, partnerNetworkService, paymentProofService, policyService, productService, productViewService, profileService, ratingsService, reportService, requirementService, searchAccessService, socialService, subscriptionService, supportTicketService, userService, verificationService, walletService
- **New**: `server/controllers/searchController.js` (172 lines) — new search endpoints
- **New**: `server/routes/searchRoutes.js` (8 lines)
- **Frontend**: `src/pages/SearchResults.jsx` (+540 lines) — major search page rewrite
- **Other**: `src/lib/auth.js`, `scripts/debug-esign.mjs`, `server/utils/metrics.js`, `AGENTS.md`

## Detailed Diff Analysis

- The old `jsonStore` was a file-based JSON store that read/wrote entire JSON files for data persistence. This is replaced everywhere with `prisma.<model>.findMany()`, `prisma.<model>.create()`, etc.
- The commit deletes ~4700 lines of old code and adds ~4600 lines of new code (net -125 lines) — a clean migration.
- `searchController.js` and `searchRoutes.js` are new, suggesting the search feature was previously not REST-based or was handled differently.
- `SearchResults.jsx` grew from an estimated small component to 540+ lines with full search UI.

## Why This Change

Migration from a custom file-based JSON storage to Prisma ORM with PostgreSQL. This is a foundational architectural change for reliability, performance, and query capability.

## Was It Useful

Yes — critical infrastructure upgrade. File-based JSON storage doesn't scale, has concurrency issues, and lacks query capabilities.

## Impact Analysis

Very high. Affects every backend service. Could introduce regressions from the SQL translation of JSON operations. The frontend SearchResults.jsx rewrite is also significant.

## Relationships

Followed by multiple hotfix commits (0519-0523) that fix issues introduced by this massive migration.

## Confidence Notes

High. The migration is systematic (all readJson/writeJson replaced) and the net diff is clean (-125 lines).
