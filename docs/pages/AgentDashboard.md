# AgentDashboard — Complete Page Specification

## Page Title & Description
- **Page title:** `AgentDashboard`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/AgentDashboard.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<aside>`, `<button>`, `<main>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0A66C2`, `#1A1A1A`, `#5A5A5A`, `#F4F9FF`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `📋 My Requests`
- `💬 My Chats`
- `🏭 Connected Factories`
- `Plan`
- `Logout`
- `Loading agent metrics…`
- `Agent Activity`
- `Requests`
- `Chats`
- `Buyer Requests`
- `Open Requests`
- `Contracts / Docs`
- `) : (`
- `react`
- `react-router-dom`
- `requests`
- `text-sm text-[#5A5A5A]`
- `text-sm text-[#5A5A5A] mt-2`
- `free`
- `:`
- `flex gap-2`
- `bg-[#0A66C2] text-white`
- `border`
- `chats`
- `grid grid-cols-1 md:grid-cols-3 gap-3`
- `space-y-2`
- **Static Link destinations:** `/agent?tab=chats`, `/agent?tab=factories`, `/agent?tab=requests`, `/login`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => setActiveTab('chats')`
  - `() => setActiveTab('requests')`
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
