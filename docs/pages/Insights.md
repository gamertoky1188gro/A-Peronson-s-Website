# Insights — Complete Page Specification

## Page Title & Description
- **Page title:** `Insights`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/Insights.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`, `#1A1A1A`, `#5A5A5A`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Insights & Analytics`
- `Loading analytics…`
- `You are currently on`
- `. Upgrade to Enterprise to unlock event-level analytics and export controls.`
- `Upgrade to Enterprise`
- `) : (`
- `Analytics Events by Type`
- `No analytics events recorded yet.`
- `Export CSV`
- `Download PDF Report`
- `react`
- `text-2xl`
- `text-sm text-[#5A5A5A]`
- `:`
- `mb-4`
- `grid grid-cols-1 md:grid-cols-4 gap-4 mb-6`
- `Total Buyer Requests`
- `Active Chats`
- `free`
- `mt-4`
- `space-y-2 text-sm`
- `text-[#5A5A5A]`
- `mt-4 flex gap-2`
- **Button labels detected:** `Download PDF Report`, `Export CSV`, `Upgrade to Enterprise`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Behavior model:** user actions trigger local state updates and/or API requests through shared auth/request helpers where used.

## Images & Media
- **Image elements:** none explicitly declared in this page source (icons may come from component libraries).
- **Video elements:** not explicitly declared.
- **Iconography:** uses shared icon sets/components (e.g., Lucide or emoji/text icons where coded).

## Extra Notes / Metadata
- **SEO metadata:** no page-specific `<head>` metadata is set in this component; defaults are inherited from app shell/index.
- **Accessibility notes:** semantic improvements should ensure button labels, alt text, focus states, and color contrast remain compliant.
- **Responsive behavior:** controlled by utility breakpoints (`sm:`, `md:`, `lg:` etc.) and flexible grid/flex containers.
- **Implementation source of truth:** this markdown reflects the current component and should be updated whenever UI text/layout/classes change.
