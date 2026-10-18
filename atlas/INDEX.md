# Project Atlas

## Project Summary
- **Description**: GarTexHub — trust-first B2B textile & garments marketplace (buyers, factories, buying houses discover, negotiate, e-sign contracts, manage CRM leads).
- **Tech Stack**: React 19 + Vite 6 + Tailwind 4 + Redux Toolkit + Dexie (SPA, offline-capable PWA); Express 5 + Prisma 6 + PostgreSQL + Redis (API); WebSocket + SSE realtime; Jest + RTL + Playwright tests; Qdrant + OpenSearch semantic search; 12-theme runtime CSS-token system.
- **Entry Points**: `src/main.jsx` + `src/App.jsx` (frontend); `src/sw.js` (service worker); `server/server.js` (backend); `prisma/schema.prisma` (data, 96 models); `src/theme/blueTheme.css` (theme source of truth, 838 tokens); `server/tui/index.js` (`npm run logs` dashboard).

## Module Tree

- **frontend-app** — SPA shell, routing (44 routes), global providers, viewport-lock logic → `atlas/frontend-app.md`
- **frontend-pages** — All route pages (feed, chat, dashboards, admin, auth, marketing) → `atlas/frontend-pages.md`
- **frontend-components** — Reusable UI (ui/, feed/, chat/, admin/, profile/, analytics/, leads/, products/) → `atlas/frontend-components.md`
- **frontend-lib** — Client infra (auth, logger, realtime, SEO meta, route health) → `atlas/frontend-lib.md`
- **frontend-store** — Redux slices (user, theme, toast, config) → `atlas/frontend-store.md`
- **frontend-hooks** — Custom React hooks → `atlas/frontend-hooks.md`
- **frontend-offline** — HyperCache offline twin: Dexie stores, sync engine, outbox, service worker → `atlas/frontend-offline.md`
- **frontend-theme** — 12-theme runtime palette, ambient washes, glass system, theme switcher → `atlas/frontend-theme.md`
- **backend-server** — Express boot, route mounting, WS upgrade, TUI auto-launch → `atlas/backend-server.md`
- **backend-routes** — 57 route files mapping URLs to controllers → `atlas/backend-routes.md`
- **backend-controllers** — Request handlers (63 files), auth/entitlement guards → `atlas/backend-controllers.md`
- **backend-services** — Business logic (98 files), sole Prisma callers → `atlas/backend-services.md`
- **backend-sync** — Change ledger + `/api/sync` head/delta/hydrate + hypercache helpers → `atlas/backend-sync.md`
- **backend-middleware** — auth, entitlements, rate-limit, requestLogger, admin guards → `atlas/backend-middleware.md`
- **backend-realtime** — WS/SSE bus, presence, feed + notification streams → `atlas/backend-realtime.md`
- **backend-log** — Structured log hub, parsers, search DSL, transports → `atlas/backend-log.md`
- **backend-tui** — Terminal log dashboard (27 files, blessed) → `atlas/backend-tui.md`
- **backend-workers** — Background workers (lead reminders, join requests) → `atlas/backend-workers.md`
- **backend-utils** — prisma/redis/logger/validators/session stores/hypercache helpers → `atlas/backend-utils.md`
- **data-prisma** — 96 Prisma models, migrations → `atlas/data-prisma.md`
- **shared** — FE/BE shared lifecycles, taxonomy, validation → `atlas/shared.md`
- **tests** — 26 unit + 5 integration + 2 e2e + 5 service suites → `atlas/tests.md`
- **python-ai** — HaramDetection Python AI tool → `atlas/python-ai.md`
- **docs-history** — docs/, history/, audit reports → `atlas/docs-history.md`
- **tooling-deploy** — scripts, docker, CI, electron, brand assets, theme generators, SEO statics → `atlas/tooling-deploy.md`

## Data Flow
1. Browser loads `src/main.jsx` → registers `src/sw.js` (prod) → `App.jsx` shell (ThemeProvider, LenisProvider, Redux, OfflineBanner, ThemeSwitcher) → route page.
2. Page calls `src/lib/auth.js apiRequest()` with JWT → Express `requestLogger` → `middleware/auth.js` → route → controller → service → Prisma/PostgreSQL (or Redis/Qdrant), response returns as JSON.
3. Realtime: `src/lib/feedRealtime.js` / `notificationsRealtime.js` subscribe via SSE/WS → `server/realtime/realtimeBus.js` fans out DB change events. `feedStreamController` replays `syncService.getDelta()` first so no gap exists before live attach.
4. Every request emits structured entries to `server/log/logHub.js` → console + file writers + `/ws/logs` → TUI dashboard or log viewer.
5. Background: `server/workers/*` poll overdue leads/join-requests → notificationService → Notification rows + realtime push.
6. **Offline sync**: offline CREATEs → Dexie `outbox` (idempotency-keyed) → `runSync()` pulls `GET /api/sync/delta` (backed by the `SyncChange` ledger) → hash-verify → apply to Dexie → push outbox with `Idempotency-Key`; `409` = deduped, gap in `seq` = `RESET_REQUIRED` full resync. Conflicts resolve version → timestamp → server-wins.

## External Dependencies
- **Prisma + PostgreSQL** — primary datastore (96 models).
- **Redis** — presence, caching, queue depths, rate limiting.
- **Dexie / IndexedDB** — client offline twin (18 stores, `gartexhub-local`).
- **vite-plugin-pwa / Workbox** — service worker generation + `injectManifest`.
- **Qdrant + OpenSearch** — semantic/vector + full-text search (`qdrantService`, `openSearchService`, `embeddingService`, `rerankerService`).
- **Dropbox Sign (`eSignProvider`)** — e-signature for contracts.
- **Nodemailer / EmailOutbox** — transactional email (Brevo HTTP API, IP-locked SMTP unusable from Render).
- **Google GenAI / OpenRouter / Ollama** — assistant + chatbot AI features.
- **SimpleWebAuthn** — passkey auth (`passkeyService`).
- **blessed (`neo-blessed` alias)** — TUI dashboard; always `import from "blessed"`, never `"neo-blessed"`.