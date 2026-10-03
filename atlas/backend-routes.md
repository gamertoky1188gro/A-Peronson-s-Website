# backend-routes

- **Purpose**: URL-to-controller mapping; ~60 thin router files mounted under `/api/*` in server.js.
- **Key Files**: `server/routes/feedRoutes.js`, `server/routes/authRoutes.js`, `server/routes/adminRoutes.js` + `adminConfigRoutes.js`, `server/routes/searchRoutes.js`, `server/routes/conversationRoutes.js`, `server/routes/messageRoutes.js`, `server/routes/logRoutes.js`, `server/routes/devRoutes.js`, `server/routes/diagnosticsRoutes.js`
- **Dependencies**: backend-controllers, backend-middleware
- **Dependents**: backend-server
- **Exposes**: REST surface: auth, users, requirements, documents, verification, subscriptions, admin×3, feed, link-preview, products, onboarding, assistant, conversations, messages, analytics, events, leads, system, notifications, join-requests, social, search, qdrant, presets, partners, agents/subids, calls, org, members, ratings, presence, profiles, chatbot, wallet, boosts, geo, industry, payment-proofs, coupons, support, reports, certifications, crm, ai, deal-journeys, workflow, infra, network, exports, logs, dev.

## Data Flow
Route applies `requireAuth` / entitlement / validation middleware → controller; upload routes add multer; feed stream routes hold SSE connections.
