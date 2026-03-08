# HelpCenter — Complete Page Specification

## Page Title & Description
- **Page title:** `HelpCenter`
- **Primary route(s):** `/help`
- **Purpose:** This page is implemented by `src/pages/HelpCenter.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<button>`, `<form>`, `<header>`, `<input>`, `<nav>`, `<section>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#004182`, `#0A192F`, `#0A66C2`, `#333`, `#5A5A5A`, `#BEE3F8`, `#E9F0F7`, `#F0F7FF`, `#F4F7F9`, `#F8F9FA`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())) return (`
- `HELP CENTER – GarTexHub`
- `Professional operational manual and platform guidance.`
- `10. Frequently Asked Questions (FAQ)`
- `Admin: Manage Knowledge Base FAQ`
- `Cancel`
- `Edit`
- `Del`
- `11. Contact Support`
- `If your issue is not resolved, you may use the Floating Assistant, submit a support ticket, or contact the GarTexHub Support Team.`
- `Open Support Ticket`
- `Live Chat`
- `Response time may vary depending on subscription level.`
- `Quick Navigation`
- `10. FAQ`
- `Floating Assistant`
- `Available on all pages to help with setup, navigation, and support. It does not handle negotiations.`
- `react`
- `../lib/auth`
- `quick-start`
- `1. Quick Start Guide`
- `,`
- `]
  },
  {
    id:`
- `,
    title:`
- `Post detailed Buyer Requests.`
- `]
      }
    ]
  },
  {
    id:`
- `,
    roles: [
      {
        role:`
- `,
        docs: [`
- `]
      },
      {
        role:`
- `]
      }
    ],
    footer:`
- `},
  {
    id:`
- `Verified Users`
- `},
      { title:`
- `, text:`
- `Message Requests.`
- `]}
    ]
  },
  {
    id:`
- `],
    footer:`
- `, keywords:`
- `, a:`
- `},
    { q:`
- `faq`
- `PUT`
- `, { method:`
- `FAQ updated`
- `DELETE`
- `grid grid-cols-1 lg:grid-cols-4 gap-8`
- `mb-4 text-[#333]`
- `space-y-2`
- `text-[#5A5A5A] flex gap-2`
- `space-y-4`
- `list-disc ml-5 text-[#5A5A5A]`
- `list-disc ml-5 text-[#5A5A5A] space-y-1`
- `mt-4 text-sm italic text-[#5A5A5A] border-t pt-2`
- `mb-4`
- `Search FAQs...`
- `mt-3 text-[#5A5A5A] pl-4 border-l-2 border-[#0A66C2]`
- `grid grid-cols-1 md:grid-cols-2 gap-6`
- `space-y-3`
- `Keywords (comma separated)`
- `submit`
- `Update`
- `Add`
- `max-h-64 overflow-y-auto space-y-2 pr-2`
- `flex gap-1 ml-2`
- `text-blue-600`
- `text-red-600`
- `mt-2 text-xs text-blue-800`
- `mb-6 opacity-90`
- `mt-4 text-xs opacity-70`
- `space-y-6`
- **Button labels detected:** `Cancel`, `Live Chat`, `Open Support Ticket`, `removeFaq(e.id)} className="text-red-600">Del`, `selectForEdit(e)} className="text-blue-600">Edit`
- **Input placeholders detected:** `Answer`, `Keywords (comma separated)`, `Question`, `Search FAQs...`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => removeFaq(e.id)`
  - `() => selectForEdit(e)`
  - `(e) => setForm({...form, answer: e.target.value`
  - `(e) => setForm({...form, keywords: e.target.value`
  - `(e) => setForm({...form, question: e.target.value`
  - `(e) => setQ(e.target.value)`
  - `resetForm`
  - `saveFaq`
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
