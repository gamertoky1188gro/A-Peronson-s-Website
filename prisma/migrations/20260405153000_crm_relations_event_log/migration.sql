-- CRM relation hardening + event log support.

CREATE TABLE IF NOT EXISTS "event_logs" (
  "id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "actor_id" TEXT,
  "event_type" TEXT NOT NULL,
  "entity_type" TEXT,
  "entity_id" TEXT,
  "payload" JSONB,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "interaction_logs"
  ADD COLUMN IF NOT EXISTS "lead_id" TEXT,
  ADD COLUMN IF NOT EXISTS "message_id" TEXT,
  ADD COLUMN IF NOT EXISTS "call_session_id" TEXT,
  ADD COLUMN IF NOT EXISTS "event_log_id" TEXT;

-- CRM workload indexes
CREATE INDEX IF NOT EXISTS "leads_org_owner_id_status_updated_at_idx"
  ON "leads"("org_owner_id", "status", "updated_at");

CREATE INDEX IF NOT EXISTS "leads_assigned_agent_id_updated_at_idx"
  ON "leads"("assigned_agent_id", "updated_at");

CREATE INDEX IF NOT EXISTS "interaction_logs_org_owner_id_interaction_type_occurred_at_idx"
  ON "interaction_logs"("org_owner_id", "interaction_type", "occurred_at");

CREATE INDEX IF NOT EXISTS "event_logs_org_owner_id_event_type_occurred_at_idx"
  ON "event_logs"("org_owner_id", "event_type", "occurred_at");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_lead_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_message_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_call_session_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interaction_logs_event_log_id_fkey'
  ) THEN
    ALTER TABLE "interaction_logs"
      ADD CONSTRAINT "interaction_logs_event_log_id_fkey" FOREIGN KEY ("event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_logs_org_owner_id_fkey'
  ) THEN
    ALTER TABLE "event_logs"
      ADD CONSTRAINT "event_logs_org_owner_id_fkey" FOREIGN KEY ("org_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_logs_actor_id_fkey'
  ) THEN
    ALTER TABLE "event_logs"
      ADD CONSTRAINT "event_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
