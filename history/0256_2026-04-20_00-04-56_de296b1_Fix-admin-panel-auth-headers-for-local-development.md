## Commit Metadata

- **Hash:** de296b13ba759b0b5731d2a121498c47da3b24ca
- **Parent:** fb758bf562d754bcd246c04a27dca1c25dce1df4
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 00:04:56
- **Message:** fix admin panel auth headers for local development

## Custom Title

Fix: Fix admin panel auth headers for local development

## High-Level Summary

Fixed issue: Fix admin panel auth headers for local development. Affects 2 files (38 additions, 0 deletions).

## File-by-File Breakdown

- **src/lib/auth.js** — +36/-0 lines
- **src/pages/AdminPanel.jsx** — +2/-0 lines

## Detailed Diff Analysis

@@ -42,23 +42,35 @@ export function saveSession(user, token, { remember = true } = {}) {
-export function clearSession() {

- localStorage.removeItem(USER_KEY)
- localStorage.removeItem(TOKEN_KEY)
- sessionStorage.removeItem(TOKEN_KEY)
  -}
  +export function clearSession() {

* localStorage.removeItem(USER_KEY)
* localStorage.removeItem(TOKEN_KEY)
* sessionStorage.removeItem(TOKEN_KEY)
  +}
*

+function resolveAdminSecurityHeader(storageKey, envKey, localDevFallback = '') {

- const saved = localStorage.getItem(storageKey)
- if (saved) return saved
-
- const envValue = String(import.meta.env?.[envKey] || '').trim()
- if (envValue) return envValue
-
- const host = typeof window !== 'undefined' ? window.location.hostname : ''
- const isLocalDev = host === 'localhost' || host === '127.0.0.1' || host === '::1'
- return isLocalDev ? localDevFallback : ''
  +}

* // Inject security headers for Admin Matrix / Ultra Security Layer
* const securityHeaders = {
* 'x-admin-device': localStorage.getItem('admin_device_id') || '',
* 'x-admin-mfa': localStorage.getItem('admin_mfa_code') || '',
* 'x-admin-passkey': localStorage.getItem('admin_passkey') || '',
* 'x-admin-stepup': localStorage.getItem('admin_stepup_code') || '',
* }

## Why This Change

Bug fix: fix admin panel auth headers for local development.

## Was It Useful

Yes

## Impact Analysis

- **Scope:** **2 files**, +38/-0 lines
- **Risk:** Medium

## Relationships

Part of ongoing feature development and maintenance.

## Confidence Notes

High. Clear commit message.
