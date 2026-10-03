# frontend-hooks

- **Purpose**: Shared stateful React logic extracted from pages.
- **Key Files**: `src/hooks/useSecureUser.js`, `src/hooks/useLocalStorageState.js`, `src/hooks/useAnalyticsDashboard.js`, `src/hooks/useCoreMetrics.js`, `src/hooks/useAdminConfig.js`, `src/hooks/useDocumentViewLogger.js`, `src/hooks/useScrollDirection.js`, `src/hooks/useScrollVelocity.js`
- **Dependencies**: frontend-lib, frontend-store
- **Dependents**: frontend-pages, frontend-components
- **Exposes**: Secure current-user accessor, persisted state, analytics/core-metrics fetchers, admin config loader, doc-view tracking, scroll helpers.
