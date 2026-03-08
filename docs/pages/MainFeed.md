# MainFeed — Complete Page Specification

## Page Title & Description
- **Page title:** `MainFeed`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/MainFeed.jsx` and supports a specific GarTexHub user workflow.

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
- **Explicit color tokens found in implementation:** `No explicit hex values; inherited palette/classes`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Connections`
- `Feed Items`
- `Unique Algorithm`
- `Diversify your feed`
- `Quick Filters`
- `All Posts`
- `🔹 Buyer Requests`
- `🏭 Company Products`
- `Loading feed...`
- `No feed items found for this filter.`
- `Video available`
- `0 &&`
- `💬 Comment`
- `↗️ Share`
- `⭐ Save`
- `) : (`
- `Message`
- `Suggested Connections`
- `No suggestions yet`
- `Add`
- `Trending Categories`
- `No trend data yet`
- `Recently Active Buyers`
- `No buyer activity yet`
- `react`
- `jwt`
- `:`
- `buyer_request`
- `buyer-request`
- `request`
- `Buyer`
- `Factory`
- `approved`
- `all`
- `requests`
- `/auth/me`
- `products`
- `Failed to load feed`
- `report`
- `, {
        method:`
- `success`
- `,`
- `error`
- `POST`
- `claimed`
- `locked`
- `)}` :`
- `my-4`
- `space-y-2 text-sm`
- `text-gray-700`
- `text-xs text-gray-600`
- `bg-blue-600`
- `bg-gray-300`
- `bg-blue-100 text-blue-600`
- `hover:bg-gray-100`
- `border border-red-200 bg-red-50 text-red-700`
- `border border-blue-200 bg-blue-50 text-blue-700`
- `text-blue-600`
- `text-xs text-gray-500`
- `p-4`
- `text-gray-800 mb-3`
- `text-3xl`
- `text-sm text-gray-600 mt-2`
- `flex flex-wrap gap-2`
- `share`
- `save`
- `Report`
- `) ?`
- `message`
- `px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800`
- **Button labels detected:** `Add`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => handleExpressInterest(post)`
  - `() => handleReport(post)`
  - `() => handleSocialAction(post, 'comment')`
  - `() => handleSocialAction(post, 'message')`
  - `() => handleSocialAction(post, 'save')`
  - `() => handleSocialAction(post, 'share')`
  - `() => setActiveFilter('all')`
  - `() => setActiveFilter('products')`
  - `() => setActiveFilter('requests')`
  - `() => setUniqueToggle((current) => !current)`
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
