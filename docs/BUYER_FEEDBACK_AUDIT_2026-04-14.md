# Buyer Feedback Audit (April 14, 2026)

This audit maps only the buyer-requested items from the shared chat messages and marks each one as **Implemented**, **Partial**, or **Not Implemented** based on current code behavior.

## Feature Status Chart

| # | Buyer request | Status | Notes / Evidence |
|---|---|---|---|
| 1 | Dark mode selected color should be blue | **Implemented** | Account type selected state is blue in light/dark (`text-[var(--gt-blue)]`, blue-tinted dark bg). |
| 2 | Bot logo should be better | **Implemented** | Floating assistant uses dedicated `BotLogo` component for launcher and header icon. |
| 3 | Password should be visible + confirm password field | **Implemented** | Signup has `Show/Hide` for password and confirm password with mismatch validation. |
| 4 | Account type should open as clean dropdown (not always show 3 options) | **Implemented** | Signup uses custom `RoleSelect` dropdown toggle with arrow + listbox behavior. |
| 5 | Country should support typed suggestion/autocomplete | **Implemented** | Signup uses `CountryAutocomplete` filtered suggestion list. |
| 6 | In dark mode, “Already have an account” should be visible/highlighted | **Implemented** | Login link has dark text/background classes for contrast. |
| 7 | “View Plan” button should jump to subscription plans section | **Implemented** | Hash navigation support (`#plans`) + pricing page auto-scroll by hash. |
| 8 | Form labels (Full name, Email, Password, Confirm Password, Account Type) should stay visible in dark mode | **Implemented** | Labels use `dark:text-slate-200`; inputs use dark backgrounds with readable text. |
| 9 | Account type clicked option text in dark mode should be blue | **Implemented** | Selected role option text explicitly uses brand blue variable. |
| 10 | Back button should have arrow icon | **Implemented** | Shared `BackButton` includes left arrow SVG icon + text. |
| 11 | Account type default should show Buyer + dropdown arrow | **Implemented** | Signup form defaults `primaryRole: 'buyer'`; RoleSelect renders arrow and current label. |
| 12 | Country list can include all countries but not Israel | **Implemented** | `BUYER_COUNTRY_OPTIONS` list excludes Israel. |
| 13 | Step validation should block illogical/too-short input before moving next step | **Partial** | Onboarding validates image URL and min organization length, but buyer’s deeper “logical content/quantity format” rules are not fully enforced everywhere. |
| 14 | Bot actually works / cross icon works and should not appear broken | **Partial** | Cross icon exists and assistant UI is wired to WebSocket. Runtime uptime depends on backend WS availability; code-level UI is present. |

## Backend Completion Status (now fully added)

- **Agent login by identifier (email/Agent ID):** Implemented on backend (`/api/auth/login` supports `identifier` and resolves email/member_id).
- **Partner-network backend endpoints:** Implemented with list/create/accept/reject/cancel, plus incoming list and disconnect endpoint.
- **Buyer-request schema extensions + validation:** Implemented in backend normalization + structured validation pipeline.

## New Buyer Additions (April 2026 update)

- Added **Order Type** in buyer request flow with two options: `Sample Order` and `Main Order`.
- Added sample order statuses: `sample_requested`, `sample_sent`, `sample_approved`, `sample_rejected`.
- Added **Convert to Main Order** action button for sample orders.
- Added buyer verification UX note for required documents:
  - **EU:** Business Registration + VAT + EORI + Bank proof
  - **USA:** Business Registration + EIN + IOR + Bank proof
- Added visible **EU country list** in buyer verification page.

## Error/Warning Audit + Fixes Applied in This Update

### Fixed in code

1. Removed impure ID generation pattern (`Date.now()` + `Math.random()`) from assistant send flow and replaced with deterministic request counter.
2. Refactored country autocomplete to avoid effect-driven state sync warning.
3. Cleaned onboarding URL validation catch block and removed stale eslint directive warning.
4. Added stable hash dependency handling in pricing hash-scroll effect.

### Current command outcomes

- `npm run lint` now passes with no lint errors/warnings.
- `npm test` still has DB-dependent failures (remote Prisma/Postgres host not reachable in this environment); these are infrastructure/runtime, not frontend lint issues.

## Consolidated Policy Addendum (Added from latest buyer notes)

This section captures the latest strategic guidance as product policy so it is not lost across chat transcripts.

### A) Verification Badge Policy

- Verification is document-based and backend-approved.
- After verification approval, each approved license must be shown by name with a check marker and a visible verified label in sequence.
- Verified status is subscription-based only.
- Permanent/lifetime purchase of verified status is not allowed.
- Verification must renew monthly.

### B) Mandatory Verification Documents by Role

#### Factory (6)

1. Company Registration (Registrar of Joint Stock Companies and Firms)
2. Trade License
3. TIN (National Board of Revenue)
4. Authorized Person NID
5. Company Bank Proof
6. ERC (Office of the Chief Controller of Imports and Exports)

Purpose: legal entity proof, active business proof, tax validity, accountable person identification, payment destination safety, export legality.

#### Buying House (5)

1. Company Registration
2. Trade License
3. TIN
4. Authorized Person NID
5. Company Bank Proof

Purpose: legal validity, active business proof, tax validity, accountable person identification, transaction transparency.

### C) Buyer Verification Requirements (by market)

#### EU

- Business Registration
- VAT Number
- EORI
- Bank Proof

#### USA

- Business Registration
- EIN
- IOR
- Bank Proof

### D) EU Country List (for Buyer Verification UX)

The buyer verification form should support/label EU requirements for these countries:

- Austria
- Belgium
- Bulgaria
- Croatia
- Cyprus
- Czech Republic
- Denmark
- Estonia
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxembourg
- Malta
- Netherlands
- Poland
- Portugal
- Romania
- Slovakia
- Slovenia
- Spain
- Sweden

### E) Trust-Positioning Note

- Optional extra licenses can be accepted and displayed.
- More valid licensing evidence should increase buyer confidence and international credibility signals.
- Mandatory verification requirements remain fixed by role/country even when optional licenses are added.

### F) Core Analytics Strategy (Buying House / Enterprise)

Keep dashboard-level analytics focused on 5 to 7 core metrics.

Recommended top 5 operational metrics:

1. Buyer Request Match Rate = matched requests / total relevant requests
2. Lead to Deal Conversion Rate = contracts signed / buyer conversations
3. Factory Response Speed = average first response time
4. Buyer Demand Trend = top requested product categories over time
5. Trusted Deal Score = completed deals + buyer rating - disputes

### G) Marketplace-Owner Core Metrics (platform-level)

For owner/admin strategy, prioritize these 5 marketplace health metrics:

1. Buyer to Supplier Match Success Rate
2. Active Buyer vs Active Supplier Ratio (target balance: 1 buyer to 3 to 5 suppliers)
3. Request to Contract Conversion Rate
4. Time to First Qualified Response
5. Repeat Buyer Rate

### H) Dashboard Rule

- Do not overload main dashboards with dozens of metrics.
- Keep core KPI cards short and decision-oriented.
- Place deep analytics on a separate detail page.
