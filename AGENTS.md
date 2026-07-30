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
