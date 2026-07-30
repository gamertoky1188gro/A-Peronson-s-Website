# Commit 0637 — d581aa0bdaff

| Field | Value |
|-------|-------|
| **Commit Number** | 0637 |
| **Commit Hash** | d581aa0bdaffd33013f004da00b24d791ce2ae88 |
| **Parent Hash** | fe656b4c52a54d1e637281d16ed7d23dd14f709a |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-31 00:24:57 |
| **Branch** | main |
| **Files Changed** | 172 |
| **Additions** | 3,448 |
| **Deletions** | 1,143 |
| **Net Change** | +2,305 |
| **Merge Commit** | No |

## Restore Corrupted Component, Fix Prisma Schema, Enforce Video Calls

A large mixed-content commit touching 172 files. The primary focus: restoring the corrupted `BuyerRequestManagement.jsx` (missing imports, stubbed functions were replaced with actual implementations), adding video call enforcement to messaging and contract signing flows, extending the Prisma schema with new Requirement fields, and adding several new server services, routes, controllers, and UI components. Also includes a major MainFeed refactor, CyberpunkCursor updates, NavBar navigation simplification, and a full dist/ rebuild.

## Files Changed

| Category | Files | Δ | Description |
|----------|-------|---|-------------|
| `dist/assets/*` | 80+ | +319/−319 | Rebuilt bundles with new content hashes |
| `src/pages/BuyerRequestManagement.jsx` | 1 | +241/−15 | **Major restore** — replaced stubs with full implementations |
| `src/pages/MainFeed.jsx` | 1 | +182/−47 | **Major refactor** — infinite loop fix, mobile sidebar, scroll fixes |
| `src/pages/OwnerDashboard.jsx` | 1 | +54/−17 | Owner dashboard improvements |
| `src/pages/AdminPanel.jsx` | 1 | +33/−16 | Admin panel updates |
| `src/pages/NavBar.jsx` | 1 | +113/−106 | NavBar simplification (remove hover dropdown, touch device detection) |
| `src/pages/OrgSettings.jsx` | 1 | +64/−43 | Settings page updates |
| `src/lib/auth.js` | 1 | +8 | Added `loadUserFromStorage` fallback in `getCurrentUser()` |
| `src/lib/ThemeProvider.jsx` | 1 | +13/−2 | Theme provider updates |
| `src/components/ui/CyberpunkCursor.jsx` | 1 | +53/−3 | Keyboard-activated cursor (type "activate cursor" to enable) |
| `src/components/ui/NavDropdown.jsx` | 1 | +201/−121 | Simplified dropdown behavior |
| `src/components/Footer.jsx` | 1 | +6/−4 | Footer nav role gating |
| `src/components/admin/PaymentProofReviewModal.jsx` | 1 | +204 | **New** — payment proof review modal for admin |
| `src/components/analytics/ConversionFunnel.jsx` | 1 | +61 | **New** — conversion funnel visualization |
| `src/components/analytics/CoreMetricsCards.jsx` | 1 | +95 | **New** — core metrics display cards |
| `src/hooks/useCoreMetrics.js` | 1 | +42 | **New** — core metrics data hook |
| `src/pages/admin/sections/AdminFinanceSection.jsx` | 1 | +226 | **New** — admin finance management section |
| `server/services/callSessionService.js` | 1 | +29 | **New**: `hasCompletedCallByMatch`, `hasCompletedCallBetweenUsers` |
| `server/services/documentService.js` | 1 | +13 | Video call enforcement before contract signing |
| `server/services/messageService.js` | 1 | +13 | Video call enforcement before messaging |
| `server/services/userService.js` | 1 | +108 | User service expansion |
| `server/services/analyticsService.js` | 1 | +122 | **New** — analytics service for admin finance metrics |
| `server/services/productService.js` | 1 | +73/−34 | Product service updates |
| `server/services/aiModerationService.js` | 1 | +34 | **New** — AI content moderation service |
| `server/services/feedPostService.js` | 1 | +23 | Feed post service updates |
| `server/controllers/userController.js` | 1 | +179 | **New** — user management endpoints |
| `server/controllers/analyticsController.js` | 1 | +10 | Analytics endpoint additions |
| `server/controllers/feedUploadController.js` | 1 | +42/−13 | Feed upload controller updates |
| `server/controllers/supportController.js` | 1 | +16 | Support controller updates |
| `server/routes/userRoutes.js` | 1 | +18 | **New** — user management routes |
| `server/routes/analyticsRoutes.js` | 1 | +7 | Analytics route additions |
| `server/routes/supportRoutes.js` | 1 | +2 | Support route updates |
| `prisma/schema.prisma` | 1 | +5 | New Requirement fields (currency, price ranges) |
| `PythonAi/HaramDetection/` | 10+ | +300/−50 | Python AI detection updates |
| `AGENTS.md` | 1 | +37 | Documentation: MainFeed loop fix, scroll fix, cursor activation |
| `src/tailwind.css` | 1 | +8 | New scrollbar-invisible utility class |

