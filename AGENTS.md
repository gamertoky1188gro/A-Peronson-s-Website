# AGENTS.md — Problems & Fixes

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
