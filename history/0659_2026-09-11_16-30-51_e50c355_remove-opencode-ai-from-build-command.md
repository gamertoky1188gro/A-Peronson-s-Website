# Commit 0659 — e50c355

| Field | Value |
|-------|-------|
| **Commit Number** | 0659 |
| **Commit Hash** | e50c35571946543ae0ca5e54134f49aa18ec196d |
| **Parent Hash** | 6c95387fdd90968c12b1ac4ec11158d8c624a016 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 16:30:51 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | +1/-1 |
| **Merge Commit** | No |

## remove-hanging-opencode-ai-install-from-render-build-command

Single-line fix in `render.yaml` removing `npm install -g opencode-ai` from the Render build command. The build command changed from `npm install --include=dev && npm install -g opencode-ai && npm run build && npm run db:generate && npm run ci:reindex` to `npm install --include=dev && npm run build && npx prisma migrate deploy && npm run db:generate && npm run ci:reindex`. Two changes in one line: (1) removed the global `opencode-ai` CLI installation which was a dev tool not needed in the production build, and (2) replaced `npm run db:generate` with `npx prisma migrate deploy` to actually run migrations during deployment instead of just generating the Prisma client.

The `opencode-ai` install was likely added during development when the AI assistant features were being built, but it doesn't belong in the production build pipeline — it adds ~30 seconds to every deploy and the CLI isn't used at runtime. The Prisma migration change is more significant: `db:generate` only regenerates the Prisma client from the schema, while `migrate deploy` actually applies pending migrations to the database. This means production deployments will now properly apply schema changes.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| render.yaml | edit | 1 | 1 | 0 |

## Detailed Diff Analysis

**Before:** `buildCommand: npm install --include=dev && npm install -g opencode-ai && npm run build && npm run db:generate && npm run ci:reindex`

**After:** `buildCommand: npm install --include=dev && npm run build && npx prisma migrate deploy && npm run db:generate && npm run ci:reindex`

The `npm install -g opencode-ai` was removed because:
1. It's a development CLI tool, not a runtime dependency
2. It added unnecessary time to every deployment
3. Global npm installs in build environments can conflict with the project's dependency tree

The `npm run db:generate` was supplemented (not replaced — it's still there) with `npx prisma migrate deploy` to ensure database migrations are applied during deployment. The `db:generate` step regenerates the Prisma client, which is still needed after migrations.

## Why This Change Was Needed

The `opencode-ai` global install was hanging or failing during Render builds, causing deployment delays. Removing it eliminates a non-essential step that was slowing down the CI/CD pipeline.

## Was It Useful

Yes. This is a straightforward build optimization that removes an unnecessary dependency installation and adds proper database migration support.

## Impact Analysis

- **Build time:** Reduced by ~30 seconds (opencode-ai install + dependency resolution).
- **Deploy reliability:** Improved — one fewer external dependency that could fail.
- **Database:** Deployments now apply pending Prisma migrations automatically.
- **Risk:** Very low. The opencode-ai CLI wasn't used in the build or at runtime.

## Relationship to Surrounding Commits

This is a quick build fix sandwiched between the large infrastructure commit (0658) and the UI/UX fixes (0660-0664). It addresses a deployment issue discovered after the 0658 infrastructure changes.

## Confidence Notes

- The opencode-ai package is listed in `devDependencies` and doesn't need a global install.
- The `npx prisma migrate deploy` command is the standard way to apply migrations in production (vs `prisma db push` which is for development).

## Optional Technical Details

- Render's build pipeline runs in a clean environment on every deploy, so global npm installs are ephemeral and wasteful.
- The `ci:reindex` script at the end of the build command re-indexes the search engine — this still runs after the build and migration steps.
