# Codebase Overview

## Project Summary
- **Description**: GarTexHub — trust-first B2B textile & garments marketplace (buyers, factories, buying houses discover, negotiate, e-sign, manage CRM leads).
- **Tech Stack**: React 19 + Vite 6 + Tailwind 4 + Redux Toolkit (SPA); Express 5 + Prisma 6 + PostgreSQL + Redis (API); WebSocket + SSE realtime; Jest + RTL + Playwright; Qdrant + OpenSearch semantic search; Python YOLOv8 image service.
- **Entry Points**: `src/main.jsx` + `src/App.jsx` (frontend); `server/server.js` (backend); `prisma/schema.prisma` (data, 95 models); `server/tui/index.js` (`npm run logs` dashboard).

## Directory Structure
- `src/` — React 19 SPA (pages ~64, components ~63, lib 18, store 5, hooks 8).
- `server/` — Express 5 API (routes 56, controllers 61, services 95 files, middleware 11, log 13, tui 26, utils 16, workers 2, realtime 1).
- `prisma/` — `schema.prisma` (95 models); no local migrations dir.
- `shared/` — FE/BE shared lifecycles + validation (dealLifecycle, workflowLifecycle, requirementValidation, event-taxonomy.json, config/geo + platformTaxonomy).
- `tests/` — 48 unit + 11 integration (.test.js) + 2 e2e (.spec.ts) + mocks/setup/testServer.
- `PythonAi/HaramDetection/` — YOLOv8 image detection service (main.py, config.yaml, yolov8n.pt).
- `scripts/` — ci (reindex-opensearch, smoke-search) + db (backfill-org-operations, import-json-to-postgres, migrate-crm-json-to-sql).
- `docs/` + `history/` — docs (12 subdirs, PROJECT_DOCS.md) + session history records.
- `atlas/` — 21-module AI-navigable map (INDEX.md + per-module files).
- `docker/` + root — nginx.conf, Dockerfile, docker-compose.yml, render.yaml, electron/.

## Modules

### frontend-app
- **Purpose**: SPA shell, routing, global providers (Theme, Lenis smooth-scroll, Redux, ErrorBoundary).
- **Key Files**: `src/main.jsx`, `src/App.jsx`, `src/components/LenisProvider.jsx`, `src/components/ErrorBoundary.jsx`.
- **Dependencies**: frontend-pages, frontend-components, frontend-store, frontend-lib.
- **Exposes**: Route tree, app-shell layout, protected-route guards.

### frontend-pages
- **Purpose**: All route pages — feed, chat, owner/agent/admin dashboards, auth, ContractVault.
- **Key Files**: `src/pages/MainFeed.jsx`, `src/pages/ChatInterface.jsx`, `src/pages/OwnerDashboard.jsx`, `src/pages/AdminPanel.jsx`, `src/pages/ContractVault.jsx`, `src/pages/auth/Login.jsx`.
- **Dependencies**: frontend-components, frontend-lib, frontend-store, frontend-hooks.
- **Exposes**: Route-level screens consumed by App.jsx.

### frontend-components
- **Purpose**: Reusable UI (ui/, feed/, chat/, admin/, profile/, products/, leads/).
- **Key Files**: `src/components/NavBar.jsx`, `src/components/FloatingAssistant.jsx`, `src/components/feed/FeedItemCard.jsx`, `src/components/leads/LeadManager.jsx`, `src/components/ui/NeonAtom.jsx`.
- **Dependencies**: frontend-lib, frontend-store.
- **Exposes**: Shared presentational + domain widgets.

### frontend-lib
- **Purpose**: Client infra — JWT auth, realtime subscriptions, logging, route health.
- **Key Files**: `src/lib/auth.js`, `src/lib/routes.js`, `src/lib/routeHealthCheck.js`, `src/lib/feedRealtime.js`, `src/lib/notificationsRealtime.js`, `src/lib/logger.js`.
- **Dependencies**: backend-server (HTTP/WS API).
- **Exposes**: `apiRequest()`, `getCurrentUser()`, realtime hooks, ROUTE_MANIFEST.

