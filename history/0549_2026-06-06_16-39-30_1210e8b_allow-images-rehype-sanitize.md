# Commit 0549 — `1210e8b3b92b`

| Field | Value |
|-------|-------|
| Commit Hash | `1210e8b3b92b761ca944d5173a8aa2a99473d996` |
| Parent Hash | `1f490d31408645660a5c66a1fb00a10c52e5480e` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 16:39:30 +0600 |
| Subject | fix: allow images in rehype-sanitize schema, add img component with styling |

---

## High-Level Summary

Updates the `rehype-sanitize` schema to allow `<img>` tags through HTML sanitization and adds a custom `img` component with lazy loading, rounded corners, and max-width constraint.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/components/feed/MarkdownReadme.jsx` | modified | 29 | 2 |
| `src/pages/FeedManagement.jsx` | modified | 12 | 0 |

**2 files changed, 39 insertions, 2 deletions**

---

## Detailed Diff Analysis

### `MarkdownReadme.jsx`
- Replaced static `rehypeSanitize` with a memoized custom schema that adds `img` to allowed `tagNames` and specific attributes (`src`, `alt`, `title`, `width`, `height`, `loading`).
- Added custom `img` component with `max-w-full rounded-xl` styling and `loading="lazy"`.

### `FeedManagement.jsx`
- Added same `img` component override in the preview `ReactMarkdown`.

---

## Why

Images in markdown were stripped by the HTML sanitizer. This allows them while keeping sanitization active for everything else.

---

## Was It Useful

Yes — enables image rendering in markdown content.

---

## Impact

Low — schema extension only.

---

## Confidence

High.
