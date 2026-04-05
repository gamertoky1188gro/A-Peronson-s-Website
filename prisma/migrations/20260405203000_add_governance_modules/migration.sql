CREATE TABLE "policy_definitions" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE "policy_versions" (
  "id" TEXT PRIMARY KEY,
  "policy_definition_id" TEXT NOT NULL REFERENCES "policy_definitions"("id") ON DELETE CASCADE,
  "version" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "effective_from" TIMESTAMP(3) NOT NULL,
  "effective_to" TIMESTAMP(3),
  "rules" JSONB,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3),
  CONSTRAINT "policy_definition_version" UNIQUE ("policy_definition_id", "version")
);
CREATE INDEX "policy_versions_effective_dates_idx" ON "policy_versions"("effective_from", "effective_to");

CREATE TABLE "policy_rule_scopes" (
  "id" TEXT PRIMARY KEY,
  "policy_version_id" TEXT NOT NULL REFERENCES "policy_versions"("id") ON DELETE CASCADE,
  "scope_type" TEXT NOT NULL,
  "scope_value" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "policy_rule_scopes_scope_idx" ON "policy_rule_scopes"("scope_type", "scope_value");

CREATE TABLE "trust_risk_evaluations" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "role" TEXT,
  "trust_score" DOUBLE PRECISION NOT NULL,
  "verification_recency" DOUBLE PRECISION NOT NULL,
  "dispute_history" DOUBLE PRECISION NOT NULL,
  "suspicious_messaging" DOUBLE PRECISION NOT NULL,
  "contract_breach" DOUBLE PRECISION NOT NULL,
  "decision" TEXT,
  "signals" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "trust_risk_evaluations_user_id_created_at_idx" ON "trust_risk_evaluations"("user_id", "created_at");

CREATE TABLE "governance_enforcements" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "evaluation_id" TEXT,
  "policy_definition_id" TEXT,
  "policy_version_id" TEXT,
  "action" TEXT NOT NULL,
  "reason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'applied',
  "metadata" JSONB,
  "expires_at" TIMESTAMP(3),
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);
CREATE INDEX "governance_enforcements_user_id_created_at_idx" ON "governance_enforcements"("user_id", "created_at");
CREATE INDEX "governance_enforcements_action_created_at_idx" ON "governance_enforcements"("action", "created_at");

CREATE TABLE "governance_manual_review_queue" (
  "id" TEXT PRIMARY KEY,
  "enforcement_id" TEXT,
  "user_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "reason" TEXT,
  "payload" JSONB,
  "assigned_to" TEXT,
  "resolved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);
CREATE INDEX "governance_manual_review_queue_status_priority_idx" ON "governance_manual_review_queue"("status", "priority");
CREATE INDEX "governance_manual_review_queue_user_id_created_at_idx" ON "governance_manual_review_queue"("user_id", "created_at");

CREATE TABLE "governance_notification_templates" (
  "id" TEXT PRIMARY KEY,
  "template_key" TEXT NOT NULL UNIQUE,
  "channel" TEXT NOT NULL DEFAULT 'in_app',
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE TABLE "governance_appeals" (
  "id" TEXT PRIMARY KEY,
  "enforcement_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "reason" TEXT NOT NULL,
  "outcome" TEXT,
  "outcome_notes" TEXT,
  "reviewed_by" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);
CREATE INDEX "governance_appeals_enforcement_id_status_idx" ON "governance_appeals"("enforcement_id", "status");
CREATE INDEX "governance_appeals_user_id_created_at_idx" ON "governance_appeals"("user_id", "created_at");

CREATE TABLE "governance_monthly_reports" (
  "id" TEXT PRIMARY KEY,
  "month" TEXT NOT NULL UNIQUE,
  "metrics" JSONB NOT NULL,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
