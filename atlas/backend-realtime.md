# backend-realtime

- **Purpose**: Live push — WebSocket assistant chat, SSE feed/events, presence, notification fan-out.
- **Key Files**: `server/realtime/realtimeBus.js`, `server/services/presenceService.js`, `server/services/webrtcService.js`, `server/services/callSessionService.js`, `server/services/notificationService.js`, `server/controllers/feedStreamController.js`, `src/lib/feedRealtime.js`, `src/lib/notificationsRealtime.js`
- **Dependencies**: backend-log, backend-utils
- **Dependents**: backend-server, backend-services, frontend-lib
- **Exposes**: Central event bus, `/api/feed` SSE stream, `/api/events` SSE, assistant WS, call signaling, presence channels; all clean up all WS handlers on unmount (CONNECTING-state safe).