## Detailed Diff Analysis

### BuyerRequestManagement.jsx Restoration (+241/−15)

The `class`→`className` migration in commits 0631-0632 left `BuyerRequestManagement.jsx` corrupted. The file's implementation functions (`formToPayload`, `requirementToForm`, component body) were replaced with stubs containing only parameter names and empty bodies/comments. This commit restores the original implementation from commit `943b34e4` (the known-good version from June 2).

Restored code includes:
- **`EMPTY_FORM` constant**: Full 60+ field form definition restored (was truncated to just `requestType: ""` with a `// ...` comment)
- **`formToPayload()`**: Full implementation mapping form state to API payload with fields like `request_type`, `title`, `industry`, `category`, `product`, `quantity`, `price_range`, `incoterms`, `payment_terms`, `material`, `fabric_gsm`, `size_range`, `color_pantone`, `custom_description`, and 20+ more fields
- **`requirementToForm()`**: Full implementation converting API response back to form state, including spec field extraction for all textile/garment fields
- **Missing imports**: Added `NeonAtom`, `WordCount`, `ScrollReveal`, `UploadProgressBar`, `Link`, `AnimatePresence`, `motion`, all required lucide-react icons, `ThreeDot`, `apiRequest`, `getCurrentUser`, `getToken`, `hasEntitlement`, `useSecureUser`, `useEntitlements`, `mapExtractedToForm`, `useTheme`, all validation functions, `logger`, `uploadFile`

### MainFeed.jsx Refactor (+182/−47)

Major refactoring to fix the infinite re-render loop (documented in AGENTS.md item 10):

1. **`liveRef` pattern**: Added a `useRef` that stores latest state values each render. Both `loadUser` and `loadFeedPage` read from `liveRef.current` instead of closure-captured state, preventing callback identity changes on every render.

2. **Stable callbacks**: `loadUser` deps changed from `[token, markLoaded]` to `[markLoaded]`. `loadFeedPage` deps changed from `[activeCategory, activeType, token, unique, user?.role, feedConfig, nextCursor, markLoaded]` to `[markLoaded]` — both never change reference.

3. **`setNextCursorBoth`**: New pattern decoupling cursor state from the callback deps — uses both `setNextCursor` state and `nextCursorRef` ref.

4. **`markLoaded`**: Converted from plain function to `useCallback` with `[]` deps.

5. **Feed effect deps**: Changed from `[loadFeedPage]` to `[loadFeedPage, activeCategory, activeType, unique, feedConfig]` — triggers on filter changes without callback cascade.

6. **Config effect**: Added cancellation flag to prevent state updates after unmount.

7. **Screen-size detection**: Added `isLargeScreen` state with resize listener for responsive layout.

8. **Mobile sidebar**: Added hamburger menu, slide-out drawer with sidebar content (user info, quick actions, search, categories).

9. **Scroll fixes**: Added `data-lenis-prevent={isLargeScreen ? true : undefined}` on both panels, added `scrollbar-invisible` class, changed sidebar from `hidden` to flex on large screens.

### NavBar Navigation Simplification (+113/−106)

