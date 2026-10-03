# tests

- **Purpose**: Verification — 50+ Jest/RTL unit tests, integration suites, Playwright e2e.
- **Key Files**: `tests/unit/*`, `tests/integration/*`, `tests/e2e/*`, `tests/setupTests.js`, `tests/testServer.js`, `tests/__mocks__/*`, `server/services/__tests__/*`
- **Dependencies**: backend-services, frontend-pages, frontend-components
- **Dependents**: (none — CI only)
- **Exposes**: `npm test` / `test:unit` / `test:e2e`; regression coverage (lead CRM, authz, comms policy, currency, analytics governance) guarding audit fixes.
