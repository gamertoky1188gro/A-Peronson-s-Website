## Commit Metadata

- **Hash:** c6b992e9a1bd4d43a2a68114bc3f987ad7ec254c
- **Parent:** 03f6becc8bebc6ada1f04ebed859d9919c629fb7
- **Author:** gamertoky1188gro
- **Date:** 2026-03-27 21:08:51
- **Message:** Add LC type fields and self-delete account

## Custom Title

LC type fields for payment proofs and self-delete account feature

## High-Level Summary

Added LC type (sight/usance) and usance_days fields to payment proofs with backend validation. Added a self-delete account endpoint requiring password confirmation. Refactored admin panel to a blue/sky theme (from orange), added admin passkey support, and reworked security cards with save buttons for MFA/device/passkey actions.

## File-by-File Breakdown

- **prisma/schema.prisma** — Added `lc_type` and `usance_days` columns to payment_proofs table
- **server/controllers/authController.js** — Unchanged in diff, likely referenced
- **server/controllers/userController.js** — Added DELETE /users/me endpoint
- **server/middleware/adminSecurity.js** — Updated for admin auth changes
- **server/routes/userRoutes.js** — Added DELETE route for self-delete
- **server/services/adminMasterService.js** — Updated admin auth config response
- **server/services/paymentProofService.js** — Added LC type normalization/validation, usance days validation
- **server/services/securityService.js** — Added admin_auth state, admin MFA/device/passkey CRUD actions
- **server/services/userService.js** — Added deleteUserWithPassword function
- **src/App.css** — Major CSS refactor: orange→blue theme, removed radial gradients, flattened card styles, simplified glow effects, new admin-sidebar-item classes with blue active state
- **src/pages/AdminPanel.jsx** — Blue theme, passkey input field, security action buttons (Save MFA, Register Device, Save Passkey), moved AccessDeniedState check, new blue color palette for charts
- **src/pages/ContractVault.jsx** — Added LC type selector (sight/usance), usance days dropdown (30/60/90/180/custom), displays LC type in proof details
- **src/pages/OrgSettings.jsx** — Added "Delete account" section with password confirmation, imported clearSession

## Detailed Diff Analysis

**SecurityService.js:** New `admin_auth` state object with mfa_code, device_allowlist, passkeys. Added `getAdminAuthConfig()` function. New actions: `security.admin.mfa.set`, `security.admin.device.add`, `security.admin.device.remove`, `security.admin.passkey.add`, `security.admin.passkey.remove`.

**UserService.js:** `deleteUserWithPassword()` verifies password via bcrypt, anonymizes user data (name→"Deleted User", email→deleted+id@invalid), removes connections.

**PaymentProofService.js:** `normalizeLcType()` accepts 'sight' or 'usance'. `normalizeUsanceDays()` caps at 365. `createPaymentProof` now requires lc_type and conditionally requires usance_days for usance.

**App.css:** Complete theme swap: orange→blue (`#4B9DFB`, `#6366f1`). Plasma/current/noise layers made invisible (opacity:0). `.admin-panel` and `.admin-card` lost borders and shadows. New `.admin-sidebar-item` with transparent background, blue active state with glowing rail. Removed all radial gradients and pseudoelement overlays.

**ContractVault.jsx:** Payment form now has LC type select, usance days dropdown with custom option, displays LC type and days in proof item details.

**OrgSettings.jsx:** Delete account section with password input, confirmation dialog, API call to `/users/me`, redirects to `/login` after deletion.

## Why This Change

LC types are a real requirement for textile trade payment proofs. Self-delete addresses user data privacy/control. The admin blue theme swap suggests a design system change from amber to blue.

## Was It Useful

Yes. LC fields are domain-relevant. Self-delete is a compliance requirement for user data management.

## Impact Analysis

- **Scope:** 13 files across backend, frontend, and CSS
- **Risk:** Medium — new validation logic for payment proofs could reject existing data
- **Security:** Self-delete requires password verification; admin auth uses stored/hybrid config

## Relationships

The largest commit in the 151-160 range. Sets up the blue theme used in subsequent admin work.

## Confidence Notes

High. All changes are well-structured with proper validation and error handling.
