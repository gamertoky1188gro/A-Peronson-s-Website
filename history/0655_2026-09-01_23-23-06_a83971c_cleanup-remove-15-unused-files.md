# Commit 0655 — a83971c

| Field | Value |
|-------|-------|
| **Commit Number** | 0655 |
| **Commit Hash** | a83971ce35c44f0edbf3911e9c37c008c0d75134 |
| **Parent Hash** | 6323be396eae93cb2bbd2b520f6d95319b32cf17 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-01 23:23:06 |
| **Branch** | main |
| **Files Changed** | 62 |
| **Additions** | 48 |
| **Deletions** | 1944 |
| **Net Change** | +48/-1944 |
| **Merge Commit** | No |

## dead-component-and-orphan-page-cleanup

Massive deletion pass removing 15 source files that were no longer imported or used anywhere in the active codebase. The commit also triggers a full rebuild of the Vite dist bundle, renaming all hashed chunk filenames to reflect the new dependency graph. The overwhelming majority of changes are binary/dist hash renames (52 files), with the real work concentrated in 10 source file deletions that collectively account for 1,944 removed lines.

The deleted files fall into three categories. First, dead components: `GooBlobs.jsx` (81 lines, an animated SVG blob effect), `CommentsDrawer.jsx` (324 lines, a feed comments side-drawer), `FeedControlBar.jsx` (95 lines, a feed filter/control bar), `CountryAutocomplete.jsx` (150 lines), and `RoleSelect.jsx` (139 lines) — all of which had been superseded by newer implementations or were never wired into any route. Second, orphan pages and barrel files: `AdminPanel.cms.jsx`, `AdminPanel.ui.jsx`, `AdminPanel.ultra.jsx` (three variant admin panel implementations totaling ~517 lines), `VerificationCenter.jsx` (a re-export stub), and the `admin/index.js` + `admin/sections/index.js` barrel directories. Third, a dead hook: `useSmartHover.js` (90 lines) that was extracted but never consumed. An `OnboardingWizard.jsx` page (325 lines) was also removed — it had been replaced by the current onboarding flow.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| dist/assets/*.js (52 chunk renames) | dist | 48 | 48 | 0 |
| dist/assets/index-CHH3crgd.css → index-CPglsbxB.css | dist | 1 | 1 | 0 |
| dist/assets/index-7nEjiBEC.js → index-DA93CmaT.js | dist | 2 | 2 | 0 |
| dist/index.html | dist | 2 | 2 | 0 |
| src/components/GooBlobs.jsx | delete | 0 | 81 | −81 |
| src/components/feed/CommentsDrawer.jsx | delete | 0 | 324 | −324 |
| src/components/feed/FeedControlBar.jsx | delete | 0 | 95 | −95 |
| src/components/journey/JourneyTimeline.jsx | delete | 0 | 1 | −1 |
| src/components/ui/CountryAutocomplete.jsx | delete | 0 | 150 | −150 |
| src/components/ui/RoleSelect.jsx | delete | 0 | 139 | −139 |
| src/hooks/useSmartHover.js | delete | 0 | 90 | −90 |
| src/pages/AdminPanel.cms.jsx | delete | 0 | 206 | −206 |
| src/pages/AdminPanel.ui.jsx | delete | 0 | 157 | −157 |
| src/pages/AdminPanel.ultra.jsx | delete | 0 | 154 | −154 |
| src/pages/VerificationCenter.jsx | delete | 0 | 3 | −3 |
| src/pages/admin/AdminSections.jsx | delete | 0 | 51 | −51 |
| src/pages/admin/index.js | delete | 0 | 109 | −109 |
| src/pages/admin/sections/index.js | delete | 0 | 11 | −11 |
| src/pages/auth/OnboardingWizard.jsx | delete | 0 | 325 | −325 |

## Detailed Diff Analysis

**Deleted components (src/components/):** `GooBlobs.jsx` was an animated SVG blob effect with complex path morphing — a decorative element never imported by any page. `CommentsDrawer.jsx` was a 324-line slide-in drawer for feed post comments that had been replaced by the inline `PostPreview` modal system. `FeedControlBar.jsx` was a sticky filter bar with type/category chips for the main feed — superseded by the inline filter controls in `MainFeed.jsx`. `CountryAutocomplete.jsx` and `RoleSelect.jsx` were custom dropdown components (150 and 139 lines respectively) that were built but never integrated — the signup flow uses native `<select>` elements instead. `JourneyTimeline.jsx` was a one-line re-export barrel to `../JourneyTimeline.jsx` — the actual component already lived at the parent path, making this redirect dead code.

**Deleted admin variants (src/pages/):** `AdminPanel.cms.jsx` (206 lines), `AdminPanel.ui.jsx` (157 lines), and `AdminPanel.ultra.jsx` (154 lines) were three separate visual implementations of the admin panel — CMS-style, UI-kit-style, and ultra-dark-style. None were imported by any route; the active `AdminPanel.jsx` is the single source of truth. The `admin/index.js` barrel (109 lines) and `admin/sections/index.js` barrel (11 lines) re-exported these unused sections.

**Deleted hook:** `useSmartHover.js` (90 lines) was a trajectory-predicting hover intent hook that tracked pointer movement to determine if the user was heading toward a target element. It was extracted for potential use with the card hover effects but was never consumed by any component.

**Deleted page:** `OnboardingWizard.jsx` (325 lines) was a 3-step onboarding wizard (profile image → organization → categories) using Framer Motion animations. It appears the onboarding flow was reworked and this page was orphaned.

**Dist rebuild:** The 52 chunk renames and CSS swap are the Vite build output reflecting the new dependency graph after source deletions. The content hashes changed because the bundle composition changed.

## Why This Change Was Needed

Dead code increases bundle size (even tree-shaking can miss some paths), creates confusion for developers navigating the codebase, and makes the true surface area of the application harder to assess. Removing 15 unused files and ~1,944 lines of dead code reduces cognitive load and prevents accidental re-imports of obsolete implementations.

## Was It Useful

Yes. This is a standard housekeeping cleanup that every active codebase benefits from. The deleted files span multiple abandoned attempts (admin panel variants, onboarding wizard, unused UI components) that were left behind during feature development.

## Impact Analysis

- **Bundle size:** Reduced. Vite will no longer include dead modules in the bundle graph.
- **Developer experience:** Improved. Fewer files to navigate, less ambiguity about which components are active.
- **Runtime:** Zero behavioral changes. No active import paths were modified.
- **Risk:** Low. All files were confirmed unused before deletion.

## Relationship to Surrounding Commits

This commit sits at the start of a two-part cleanup phase (continued in 0656 which removes 88 more temp/analysis files). Together they strip the codebase of accumulated dead weight from months of rapid feature development.

## Confidence Notes

- All deleted source files were verified to have zero import references in the active codebase.
- The dist rebuild confirms the deletions didn't break the build.
- The admin section barrel files re-exported components that are still present in `src/pages/admin/sections/` — only the barrel routers were removed.

## Optional Technical Details

- The `useSmartHover` hook used trajectory prediction with a 4-sample sliding window and 180ms/250ms enter/exit delays.
- `AdminPanel.cms.jsx` exported CMS-specific components: `Badge`, `StatCard`, `SectionCard`, `cmsChipClass`, `CmsMiniBadge`, `CmsStatCard`, `CmsSectionCard`.
- `AdminPanel.ultra.jsx` exported dark-mode components: `UltraPill`, `UltraStatCard`, `UltraSectionCard`, `UltraToggle`, `UltraTinyChart`.
- `OnboardingWizard.jsx` used Framer Motion's `AnimatePresence` with `x: 60 → 0 → -60` slide transitions between steps.
