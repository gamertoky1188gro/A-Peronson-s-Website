-- Alter payment_proofs to record LC subtype metadata
ALTER TABLE "payment_proofs"
ADD COLUMN IF NOT EXISTS "lc_type" TEXT,
ADD COLUMN IF NOT EXISTS "usance_days" INTEGER;
