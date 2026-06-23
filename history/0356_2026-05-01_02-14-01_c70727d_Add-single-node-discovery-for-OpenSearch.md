# Commit 0356 — Add single-node discovery for OpenSearch

## Commit Metadata
- **Hash:** `c70727d95094e48a13b273311ace59d7a14747e7`
- **Parent:** `4e6e33ffdfb00d13e06b0113ee4ca01ba4785fbf`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 02:14:01 +0600
- **Message:** Add single-node discovery for OpenSearch

## Custom Title
Add `discovery.type=single-node` env var to OpenSearch CI service

## High-Level Summary
Added `-e discovery.type=single-node` to the OpenSearch Docker options in the CI workflow to configure single-node cluster mode.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-        options: ... -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=S3cur3P@ss2024!
+        options: ... -e discovery.type=single-node -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=S3cur3P@ss2024!
```

## Why
OpenSearch in CI is a single-node instance and needs `discovery.type=single-node` to bootstrap properly without discovery/join errors.

## Was It Useful
Yes — required for single-node OpenSearch startup.

## Impact
Low.

## Relationships
Part of OpenSearch CI reliability fixes.

## Confidence
High.
