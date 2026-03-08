# HelpCenter - Complete Page Specification (Manual)

## Page Title & Description
- Title: `HELP CENTER – GarTexHub`
- Route: `/help`
- Purpose: Operational manual page with structured guidance sections, searchable FAQ, admin FAQ management tools, and support CTA.

## Layout & Structure
- Page header (centered title + subtitle).
- 2-column main grid:
1. Main content (left, large):
  - 9 structured help sections.
  - FAQ section with search + expandable entries.
  - admin-only FAQ management panel (if owner/admin).
  - contact support CTA block.
2. Sidebar (right):
  - quick navigation anchor list.
  - floating assistant info card.

## Theme & Styling
- Light documentation dashboard aesthetic.
- Section cards:
  - white background, borders, subtle shadows.
- Accent blue (`#0A66C2`) for links and CTAs.
- Support section uses dark contrast block.

## Content Details
Key exact text:
- Header:
  - `HELP CENTER – GarTexHub`
  - `Professional operational manual and platform guidance.`
- Section titles:
  - `1. Quick Start Guide`
  - `2. Account Types`
  - `3. Verification Process`
  - `4. Messaging & Conversation Rules`
  - `5. Subscription Plans`
  - `6. Video & Audio Calls`
  - `7. Contracts & Legal Vault`
  - `8. Security & Data Protection`
  - `9. Floating AI Assistant`
  - `10. Frequently Asked Questions (FAQ)`
  - `11. Contact Support`
- FAQ search placeholder: `Search FAQs...`
- Admin panel title:
  - `Admin: Manage Knowledge Base FAQ`
- Contact buttons:
  - `Open Support Ticket`
  - `Live Chat`

## Interactions & Functionality
- Static guide sections rendered from `HELP_SECTIONS` array.
- FAQ logic:
  - combines dynamic managed entries + static FAQs.
  - filtered by search query against question/answer.
  - rendered as `<details>` expanders.
- Admin-only FAQ management:
  - loads via `GET /assistant/knowledge`.
  - create via `POST /assistant/knowledge`.
  - update via `PUT /assistant/knowledge/:id`.
  - delete via `DELETE /assistant/knowledge/:id`.
  - form fields: question, answer, keywords.
- Sidebar anchors scroll to section IDs.

## Images & Media
- No images/videos.
- Iconography is text and native disclosure markers.

## Extra Notes / Metadata
- SEO:
  - no page-level metadata tags.
- Accessibility:
  - FAQ uses semantic `<details>/<summary>` pattern.
- Role behavior:
  - admin panel only visible to `owner` or `admin`.
