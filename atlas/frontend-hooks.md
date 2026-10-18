# frontend-hooks

- **Parent**: (none — under `src/`)
- **Purpose**: Shared stateful React logic extracted from pages. 9 files.
- **Key Files**: `src/hooks/useSecureUser.js`, `src/hooks/useLocalStorageState.js`, `src/hooks/useAnalyticsDashboard.js`, `src/hooks/useCoreMetrics.js`, `src/hooks/useAdminConfig.js`, `src/hooks/useDocumentViewLogger.js`, `src/hooks/usePageChrome.js`, `src/hooks/useScrollDirection.js`, `src/hooks/useScrollVelocity.js`
- **Dependencies**: frontend-lib, frontend-store
- **Dependents**: frontend-pages, frontend-components
- **Exposes**: Secure current-user accessor, persisted state, analytics/core-metrics fetchers, admin config loader, doc-view tracking, per-dashboard nav/footer chrome collapse, scroll helpers.

## Internal Structure
- **Auth/data**: `useSecureUser`, `useLocalStorageState`, `useAnalyticsDashboard`, `useCoreMetrics` (queries match the Prisma schema), `useAdminConfig`, `useDocumentViewLogger`.
- **Chrome**: `usePageChrome.js` — per-dashboard opt-in collapse of NavBar/Footer for admin matrix, governance console, agent dashboard, and owner dashboard. Paired with the shell wrappers added in `App.jsx`.
- **Motion**: `useScrollDirection`, `useScrollVelocity`.