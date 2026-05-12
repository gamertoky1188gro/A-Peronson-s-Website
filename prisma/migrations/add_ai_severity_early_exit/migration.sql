-- Add ai_severity and ai_early_exit columns to documents table
ALTER TABLE "documents" ADD COLUMN "ai_severity" TEXT;
ALTER TABLE "documents" ADD COLUMN "ai_early_exit" BOOLEAN DEFAULT false;
