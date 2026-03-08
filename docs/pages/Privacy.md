# Privacy — Complete Page Specification

## Page Title & Description
- **Page title:** `Privacy`
- **Primary route(s):** `/privacy`
- **Purpose:** This page is implemented by `src/pages/Privacy.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<footer>`, `<header>`, `<section>`.
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
- `Legal Documentation`
- `Privacy Policy`
- `Last Updated:`
- `This Privacy Policy explains how our B2B Garments and Textile Marketplace platform collects, uses, protects, and manages your information. Our platform connects international Buyers, Factories, and Buying Houses in a secure and professional environment. By creating an account or using our services, you agree to the practices described in this policy.`
- `Information We Collect`
- `Account Data`
- `Business Data`
- `Communications`
- `Technical Information`
- `How We Use Your Information`
- `3. Fraud Prevention Measures`
- `13. Contact Information`
- `Direct Support`
- `support@gartexhub.com`
- `LinkedIn`
- `Facebook`
- `© 2026 GarTexHub Professional Network. All Rights Reserved.`
- `react`
- `, {
    day:`
- `,
    year:`
- `text-slate-900 dark:text-slate-200`
- `text-lg`
- `grid md:grid-cols-2 gap-8`
- `Full Name`
- `,`
- `mt-8 grid md:grid-cols-2 gap-8`
- `Chat messages`
- `Video/Audio logs`
- `IP address`
- `Device/Browser type`
- `Usage activity`
- `Search history`
- `text-sky-500`
- `grid md:grid-cols-2 gap-x-8 gap-y-4 text-sky-50`
- `flex items-start gap-3`
- `fill=`
- `stroke=`
- `viewBox=`
- `strokeWidth=`
- `d=`
- `, text:`
- `},
                { id: 5, title:`
- `},
                { id: 6, title:`
- `},
                { id: 7, title:`
- `},
                { id: 8, title:`
- `grid md:grid-cols-2 gap-6`
- `space-y-1`
- `text-slate-400 dark:text-slate-500 text-sm`
- `>
                    <a href=`

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
