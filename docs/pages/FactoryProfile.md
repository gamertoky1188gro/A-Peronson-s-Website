# FactoryProfile - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `FactoryProfile`
- Source file: `src/pages/FactoryProfile.jsx`
- Route: `/factory/:id`
- Purpose: Factory showcase profile with overview/product/video/review tabs and moderation-aware video visibility.

## Layout & Structure
- Global shell from app layout includes top nav, footer, floating assistant.
- Main content container:
  - `max-w-7xl`, `p-6`.
  - Desktop 3-column split: sidebar (1), content (2).
- Sidebar (`aside`):
  - Identity card with avatar placeholder, name, verified badge, location.
  - Capacity/employees/certifications block.
  - Two action links:
    - `Send Message` (`/factory/chat`)
    - `View Products` (`/factory/products`)
- Main area:
  - Tabbed card with tab controls:
    - `Overview`
    - `Products`
    - `Video Gallery`
    - `Reviews`
  - Tab panel content switches in same container.

Approximate placement:
- Sidebar: left third desktop.
- Main tabbed panel: right two-thirds desktop.
- Mobile: single column.

## Theme & Styling
- Primary colors:
  - White surfaces.
  - Accent blue `#0A66C2`.
  - Secondary text `#5A5A5A`.
  - Light info background `#F4F9FF`.
- Tabs:
  - Active tab: blue text with blue bottom border.
  - Inactive tab: gray text.
- Warning panel for hidden videos:
  - Amber border/background.
- Cards:
  - Rounded corners, subtle borders, shadows.

## Content Details
Visible fixed labels/text:
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
- `Duration:`
- `video(s) are currently hidden due to moderation status.`
- `Partner`
- `Breakdown: 5★ ... 1★`
- `No reviews available yet.`

Hardcoded factory content:
- Name: `Premier Textile Mills`
- Location: `Tirupur, India`
- Capacity: `250,000 units / month`
- Employees: `450`
- Certifications: `ISO 9001`, `WRAP`
- About text on full-package manufacturing.
- Machinery list, specializations, export countries.

Hardcoded products:
- `Pique Polo`, `Heavyweight Hoodie`, `Denim Jacket`.

Hardcoded video catalog:
- One approved item visible.
- One pending and one restricted hidden from public list.

Dynamic reviews:
- Loaded from `/ratings/profiles/factory:premier-textile-mills`.
- Shows aggregate score, count, breakdown, and recent reviews.

## Interactions & Functionality
- Local state:
  - `activeTab` default `overview`.
  - `ratingSummary` populated from API fetch.
- Tab behavior:
  - Click tab button updates `activeTab`.
  - Associated content panel rendered conditionally.
- API behavior:
  - `useEffect` fetches ratings once on mount.
- Video moderation logic:
  - `visibleVideos = videoGallery.filter(reviewStatus === 'approved')`.
  - Hidden video count warning shown when non-approved items exist.
- Links:
  - `Send Message` and `View Products` navigate to route paths.

## Images & Media
- No external media URLs in JSX.
- Product and avatar visuals are placeholder blocks.
- Video area uses placeholder preview container (`Video Preview` text).

## Extra Notes / Metadata
- Responsive:
  - Sidebar/main stack on mobile.
  - Product/video cards adapt with `sm`/`lg` grid breakpoints.
- Accessibility:
  - Semantic `aside` and `main`.
  - Tab controls are buttons with text labels.
- SEO:
  - No dedicated per-page metadata logic.
