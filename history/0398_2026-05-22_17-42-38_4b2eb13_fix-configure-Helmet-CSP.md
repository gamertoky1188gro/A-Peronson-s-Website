# Commit 0398 — `4b2eb135d2d`

| Field | Value |
|-------|-------|
| Commit Hash | `4b2eb135d2d235a00a5630b89c8fcc1e765e1d13` |
| Parent Hash | `c5674c829982f4a58fb603866678d4ee5c2a8585` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 17:42:38 +0600 |
| Subject | fix: configure Helmet CSP to allow inline scripts and WebSocket |

---

## High-Level Summary

Configures Helmet's `contentSecurityPolicy` with explicit directives allowing inline scripts (`'unsafe-inline'`, `'unsafe-eval'`), WebSocket connections (`wss:`), and other resources. Previously, `app.use(helmet())` was called without configuration, which blocked inline scripts and broke the app.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/server.js` | modified | 15 | 0 |

**1 file changed, 15 insertions, 1 deletion**

---

## Why

The default Helmet CSP is too restrictive for this SPA — it blocks inline `<script>` tags, inline styles, and WebSocket connections.

---

## Was It Useful

Critical — without these directives, the frontend would not load (inline scripts blocked by CSP).

---

## Impact

Fixes frontend rendering broken by 0387's Helmet introduction.

---

## Relationships

Fixes regression from 0387.

---

## Confidence

High.
