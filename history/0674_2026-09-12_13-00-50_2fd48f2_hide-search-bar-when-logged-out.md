# Commit 0674 — 2fd48f2

| Field | Value |
|-------|-------|
| **Commit Number** | 0674 |
| **Commit Hash** | 2fd48f2365a52712b5b2f630beeb0a9ab4def40f |
| **Parent Hash** | d6f154fc91880762ff2e33f26f6660ecf6beb469 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 13:00:50 |
| **Branch** | main |
| **Files Changed** | 46 |
| **Additions** | 55 |
| **Deletions** | 50 |
| **Net Change** | +55/-50 |

## Hide Search Bar When Logged Out

This commit hides the search functionality in NavBar.jsx when no user is logged out. Three changes: (1) the keyboard shortcut listener (`Ctrl+K` / `Cmd+K`) is skipped when `user` is null, (2) the desktop search bar is hidden when `user` is null, and (3) the mobile search button is hidden when `user` is null. The bulk of file changes are dist asset renames from a rebuild.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| dist/assets/About-Brmm3-V3.js | Renamed | 1 | 1 | 0 |
| dist/assets/AccessDenied-KS5V3s2e.js | Renamed | 1 | 1 | 0 |
| dist/assets/AdminGovernance-DrM6Ytbf.js | Renamed | 1 | 1 | 0 |
| dist/assets/AdminPanel-DZL548YR.js | Renamed | 1 | 1 | 0 |
| dist/assets/AgentDashboard-B4OBnUsO.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyerProfile-CpLPCnpF.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyerRequestManagement-DzFLBU4Q.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyingHouseProfile-DvreGc9P.js | Renamed | 1 | 1 | 0 |
| dist/assets/CallInterface-C7wbs277.js | Renamed | 1 | 1 | 0 |
| dist/assets/ChatInterface-B6xi5JMG.js | Renamed | 1 | 1 | 0 |
| dist/assets/FactoryProfile-lZNZK_23.js | Renamed | 1 | 1 | 0 |
| dist/assets/FeedManagement-DNncJvam.js | Renamed | 1 | 1 | 0 |
| dist/assets/FeedbackPage-CI_IxAmZ.js | Renamed | 1 | 1 | 0 |
| dist/assets/HelpCenter-1R6bPj5p.js | Renamed | 1 | 1 | 0 |
| dist/assets/IndustryPage-DmWI_02y.js | Renamed | 1 | 1 | 0 |
| dist/assets/Insights-BT4Yf6fi.js | Renamed | 1 | 1 | 0 |
| dist/assets/JoinRequestPage-Dx_VMchh.js | Renamed | 1 | 1 | 0 |
| dist/assets/JourneyTimeline-pzENQF74.js | Renamed | 1 | 1 | 0 |
| dist/assets/Login-BzjN0ln3.js | Renamed | 1 | 1 | 0 |
| dist/assets/MainFeed-BakWlpds.js | Renamed | 1 | 1 | 0 |
| dist/assets/MemberManagement-DrTD5Kqs.js | Renamed | 1 | 1 | 0 |
| dist/assets/NotificationsCenter-yEvHaRXL.js | Renamed | 1 | 1 | 0 |
| dist/assets/OnboardingPage-C14GERtb.js | Renamed | 1 | 1 | 0 |
| dist/assets/OrgSettings-CYU1lXnJ.js | Renamed | 1 | 1 | 0 |
| dist/assets/OwnerDashboard-xrFNnRxb.js | Renamed | 1 | 1 | 0 |
| dist/assets/PartnerNetwork-D_Wgfeg-.js | Renamed | 1 | 1 | 0 |
| dist/assets/Pricing-CH6ZU1xH.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProductManagement-oEcJ0Fk_.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProfileImageUpload-lFB9CI-S.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProfilePage-CxGdywSS.js | Renamed | 1 | 1 | 0 |
| dist/assets/RatingFeedback-C3PIysAy.js | Renamed | 1 | 1 | 0 |
| dist/assets/ScaleIn-B_lgKHFu.js | Renamed | 1 | 1 | 0 |
| dist/assets/SearchResults-DfHKHSTR.js | Renamed | 1 | 1 | 0 |
| dist/assets/Signup-B5ce_prs.js | Renamed | 1 | 1 | 0 |
| dist/assets/SignupUltra-CVMfjwQL.js | Renamed | 1 | 1 | 0 |
| dist/assets/SupportReports-C0tNTDvs.js | Renamed | 1 | 1 | 0 |
| dist/assets/TaskTracker-DXveMPfp.js | Renamed | 1 | 1 | 0 |
| dist/assets/TexHub-Bu2K2Xid.js | Renamed | 1 | 1 | 0 |
| dist/assets/UploadProgressBar-CBB2wiE6.js | Renamed | 1 | 1 | 0 |
| dist/assets/VerificationPage-BxBjUkdX.js | Renamed | 1 | 1 | 0 |
| dist/assets/VerificationPanel-CsCbVrD8.js | Renamed | 1 | 1 | 0 |
| dist/assets/index-WmvNrHPB.js | Renamed | 12 | 6 | +6 |
| dist/assets/useAnalyticsDashboard-D4oXJpmH.js | Renamed | 1 | 1 | 0 |
| dist/assets/useSecureUser-D9sMbFuF.js | Renamed | 1 | 1 | 0 |
| dist/index.html | Modified | 2 | 1 | +1 |
| src/components/NavBar.jsx | Modified | 5 | 0 | +5 |

