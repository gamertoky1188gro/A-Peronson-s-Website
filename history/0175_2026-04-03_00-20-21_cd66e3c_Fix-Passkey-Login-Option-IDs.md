## Commit Metadata
- **Hash:** cd66e3cc208f7498ec32c97295c0c26c6a6cec76
- **Parent:** 04c69face6723954f4964e16d5c4772fe8d40203
- **Author:** gamertoky1188gro
- **Date:** 2026-04-03 00:20:21
- **Message:** Fix passkey login option ids

## Custom Title
Fix passkey login option credential IDs

## High-Level Summary
Fixed the credential ID mapping in login option generation to use the normalized credential ID from stored passkeys instead of the raw credential ID, ensuring the allowCredentials list matches stored credentials.

## File-by-File Breakdown
- **server/services/passkeyService.js** — Updated login option generation to use stored passkey's normalized credentialID field

## Detailed Diff Analysis
When building `allowCredentials` for login options, changed from using the raw `credential.credentialID` to the already-normalized stored version. This ensures the IDs match the normalized form used during verification.

## Why This Change
Login would fail because the credential IDs sent to the browser during authentication didn't match the normalized IDs stored during registration.

## Was It Useful
Yes. Direct bugfix for passkey login.

## Impact Analysis
- **Scope:** Single file, 2 lines changed
- **Risk:** Low

## Relationships
Part of the normalization fix series (173-177).

## Confidence Notes
High.
