# Commit 0003: Rebuild App into Textile Trust MVP with Express API

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0003                                       |
| **Commit Hash**   | `6213071b41a3d9158b979bf159a30253bf9886c3` |
| **Parent Hash**   | `daba2ccb910d4be00c31d3d955a9e1db8a904b29` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-01 15:43:59 (+0600)                |
| **Files Changed** | 66                                         |
| **Additions**     | 3,870                                      |
| **Deletions**     | 187                                        |
| **Net Change**    | +3,683 lines                               |
| **Merge Commit**  | No                                         |

## Custom Title

**Complete Express.js Backend and Monolithic Full-Stack Frontend**

## High-Level Summary

This commit transforms the project from a purely frontend Vite+React scaffold into a working full-stack MVP by adding a complete Express.js backend with JSON file-based persistence. The backend includes authentication (JWT), user management, requirement/matching engine, messaging, document upload, and admin analytics. The frontend `App.jsx` is completely rewritten as a monolithic state-management hub that handles registration, login, requirements posting, match viewing, inbox/chat, and admin panels all in one component.

## File-by-File Breakdown

### Backend (`server/`) — 21 new files

| File                                          | Lines   | Description                                                                                                             |
| --------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `server/server.js`                            | 34      | Express app entry: CORS, JSON parsing, static uploads, health check, route mounting, error handler                      |
| `server/middleware/auth.js`                   | 29      | JWT signing/verification, `requireAuth` guard, `allowRoles` role-check middleware                                       |
| `server/middleware/errorHandler.js`           | 7       | Global error handler returning 500 JSON                                                                                 |
| `server/routes/authRoutes.js`                 | 11      | POST `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`                                                        |
| `server/routes/userRoutes.js`                 | 14      | GET/PATCH user profile, admin user listing/verification/deletion                                                        |
| `server/routes/requirementRoutes.js`          | 21      | CRUD for buyer requirements, match listing, status patching                                                             |
| `server/routes/messageRoutes.js`              | 11      | GET inbox, POST/get messages by match ID                                                                                |
| `server/routes/documentRoutes.js`             | 11      | POST document upload with multer                                                                                        |
| `server/routes/adminRoutes.js`                | 10      | GET match audit, conversion metrics                                                                                     |
| `server/controllers/authController.js`        | 36      | Register (validation, duplicate check), login (password verify), logout                                                 |
| `server/controllers/userController.js`        | 30      | Profile CRUD, admin user management                                                                                     |
| `server/controllers/requirementController.js` | 37      | Requirement CRUD, match viewing, status updates                                                                         |
| `server/controllers/messageController.js`     | 30      | Send/get messages, role-aware inbox with priority/request pool                                                          |
| `server/controllers/documentController.js`    | 11      | Document upload handling                                                                                                |
| `server/controllers/adminController.js`       | 11      | Match audit and metrics endpoints                                                                                       |
| `server/services/userService.js`              | 94      | User CRUD with bcrypt hashing, profile updates, verification                                                            |
| `server/services/requirementService.js`       | 73      | Requirement CRUD with auto-match generation                                                                             |
| `server/services/matchingService.js`          | 70      | Factory scoring algorithm, match generation/update/listing                                                              |
| `server/services/messageService.js`           | 43      | Message posting, listing, tiered inbox (verified priority vs request pool)                                              |
| `server/services/documentService.js`          | 30      | File upload to disk, metadata persistence (.pdf only)                                                                   |
| `server/utils/jsonStore.js`                   | 47      | Thread-safe JSON file read/write with per-file locking                                                                  |
| `server/utils/logger.js`                      | 17      | INFO/ERROR console logging with timestamps                                                                              |
| `server/utils/metrics.js`                     | 17      | State transition tracking for analytics                                                                                 |
| `server/utils/validators.js`                  | 25      | Email, role, sanitization, field requirement helpers                                                                    |
| `server/database/*.json`                      | 6 files | Empty JSON arrays: `users.json`, `requirements.json`, `matches.json`, `messages.json`, `documents.json`, `metrics.json` |

### Frontend Changes

**`src/App.jsx`** — Complete rewrite (+267 lines). Monolithic component managing all app state: auth, registration, requirements, matches, inbox, messages, admin users, metrics. Contains inline UI rendering for login/register forms, requirement posting form, match display, inbox/chat, and admin panels. Dark mode toggle integrated.

### Config Changes

**`package.json`** — Added server dependencies: `bcryptjs`, `cors`, `express`, `jsonwebtoken`, `multer`, `concurrently`. Added scripts: `server`, `dev:full`.

**`README.md`** — Updated for full-stack setup.

## Detailed Diff Analysis

### Backend Architecture

- **JSON file store** (`jsonStore.js`): Simple async file-based persistence with per-file locking to prevent race conditions. Reads and writes pretty-printed JSON arrays.
- **Authentication**: JWT-based with 7-day expiry. Hardcoded `'mvp-dev-secret'` secret. Bearer token in Authorization header.
- **Role system**: `buyer`, `factory`, `buying_house`, `admin` roles. Middleware guards routes.
- **Matching engine**: Scores factories against buyer requirements based on: category match (+40), MOQ compatibility (+25), certification overlap (+10 each), lead time fit (+20). Auto-generates matches when requirements are posted.
- **Tiered inbox**: Messages sorted into `priority` (from verified senders) and `request_pool` (unverified).
- **Document upload**: Multer with memory storage, 5MB limit, PDF only.

### Frontend Monolith

- Single `App.jsx` component handles all UI and state
- No React Router — everything is conditionally rendered based on auth state and inline navigation
- API helper function with token management
- Dark mode toggles `dark` class on `<html>`

## Why This Change May Have Been Needed

The initial scaffold was a static frontend with no backend. To demonstrate a working MVP, the developer needed a backend API with authentication, data persistence, matching logic, and messaging. The monolithic approach in App.jsx was likely chosen for speed of development.

## Was It Useful?

**Yes, but with caveats.** The backend is well-structured with separation of concerns (routes, controllers, services, utils). However:

- JSON file storage is not scalable but works for prototyping
- The frontend monolith (App.jsx at 332+ lines) is not maintainable long-term
- The matching engine is a simple scoring algorithm that would need refinement
- JWT secret is hardcoded

## Impact Analysis

- **Users**: Can now register, log in, post requirements, view matches, send messages, and use admin features
- **Developers**: Backend code is clean and modular; frontend is messy
- **Backward compatibility**: Complete rewrite of App.jsx — breaks any existing page-specific work
- **Testing**: No tests included

## Relationship to Surrounding Commits

This commit branches from the root (0001) in parallel with commit 0002. It will be merged with commit 0002's branch in the next commit (0004, a merge commit).

## Confidence Notes

- **Confidence: High**. The backend code is well-structured and clear.
- The frontend monolith is clearly a development shortcut rather than production code.

## Optional Technical Details

- The JWT secret fallback is `'mvp-dev-secret'` — obviously insecure for production
- Multer version `^2.1.0` was used (note: Express 5 + Multer 2 compatibility)
- Matching algorithm uses a simple scoring (0-100) with category match weighted at 40 points
- File locking in jsonStore prevents race conditions on concurrent writes
- Concurrently package added to run server + Vite dev together
