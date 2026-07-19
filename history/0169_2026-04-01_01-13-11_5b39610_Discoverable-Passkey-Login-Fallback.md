## Commit Metadata

- **Hash:** 5b39610e0edf18dbb8bcba9b3fa839279fc64342
- **Parent:** 74044ee15daad2aff24e5068b9ac28623cf97b92
- **Author:** gamertoky1188gro
- **Date:** 2026-04-01 01:13:11
- **Message:** Allow discoverable passkey login fallback

## Custom Title

Allow discoverable passkey login fallback

## High-Level Summary

Refactored login to support both discoverable (platform-mediated) and non-discoverable passkey login flows. When a user provides an identifier, the system uses server-side credential lookup; when no identifier is provided (discoverable), the platform prompts the user to select from available passkeys.

## File-by-File Breakdown

- **server/services/passkeyService.js** — Refactored login option generation to conditionally include allowCredentials based on whether an identifier was provided; added conditional logic for discoverable vs non-discoverable flows

## Detailed Diff Analysis

When `identifier` is provided: `allowCredentials` is populated with stored passkey credential IDs, and `userVerification: 'required'` is set. When no identifier (discoverable): `allowCredentials` is omitted, `userVerification: 'preferred'`, and the browser/platform handles credential selection.

## Why This Change

Discoverable passkeys provide a better UX — users just tap their fingerprint without typing a username first. Non-discoverable still works for explicit login.

## Was It Useful

Yes. Improved passkey login UX.

## Impact Analysis

- **Scope:** Single file, +22/-15 lines
- **Risk:** Low

## Relationships

Enhances the passkey flow from 160.

## Confidence Notes

High. Standard WebAuthn pattern.
