-- Communication policy engine: queue + decisions + sender reputation + config
ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "policy_status" TEXT,
  ADD COLUMN IF NOT EXISTS "policy_reason" TEXT,
  ADD COLUMN IF NOT EXISTS "policy_priority" TEXT,
  ADD COLUMN IF NOT EXISTS "retry_after_seconds" INTEGER,
  ADD COLUMN IF NOT EXISTS "requires_human_review" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "queue_id" TEXT;

CREATE TABLE IF NOT EXISTS "message_queue" (
  "id" TEXT PRIMARY KEY,
  "message_id" TEXT,
  "match_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "org_id" TEXT,
  "queue_status" TEXT NOT NULL,
  "queue_rank" TEXT NOT NULL,
  "queue_score" INTEGER NOT NULL,
  "queue_priority_label" TEXT,
  "policy_reason" TEXT,
  "retry_after_seconds" INTEGER,
  "requires_human_review" BOOLEAN NOT NULL DEFAULT false,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "message_policy_decisions" (
  "id" TEXT PRIMARY KEY,
  "queue_id" TEXT,
  "sender_id" TEXT NOT NULL,
  "org_id" TEXT,
  "match_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "trust_score" INTEGER NOT NULL,
  "keyword_risk_score" DOUBLE PRECISION NOT NULL,
  "frequency_count" INTEGER NOT NULL,
  "first_response_priority" BOOLEAN NOT NULL DEFAULT false,
  "queue_rank" TEXT,
  "queue_score" INTEGER,
  "queue_priority_label" TEXT,
  "retry_after_seconds" INTEGER,
  "requires_human_review" BOOLEAN NOT NULL DEFAULT false,
  "false_positive" BOOLEAN NOT NULL DEFAULT false,
  "reviewer_id" TEXT,
  "reviewer_notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "sender_reputation" (
  "id" TEXT PRIMARY KEY,
  "sender_id" TEXT NOT NULL UNIQUE,
  "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
  "spam_reports" INTEGER NOT NULL DEFAULT 0,
  "positive_interactions" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "communication_policy_configs" (
  "id" TEXT PRIMARY KEY,
  "scope" TEXT NOT NULL,
  "org_id" TEXT,
  "max_outreach_per_window" INTEGER NOT NULL,
  "outreach_window_minutes" INTEGER NOT NULL,
  "cooldown_seconds" INTEGER NOT NULL,
  "premium_boost" INTEGER NOT NULL,
  "verified_boost" INTEGER NOT NULL,
  "keyword_risk_threshold_soft" DOUBLE PRECISION NOT NULL,
  "keyword_risk_threshold_hard" DOUBLE PRECISION NOT NULL,
  "updated_by" TEXT,
  "updated_at" TIMESTAMP(3)
);
