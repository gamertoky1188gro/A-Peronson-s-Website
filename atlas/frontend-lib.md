# frontend-lib

- **Parent**: (none — under `src/`)
- **Purpose**: Client-side infrastructure — API client, session, logging, realtime subscriptions, SEO meta, validation, theme hotkey. 20 files.
- **Key Files**: `src/lib/auth.js`, `src/lib/logger.js`, `src/lib/feedRealtime.js`, `src/lib/notificationsRealtime.js`, `src/lib/events.js`, `src/lib/upload.js`, `src/lib/validation.js`, `src/lib/secureStorage.js`, `src/lib/ThemeProvider.jsx`, `src/lib/themeHotkey.js`, `src/lib/usePageMeta.js`, `src/lib/envCheck.js`, `src/lib/aiPrefill.js`, `src/lib/fallbackCover.js`, `src/lib/remarkContainerDirective.js`, `src/lib/leadSource.js`, `src/lib/cn.js`, `src/lib/constants.js`, `src/lib/routes.js`, `src/lib/routeHealthCheck.js`
- **Dependencies**: backend-routes (HTTP/SSE/WS contracts), frontend-store, frontend-theme
- **Dependents**: frontend-app, frontend-pages, frontend-components, frontend-hooks, frontend-offline
- **Exposes**: `apiRequest()`, `getToken()`, `getCurrentUser()` (localStorage-primed), batched log forwarding, feed/notification SSE subscribers, `trackClientEvent()`, `usePageMeta()` (bot-aware SEO meta), `THEME_HOTKEY_WORD`/`trackThemeHotkey()`, `cn()` class merge, `leadSource` labels, `aiPrefill`, `fallbackCover`.

## Data Flow
Pages call `apiRequest()` → JWT from `secureStorage` → Express API; `logger.js` batches structured entries → `POST /api/logs/live`; realtime libs open SSE/WS channels into backend-realtime. `usePageMeta.js` mirrors `server/seo/botMeta.js` rules on the client for social crawlers.

## Internal Structure
- **API/session**: `auth.js`, `upload.js`, `secureStorage.js`, `validation.js`, `envCheck.js`, `constants.js`.
- **Telemetry**: `logger.js`, `events.js`.
- **Realtime**: `feedRealtime.js`, `notificationsRealtime.js`.
- **SEO/routing**: `usePageMeta.js`, `routes.js`, `routeHealthCheck.js`.
- **Theme**: `ThemeProvider.jsx`, `themeHotkey.js`.
- **Content helpers**: `remarkContainerDirective.js`, `fallbackCover.js` (Wallhaven random fallback covers), `aiPrefill.js`, `leadSource.js`, `cn.js`.