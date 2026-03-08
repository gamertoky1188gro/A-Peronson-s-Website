# TexHub - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `TexHub`
- Route: `/`
- Purpose: Public landing page introducing GarTexHub, value proposition, feature highlights, account types, and entry CTAs for signup/login/feed.

## Layout & Structure
- Overall container:
  - Full page vertical flow (`div` root).
  - Approximate desktop width: centered content (`max-w-7xl`).
- Sections from top to bottom:
1. Hero (`header`): 2-column layout (left copy + right dashboard mock).
2. Problem & Solution (`section#about`): 2 columns.
3. How It Works (`section#how-it-works`): 3 cards.
4. Platform Features (`section`): 4x2 feature grid.
5. Account Types (`section`): 3 account cards.
6. Enterprise Highlight (`section`): centered CTA on blue background.
7. Industry Focus (`section`): badge/chip list.
8. Final CTA (`section`): primary/secondary action buttons.
9. Footer (`footer`): 3-column top row + copyright row.

Approximate placement:
- Hero content starts in top 0-25% viewport.
- Middle informational sections occupy ~25-80%.
- CTA + footer occupy ~80-100%.

## Theme & Styling
- Visual style:
  - White/light surfaces with blue accents.
  - Reusable panel classes: `neo-panel`, `cyberpunk-card`.
- Colors:
  - Primary blue: `#0A66C2`
  - Dark hover blue: `#083B75`
  - Light blue backgrounds: `bg-blue-50`, `bg-[#F4F9FF]`
  - Neutral backgrounds: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Typography:
  - Heading-heavy hierarchy (`font-extrabold`, `font-bold`).
  - Supporting text in gray (`text-gray-600`, `text-gray-700`).
- Spacing:
  - Section rhythm uses `py-12` or `py-16`.
  - Internal card spacing uses `p-4`, `p-6`.

## Content Details
Exact visible text in this page:
- Hero title: `Where Global Buyers Meet Verified Garment & Textile Suppliers`
- Hero subtitle: `A professional B2B platform built exclusively for the garments and textile industry.`
- Hero CTA buttons:
  - `Create Buyer Account`
  - `Register Factory`
  - `Explore Platform`
- Hero bullets:
  - `Structured Buyer Requests`
  - `Verified Factories`
  - `Digital Contract Vault`
  - `AI Guided Workflow`
- Problem section:
  - Heading: `Problem`
  - Items:
    - `Random marketplaces are noisy`
    - `No structured buyer requirements`
    - `Too many unverified suppliers`
    - `Internal team conflict in buying houses`
- Solution section:
  - Heading: `Solution`
  - Items:
    - `Structured Buyer Requests`
    - `Verified Supplier Priority`
    - `Internal Agent Lock System`
    - `Organized Partner Network`
- How it works heading: `How GarTexHub Works`
  - Card 1: `1. Post or Search` / `Buyer posts structured requirement, Factory posts product.`
  - Card 2: `2. Smart Matching & Take Lead` / `Buying house agent claims request and AI provides a summary.`
  - Card 3: `3. Chat, Call, Contract` / `Schedule meetings, sign digital agreements, store in Legal Vault.`
- Platform features heading: `Platform Features`
  - `Professional Feed` / `LinkedIn-style professional feed.`
  - `Unique Toggle` / `Diverse content mode with unique toggle.`
  - `Partner Network` / `Structured partner network system.`
  - `Multi-Agent Accounts` / `Multi-agent buying house accounts.`
  - `Video Gallery` / `Factory profile video gallery.`
  - `Enterprise Analytics` / `Powerful enterprise analytics dashboard.`
  - `Contract Vault` / `Secure digital contract vault.`
  - `AI Assistant` / `Floating AI assistant for onboarding.`
- Account types heading: `Account Types`
  - `Buyer`, `Factory`, `Buying House` with bullet lists as in source.
- Enterprise section:
  - `Built for Growing Buying Houses`
  - `Unlimited Sub Accounts · Dedicated Analytics · Organization Control · Contract Management`
  - Button: `View Enterprise Plans`
- Industry focus:
  - `Focused only on Garments & Textile Industry`
  - `Industry categories:`
  - Chips: `Shirts`, `Pants`, `Knitwear`, `Woven`, `Denim`, `Custom Production`
- Final CTA:
  - `Start Connecting with the Right Partners`
  - Buttons: `Create Account`, `Login`
- Footer:
  - `GAR TEX HUB`
  - `Professional B2B sourcing for garments & textiles.`
  - Links: `About`, `How It Works`, `Pricing`, `Privacy Policy`, `Terms & Conditions`
  - `Contact: support@gartexhub.example`
  - `Help Center`
  - `© 2026 GarTexHub. All rights reserved.`

## Interactions & Functionality
- Navigation and links:
  - `Link to="/signup"` from primary signup CTAs.
  - `Link to="/feed"` for exploration.
  - Footer anchor links to `#about`, `#how-it-works`.
  - Footer link to `/pricing`.
- Buttons without handler in this component:
  - `View Enterprise Plans`
  - Final `Create Account` and `Login` buttons are presentational in current implementation (no onClick handler attached in this file).
- Responsive behavior:
  - Hero becomes single-column on small screens.
  - Feature grid adapts from 1 column to 2 and 4 columns.

## Images & Media
- No external images/videos are embedded.
- Mock visual placeholders are rendered using styled `div` blocks.
- Icon-like visuals:
  - Dot bullets (small blue circles).
  - Feature icon tile uses checkmark glyph.

## Extra Notes / Metadata
- SEO:
  - No page-level `<title>`/meta tags are set in this component.
- Accessibility:
  - Uses semantic regions (`header`, `section`, `footer`).
  - Ensure future enhancement adds explicit accessible labels to any interactive buttons that trigger JS actions.
- Maintenance:
  - Keep button wiring consistent with intended routes if CTA behavior is expanded.
