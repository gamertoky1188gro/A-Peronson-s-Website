# TexHub — Complete Page Specification

## Page Title & Description
- **Page title:** `TexHub`
- **Primary route(s):** `/`
- **Purpose:** This page is implemented by `src/pages/TexHub.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<footer>`, `<header>`, `<section>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#083B75`, `#0A66C2`, `#F4F9FF`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Where Global Buyers Meet Verified Garment & Textile Suppliers`
- `A professional B2B platform built exclusively for the garments and textile industry.`
- `Create Buyer Account`
- `Register Factory`
- `Explore Platform`
- `Structured Buyer Requests`
- `Verified Factories`
- `Digital Contract Vault`
- `AI Guided Workflow`
- `Problem`
- `Random marketplaces are noisy`
- `No structured buyer requirements`
- `Too many unverified suppliers`
- `Internal team conflict in buying houses`
- `Solution`
- `Verified Supplier Priority`
- `Internal Agent Lock System`
- `Organized Partner Network`
- `How GarTexHub Works`
- `1. Post or Search`
- `Buyer posts structured requirement, Factory posts product.`
- `2. Smart Matching & Take Lead`
- `Buying house agent claims request and AI provides a summary.`
- `3. Chat, Call, Contract`
- `Schedule meetings, sign digital agreements, store in Legal Vault.`
- `Platform Features`
- `Account Types`
- `Buyer`
- `Company-based`
- `Direct buyer`
- `Structured requests`
- `Smart notifications`
- `Factory`
- `Product management`
- `Video gallery`
- `Verified badge`
- `Direct communication`
- `Buying House`
- `Multi-agent access`
- `Partner network`
- `Lead claiming system`
- `Enterprise analytics`
- `Built for Growing Buying Houses`
- `Unlimited Sub Accounts · Dedicated Analytics · Organization Control · Contract Management`
- `View Enterprise Plans`
- `Focused only on Garments & Textile Industry`
- `Industry categories:`
- `Shirts`
- `Pants`
- `Knitwear`
- `Woven`
- `Denim`
- `Custom Production`
- `Start Connecting with the Right Partners`
- `Create Account`
- `Login`
- `GT`
- `GAR TEX HUB`
- `Professional B2B sourcing for garments & textiles.`
- `About`
- `How It Works`
- `Pricing`
- `Privacy Policy`
- `Terms & Conditions`
- `Contact: support@gartexhub.example`
- `Help Center`
- `© 2026 GarTexHub. All rights reserved.`
- `react`
- `react-router-dom`
- `mt-4 text-gray-600`
- **Button labels detected:** `Create Account`, `Login`, `View Enterprise Plans`
- **Static Link destinations:** `/feed`, `/signup`

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
