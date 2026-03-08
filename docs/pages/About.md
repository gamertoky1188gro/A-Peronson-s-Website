# About — Complete Page Specification

## Page Title & Description
- **Page title:** `About`
- **Primary route(s):** `/about`
- **Purpose:** This page is implemented by `src/pages/About.jsx` and supports a specific GarTexHub user workflow.

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
- **Explicit color tokens found in implementation:** `#0056B3`, `#0A192F`, `#333333`, `#5A5A5A`, `#E5E5E5`, `#F8F9FA`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `About GarTexHub`
- `A professional B2B platform built exclusively for the Garments and Textile industry.`
- `GarTexHub is a professional B2B platform built exclusively for the Garments and Textile industry. Our goal is to create a structured, transparent, and trust-driven environment where international buyers, factories, and buying houses can connect with confidence.`
- `Why GarTexHub Exists`
- `Cross-border textile trade often depends on informal communication, scattered documents, and manual verification processes. This creates inefficiencies, misunderstandings, and trust barriers.`
- `GarTexHub was created to solve this problem by combining structured communication, verified business identities, and secure documentation within one unified system.`
- `Our Mission`
- `To simplify international garment sourcing by building a secure digital infrastructure that prioritizes credibility, transparency, and efficiency.`
- `Our Vision`
- `To become a trusted digital bridge between global buyers and garment manufacturers, reducing negotiation friction and strengthening international trade relationships.`
- `How the Platform Works`
- `Buyers can post structured requests with detailed specifications.`
- `Factories and Buying Houses can showcase products and capabilities.`
- `Verified accounts increase trust through document-based validation.`
- `Built-in communication tools enable secure discussions.`
- `Digital contracts and document storage ensure record integrity.`
- `Verification & Trust`
- `GarTexHub uses a document-based verification system. Companies must submit legal and operational documents, which are manually reviewed before verification status is granted.`
- `Verification is subscription-based and must be maintained to ensure ongoing compliance.`
- `The more verified documentation a company provides, the stronger its credibility and international acceptance.`
- `Industry Focus`
- `GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, we provide smarter categorization, clearer communication, and more relevant matching between buyers and manufacturers.`
- `Professional Commitment`
- `We do not process direct financial transactions. Our platform is designed to facilitate secure communication, structured agreements, and verified business interactions.`
- `GarTexHub operates with the principle that trust is earned through transparency, documentation, and professional conduct.`
- `Contact & Legal Information`
- `For partnership inquiries, support, or compliance-related questions, please contact us through our official communication channels listed on the platform.`
- `react`
- `mb-10`
- `grid md:grid-cols-2 gap-8 mb-10`
- `bg-[#F8F9FA] p-6 border-l-4 border-[#0056B3]`
- `flex items-start gap-2`
- `mt-12 pt-8 border-t border-[#E5E5E5]`

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
