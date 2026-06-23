## Commit Metadata
- **Hash:** f002adda2bd99d8f3f77c00c1c2b220f8c8975e9
- **Parent:** 9e3c56e7e7190ec0477f29996c47bc695abe25e2
- **Author:** gamertoky1188gro
- **Date:** 2026-03-31 22:09:46
- **Message:** Guard passkey setup options

## Custom Title
Guard passkey setup with feature detection

## High-Level Summary
Added feature detection guards for WebAuthn passkey setup on both the OrgSettings and Login pages, ensuring the passkey UI only appears when `window.PublicKeyCredential` is available.

## File-by-File Breakdown
- **src/pages/OrgSettings.jsx** — Added `if (typeof window === 'undefined' || !window.PublicKeyCredential)` guard in `registerPasskey`
- **src/pages/auth/Login.jsx** — Same guard added in `handlePasskeyEnroll`, `handlePasskeyLogin`

## Detailed Diff Analysis
**OrgSettings.jsx:** Before browser API calls, checks for `window.PublicKeyCredential`. Catches the unsupported case early and sets a user-friendly error.

**Login.jsx:** Same pattern applied to both passkey login and enrollment handlers.

## Why This Change
Passkey features would throw cryptic errors on browsers without WebAuthn support. These guards provide clear user feedback.

## Was It Useful
Yes. Prevents runtime errors on older browsers.

## Impact Analysis
- **Scope:** 2 files, 6 insertions
- **Risk:** None

## Relationships
Follows the passkey implementation in 160.

## Confidence Notes
High.
