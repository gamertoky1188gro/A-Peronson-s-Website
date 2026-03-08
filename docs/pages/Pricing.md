# Pricing - Complete Page Specification (Manual)

## Page Title & Description
- Title: Pricing/Plans page for GarTexHub.
- Route: `/pricing`
- Purpose: Show free vs premium capabilities, subscription status simulation, comparison table, FAQs, and conversion CTA.

## Layout & Structure
- Hero section:
  - left: headline, supporting text, monthly/annual toggle UI.
  - right: decorative dashboard placeholder card.
- Plans section:
  - title + embedded `SubscriptionArea` interactive card.
- Feature comparison section:
  - responsive table with free vs enterprise columns.
- Why upgrade section:
  - 3 benefit cards.
- FAQ section:
  - Q/A list.
- Final CTA section.
- Footer with brand, links, contact.

`SubscriptionArea` internal layout:
- top row with mock login toggle.
- account type selector when logged in.
- verification/subscription notice and status chip row.
- two pricing cards: `Free` and `Premium`.

## Theme & Styling
- Light marketing page style.
- Accent colors:
  - blue (`#0A66C2`) and indigo for action/labels.
- Backgrounds:
  - gray and white alternating sections.
- Typography:
  - strong hero headings + small explanatory body text.

## Content Details
Key exact text:
- Hero headline: `Power Your Buying House with Structured Growth`
- Hero subtext: `Choose the plan that matches your organization size. Upgrade anytime as your team expands.`
- Toggle labels: `Monthly`, `Annual (Save 20%)`
- Section titles:
  - `Simple, Transparent Pricing`
  - `Feature Comparison`
  - `Why Enterprise Matters?`
  - `FAQ`
  - `Build a Structured Textile Network Today`
- Subscription area:
  - `Subscription Packages`
  - `Choose between Free and Premium to match your needs.`
  - `Verification is subscription-based, not permanent. Renew your premium monthly plan to keep the verification badge active.`
  - status labels: `Verified active`, `Expiring soon`, `Expired (renew to restore badge)`
  - action: `Renew premium monthly`
  - plan buttons: `Get Started`, `Choose Premium`
- FAQ entries exactly include:
  - `Q: Can I upgrade anytime?`
  - `Q: Can I downgrade?`
  - `Q: Does GarTexHub handle payments?`
  - `Q: Are calls recorded?`

## Interactions & Functionality
- No backend API calls in this component.
- Local interactive behaviors:
  - mock sign in/out toggle (`isLoggedIn`).
  - account type switch (`General`/`Factory`) when mock logged in.
  - remaining days simulation and verification state chip update.
  - annual toggle in hero is visual-only (no bound logic).
- Buttons mostly presentational CTAs in current implementation.

## Images & Media
- No external media.
- Uses decorative placeholder boxes for hero visual.

## Extra Notes / Metadata
- SEO:
  - no explicit metadata tags in component.
- Accessibility:
  - some CTA buttons are non-functional placeholders; consider adding real navigation targets.
- Responsive:
  - two-column hero and plan cards collapse for small screens.
