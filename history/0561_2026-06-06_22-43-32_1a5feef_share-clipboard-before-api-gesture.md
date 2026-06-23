# Commit 0561 — `1a5feef4dfd5`

| Field | Value |
|-------|-------|
| Commit Hash | `1a5feef4dfd5fa0165373b19baa1501d2d52a3ca` |
| Parent Hash | `bec143d8e55a2a6f9a90f7818ea5e109a2758dec` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 22:43:32 +0600 |
| Subject | fix: share btn copy clipboard before API call to preserve user gesture |

---

## High-Level Summary

Reorders the share handler in MainFeed to copy the URL to clipboard *before* making the async API call, ensuring the clipboard write is triggered by the user gesture (click).

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `src/pages/MainFeed.jsx` | modified | 2 | 2 |

**1 file changed, 2 insertions, 2 deletions**

---

## Detailed Diff Analysis

### `MainFeed.jsx`
- Moved `copyToClipboard(url)` before the `apiRequest(...)` call.
- Previously: API call first, clipboard copy second.

---

## Why

Browsers only allow `navigator.clipboard.writeText()` within a user gesture (click handler). Async operations (await) lose the gesture context, causing clipboard copy to fail.

---

## Was It Useful

Yes — fixes clipboard copy on share.

---

## Impact

Low — code reorder only.

---

## Confidence

High.
