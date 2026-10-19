# AGENTS.md — Problems & Fixes

## 24. The signed-file gate had three residual holes (Owner)

- **Problem (a) — the media lost its fade.** The fix wave changed `className={className}` to `class={className}` in `src/components/chat/SignedMedia.jsx`. React 19 does render `class` on a DOM element (and warns about it — once, see the end of this sentence), so the `<video>` kept working, but `LazyImage` reads `className` and spreads everything else onto the `<img>`, so `class` fell through `...rest` and landed on the `<img>` as a **second** class attribute, replacing the `transition-opacity duration-200 opacity-0/100` classes LazyImage sets. The fade was gone, and React logged "Invalid DOM property `class`. Did you mean `className`?" **once** — React deduplicates that warning per property name for the life of the React module, so only the FIRST DOM element that receives a `class` prop reports it, whichever element that is: measured in isolation, `<img>`, `<video>` and `<div>` each warn exactly once, and three `<img>`s in a row still warn once.
- **Problem (b) — the `/sign` budget was too tight, and a 429 was silent.** The client signed **one path per request**, so a chat thread with fifty images was fifty requests against a 60/minute per-user budget, and every preview modal spent another one asking whether a document may be handed to a third party. Worse, `signPaths` caught every failure and returned `{}`, so a rate-limited sign and a refused sign were indistinguishable: the thumbnail or the download simply did not appear, with nothing on screen to say why.
- **Problem (c) — a name collision left a file unreachable.** The registry pass that adopts files already on disk (`ensureDocumentRowsForExistingFiles`, `server/services/uploadsService.js`) matched by **basename**, so `a.pdf` in `chat/` and `a.pdf` in `contracts/` meant the second file never got a row — and a file with no row is unreachable for everyone (item 23).
- **Fix:**
  - (a) `className` restored in `SignedMedia.jsx`.
  - (b) The client **batches** sign requests (`signEntry` in `src/lib/signedFile.js`): everything asked for in the same turn goes in one request, chunked at the server's own 50-path cap. A 429 is reported as `SIGN_RATE_LIMITED` instead of being swallowed, the client backs off for a second before its next request, and the surfaces say so. The server's request budget went to 300/minute and a **path budget** (1500 paths/minute) was added, so the headroom is paid for in requests and not in server load.
  - (c) The registry now keys files by their **normalised public path**, not their name.
- **Gotchas:**
  - **The path budget is the one that bounds the work.** A request may carry 50 paths and every path costs a database round trip inside the authorization resolver, so a request cap alone does not bound the server's load: 300 requests x 50 paths is 15,000 authorizations a minute. `createUnitBudget` (`server/middleware/rateLimiter.js`) counts paths separately for that reason, and 1500 paths a minute is half the work the old 60-request cap allowed.
  - **Both budgets fail closed.** Over budget is a 429, never an allow-through, and the client never falls back to the raw path.
  - **The client's sign requests are queued on a microtask**, so a sign is one microtask later than it used to be. Anything that asserts "exactly one request so far" has to allow for that (`tests/unit/frontend-signed-file.test.js`).
  - **`useSignedSrcState` is the form that reports a failure**; `useSignedSrc` still returns a string and cannot tell a pending sign from a failed one. A surface that shows nothing on failure has to use the state form, or the failure is invisible again.
  - **The registry's key is the full path.** A file adopted under a basename that belongs to another directory is unreachable for everyone — the same failure mode as a missing row.
  - **A sign failure has ONE shape: the server's own `{ error, status }`.** `useSignedSrcState` used to rename it to `{ reason, status }` while `describeSignFailure` reads `error`, so the reason was dropped at the boundary: the chat thumbnail and the modal's sign banner — the two surfaces driven by the hook — showed the generic "could not be loaded" for a rate limit and for a refusal alike, which is the very confusion the failure half exists to remove. The hook now reports the entry unchanged, and `describeSignFailure` is the only place a failure is understood. A surface that invents its own field name for the reason silently loses it.
  - **Ten pre-existing `class=` on `<LazyImage>` remain** — `src/components/chat/AttachmentPreviewModal.jsx:1375`, `src/components/chat/MarkdownMessage.jsx:183`, `src/components/feed/FeedItemCard.jsx:137`, `src/components/feed/PostDetailModal.jsx:220`, `src/components/ui/PostPreview.jsx:154`, `src/pages/AdminPanel.jsx:3618`, `src/pages/chat/MessageArea.jsx:80`, `src/pages/ChatInterface.jsx:1537`, `src/pages/Settings.jsx:2739` and `src/pages/Settings.jsx:2785`. They are the same defect as (a) but predate the fix wave (`ed577cbcf`, 2026-10-05, and `0f5eed5b`, 2026-10-07); they cost the fade, not the layout. Left alone on purpose. Counted over all 38 `<LazyImage>` elements in `src/`.

## 23. The upload access control's authorization key was never created (Owner)

