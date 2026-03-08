# VerificationPage - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Verification Center`
- Routes: `/verification`, `/verification-center` (shared component)
- Purpose: Role/region-aware document upload and verification readiness dashboard with credibility score and subscription renewal state.

## Layout & Structure
- Section 1: header card
  - title + description + help center link.
- Section 2: subscription renewal state card
  - state label + badge.
- Section 3: document requirements card
  - top controls: region selector (disabled for buyers), buyer country selector for buyers, guidance banner
  - two-column lists:
    - mandatory documents
    - optional documents
  - each row: label + status chip + upload button.
- Section 4: credibility score card.
- Footer action row:
  - `Refresh status` button
  - inline feedback/error text.
- Hidden file input for upload picker.

Approximate placement:
- Top summary cards occupy upper third.
- Document matrix occupies central majority.
- Score + controls near bottom.

## Theme & Styling
- White cards with slate borders and subtle status colors.
- Status chip colors:
  - approved: green
  - uploaded/pending: amber
  - missing: red
- Guidance banners:
  - EU: emerald tone
  - US: sky tone
  - generic prompt: amber tone
- Typography:
  - title-heavy with clear metadata tiers.

## Content Details
Exact key text:
- Header:
  - `Verification Center`
  - `Role and region-specific verification requirements for trusted international sourcing.`
  - `Need setup help? Visit the Help Center verification guide.`
- Subscription:
  - `Subscription renewal state`
  - state labels: `Active`, `Expiring`, `Expired`
- Document section:
  - `Document Requirements`
  - `Region`
  - buyer hint: `Region is auto-mapped from buyer country for compliance.`
  - buyer country prompt:
    - `Buyer Country`
    - `Select country`
    - `Saving country...` (when persisting)
    - `Buyer country is required before uploading verification documents.`
  - column titles:
    - `Mandatory documents`
    - `Optional documents`
  - upload button labels: `Upload`, `Uploading...`
- Credibility panel:
  - `Credibility score panel`
  - `<score>/100`
  - `More licensing proof increases international credibility.`
- Bottom:
  - `Refresh status`
- Dynamic success format:
  - `<Document Label> uploaded and verification state updated.`

## Interactions & Functionality
- Initial load:
  - parallel fetch:
    - `GET /verification/me`
    - `GET /subscriptions/me`
- Region logic:
  - Buyer region auto-derived from selected buyer country.
  - Non-buyer users can manually choose region select.
- Buyer country persistence:
  - debounced (`350ms`) auto-save via `POST /verification/me` with updated `buyer_country` and `buyer_region`.
- File upload flow:
1. User clicks upload for a document key.
2. Hidden file picker opens.
3. File posted via `fetch` multipart to `POST /documents`.
4. On upload success, verification document status patched with `POST /verification/me`.
5. UI updates status and feedback message.
- Status chips:
  - status normalization maps API values to `approved/uploaded/missing`.
- Credibility score:
  - local UI score calculated from required + optional statuses.
- Refresh:
  - re-fetches verification/subscription states.

## Images & Media
- No fixed media assets.
- Uses file input to upload document files.

## Extra Notes / Metadata
- SEO:
  - no explicit metadata tags in component.
- Accessibility:
  - hidden file input is triggered programmatically; ensure keyboard focus guidance is tested.
  - status-only color indicators are accompanied by status text labels.
- Responsive:
  - document lists render in single-column on smaller screens and two-column on medium+.
