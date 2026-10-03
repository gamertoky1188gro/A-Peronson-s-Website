# Project Atlas

## Project Summary
- **Description**: GarTexHub — trust-first B2B textile & garments marketplace (buyers, factories, buying houses discover, negotiate, e-sign contracts, manage CRM leads).
- **Tech Stack**: React 19 + Vite 6 + Tailwind 4 + Redux Toolkit (SPA); Express 5 + Prisma 6 + PostgreSQL + Redis (API); WebSocket + SSE realtime; Jest + RTL + Playwright tests; Qdrant + OpenSearch semantic search.
- **Entry Points**: `src/main.jsx` + `src/App.jsx` (frontend); `server/server.js` (backend); `prisma/schema.prisma` (data, 95 models); `server/tui/index.js` (`npm run logs` dashboard).

## Module Tree

- **frontend-app** — SPA shell, routing, global providers → `atlas/frontend-app.md`
- **frontend-pages** — All route pages (feed, chat, dashboards, admin, auth) → `atlas/frontend-pages.md`
- **frontend-components** — Reusable UI (ui/, feed/, chat/, admin/, profile/) → `atlas/frontend-components.md`
- **frontend-lib** — Client infra (auth, logger, realtime, route health) → `atlas/frontend-lib.md`
- **frontend-store** — Redux slices (user, theme, toast, config) → `atlas/frontend-store.md`
- **frontend-hooks** — Custom React hooks → `atlas/frontend-hooks.md`
- **backend-server** — Express boot, route mounting, WS upgrade, TUI auto-launch → `atlas/backend-server.md`
- **backend-routes** — 56 route files mapping URLs to controllers → `atlas/backend-routes.md`
- **backend-controllers** — Request handlers, auth/entitlement guards → `atlas/backend-controllers.md`
- **backend-services** — Business logic (95 files, ~90 services), Prisma access → `atlas/backend-services.md`
- **backend-middleware** — auth, entitlements, rate-limit, requestLogger, admin guards → `atlas/backend-middleware.md`
- **backend-realtime** — WS/SSE bus, presence, feed + notification streams → `atlas/backend-realtime.md`
- **backend-log** — Structured log hub, parsers, search DSL, transports → `atlas/backend-log.md`
- **backend-tui** — Terminal log dashboard (blessed + Ink) → `atlas/backend-tui.md`
- **backend-workers** — Background workers (lead reminders, join requests) → `atlas/backend-workers.md`
- **backend-utils** — prisma/redis/logger/validators/session stores → `atlas/backend-utils.md`
- **data-prisma** — 95 Prisma models, migrations → `atlas/data-prisma.md`
- **shared** — FE/BE shared lifecycles, taxonomy, validation → `atlas/shared.md`
- **tests** — unit / integration / e2e suites → `atlas/tests.md`
- **python-ai** — HaramDetection Python AI tool → `atlas/python-ai.md`
- **docs-history** — docs/, history/ (731 records), audit reports → `atlas/docs-history.md`
- **tooling-deploy** — scripts, docker, CI, electron, SEO statics → `atlas/tooling-deploy.md`

## Data Flow
1. Browser loads `src/main.jsx` → `App.jsx` shell (ThemeProvider, LenisProvider, Redux store) → route page.
2. Page calls `src/lib/auth.js apiRequest()` with JWT → Express `requestLogger` → `middleware/auth.js` → route → controller → service → Prisma/PostgreSQL (or Redis/Qdrant), response returns as JSON.
3. Realtime: `src/lib/feedRealtime.js` / `notificationsRealtime.js` subscribe via SSE/WS → `server/realtime/realtimeBus.js` fans out DB change events.
4. Every request emits structured entries to `server/log/logHub.js` → console + `/ws/logs` → TUI dashboard or log viewer.
5. Background: `server/workers/*` poll overdue leads/join-requests → notificationService → Notification rows + realtime push.

## External Dependencies
- **Prisma + PostgreSQL** — primary datastore (95 models).
- **Redis** — presence, caching, queue depths, rate limiting.
- **Qdrant + OpenSearch** — semantic/vector + full-text search (`qdrantService`, `openSearchService`, `embeddingService`, `rerankerService`).
- **Dropbox Sign (`eSignProvider`)** — e-signature for contracts.
- **Nodemailer / EmailOutbox** — transactional email.
- **Google GenAI / OpenRouter** — assistant + chatbot AI features.
- **SimpleWebAuthn** — passkey auth (`passkeyService`).
