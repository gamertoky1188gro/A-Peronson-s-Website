# AGENTS.md — GartexHub

## Dev commands

```bash
npm run server        # backend (Express, port 4000, --watch)
npm run dev           # frontend (Vite, port 5173)
npm run dev:full      # both concurrently
npm run app           # Electron: build → server → launch
```

## Test / lint / build

| command | what |
|---|---|
| `npm test` | Jest unit tests (`--experimental-vm-modules --runInBand`) |
| `npm run test:unit` | same as `npm test` but scoped to `tests/unit/` |
| `npm run test:e2e` | Playwright (`tests/e2e/`) |
| `npm run lint` | ESLint |
| `npm run build` | Vite build |
| `npm run ci:full` | OpenSearch → reindex → tests → smoke |

Pre-commit (husky) runs: Prettier → lint → test → build. If it fails, fix the first failing step.

## Architecture

- **Monorepo-style** but single `package.json`. Frontend in `src/`, backend in `server/`, both ESM.
- **Database:** PostgreSQL via Prisma (`prisma/schema.prisma`). Also has JSON file stores under `server/database/` for rapid MVP iteration.
- **Prisma commands:** `npm run db:generate`, `npm run db:migrate:dev`, `npm run db:studio`
- **OpenSearch** required for search tests/CI. Start via `docker compose up -d opensearch`. Reindex with `npm run ci:reindex`.
- **No TypeScript** in source — JSX/JS only. `typescript` is a devDependency but unused for source code.
- **Tailwind v4** (via `@tailwindcss/vite` plugin, not PostCSS). `tailwind.config.js` exists but may be legacy — check `tailwind.css` for `@import "tailwindcss"`.
- **Jest config:** `jest.config.cjs` + `babel.config.cjs` with `babel-plugin-transform-vite-meta-env` for Vite env var compatibility.

## Key quirks

- `ALLOW_DB_OFFLINE=true` allows running backend without a real PostgreSQL connection.
- Frontend Vite dev server proxies `/api`, `/uploads`, `/ws` to `localhost:4000`.
- `VITE_API_URL` env var for standalone frontend (without proxy).
- `VITE_BASE_URL=./` in production/Electron for relative asset paths.
- Server uses `node --watch` (built-in Node 20+ file watcher).
- No explicit typecheck command — `tsc` is not run in CI.
- `docs/` contains auto-generated API docs (run `npm run docs:generate` to rebuild).
