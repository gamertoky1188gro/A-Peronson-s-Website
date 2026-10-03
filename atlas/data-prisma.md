# data-prisma

- **Purpose**: Canonical data model — 100+ models plus migrations; sole schema authority for services.
- **Key Files**: `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/sitemaps/*`
- **Dependencies**: (none)
- **Dependents**: backend-utils, backend-services
- **Exposes**: Models: User, Subscription, Verification, Requirement (+price cols), Product (+views/boosts), FeedPost, Message family (Message/MessageRequest/MessageQueue/Policy/Log/Limits/Reputation), Notification + SearchAlert, PaymentProof, PartnerRequest, CallSession, Document(+View), Lead family (Lead/Assignment/SLA/Escalation/Note/Reminder/OrgOpsPolicy/AgentCapacity), EventLog/AnalyticsEvent, Report/PolicyViolation, SocialInteraction/Connection/Match, WorkflowJourney/Transition (+Audit), Assistant(Knowledge/Rule/Config/Audit), AdminAudit/Admin*Config, Governance* suite, SupportTicket(+Message), Rating family, Wallet/Coupon, LinkPreview, EmailOutbox/Log, Order.
