CREATE TABLE IF NOT EXISTS "org_ops_policies" (
  "id" TEXT PRIMARY KEY,
  "org_owner_id" TEXT NOT NULL,
  "assignment_strategy" TEXT NOT NULL DEFAULT 'least_loaded',
  "sla_targets" JSONB,
  "escalation_rules" JSONB,
  "workload_caps" JSONB,
  "round_robin_index" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3)
);

CREATE UNIQUE INDEX IF NOT EXISTS "org_ops_policy_org_owner_id" ON "org_ops_policies"("org_owner_id");

CREATE TABLE IF NOT EXISTS "lead_sla_timers" (
  "id" TEXT PRIMARY KEY,
  "lead_id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "target_minutes" INTEGER NOT NULL,
  "deadline_at" TIMESTAMP(3) NOT NULL,
  "breached_at" TIMESTAMP(3),
  "resolved_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3),
  CONSTRAINT "lead_sla_timers_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "lead_sla_timers_lead_id_stage" ON "lead_sla_timers"("lead_id", "stage");
CREATE INDEX IF NOT EXISTS "lead_sla_timers_org_deadline" ON "lead_sla_timers"("org_owner_id", "deadline_at");

CREATE TABLE IF NOT EXISTS "lead_escalations" (
  "id" TEXT PRIMARY KEY,
  "lead_id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "sla_timer_id" TEXT,
  "severity" TEXT,
  "reason" TEXT NOT NULL,
  "triggered_by" TEXT,
  "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolved_at" TIMESTAMP(3),
  "resolved_by" TEXT,
  "resolution_note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3),
  CONSTRAINT "lead_escalations_lead_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "lead_escalations_org_triggered" ON "lead_escalations"("org_owner_id", "triggered_at");
CREATE INDEX IF NOT EXISTS "lead_escalations_lead_resolved" ON "lead_escalations"("lead_id", "resolved_at");

CREATE TABLE IF NOT EXISTS "agent_workloads" (
  "id" TEXT PRIMARY KEY,
  "org_owner_id" TEXT NOT NULL,
  "agent_id" TEXT NOT NULL,
  "active_leads" INTEGER NOT NULL DEFAULT 0,
  "capped_max_leads" INTEGER NOT NULL DEFAULT 10,
  "last_assigned_at" TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "agent_workloads_org_owner_id_agent_id" ON "agent_workloads"("org_owner_id", "agent_id");
CREATE INDEX IF NOT EXISTS "agent_workloads_org_active_leads" ON "agent_workloads"("org_owner_id", "active_leads");
