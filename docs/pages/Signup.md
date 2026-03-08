# Signup - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `Signup`
- Route: `/signup`
- Purpose: Create a new account (buyer/factory/buying house), seed initial profile fields, then start onboarding flow.

## Layout & Structure
- Full-screen centered form card on light background.
- Card width: `max-w-2xl`.
- Structure:
1. Header (title + onboarding note).
2. Two-column form grid on desktop.
3. Verification info panel.
4. Error row (conditional).
5. Action row with primary submit + login link.

Approximate placement:
- Main card centered (x=50%, y=50%).
- Form fields fill central 70-80% area of card.

## Theme & Styling
- Light neutral palette with indigo action emphasis.
- Button:
  - primary: `bg-indigo-600 text-white`.
- Inputs/selects:
  - `border rounded-lg px-4 py-3`.
- Info panel:
  - gray surface with subtle border.
- Typography:
  - title `text-3xl font-bold`
  - helper text `text-sm text-gray-600`.

## Content Details
Exact text:
- Title: `Create account`
- Subtitle: `3-step onboarding starts after signup: profile image, organization name, category selection.`
- Labels:
  - `Full Name`
  - `Email`
  - `Password`
  - `Account Type`
  - `Country`
  - `Organization Name`
- Account type options:
  - `Buyer`
  - `Factory`
  - `Buying House`
- Verification panel:
  - `Verification happens after signup. Create your account first, then upload role and region-specific documents in Verification Center.`
  - `Need the full checklist? Go to Verification Center or read Help Center guidance.`
- Buttons/links:
  - submit idle: `Create account`
  - submit loading: `Creating account...`
  - secondary link: `Have an account? Login`
- Error line: runtime API error text (red).

## Interactions & Functionality
- Controlled form state:
  - `name`, `email`, `password`, `role`, `country`, `organization`.
- Submit behavior:
1. Prevent default submit.
2. Build payload:
```json
{
  "name": "...",
  "email": "...",
  "password": "...",
  "role": "buyer",
  "company_name": "...",
  "profile": { "country": "..." }
}
```
3. `POST /auth/register` via `apiRequest`.
4. Save session with `saveSession(data.user, data.token)`.
5. Redirect to role home via `getRoleHome`.
- Error handling:
  - catches API errors and renders `err.message`.
- Link behaviors:
  - Verification link -> `/verification`
  - Help Center link -> `/help`
  - Login link -> `/login`

## Images & Media
- No images/videos/icons beyond text and form controls.

## Extra Notes / Metadata
- SEO:
  - no page-level metadata in this component.
- Accessibility:
  - labeled inputs and select.
  - disabled state on submit while request is active.
- Responsive:
  - grid collapses to one column on smaller viewports.
