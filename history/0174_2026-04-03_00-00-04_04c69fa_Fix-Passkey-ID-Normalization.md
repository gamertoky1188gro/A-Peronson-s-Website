## Commit Metadata

- **Hash:** 04c69face6723954f4964e16d5c4772fe8d40203
- **Parent:** 558f53e30fb44fd433a93e4c76a3b3382f7cfe6f
- **Author:** gamertoky1188gro
- **Date:** 2026-04-03 00:00:04
- **Message:** Fix passkey id normalization

## Custom Title

Fix passkey credential ID normalization

## High-Level Summary

Added comprehensive normalization for passkey credential IDs (Base64URL padding stripping and lowercasing) to match across registration and authentication ceremonies where browsers may encode IDs differently.

## File-by-File Breakdown

- **server/services/passkeyService.js** — Added `normalizeCredentialId()`, applied to both storage and lookup operations

## Detailed Diff Analysis

Added `normalizeCredentialId(id)` that lowercases and strips Base64 padding. Applied during:

- Registration verification (when storing the new credential)
- Login option generation (when building excludeCredentials/allowCredentials)
- Login verification (when looking up the credential)
- Passkey CRUD operations (add/remove)

## Why This Change

Browsers may encode credential IDs with inconsistent casing or padding. Without normalization, stored IDs wouldn't match during login.

## Was It Useful

Yes. Critical for passkey reliability.

## Impact Analysis

- **Scope:** Single file, +27/-6 lines
- **Risk:** Low

## Relationships

Follows public key normalization (173).

## Confidence Notes

High.
