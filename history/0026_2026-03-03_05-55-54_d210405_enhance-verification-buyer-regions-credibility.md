# Commit 0026: Enhance Verification Requirements with Buyer Regions and Credibility

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0026                                       |
| **Commit Hash**   | `d21040582c1218fde5d107f3a890e7632539c9cd` |
| **Parent Hash**   | `2fc615e` (0025)                           |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-03 05:55:54 (+0600)                |
| **Files Changed** | 1                                          |
| **Additions**     | 104                                        |
| **Deletions**     | 9                                          |
| **Net Change**    | +95 lines                                  |
| **Merge Commit**  | No                                         |

## Custom Title

**Add Buyer Region-Specific Verification with Credibility Scoring**

## High-Level Summary

Rewrites the verification service to support buyer region-specific document requirements (EU, USA, OTHER). Adds a credibility scoring system that calculates a score (0-100) based on required document completeness (85% weight) and optional licenses (3 points each, up to 5). Different buyer regions require different documents (EU: VAT + EORI, USA: EIN + IOR, OTHER: basic).

## Key Changes

- **Region-aware required documents**: EU buyers need VAT/EORI, US buyers need EIN/IOR, others need basic docs
- **Field aliasing**: `tin_or_ein` mapped to `tin` or `ein`, `erc_or_eori` mapped to `erc` or `eori`
- **Credibility scoring**: `requiredCompletionPct * 0.85 + optionalLicenses * 3` (capped at 100)
- **Badges**: "Basic" (<40), "Moderate" (40-69), "Strong" (70-89), "High" (90+)
- **`normalizeBuyerRegion()`**: Normalizes region input to EU/USA/OTHER

## Why

To support different legal/document requirements for buyers in different regions (EU, USA, rest of world) and provide a credibility scoring system for trust signaling.

## Relationship

This commit will be merged via the ccm/update-verification-service-for-buyer-roles branch in commit 0027.