- Removed hover-based dropdown behavior (touch device detection, timeout-based leave handler)
- Changed dropdown to toggle on click (simpler UX, works on both touch and desktop)
- Changed handleSetDropdown to toggle instead of always open
- Changed click-outside handler from touch-only to universal (`mousedown`)
- Removed `isTouchDevice` state and related `useEffect`
- Converted Support link from `/support` to `mailto:gartexhub@gmail.com` external link
- Added external link support in mobile menu (renders `<a>` instead of `<Link>`)

### CyberpunkCursor.jsx — Keyboard-Activated (+53/−3)

Added keyboard detection for cursor activation/deactivation:
- Default state: disabled (native cursor shows normally)
- Buffer-based keystroke detection: listens for "activate cursor" (15 chars) to enable, "disable cursor" (14 chars) to disable
- Ignores auto-repeat, modifier combos, non-character keys
- When disabled: no canvas, no mouse listeners, no `body.style.cursor = "none"`
- Cleanup auto-tears down on state change

### auth.js — User Cache Fix (+8)

In `getCurrentUser()`, added fallback to `loadUserFromStorage()` when in-memory `cachedUser` is cold. This ensures `ProtectedRoute` gets a valid user on first render after page reload, preventing MainFeed unmount during the auth check.

### Prisma Schema — Requirement Fields (+5)

Added new optional fields to the `Requirement` model:
- `currency` (String?)
- `priceOriginalMin` (Float?)
- `priceOriginalMax` (Float?)
- `priceBaseMin` (Float?)
- `priceBaseMax` (Float?)

These complement the existing `priceOriginal`, `currencyOriginal`, and `priceNormalizedBase` fields, providing more granular price range tracking with currency support.

### Video Call Enforcement — Message and Contract Flows (+29/+26)

**`messageService.js`**: In `postMessage()`, added a check before allowing non-friend messages — requires a completed video call between the match participants. Throws `403 VIDEO_CALL_REQUIRED` if no completed call exists.

**`documentService.js`**: In `updateContractSignatures()`, added a check that requires a completed video call between `buyer_id` and `factory_id` before contract signing. Throws `403 VIDEO_CALL_REQUIRED`.

**`callSessionService.js`**: Added two new helper functions:
- `hasCompletedCallByMatch(matchId, userId)` — checks if any completed call exists for a given match, optionally filtered by user participation
- `hasCompletedCallBetweenUsers(userAId, userBId)` — checks if any completed call exists where both specified users were participants

### New Server Services and Controllers

**`analyticsService.js`** (+122 lines) — Provides core analytics data for the admin finance dashboard. Includes methods for aggregating platform metrics (revenue, active users, transaction volume, conversion rates) using Prisma aggregation queries.

**`userController.js`** (+179 lines) — Comprehensive user management endpoints for admin: listing users with filtering/pagination, user detail retrieval, role management, account status toggling, and user search.

**`analyticsController.js`** (+10 lines) — New endpoints for analytics data retrieval.

**`userRoutes.js`** (+18 lines) — 5 new routes for user management (list, get by ID, update role, toggle status, search).

### New Frontend Components

**`PaymentProofReviewModal.jsx`** (+204 lines) — Admin modal for reviewing payment proof submissions. Displays uploaded documents, verification status, and allows approve/reject actions.

**`ConversionFunnel.jsx`** (+61 lines) — Analytics visualization component using recharts/funnel charts to display conversion rates through the buyer journey.

**`CoreMetricsCards.jsx`** (+95 lines) — Dashboard cards displaying key metrics (total users, active requests, completed contracts, revenue, etc.) with trend indicators.

**`AdminFinanceSection.jsx`** (+226 lines) — New admin panel section for financial management. Includes payment review queue, transaction history, revenue charts, and financial reporting tools.

**`useCoreMetrics.js`** (+42 lines) — Custom hook for fetching and caching core metrics data with automatic refresh.

### AGENTS.md Additions (+37 lines)

Added 4 new documentation entries:
- **Item 10**: MainFeed infinite re-render loop — root cause analysis and fix documentation
- **Item 11**: FloatingAssistant WebSocket "closed before established" — identified as symptom of item 10
- **Item 12**: Feed page scroll doesn't work — root cause (flex height chain break at App.jsx level) and fix
- **Item 13**: CyberpunkCursor disabled by default, keyboard-activated — implementation details

### Other Changes

