# ContractVault — Complete Page Specification

## Page Title & Description
- **Page title:** `ContractVault`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/ContractVault.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<aside>`, `<button>`, `<input>`, `<main>`, `<nav>`, `<section>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`, `#0F3D91`, `#1A1A1A`, `#5A5A5A`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `entry.id === nextContract.id) if (idx`
- `Dashboard`
- `Overview`
- `Buyer Requests`
- `Chats`
- `Partner Network`
- `Contract Vault`
- `Analytics`
- `Settings`
- `🔒 Contract Vault`
- `Encrypted & Timestamped`
- `Step-driven execution from draft through signatures, server-generated artifacts, lock, and archive.`
- `All`
- `Draft`
- `Pending Signature`
- `Signed`
- `Archived`
- `Step 1 · Draft creation`
- `Create Draft (POST /documents/contracts/draft)`
- `Your role cannot create contract drafts.`
- `Details`
- `Download Generated PDF`
- `Generated PDF pending`
- `Close`
- `Lifecycle timeline`
- `Step actions (role-sensitive)`
- `Step 2 · Buyer signature (PATCH /signatures)`
- `Step 3 · Factory signature (PATCH /signatures)`
- `Step 4 · Lock generated artifact`
- `Artifact references are server-generated from signed draft fields.`
- `Lock generated artifact (PATCH /artifact)`
- `Step 5 · Archive (PATCH /artifact)`
- `Digital signatures`
- `Generated artifact audit`
- `Download PDF`
- `Download after generation`
- `react`
- `react-router-dom`
- `../lib/auth`
- `,`
- `draft`
- `case`
- `if (status ===`
- `bg-gray-100 text-gray-700`
- `archived`
- `bg-slate-200 text-slate-700`
- `if (pdfPath.startsWith(`
- `) || pdfPath.startsWith(`
- `) ?`
- `:`
- `|| user?.role ===`
- `locked`
- `buyer`
- `factory`
- `,
    archive:`
- `else if (!artifactLocked) blockers.archive =`
- `else if (artifactArchived) blockers.archive =`
- `all`
- `, buyer_id:`
- `, factory_id:`
- `: (err.message ||`
- `, {
      method:`
- `space-y-2 text-sm`
- `/buyer-requests`
- `block`
- `/chat`
- `ml-2 text-sm text-gray-500`
- `text-sm text-[#5A5A5A]`
- `date`
- `grid grid-cols-1 md:grid-cols-2 gap-2 mb-3`
- **Button labels detected:** `Create Draft (POST /documents/contracts/draft)`, `Download after generation`
- **Input placeholders detected:** `Buyer name`, `Buyer user ID`, `Contract title`, `Factory name`, `Factory user ID`
- **Static Link destinations:** `/buyer-requests`, `/chat`, `/contracts`, `/insights`, `/org-settings`, `/owner`, `/partner-network`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id`
  - `() => { setSelected(c); setDrawerOpen(true)`
  - `()=>{setDrawerOpen(false); setSelected(null)`
  - `(e) => setDraftForm((prev) => ({ ...prev, buyer_id: e.target.value`
  - `(e) => setDraftForm((prev) => ({ ...prev, buyer_name: e.target.value`
  - `(e) => setDraftForm((prev) => ({ ...prev, factory_id: e.target.value`
  - `(e) => setDraftForm((prev) => ({ ...prev, factory_name: e.target.value`
  - `(e) => setDraftForm((prev) => ({ ...prev, title: e.target.value`
  - `(e)=>setFilter(e.target.value)`
  - `(e)=>setFromDate(e.target.value)`
  - `(e)=>setToDate(e.target.value)`
  - `handleCreateDraft`
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
