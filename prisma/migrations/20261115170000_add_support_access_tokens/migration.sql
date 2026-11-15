-- CreateTable
CREATE TABLE IF NOT EXISTS "support_access_tokens" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "support_access_tokens_token_hash_key" ON "support_access_tokens"("token_hash");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "support_access_tokens_buyer_id_idx" ON "support_access_tokens"("buyer_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "support_access_tokens_revoked_at_expires_at_idx" ON "support_access_tokens"("revoked_at", "expires_at");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'support_access_tokens_buyer_id_fkey'
    ) THEN
        ALTER TABLE "support_access_tokens" ADD CONSTRAINT "support_access_tokens_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
