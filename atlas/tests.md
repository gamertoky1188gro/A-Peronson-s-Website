# tests

- **Parent**: (none — CI only)
- **Purpose**: Verification — Jest/RTL unit tests, integration suites, Playwright e2e, and co-located service tests.
- **Key Files**: `tests/setupTests.js`, `tests/testServer.js`, `tests/README.md`, `tests/__mocks__/fileMock.cjs`, `tests/unit/*` (26), `tests/integration/*` (5), `tests/e2e/*` (2), `server/services/__tests__/*` (5)
- **Dependencies**: backend-services, backend-controllers, backend-utils, frontend-pages, frontend-components, frontend-offline, frontend-theme
- **Dependents**: (none — CI only)
- **Exposes**: `npm test`, `test:unit`, `test:integration`, `test:coverage`, `test:e2e`; regression coverage guarding audit fixes and recent subsystems.

## Inventory
- **unit (26)** — frontend: theme-hotkey, aiprefill, cn-leadsource, auth-session, events, localstorage-hook, product-industry, route-health, search-filters, validation, access-denied, confirm-dialog. server: hypercache, user-lookup, member-limits, entitlements, auth-middleware, middleware-security, permissions, validators, verification, wallet-coupon, currency, esign-mapper, hallucination, presets-agentsubids, analytics-governance, db-schema.
- **integration (5)** — assistant-draft, auth-middleware-http, presets-http, search-validation-http, verification-upsert.
- **e2e (2, Playwright)** — backend-health, backend-validation.
- **service co-located (5)** — under `server/services/__tests__/`.

## Gotchas
- `THEME.md` references `tests/unit/themeRegression.test.js` and `themeTokens.test.js` — **neither exists**; the only theme test is `frontend-theme-hotkey.test.js`.