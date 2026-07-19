## Commit Metadata

- **Hash:** 30eccc2f0113cd2c4735c9b746f6ac908c13a7a5
- **Parent:** 94e452fc04880e913404cbd5a93146943f77cc0e
- **Author:** gamertoky1188gro
- **Date:** 2026-04-01 00:22:15
- **Message:** Store passkeys in app_state

## Custom Title

Refactor passkey storage to app_state

## High-Level Summary

Refactored passkey storage from user profiles to a centralized app_state JSON store. This separates credential data from user data and provides a unified storage mechanism. Added jsonStore utility for the app_state file.

## File-by-File Breakdown

- **server/services/passkeyService.js** — Major refactor (62 insertions/50 deletions): changed user profile-based passkey CRUD to use app_state JSON store via `readLocalJson`/`updateLocalJson`
- **server/utils/jsonStore.js** — Added app_state path constant for the passkey store

## Detailed Diff Analysis

**passkeyService.js:** Replaced all user profile read/write operations with app_state operations. Passkeys are now stored under `STATE.passkeys` keyed by userId. Registration options, verification, login options, and login verification all use the centralized store. The `getPasskeysForUser(userId)` helper retrieves from app_state instead of profile.

**jsonStore.js:** Added `APP_STATE_FILE` constant pointing to the app state JSON path.

## Why This Change

Storing passkeys in user profiles mixed credential data with user metadata. The app_state store is purpose-built for application state data and provides cleaner separation.

## Was It Useful

Yes. Cleaner architecture and easier to manage credential storage.

## Impact Analysis

- **Scope:** 2 files, +62/-50 lines
- **Risk:** Medium — existing stored passkeys would need migration (addressed in 167)

## Relationships

Prerequisite for passkey filtering (167) and merging (171).

## Confidence Notes

High. Well-structured refactor.
