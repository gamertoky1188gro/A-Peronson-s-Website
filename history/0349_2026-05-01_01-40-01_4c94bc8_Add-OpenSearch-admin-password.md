# Commit 0349 — Add OpenSearch admin password

## Commit Metadata
- **Hash:** `4c94bc8536025faea182ebf14b285dfa9b91cc9a`
- **Parent:** `5af2a2d4ce8f8405d13cdcc5d66a9fb46a5cdc51`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:40:01 +0600
- **Message:** Add OpenSearch admin password

## Custom Title
Add `OPENSEARCH_INITIAL_ADMIN_PASSWORD=admin` to CI workflow

## High-Level Summary
Added the `-e OPENSEARCH_INITIAL_ADMIN_PASSWORD=admin` environment variable to the OpenSearch service container in CI.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-        options: --health-cmd="curl -sS http://localhost:9200/_cluster/health || exit 1" --health-interval=10s --health-timeout=5s --health-retries=30
+        options: --health-cmd="curl -sS http://localhost:9200/_cluster/health || exit 1" --health-interval=10s --health-timeout=5s --health-retries=30 -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=admin
```

## Why
Newer OpenSearch 2.x images require an initial admin password to be set via environment variable.

## Was It Useful
Yes — required for OpenSearch 2.x+ to start properly.

## Impact
Low. Single variable added.

## Relationships
First of many password changes (0349–0356).

## Confidence
High.
