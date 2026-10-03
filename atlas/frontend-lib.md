# frontend-lib

- **Purpose**: Client-side infrastructure — API client, session, logging, realtime subscriptions, validation.
- **Key Files**: `src/lib/auth.js`, `src/lib/logger.js`, `src/lib/feedRealtime.js`, `src/lib/notificationsRealtime.js`, `src/lib/events.js`, `src/lib/upload.js`, `src/lib/validation.js`, `src/lib/secureStorage.js`, `src/lib/ThemeProvider.jsx`
- **Dependencies**: backend-routes (HTTP/SSE/WS contracts), frontend-store
- **Dependents**: frontend-app, frontend-pages, frontend-components, frontend-hooks
- **Exposes**: `apiRequest()`, `getToken()`, `getCurrentUser()` (localStorage-primed), batched log forwarding, feed/notification SSE subscribers, `trackClientEvent()`, upload helpers.

## Data Flow
Pages call `apiRequest()` → JWT from secureStorage → Express API; `logger.js` batches structured entries → `POST /api/logs/live`; realtime libs open SSE/WS channels into backend-realtime.
