# Pricing — Complete Page Specification

## Page Title & Description
- **Page title:** `Pricing`
- **Primary route(s):** `/pricing`
- **Purpose:** This page is implemented by `src/pages/Pricing.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<footer>`, `<header>`, `<input>`, `<section>`, `<table>`.
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
- `Subscription Packages`
- `Choose between Free and Premium to match your needs.`
- `Logged in`
- `Not logged in`
- `0 && (`
- `Select Account Type:`
- `Verification is subscription-based, not permanent. Renew your premium monthly plan to keep the verification badge active.`
- `Renew premium monthly`
- `Free`
- `Start with essential features.`
- `Get Started`
- `Premium`
- `Unlock full power and reach.`
- `Choose Premium`
- `Power Your Buying House with Structured Growth`
- `Choose the plan that matches your organization size. Upgrade anytime as your team expands.`
- `Monthly`
- `Annual`
- `(Save 20%)`
- `Simple, Transparent Pricing`
- `Feature Comparison`
- `Feature`
- `Free BH`
- `Enterprise BH`
- `Sub Accounts Limit`
- `10`
- `Unlimited`
- `Dedicated Analytics Page`
- `No`
- `Yes`
- `Report Export`
- `Advanced Insights`
- `Buying Pattern Analysis`
- `Contract Vault Storage`
- `Basic`
- `Extended`
- `Order Completion Certification`
- `Search Filtering Priority`
- `Standard`
- `Advanced`
- `Support Level`
- `Dedicated`
- `Why Enterprise Matters?`
- `Team Scale`
- `Manage large agent teams without restrictions.`
- `Data Visibility`
- `Understand which agents close more deals.`
- `Competitive Advantage`
- `Use advanced analytics to identify demand trends.`
- `FAQ`
- `Q: Can I upgrade anytime?`
- `A: Yes, your data remains intact.`
- `Q: Can I downgrade?`
- `A: Yes, but sub-account limits will apply.`
- `Q: Does GarTexHub handle payments?`
- `A: No. The platform facilitates coordination and contract management only.`
- `Q: Are calls recorded?`
- `A: Yes, for documentation and compliance.`
- `Build a Structured Textile Network Today`
- `Create Your Organization`
- `GarTexHub`
- `Professional B2B sourcing for garments & textiles.`
- `About`
- `Privacy`
- `Terms`
- `Contact`
- `Help Center`
- `Contact: support@gartexhub.example`
- `© GarTexHub`
- `react`
- **Button labels detected:** `Choose Premium`, `Create Your Organization`, `Get Started`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => setAccountType(t)`
  - `() => setRemainingDays((d) => d + 30)`
  - `() => {
            setIsLoggedIn(!isLoggedIn)
            setAccountType('General')`
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
