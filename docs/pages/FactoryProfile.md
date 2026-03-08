# FactoryProfile — Complete Page Specification

## Page Title & Description
- **Page title:** `FactoryProfile`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/FactoryProfile.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<aside>`, `<button>`, `<main>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#083B75`, `#0A66C2`, `#1A1A1A`, `#5A5A5A`, `#E8F3FF`, `#F4F9FF`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `video.reviewStatus === 'approved') return (`
- `Verified`
- `Capacity:`
- `Employees:`
- `Certifications:`
- `Send Message`
- `View Products`
- `Overview`
- `Products`
- `Video Gallery`
- `Reviews`
- `Machinery`
- `Specializations`
- `Export Countries`
- `Quick View`
- `Only approved media is public. Pending or restricted items remain hidden until moderation is completed.`
- `Video Preview`
- `video.reviewStatus !== 'approved') && (`
- `Partner`
- `No reviews available yet.`
- `react`
- `react-router-dom`
- `★★★★★`
- `overview`
- `Premier Textile Mills`
- `,
    capacity:`
- `ISO 9001`
- `WRAP`
- `,`
- `Shirts`
- `],
    export: [`
- `Pique Polo`
- `Heavyweight Hoodie`
- `, category:`
- `2:18`
- `approved`
- `,
    },
    {
      id: 2,
      title:`
- `1:47`
- `,
      summary:`
- `,
    },
    {
      id: 3,
      title:`
- `1:12`
- `restricted`
- `text-sm text-[#5A5A5A]`
- `mt-4 space-y-2 text-sm text-[#5A5A5A]`
- `text-[#1A1A1A]`
- `flex gap-2 mt-1`
- `mt-4 flex gap-2`
- `/factory/chat`
- `/factory/products`
- `border-b-2 border-[#0A66C2] text-[#0A66C2]`
- `text-[#5A5A5A]`
- `products`
- `videos`
- `reviews`
- `space-y-4 p-3`
- `text-sm text-[#5A5A5A] mt-2`
- `flex gap-2 mt-2`
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3`
- `mt-2 flex gap-2`
- `grid grid-cols-1 sm:grid-cols-2 gap-4`
- `text-xs text-[#5A5A5A] mt-2`
- `space-y-3 p-3`
- `mb-4`
- `0.0`
- `text-lg`
- `text-xs text-[#5A5A5A]`
- **Button labels detected:** `Quick View`
- **Static Link destinations:** `/factory/chat`, `/factory/products`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => setActiveTab('overview')`
  - `() => setActiveTab('products')`
  - `() => setActiveTab('reviews')`
  - `() => setActiveTab('videos')`
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
