# Commit 0363 — Fix OpenSearch 2.x config: add admin password for security

## Commit Metadata
- **Hash:** `2e50126e789b568b971b15a4aa2a86f710b25d49`
- **Parent:** `dfddfa1610cdbf78cef286fd408e8228bc7a4a2d`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 12:07:40 +0600
- **Message:** Fix OpenSearch 2.x config: add admin password for security

## Custom Title
Add `OPENSEARCH_INITIAL_ADMIN_PASSWORD` and healthcheck to docker-compose.yml

## High-Level Summary
Added `OPENSEARCH_INITIAL_ADMIN_PASSWORD: admin` environment variable and a full healthcheck configuration to the OpenSearch service in `docker-compose.yml`.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| docker-compose.yml | modified | 6 insertions |

## Detailed Diff
```diff
+      OPENSEARCH_INITIAL_ADMIN_PASSWORD: admin
...
+    healthcheck:
+      test: ["CMD-SHELL", "curl -s -k https://localhost:9200 >/dev/null || curl -s http://localhost:9200 >/dev/null"]
+      interval: 10s
+      timeout: 5s
+      retries: 30
```

## Why
OpenSearch 2.x requires an admin password with security enabled. Added healthcheck mirrors the CI workflow setup.

## Was It Useful
Yes — required for local OpenSearch to start.

## Impact
Low-medium. Adds necessary config for local dev.

## Relationships
Mirrors the CI changes from 0349–0357.

## Confidence
High.
