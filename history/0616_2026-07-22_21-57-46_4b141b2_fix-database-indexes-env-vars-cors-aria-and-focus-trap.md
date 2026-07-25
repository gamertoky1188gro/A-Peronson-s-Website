# Commit 0616 — `4b141b240d69`

| Field | Value |
|-------|-------|
| **Commit Number** | 0616 |
| **Commit Hash** | `4b141b240d69fc09bcfe45c9a584aea4b348fdc2` |
| **Parent Hash** | `cc5c8ce379b1b06c34906f6b74607b80df1300b0` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-22 21:57:46 |
| **Branch** | main |
| **Files Changed** | 6 |
| **Additions** | 195 |
| **Deletions** | 36 |
| **Net Change** | +159 |
| **Merge Commit** | No |

## Fix Database Indexes, Env Vars, CORS, ARIA, and Focus Trap

Resolves audit items #19–#25 in a single commit. Adds `@@index` on foreign keys across 18 Prisma models, implements startup env-var validation with `validateRequiredEnvVars()`, documents CORS permissiveness, makes Vite `allowedHosts` configurable via `VITE_ALLOWED_HOSTS`, adds ARIA attributes (`role="dialog"`, `aria-modal`, `aria-label`) to `AnimatedModal`, and introduces the `useFocusTrap` hook for keyboard-accessible modal focus management.

## Files Changed

| File | Status | Additions | Deletions | Net |
|------|--------|-----------|-----------|-----|
| `AUDIT_REPORT.md` | Modified | 42 | 27 | +15 |
| `prisma/schema.prisma` | Modified | 35 | 0 | +35 |
| `server/server.js` | Modified | 35 | 0 | +35 |
| `server/services/adminActionService.js` | Modified | 4 | 0 | +4 |
| `src/components/AnimatedModal.jsx` | Modified | 53 | 9 | +44 |
| `vite.config.js` | Modified | 2 | 0 | +2 |

## Detailed Diff Analysis

### `prisma/schema.prisma` — 18 models get `@@index` on foreign keys

Adds `@@index` annotations on foreign-key columns to optimize queries filtered by relationship lookups. Models affected:

| Model | Indexes Added |
|-------|---------------|
| `Requirement` | `assigned_agent_id` |
| `Product` | `company_id` |
| `MessageQueue` | `sender_id`, `match_id`, `org_id` |
| `MessagePolicyDecision` | `sender_id`, `match_id`, `org_id` |
| `CommunicationPolicyConfig` | `org_id` |
| `MessageQueueItem` | `sender_id`, `match_id`, `org_id` |
| `MessagePolicyLog` | `sender_id`, `match_id`, `org_id` |
| `CommunicationLimit` | `org_id` |
| `SearchAlert` | `user_id` |
| `CallSession` | `created_by`, `match_id` |
| `CallRecordingView` | `call_id`, `viewer_id` |
| `AnalyticsEvent` | `actor_id`, `type, created_at` |
| `Boost` | `user_id` |
| `ProductView` | `user_id`, `product_id` |
| `Report` | `actor_id`, `resolved_by` |
| `PolicyViolation` | `actor_id, created_at` |
| `UserConnection` | `requester_id`, `receiver_id` |
| `AssistantKnowledge` | `org_id` |
| `AssistantRule` | `org_id` |
| `WalletHistory` | `user_id, created_at` |
| `EmailOutbox` | `status, created_at` |

### `server/server.js` — Env var validation + CORS docs

- **`validateRequiredEnvVars()`**: New function that checks `REQUIRED_ENV_VARS` (`DATABASE_URL`, `JWT_SECRET`) — exits with status 1 if missing — and logs warnings for `RECOMMENDED_ENV_VARS` (`REDIS_URL`, `ADMIN_EMAIL`, `ADMIN_TEST_EMAIL`, `ALLOWED_WS_ORIGINS`, `OPENAI_API_KEY`, `VITE_API_PROXY`). Called at module load time before the Express app starts.
- **CORS documentation**: Expanded the comment above the CORS configuration to explain that permissive dev-mode CORS is intentional — no cookie sessions (JWT-in-header), dev server not internet-exposed, CSRF mitigated by JWT-in-Header pattern.

### `server/services/adminActionService.js` — `ADMIN_TEST_EMAIL` fallback

In the `performAdminAction` email-recipient resolution, added `process.env.ADMIN_TEST_EMAIL` as a fallback before the empty-string default. This allows operators to configure a test email recipient via environment variable.

### `src/components/AnimatedModal.jsx` — ARIA + focus trap

- **Imports**: Added `useEffect`, `useRef` from React.
- **`FOCUSABLE` constant**: CSS selector string matching all focusable elements.
- **`useFocusTrap` hook**: Custom hook that traps Tab/Shift-Tab focus within the modal container. On open, saves the previously focused element, then focuses the first focusable child after a 50 ms delay. On Tab, wraps between first and last focusable elements. On unmount/close, returns focus to the saved element.
- **`containerRef`**: Added `useRef` for the modal container, passed to `useFocusTrap`.
- **ARIA attributes**: Both the reduced-motion and animated modal variants now have:
  - `role="dialog"` and `aria-modal="true"` on the outer container
  - `aria-label="Close modal"` on the overlay/close button

### `vite.config.js` — Configurable `allowedHosts`

Replaced the hardcoded `allowedHosts: ["habits-asia-occur-acute.trycloudflare.com"]` with a dynamic expression that reads `VITE_ALLOWED_HOSTS` (comma-separated env var) and falls back to `["localhost"]`. This allows developers and CI environments to specify allowed hosts without editing the config file.

### `AUDIT_REPORT.md` — Status updates

Marked items #19–#25 as fixed, updated summary tables, and moved them to the completed items list in the priority sections. Audit conclusion now mentions resolved database indexes, env var validation, focus management, ARIA labels, and Vite allowedHosts.

## Why This Change Was Needed

Six audit items addressed:
- **#19**: Missing Prisma indexes cause slow queries on frequently filtered foreign-key joins.
- **#20**: Hardcoded empty test recipient string makes email testing inflexible.
- **#21**: Missing env-var validation allows misconfigured deployments to start silently.
- **#22**: CORS permissiveness in dev mode was undocumented, risking confusion.
- **#23**: Hardcoded tunnel hostname in Vite config breaks when the tunnel URL changes.
- **#24**: Missing ARIA labels break screen-reader navigation.
- **#25**: Modal focus trap missing; keyboard users could tab outside modals.

## Was It Useful

**High** — Database performance (indexes), deployment safety (env validation), developer experience (Vite config), and accessibility (ARIA + focus trap) all improved.

## Impact Analysis

- **Database**: 18+ models get optimized query paths for foreign-key lookups.
- **Server startup**: Missing critical env vars now cause immediate exit with clear error.
- **Dev experience**: Tunnel hosts configurable via env var instead of hardcoded.
- **Accessibility**: Modals announce as dialogs, close button labeled, focus trapped.
- **Deployment**: `ADMIN_TEST_EMAIL` env var allows email testing without code changes.

## Relationship to Surrounding Commits

Follows commit 0615 (error boundaries + form validation). Precedes the massive commit 0617 which resolves audit issues #31–#50 across 71 files.

## Confidence Notes

High. Changes are well-scoped, each addressing a specific audit item with clear, self-contained diffs.
