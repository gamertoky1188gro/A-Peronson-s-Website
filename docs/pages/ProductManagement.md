# ProductManagement - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Product Management`
- Route: `/product-management`
- Purpose: Factory/buying-house product list and action dashboard for product CRUD/media workflow entry.

## Layout & Structure
- Header row:
  - page title + subtitle on left
  - action buttons on right (`+ Create Product`, `+ Upload Video`)
- Product list section:
  - vertical list of product cards (static sample state in current component).
- Card layout:
  - left: media placeholder + product text
  - right: action buttons (`Edit`, `Delete`, `Analytics`).

Approximate placement:
- Header top 10-20% of content area.
- List occupies remainder.

## Theme & Styling
- White background with blue CTA accents.
- Primary blue: `#0A66C2`.
- Secondary muted text: `#5A5A5A`.
- Cards:
  - white, bordered, rounded, shadow.

## Content Details
Exact text:
- Heading: `Product Management`
- Subtitle: `Manage factory products and media`
- Top buttons:
  - `+ Create Product`
  - `+ Upload Video`
- Sample product rows:
  - `Pique Polo` / `Knitwear • MOQ 200`
  - `Denim Jacket` / `Woven • MOQ 300`
- Row buttons:
  - `Edit`
  - `Delete`
  - `Analytics`

## Interactions & Functionality
- Current component behavior:
  - products come from local `useState` static array.
  - no API calls in this file.
  - buttons are UI placeholders (no onClick handlers attached in source).
- Intended behavior direction (implied by labels):
  - create product flow
  - video upload flow
  - edit/delete actions
  - per-product analytics view

## Images & Media
- Uses gray rectangle placeholder (`w-20 h-16`) as product thumbnail.
- No actual image/video source URLs in current component.

## Extra Notes / Metadata
- SEO:
  - no explicit page metadata.
- Accessibility:
  - interactive buttons should later include handlers and loading states.
- Responsive:
  - content constrained in `max-w-7xl` and remains readable on small screens.
