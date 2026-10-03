# tooling-deploy

- **Purpose**: Build, ship, and operate — CI, containers, desktop shell, SEO statics, maintenance scripts.
- **Key Files**: `package.json` (scripts), `.github/workflows/*`, `Dockerfile`, `docker/nginx.conf`, `render.yaml` (if present), `electron/*`, `public/*` (sitemap.xml, robots.txt, favicons, manifest), `scripts/ci/*`, `scripts/db/*`, `.husky/pre-commit`, `server/evals/*`
- **Dependencies**: tests, data-prisma
- **Dependents**: (none — ops)
- **Exposes**: `dev`/`build`/`server`/`logs`/`test`/`db:migrate` scripts; CI (nodejs-tests, opensearch, snake); Docker + Render deploy; Electron desktop wrapper; AI eval harness (`ai:eval`); DB backfill scripts.
