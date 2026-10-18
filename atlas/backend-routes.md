# backend-routes

- **Parent**: (none — under `server/`)
- **Purpose**: URL-to-controller mapping; 57 thin router files mounted under `/api/*` in `server.js`.
- **Key Files**: `server/routes/feedRoutes.js`, `authRoutes.js`, `adminRoutes.js`, `adminConfigRoutes.js`, `syncRoutes.js`, `seoRoutes.js`, `searchRoutes.js`, `conversationRoutes.js`, `messageRoutes.js`, `logRoutes.js`, `devRoutes.js`, `diagnosticsRoutes.js`
- **Dependencies**: backend-controllers, backend-middleware, backend-sync
- **Dependents**: backend-server
- **Exposes**: 57 REST mounts + `/log-viewer` + `/health` + SEO routes + SPA catch-all.

## Data Flow
Route applies `requireAuth` / entitlement / validation middleware → controller; upload routes add multer; feed stream routes hold SSE connections; `syncRoutes` mounts at `/api/sync` and is `requireAuth`-protected; `seoRoutes` is mounted unprefixed (`app.use(seoRoutes)`) for root-level bot meta + sitemap.

## Mount Table (server.js)
`/api/diagnostics`, `/api/auth`, `/api/users`, `/api/requirements`, `/api/documents`, `/api/verification`, `/api/subscriptions`, `/api/admin` (adminRoutes + adminConfigRoutes + uploadsRoutes), `/api/feed`, `/api/link-preview`, `/api/products`, `/api/onboarding`, `/api/assistant`, `/api/conversations`, `/api/messages`, `/api/analytics`, `/api/events`, `/api/leads`, `/api/system`, `/api/notifications`, `/api/join-requests`, `/api/social`, **`/api/sync`**, `/api/search`, `/api/qdrant`, `/api/presets`, `/api/partners`, `/api/agents/subids`, `/api/calls`, `/api/org`, `/api/members`, `/api/ratings`, `/api/presence`, `/api/profiles`, `/api/chatbot`, `/api/wallet`, `/api/boosts`, `/api/geo`, `/api/industry`, `/api/payment-proofs`, `/api/coupons`, `/api/support`, `/api/reports`, `/api/certifications`, `/api/crm`, `/api/ai`, `/api/deal-journeys`, `/api/workflow`, `/api/infra`, `/api/network`, `/api/exports`, `/api/logs`, `/api/dev`, `/log-viewer`, `/health`.

## Notes
- **Recently added**: `/api/sync` (offline twin head/delta/hydrate) and `seoRoutes` (bot-aware meta). Both were absent from the previous atlas.
- `securityController.js` is mounted **inside `adminRoutes.js`**, not at top level.