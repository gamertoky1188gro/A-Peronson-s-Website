# VerificationPage — Complete Page Specification

## Page Title & Description
- **Page title:** `VerificationPage`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/VerificationPage.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<header>`, `<input>`, `<section>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Verification Center`
- `Role and region-specific verification requirements for trusted international sourcing.`
- `Need setup help? Visit the`
- `Help Center verification guide`
- `Subscription renewal state`
- `Document Requirements`
- `Region`
- `Global`
- `EU`
- `US`
- `APAC`
- `Region is auto-mapped from buyer country for compliance.`
- `Buyer Country`
- `Select country`
- `Saving country...`
- `Buyer country is required before uploading verification documents.`
- `Mandatory documents`
- `Optional documents`
- `Credibility score panel`
- `More licensing proof increases international credibility.`
- `Refresh status`
- `react`
- `../lib/auth`
- `,`
- `],
  },
  role: {
    factory: {
      required: [`
- `],
    },
    buyer: {
      required: [`
- `purchase_policy`
- `vat`
- `eori`
- `],
    },
    us: {
      required: [`
- `],
    },
    apac: {
      required: [`
- `],
    },
    global: {
      required: [`
- `,
  purchase_policy:`
- `,
  vat:`
- `,
  eori:`
- `,
  ior:`
- `TIN Certificate`
- `ERC Certificate`
- `).toLowerCase()
  if ([`
- `approved`
- `uploaded`
- `submitted`
- `if (status ===`
- `bg-amber-100 text-amber-700 border-amber-200`
- `bg-red-100 text-red-700 border-red-200`
- `expired`
- `active`
- `eu`
- `USA`
- `us`
- `global`
- `buyer`
- `text-emerald-700 border-emerald-200 bg-emerald-50`
- `,
        message:`
- `text-sky-700 border-sky-200 bg-sky-50`
- `text-amber-700 border-amber-200 bg-amber-50`
- `,
      message:`
- `))
      setError(`
- `)
    } catch (err) {
      setError(err.message ||`
- `OTHER`
- `, {
          method:`
- `)
    setError(`
- `file`
- `type`
- `POST`
- `, {
        method:`
- `Upload failed`
- `mx-auto max-w-6xl px-4 py-6 space-y-6`
- `text-sm text-slate-600 mt-1`
- `text-xs text-slate-500 mt-2`
- **Button labels detected:** `Refresh status`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => openPicker(documentKey)`
  - `(e) => setBuyerCountry(e.target.value)`
  - `(e) => setRegion(e.target.value)`
  - `loadStatus`
  - `onFileSelected`
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
