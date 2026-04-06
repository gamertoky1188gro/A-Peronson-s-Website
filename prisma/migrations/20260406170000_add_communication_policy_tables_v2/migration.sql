CREATE TABLE IF NOT EXISTS "message_policy_logs" (
  "id" TEXT PRIMARY KEY,
  "queue_id" TEXT,
  "sender_id" TEXT NOT NULL,
  "org_id" TEXT,
  "match_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "reputation_score" DOUBLE PRECISION NOT NULL,
  "spam_score" DOUBLE PRECISION NOT NULL,
  "frequency_count" INTEGER NOT NULL,
  "first_response_priority" BOOLEAN NOT NULL DEFAULT false,
  "queue_rank" TEXT,
  "queue_score" INTEGER,
  "queue_priority_label" TEXT,
  "premium_verified_priority_score" DOUBLE PRECISION,
  "retry_after_seconds" INTEGER,
  "moderation_flag" BOOLEAN NOT NULL DEFAULT false,
  "false_positive" BOOLEAN NOT NULL DEFAULT false,
  "reviewer_id" TEXT,
  "reviewer_notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "message_queue_items" (
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

CREATE TABLE IF NOT EXISTS "communication_limits" (
  "id" TEXT PRIMARY KEY,
  "scope" TEXT NOT NULL,
  "org_id" TEXT,
  "message_caps" JSONB NOT NULL,
  "priority_multipliers" JSONB NOT NULL,
  "strictness_mode" TEXT NOT NULL,
  "spam_thresholds" JSONB,
  "updated_by" TEXT,
  "updated_at" TIMESTAMP(3)
);

INSERT INTO "message_policy_logs" (
  "id", "queue_id", "sender_id", "org_id", "match_id", "action", "reason", "reputation_score", "spam_score", "frequency_count", "first_response_priority", "queue_rank", "queue_score", "queue_priority_label", "retry_after_seconds", "false_positive", "reviewer_id", "reviewer_notes", "created_at", "updated_at"
)
SELECT
  d."id", d."queue_id", d."sender_id", d."org_id", d."match_id", d."action", d."reason", d."trust_score", d."keyword_risk_score", d."frequency_count", d."first_response_priority", d."queue_rank", d."queue_score", d."queue_priority_label", d."retry_after_seconds", d."false_positive", d."reviewer_id", d."reviewer_notes", d."created_at", d."updated_at"
FROM "message_policy_decisions" d
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "message_queue_items" (
  "id", "message_id", "match_id", "sender_id", "org_id", "queue_status", "queue_rank", "queue_score", "queue_priority_label", "policy_reason", "retry_after_seconds", "requires_human_review", "metadata", "created_at", "updated_at"
)
SELECT
  q."id", q."message_id", q."match_id", q."sender_id", q."org_id", q."queue_status", q."queue_rank", q."queue_score", q."queue_priority_label", q."policy_reason", q."retry_after_seconds", q."requires_human_review", q."metadata", q."created_at", q."updated_at"
FROM "message_queue" q
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "communication_limits" (
  "id", "scope", "org_id", "message_caps", "priority_multipliers", "strictness_mode", "spam_thresholds", "updated_by", "updated_at"
)
SELECT
  c."id",
  c."scope",
  c."org_id",
  jsonb_build_object('outbound_per_window', c."max_outreach_per_window", 'window_minutes', c."outreach_window_minutes", 'cooldown_seconds', c."cooldown_seconds"),
  jsonb_build_object('premium', (1 + c."premium_boost" / 100.0), 'verified', (1 + c."verified_boost" / 100.0)),
  'balanced',
  jsonb_build_object('queue', c."keyword_risk_threshold_soft", 'hard_block', c."keyword_risk_threshold_hard"),
  c."updated_by",
  c."updated_at"
FROM "communication_policy_configs" c
ON CONFLICT ("id") DO NOTHING;
