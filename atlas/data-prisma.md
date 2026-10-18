# data-prisma

- **Parent**: (none)
- **Purpose**: Canonical data model — 96 models plus migrations; sole schema authority for services.
- **Key Files**: `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/sitemaps/*`
- **Dependencies**: (none)
- **Dependents**: backend-utils, backend-services, backend-sync
- **Exposes**: The 96 models below. `SyncChange` is the append-only change ledger backing the offline delta sync; `EntityVersion`-style counters come from `entityVersionService`.

## Model Inventory (96)
**Identity/tenancy**: User, AdminAction, AdminAudit, AdminBranding, AdminCapability, AdminConfigHistory, AdminMockData, AdminModule, AdminRoleConfig, AdminSection, AdminSecurityPurpose, AdminUiConfig, AgentCapacity, AgentWorkload, LicenseRequest, OrgOpsPolicy, OrgPolicy.
**Marketplace**: Product, ProductView, Requirement, FeedPost, Order, Boost, SearchAlert, SearchUsageCounter.
**Lead/CRM**: Lead, LeadAssignment, LeadEscalation, LeadNote, LeadReminder, LeadSlaTimer, MetricTransition.
**Comms**: Message, MessagePolicyDecision, MessagePolicyLog, MessagePolicyConfig, MessageQueue, MessageQueueItem, MessageRead, MessageRequest, ConversationLock, CallSession, CallRecordingView, CommunicationLimit, CommunicationPolicyConfig, Notification, NotificationPreferences, EmailLog, EmailOutbox, InteractionLog, LinkPreview.
**Trust/safety**: Verification, Document, DocumentView, PaymentProof, Report, PolicyDefinition, PolicyRuleScope, PolicyVersion, PolicyViolation, GovernanceAppeal, GovernanceConfig, GovernanceEnforcement, GovernanceManualReviewQueue, GovernanceMonthlyReport, GovernanceNotificationTemplate, AiResponseAudit, TrustRiskEvaluation, AdminSecurityPurpose.
**Ratings/social**: Rating, RatingFeedbackEvent, RatingFeedbackRequest, RatingMilestone, SocialInteraction, UserConnection, Match, BusinessRelationship, PartnerRequest.
**Billing**: Subscription, CouponCode, CouponRedemption, WalletHistory, CurrencyConfig, FxRate.
**Workflow/AI**: WorkflowJourney, WorkflowTransition, WorkflowAuditLog, AssistantConfig, AssistantKnowledge, AssistantRule, SupportTicket, SupportTicketMessage, AppState.
**Analytics/events**: AnalyticsEvent, EventLog.
**E-sign**: EsignService models, EsignWebhookNonce.
**Offline sync**: SyncChange (ledger: seq, entity_type, entity_id, operation, entity_version, content_hash, occurred_at).