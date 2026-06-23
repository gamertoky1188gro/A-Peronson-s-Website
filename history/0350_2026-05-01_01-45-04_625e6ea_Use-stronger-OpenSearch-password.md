# Commit 0350 — Use stronger OpenSearch password

## Commit Metadata
- **Hash:** `625e6ea262dee446bbc49b8946aa49bfae5176f1`
- **Parent:** `4c94bc8536025faea182ebf14b285dfa9b91cc9a`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:45:04 +0600
- **Message:** Use stronger OpenSearch password

## Custom Title
Strengthen OpenSearch password to `Admin@123`

## High-Level Summary
Changed the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` from `admin` to `Admin@123`.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-        options: ... -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=admin
+        options: ... -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=Admin@123
```

## Why
OpenSearch may enforce password complexity requirements. `Admin@123` includes uppercase, number, and special character.

## Was It Useful
Transient — changed again immediately (0351).

## Impact
Low.

## Relationships
Part of password iteration cycle (0349–0356).

## Confidence
High.
