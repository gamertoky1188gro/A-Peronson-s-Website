# ContractVault - Complete Page Specification (Manual)

## Page Title & Description
- Title: `🔒 Contract Vault`
- Route: `/contracts`
- Purpose: End-to-end contract lifecycle workspace (draft, signatures, artifact lock, archive) with audit visibility and controlled role actions.

## Layout & Structure
- Two-level layout:
1. Main content grid (`max-w-7xl`):
  - left sidebar dashboard navigation.
  - right main contract workspace.
2. Slide-out right drawer for selected contract details/actions.

Main workspace sections:
- Header with date range and status filter controls.
- Step 1 Draft creation form.
- Error/action message area.
- Contract list cards.

Drawer sections:
- Contract summary.
- Lifecycle timeline (5 steps).
- Step action controls.
- Digital signature status block.
- Generated artifact audit block.
- Download button.

## Theme & Styling
- Light enterprise dashboard style with blue action accents.
- Status chips:
  - draft -> gray
  - pending -> orange
  - signed -> green
  - archived -> slate
- Emphasis color:
  - primary action: `#0A66C2`.

## Content Details
Exact key text:
- Heading: `🔒 Contract Vault Encrypted & Timestamped`
- Subtitle: `Step-driven execution from draft through signatures, server-generated artifacts, lock, and archive.`
- Draft section heading: `Step 1 · Draft creation`
- Draft button text: `Create Draft (POST /documents/contracts/draft)`
- Filters:
  - status options: `All`, `Draft`, `Pending Signature`, `Signed`, `Archived`
- Card actions:
  - `Details`
  - `Download Generated PDF` / `Generated PDF pending`
- Drawer:
  - `Lifecycle timeline`
  - timeline step labels:
    - `Draft created and shared`
    - `Buyer signature`
    - `Factory signature`
    - `Generated artifact locked`
    - `Archived`
  - `Step actions (role-sensitive)`
  - `Step 2 · Buyer signature (PATCH /signatures)`
  - `Step 3 · Factory signature (PATCH /signatures)`
  - `Step 4 · Lock generated artifact`
  - `Lock generated artifact (PATCH /artifact)`
  - `Step 5 · Archive (PATCH /artifact)`
  - `Digital signatures`
  - `Generated artifact audit`
  - download button states:
    - `Download PDF`
    - `Download after generation`

## Interactions & Functionality
- Load contracts:
  - `GET /documents/contracts`.
  - shows `AccessDeniedState` on `403`.
- Draft creation:
  - `POST /documents/contracts/draft` with form data.
- Signature steps:
  - `PATCH /documents/contracts/:id/signatures` for buyer/factory.
- Artifact operations:
  - `PATCH /documents/contracts/:id/artifact` with `status=locked|archived`.
- Filtering:
  - lifecycle filter + date range (`fromDate`, `toDate`).
- Drawer open:
  - selecting card or details button sets active contract.
- Role-sensitive blocking:
  - computes actionable blockers (buyer sign/factory sign/finalize/archive) and disables action buttons with guidance messages.
- Download:
  - enabled only when generated artifact path exists.

## Images & Media
- No image/video media assets.
- Contract artifact is downloadable PDF link (generated server-side).

## Extra Notes / Metadata
- SEO:
  - no explicit metadata.
- Accessibility:
  - drawer close interactions and button labels are explicit; consider focus-trap for improved keyboard UX.
- Security UX:
  - contract actions reflect backend role constraints and preconditions to avoid invalid transitions.
