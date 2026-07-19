# Commit 0343 — Fix OpenSearch Docker image version

## Commit Metadata

- **Hash:** `251d54214517995301a864432978c987c3480608`
- **Parent:** `84975872e92848f9235a9dd28674ce0c0af988b4`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:12:35 +0600
- **Message:** Fix OpenSearch Docker image version

## Custom Title

Pin OpenSearch CI image to `:2` (major version 2)

## High-Level Summary

Changed the OpenSearch Docker image tag in the CI workflow from `2.13.1` to `2` to track the latest 2.x release.

## File-by-File

| File                                | Status   | Changes                 |
| ----------------------------------- | -------- | ----------------------- |
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff

```diff
-        image: opensearchproject/opensearch:2.13.1
+        image: opensearchproject/opensearch:2
```

## Why

Pinning to a specific patch version (`2.13.1`) means CI would not automatically get security/bug-fix updates. Using the `:2` tag tracks the latest 2.x release.

## Was It Useful

Yes — reduces maintenance burden and keeps CI on latest 2.x.

## Impact

Low. One-line change in CI workflow.

## Relationships

First in a series of OpenSearch image version tweaks (0343–0357).

## Confidence

High.