- **Footer.jsx**: Added role gating to verification and contracts nav links (only show for owner/admin/buying_house/factory roles)
- **OwnerDashboard.jsx**: Updates for new admin sections and corrected navigation
- **AdminPlatformSection.jsx**: Extended with finance-related admin features (+136 lines)
- **Pricing.jsx**: Updated pricing page
- **store/themeSlice.js**: Theme state updates (+29 lines)
- **src/tailwind.css**: Added `.scrollbar-invisible` class for hidden scrollbars across browsers
- **PythonAi/HaramDetection/**: Multiple file updates including new `cli.py` (+266), `html_report.py` (+183), updated `.pyc` bytecode files, and modifications to detection pipeline
- **dist/**: Full rebuild — 80+ chunks regenerated. New chunks: AdminFinanceSection, ConversionFunnel, CoreMetricsCards, PaymentProofReviewModal, useCoreMetrics. Old chunks removed: ChatInterface-Bg_F0FRT.js (152 lines), index-CxkUnG6R.js (319 lines), replaced with new hashed versions.

## Why This Change Was Needed

Several issues accumulated and were addressed in one large save:

1. **BuyerRequestManagement.jsx corruption**: The `class`→`className` migration in commits 0631-0632 accidentally removed/overwrote the file's implementation code, leaving stubs. This commit restores the original from commit `943b34e4`.

2. **MainFeed infinite re-render loop**: A critical bug where the feed page would get stuck in a perpetual loading state due to cascading dependency chains in `useCallback`/`useEffect`. This made the feed unusable.

3. **Video call requirement**: Business logic enforcement requiring a completed video call before messaging (non-friend) and contract signing — a trust-and-safety feature for the marketplace.

4. **Prisma schema extension**: New Requirement price/currency fields for supporting multi-currency pricing with base price normalization.

5. **New admin features**: Finance section, payment proof review, analytics dashboard — expanding the admin tooling.

## Was It Useful

**Highly useful** — This commit fixes critical bugs (MainFeed loop, BuyerRequestManagement stubs, auth cold cache), adds important business logic (video call enforcement), and extends the admin tooling with finance/analytics features. The only downside is the large commit size mixing many concerns, but this appears to be a workspace save of accumulated changes.

## Impact Analysis

- **MainFeed**: Infinite re-render loop fixed — feed now loads correctly and paginates properly
- **BuyerRequestManagement**: Restored from broken (stubs) to fully functional
- **Auth**: Cold cache no longer causes MainFeed unmount on page reload
- **Messaging**: Non-friend messages now require a completed video call first
- **Contract signing**: Requires completed video call between buyer and factory
- **Prisma schema**: Schema migration needed for the 5 new Requirement fields
- **NavBar**: Dropdown behavior changed from hover to click — affects all users' navigation experience
- **Cursor**: Custom cursor now disabled by default; type "activate cursor" to enable — affects users who relied on the custom cursor
- **Admin**: New finance section with payment proof review and analytics
- **Cyberpunk cursor**: Disabled by default, users type "activate cursor" to enable it
- **dist/**: Full rebuild — all chunks updated

## Relationship to Surrounding Commits

This is the final commit (0637) and the largest, coming 3 days after commit 0636 (2026-07-27 → 2026-07-31). It acts as a workspace save consolidating:
- Fixes for regressions introduced by commits 0631-0632 (BuyerRequestManagement corruption)
- Fixes for longstanding bugs (MainFeed infinite loop, auth cold cache, no-op logger — though logger was actually fixed in 0634)
- New features (video call enforcement, admin finance, analytics)
- Documentation updates (AGENTS.md for items 10-13)
- Infrastructure (Prisma schema, Python AI updates, dist rebuild)

The 3-day gap suggests significant offline work that was committed in bulk.

## Confidence Notes

High confidence for most changes — the BuyerRequestManagement restore (verifiable against commit 943b34e4), the liveRef pattern (well-documented in AGENTS.md), the video call enforcement (clear business logic). Moderate confidence for the Python AI updates (binary .pyc changes and new scripts not fully analyzed). The large scope (172 files) makes it difficult to verify every change individually, but the primary changes are clear from the diff.
