# Buyer Final Directives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement buyer's locked Sept 26–Oct 1 directives: trim Settings to 3 sections, move org controls into OwnerDashboard, unify profile destination, fix video bug batch.

**Architecture:** No new backend. Relocate existing OrgSettings sections via an `initialTab` prop + embedded rendering in OwnerDashboard; trim standalone TABS when not embedded; add Boost details page reusing POST /boosts; small NavBar/homepage/search fixes.

**Tech Stack:** React 19, react-router-dom, Tailwind 4, lucide-react, existing apiRequest helpers.

## Global Constraints

- Nothing deleted without buyer instruction; every removed tab's content either moves or is buyer-dropped (boosts tab, privacy tab, members tab, subscription tab).
- `npm run build` (vite) must pass after all tasks.
- Mobile-friendly preserved on every touched layout.

---

### Task 1: NavBar bottom Settings entry

**Files:**
- Modify: `src/components/NavBar.jsx:163-175` (Support group), `src/components/NavBar.jsx:1093-1109` (mobile footer)

**Interfaces:**
- Consumes: existing `/org-settings` route (App.jsx)
- Produces: Settings nav item → `/org-settings` (default tab profile)

- [ ] **Step 1: Append Settings to Support group**
```jsx
{ to: "/org-settings", label: "Settings" },
```
after Onboarding item (~line 173).
- [ ] **Step 2: Add Settings to mobile drawer footer** before theme toggle (~line 1093): same link with Settings icon.
- [ ] **Step 3: Verify** `npm run build` passes; visually check menu order.

### Task 2: OrgSettings — initialTab prop + standalone trim

**Files:**
- Modify: `src/pages/OrgSettings.jsx:223-240` (TABS), `:242-287` (initialTab/accessibleTabs)

**Interfaces:**
- Consumes: `?settingsTab=` param (embedded), new `initialTab` prop
- Produces: standalone shows profile/theme/security/notifications/verification; embedded shows all

- [ ] **Step 1: Add prop** `export default function OrgSettings({ embedded = false, initialTabProp = "" })` and use it as fallback: `searchParams.get(tabParamName) || initialTabProp || "general"`, default `"general"` → `"profile"`.
- [ ] **Step 2: Trim standalone TABS**: `const VISIBLE_TABS = embedded ? TABS : TABS.filter(t => ["profile","theme","security","notifications","verification"].includes(t.id))` and use VISIBLE_TABS in accessibleTabs + initialTab check.
- [ ] **Step 3: Verify** build passes; route `/org-settings` shows 5 tabs.

### Task 3: OwnerDashboard — Automation/Assistant/Branding panels + Billing rename

**Files:**
- Modify: `src/pages/OwnerDashboard.jsx:169-182` (menuItems), panels area `:1063-1216`, subscription title `:1163`

**Interfaces:**
- Consumes: `OrgSettings embedded + initialTabProp` from Task 2
- Produces: menu tabs automation/assistant/branding; "Subscription & Billing" title

- [ ] **Step 1: Add menuItems** `automation/Automation`, `assistant/Assistant`, `branding/Branding` after settings.
- [ ] **Step 2: Add panels** rendering `<OrgSettings embedded={true} initialTabProp="general"|"assistant_knowledge"|"branding" />` for each.
- [ ] **Step 3: Rename** subscription panel title to `Subscription & Billing`.
- [ ] **Step 4: Verify** build passes; each tab renders.

### Task 4: Boosts — drop tab, per-post Boost button + Details page

**Files:**
- Modify: `src/pages/OrgSettings.jsx:233` (remove boosts tab def — keep panel harmless or remove with its state), `src/components/feed/FeedItemCard.jsx:170-178` (add button), `src/App.jsx` (add route)
- Create: `src/pages/BoostDetailsPage.jsx` (package select + POST /boosts + existing list, reuse OrgSettings boosts logic)
- Test: manual route visit `/boosts/:id`

**Interfaces:**
- Consumes: `POST /boosts`, `GET /boosts` (existing)
- Produces: `/boosts/:id` route; Boost button on boosted-eligible cards

