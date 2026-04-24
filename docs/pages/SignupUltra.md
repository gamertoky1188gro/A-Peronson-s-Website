# SignupUltra - Complete Page Specification (Manual)

## Page Title & Description

- Page title: `SignupUltra`
- Source file: `src/pages/auth/SignupUltra.jsx`
- Route: `/:time/meow/:date/SignupUltra`
- Purpose: Time/date-gated elevated registration portal for creating high-privilege/root accounts.

## Layout & Structure

- Full-screen centered auth card layout.
- Background:
  - Dark slate full-page backdrop.
- Main card:
  - Max width `2xl`, white, thick indigo border, glow shadow.
  - Header row:
    - small `Ultra Access` badge.
    - large `Elevated Registration` title.
  - Intro paragraph under title.
  - 2-column responsive form grid (`md:grid-cols-2`).
  - Security notice panel spans both columns.
  - Error panel spans both columns (conditional).
  - Submit button row spans both columns.

Approximate placement:

- Card centered both horizontally/vertically.
- Form occupies center ~60-75% viewport width on desktop.

## Theme & Styling

- Background: `bg-slate-900`.
- Primary accent: indigo (`bg-indigo-600`, `border-indigo-500`).
- Text:
  - Primary: slate dark (`text-slate-900` on card).
  - Secondary: slate gray.
- Security notice:
  - Indigo-tinted background and border.
- Error:
  - Rose-red text and soft red background.

## Content Details

Exact text content:

- `Ultra Access`
- `Elevated Registration`
- `Authorized personnel only. Create Admin, Agent, or Owner accounts directly.`
- `Full Name`
- `Secret Email`
- `Master Password`
- `Elevated Role`
- `Administrator`
- `System Owner`
- `Operational Agent`
- `Buying House (Root)`
- `Factory (Root)`
- `Buyer (Root)`
- `HQ Country`
- `Organization / Entity`
- `⚠️ Security Notice:`
- `Admin and Owner accounts are automatically granted full system verification and override capabilities. All actions performed through this terminal are logged for security auditing. High-level accounts must maintain 2FA after initial login.`
- Password placeholder: `••••••••`
- Submit text states:
  - `INITIALIZING ACCOUNT...` (loading)
  - `PROVISION ACCOUNT` (idle)
- Error prefix:
  - `Auth Error:`

## Interactions & Functionality

- Route-param authorization gate:
  - Reads `time` and `date` params.
  - Validates `date` equals current day format `DD:MM:YY`.
  - Validates time difference <= 2 minutes from current local time.
  - If invalid: redirect to `/` via `<Navigate />`.
- Form state:
  - Controlled fields: `name`, `email`, `password`, `role`, `country`, `organization`.
- Submit flow:
  - POST `/auth/register` with payload:
    - `name`, `email`, `password`, `role`, `company_name`, `profile.country`.
  - On success:
    - save session via `saveSession`.
    - navigate to role home (`getRoleHome`).
  - On failure:
    - show `Auth Error: {message}`.

## Images & Media

- No image or video assets.
- Visual identity is style-driven (badge, border glow, color blocks).

## Extra Notes / Metadata

- Security behavior:
  - Access depends on URL freshness and exact date/time matching window.
  - Intended as hidden/internal elevated signup endpoint.
- Accessibility:
  - Labels present for each input/select.
  - Error and loading states are text-visible.
- SEO:
  - No meta title/description controls in component.
