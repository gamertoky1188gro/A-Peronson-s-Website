# Commit 0542 — `237eebb52c67`

| Field       | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Commit Hash | `237eebb52c67275d1b9291bda96bcca897c9ca5d`                                 |
| Parent Hash | `9e89027dd2c394e8a1e9532b67dc38bbdf5b2cb1`                                 |
| Author      | gamertoky1188gro                                                           |
| Date        | 2026-06-06 12:26:11 +0600                                                  |
| Subject     | fix: chat/call routes now render without app-shell wrapper for full screen |

---

## High-Level Summary

Changes the condition that wraps route content in `<AppShell />` so that chat (`/chat`) and call (`/call`) routes also bypass the shell, giving them full-screen rendering without nav/footer chrome.

---

## Files Changed

| File          | Status   | Insertions | Deletions |
| ------------- | -------- | ---------- | --------- |
| `src/App.jsx` | modified | 1          | 1         |

**1 file changed, 1 insertion, 1 deletion**

---

## Detailed Diff Analysis

### `src/App.jsx`

- Changed: `const content = isAdminRoute ? (` → `const content = isAdminRoute || isImmersiveRoute ? (`
- This makes chat and call routes (grouped as `isImmersiveRoute`) use the same no-chrome rendering path as admin routes.

---

## Why

Chat and call interfaces need the full viewport without the app shell chrome (navbar, footer) for an immersive experience.

---

## Was It Useful

Yes — enables full-screen chat/call UIs.

---

## Impact

Low — routing logic change only.

---

## Confidence

High.
