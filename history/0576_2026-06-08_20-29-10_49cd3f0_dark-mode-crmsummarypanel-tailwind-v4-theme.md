# Commit 0576 — `49cd3f04cb07`

| Field       | Value                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| Commit Hash | `49cd3f04cb07f88e4234747ec687163a9b0cdcf8`                              |
| Parent Hash | `46e3cf1ebc1f72b4df5a838f07b325f8381b7d49`                              |
| Author      | gamertoky1188gro                                                        |
| Date        | 2026-06-08 20:29:10 +0600                                               |
| Subject     | fix: dark mode classes in CrmSummaryPanel, migrate shadows to v4 @theme |

---

## High-Level Summary

Adds dark mode class variants throughout `CrmSummaryPanel.jsx` for all text, background, and border colors. Migrates shadow utilities to Tailwind v4 `@theme` custom shadow tokens in `tailwind.css`.

---

## Files Changed

| File                                         | Status   | Insertions | Deletions |
| -------------------------------------------- | -------- | ---------- | --------- |
| `src/components/profile/CrmSummaryPanel.jsx` | modified | 55         | 55        |
| `src/tailwind.css`                           | modified | 13         | 0         |

**2 files changed, 68 insertions, 55 deletions**

---

## Detailed Diff Analysis

### `CrmSummaryPanel.jsx`

- Added `dark:` variants to all text colors (e.g., `text-slate-900` → `text-slate-900 dark:text-slate-100`).
- Added `dark:bg-slate-950`, `dark:bg-slate-800/60` backgrounds.
- Added `dark:text-slate-400`, `dark:text-slate-300` etc. for text elements.
- Dark mode classes for selects, inputs, and filter controls.

### `tailwind.css`

- Added `@theme` block with custom shadow tokens: `shadow-borderless`, `shadow-borderlessDark`, `shadow-dividerB`, `shadow-dividerBDark`, etc.

---

## Why

CrmSummaryPanel was completely broken in dark mode — invisible text on dark backgrounds. The shadow migration to `@theme` is needed for Tailwind v4 compatibility.

---

## Was It Useful

Yes — essential dark mode fix.

---

## Impact

Medium — large visual fix for CRM panel.

---

## Confidence

High.
