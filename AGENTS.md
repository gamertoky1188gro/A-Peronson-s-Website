# AGENTS.md — Problems & Fixes

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
