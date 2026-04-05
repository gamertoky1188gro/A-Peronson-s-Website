-- Extend CRM tables with normalized lead columns and interaction logs.

ALTER TABLE "leads"
  ADD COLUMN IF NOT EXISTS "source_type" TEXT,
  ADD COLUMN IF NOT EXISTS "source_id" TEXT,
  ADD COLUMN IF NOT EXISTS "source_label" TEXT,
  ADD COLUMN IF NOT EXISTS "conversion_at" TIMESTAMP(3);

ALTER TABLE "lead_reminders"
  ALTER COLUMN "done" SET DEFAULT false;

UPDATE "lead_reminders"
SET "done" = false
WHERE "done" IS NULL;

ALTER TABLE "lead_reminders"
  ALTER COLUMN "done" SET NOT NULL,
  ADD COLUMN IF NOT EXISTS "notified_at" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "interaction_logs" (
  "id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "actor_id" TEXT,
  "channel" TEXT,
  "interaction_type" TEXT NOT NULL,
  "entity_type" TEXT,
  "entity_id" TEXT,
  "match_id" TEXT,
  "metadata" JSONB,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "interaction_logs_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "leads_org_owner_id_assigned_agent_id_counterparty_id_match_id_status_updated_at_idx"
  ON "leads"("org_owner_id", "assigned_agent_id", "counterparty_id", "match_id", "status", "updated_at");

CREATE INDEX IF NOT EXISTS "lead_notes_lead_id_created_at_idx"
  ON "lead_notes"("lead_id", "created_at");

CREATE INDEX IF NOT EXISTS "lead_reminders_lead_id_remind_at_done_idx"
  ON "lead_reminders"("lead_id", "remind_at", "done");

CREATE INDEX IF NOT EXISTS "interaction_logs_org_owner_id_interaction_type_occurred_at_idx"
  ON "interaction_logs"("org_owner_id", "interaction_type", "occurred_at");

-- Foreign keys (guarded for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_org_owner_id_fkey'
  ) THEN
    ALTER TABLE "leads"
      ADD CONSTRAINT "leads_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_assigned_agent_id_fkey'
  ) THEN
    ALTER TABLE "leads"
      ADD CONSTRAINT "leads_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_counterparty_id_fkey'
  ) THEN
    ALTER TABLE "leads"
      ADD CONSTRAINT "leads_counterparty_id_fkey" FOREIGN KEY ("counterparty_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_lead_id_fkey'
  ) THEN
    ALTER TABLE "lead_notes"
      ADD CONSTRAINT "lead_notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_org_owner_id_fkey'
  ) THEN
    ALTER TABLE "lead_notes"
      ADD CONSTRAINT "lead_notes_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_notes_author_id_fkey'
  ) THEN
    ALTER TABLE "lead_notes"
      ADD CONSTRAINT "lead_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_lead_id_fkey'
  ) THEN
    ALTER TABLE "lead_reminders"
      ADD CONSTRAINT "lead_reminders_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_org_owner_id_fkey'
  ) THEN
    ALTER TABLE "lead_reminders"
      ADD CONSTRAINT "lead_reminders_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lead_reminders_created_by_fkey'
  ) THEN
    ALTER TABLE "lead_reminders"
      ADD CONSTRAINT "lead_reminders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_org_owner_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_actor_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
