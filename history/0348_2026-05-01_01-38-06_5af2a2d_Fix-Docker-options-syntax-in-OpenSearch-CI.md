# Commit 0348 — Fix Docker options syntax in OpenSearch CI

## Commit Metadata

- **Hash:** `5af2a2d4ce8f8405d13cdcc5d66a9fb46a5cdc51`
- **Parent:** `8f2bbf85f97eadfcd780d34286f5c474c1eca4c7`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:38:06 +0600
- **Message:** Fix Docker options syntax in OpenSearch CI

## Custom Title

Collapse multi-line `options` into single line for Docker Compose compatibility

## High-Level Summary

Replaced the multi-line YAML `options` block with a single-line string to fix Docker Compose parsing issues in the GitHub Actions service container definition.

## File-by-File

| File                                | Status   | Changes                  |
| ----------------------------------- | -------- | ------------------------ |
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 3 deletions |

## Detailed Diff

```diff
-        options: >-
-          --health-cmd="curl -sS http://localhost:9200/_cluster/health || exit 1" \
-          --health-interval=10s --health-timeout=5s --health-retries=30
+        options: --health-cmd="curl -sS http://localhost:9200/_cluster/health || exit 1" --health-interval=10s --health-timeout=5s --health-retries=30
```

## Why

The `>-` folded YAML block with `\` line continuations may not work correctly in all Docker/Compose versions used by GitHub Actions runners. A single flat string is more portable.

## Was It Useful

Yes — fixes CI service container startup.

## Impact

Low. One workflow file change.

## Relationships

Part of OpenSearch CI reliability fixes (0343–0357).

## Confidence

High.
