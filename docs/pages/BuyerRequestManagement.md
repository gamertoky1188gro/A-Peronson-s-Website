# BuyerRequestManagement — Complete Page Specification

## Page Title & Description
- **Page title:** `BuyerRequestManagement`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/BuyerRequestManagement.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<input>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`, `#1A1A1A`, `#5A5A5A`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Post New Buyer Request`
- `Category`
- `Subcategory`
- `Quantity`
- `Target Price`
- `Continue`
- `Fabric Type`
- `GSM`
- `Certification Required`
- `Shipping Terms`
- `Additional Notes`
- `Back`
- `My Requests`
- `Loading your requests...`
- `) : !requests.length ? (`
- `No requests found.`
- `) : (`
- `Status:`
- `Edit`
- `Cancel`
- `react`
- `../lib/auth`
- `,
  subcategory:`
- `,
  price:`
- `,
  fabric:`
- `,
  gsm:`
- `,
  cert:`
- `)
    .split(`
- `,
    form.gsm ? `GSM: ${form.gsm}` :`
- `,
    subcategory: subcategoryMatch?.[1]?.trim() ||`
- `,
    gsm: gsmMatch?.[1]?.trim() ||`
- `,`
- `, message:`
- `error`
- `Failed to load requests.`
- `})
    try {
      await apiRequest(`
- `, {
        method:`
- `success`
- `Request posted successfully.`
- `Failed to post request.`
- `PATCH`
- `)
      setEditForm(EMPTY_FORM)
      setFeedback({ type:`
- `})
      await loadRequests()
    } catch (err) {
      setFeedback({ type:`
- `, message: err.message ||`
- `DELETE`
- `Request deleted successfully.`
- `)
        setEditForm(EMPTY_FORM)
      }
      await loadRequests()
    } catch (err) {
      setFeedback({ type:`
- `block text-sm`
- `space-y-3`
- `flex gap-2`
- `:`
- `text-red-600`
- `text-sm text-[#5A5A5A]`
- `mt-3 border-t pt-3 space-y-2`
- `placeholder=`
- **Button labels detected:** `setStep(1)}>Back`
- **Input placeholders detected:** `Additional Notes`, `Category`, `Certifications (comma separated)`, `Fabric Type`, `GSM`, `Quantity`, `Shipping Terms`, `Subcategory`, `Target Price`, `Timeline (days)`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => deleteRequest(request.id)`
  - `() => setEditingId('')`
  - `() => startEditing(request)`
  - `()=>setStep(1)`
  - `()=>setStep(2)`
  - `()=>setStep(3)`
  - `(e)=>setEditForm({...editForm, category:e.target.value`
  - `(e)=>setEditForm({...editForm, cert:e.target.value`
  - `(e)=>setEditForm({...editForm, deadline:e.target.value`
  - `(e)=>setEditForm({...editForm, fabric:e.target.value`
  - `(e)=>setEditForm({...editForm, gsm:e.target.value`
  - `(e)=>setEditForm({...editForm, notes:e.target.value`
  - `(e)=>setEditForm({...editForm, price:e.target.value`
  - `(e)=>setEditForm({...editForm, quantity:e.target.value`
  - `(e)=>setEditForm({...editForm, shippingTerms:e.target.value`
  - `(e)=>setEditForm({...editForm, subcategory:e.target.value`
  - `(e)=>setForm({...form, category:e.target.value`
  - `(e)=>setForm({...form, cert:e.target.value`
  - `(e)=>setForm({...form, fabric:e.target.value`
  - `(e)=>setForm({...form, gsm:e.target.value`
  - `(e)=>setForm({...form, notes:e.target.value`
  - `(e)=>setForm({...form, price:e.target.value`
  - `(e)=>setForm({...form, quantity:e.target.value`
  - `(e)=>setForm({...form, shippingTerms:e.target.value`
  - `(e)=>setForm({...form, subcategory:e.target.value`
  - `createRequest`
  - `loadRequests`
  - `saveEdit`
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
