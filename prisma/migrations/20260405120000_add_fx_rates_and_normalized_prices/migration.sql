-- Add normalized currency columns on core entities
ALTER TABLE "company_products"
  ADD COLUMN IF NOT EXISTS "priceOriginal" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "currencyOriginal" TEXT,
  ADD COLUMN IF NOT EXISTS "priceNormalizedBase" DOUBLE PRECISION;

ALTER TABLE "requirements"
  ADD COLUMN IF NOT EXISTS "priceOriginal" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "currencyOriginal" TEXT,
  ADD COLUMN IF NOT EXISTS "priceNormalizedBase" DOUBLE PRECISION;

-- FX rates cache table
CREATE TABLE IF NOT EXISTS "fx_rates" (
  "id" TEXT NOT NULL,
  "base" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "rate" DOUBLE PRECISION NOT NULL,
  "source" TEXT NOT NULL,
  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "fx_rates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "fx_base_quote" ON "fx_rates"("base", "quote");
CREATE INDEX IF NOT EXISTS "fx_rates_expiresAt_idx" ON "fx_rates"("expiresAt");

-- Optional currency config singleton
CREATE TABLE IF NOT EXISTS "currency_config" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "defaultBaseCurrency" TEXT NOT NULL DEFAULT 'USD',
  "staleThresholdHours" INTEGER NOT NULL DEFAULT 24,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "currency_config_pkey" PRIMARY KEY ("id")
);
