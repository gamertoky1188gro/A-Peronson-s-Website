# Commit 0361 — Fix OpenSearch docker image version to 2 (latest 2.x)

## Commit Metadata
- **Hash:** `b23b3e5bec38851094e137ff6d4ed0824492aaff`
- **Parent:** `0701c38f919efbff3d79b3d069a87ea667b3e832`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 11:57:15 +0600
- **Message:** Fix OpenSearch docker image version to 2 (latest 2.x)

## Custom Title
Pin OpenSearch in docker-compose.yml to `:2`

## High-Level Summary
Changed the OpenSearch image tag in `docker-compose.yml` from `2.13.1` to `2` to match the CI workflow.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| docker-compose.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-    image: opensearchproject/opensearch:2.13.1
+    image: opensearchproject/opensearch:2
```

## Why
Consistency with CI workflow (0343) and to track latest 2.x.

## Was It Useful
Yes — keeps local dev environment consistent with CI.

## Impact
Low.

## Relationships
Syncs docker-compose.yml with CI workflow.

## Confidence
High.
