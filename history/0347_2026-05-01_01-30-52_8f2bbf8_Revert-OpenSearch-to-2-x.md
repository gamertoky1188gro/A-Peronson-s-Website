# Commit 0347 — Revert OpenSearch to 2.x

## Commit Metadata
- **Hash:** `8f2bbf85f97eadfcd780d34286f5c474c1eca4c7`
- **Parent:** `a1142df6daba0f6786b291cd29f80107b95a1ee2`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:30:52 +0600
- **Message:** Revert OpenSearch to 2.x

## Custom Title
Revert OpenSearch CI image back to `:2`

## High-Level Summary
After experimenting with `:3`, `:latest`, and `:2.19.5`, reverted to the `:2` tag (latest 2.x).

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| .github/workflows/opensearch-ci.yml | modified | 1 insertion, 1 deletion |

## Detailed Diff
```diff
-        image: opensearchproject/opensearch:2.19.5
+        image: opensearchproject/opensearch:2
```

## Why
The `:2` tag was the original choice and the most stable for CI purposes.

## Was It Useful
Yes — settled on `:2` as the final choice after iterating.

## Impact
Low.

## Relationships
End of the version-iteration sub-series.

## Confidence
High.
