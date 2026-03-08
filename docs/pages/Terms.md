# Terms - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Terms & Conditions`
- Route: `/terms`
- Purpose: Legal agreement page describing usage policy, conduct rules, liability, account controls, and consent terms for platform users.

## Layout & Structure
- Centered legal-document card (`max-w-4xl`) in padded background.
- Header:
  - legal badge `Legal Agreement`
  - page title
  - dynamic last-updated string.
- Body sections:
  - intro statement
  - section divider
  - numbered sections 1 through 12 (with styled highlights, including conduct warning card).
- Footer with copyright line.

## Theme & Styling
- Similar legal style to privacy page with light/dark support.
- Indigo as legal accent color.
- Section 3 (`User Conduct`) rendered as high-contrast red/pink gradient warning block.
- Structured typography and numbered badges for readability.

## Content Details
Exact key labels/headings:
- `Legal Agreement`
- `Terms & Conditions`
- `Last Updated: <dynamic date>`
- Major headings:
  - `1 Purpose of the Platform`
  - `2 Account Policy`
  - `3 User Conduct`
  - `4 Buyer Request and Communication Policy`
  - `5 Digital Agreements and Signatures`
  - `6 Call and Chat Policy`
  - `7 Ratings and Transparency`
  - `8 Subscription and Enterprise Benefits`
  - `9 Liability`
  - `10 Account Suspension or Cancellation`
  - `11 Change Policy`
  - `12 Consent`
- Conduct warning lead:
  - `The following activities are strictly prohibited and will be subject to action:`
- Liability warning phrase includes:
  - `If the user violates policies... the user will bear the responsibility himself.`

## Interactions & Functionality
- Static legal content.
- Dynamic behavior:
  - last-updated date is generated from current date at render.
- No API calls or form interactions.

## Images & Media
- No media files.
- Uses decorative gradients and simple inline SVG icon in conduct section.

## Extra Notes / Metadata
- SEO:
  - no explicit metadata tags managed in component.
- Accessibility:
  - dense legal content is structured with headings/lists for screen reader navigation.
- Compliance:
  - content contains policy language about recordings, signatures, and liability; legal review alignment may be needed before production publication.
