# Commit 0121: Chat UI Overhaul with Friend System Foundation

## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `7d6acd32b634cc9c556d8b2a05c881e753903484` |
| **Parent** | `35076144d9497cbd3a992b9a4c9c1b4082b5370b` |
| **Author** | Cyber Code Master |
| **Date** | 2026-03-08 13:56:29 +0600 |
| **Message** | Refine chat UI identity, spacing, and metadata presentation |

## High-Level Summary
Major overhaul of the ChatInterface UI with dark-mode-aware styling, addition of a full friend/connection system (follow, friend requests, friend chat threads), file upload support, avatar initials, display name formatting, and session persistence with "remember me" support. This is a foundational commit introducing the social graph layer (friends, follows) into the application.

## File-by-File Breakdown
| File | Status | Description |
|------|--------|-------------|
| `server/controllers/callSessionController.js` | Modified (+24) | Added `joinFriendCall` endpoint |
| `server/controllers/messageController.js` | Modified (+64) | Added `sendFriendDirectMessage`, `uploadMessageAttachment`, `canAccessMatch` checks |
| `server/controllers/userController.js` | Modified (+46) | Added `searchUsersController`, `followUserController`, `friendRequestController` |
| `server/database/user_connections.json` | New (+1) | Empty connections array |
| `server/routes/callSessionRoutes.js` | Modified (+2) | Added `/friend/:userId/join` route |
| `server/routes/messageRoutes.js` | Modified (+27) | Added multer upload config, `/friend/:userId`, `/:matchId/upload` routes |
| `server/routes/userRoutes.js` | Modified (+14) | Added `/search`, `/:userId/follow`, `/:userId/friend-request` routes |
| `server/server.js` | Modified (+49) | Upload dirs creation, WebSocket access control for match/call rooms |
| `server/services/friendService.js` | New (+49) | Friend match ID builder, connection listing, relationship checks |
| `server/services/messageService.js` | Modified (+106) | `canAccessMatch`, `postFriendMessage`, `listFriendMatchIdsForUser`, friend thread metadata |
| `server/services/userService.js` | Modified (+145) | `buildFriendMatchId`, `isFriendConnected`, `searchUsers`, `followUser`, `sendFriendRequest`, `connectionSnapshot` |
| `server/setupLlama.js` | Modified (+2) | Better error logging on download failure |
| `src/components/NavBar.jsx` | Modified (+231) | User search dropdown, follow/friend/message/call actions from navbar |
| `src/lib/auth.js` | Modified (+19) | Session storage fallback, `rememberMe` option, 401 auto-logout, `cache: 'no-store'` |
| `src/pages/ChatInterface.jsx` | Modified (+392) | Complete UI restyle, friend thread support, file upload, avatar initials, display name formatting, inline media rendering |
| `src/pages/HelpCenter.jsx` | Modified (+10) | Deferred FAQ loading with setTimeout |
| `src/pages/auth/Login.jsx` | Modified (+3) | Pass `rememberMe` to `saveSession` |

## Detailed Diff Analysis

### Backend: Friend System (userService.js)
- New `buildFriendMatchId(userA, userB)` creates deterministic `friend:uuidA:uuidB` identifiers
- `connectionSnapshot()` returns the current relationship state (follow/friend_status) between two users
- `searchUsers()` queries users by name/email/role and returns augmented results with relationship info
- `followUser()` toggles/creates follow connection records
- `sendFriendRequest()` handles bidirectional friend request logic:
  - If target has already sent a request → auto-accepts (creates friend)
  - If outgoing request exists → no-op (idempotent)
  - Otherwise → creates pending friend_request

### Backend: friendService.js (new)
- `buildFriendMatchId()` - deterministic sort-based ID generation
- `listFriendConnectionsForUser()` - retrieves all friend/friend_request rows for a user
- `hasFriendRelationship()` - checks active/pending friend connections
- `isFriendConnected()` - alias for active friend check

### Backend: Access Control (messageService.js, server.js)
- `canAccessMatch()` gates all message operations: only participants (sender/receiver in friend thread, or factory/requester in match thread) can read/write
- WebSocket `joinChatRoom` and `relayChatMessage` now check `canAccessMatch`
- WebSocket `joinCallRoom` now requires a valid JWT token and verifies call access via `getCallSession()`

### Backend: Message Uploads (messageController.js, messageRoutes.js)
- `uploadMessageAttachment` handles file uploads to `server/uploads/chat/`
- Multer configured with 25MB limit, safe filename generation
- Automatically classifies files as image/video/file based on MIME type
- Returns created message object with attachment metadata

### Frontend: ChatInterface.jsx - Complete Restyle
- **Identity layer**: avatar initials (`getInitials()`), display name formatting (`formatDisplayName()`), thread info toggle
- **Friend thread support**: `isFriendThread`, `friendRequestStatus`, `friendRequestDirection` in thread normalization
- **Lock status labels** now differentiate friend threads
- **Inline media rendering**: `renderMessageBody()` handles image/video/file attachments with absolute URL resolution
- **File upload via input**: hidden file input triggered by button, sends via FormData to upload endpoint
- **Instant call**: `startInstantCall()` creates/joins call room and navigates to `/call`
- **UI restyle**: Gradient blue bubbles for own messages, slate bubbles for others, avatar circles, rounded-2xl message cards
- Removed old "cyberpunk" theme colors, replaced with Tailwind slate/blue palette

### Frontend: NavBar.jsx - User Search
- Real-time user search with 250ms debounce
- Search results dropdown with follow/add friend/message/call buttons
- Relationship state management (following, friend_status)
- Disabled states for self, already-following, etc.

### Frontend: auth.js - Session Improvements
- `getToken()` now falls back to `sessionStorage`
- `getCurrentUser()` returns `null` if no token (prevents stale user data)
- `saveSession()` accepts `{ remember }` option: if true saves to localStorage, else sessionStorage
- `clearSession()` clears both localStorage and sessionStorage
- `apiRequest` adds `cache: 'no-store'` and auto-clears session on 401

## Why This Change
This commit introduces the social graph (friends, follows) to enable direct messaging and calling between authenticated users. The UI overhaul moves from a cyberpunk aesthetic to a modern SaaS dark-mode-ready design. File upload, session management improvements, and access control hardening are supporting features making the chat system production-ready.

## Was It Useful
Yes. This is a foundational commit establishing the friend/connection system, access control, file upload pipeline, and a much-improved chat UI. The session persistence with "remember me" improves UX.

## Impact Analysis
- **Risk**: High. Touches 17 files across the entire stack. Access control changes could lock out legitimate users if `canAccessMatch` is too restrictive.
- **Compatibility**: New API endpoints and database collections (user_connections.json). Frontend expects new fields in message objects.
- **Dependencies**: Introduces `multer` for file uploads. WebSocket auth flow changed (now required for call rooms).

## Relationship to Surrounding Commits
This commit shares the same parent (35076144) as 0123 (ab93fbc1) — both appear to be parallel branches. 0122 (c5b1316a) merges this commit with another line. 0124 (68b397b3) later resolves merge conflicts between 0122 and 0123.

## Confidence Notes
High confidence. The diff is clean with clear separation of concerns between friend system, access control, uploads, and UI. The `connectionSnapshot()` function handles the state machine for friend relationships correctly.

## Optional Technical Details
- Friend match ID format: `friend:{uuidA}:{uuidB}` with sorted UUIDs for determinism
- File upload limits: 25MB via multer
- Debounce: 250ms for user search
- WebSocket access control checks happen at join and at each message relay
