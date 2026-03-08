# Privacy - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Privacy Policy`
- Route: `/privacy`
- Purpose: Legal/privacy disclosure for data handling, fraud prevention, security, user rights, and contact policy.

## Layout & Structure
- Full-page centered legal document container (`max-w-4xl`) within padded background.
- Main card with rounded border and long-form content stack.
- Header area:
  - legal badge `Legal Documentation`
  - page title
  - dynamic last-updated date string.
- Body:
  - introductory policy paragraph.
  - section divider.
  - numbered sections (1,2,3,4,5,6,7,8,13 in source).
  - highlighted fraud prevention gradient card.
  - final contact block.
  - footer copyright line.

## Theme & Styling
- Supports light/dark visual variants.
- Legal-doc aesthetic:
  - neutral slate palette.
  - section blocks and soft borders.
  - highlighted fraud section with sky/indigo gradient.
- Emphasis:
  - numbered badges and heading typography.

## Content Details
Exact key text:
- Badge: `Legal Documentation`
- Title: `Privacy Policy`
- `Last Updated: <dynamic date>`
- Core section titles:
  - `1 Information We Collect`
  - `2 How We Use Your Information`
  - `3. Fraud Prevention Measures`
  - `4. Data Sharing Policy`
  - `5. Call Recording & Chat Storage`
  - `6. Digital Contracts & Signatures`
  - `7. Data Security`
  - `8. User Rights`
  - `13. Contact Information`
- Category subheadings in section 1:
  - `Account Data`
  - `Business Data`
  - `Communications`
  - `Technical Information`
- Contact line:
  - `support@gartexhub.com`
- Footer line:
  - `© 2026 GarTexHub Professional Network. All Rights Reserved.`

## Interactions & Functionality
- Static legal content page.
- Dynamic behavior:
  - computes `lastUpdated` using `new Date().toLocaleDateString('en-GB', ...)`.
- Contains plain anchor elements for social labels (`LinkedIn`, `Facebook`) with placeholder `href="#"`.
- No backend/API interaction in this component.

## Images & Media
- No external images or video.
- Visual effects created via gradients/shapes and SVG check icon in fraud section list.

## Extra Notes / Metadata
- SEO:
  - no explicit `<title>`/meta management in this component.
- Accessibility:
  - clear heading hierarchy and list usage.
  - ensure placeholder social links are replaced with valid URLs before production.
- Compliance note:
  - section numbering jumps to `13` in source; if legal numbering standards require continuity, update copy accordingly.
