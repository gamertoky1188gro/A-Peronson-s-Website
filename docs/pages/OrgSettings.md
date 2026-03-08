# OrgSettings - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `OrgSettings`
- Source file: `src/pages/OrgSettings.jsx`
- Route: `/org-settings` (owner/admin only)
- Purpose: Organization administration hub for profile data, verification/subscription status, security toggles, member management link, and assistant knowledge CRUD.

## Layout & Structure
- Page wrapper: full-height white container.
- Header block:
  - Title and subtitle.
- Access guard:
  - Non-owner/admin shows `AccessDeniedState`.
  - Owner/admin sees settings panel.
- Settings panel:
  - Tab strip (wrap-enabled):
    - `General Info`
    - `Verification`
    - `Branding`
    - `Security`
    - `Members`
    - `Subscription`
    - `Assistant Knowledge`
  - Active tab content renders below.
- Assistant Knowledge tab layout:
  - 2-column grid:
    - Left: add/edit form.
    - Right: scrollable entries list with edit/delete actions.

Approximate placement:
- Tabs at top of panel (horizontal band).
- Content area beneath occupying full width.
- Assistant tab split 50/50 desktop, stacked mobile.

## Theme & Styling
- Accent blue `#0A66C2` used for active tab underline and primary buttons.
- Secondary text: `#5A5A5A`.
- Status chips:
  - Green active.
  - Amber expiring soon.
  - Red expired.
- Panel/cards:
  - White backgrounds with rounded corners and shadows.

## Content Details
Exact textual content:
- `Organization Settings`
- `Manage organization profile, verification, branding, security and subscription`
- `General Info`
- `Verification`
- `Branding`
- `Security`
- `Members`
- `Subscription`
- `Assistant Knowledge`
- `Organization Name`
- `Industry Category`
- `Registration Number`
- `Upload trade license and certifications`
- `Verification is subscription-based, not permanent. Keep premium active to keep the badge visible.`
- `Upload Trade License`
- `Upload ISO / WRAP`
- `Primary Contact Email`
- `Support Contact Number`
- `Enable 2FA`
- `Active sessions and login activity are shown here.`
- `Open Member Management`
- `Current Plan: Premium Monthly`
- `Verification is subscription-based, not permanent.`
- `Renew premium monthly`
- `Remaining:`
- `Entry Type`
- `FAQ`
- `Company Fact`
- `Question`
- `Answer`
- `Keywords (comma separated)`
- `Save Entry`
- `Update Entry`
- `Cancel edit`
- `Assistant Knowledge Entries`
- `Keywords:`
- `Edit`
- `Delete`
- `No org-specific entries yet.`

Dynamic status text:
- Verification badge labels:
  - `Verified active`
  - `Expiring soon`
  - `Expired (renew to restore badge)`
- Remaining days display from local state.

## Interactions & Functionality
- State:
  - Active tab.
  - Remaining days (`remainingDays`, initial `4`).
  - Knowledge entries list.
  - Knowledge form data.
  - Edit mode (`editingId`).
- Role policy:
  - `isOwnerAdmin` computed from current user role.
- Assistant knowledge data:
  - Load: GET `/assistant/knowledge`.
  - Create: POST `/assistant/knowledge`.
  - Update: PUT `/assistant/knowledge/{id}`.
  - Delete: DELETE `/assistant/knowledge/{id}`.
- Tab interaction:
  - Clicking each tab updates `tab` state.
  - `Assistant Knowledge` tab triggers data load.
- Subscription interaction:
  - `Renew premium monthly` adds 30 days locally.
- Knowledge form interaction:
  - Edit pre-fills form.
  - Save decides create vs update by `editingId`.
  - `Cancel edit` resets form.

## Images & Media
- No media files used.
- All data entry is text/checkbox/select/textarea based.

## Extra Notes / Metadata
- `tab !== 'general' && !isOwnerAdmin` branch exists but is effectively unreachable because full panel already gated by owner/admin condition.
- Accessibility:
  - Visible labels for all major fields.
  - Tab controls are buttons with textual names.
- SEO:
  - No page-level meta tags managed.
