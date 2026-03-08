# SearchResults — Complete Page Specification

## Page Title & Description
- **Page title:** `SearchResults`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/SearchResults.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<form>`, `<input>`.
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
- `Search`
- `Save Alert`
- `Current plan:`
- `Upgrade to Premium to unlock advanced filters and higher daily limits.`
- `Filter Results`
- `(Premium)`
- `All`
- `Garments`
- `Textile`
- `Category`
- `Shirt`
- `Pants`
- `Knitwear`
- `Any`
- `0-500`
- `500-1000`
- `1000+`
- `Buyer`
- `Factory`
- `Distributor`
- `Premium filters are visible for discovery and disabled on free plans.`
- `Results for "`
- `Loading results...`
- `No results found. Try adjusting your query or filters.`
- `0 && (`
- `✓ Verified`
- `Take Lead`
- `Video available`
- `Message`
- `react`
- `jwt`
- `:`
- `N/A`
- `).toLowerCase().replace(/[^a-z0-9]+/g,`
- `).replace(/^-|-$/g,`
- `,
    category: raw.category || raw.primary_category || raw.material ||`
- `,
    mediaReviewStatus: raw.video_review_status ||`
- `approved`
- `all`
- `free`
- `,
    category:`
- `premium`
- `, activeQuery.trim())
    if (!premiumLocked && filters.primary) params.set(`
- `, filters.primary)
    if (filters.category) params.set(`
- `,`
- `)
    if (!premiumLocked && filters.orgType) params.set(`
- `)
    setQuotaMessage(`
- `)
    setUpgradePrompt(`
- `}`)
      }
    } catch (err) {
      if (err.code ===`
- `)
      } else if (err.code ===`
- `}`)
      } else {
        setError(err.message ||`
- `/search/alerts`
- `POST`
- `${query}`
- `}`)
    } catch (err) {
      if (err.code ===`
- `Failed to save alert`
- `mb-4 flex flex-col gap-2 md:flex-row`
- `placeholder=`
- `submit`
- `Hide Filters`
- `Show Filters`
- `mb-2 text-xs text-gray-600`
- `uppercase`
- `text-xs text-amber-700`
- `primary`
- `textile`
- `shirt`
- `checkbox`
- `/>
                <label htmlFor=`
- `orgType`
- **Button labels detected:** `Message`, `Save Alert`, `Search`, `Take Lead`
- **Input placeholders detected:** `Search buyer requests and products`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => setActiveTab('all')`
  - `() => setActiveTab('companies')`
  - `() => setActiveTab('requests')`
  - `() => setShowFilters((current) => !current)`
  - `(e) => handlePremiumFilterChange('country', e.target.value)`
  - `(e) => handlePremiumFilterChange('moqRange', e.target.value)`
  - `(e) => handlePremiumFilterChange('orgType', e.target.value)`
  - `(e) => handlePremiumFilterChange('primary', e.target.value)`
  - `(e) => handlePremiumFilterChange('verifiedOnly', e.target.checked)`
  - `(e) => setFilters({ ...filters, category: e.target.value`
  - `(e) => setSearchQueryInput(e.target.value)`
  - `handleSaveAlert`
  - `submitSearch`
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
