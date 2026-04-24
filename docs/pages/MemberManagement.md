# MemberManagement - Complete Page Specification (Manual)

## Page Title & Description

- Page title: `MemberManagement`
- Source file: `src/pages/MemberManagement.jsx`
- Route: `/member-management` (roles: `owner`, `admin`, `buying_house`, `factory`)
- Purpose: Full sub-account management UI for creating, editing, searching, resetting passwords, deactivating/removing members, and editing permission matrix.

## Layout & Structure

- Global shell: NavBar, Footer, FloatingAssistant.
- Main container: `max-w-7xl` with page title/header row.
- Header row:
  - Left: page title and subtitle.
  - Right: `+ Add New Member` button.
- Feedback banners:
  - Error banner (red).
  - Success banner (green).
- Access gate:
  - If forbidden, show `AccessDeniedState`.
  - Otherwise show member table card.
- Main card sections:
  1. Search + plan limit row.
  2. Scrollable table with columns:
     - Name, Username, Member ID, Role, Status, Actions.
  3. Row actions:
     - Edit, Reset, Deactivate, Remove.
- Modal overlays:
  - Create member modal with full form.
  - Edit member modal (`MemberEditor`) with profile/status/permissions.

Approximate placement:

- Header at top 10-15% vertical.
- Table card central.
- Modals centered overlay with dim background.

## Theme & Styling

- Base white card interface with blue accent (`#0A66C2`).
- Banners:
  - Error: red text on red-tinted background.
  - Success: green text on green-tinted background.
- Table style:
  - Small text, row separators, action buttons.
- Modal:
  - Dark translucent backdrop (`bg-black/40`).
  - White rounded content panel, scrollable max height.

## Content Details

Exact text strings:

- `Member Management`
- `Manage sub-accounts and permissions`
- `+ Add New Member`
- `Search members`
- `Free plan limit:`
- `Name`
- `Username`
- `Member ID`
- `Role`
- `Status`
- `Actions`
- `Loading members...`
- `No members found.`
- `Edit`
- `Reset`
- `Deactivate`
- `Remove`
- `Close`
- `Create member`
- `Member name`
- `Unique username`
- `Unique member ID`
- `Role`
- `Initial password`
- `Permission matrix (view/edit per module)`
- `Permissions`
- `Create`
- `Edit member:`
- `active`
- `inactive`
- `Save changes`
- `View`
- `Edit`

Dynamic feedback text:

- `Member created.`
- `Member updated.`
- `Member removed.`
- `Member deactivated.`
- `Temporary password for {name}: {temporary_password}`
- Permission conflict messages built from server constraints.

## Interactions & Functionality

- Data dependencies:
  - API base: `/org/members`.
  - Token from `getToken()`.
- Lifecycle:
  - `loadMembers()` runs on mount.
  - Fetches members + constraints.
- Search:
  - Client-side filtered list by name/username/member_id/role/status.
- Create flow:
  - Opens modal.
  - Validates conflict locally.
  - POST create request.
  - Reloads list and closes modal.
- Edit flow:
  - Opens `MemberEditor` modal for selected member.
  - PUT update request.
  - Reloads list.
- Password reset:
  - POST `/reset-password`.
  - Shows temporary password in success message.
- Deactivate/remove:
  - DELETE with query `remove=true|false`.
- Permission components:
  - `PermissionSelector` checkbox list.
  - `PermissionMatrixEditor` section-level `view/edit` toggles.

## Images & Media

- No media assets used.
- Entire page is form/table/modal based.

## Extra Notes / Metadata

- Accessibility:
  - Modal has explicit close button.
  - Form controls all have visible text placeholders/labels.
- Responsive:
  - Table area scrolls horizontally if needed.
  - Modal constrained with `max-h-[90vh]`.
- SEO:
  - No explicit page-level meta tags.