- **Problem:** the whole branch keyed file authorization on a `Document` row, but the only producer of those rows for `chat/`, `calls/` and `search/` was the AI-moderation backfill — and that is disabled in the deployed configuration (`AI_HARAM_ANALYTICS_ENABLED=false` in `render.yaml` and `.env`) and only ever covered image/video. A chat `.pdf`/`.txt`/`.html` never got a row regardless. `authorizeFilePath` answers `not_found` for a path no row anchors (`fileAccessService.js`), so every chat attachment, every call recording and every search image was unreadable by *everyone*, the uploader included. The static mount 404s the gated prefixes, so there was no fallback.
- **Fix:** the row is written at **write time**, where the ownership facts exist: `server/services/privateDocumentService.js` (`recordPrivateUpload`) is called by the chat upload (`server/controllers/messageController.js`), the recording upload (`server/controllers/callSessionController.js`) and the search-image upload (`server/controllers/searchController.js`). The registry pass that adopts files already on disk (`ensureDocumentRowsForExistingFiles`, `server/services/uploadsService.js`) is split out of the moderation scanner, so it runs whatever the flag says and covers every file type, not just media.
- **Gotchas:**
  - **A file with no `Document` row is not public — it is unreachable.** That is the fail-closed direction, and it is why row creation cannot depend on a feature flag. Do not "fix" a missing row by re-enabling the moderation scan.
  - **A call recording is authorized against the session that owns it**, named by `entity_id` — never against `recording_url`. That column is caller-supplied (`PATCH /api/calls/:callId/recording` is `requireAuth` only and stores any string) and `markRecording` only asks whether the caller is a participant of *their own* session, so a url as the anchor let a caller point their own session at any recording path and then be "a participant of a session whose recording is that file".
  - **`search/` is modelled, not un-gated.** The upload route (`POST /api/search/image`) is `requireAuth`, so the uploader is a real party to the file: the row is `entity_type: "search_image"`, authorized on `uploaded_by` and on the path being under `/uploads/search/`. The old scanner's `uploads` type lands in the resolver's default branch, which denies every non-admin.
  - **`POST /api/documents/url` is now `requireAuth` + `allowRoles("owner","admin")`.** It is not in the original spec or plan — it is an API change, recorded in the design spec (§6.4a), in the plan's Task 3 addendum, and in `docs/decisions/`. `ensureAllowedUrl` accepts any `/uploads/...` path, so that route was the forgery vector; `tests/unit/server-file-access.test.js` asserts the role restriction, so widening it is a deliberate edit to a test.
  - **`UPLOADS_SIGNING_SECRET` is required at boot.** It is in `REQUIRED_ENV_VARS` (`server/utils/envValidation.js`), declared in `render.yaml` with `generateValue: true`, and refused below 32 characters. Unset or short, the server exits instead of booting into a state where every private file is unreachable with no signal.
  - **The client keeps no copy of the server's gated-prefix list.** `/api/files/sign` answers `thirdPartySafe` per path, and the server returns the `ttlMs` it used. A client-side copy of either drifts silently, and the consequence of the prefix list drifting is a private document's signed url reaching `view.officeapps.live.com`.
  - **The 208 orphan contract PDFs are admin-only and stay that way** — `uploaded_by: "system"`, no parties, no `contract_number`. There is no claim path yet; the rollout note is `docs/rollout/2026-10-18-upload-access-control-rollout.md`.

## 22. Private uploads were world-readable (Owner)

