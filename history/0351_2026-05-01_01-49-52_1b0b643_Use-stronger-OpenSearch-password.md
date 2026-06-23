# Commit 0351 — Use stronger OpenSearch password

## Commit Metadata
- **Hash:** `1b0b6439979f77fa4192aeb927d31bd6f36ea67d`
- **Parent:** `625e6ea262dee446bbc49b8946aa49bfae5176f1`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:49:52 +0600
- **Message:** Use stronger OpenSearch password

## Custom Title
Strengthen OpenSearch password to `Admin@12345!`

## High-Level Summary
Changed the OpenSearch admin password from `Admin@123` to `Admin@12345!`, adding length and an extra special character.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-        options: ... -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=Admin@123
+        options: ... -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=Admin@12345!
```

## Why
Further strengthening to meet stricter password policies.

## Was It Useful
Transient — changed again (0352).

## Impact
Low.

## Relationships
Part of password iteration (0349–0356).

## Confidence
High.
