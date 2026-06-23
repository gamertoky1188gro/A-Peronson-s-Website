# Commit 0357 — Fix OpenSearch health check to use HTTPS with SSL skip

## Commit Metadata
- **Hash:** `d1774af130878eabc832ae44ab8f906f59d0a3c1`
- **Parent:** `c70727d95094e48a13b273311ace59d7a14747e7`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 02:30:10 +0600
- **Message:** Fix OpenSearch health check to use HTTPS with SSL skip

## Custom Title
Change health check URLs from HTTP to HTTPS with `-k` (insecure) flag

## High-Level Summary
Updated both the Docker health check `--health-cmd` and the CI "Wait for OpenSearch" script to use `https://` with `curl -k` (skip SSL verification) instead of plain HTTP, because the OpenSearch security plugin redirects HTTP to HTTPS.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 2 insertions, 2 deletions |

## Detailed Diff
```diff
-        options: --health-cmd="curl -sS http://localhost:9200/_cluster/health || exit 1" ...
+        options: --health-cmd="curl -ksS https://localhost:9200/_cluster/health || exit 1" ...
...
-            if curl -sS http://localhost:9200/_cluster/health | grep -q '"status"'; then
+            if curl -ksS https://localhost:9200/_cluster/health | grep -q '"status"'; then
```

## Why
OpenSearch 2.x with security enabled exposes HTTPS only. The health check was failing because plain HTTP was being refused/redirected.

## Was It Useful
Yes — critical fix for CI to actually verify OpenSearch is healthy.

## Impact
Low-medium. Two-line change in workflow; fixes CI reliability.

## Relationships
End of the OpenSearch CI workflow fixes sub-series (0343–0357).

## Confidence
High.
