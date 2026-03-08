# Login — Complete Page Specification

## Page Title & Description
- **Page title:** `Login`
- **Primary route(s):** `/login`
- **Purpose:** This page is implemented by `src/pages/auth/Login.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<form>`, `<input>`.
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
- `Login`
- `Access pages based on your role (Buyer, Factory, Buying House, Admin).`
- `Email`
- `Password`
- `Remember me`
- `New here?`
- `Create account`
- `react`
- `react-router-dom`
- `../../lib/auth`
- `, {
        method:`
- `mt-2 text-sm text-gray-600`
- `mt-6 space-y-4`
- `email`
- `password`
- `checkbox`
- `text-sm text-red-500`
- `:`
- `mt-6 text-sm text-gray-600`
- `to=`
- **Button labels detected:** `{loading ? 'Signing in...' : 'Sign in'}`
- **Static Link destinations:** `/signup`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `(e) => setEmail(e.target.value)`
  - `(e) => setPassword(e.target.value)`
  - `(e) => setRememberMe(e.target.checked)`
  - `handleLogin`
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
