## Commit Metadata

- **Hash:** 17a83cbf2d8e4c70850837f7f16a8b2c98a9083a
- **Parent:** 5b39610e0edf18dbb8bcba9b3fa839279fc64342
- **Author:** gamertoky1188gro
- **Date:** 2026-04-01 01:29:11
- **Message:** Backfill passkeys from user profile

## Custom Title

Backfill passkeys from user profiles to app_state

## High-Level Summary

Added a backfill mechanism that migrates existing passkeys stored in user profiles to the centralized app_state store during registration. This ensures backward compatibility with passkeys created before the app_state refactor.

## File-by-File Breakdown

- **server/services/passkeyService.js** — On registration verification, checks for existing profile passkeys and migrates them to app_state, then clears the profile passkeys

## Detailed Diff Analysis

During registration verification (`verifyRegistrationResponse`), the service now:

1. Loads the user's current profile
2. If profile has passkeys, migrates them to app_state
3. Clears passkeys from the user's profile
4. Saves the updated profile

## Why This Change

Users who registered passkeys before the app_state refactor (166) would have orphaned credentials in their profile. This ensures they can still log in.

## Was It Useful

Yes. Essential for data migration without user-facing disruption.

## Impact Analysis

- **Scope:** Single file, +56/-4 lines
- **Risk:** Medium — modifies user profile data during registration verification

## Relationships

Completes the migration started in 166 (app_state storage).

## Confidence Notes

High. One-time migration with clear logic.
