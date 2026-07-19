# Commit 0132: Call Interface and Chat Overhaul

## Commit Metadata

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| **Hash**    | `f902a8fe99182f6fe0d8e96818f187066796961f` |
| **Parent**  | `45b84aad885690334320d1425beb8b4d53fbe12b` |
| **Author**  | gamertoky1188gro                           |
| **Date**    | 2026-03-11 23:58:24 +0600                  |
| **Message** | f                                          |

## High-Level Summary

Major CallInterface.jsx rewrite (+755/-438), ChatInterface.jsx updates (+601), presence system introduction, call session database growth, and vitess config addition. The "AllForChat" panel styles are refined, avatar URL support added to thread normalization, and chat message attachment handling improved.

## File-by-File Breakdown

| File                                         | Status               | Description                      |
| -------------------------------------------- | -------------------- | -------------------------------- |
| `dist/`                                      | Modified             | Build output                     |
| `index.html`                                 | Modified             | Entry point update               |
| `server/controllers/presenceController.js`   | New (+7)             | Online/offline presence tracking |
| `server/controllers/userController.js`       | Modified (+6)        | Additional user endpoints        |
| `server/database/call_sessions.json`         | Modified (+674)      | Large call session data          |
| `server/database/search_usage_counters.json` | Modified (+10)       | Search counters                  |
| `server/database/user_connections.json`      | Modified (+12)       | Connection updates               |
| `server/routes/messageRoutes.js`             | Modified (+5)        | Route tweaks                     |
| `server/routes/presenceRoutes.js`            | New (+9)             | Presence routes                  |
| `server/routes/userRoutes.js`                | Modified (+2)        | User route tweaks                |
| `server/server.js`                           | Modified (+8)        | Server config                    |
| `server/services/callSessionService.js`      | Modified (+38)       | Call session logic               |
| `server/services/messageService.js`          | Modified (+34)       | Message handling                 |
| `server/services/presenceService.js`         | New (+29)            | Presence tracking service        |
| `server/services/userService.js`             | Modified (+6)        | User service                     |
| `src/App.css`                                | Modified (+18)       | Styles                           |
| `src/index.css`                              | Modified (+11)       | Global styles                    |
| `src/pages/CallInterface.jsx`                | Modified (+755/-438) | Major call UI rewrite            |
| `src/pages/ChatInterface.jsx`                | Modified (+601/-347) | Major chat UI rewrite            |
| `vite.config.js`                             | Modified (+6)        | Vite config                      |

## Detailed Diff Analysis

### ChatInterface.jsx

- Replaced `SOCIAL_CATEGORIES` with simplified approach
- `PANEL_STYLE` simplified: removed gradient, solid `rgb(16, 13, 34)`
- `RIGHT_PANEL_STYLE` added for right column
- Thread normalization includes `avatar` field
- Message `last` field trimmed instead of default "No message content"
- Phone icon added to imports
- Right panel column layout adjustments

### Presence System

- New `presenceController.js` and `presenceService.js` for tracking user online/offline status
- `presenceRoutes.js` provides HTTP endpoints
- Integrated into `server.js`

### CallInterface.jsx

- Massive rewrite with 755 additions — complete overhaul of the call UI.

## Why This Change

Introduction of presence tracking and major UI refinement for both chat and call interfaces.

## Was It Useful

Yes. Presence tracking is essential for real-time communication features.

## Impact Analysis

- **Medium risk**: Large rewrites of ChatInterface and CallInterface.
- **New feature**: Presence system.

## Relationship to Surrounding Commits

Parent of 0133. Three days after 0131.

## Confidence Notes

Medium. The scale of changes makes it difficult to assess every detail without reading the full source.
