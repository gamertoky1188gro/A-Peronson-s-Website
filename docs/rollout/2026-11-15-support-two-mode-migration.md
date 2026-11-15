# Support Two-Mode migration — raw Aiven apply and idempotent rewrite

Date: 2026-11-15 · Branch: feat/support-two-mode · Migration: `prisma/migrations/20261115170000_add_support_access_tokens/migration.sql`

## (a) What was applied raw, when, and why

On 2026-11-15 the branch's pending migrations were applied **raw, file by file** (owner-present, owner-approved) against the shared Aiven Postgres database, using `npx prisma db execute` rather than `prisma migrate deploy`.

Why: the Aiven database has **no `_prisma_migrations` ledger**. `prisma migrate deploy` refuses to run against a non-baselined database (P3005), and there is no safe way to baseline it from the repo side. Raw `db execute` was the actual path.

- 12 of the 17 in-scope migration files were idempotent and applied OK, including `20261115170000_add_support_access_tokens` (table exists, 3 indexes, 0 rows at time of apply).
- `render.yaml`'s build/release path runs `prisma migrate deploy`, which cannot run against Aiven without a baseline.
- The live state was **not otherwise audited** beyond the boot smoke and the file-by-file apply results recorded in `.superpowers/sdd/2026-11-15-support-two-mode/progress.md` (Task 5).

## (b) The idempotent rewrite, so the next deploy does not fail

The migration was rewritten to be a true no-op when the objects already exist:

- `CREATE TABLE IF NOT EXISTS "support_access_tokens" (…)`
- `CREATE UNIQUE INDEX IF NOT EXISTS "support_access_tokens_token_hash_key" …`
- `CREATE INDEX IF NOT EXISTS` for both remaining indexes
- the `support_access_tokens_buyer_id_fkey` FK was wrapped in a `DO $$ … IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = …) … END $$;` block. The constraint is never dropped or recreated.

Verified against the live Aiven database by re-running the rewritten file with `npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/20261115170000_add_support_access_tokens/migration.sql`: it reports success and is a no-op (no table dropped/recreated, no error).

## (c) The 5 migrations deliberately skipped (non-idempotent, objects already present)

1. `20260502143127_add_notification_preferences` — admin_* tables already present
2. `20260508054227_add_product_review_fields` — columns already present
3. `20260508111240_add_policy_updated_at` — column already present
4. `20261020000000_add_support_investigation_cases` — `support_cases` / investigation tables already present
5. `add_ai_severity_early_exit` — columns already present

These are left as-is in the repo and were NOT applied raw. They will fail if ever replayed against Aiven (objects exist) and must never be `migrate deploy`-ed there without a baseline.

## (d) Baseline requirement for any future Aiven baseline

Any future baseline of the Aiven database **must** mark this migration as applied:

```
npx prisma migrate resolve --applied 20261115170000_add_support_access_tokens
```

…**and the five skipped migrations** listed in (c):

```
npx prisma migrate resolve --applied add_ai_severity_early_exit
npx prisma migrate resolve --applied 20260502143127_add_notification_preferences
npx prisma migrate resolve --applied 20260508054227_add_product_review_fields
npx prisma migrate resolve --applied 20260508111240_add_policy_updated_at
npx prisma migrate resolve --applied 20261020000000_add_support_investigation_cases
```

Until that baseline exists, `render.yaml`'s `prisma migrate deploy` cannot run against Aiven and remains effectively non-functional there; the raw `db execute` path used on 2026-11-15 is the only proven apply route. The live database state beyond what this note records was not audited.