## Detailed Diff Analysis

### src/components/NavBar.jsx — Source Changes

**1. Guard keyboard shortcut listener:**
```diff
 useEffect(() => {
+    if (!user) return;
     const handler = (e) => {
         const key = String(e.key || "").toLowerCase();
         if (key !== "k") {
```

When `user` is null (logged out), the `useEffect` returns early, so no keyboard listener is registered. This prevents `Ctrl+K` / `Cmd+K` from triggering search when there's no user to search as.

**2. Hide desktop search bar:**
```diff
 <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
+    {user && (
     <div ref={searchRef} className="relative hidden items-center md:flex">
         {searchExpanded ? (
             ...
         ) : null}
     </div>
+    )}
```

The entire desktop search bar (expanded input + collapsed icon) is conditionally rendered only when `user` exists. This prevents the search UI from appearing when there's no authenticated user.

**3. Hide mobile search button:**
```diff
+    {user && (
     <button
         type="button"
         onClick={() => navigate("/search")}
         className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/70 text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-950/70 dark:text-white md:hidden"
     >
         <Search className="h-5 w-5" />
     </button>
+    )}
```

The mobile search button (visible on `md:hidden`) is conditionally rendered only when `user` exists.

## Why This Change Was Needed

When logged out, users don't have an account or data to search. Showing the search bar is confusing — it suggests there's something to search for when there isn't. Hiding it:
1. Reduces visual clutter on the navbar for logged-out users
2. Avoids confusion about what search would do without authentication
3. Follows the principle of only showing actionable UI elements

The keyboard shortcut guard also prevents a potential error — if `Ctrl+K` triggered search expansion without a user, it could lead to a broken state or an unnecessary API call.

## Was It Useful

Yes — this is a clean UX improvement. The search functionality is only meaningful for authenticated users, so hiding it when logged out is correct. The implementation is simple (conditional rendering) with no complexity.

## Impact Analysis

- **User-facing:** Logged-out users no longer see the search bar or search button; logged-in users see no change
- **Keyboard:** `Ctrl+K` / `Cmd+K` no longer triggers search when logged out
- **Desktop:** Search bar hidden in navbar when logged out
- **Mobile:** Search button hidden in navbar when logged out
- **Risk:** Very low — conditional rendering based on existing `user` state

## Relationship to Surrounding Commits

- **Predecessor (0673):** Removes Contact Sales from About page
- **Successor:** None in this batch (last commit)
- Part of a series of UI refinements responding to user feedback

## Confidence Notes

The implementation is straightforward — three `{user && (...)}` guards. The `user` variable is already available in NavBar.jsx from the auth context. The dist file changes are all hash renames from the rebuild.

## Optional Technical Details

- The `user` variable comes from the auth context (likely `useAuth()` or similar)
- The desktop search bar uses `searchRef` for click-outside detection and `searchExpanded` state for toggle
- The mobile search button navigates to `/search` page instead of expanding inline
- The keyboard handler checks for `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- `e.preventDefault()` is called to prevent the browser's default find-in-page behavior
