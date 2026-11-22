-- Support case: structured problem brief + case-quality evaluator verdict.
ALTER TABLE "support_cases" ADD COLUMN IF NOT EXISTS "brief" JSONB;
ALTER TABLE "support_cases" ADD COLUMN IF NOT EXISTS "quality" JSONB;

-- Email delivery tracking: per-case link, retry count and last failure.
ALTER TABLE "email_outbox" ADD COLUMN IF NOT EXISTS "case_id" TEXT;
ALTER TABLE "email_outbox" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "email_outbox" ADD COLUMN IF NOT EXISTS "last_error" TEXT;
CREATE INDEX IF NOT EXISTS "email_outbox_case_id_idx" ON "email_outbox"("case_id");

ALTER TABLE "email_logs" ADD COLUMN IF NOT EXISTS "case_id" TEXT;
CREATE INDEX IF NOT EXISTS "email_logs_case_id_idx" ON "email_logs"("case_id");
