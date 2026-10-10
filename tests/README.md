# Test suite (rebuilt Oct 2026)

Primary runner: **Jest 29** (`npm test`) + **Playwright** (`npm run test:e2e`).
Jest was retained over Vitest deliberately: the repo already wires Jest +
babel-jest + jsdom + Testing Library, CI runs `npm test`, and the backend is a
mixed ESM/CJS Express 5 app that Jest handles via `babel.config.cjs`
(`babel-plugin-transform-vite-meta-env` maps `import.meta.env`). Introducing
Vitest would duplicate runners and force dep upgrades for no concrete
incompatibility.

## Commands

| Command | What it runs |
|---|---|
| `npm test` | all Jest suites (unit + integration) |
| `npm run test:unit` | `tests/unit` only |
| `npm run test:integration` | `tests/integration` only |
| `npm run test:coverage` | full run with coverage report |
| `npm run test:e2e` | Playwright specs in `tests/e2e` (skip cleanly when the API is down) |
| `npm run test:report` | **aggregate reporting workflow**: clean result dirs → Jest (+JSON+coverage) → Playwright → Allure generate+finalize → Neon hub data. Exits non-zero if any test failed |
| `npm run test:allure` | generate the Allure report + hub data from existing results (no test execution) |
| `npm run test:report:open` | serve the generated Allure report locally (`allure open`) |

## Environment

- `NODE_ENV=test` is set by Jest automatically. `server/utils/prisma.js`
  returns an in-memory proxy in test env (all model calls resolve to
  `[]`/`null`/`0`/`{}`); override delegates per test.
- `server/utils/localStore.js` uses a process `Map` in test env — presets and
  agent sub-ids persist across tests **within one test file**. Files use unique
  names/owners to stay independent.
- `tests/setupTests.js` injects `JWT_SECRET=test-jwt-secret-do-not-use-in-prod`
  so `server/middleware/auth.js` (which throws at import without it) loads.
- Never point tests at a real `DATABASE_URL`. Destructive DB work is
  schema-static only (`db-schema.test.js` reads files, never connects).

## Layout

- `tests/unit` — pure functions, services with mocked prisma, middleware, hooks
  and components (RTL + jsdom). No network, no DB. Test files must use the
  `.test.js` extension, and must NOT override the environment with a plain
  `@jest-environment jsdom` docblock: results are emitted by the
  `allure-jest/jsdom` environment, and anything bypassing it runs but
  silently vanishes from reports.
- `tests/integration` — real HTTP via `supertest` + `express` against the real
  routers/middleware, plus service-level AI orchestration with a stubbed LLM.
- `tests/e2e` — Playwright against a running API (`E2E_BASE_URL`, default
  `http://localhost:4000`; optional `E2E_WEB_SERVER=true` boots
  `node server/server.js` with `ALLOW_DB_OFFLINE=true`). Specs skip when the
  server is unreachable — they never fail on a missing server.
- `tests/testServer.js` — minimal express harness for the two assistant
  endpoints under test (uses `express.json`, no extra deps).
- `tests/__mocks__/fileMock.cjs` — image stub for `moduleNameMapper`.

## NEON TEST LAB — reporting

- **Allure Report 3 + Awesome** (`allure` CLI, config `allurerc.mjs`, title
  *NEON TEST LAB — Application Quality Report*) aggregates
  `reports/allure-results-jest` (unit/component/integration via the
  `allure-jest` Jest environment) and `reports/allure-results-e2e` (via
  `allure-playwright`) into `reports/allure-report/`.
- **Playwright native HTML** goes to `reports/playwright-report/` (single
  execution also emits `reports/playwright-results.json` for the hub).
- **Neon hub** (`reports/neon-hub/index.html` + `data.json`, built from
  `scripts/neon-hub-template.html` by `scripts/neon-hub-data.mjs`) links the
  real reports and shows real counts; missing artifacts render as missing.
  Serve the repo root for full navigation (`npx serve .`).
- **Result isolation:** `npm run test:report` wipes only
  `reports/allure-results-*`, `reports/playwright-report`, `reports/neon-hub`,
  `reports/*.json`. `coverage/` is refreshed by the run. All are gitignored.
- **Windows note:** `allure generate` can stop before its final file moves
  (`EPERM` renaming `awesome/*` up one level). `scripts/neon-allure.mjs`
  completes that documented layout from the generator's own files (no vendor
  patching) and smoke-checks `index.html` + `widgets/statistic.json`.
- **Deliberately omitted:** Vitest/`@vitest/ui`/`allure-vitest` (no Vitest
  suite exists; a parallel runner would violate the single-runner rule) and
  Mochawesome (no Mocha suite exists).

## Coverage exclusions (justified)

- `tests/e2e/*` excluded from Jest (`testMatch` only covers
  `*.test.js`/`*.spec.js`; e2e specs are `.spec.ts` for Playwright).
- Animation primitives, static pages (Terms/Privacy), and icon wrappers have no
  tests: no meaningful behavior to assert.
- Live-AI paths (Ollama/OpenAI, Qdrant, OpenSearch, email, FX provider) are
  stubbed or assert fallback behavior only — no network in tests.
- Real PostgreSQL integration is blocked (no `DATABASE_URL` in this
  environment); schema/migration coverage is static. See the final test report
  for the exact blocker.
