-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "subscription_status" TEXT NOT NULL DEFAULT 'free',
    "wallet_balance_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wallet_restricted_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "policy_strikes" INTEGER NOT NULL DEFAULT 0,
    "messaging_restricted_until" TIMESTAMP(3),
    "profile" JSONB,
    "org_owner_id" TEXT,
    "member_id" TEXT,
    "username" TEXT,
    "permissions" JSONB,
    "permission_matrix" JSONB,
    "assigned_requests" INTEGER,
    "performance_score" INTEGER,
    "chatbot_enabled" BOOLEAN NOT NULL DEFAULT false,
    "handoff_mode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "password_reset_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "buyer_region" TEXT,
    "documents" JSONB NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "subscription_valid_until" TIMESTAMP(3),
    "missing_required" JSONB,
    "credibility" JSONB,
    "subscription_remaining_days" INTEGER,
    "expiring_soon" BOOLEAN,
    "verification_status" TEXT,
    "review_status" TEXT,
    "review_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "request_type" TEXT NOT NULL DEFAULT 'garments',
    "verified_only" BOOLEAN NOT NULL DEFAULT false,
    "specs" JSONB,
    "custom_fields" JSONB,
    "quote_deadline" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "max_suppliers" INTEGER,
    "product" TEXT,
    "industry" TEXT,
    "category" TEXT,
    "target_market" TEXT,
    "quantity" TEXT,
    "moq" TEXT,
    "price_range" TEXT,
    "material" TEXT,
    "fabric_gsm" TEXT,
    "timeline_days" TEXT,
    "delivery_timeline" TEXT,
    "certifications_required" JSONB,
    "shipping_terms" TEXT,
    "incoterms" TEXT,
    "payment_terms" TEXT,
    "document_ready" TEXT,
    "audit_date" TEXT,
    "language_support" TEXT,
    "capacity_min" TEXT,
    "trims_wash" TEXT,
    "sample_timeline" TEXT,
    "sample_available" TEXT,
    "packaging" TEXT,
    "compliance_notes" TEXT,
    "custom_description" TEXT,
    "size_range" TEXT,
    "color_pantone" TEXT,
    "customization_capabilities" TEXT,
    "techpack_accepted" BOOLEAN,
    "sample_lead_time_days" TEXT,
    "compliance_details" TEXT,
    "ai_summary" TEXT,
    "assigned_agent_id" TEXT,
    "assigned_at" TIMESTAMP(3),
    "assigned_by" TEXT,
    "status" TEXT NOT NULL,
    "moderated" BOOLEAN,
    "moderation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_products" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_role" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "industry" TEXT,
    "category" TEXT,
    "material" TEXT,
    "moq" TEXT,
    "price_range" TEXT,
    "lead_time_days" TEXT,
    "fabric_gsm" TEXT,
    "size_range" TEXT,
    "color_pantone" TEXT,
    "customization_capabilities" TEXT,
    "sample_available" TEXT,
    "sample_lead_time_days" TEXT,
    "description" TEXT,
    "image_urls" JSONB,
    "cover_image_url" TEXT,
    "status" TEXT,
    "video_url" TEXT,
    "video_review_status" TEXT,
    "video_restricted" BOOLEAN,
    "video_moderation_flags" JSONB,
    "video_reviewed_at" TIMESTAMP(3),
    "video_review_reason" TEXT,
    "moderated" BOOLEAN,
    "moderation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "company_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "attachment" JSONB,
    "moderated" BOOLEAN,
    "moderation_reason" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_requests" (
    "thread_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "acted_by" TEXT,
    "acted_at" TIMESTAMP(3),

    CONSTRAINT "message_requests_pkey" PRIMARY KEY ("thread_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "message" TEXT NOT NULL,
    "meta" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "search_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_usage_counters" (
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "reset_at" TIMESTAMP(3),

    CONSTRAINT "search_usage_counters_pkey" PRIMARY KEY ("user_id","action")
);

-- CreateTable
CREATE TABLE "conversation_locks" (
    "request_id" TEXT NOT NULL,
    "locked_by" TEXT NOT NULL,
    "allowed_agents" JSONB,
    "allowed_users" JSONB,
    "lock_type" TEXT,
    "lock_status" TEXT,
    "lock_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "conversation_locks_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "payment_proofs" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "reviewed_by" TEXT,
    "review_reason" TEXT,
    "transaction_reference" TEXT,
    "bank_name" TEXT,
    "sender_account_name" TEXT,
    "receiver_account_name" TEXT,
    "transaction_date" TIMESTAMP(3),
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "lc_number" TEXT,
    "issuing_bank" TEXT,
    "advising_bank" TEXT,
    "applicant_name" TEXT,
    "beneficiary_name" TEXT,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "document_id" TEXT,
    "document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payment_proofs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "requester_role" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "partner_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_sessions" (
    "id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "match_id" TEXT,
    "title" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "participant_ids" JSONB,
    "status" TEXT,
    "recording_url" TEXT,
    "recording_status" TEXT,
    "contract_id" TEXT,
    "security_audit_id" TEXT,
    "context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "audit_trail" JSONB,

    CONSTRAINT "call_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_recording_views" (
    "id" TEXT NOT NULL,
    "call_id" TEXT NOT NULL,
    "viewer_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_recording_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "file_path" TEXT,
    "type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "contract_number" TEXT,
    "title" TEXT,
    "buyer_name" TEXT,
    "factory_name" TEXT,
    "buyer_id" TEXT,
    "factory_id" TEXT,
    "bank_name" TEXT,
    "beneficiary_name" TEXT,
    "transaction_reference" TEXT,
    "is_draft" BOOLEAN,
    "buyer_signature_state" TEXT,
    "factory_signature_state" TEXT,
    "buyer_signed_at" TIMESTAMP(3),
    "factory_signed_at" TIMESTAMP(3),
    "artifact" JSONB,
    "lifecycle_status" TEXT,
    "archived_at" TIMESTAMP(3),
    "moderation_flags" JSONB,
    "moderation_status" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "org_owner_id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "counterparty_id" TEXT,
    "source" TEXT,
    "status" TEXT,
    "assigned_agent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "last_interaction_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notes" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "org_owner_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_reminders" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "org_owner_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "done" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actor_id" TEXT,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boosts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "boosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_views" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "reason" TEXT,
    "actor_id" TEXT,
    "actor_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "resolution_action" TEXT,
    "resolution_note" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violations" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "kind" TEXT,
    "reason" TEXT,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "snippet" TEXT,
    "strikes" INTEGER,
    "action" TEXT,
    "restrict_hours" INTEGER,
    "messaging_restricted_until" TIMESTAMP(3),
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_interactions" (
    "id" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_name" TEXT,
    "actor_verified" BOOLEAN,
    "text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_connections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "requirement_id" TEXT NOT NULL,
    "factory_id" TEXT NOT NULL,
    "score" INTEGER,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("requirement_id","factory_id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" TEXT NOT NULL,
    "requirement_id" TEXT,
    "from_status" TEXT,
    "to_status" TEXT,
    "context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistant_knowledge" (
    "id" TEXT NOT NULL,
    "org_id" TEXT,
    "type" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "keywords" JSONB,
    "tags" JSONB,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "assistant_knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "profile_key" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "interaction_type" TEXT,
    "score" INTEGER,
    "comment" TEXT,
    "reliability_flags" JSONB,
    "auto_generated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_milestones" (
    "id" TEXT NOT NULL,
    "profile_key" TEXT NOT NULL,
    "counterparty_id" TEXT NOT NULL,
    "interaction_type" TEXT,
    "milestone" TEXT NOT NULL,
    "status" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "rating_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_feedback_requests" (
    "id" TEXT NOT NULL,
    "profile_key" TEXT NOT NULL,
    "counterparty_id" TEXT NOT NULL,
    "interaction_type" TEXT,
    "qualification_rules" JSONB,
    "status" TEXT,
    "triggered_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilled_at" TIMESTAMP(3),

    CONSTRAINT "rating_feedback_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_feedback_events" (
    "id" TEXT NOT NULL,
    "profile_key" TEXT NOT NULL,
    "counterparty_id" TEXT NOT NULL,
    "interaction_type" TEXT,
    "event" TEXT,
    "milestone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_feedback_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" TEXT,
    "amount_usd" DOUBLE PRECISION,
    "balance_after_usd" DOUBLE PRECISION,
    "reason" TEXT,
    "ref" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount_usd" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "max_redemptions" INTEGER,
    "expires_at" TIMESTAMP(3),
    "created_by" TEXT,
    "marketing_source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" TEXT NOT NULL,
    "code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_usd" DOUBLE PRECISION NOT NULL,
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_state" (
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_state_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_codes_code_key" ON "coupon_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_redemptions_code_id_user_id_key" ON "coupon_redemptions"("code_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_reads_match_id_user_id_key" ON "message_reads"("match_id", "user_id");