- **Problem:** `server/server.js` mounted all of `server/uploads/` through `express.static` with no auth, so every contract PDF, chat attachment, call recording and search upload was fetchable by anyone holding the URL. Filenames are `${Date.now()}-<sanitized basename>` (`server/routes/messageRoutes.js:108`) — guessable, permanent, never expiring. Nothing wrote a `DocumentView` on the way in, so there was no audit trail either.
- **Root cause:** One blanket static mount served the public and private trees together. `chatUploadsRoot` was created at `server/server.js:283` and only ever `mkdir`'d — never served. `server/routes/uploadsRoutes.js` exposes listing/stats/delete only, never bytes. `DocumentView` modelled access, but the static mount bypassed it, so the model was never enforced and never recorded.
- **Fix:** The four private prefixes (`chat/`, `contracts/`, `calls/`, `search/`) are now reachable only through short-lived HMAC URLs minted by `POST /api/files/sign` (`server/routes/fileAccessRoutes.js:38`) and authorized through `Document.entity_type` (`server/services/fileAccessService.js:176`). `GET /api/files/content` (`fileAccessRoutes.js:90`) verifies the signature, re-resolves both ends through `fs.realpath` so a symlink planted inside the tree cannot escape the root, records a `DocumentView` for contract PDFs (`fileAccessRoutes.js:120`), and serves with `Cache-Control: private, no-store` instead of Express's default `public, max-age=0` (`fileAccessRoutes.js:129`). The static mount 404s gated prefixes via `server/utils/gatedStaticGuard.js`, mounted at `server/server.js:315` immediately in front of `express.static` (`server/server.js:316`) so a later mount rearrangement cannot silently reopen them. `feed/`, `profile/` and root CMS assets stay public — the `/share/:entityType/:entityId` route (`server/routes/feedRoutes.js:150`) hands out post payloads that reference them. Client side: `src/lib/signedFile.js` (`signOne` / `signAndOpen` / `signAndDownload`).
- **Fix (emailService, same branch):** the four log-only branches (`logged_disabled`, `logged_no_smtp`, `logged_no_gmail`, `logged_unsupported`) reported `ok: true` while sending nothing; they now return `ok: false` (`server/services/emailService.js:115,130,143,155`). `describeEmailTestOutcome` (`src/pages/AdminPanel.helpers.js:1005`, used at `src/pages/AdminPanel.jsx:2293`) reads that flag, so the admin notice distinguishes "Test email sent." from "Test email not delivered (<status>)" instead of claiming a send that never happened.
- **Gotchas:**
  - **The guard is its own module, not inline in `server.js`.** The 404 logic lives in `server/utils/gatedStaticGuard.js`; `server.js` only mounts it.
  - **Sign the `path.resolve`d absolute path, not the query parameter.** The HMAC input is `JSON.stringify([absPath, uid, exp])` (`server/utils/signedFileUrl.js:64`) with `absPath` the resolved absolute path. Signing the raw `?path=` value would let `?file=../../.env` sign cleanly.
  - **Decode, then normalize, then classify.** `serve-static`/`send` percent-decode and textually normalize the path *before* reading the file, while `req.path` at a mounted middleware is still encoded — classifying `req.path` as-is leaves the two sides out of step and lets `/uploads/%63ontracts/x.pdf`, `/uploads/./contracts/x.pdf` and `/uploads/feed/../contracts/x.pdf` walk past. The guard decodes (`gatedStaticGuard.js:109`), folds `\` to `/`, collapses separators and `path.posix.normalize`s (`:123-124`) before classifying.
  - **On NTFS, `fs.realpath` must be the async form.** `realpathSync` does not resolve 8.3 short-name aliases, so `CONTRA~1` stays `CONTRA~1` and the resolved-path re-check silently does nothing while still looking correct; `fs.promises.realpath` (`gatedStaticGuard.js:87`) resolves it back to `contracts`. `contracts` is the only gated prefix long enough to get an alias today — a property of the list, not a guarantee.
  - **Auth is Bearer-in-localStorage, so `requireAuth` on a file route breaks `window.open`** — `<img>` and downloads cannot attach an `Authorization` header. Signed URLs are required, not optional; `uid` is an HMAC input, so presenting a different one yields `bad_signature` rather than acting as a claim about identity.
  - **`UPLOADS_SIGNING_SECRET` must fail closed when unset** — `signFileUrl` throws (`signedFileUrl.js:75`), `verifySignedFile` returns `not_configured` (`:107`), and `/sign` surfaces 503. Never a default secret. It is also **required at boot** now (`server/utils/envValidation.js`): the server exits without it, and refuses one shorter than 32 characters, because booting "clean" without it made every private file unreachable with no signal at all.
  - **Back-filled orphans have `uploaded_by: "system"`** (`server/services/uploadsService.js`) and are intentionally admin-only until claimed; `flagUnclaimedPrivateFiles` flags them in the admin listing so they stay discoverable rather than silently locked. That is the contract case: a contract needs two named parties and a system row names none. A chat file adopted by the registry pass is different — chat authorization is message-based, so the thread participants and the uploader can read it.
  - **A blank-party contract is authorized by its creator through `contract_number` provenance.** `documentService.js:621` skips the rating check when either `buyer_id` or `factory_id` is blank, so a draft can exist with both empty. `canAccessContract` (`server/utils/permissions.js:133`) trusts `uploaded_by`, which any caller of `POST /documents/url` can self-assert, so `canUserAccessDocument` additionally requires either a party claim or `uploaded_by == user.id` *and* a `contract_number` (`fileAccessService.js:191-194`). `contract_number` is server-defaulted (`documentService.js:636`), unwritable via `/url` and immutable — which is what makes it safe against pre-existing forged rows. `artifact` was briefly a second marker and was dropped: `PATCH /contracts/:id/artifact` and `/signatures` write it, so a forged row could mint it after creation (`fileAccessService.js:88`).
  - **`.husky/pre-commit`'s test gate reads npm's own exit status** — it used to read grep's, which a red suite could never make non-zero. Do not reintroduce the piped form (`npm test 2>&1 | grep ...` followed by `if [ $? -ne 0 ]`): a red suite still prints `FAIL`/`Tests:`, so grep exits 0 and the gate passes. `set -o pipefail` is not the fix either — husky runs the hook with `sh -e`, and `/bin/sh` is dash on Debian, where pipefail does not exist. `scripts/verify-precommit-gate.sh` extracts the gate from the hook and proves it fails a red suite.

## 19. Viewport-locked dashboard layout (Owner) + zoom compensation

- **Requirement:** `/owner`, `/contracts`, `/leads`, `/verification` render exactly viewport height (min = max = viewport), zero window scroll; sidebar, content column, and sidebar nav scroll internally.
- **Gotcha 1 — `lg:[zoom:0.8]` scales viewport units:** `100vh`/`100dvh` compute in device px but render at 80% on lg screens, so any `100dvh`-sized element always leaves a ~20% gap. `125dvh × 0.8 = 100%`, therefore locked shells use `h-dvh overflow-hidden lg:h-[125dvh]` (`src/App.jsx` `isViewportLockedRoute`). Same reason the old `min-h-[125vh]` shell accidentally filled viewports.
- **Gotcha 2 — the `div.dark` theme wrapper breaks the flex chain:** `OwnerDashboard.jsx` renders `<div class="dark">` between the motion wrapper and the flex root; as a plain block box it sizes by content and kills every `flex-1` below it. It must carry `flex min-h-0 flex-1 flex-col` (`src/App.jsx` motion.div and `<main>` already have their `flex-1 min-h-0` links — verify the full chain when adding wrappers).
- **Gotcha 3 — NO `{/* */}` comments between JSX props:** esbuild (Vite dev transform) 500s the file. A JSX comment between props blanked `/owner` to a no-shell page until removed.
- **Fix:** shell lock in `src/App.jsx`, root `flex max-h-full min-h-0 w-full flex-1` + `overflow:hidden`, aside stretches (`lg:h-auto`), content column + nav `flex-1 min-h-0` with `overflow-y:auto`. Verified live via CDP `evaluate_script` rects (shell == viewport, docScrollH == viewport, content/nav internal scroll active).

## 10. MainFeed infinite re-render loop ("infinite loading")

- **Problem:** Feed page stuck in perpetual loading spinner; console floods with `WebSocket closed before established` from FloatingAssistant (a side effect). Multiple parallel `GET /api/users/me` requests.
- **Root cause (primary):** Two cascading instability loops:
  1. `loadFeedPage` useCallback depended on `[activeCategory, activeType, token, unique, user?.role, feedConfig, nextCursor, markLoaded]` — any state change (e.g., `user?.role` from `loadUser`, `feedConfig` from config effect) recreated `loadFeedPage`, which re-fired the feed `useEffect`, which changed more state → loop.
  2. `auth.js`'s `getCurrentUser()` returned `null` on cold cache (page reload), causing `ProtectedRoute` to render `<NeonAtom />` spinner instead of `<MainFeed />` — unmounting MainFeed. When cache later populated and a re-render happened, MainFeed mounted again. Combined with `React.StrictMode` double-mount, this caused multiple mount → fetch → unmount → remount cycles.
- **Fix (MainFeed.jsx):**
  - Introduced `liveRef` — a ref updated every render with latest state values. Both `loadUser` and `loadFeedPage` read from `liveRef.current` instead of closure-captured state. Defined with `[markLoaded]` and `[]` deps respectively — **never change reference**.
  - Feed effect deps changed from `[loadFeedPage]` to `[loadFeedPage, activeCategory, activeType, unique, feedConfig]` — triggers on filter changes without callback-reference cascades.
  - Previous fixes retained: `markLoaded` in `useCallback`, `nextCursorRef`/`setNextCursorBoth` to decouple cursor state.
- **Fix (auth.js):**
  - `getCurrentUser()` now primes `cachedUser` from `localStorage` via `loadUserFromStorage()` when in-memory cache is cold. Ensures `ProtectedRoute` gets a valid user on first render after page reload, preventing MainFeed unmount.

## 11. FloatingAssistant WebSocket "closed before established"

- **Verdict:** Symptom of the MainFeed re-render loop. React unmounts/remounts the component tree rapidly; FloatingAssistant's cleanup closes a CONNECTING WebSocket, producing the error. Fixed by item 10. The server logs `Assistant WebSocket connected` many times because each remount initiates a new connection.

## 1. Verification page as Owner tab

- **Problem:** `/verification` and `/verification-center` were standalone routes in App.jsx
- **Fix:** Removed routes from App.jsx; imported VerificationPage into OwnerDashboard.jsx with `embedded` prop; added "Verification" nav item

## 2. ContractVault hardcoded data

- **Problem:** Artifact audit, banking refs, notification count, workflow summary used mock data
- **Fix:** All sections now read from `contract.raw.*` API data with `"—"` fallback when absent

## 3. Lenis scroll interception across all pages

- **Problem:** Sidebar and independent scroll panels across the app didn't scroll with mousewheel/touchpad — Lenis captured the events globally
- **Root cause:** **Lenis** (smooth-scroll library in `src/components/LenisProvider.jsx`) intercepts all wheel events globally
- **Fix (OwnerDashboard):** Added `data-lenis-prevent` to `<aside>` sidebar, `scrollbar-invisible` class in `tailwind.css` (cross-browser hidden scrollbar without breaking Firefox). Layout: outer container `height: 100vh` + `overflow: hidden`, both panels `overflow: auto`
- **Fix (project-wide):** Added `data-lenis-prevent` to every `overflow-y-auto`/`overflow-auto` scrollable container across all pages: OwnerDashboard main panel, MainFeed sidebar + main, AgentDashboard sidebar, ContractVault sidebar + main, ChatInterface thread list + message area + right panel, AdminPanel nav + main content

## 4. Nav self-health check

- **Problem:** Nav items (`/contracts`, `/verification`, `/leads`) pointed to non-existent routes, hitting the catch-all redirect to `/`
- **Fix:** Created `src/lib/routeHealthCheck.js` with `ROUTE_MANIFEST` (all valid routes) and `isRouteValid(path)` — strips query params, checks exact match then pattern match for dynamic routes (`/industry/:slug`, `/buyer/:id`, etc.)
- **Applied to:** NavBar.jsx (`publicLinks`, `navigationGroups` — groups hidden when empty), Footer.jsx (`/verification`, `/contracts` links), ChatInterface.jsx (`CHAT_NAV_ITEMS`), OwnerDashboard.jsx (`quickActions`)

## 5. OrgSettings embedded in OwnerDashboard

- **Problem:** OrgSettings was a standalone page only; no way to access settings from within the OwnerDashboard panel
- **Fix:** Added `embedded` prop to OrgSettings — when true, skips full-page layout (header, background blobs, loading screen) and renders only the tab navigation, status bar, and tab content. Added `settings` tab to OwnerDashboard `menuItems`, imports OrgSettings, renders `<OrgSettings embedded />` when active.

## 6. Missing owner panel routes added

- **Problem:** `/contracts` and `/leads` were not in App.jsx routes or ROUTE_MANIFEST, causing nav items to be hidden by health check
- **Fix:** Added routes in App.jsx rendering OwnerDashboard (protected by OWNER_ROLES), added to ROUTE_MANIFEST. OwnerDashboard now reads `?tab=` query param for initial active tab. QuickActions now properly shows Contracts and Leads items.

## 7. WebSocket cleanup (Item 26)

- **Problem:** WebSocket connections persisted after component unmount; cleanup didn't nullify all event handlers
- **Fix:** All 4 WebSocket usage sites (CallInterface, FloatingAssistant, ChatInterface, notificationsRealtime) now nullify ALL handlers (onopen/onmessage/onerror/onclose) before close in useEffect cleanup. FloatingAssistant also handles CONNECTING readyState on disconnect.

## 8. Unnecessary re-renders verification (Item 27)

- **Problem:** Audit flagged low-severity re-render concern in AdminPanel.jsx and SearchResults.jsx
- **Verdict:** Already well-memoized — AdminPanel has 38+ useMemo/useCallback calls, SearchResults has 16+. No changes needed.

## 9. Test coverage clarification (Item 28)

- **Problem:** Audit reported minimal test coverage based on `src/pages/__tests__/` (now-deleted single file)
- **Verdict:** Actual test suite lives in `tests/` with 50+ unit tests (Jest + RTL) and 10+ integration tests — comprehensive coverage already exists. No changes needed.

## 12. Feed page scroll doesn't work inside content area

- **Problem:** Mouse wheel scroll works outside feed panels (sidebar/main) but not inside them. Lenis smooth-scrolls the page when over background, but over the panels nothing scrolls.
- **Root cause (initial):** `data-lenis-prevent={true}` was present unconditionally on both panels. On small screens the panels aren't constrained to a fixed height (no `overflow-y-auto` for scrollable content), so `data-lenis-prevent` blocked Lenis from scrolling the page while the panels couldn't scroll natively — a dead zone.
- **Root cause (primary):** The flex height chain is broken. MainFeed's `flex-1` classes (lines 735, 740, 741) require every ancestor in the chain to also have a defined height (via `flex-1` in a flex container). The break was at two points: (1) `.app-shell` used `min-h-[125vh]` (CAN grow with content → no defined height), and (2) `<main>` in App.jsx was not a flex container, and `<motion.div>` wrapping routes had no height class — so `flex-1` on MainFeed's outer div was a no-op. Without a constrained height, panels grew to fit content instead of overflowing with a scrollbar.
- **Fix (MainFeed.jsx - previous):** Added `isLargeScreen` state + `resize` listener. Changed to `data-lenis-prevent={isLargeScreen ? true : undefined}` on both panels. On large screens Lenis delegates to native panel scroll; on smaller screens Lenis scrolls the page normally.
- **Fix (App.jsx - current):** Three changes to propagate a defined height through the flex chain:
  1. Conditionally added `h-screen` to `.app-shell` when `location.pathname === "/feed"` — fixes height to viewport on the feed route (non-feed routes keep `min-h-[125vh]`, growable).
  2. Added `flex flex-col` to `<main>` (App.jsx line 400) — makes it a flex container so its child chain gets constrained height.
  3. Added `className="flex min-h-0 flex-1 flex-col"` to `<motion.div>` (line 414) — fills `<main>`'s height and acts as a flex container for route content. Non-MainFeed pages don't have `flex-1` on their root, so they sit at natural height within the container (no stretching).

## 13. CyberpunkCursor disabled by default, keyboard-activated

- **Problem:** Custom cursor always showed, hiding the native cursor. No way to disable it without editing code.
- **Fix (`CyberpunkCursor.jsx`):**
  - Added `[enabled, setEnabled]` state (default false).
  - Keyboard detection `useEffect`: listens for `keydown` globally, builds a sliding buffer of keystrokes. When disabled watches for `"activate cursor"` (15 chars), when enabled watches for `"disable cursor"` (14 chars). Ignores auto-repeat, modifier combos, and non-character keys. Listener is cleaned up on each state change.
  - Cursor setup `useEffect`: wrapped in `if (!enabled) return` so nothing runs (no canvas, no mouse listeners, no `body.style.cursor = "none"`) until activated. Cleanup auto-tears down everything when disabled.
  - JSX: cursor elements (`<canvas>`, `<div>` refs) only render when `enabled` is true.

## 14. Realtime log system + TUI dashboard

- **Architecture (`server/log/`):**
  - `levels.js` — 6 levels (debug/info/success/warn/error/critical) with ANSI colors + icons; `normalizeLevel` maps legacy values.
  - `categories.js` — 17 sections (Overview → Favorites) with icons + `detectCategory` auto-detection for requests/redis/prisma/assistant/etc.
  - `logHub.js` — central EventEmitter. 50k ring buffer, per-level/per-category counters, per-second rate + 60-slot sparkline, duplicate grouping, bookmarks, pinning, ignore patterns, request-flow tracker, session recorder. **Run parser plugins on every emit.**
  - `parsers.js` — plugin registry (`registerParser`/`unregisterParser`/`runParsers`) to transform/annotate entries. Kept separate from `burst.js` to avoid a circular import.
  - `search.js` — smart query DSL (bare level/category, `user:`, `role:`, `path:`, `regex:/…/`, `stack`, `json`, `today`, `5m`, `-exclude`, `from:`/`to:`).
  - `burst.js` — `summarizeBurst` AI-style summary of recent error/critical spikes (top files/sources/messages). **Takes `entries` as a param** (never imports logHub — breaks the cycle).
  - `format.js` — neon ANSI console formatting (gradient headers, level colors, boxes).
  - `transport.js` — `/ws/logs` live stream (snapshot/entry/stats/group/burst/clear/record/request_flow/heatmap) + REST `/api/logs/live|stats|query|heatmap|burst|export|bookmarks|bookmark|session/start|session/stop`.
- **Server wiring:** `server.js` upgrades `noServer` routing so assistant WS and `/ws/logs` coexist; the hub captures `uncaughtException`/`unhandledRejection`. `logController` accepts `{level,message,data,user,url,stack}` or `{batch:[...]}`, stamps pubip/user-id/role. `server/utils/logger.js` keeps `logInfo/logWarn/logError` API + adds `logDebug/logSuccess/logCritical`. Frontend `src/lib/logger.js` batches + forwards structured entries.
- **TUI (`server/tui/`, run `npm run logs`):** blessed (via `neo-blessed` alias) neon dashboard. Widgets: theme, effects (gradients via `gradient-string`, `roundedBorder`, `pulseColor`/`glowFrames` glow animation, animate), **runtime themes** (`theme.js` THEMES subzero/amber/magenta/emerald + glow-intensity control, picker overlay `C-g`), logList (click/hover/dblclick/rclick/wheel, **shift+wheel horizontal scroll**, **smooth eased wheel scroll**, **left-click toggles grouped rows ▼/▶**, neon pulse + fade-in on new arrivals, animated pulsing electric-blue selected glow), inspector (**roundedBorder**, collapsible/foldable stack trace, searchable JSON `?` with highlighted matches, copy-field on click `y`, Metadata/JSON/Stack/Raw/Flow/Diff tabs, **flow tab is a Chrome-DevTools-style waterfall** with per-step bars + elapsed offset + total), sidebar (icons, unread badges, burst alert, roundedBorder), filterBar (**level + category chips** REQ/SYSLOG/REDIS/WORKER/AUTH/ASSISTANT/IMAGE/PRISMA, click-to-toggle, **+ toolbar actions: Regex/Time/Export/Pause/Follow/Bkmk**), **animated 2-layer statusBar with breathing/pulsing LIVE ● dot** (total, rate, err/warn/crit, req/s, cpu/ram sampled from OS, redis, queue, workers, latency, dropped, filtered, regexHits, uptime + neon sparklines), contextMenu (copy/copy JSON/copy stack/**open source**/bookmark/pin/ignore/highlight similar/request flow/diff/record session/export), overlays (Notifications **with slide-in animation**, Diff, RegexTester **with worker-offloaded full-stream scan**, **SessionRecorder with Stop/Replay UI**, Bookmarks, Workspaces, **ThemePicker**), panels (Metrics **+Redis/Workers/Queue/Dropped/Filtered/Regex counters**, Timeline/Heatmap/**LatencyHistogram** — histogram fed by real backend bucket data, timeline bars & histogram buckets are clickable), tabs (HubTabs multi-server tab bar + time-travel scrubber `V`), workspace (save/load layout + category via `saveState`/`loadState` to `~/.tcs-hub/ws.json`), workerPool + parseWorker (worker-threads offload for JSON colorize + regex scan, wired to RegexTester), wsClient (auto-reconnect), app (`j/k` nav, `?` search, `space` pause, `f` follow, `c`/`C-c` copy, `d` diff, `b`/`B` bookmark list, `e` ignore, `y` copy field, `r` regex, `m/t/h/l` panels, `s`/`S` save/list workspace, `C-t` add server, `V` time-travel, `C-g` theme picker, `C-f` filter, `Tab` focus-next, `1-9`/`C-1-9` sections, `?` help, `C-q` quit, `g` grouping).
- **Search DSL (`server/log/search.js`):** supports `error`, `redis`, `JWT`, `user:24`, `role:admin`, `request:abc123`, `path:`, `regex:/…/` (slash-stripped), `stack`, `json`, `bookmarked`, `pinned`, `today`, bare `5m`/`2h`/`1d` time windows, `from:`/`to:`, `-exclude` terms. `highlightTerms()` extracts plain terms + regex for instant highlighting across multi-term queries.
- **Backend stats enrichment:** `logHub.getStats()` computes `avgLatency` + `p50/p95/p99` percentiles from recent entry `duration_ms`, emits a **9-bucket latency `histogram`** + `latencies[]` array, and exposes `workers/workQ/redis/regexHits` via `logHub.setRuntimeMetrics()`; `server.js` polls redis status into the hub every 5s.
- **IMPORTANT blessed tooling caveat:** `blessed` is installed as an alias of `neo-blessed@0.2.0` (`"blessed": "npm:neo-blessed@0.2.0"` in package.json), so blessed-contrib and the TUI share one instance. **Always `import from "blessed"` in TUI code — never `"neo-blessed"`.** The `package-lock.json` was regenerated during this fix.
- **Running the dev server:** boot `node server/server.js` (takes ~20-30s cold start), then `npm run logs`. The TUI needs Node 22+ with global `WebSocket` (TUI only); the backend always uses the `ws` package.
- **Auto-launch:** the server now auto-launches the log TUI in a fresh terminal window once `server.listen` fires (`maybeAutoLaunchLogTui()` in `server/server.js`, called in the `listen` callback). Windows spawns `cmd /c start "" cmd /k <bat>` where the bat (`%TEMP%\gartex-log-tui.cmd`, regenerated each boot) does `mode con cols=220 lines=55`, `cd /d <root>`, sets `LOG_WS_URL=ws://localhost:<PORT>/ws/logs`, then runs `node "<root>\server\tui\index.js"`. macOS uses `osascript` + Terminal; Linux tries `x-terminal-emulator|gnome-terminal|konsole|xfce4-terminal` and falls back to a detached `node`. **Opt-out:** `LOG_TUI_AUTO=0|false|off` (or `LOG_QUIET=1`) disables; in `NODE_ENV=production` it stays off unless `LOG_TUI_AUTO=1|true|on`. **Gotchas:** pass the bat path to `cmd /c start` UNQUOTED in the spawn args — embedding quotes causes Node to escape them to `\"` which cmd's `start` mis-parses and the bat silently never runs.

