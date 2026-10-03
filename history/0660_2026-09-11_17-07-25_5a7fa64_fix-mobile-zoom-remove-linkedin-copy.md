# Commit 0660 — 5a7fa64

| Field | Value |
|-------|-------|
| **Commit Number** | 0660 |
| **Commit Hash** | 5a7fa642b40bcbe97c99d9536a48a16b50d3cfc2 |
| **Parent Hash** | e50c35571946543ae0ca5e54134f49aa18ec196d |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 17:07:25 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 5 |
| **Deletions** | 5 |
| **Net Change** | +5/-5 |
| **Merge Commit** | No |

## fix-mobile-zoom-and-replace-linkedin-style-copy-with-professional

Two targeted fixes: (1) move the `zoom: 0.8` from an inline style to a Tailwind responsive class so mobile devices get natural 100% sizing, and (2) replace "LinkedIn-style" references with "professional" in the TexHub marketing copy.

**Mobile zoom fix (src/App.jsx):** The `.app-shell` div previously had `style={{ zoom: 0.8, width: "100%" }}` which applied a 80% zoom to ALL screen sizes including mobile. This was changed to `className="... lg:[zoom:0.8]"` with `style={{ width: "100%" }}`, so the zoom only applies on `lg` (1024px+) screens. On mobile/tablet, the app now renders at native 100% zoom, fixing the issue where content appeared unnecessarily small on small screens.

**Copy replacement (src/pages/TexHub.jsx):** Two instances of "LinkedIn-style" were replaced with "professional" in the TexHub page's marketing copy. The `professionalFeed` description changed from "A calm, LinkedIn-style surface where posts stay readable without heavy frames" to "A calm, professional surface where posts stay readable without heavy frames." The same change was applied in the `platformFeatures` array. This removes a competitor brand reference from buyer-facing marketing copy.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/App.jsx | edit | 2 | 2 | 0 |
| src/pages/TexHub.jsx | edit | 3 | 3 | 0 |

## Detailed Diff Analysis

**App.jsx zoom change:** The `lg:[zoom:0.8]` Tailwind arbitrary property applies `zoom: 0.8` only at the `lg` breakpoint (1024px+). This is a Tailwind v3+ feature that generates a media query `@media (min-width: 1024px) { .app-shell { zoom: 0.8 } }`. The inline `style={{ zoom: 0.8 }}` was removed, and the `width: "100%"` was kept as an inline style since it doesn't need responsive behavior.

**TexHub.jsx copy:** The word "LinkedIn" was replaced with "professional" in two locations — the `professionalFeed.title/description` object and the `platformFeatures` array. The indentation in `platformFeatures` was also slightly adjusted (the `text` and `meta` lines lost a leading space).

## Why This Change Was Needed

The `zoom: 0.8` was intended for desktop large screens where the design system was built at 80% scale, but it was being applied globally — making the mobile experience cramped and hard to read. The LinkedIn reference was inappropriate for buyer-facing copy as it names a specific competitor/platform.

## Was It Useful

Yes. Both are small but impactful UX/copy fixes. Mobile users now get the full viewport width, and the marketing copy is platform-agnostic.

## Impact Analysis

- **Mobile UX:** Content now renders at 100% zoom on screens < 1024px, significantly improving readability.
- **Desktop UX:** No change — zoom remains 80% on large screens.
- **Marketing:** Copy is now generic and professional without competitor references.
- **Risk:** Low. The zoom change is a well-understood Tailwind responsive pattern.

## Relationship to Surrounding Commits

This is the first of a series of UI/UX fixes (0660-0664) targeting mobile experience and copy improvements. The zoom fix addresses a long-standing mobile layout issue.

## Confidence Notes

- The `lg:` breakpoint (1024px) is the standard Tailwind breakpoint for desktop/large screens.
- The zoom property is well-supported in modern browsers but has known quirks with `position: fixed` elements — the `lg:` restriction limits this to desktop where the quirks are less impactful.

## Optional Technical Details

- Tailwind's `lg:[zoom:0.8]` generates: `@media (min-width: 1024px) { .lg\:\[zoom\:0\.8\] { zoom: 0.8 } }`.
- The `zoom` CSS property is non-standard but widely supported. It scales the element and its contents without affecting layout calculations of parent/sibling elements.
- An alternative approach would be using `transform: scale(0.8)` with `transform-origin: top left`, but this affects layout differently (the element still occupies its original space).
