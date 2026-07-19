## Commit Metadata

- **Hash:** `e9d293cc233366b4c8f18b8fa69a5c49cf32b6dd`
- **Parent:** `83ff7bc14851553b81480c42b1b9095f0edb03d9`
- **Author:** Cyber Code Master
- **Date:** 2026-04-28 22:44:25 +0600
- **Subject:** Move @vitejs/plugin-react to dependencies
- **Body:** (none)

## Custom Title

Move @vitejs/plugin-react from devDependencies to Dependencies

## High-Level Summary

Moves `@vitejs/plugin-react` from `devDependencies` to `dependencies` in `package.json` so Render's production build can resolve the plugin.

## File-by-File

| File           | Change |
| -------------- | ------ |
| `package.json` | +1, -1 |

## Detailed Diff

```diff
--- a/package.json
+++ b/package.json
     "ws": "^8.19.0",
-    "xlsx": "^0.18.5"
+    "xlsx": "^0.18.5",
+    "@vitejs/plugin-react": "^5.1.1"
   },
   "devDependencies": {
-    "@vitejs/plugin-react": "^5.1.1",
```

## Why

Render's production deployment only installs `dependencies` (not `devDependencies`), so the Vite plugin needed to be moved to `dependencies` for the build to succeed.

## Was It Useful

Yes — enabled Vite production builds on Render.

## Impact

Small. Single package moved in `package.json`.

## Relationships

Follows commit 302. Part of Render deployment setup.

## Confidence

High