## 15. Request flow + latency stats were dead (no structured request data)

- **Problem:** The request-flow tracker (`logHub.byRequest`), the latency histogram, and `avgLatency/p50/p95/p99` were always empty/zero. `middleware/requestLogger.js` generated a `request_id` + `duration_ms` but discarded them into a colored console string via `formatEventLog`, so `entry.request_id`/`meta.duration_ms` never existed. Request Flow tab always showed "No request flow captured".
- **Fix (`server/utils/logger.js`):** `emit()` now recognizes a `data._console` field — a pre-rendered colored line is used only for the pretty console output and is **stripped** from the stored entry, while the rest of the structured object flows into `entry.data`/`extractMeta()`.
- **Fix (`server/middleware/requestLogger.js`):** request start/end/timeout/aborted + `/api/events` now log structured `{request_id, method, path, status, duration_ms, response_bytes, user_id, role, ip, event, _console}`. This feeds `logHub.byRequest` (flow waterfall) and the latency histogram/percentiles.
- **Fix (`server/tui/inspector.js`):** `_renderFlow` read the wrong field (`s.meta.elapsed_ms` instead of `duration_ms`) producing NaN bars — now reads `meta?.duration_ms ?? data?.duration_ms ?? duration_ms` and guards non-finite.

## 16. TUI/backend polish pass