### frontend-store
- **Purpose**: Redux global state — user, theme, toast, remote config.
- **Key Files**: `src/store/index.js`, `src/store/userSlice.js`, `src/store/configSlice.js`, `src/store/themeSlice.js`.
- **Dependencies**: frontend-lib.
- **Exposes**: Store + slices + selectors.

### frontend-hooks
- **Purpose**: Custom React hooks (auth, admin config, analytics, scroll, doc-view logging).
- **Key Files**: `src/hooks/useSecureUser.js`, `src/hooks/useAdminConfig.js`, `src/hooks/useAnalyticsDashboard.js`.
- **Dependencies**: frontend-lib, frontend-store.
- **Exposes**: Reusable stateful logic.

### backend-server
- **Purpose**: Express boot, route mounting, WS/SSE upgrade, TUI auto-launch.
- **Key Files**: `server/server.js`.
- **Dependencies**: backend-routes, backend-middleware, backend-realtime, backend-log.
- **Exposes**: HTTP + WS server, `/api/*`, `/ws/logs`, assistant WS.

### backend-routes
- **Purpose**: 56 route files mapping URLs to controllers.
- **Key Files**: `server/routes/authRoutes.js`, `server/routes/feedRoutes.js`, `server/routes/adminRoutes.js`, `server/routes/logRoutes.js`.
- **Dependencies**: backend-controllers, backend-middleware.
- **Exposes**: URL → controller bindings.

### backend-controllers
- **Purpose**: Request handlers + auth/entitlement guards (61 files).
- **Key Files**: `server/controllers/authController.js`, `server/controllers/feedController.js`, `server/controllers/logController.js`.
- **Dependencies**: backend-services, backend-middleware.
- **Exposes**: Handler functions per route.

### backend-services
- **Purpose**: Business logic, Prisma access (~90 services) + AI/search/queue providers.
- **Key Files**: `server/services/feedService.js`, `server/services/leadService.js`, `server/services/qdrantService.js`, `server/services/videoQueue.js`, `server/services/imageQueue.js`, `server/services/esignRetryService.js`.
- **Dependencies**: backend-utils (prisma/redis), data-prisma.
- **Exposes**: Domain operations to controllers/workers.

### backend-middleware
- **Purpose**: Cross-cutting guards — auth, entitlements, rate-limit, request logging, admin step-up.
- **Key Files**: `server/middleware/auth.js`, `server/middleware/entitlements.js`, `server/middleware/requestLogger.js`, `server/middleware/adminStepUp.js`.
- **Dependencies**: backend-utils, backend-log.
- **Exposes**: Express middleware chain.

### backend-realtime
- **Purpose**: WS/SSE bus, presence, feed + notification fan-out.
- **Key Files**: `server/realtime/realtimeBus.js`.
- **Dependencies**: backend-utils (redis), backend-log.
- **Exposes**: Publish/subscribe channels for FE realtime libs.

### backend-log
- **Purpose**: Structured log hub — ring buffer, parsers, search DSL, WS/REST transport.
- **Key Files**: `server/log/logHub.js`, `server/log/transport.js`, `server/log/search.js`, `server/log/builtinParsers.js`.
- **Dependencies**: backend-utils (logger).
- **Exposes**: `logHub.emit()`, `/api/logs/*`, `/ws/logs`.

### backend-tui
- **Purpose**: Terminal log dashboard (blessed + Ink), `npm run logs`.
- **Key Files**: `server/tui/index.js`, `server/tui/app.js`, `server/tui/logList.js`, `server/tui/inspector.js`.
- **Dependencies**: backend-log (via WS snapshot/stream).
- **Exposes**: Live log UI; no library API.

### backend-workers
- **Purpose**: Background jobs — lead + join-request reminders → notifications.
- **Key Files**: `server/workers/leadRemindersWorker.js`, `server/workers/joinRequestReminderWorker.js`.
- **Dependencies**: backend-services, backend-realtime.
- **Exposes**: `npm run worker:lead-reminders` entry.

