## Commit Metadata
- **Hash:** a855d106989ef48c699c1f7d21ea197854134323
- **Parent:** 17a83cbf2d8e4c70850837f7f16a8b2c98a9083a
- **Author:** gamertoky1188gro
- **Date:** 2026-04-01 05:04:54
- **Message:** Merge passkeys from profile and state

## Custom Title
Merge passkeys from profile and app_state

## High-Level Summary
Updated passkey retrieval to merge credentials from both user profiles and app_state, ensuring no passkeys are lost during the migration period. After merging, the combined list is returned for authentication.

## File-by-File Breakdown
- **server/services/passkeyService.js** — Updated `getPasskeysForUser()` to merge passkeys from both profile and app_state sources

## Detailed Diff Analysis
Changed passkey retrieval to concatenate passkeys from user profile with those from app_state, deduplicating by credentialID. Profile-stored passkeys are used as a fallback source.

## Why This Change
During the migration window (between 166 and full adoption), passkeys could be in either location. Merging ensures all credentials are available for login.

## Was It Useful
Yes. Prevents login failures during the migration period.

## Impact Analysis
- **Scope:** Single file, +19/-2 lines
- **Risk:** Low — additive merge with dedup

## Relationships
Completes the migration strategy from 166 and 170.

## Confidence Notes
High.
