# MvpDashboard - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `MvpDashboard`
- Source file: `src/pages/MvpDashboard.jsx`
- Route: `/mvp` (public route, acts as integrated demo/operations console)
- Purpose: End-to-end MVP control panel for auth, onboarding, verification, request/product posting, feed loading, conversation lock actions, and assistant ask flow.

## Layout & Structure
- Root layout:
  - Header bar with page title, subtitle, optional logout button.
  - Feedback message line under header.
- Conditional body:
  - Logged-out view:
    - Two-column grid with Register and Login forms.
  - Logged-in view:
    - Two-column main grid with multiple cards.
- Logged-in cards (order):
  1. `Onboarding (3 Steps)` and verification/subscription/analytics refresh tools.
  2. Either `Post Buyer Request` (if role buyer) or `Post Company Product` (otherwise).
  3. Full-width `Combined Feed (Buyer Requests + Company Products)` card.
  4. `Conversation Lock` card.
  5. `Rule-Based AI Guidance` card.

Approximate placement:
- Header top 10%.
- Form/grid body 10-100%.
- Full-width feed card spans both columns.

## Theme & Styling
- Uses generic class names (`page`, `topbar`, `grid`, `card`, `stack`) plus neo/cyberpunk root classes.
- Visual style is functional/utilitarian (form-heavy) rather than decorative.
- Feedback text appears as plain paragraph.

## Content Details
Exact text appearing on page:
- `GarTexHub Enterprise UX MVP`
- `Behavioral architecture for trust-first B2B textile commerce.`
- `Logout`
- `Register`
- `Create Account`
- `Login`
- `Onboarding (3 Steps)`
- `Save Onboarding`
- `Role:`
- `Verified badge:`
- `Submit Verification Bundle`
- `Refresh Verification / Subscription / Analytics`
- `Subscription:`
- `Verification Missing:`
- `Analytics events:`
- `Post Buyer Request`
- `Publish Request`
- `Post Company Product`
- `Publish Product`
- `Combined Feed (Buyer Requests + Company Products)`
- `Unique Toggle`
- `All`
- `Buyer Requests`
- `Company Products`
- `Load Feed`
- `Tags:`
- `Conversation Lock`
- `Request ID to claim`
- `Start Conversation / Claim & Respond`
- `Request ID to grant`
- `Target Agent User ID`
- `Grant Access`
- `Rule-Based AI Guidance`
- `Ask about setup, verification, premium, help`
- `Ask Assistant`

Input placeholders:
- Auth: `Name`, `Email`, `Password`.
- Onboarding:
  - `1) Profile Image URL`
  - `2) Organization Name`
  - `3) Category Selection (comma separated)`
- Buyer request:
  - `Category`, `Quantity`, `Price Range`, `Material`, `Timeline Days`, `Certifications (comma separated)`, `Shipping Terms`, `Custom Description`.
- Product:
  - `Title`, `Material`, `MOQ`, `Lead Time Days`, `Description`, `Video URL (for gallery/reels)`.

## Interactions & Functionality
- Session persistence:
  - JWT and user saved in localStorage.
- Auth actions:
  - `register()` -> `/auth/register`.
  - `login()` -> `/auth/login`.
  - `logout()` clears local session.
- Onboarding:
  - POST `/onboarding`.
- Buyer request creation:
  - POST `/requirements`.
- Product creation:
  - POST `/products`.
- Feed:
  - GET `/feed?unique={bool}&type={all|requests|products}`.
- Verification:
  - POST `/verification/me`.
- Status refresh:
  - Parallel GET calls:
    - `/verification/me`
    - `/subscriptions/me`
    - `/analytics/summary`
- Assistant ask:
  - POST `/assistant/ask`.
  - Handles `forward_to_agent` fallback.
- Conversation lock:
  - Claim: POST `/conversations/{id}/claim`
  - Grant: POST `/conversations/{id}/grant` with target agent id.
- UI state:
  - Multiple controlled form states and feedback message string.

## Images & Media
- No image tags.
- Product video accepted as URL text input only.
- Feed items render emoji/icon text if provided by backend.

## Extra Notes / Metadata
- This page functions as an operational test harness touching many backend modules.
- Role-sensitive areas:
  - Buyer sees request form.
  - Non-buyer sees product form.
  - Org management grant controls shown only for admin/buying_house (`canManageOrg`).
- SEO:
  - No explicit page meta management.