### backend-utils
- **Purpose**: Infra helpers — prisma/redis clients, logger, validators, session/crm stores.
- **Key Files**: `server/utils/prisma.js`, `server/utils/redis.js`, `server/utils/logger.js`, `server/utils/permissions.js`.
- **Dependencies**: data-prisma, External Dependencies (Postgres/Redis).
- **Exposes**: Shared clients + helpers.

### data-prisma
- **Purpose**: 95-model datastore — users, feed, messaging/policy/queue, leads/SLA, governance, assistant KB, wallet/coupons, org versioning.
- **Key Files**: `prisma/schema.prisma`.
- **Dependencies**: None (schema only).
- **Exposes**: Prisma client models to services.

### shared
- **Purpose**: FE/BE shared lifecycles, validation, taxonomy.
- **Key Files**: `shared/dealLifecycle.js`, `shared/workflowLifecycle.js`, `shared/requirementValidation.js`, `shared/event-taxonomy.json`.
- **Dependencies**: None.
- **Exposes**: Lifecycle machines + validators imported by both sides.

### tests
- **Purpose**: 48 unit + 11 integration + 2 e2e suites (Jest + RTL + Playwright).
- **Key Files**: `tests/unit/`, `tests/integration/`, `tests/e2e/deal-journey-matrix.spec.ts`, `tests/testServer.js`.
- **Dependencies**: All modules (test targets).
- **Exposes**: `npm test`, `npm run test:unit`, `npm run test:e2e`.

### python-ai
- **Purpose**: YOLOv8 HaramDetection image service (isolated Python, uv).
- **Key Files**: `PythonAi/HaramDetection/main.py`, `PythonAi/HaramDetection/config.yaml`.
- **Dependencies**: None (standalone service).
- **Exposes**: Image-detection endpoint consumed by backend image pipeline.

### docs-history
- **Purpose**: Project docs + 731-record session history + audit reports (AGENTS.md fixes log, forensic audits).
- **Key Files**: `AGENTS.md`, `docs/PROJECT_DOCS.md`, `history/progress.json`, `AUDIT-REPORT.md`.
- **Dependencies**: None.
- **Exposes**: Institutional memory for agents.

### tooling-deploy
- **Purpose**: Scripts, Docker, CI, Electron, SEO statics.
- **Key Files**: `scripts/ci/reindex-opensearch.mjs`, `docker/nginx.conf`, `Dockerfile`, `render.yaml`, `electron/main.cjs`.
- **Dependencies**: All modules (build/deploy targets).
- **Exposes**: `npm run build/server/docs:generate/ci:*`, container blueprints.

## Data Flow
1. Browser loads `src/main.jsx` → `App.jsx` shell (Theme, Lenis, Redux) → route page.
2. Page calls `src/lib/auth.js apiRequest()` with JWT → `requestLogger` → `middleware/auth.js` → route → controller → service → Prisma/PostgreSQL (or Redis/Qdrant), JSON back.
3. Realtime: `feedRealtime.js`/`notificationsRealtime.js` via SSE/WS → `realtimeBus.js` fans out DB change events.
4. Every request emits structured entries to `logHub.js` → console + `/ws/logs` → TUI.
5. Background: `server/workers/*` poll overdue leads → notificationService → Notification rows + realtime push.

## External Dependencies
- **PostgreSQL + Prisma** — primary datastore (95 models).
- **Redis** — presence, cache, queues, rate limiting.
- **Qdrant + OpenSearch** — vector + full-text search (qdrant/embedding/reranker/openSearch services).
- **Dropbox Sign (`eSignProvider`)** — contract e-signature.
- **Nodemailer / EmailOutbox** — transactional email.
- **Google GenAI / OpenRouter** — assistant + chatbot AI.
- **SimpleWebAuthn** — passkey auth.
