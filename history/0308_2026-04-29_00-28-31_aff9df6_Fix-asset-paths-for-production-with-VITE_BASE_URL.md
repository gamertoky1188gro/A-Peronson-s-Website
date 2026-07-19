## Commit Metadata

- **Hash:** `aff9df69e8e66f848cf402b03cc4cd4bb9ebf3b8`
- **Parent:** `bc4ad22535ed7e22baf3ffc9e3e21a913917d535`
- **Author:** Cyber Code Master
- **Date:** 2026-04-29 00:28:31 +0600
- **Subject:** Fix asset paths for production with VITE_BASE_URL
- **Body:** (none)

## Custom Title

Fix Production Asset Paths with VITE_BASE_URL

## High-Level Summary

Updates `vite.config.js` to use `VITE_BASE_URL` for production asset path resolution. Also adds three utility scripts (`create-admin.mjs`, `get-users.mjs`, `test-db.mjs`) and updates `render.yaml` to set the environment variable.

## File-by-File

| File               | Change    |
| ------------------ | --------- |
| `create-admin.mjs` | +37 (new) |
| `get-users.mjs`    | +8 (new)  |
| `render.yaml`      | +5        |
| `test-db.mjs`      | +15 (new) |
| `vite.config.js`   | +25, -1   |

## Why

Production builds on Render need correct base URLs for asset resolution. Vite's `base` config was missing, causing 404s on JS/CSS assets. The utility scripts were added for database admin tasks during deployment debugging.

## Was It Useful

Yes — fixed asset loading in production.

## Impact

Moderate. Core build config change + added dev utilities.

## Relationships

Follows commit 307. Part of the deployment pipeline fixes.

## Confidence

High