- **Multi-server tabs were cosmetic** — `switchServer` only changed the active-tab label. Fix (`server/tui/app.js`): it now re-points `client.url`, closes + reconnects the WS, and clears entries so each tab streams from its own backend.
- **Parser plugin architecture was a no-op** — `registerParser` was never called. New `server/log/builtinParsers.js` registers auth/latency/syslog annotators, wired via a side-effect import in `logHub.js`. `registerParser()` remains public for custom plugins.
- **Burst summaries were never surfaced** — `store.on("burst")` in `app.js` now pushes the AI summary sentence (`"8 errors (100%) · 63% originate from prismaService.js:71 …"`) through the slide-in notification; notification click is guarded for summary stubs (no `id`).
- **Burst under-reported grouped repeats** — repeated messages are deduped into one buffer entry with `groupCount:1`. Fixes: `_maybeGroup` keeps the canonical entry's `groupCount` live (so snapshots/query/burst see real counts), and `burst.js` `analyzeEntries` weights totals/sources/files/messages by `groupCount`.
- **`minEvents` was not echoed** — `summarizeBurst` (empty + full results) now includes `minEvents`, so the TUI's `summary.minEvents ?? 3` threshold agrees with the backend.
- **Histogram buckets 8 → 9** — `logHub.getStats()` edge list now `[1,5,10,50,100,500,1000,2000]` (9 buckets); `panels.js` `_labels` + `_labelFor` aligned (`<2000ms`/`>2s`).
- **Status/limit caveats:** `workers`/`workQ`/`regexHits` remain 0 unless `setRuntimeMetrics()` is fed real numbers (only redis is currently polled). The request flow currently shows start/end/timeout steps from the middleware; deeper per-step capture (JWT decoded/Validation/OpenAI/Response) requires those code paths to log with `request_id` + `duration_ms`.

