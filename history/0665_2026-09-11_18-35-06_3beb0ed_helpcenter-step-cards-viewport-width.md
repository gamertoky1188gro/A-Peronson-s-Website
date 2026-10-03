# Commit 0665 — 3beb0ed

| Field | Value |
|-------|-------|
| **Commit Number** | 0665 |
| **Commit Hash** | 3beb0ed216bdbcb865f38a89d470b7827bf25930 |
| **Parent Hash** | 19625e8b79bf0aa58f5143dab934be2cf56d7a7b |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 18:35:06 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | +1/-1 |
| **Merge Commit** | No |

## Constrain HelpCenter Step Cards to Viewport Width for Mobile Scroll

This commit adds `w-full` to the flex container holding the step cards in HelpCenter.jsx. The `overflow-x-auto` property was already present but couldn't function because the container lacked a constrained width — it grew to fit its children instead of overflowing. By pinning `w-full`, the container now stays within the viewport bounds, allowing `overflow-x-auto` to properly enable horizontal scroll on mobile devices.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/HelpCenter.jsx | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

The single change is adding `w-full` to the class list of the step cards container:

```diff
- <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-3">
+ <div className="flex w-full gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-3">
```

The `w-full` (width: 100%) constrains the flex container to the viewport width on mobile. On desktop (`md:` breakpoint and above), the `md:grid` layout takes over, so `w-full` has no effect there.

## Why This Change Was Needed

Without `w-full`, the flex container expanded horizontally to fit all step cards, exceeding the viewport width. The `overflow-x-auto` property had no effect because the container wasn't constrained — there was nothing to scroll within. Users on mobile could see cards cut off at the viewport edge with no way to scroll to see the rest.

## Was It Useful

Yes, this is the first step in fixing horizontal scrolling on the HelpCenter page. However, it's an incomplete fix — the next commit (0666) refines the approach by adding a proper outer scroll wrapper with negative margins to break out of parent padding.

## Impact Analysis

- **User-facing:** Mobile users on HelpCenter can now scroll horizontally through step cards
- **Desktop:** No change — grid layout takes over at `md:` breakpoint
- **Risk:** Low — single CSS class addition, no logic changes

## Relationship to Surrounding Commits

- **Predecessor (0664):** Unknown (not in this batch)
- **Successor (0666):** Refines the horizontal scroll approach with a proper wrapper and negative margins
- **Successor (0670):** Further fixes HelpCenter overflow-x with a different approach (grid instead of scroll)

## Confidence Notes

This is a straightforward CSS fix. The `w-full` addition is correct but incomplete — it constrains width but doesn't handle the negative margin needed to break out of parent padding, which is addressed in the next commit.

## Optional Technical Details

- The step cards use a flex layout with `gap-4`, `snap-x`, `snap-mandatory`, and `scrollbar-hide`
- On desktop, the grid layout (`md:grid md:grid-cols-2 xl:grid-cols-3`) renders as a 2-3 column grid
- The `scrollbar-hide` class is a custom utility that hides the scrollbar across browsers
