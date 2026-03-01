# NotificationsCenter Page Spec

- **Component:** `src/pages/NotificationsCenter.jsx`
- **Route:** `/notifications`
- **Theme Support:** Inherits global light/dark mode from `NavBar` + root `dark` class.
- **Responsive Behavior:** Tailwind utility breakpoints and shared mobile typography/layout safeguards.

## Structure
1. **Global Top Navigation (shared):** Sticky glass navigation with theme switch and quick links.
2. **Primary Content Region:** Page-specific sections/cards/tables/forms.
3. **Action Elements:** Buttons, links, filters, or messaging controls.
4. **Support Regions:** Side panels, metadata badges, summary blocks, or legal notes.

## Approximate Element Coordinates (Responsive Grid)
> Coordinates are described using relative viewport positions to remain useful across devices.

- **Top navigation:** `x: 0-100%`, `y: 0-10%`, fixed/sticky.
- **Primary heading block:** `x: 6-94%`, `y: 12-24%` (stacked tighter on mobile).
- **Main content container:** `x: 4-96%`, `y: 18-90%`.
- **Primary CTA zone:** typically `x: 60-94%`, `y: 18-34%` desktop, full-width row on mobile.
- **Footer/legal or trailing info:** `x: 0-100%`, `y: 90-100%` when present.

## Where It Is Used
- Rendered through route configuration in `src/App.jsx`.
- Accessed from global navigation, internal links, profile actions, dashboards, and utility flows.

## What It Contains
- Domain-specific UI for the garments/textiles B2B workflow (discovery, communication, management, compliance, account handling).
- Supports cards, forms, lists, stats, and content sections depending on page role.

## Why It Exists
- Provides a specialized workflow step in the GarTexHub lifecycle:
  - onboarding,
  - discovery,
  - relationship management,
  - collaboration,
  - governance/legal compliance.

## Behavior & Workflows
- Honors global theme state (`light`/`dark`) instantly.
- Adapts across breakpoints via responsive utility classes and shared CSS fallbacks.
- Keeps visual consistency with global palette, spacing, and card/surface system.

## Implementation Notes
- If new major blocks are added, update this spec with:
  - layout zone,
  - interaction purpose,
  - data displayed,
  - dependency on other pages/components.