## 17. TUI display corruption + "content not showing until you select text"

- **Problem:** log rows showed merged/missing characters ("REDIS_SE_URL", "Found uuses"), some content stayed blank until a mouse-select forced a repaint, and panels had square borders.
- **Root causes (Windows blessed):**
  1. Blessed silently disables `fullUnicode` when it can't detect terminal unicode (`screen.js`: `fullUnicode = options.fullUnicode && this._unicode`). With it off, wide chars (emoji level icons) are counted as 1 column → diff rendering misaligns → merged/stale cells. **Fix:** `forceUnicode: true` in `app.js` `blessed.screen({...})` forces the unicode path.
  2. `smartCSR: true` uses scroll-region optimization Windows Terminal renders badly → stale regions until a mouse event. **Fix:** `smartCSR: false`.
  3. Animation loops (`statusBar` breathe 120ms + `logList` glow 100ms) flooded the terminal with full renders → dropped frames. **Fix:** throttled to 400ms / 250ms.
- **Auto-launched window too small:** the default cmd window (~104 cols) left the log list ~30 cols wide, truncating messages to ~10 chars while the 50-col inspector sat empty. **Fix:** launcher bat (`server/server.js`) now runs `mode con cols=220 lines=55` before `node`.
- **Panel widths:** `_restoreLayout` updated `this.panelSize` but never applied it to the boxes (latent bug). It now clamps sidebar to ≤25% and inspector to ≤40% of screen width on narrow windows and calls `layoutPanels()`.
- **Status bar:** duplicate "● LIVE LIVE" removed; `cpu` now sampled from `os.cpus()` deltas on Windows (loadavg is always 0 there).
- **Borders:** `roundedBorder()` in `effects.js` declared `ROUNDED.chars` but never used them — now spreads them so panels render rounded (╭╮╰╯). `LogList` gained a rounded border + " 📜 live logs " label (matches the Inspector/Sidebar); with the border present, the existing `width-2`/`height-2`/`left-1` content math is now correct and mouse hit-testing lines up.
- **Gotcha:** the auto-launch log line uses `->` instead of `→` — cmd's OEM code page mangles the arrow into a 0x1A control char that then pollutes the stored entry.

