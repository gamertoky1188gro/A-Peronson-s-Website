# backend-services

- **Parent**: (none — under `server/`)
- **Purpose**: All business logic (98 files) — sole Prisma callers, external integrations, scoring/matching pipelines.
- **Key Files**: `server/services/feedService.js`, `feedPostService.js`, `productService.js`, `requirementService.js`, `leadService.js`, `crmService.js`, `searchAccessService.js`, `qdrantService.js`, `embeddingService.js`, `rerankerService.js`, `openSearchService.js`, `eSignService.js` + `providers/dropboxSign.js`, `subscriptionService.js`, `walletService.js`, `verificationService.js`, `matchingService.js`, `trustRiskScoringService.js`, `notificationService.js`, `messageService.js`, `changeLogService.js`, `entityVersionService.js`, `syncService.js`
- **Dependencies**: backend-utils, backend-sync, shared, backend-realtime
- **Dependents**: backend-controllers, backend-workers
- **Exposes**: Domain operations (CRUD, search, matching, contracts, billing, moderation, analytics); queue-depth reporters feeding logHub runtime metrics; change-ledger appends feeding the offline sync delta stream.

## Internal Structure
- **Sync/changelog**: `changeLogService.js` (`appendChange`, `emitAfterCommit`), `entityVersionService.js` (version counter), `syncService.js` (`getHead`, `getDelta`, `hydrateSyncEntities`), `contentHashService.js`, `feedGenerationService.js` (`APP_STATE_KEY = "hypercache:feed_generation"`). `feedPostService`, `productService`, `requirementService` call `emitAfterCommit()` after write.
- **Marketplace**: product, productView, requirement, matching, lead, crm, dealJourney, workflowLifecycle, orderCertification, companyJoin.
- **Social**: feed(+Post), social, linkPreview, ratings, network, friend, conversation/message + policy/lock/reputation.
- **Platform**: user, member, profile, onboarding, verification, passkey, authorization, entitlements, enterpriseOps, orgOperations, admin*, serverAdmin, security, cms, presets.
- **Billing**: subscription, subscriptionHistory, coupon, wallet, boost, paymentProof, refund, currency, agentSubId.
- **Comms**: notification, email, message, conversationLock, communicationPolicy, callSession, webrtc.
- **Search/AI**: qdrant, openSearch, embedding, reranker, searchAccess, aiConversation, aiModeration, aiOrchestration, aiVerifier, orgAi, chatbot, assistant, feedGeneration.
- **Media**: uploads, image(+Queue/Processor), video(+Queue/Processor), esignRetry.
- **Ops**: analytics(+Export/Governance), eventIngestion, eventTracking, report, moderation, policy(+Registry), enforcement, supportTicket, system, infra, integration, diagnostics, changeLog, syslogServer, hallucination detector (util).

## Gotchas
- `owner`/`admin` roles were missing from `PREMIUM_FEATURES_BY_ROLE`; they now share `COMPANY_MANAGEMENT_FEATURES`. A premium owner previously got an empty feature map and could never pass an entitlement check.
- Free agent limit is **3**, enforced across `memberService`, `entitlementService`, `adminConfigService` (`plan_limits.free.agent_limit`). Stored config overrides the default — run `npm run db:backfill:free-agent-limit` once against an existing DB.