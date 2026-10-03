# Commit 675 — cdd6631

| Field | Value |
|-------|-------|
| **Commit Number** | 675 |
| **Commit Hash** | cdd6631fc7c17453cfaa458965e98272db41d8f6 |
| **Parent Hash** | 2fd48f2365a52712b5b2f630beeb0a9ab4def40f |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 13:44:05 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 3 |
| **Deletions** | 8 |
| **Net Change** | +3/-8 |
| **Merge Commit** | No |

## Hide Internal Debug Text, Clean Up Artifacts, and Fix FAB Mobile Overlap

This commit addresses three distinct UI polish issues that were discovered during testing. First, the About page title contained debug text ("Show notifications") that was accidentally committed to production — this was cleaned up to read simply "About GarTexHub". Second, the TexHub home page had a `heroPresentation` field being rendered that exposed an internal "presentation rule" note to end users. The variable declaration and its conditional render block were both removed. Third, the FloatingAssistant's floating action button (FAB) was repositioned on mobile to avoid overlapping with browser chrome and bottom navigation elements — changing from a fixed `right-6 bottom-6` to a responsive `right-4 bottom-20` with `sm:right-6 sm:bottom-6` breakpoints.

These are small but important quality-of-life fixes. The internal text leak was a UX embarrassment, and the FAB overlap on mobile was a functional usability bug that prevented users from interacting with content near the bottom of the screen on smaller viewports.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/components/FloatingAssistant.jsx | Modified | 1 | 1 | 0 |
| src/pages/About.jsx | Modified | 1 | 1 | 0 |
| src/pages/TexHub.jsx | Modified | 1 | 6 | −5 |

## Detailed Diff Analysis

**FloatingAssistant.jsx**: The FAB container's className changed from `"fixed right-6 bottom-6 z-50"` to `"fixed right-4 bottom-20 z-50 sm:right-6 sm:bottom-6"`. On mobile, the button is now pushed up 20 units from the bottom (leaving space for browser UI/navigation bars) and slightly closer to the right edge. On `sm` screens and above, it reverts to the original positioning.

**About.jsx**: The heading text was changed from `"About GarTexHub - Show notifications"` to `"About GarTexHub"`. The trailing dash and debug string were removed.

**TexHub.jsx**: The `heroPresentation` variable (line 583) was deleted entirely, along with its conditional JSX block (lines 797-801) that would render it as an italic paragraph below the short description. This removes the internal "presentation rule" text from being visible to end users.

## Why This Change Was Needed

- The "Show notifications" text in the About page title was clearly a debug artifact left from testing the FloatingAssistant notification system — it looked unprofessional and confused users.
- The `heroPresentation` field contained internal notes about the hero section's presentation rules, which were never meant for public consumption.
- The FAB's `bottom-6` placement on mobile caused it to overlap with the browser's address bar and any bottom-pinned navigation, making it impossible to dismiss or interact with the assistant on small screens.

## Was It Useful

Yes. All three changes are pure polish fixes with zero risk. They improve the public-facing appearance and mobile usability of the application.

## Impact Analysis

- **UX**: Mobile users can now interact with the FloatingAssistant FAB without it blocking other UI elements.
- **Professionalism**: The About page no longer shows internal debug text.
- **Code cleanliness**: Unused data fields (presentation_rule) are removed from the render path, reducing bundle size slightly.

## Relationship to Surrounding Commits

This commit is part of a series of rapid-fire bugfixes on September 12, 2026. It precedes commits 676 and 677, which fix crashes on the login/signup pages caused by the same FloatingAssistant component and CyberpunkCursor. The theme of this day is a "crash and polish" sprint.

## Confidence Notes

- All changes are straightforward text/CSS edits with no logic changes.
- The TexHub diff shows the removal of a data access path (`heroPresentation`) — the underlying data is still fetched but simply not displayed, which is safe.
- The FAB repositioning uses Tailwind responsive prefixes, so it will degrade gracefully on unsupported viewports.

## Optional Technical Details

- The FloatingAssistant FAB uses Framer Motion's `<motion.div>` for opacity transitions, so the className change does not affect animation behavior.
- The `z-50` layer was preserved to ensure the FAB stays above other fixed-position elements.
- The TexHub `heroPresentation` variable was only used in one conditional block; no other consumers existed.
