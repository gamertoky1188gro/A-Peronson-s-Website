# Commit 0360 — Fix CI workflow: use docker compose instead of docker-compose and Node.js 20

## Commit Metadata
- **Hash:** `0701c38f919efbff3d79b3d069a87ea667b3e832`
- **Parent:** `d658aa4f7e6c0e97f29616e0c4e4524f5a907079`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 11:55:06 +0600
- **Message:** Fix CI workflow: use docker compose instead of docker-compose and Node.js 20

## Custom Title
Modernize CI: `docker compose` (v2) and Node.js 20

## High-Level Summary
Updated the main CI workflow to use `docker compose` (the v2 command) instead of the deprecated `docker-compose` (v1), and bumped Node.js from 18 to 20.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/ci.yml | modified | 3 insertions, 3 deletions |

## Detailed Diff
```diff
-          node-version: "18"
+          node-version: "20"
...
-          docker-compose up -d opensearch
+          docker compose up -d opensearch
```

## Why
`docker-compose` is deprecated in favor of `docker compose` (v2). Node.js 18 is EOL; 20 is the current LTS.

## Was It Useful
Yes — keeps CI tooling current.

## Impact
Low. Two modernizations in one workflow.

## Relationships
Part of CI reliability improvements.

## Confidence
High.
