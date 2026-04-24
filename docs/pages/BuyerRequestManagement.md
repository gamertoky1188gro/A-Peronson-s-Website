# BuyerRequestManagement - Complete Page Specification (Manual)

## Page Title & Description

- Title: `Post New Buyer Request`
- Route: `/buyer-requests`
- Purpose: Multi-step buyer request creation plus inline management (view/edit/delete) of the user’s existing requests.

## Layout & Structure

- Top header:
  - main title
  - step indicator `Step X of 3`
- Creation panel card:
  - Step 1 fields: category basics
  - Step 2 fields: fabric/compliance/logistics
  - Step 3 fields: notes + submit/back
- Feedback line below step panel (success/error).
- “My Requests” panel:
  - header + refresh button
  - loading / empty / list states
  - each request row has display data + edit/delete controls
  - inline edit form appears beneath selected request.

Approximate placement:

- Step form in upper half.
- Request management list below.

## Theme & Styling

- White panel surfaces with blue action buttons.
- Primary accent: `#0A66C2`.
- Error text: red.
- Success text: green.
- Inputs: bordered rounded utility styling.

## Content Details

Exact notable text:

- Header: `Post New Buyer Request`
- Step indicator: `Step {step} of 3`
- Step 1 labels:
  - `Category`
  - `Subcategory`
  - `Quantity`
  - `Target Price`
  - button: `Continue`
- Step 2 labels:
  - `Fabric Type`
  - `GSM`
  - `Certification Required`
  - `Shipping Terms`
  - button: `Continue`
- Step 3:
  - `Additional Notes`
  - buttons: `Post Request`, `Posting...`, `Back`
- Requests panel:
  - title: `My Requests`
  - refresh button: `Refresh` / `Refreshing...`
  - state text:
    - `Loading your requests...`
    - `No requests found.`
- Row metadata labels:
  - `Quantity:`
  - `Price Range:`
  - `Material:`
  - `Status:`
- Row buttons:
  - `Edit`
  - `Delete` / `Deleting...`
- Edit form placeholders:
  - `Category`, `Subcategory`, `Quantity`, `Target Price`, `Timeline (days)`, `Fabric Type`, `GSM`, `Certifications (comma separated)`, `Shipping Terms`, `Additional Notes`
  - action buttons: `Save` / `Saving...`, `Cancel`

## Interactions & Functionality

- Initial load:
  - calls `GET /requirements` with auth token.
- Create flow:
  - builds payload via `formToRequirementPayload`:

```json
{
  "category": "...",
  "quantity": "...",
  "price_range": "...",
  "material": "...",
  "timeline_days": "...",
  "certifications_required": ["..."],
  "shipping_terms": "...",
  "custom_description": "Subcategory: ...\nGSM: ...\n..."
}
```

- submits `POST /requirements`.
- on success resets form and reloads list.
- Edit flow:
  - `startEditing` maps existing requirement to edit form.
  - `PATCH /requirements/:id` with transformed payload.
  - reloads list on success.
- Delete flow:
  - `DELETE /requirements/:id`.
  - clears edit mode if deleted row is currently open.
- Feedback:
  - central success/error message state shown below creation card.
- Auth failure:
  - surfaces `You are not authenticated. Please sign in again.`

## Images & Media

- No images/videos/media embeds in this page.

## Extra Notes / Metadata

- SEO:
  - no page-specific metadata.
- Accessibility:
  - field labels present; consider adding explicit `<label htmlFor>` associations for all controls.
- Responsive:
  - contained width (`max-w-4xl`) with stacked sections.
