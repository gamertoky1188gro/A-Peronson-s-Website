# backend-services

- **Purpose**: All business logic (~90 services) — sole Prisma callers, external integrations, scoring/matching pipelines.
- **Key Files**: `server/services/feedService.js`, `feedPostService.js`, `productService.js`, `requirementService.js`, `leadService.js`, `crmService.js`, `searchAccessService.js`, `qdrantService.js`, `embeddingService.js`, `rerankerService.js`, `openSearchService.js`, `eSignService.js` + `providers/dropboxSign.js`, `subscriptionService.js`, `walletService.js`, `verificationService.js`, `matchingService.js`, `trustRiskScoringService.js`, `notificationService.js`, `messageService.js`, `videoQueue.js`, `imageQueue.js`, `esignRetryService.js`
- **Dependencies**: backend-utils, shared, backend-realtime
- **Dependents**: backend-controllers, backend-workers
- **Exposes**: Domain operations (CRUD, search, matching, contracts, billing, moderation, analytics); queue-depth reporters feeding logHub runtime metrics.

## Internal Structure
- **Marketplace**: product, requirement, matching, lead, crm, dealJourney, workflowLifecycle, orderCertification.
- **Social**: feed(+Post), social, linkPreview, ratings, network, friend, conversation/message + policy/lock/reputation.
- **Platform**: auth-adjacent (user, member, profile, onboarding, verification, passkey, authorization, entitlements), subscription/coupon/wallet/boost/paymentProof/refund, notification/email, geo/industry/partnerNetwork, document/uploads/image+video, event/ingestion/tracking/analytics(+Export/Governance), report/moderation/policy/governance-enforcement, supportTicket, system/infra/integration/diagnostics, ai(+Conversation/Moderation/Orchestration/Verifier/orgAi/chatbot/assistant), callSession/webrtc, syslogServer, cms/presets/serverAdmin/admin*.
