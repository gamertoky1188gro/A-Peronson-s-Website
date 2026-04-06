CREATE TABLE IF NOT EXISTS "workflow_journeys" (
  "id" TEXT NOT NULL,
  "match_id" TEXT,
  "requirement_id" TEXT,
  "product_id" TEXT,
  "contract_id" TEXT,
  "current_state" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3),
  CONSTRAINT "workflow_journeys_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "workflow_journeys_match_id_idx" ON "workflow_journeys"("match_id");

CREATE TABLE IF NOT EXISTS "workflow_transitions" (
  "id" TEXT NOT NULL,
  "journey_id" TEXT NOT NULL,
  "from_state" TEXT NOT NULL,
  "to_state" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "actor_id" TEXT,
  "source" TEXT,
  "metadata" JSONB,
  "accepted" BOOLEAN NOT NULL DEFAULT true,
  "error_code" TEXT,
  "error_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workflow_transitions_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "workflow_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "workflow_transitions_journey_id_created_at_idx" ON "workflow_transitions"("journey_id", "created_at");
