-- AlterTable
ALTER TABLE "org_policies"
ADD COLUMN "assignment_strategy" TEXT,
ADD COLUMN "sla_targets" JSONB,
ADD COLUMN "escalation_windows" JSONB;

-- CreateTable
CREATE TABLE "lead_assignments" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "assigned_by" TEXT,
  "assigned_to" TEXT,
  "previous_assignee" TEXT,
  "reason" TEXT,
  "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lead_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_capacity" (
  "id" TEXT NOT NULL,
  "org_owner_id" TEXT NOT NULL,
  "agent_id" TEXT NOT NULL,
  "max_concurrent_leads" INTEGER NOT NULL,
  "current_load" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_capacity_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "lead_assignments_org_owner_id_assigned_at_idx" ON "lead_assignments"("org_owner_id", "assigned_at");
CREATE UNIQUE INDEX "agent_capacity_org_owner_id_agent_id" ON "agent_capacity"("org_owner_id", "agent_id");

ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_lead_id_fkey"
FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assigned_by_fkey"
FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_assigned_to_fkey"
FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "agent_capacity" ADD CONSTRAINT "agent_capacity_agent_id_fkey"
FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
