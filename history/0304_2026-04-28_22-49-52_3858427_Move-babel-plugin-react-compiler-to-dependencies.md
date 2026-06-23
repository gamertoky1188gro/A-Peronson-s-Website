## Commit Metadata
- **Hash:** `385842742ebef87e1eac31174cc7c1017e0c55f0`
- **Parent:** `e9d293cc233366b4c8f18b8fa69a5c49cf32b6dd`
- **Author:** Cyber Code Master
- **Date:** 2026-04-28 22:49:52 +0600
- **Subject:** Move babel-plugin-react-compiler to dependencies
- **Body:** (none)

## Custom Title
Move babel-plugin-react-compiler from devDependencies to Dependencies

## High-Level Summary
Moves `babel-plugin-react-compiler` from `devDependencies` to `dependencies` in `package.json` so Render's production build can use it.

## File-by-File
| File | Change |
|------|--------|
| `package.json` | +1, -1 |

## Detailed Diff
```diff
--- a/package.json
+++ b/package.json
     "xlsx": "^0.18.5",
-    "@vitejs/plugin-react": "^5.1.1"
+    "@vitejs/plugin-react": "^5.1.1",
+    "babel-plugin-react-compiler": "^1.0.0"
   },
   "devDependencies": {
-    "babel-plugin-react-compiler": "^1.0.0",
```

## Why
Same reason as commit 303 — Render only installs `dependencies` in production, so the Babel plugin needed to be moved out of `devDependencies`.

## Was It Useful
Yes — prevented build failure on Render due to missing Babel plugin.

## Impact
Small. Single package moved in `package.json`.

## Relationships
Follows commit 303. Continuation of Render dependency fixes.

## Confidence
High
