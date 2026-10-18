# tooling-deploy

- **Parent**: (none — ops/tooling)
- **Purpose**: Build, ship, and operate — CI, containers, desktop shell, brand assets, theme generators, SEO statics, maintenance scripts, test reporting.
- **Key Files**: `package.json` (scripts), `.github/workflows/*` (4), `Dockerfile`, `docker/nginx.conf`, `docker-compose.yml`, `render.yaml`, `electron/main.cjs`, `public/*` (sitemap, robots, manifest, favicons, og-image, screenshots, self-hosted `fonts/inter-latin.woff2`), `brand/*` (7 SVG logo/icon variants), `scripts/*`, `scripts/ci/*`, `scripts/db/*`, `scripts/theme_specs.py`, `scripts/generate-themes.py`, `scripts/theme-audit.py`, `scripts/migrate-literals.py`, `scripts/neon-{report,allure,hub-data}.mjs` + `neon-hub-template.html`, `.husky/pre-commit`, `server/evals/*`
- **Dependencies**: tests, data-prisma
- **Dependents**: (none — ops)
- **Exposes**: `dev`/`build`/`server`/`logs`/`test`/`db:migrate`/`docs:generate` scripts; CI (nodejs-tests, opensearch, snake); Docker + Render deploy; Electron desktop wrapper; AI eval harness (`ai:eval`); theme generator + audit; Neon lab test reporting (`test:report`, `test:allure`); DB backfill scripts.

## Internal Structure
- **Theme pipeline**: `scripts/theme_specs.py` (author specs) → `scripts/generate-themes.py` (emits all generated `src/theme/themes/*` files; `--check` = parity mode) → `scripts/theme-audit.py` + `scripts/migrate-literals.py` (find literal colors that bypass tokens). Per-theme overlay CSS lives in `scripts/<theme>-overlay.css`.
- **DB scripts** (`scripts/db/`): `backfill-free-agent-limit.mjs`, `backfill-org-operations-policies.mjs`, `import-json-to-postgres.mjs`, `migrate-crm-json-to-sql.mjs`.
- **CI scripts**: `ci/reindex-opensearch.mjs`, `ci/smoke-search.mjs`. **Diagnostics**: `diagnose.mjs`.
- **Brand** (`brand/`): app-icon, icon, icon-micro, icon-mono-dark/light, logo-dark/light SVGs.

## Gotchas
- `.husky/pre-commit` lints **only staged files** — do NOT reintroduce a repo-wide `biome check --write .` (it once rewrote ~600 files and staged the churn).
- `.env` is **untracked** (`git rm --cached .env`); keep secrets in local `.env`, declare new names in `.env.example`. Never `git checkout -- .` to undo a bad auto-format — it reverts your own work too.