## 18. `--mode-more-cool` (-mmc) flag + real-data wiring

- **Feature:** `node server/tui/index.js --mode-more-cool` (aliases `-mmc`, `--mmc`, `-cool`) enables max-neon mode: `setGlowIntensity(80)`, an electric border-pulse animation cycling all 5 panel borders through `pulseColor(COLORS.selected)` every 180ms (`_startBorderPulse` in `app.js`), faster animation ticks (topbar 400→250ms, statusBar 400→250ms, logList glow 250→150ms via `animMs` constructor option), a `✦ COOL` badge on the topbar, and a startup flash banner. All other runs are byte-for-byte the default look.
- **Real data — connection state:** topbar `SERVER ONLINE/OFFLINE` pill is now driven by the WS client (`connected`/`disconnected`/`error` → `topbar.setOnline`), not hardcoded `online: true`. `bindClient` also refreshes the sidebar footer on every connect/disconnect.
- **Real data — sidebar footer:** the hardcoded `"3 sources · 2 parsers · 1 live stream"` was replaced by `sidebar.setLiveInfo({sources, parsers, live})` fed from `servers.size`, `parserCount()` (new export in `server/log/parsers.js`), and `client.connected`.
- **Real data — workers/queue metrics:** `workers`/`workQ` in the status bar/metrics panel were permanently 0. `server.js` now tracks actually-started workers (`markWorker` at the syslog/esign/video/image queue start sites) and every 5s sums live queue depths via new `queueDepth()` exports in `server/services/videoQueue.js`, `imageQueue.js`, `esignRetryService.js`, fed through `logHub.setRuntimeMetrics({workers, workQ})` alongside the existing redis poll.
- **Snapshot bookmarks:** the WS snapshot now carries the server-side bookmark set and the TUI marks loaded entries `bookmarked` so ★ badges survive a reconnect. Dead code removed in `app.js handleNewEntry`.

