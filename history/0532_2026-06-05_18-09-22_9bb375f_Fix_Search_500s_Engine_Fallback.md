## Commit Metadata

| Field        | Value                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| **Hash**     | `9bb375f40a614b04fcbba6431ba294e79157b145`                               |
| **Parent**   | `9b494423bc1ba679981a6623294845cc6cf45989`                               |
| **Author**   | gamertoky1188gro                                                         |
| **Date**     | 2026-06-05 18:09:22 +0600                                                |
| **Subject**  | fix: search 500s, engine fallback, facetCounts field, dynamic categories |
| **Sequence** | 0532                                                                     |

## Custom Title

Fix Search 500 Errors, Engine Fallback, FacetCounts Field, and Dynamic Categories

## High-Level Summary

Seven files changed (61 insertions, 36 deletions). Fixes multiple issues from the semantic search integration: `event_type` vs `type` and `payload` vs `metadata` field name mismatches in eventLog queries, Qdrant error fallback guard using `qdrantResult?.engine === 'qdrant'`, frontend reading `facetCounts` instead of `facets`, disables `AI_SEARCH_ENABLED` on Render, replaces hardcoded homepage categories with dynamic DB query, adds requirements to search trending fallback.

## File-by-File Breakdown

- **render.yaml** (1 line) — Changed `AI_SEARCH_ENABLED` from `"true"` to `"false"`
- **server/controllers/productController.js** (1 line) — Fixed `engine` assignment with proper qdrant guard
- **server/controllers/requirementController.js** (1 line) — Same engine guard fix
- **server/controllers/searchController.js** (59 lines) — Major fixes: changed all `type` to `event_type`, `metadata` to `payload` in eventLog queries; fixed search history create/list; fixed trending searches; added requirements to trending fallback; fixed suggestions
- **server/controllers/systemController.js** (26 lines) — Added dynamic category loading from DB for homepage, replaced hardcoded categories
- **src/pages/SearchResults.jsx** (1 line) — Changed `reqRes?.facets` to `reqRes?.facetCounts`
- **src/pages/TexHub.jsx** (4 lines) — Updated hardcoded categories to match dynamic ones

## Detailed Diff Analysis

- **Field name mismatch**: The Prisma schema uses `event_type` and `payload` (not `type` and `metadata`). All queries were using the wrong field names, causing 500 errors on search history, analytics, and suggestions endpoints.
- **Engine guard**: `qdrantResult?.engine === 'qdrant'` prevents Qdrant errors from overriding the OpenSearch/fallback result.
- **Dynamic categories**: `systemController.js` now queries `product` and `requirement` tables for distinct categories instead of using hardcoded lists.
- **FacetCounts**: The frontend was reading `results.facets` but the backend sends `results.facetCounts` (added in 0530).

## Why This Change

The semantic search integration (0531) introduced several field name mismatches and logic errors that caused 500 errors and broken search functionality.

## Was It Useful

Yes — critical fixes. Without these, search was broken.

## Impact Analysis

High. Fixes multiple failing endpoints and wrong data field references.

## Relationships

Hotfix for the semantic search stack (0531). Precedes 0533.

## Confidence Notes

High.
