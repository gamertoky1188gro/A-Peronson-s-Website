# Commit 0664 — 19625e8

| Field | Value |
|-------|-------|
| **Commit Number** | 0664 |
| **Commit Hash** | 19625e8b79bf0aa58f5143dab934be2cf56d7a7b |
| **Parent Hash** | c38f6da0c7af59528a0c2bbdd6237b0fbe957c6a |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 18:26:32 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 2 |
| **Deletions** | 2 |
| **Net Change** | +2/-2 |
| **Merge Commit** | No |

## allow-horizontal-scroll-on-helpcenter-step-cards-on-mobile

Two-line CSS fix in `src/pages/HelpCenter.jsx` that enables horizontal scrolling on the help section step cards when viewed on mobile devices. The issue was that the outer `HelpSection` wrapper had `overflow-hidden` which clipped the content, preventing the inner step cards from scrolling horizontally on narrow screens.

**Change 1 — Remove overflow-hidden from section wrapper:**
```jsx
// Before:
<section className="relative overflow-hidden rounded-3xl border ...">

// After:
<section className="relative rounded-3xl border ...">
```

**Change 2 — Add overflow-hidden to gradient div:**
```jsx
// Before:
<div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-100`} />

// After:
<div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-br ${accent} opacity-100`} />
```

The `overflow-hidden` was moved from the `<section>` (which wraps the entire help card including its scrollable content) to the inner gradient `<div>` (which only needs it to clip the gradient background to the rounded corners). This allows the section's content to overflow and scroll horizontally while still preserving the rounded corner clipping on the decorative gradient.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/HelpCenter.jsx | edit | 2 | 2 | 0 |

## Detailed Diff Analysis

**The problem:** The `HelpSection` component renders a card with a gradient background overlay and content (title, subtitle, step cards). On mobile, the step cards are laid out in a horizontal scroll container. But the parent `<section>` had `overflow-hidden` which prevented any scrolling — the content was clipped at the section boundary.

**The fix:** Moving `overflow-hidden` from the `<section>` to the gradient `<div>` achieves both goals:
1. The gradient background is still clipped to the rounded corners (via `overflow-hidden` + `rounded-3xl` on the gradient div).
2. The section's content can now overflow horizontally, allowing the step cards to scroll.

The gradient div needs `overflow-hidden` because it's absolutely positioned (`absolute inset-0`) and would otherwise extend beyond the rounded corners of the section. The `rounded-3xl` was also added to the gradient div to match the section's border radius.

## Why This Change Was Needed

On mobile, the HelpCenter step cards were clipped and couldn't be scrolled horizontally, making some content inaccessible. Users on small screens couldn't see all the step information in each help section.

## Was It Useful

Yes. This is a targeted CSS fix that resolves a mobile accessibility issue with minimal risk.

## Impact Analysis

- **Mobile UX:** Step cards are now horizontally scrollable on narrow screens.
- **Desktop UX:** No change — the content fits within the section width on desktop.
- **Visual appearance:** The gradient background still clips to rounded corners as before.
- **Risk:** Very low. Only CSS overflow behavior changed; no JavaScript or component logic affected.

## Relationship to Surrounding Commits

This is the final commit in the 0660-0664 batch of UI/UX improvements. Together they address: mobile zoom (0660), content mode toggle (0661), assistant panel back button (0662), signup cleanup (0663), and now HelpCenter scrolling (0664).

## Confidence Notes

- The `overflow-hidden` on the section was identified as the clipping source by testing on mobile viewport widths.
- The gradient div's `overflow-hidden` is necessary because `absolute inset-0` elements don't respect parent `border-radius` by default.
- The `rounded-3xl` on the gradient div matches the section's `rounded-3xl` to ensure consistent corner clipping.

## Optional Technical Details

- The HelpCenter page uses a `HelpSection` component that renders each section as a card with `rounded-3xl` (1.5rem border radius).
- The gradient overlay uses `absolute inset-0` to fill the entire section, with `pointer-events-none` to prevent it from intercepting clicks.
- The step cards inside each section use a flex layout with `overflow-x-auto` on the container — this was already configured but blocked by the parent's `overflow-hidden`.
