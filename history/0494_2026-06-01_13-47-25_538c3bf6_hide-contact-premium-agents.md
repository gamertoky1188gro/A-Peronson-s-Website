# Commit 0494

## Commit Metadata
- **Hash**: `538c3bf621492af003491e98eb6e291157b4bc65`
- **Parent**: `095c8235e3ae914f2693de8015b0dff0b09745ea`
- **Author**: gamertoky1188gro
- **Date**: 2026-06-01 13:47:25
- **Message**: Hide contact info from public profiles; grant premium features to first 10 free agents

## High-Level Summary
Two significant changes: (1) Contact/brand info is hidden from public profile views (only self/admin can see), (2) Free-tier agents within orgs with <= 10 active agents automatically get premium features. Agent role added to premium features list.

## File-by-File Breakdown
| File | Status | Insertions | Deletions |
|------|--------|-----------|-----------|
| server/services/entitlementService.js | modified | 46 | 3 |
| server/services/profileService.js | modified | 31 | 0 |
| src/pages/BuyerProfile.jsx | modified | 8 | 2 |
| src/pages/BuyingHouseProfile.jsx | modified | 8 | 2 |
| src/pages/FactoryProfile.jsx | modified | 8 | 2 |
| src/pages/OrgSettings.jsx | modified | 38 | 32 |

## Detailed Diff Analysis
- entitlementService.js: Added agent role to premium features; getPlanForUser now checks agent org context — if agent's org owner is premium, agent gets premium; if org has <= 10 active agents (configurable via admin), agent gets premium
- profileService.js: getProfileOverview adds effective_plan, profile_private (extended brand fields only for self/admin)
- BuyerProfile/BuyingHouseProfile/FactoryProfile: brandProfile now only populated for self/admin; isPremium check includes effective_plan
- OrgSettings clean up

## Why This Change
Privacy: contact info should not be public. Business: free agents get premium features up to 10 members to encourage adoption.

## Was It Useful
Yes — critical for privacy compliance and agent onboarding.

## Impact Analysis
Medium. Changes profile visibility rules. Backward compatible for existing data.

## Relationships
Major entitlement system enhancement.

## Confidence Notes
High.