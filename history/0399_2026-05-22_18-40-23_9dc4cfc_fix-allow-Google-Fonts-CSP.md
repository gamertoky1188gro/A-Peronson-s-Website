# Commit 0399 — `9dc4cfc5aaa`

| Field | Value |
|-------|-------|
| Commit Hash | `9dc4cfc5aaa1d614a1ed72bcca82d6b0a9d23369` |
| Parent Hash | `4b2eb135d2d235a00a5630b89c8fcc1e765e1d13` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 18:40:23 +0600 |
| Subject | fix: allow Google Fonts in CSP, dynamic WS origin check |

---

## High-Level Summary

Adds Google Fonts URLs (`fonts.googleapis.com`, `fonts.gstatic.com`) to the Helmet CSP `styleSrc` and `fontSrc` directives. Updates WebSocket origin verification to also match `https://host` and `http://host` (not just explicit origin list).

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/server.js` | modified | 7 | 0 |

**1 file changed, 4 insertions, 3 deletions**

---

## Why

Google Fonts were being blocked by CSP. WebSocket connections from the Render deployment domain were being rejected.

---

## Was It Useful

Yes — fixes font rendering and WebSocket connectivity in production.

---

## Impact

Medium — fixes two real issues in the production deployment.

---

## Relationships

Follows CSP configuration from 0398.

---

## Confidence

High.
