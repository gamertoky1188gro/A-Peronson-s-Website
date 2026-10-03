# Commit 0666 — 5c926cf

| Field | Value |
|-------|-------|
| **Commit Number** | 0666 |
| **Commit Hash** | 5c926cf1c18e547fcfce7dfd446201bc272e3bab |
| **Parent Hash** | 3beb0ed216bdbcb865f38a89d470b7827bf25930 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 18:50:17 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 3 |
| **Deletions** | 1 |
| **Net Change** | +3/-1 |

## Proper Horizontal Scroll Wrapper for HelpCenter Step Cards

This commit wraps the step cards in a proper scroll container with negative margins to break out of the parent padding on mobile. The previous commit (0665) added `w-full` to constrain width, but the cards still couldn't scroll past the parent's padding. The new approach uses an outer `<div>` with `overflow-x-auto`, negative margins (`-mx-6`), and padding (`px-6`) to create a full-bleed scroll area on mobile. The inner container uses `w-max` to expand beyond the viewport on mobile while falling back to `w-full` and grid on desktop.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/HelpCenter.jsx | Modified | 3 | 1 | +2 |

## Detailed Diff Analysis

```diff
- <div className="flex w-full gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-3">
+ <div className="-mx-6 overflow-x-auto px-6 snap-x snap-mandatory scrollbar-hide md:mx-0 md:px-0 md:snap-none">
+ <div className="flex w-max gap-4 md:w-full md:grid md:grid-cols-2 xl:grid-cols-3">
   {/* ... step cards ... */}
 </div>
+ </div>
```

Key changes:
- **Outer wrapper:** `-mx-6 px-6` breaks out of parent padding on mobile (creating full-bleed scroll), `md:mx-0 md:px-0` resets on desktop
- **Inner container:** `w-max` expands to content width on mobile (enabling horizontal scroll), `md:w-full` constrains on desktop
- **Desktop:** `md:snap-none` disables snap on desktop since grid layout doesn't need it

## Why This Change Was Needed

The previous commit's `w-full` approach still had an issue: the parent container has padding (`px-4 sm:px-6 lg:px-8`), which constrains the scroll area. The step cards need to scroll the full width of the viewport, including past the parent padding. The negative margin technique (`-mx-6 px-6`) is a common CSS pattern to create full-bleed scroll areas within padded containers.

## Was It Useful

Yes — this is the correct approach for horizontal scrolling within a padded container. However, this entire scrolling approach was later replaced in commit 0670 with a simpler grid-based layout that doesn't require horizontal scrolling at all.

## Impact Analysis

- **User-facing:** Mobile users get a proper full-bleed horizontal scroll experience for step cards
- **Desktop:** No visible change — grid layout and `w-full` take over
- **Risk:** Low — CSS-only changes, no JavaScript logic modifications

## Relationship to Surrounding Commits

- **Predecessor (0665):** Added `w-full` as a partial fix
- **Successor (0667):** Moves on to Privacy.jsx changes, unrelated
- **Successor (0670):** Replaces the horizontal scroll approach entirely with a simple grid layout

## Confidence Notes

The negative margin technique is well-established for full-bleed scroll areas. The `md:` breakpoints correctly isolate the mobile-only behavior. The approach works but is somewhat complex — the simpler grid solution in 0670 is arguably better.

## Optional Technical Details

- The outer wrapper uses `snap-x snap-mandatory` for snap scrolling on mobile
- `scrollbar-hide` hides the scrollbar across browsers
- The negative margin `-mx-6` matches the parent's `px-6` at the `sm:` breakpoint
- On desktop, `md:mx-0 md:px-0 md:snap-none` completely disables the scroll behavior
