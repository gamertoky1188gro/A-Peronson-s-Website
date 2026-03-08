# Terms — Complete Page Specification

## Page Title & Description
- **Page title:** `Terms`
- **Primary route(s):** `/terms`
- **Purpose:** This page is implemented by `src/pages/Terms.jsx` and supports a specific GarTexHub user workflow.

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
- `Legal Agreement`
- `Terms & Conditions`
- `Last Updated:`
- `This platform is an international B2B Garments and Textiles Marketplace, where Buyer, Factory and Buying House connect for professional business purposes. By creating or using an account on the platform, you agree to the following terms and conditions.`
- `Purpose of the Platform`
- `Account Policy`
- `User Conduct`
- `The following activities are strictly prohibited and will be subject to action:`
- `All media content must be published in a professional and business-like manner.`
- `9. Liability`
- `The platform provides connectivity between Buyers and Sellers. Strong and effective security measures have been implemented to prevent fraud.`
- `If the user violates policies, verification processes or security instructions and suffers losses, the user will bear the responsibility himself.`
- `10`
- `Account Suspension or Cancellation`
- `Accounts will be suspended or canceled in cases of:`
- `Violation of terms, Fraudulent activity, Providing false information,`
- `or`
- `Behavior that damages reputation`
- `The user will be notified before closing the account.`
- `A warning will be given if necessary.`
- `In case of repeated or serious violations, the account will be permanently closed.`
- `11. Change Policy`
- `These Terms will be updated as needed. Users will be notified of any significant changes via notification.`
- `12. Consent`
- `By creating an account or using the Platform, you agree to be bound by all provisions of these Terms and Conditions.`
- `© 2026 GarTexHub Professional Network. All Rights Reserved.`
- `react`
- `, {
    day:`
- `,
    year:`
- `text-slate-900 dark:text-slate-200`
- `text-lg`
- `,`
- `flex items-start gap-3`
- `grid md:grid-cols-2 gap-x-8 gap-y-3 text-rose-50 text-sm`
- `fill=`
- `stroke=`
- `viewBox=`
- `strokeWidth=`
- `d=`
- `mt-6 text-sm italic opacity-80`
- `]
                },
                { 
                  id: 5, 
                  title:`
- `]
                },
                { 
                  id: 6, 
                  title:`
- `]
                },
                { 
                  id: 7, 
                  title:`
- `]
                },
                { 
                  id: 8, 
                  title:`
- `text-amber-500`
- `space-y-3 text-sm`
- `pl-11 space-y-4`
- `list-disc ml-5 space-y-1 text-sm`
- `grid md:grid-cols-2 gap-8`
- `text-sm`

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
