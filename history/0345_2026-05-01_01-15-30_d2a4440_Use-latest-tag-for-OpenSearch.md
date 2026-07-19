# Commit 0345 — Use latest tag for OpenSearch

## Commit Metadata

- **Hash:** `d2a44402f56244c5291074c6b98c842fc95aba8d`
- **Parent:** `3be230ebbf6eec4f003c5851fb6b8bc6a9810dd3`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:15:30 +0600
- **Message:** Use latest tag for OpenSearch

## Custom Title

Switch OpenSearch CI image to `:latest` tag

## High-Level Summary

Changed the OpenSearch image tag from `:3` to `:latest` to track whatever the newest release is.

## File-by-File

| File                                | Status   | Changes                 |
| ----------------------------------- | -------- | ----------------------- |
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff

```diff
-        image: opensearchproject/opensearch:3
+        image: opensearchproject/opensearch:latest
```

## Why

Attempt to always use the newest OpenSearch release.

## Was It Useful

No — `:latest` is unpredictable for CI; reverted to a specific version next.

## Impact

Low. Quick experiment.

## Relationships

Part of OpenSearch version iteration (0343–0347).

## Confidence

High.
