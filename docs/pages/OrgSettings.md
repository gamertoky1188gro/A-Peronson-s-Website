# OrgSettings — Complete Page Specification

## Page Title & Description
- **Page title:** `OrgSettings`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/OrgSettings.jsx` and supports a specific GarTexHub user workflow.

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
- **Explicit color tokens found in implementation:** `#0A66C2`, `#1A1A1A`, `#5A5A5A`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Organization Settings`
- `Manage organization profile, verification, branding, security and subscription`
- `General Info`
- `Verification`
- `Branding`
- `Security`
- `Members`
- `Subscription`
- `Assistant Knowledge`
- `Organization Name`
- `Industry Category`
- `Registration Number`
- `Upload trade license and certifications`
- `Verification is subscription-based, not permanent. Keep premium active to keep the badge visible.`
- `Upload Trade License`
- `Upload ISO / WRAP`
- `You do not have permission to view this section. Owner/Admin access required.`
- `Primary Contact Email`
- `Support Contact Number`
- `Enable 2FA`
- `Active sessions and login activity are shown here.`
- `Open Member Management`
- `Current Plan: Premium Monthly`
- `Verification is subscription-based, not permanent.`
- `Renew premium monthly`
- `Entry Type`
- `FAQ`
- `Company Fact`
- `Question`
- `Answer`
- `Keywords (comma separated)`
- `Cancel edit`
- `Edit`
- `Delete`
- `No org-specific entries yet.`
- `react`
- `react-router-dom`
- `../lib/auth`
- `faq`
- `, keywords:`
- `expired`
- `verified_active`
- `)
    } catch (err) {
      setFaqFeedback(err.status === 403 ?`
- `,`
- `PUT`
- `)
      } else {
        await apiRequest(`
- `, { method:`
- `)
      }
      resetForm()
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.status === 403 ?`
- `DELETE`
- `)
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.status === 403 ?`
- `bg-amber-100 text-amber-700`
- `bg-red-100 text-red-700`
- `Verified active`
- `,
    expired:`
- `text-sm text-[#5A5A5A]`
- `border-b-2 border-[#0A66C2]`
- `security`
- `members`
- `block text-sm`
- `text-xs text-[#5A5A5A]`
- `mt-2 text-xs text-[#5A5A5A]`
- `mt-3`
- `checkbox`
- `mt-3 text-sm text-[#5A5A5A]`
- `text-sm`
- `grid grid-cols-1 lg:grid-cols-2 gap-4`
- `:`
- `fact`
- `submit`
- `Update`
- **Button labels detected:** `Cancel edit`, `Upload ISO / WRAP`, `Upload Trade License`
- **Static Link destinations:** `/member-management`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => removeFaq(entry.id)`
  - `() => selectForEdit(entry)`
  - `() => setRemainingDays((d) => d + 30)`
  - `()=> { setTab('assistant_knowledge'); loadFaqs()`
  - `()=>setTab('branding')`
  - `()=>setTab('general')`
  - `()=>setTab('members')`
  - `()=>setTab('security')`
  - `()=>setTab('subscription')`
  - `()=>setTab('verification')`
  - `(e) => setKnowledgeForm({ ...knowledgeForm, answer: e.target.value`
  - `(e) => setKnowledgeForm({ ...knowledgeForm, keywords: e.target.value`
  - `(e) => setKnowledgeForm({ ...knowledgeForm, question: e.target.value`
  - `(e) => setKnowledgeForm({ ...knowledgeForm, type: e.target.value`
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