## 20. Marketplace identity + free-plan agent rules (Oct 2026)

- **Company, not person, is the public identity.** `normalizeFeedItem` (`src/pages/MainFeed.jsx`) falls back to rolePath `"profile"` so owner/admin/member posts resolve to a real route instead of a dead link; author names prefer `organization_name`/`company_name` over the account name.
- **`/users/lookup` is public-shaped.** `shapeLookupUser`/`lookupPublicUsers` (`server/services/userService.js`) strip `email`, `username`, and `profile.phone` for strangers; self, platform admin/owner, and same-org members keep them. `capacity` (owner-declared `profile.capacity`, agent count as fallback) is public.
- **Permission matrix is never premium-locked.** The three `ensureEntitlement("team_access_management")` gates in `server/controllers/memberController.js` were removed; free is bounded only by the 3-seat cap. `canTeamAccess = true` in `src/pages/MemberManagement.jsx`.
- **Free agent limit is 3** across `memberService.js`, `entitlementService.js`, `adminConfigService.js` (`plan_limits.free.agent_limit`), `MemberManagement.jsx` fallback, `Pricing.jsx` copy, `docs/server/Member.md`. Stored config overrides the default, so run `npm run db:backfill:free-agent-limit` once against any existing DB.
- **`owner`/`admin` were missing from `PREMIUM_FEATURES_BY_ROLE`.** They now share `COMPANY_MANAGEMENT_FEATURES`; previously a premium owner got an empty feature map and could never pass the entitlement check.

## 21. Repo hygiene traps (learned the hard way)

- **`.husky/pre-commit` used to run `biome check --write .`** across all 753 files, rewrote ~600 of them, then `git add -u` staged the churn. It now lints only staged files. Do not reintroduce a repo-wide `--write`.
- **`.env` was git-tracked**, so any secret pasted there would be committed. It has been untracked (`git rm --cached .env`); keep secrets in local `.env` only and declare new names in `.env.example`.
- **Never `git checkout -- .` to undo a bad auto-format** — it reverts your own uncommitted work too. `git stash` first, or restore only the files you did not touch.
- **Brevo SMTP is IP-locked** (`525 5.7.1 Unauthorized IP address`) and unusable from Render. Use the Brevo HTTP API with `BREVO_API_KEY` instead; verified working (HTTP 201).