- [ ] **Step 1: Boost button** in FeedItemCard next to Boosted badge → `<Link to={/boosts/${item.id}}>Boost</Link>`.
- [ ] **Step 2: Create BoostDetailsPage.jsx** (boost packages + create form + existing boosts for the item).
- [ ] **Step 3: Route** `/boosts/:id` in App.jsx (protected).
- [ ] **Step 4: Remove boosts tab** from TABS (panel + state may remain dead or be removed; prefer removal of tab def only to limit blast radius).
- [ ] **Step 5: Verify** build passes; visit page.

### Task 5: Org name policy (90-day lock + verified re-upload)

**Files:**
- Modify: supplier/org name field (locate: OrgSettings Supplier Profile `:1797` or profile `Profile Section` `:1855` — implement at whichever edits org display name)

**Interfaces:**
- Consumes: profile/org GET (existing), verification route
- Produces: lock message + disabled field within policy window; verified → link to re-upload docs

- [ ] **Step 1: Locate** org-name input and its last-updated source field.
- [ ] **Step 2: Implement** 90-day disable + message (normal); verified role → replace with "re-upload documents" CTA → `/verification`.
- [ ] **Step 3: Verify** build passes. (Full server-side enforcement = follow-up.)

### Task 6: Single profile destination

**Files:**
- Modify: `src/components/NavBar.jsx:84` (My Profile link)

**Interfaces:**
- Consumes: `getCurrentUser()` (role + id)
- Produces: My Profile → `/factory/:id` | `/buyer/:id` | fallback `/profile/:id`

- [ ] **Step 1: Compute** public URL from current user role/id in NavBar.
- [ ] **Step 2: Replace** `to: "/org-settings?tab=profile"` with computed URL (desktop + mobile render paths).
- [ ] **Step 3: Verify** public pages link back to edit (`/org-settings?tab=profile` present in FactoryProfile/BuyerProfile); build passes.

### Task 7: Profile tab cleanup (privacy strip, dedupe security)

**Files:**
- Modify: `src/pages/OrgSettings.jsx:1853-2154` (profile tab blocks)

**Interfaces:**
- Consumes: nothing new
- Produces: Profile Section + top privacy notice; Contact & Privacy trimmed to contact display; Password & Security block removed (lives in security tab)

- [ ] **Step 1: Add** privacy notice strip atop profile tab (privacy managed at top of profile, details exist elsewhere — no duplicate controls).
- [ ] **Step 2: Trim** Contact & Privacy → contact display only.
- [ ] **Step 3: Remove** Password & Security block from profile tab.
- [ ] **Step 4: Verify** build passes; mobile layout intact.

### Task 8: Client-exposure audit (agent/chatbot/permission endpoints)

**Files:**
- Read: `server/routes/*chatbot*`, `*agent*`, `*member*`, `server/middleware/auth.js`, `entitlements.js`
- Modify: any route missing owner/admin guard

- [ ] **Step 1: List** chatbot/agent/member-mutation endpoints + their guards.
- [ ] **Step 2: Add** owner/admin guard where client-reachable without it.
- [ ] **Step 3: Run** `npm run test:unit` subset (auth/entitlement tests) + build.

### Task 9: Video bug batch

**Files:**
- Modify: `src/pages/TexHub.jsx:858,885-902` (link hero items), `src/pages/HelpCenter.jsx` (fix search), contact email in `Footer.jsx:163-170`, `NavBar.jsx:75,167`, `HelpCenter.jsx:982`, `Privacy.jsx:140`

- [ ] **Step 1: Homepage links** — wrap buyer-request item → `/feed`, factories item → `/search`.
- [ ] **Step 2: HelpCenter search** — diagnose (faqQuery filter vs API) and fix "No suggestions".
- [ ] **Step 3: Email swap** → `gartexhubsupport@gmail.com` (5 files).
- [ ] **Step 4: Verify** build passes. (Light-mode buttons + toggles already verified OK; logo blocked on assets; slow scroll = follow-up.)

## Self-Review

- Spec coverage: directives 1-9 mapped (1→T1, 2→T6/T7, 3→T5, 4→T2/A3, 5→T3, 6→T4, 7→T5, 8→T3, video→T9, exposure→T8, logo blocked, email→T9).
- No placeholders: each step names exact files/lines.
- Type consistency: `initialTabProp` string prop used in T2+T3.
