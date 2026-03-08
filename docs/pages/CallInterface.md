# CallInterface — Complete Page Specification

## Page Title & Description
- **Page title:** `CallInterface`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/CallInterface.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<aside>`, `<button>`, `<footer>`, `<header>`, `<section>`, `<video>`.
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
- `🖥️ Share`
- `You`
- `Participant`
- `Start Call`
- `End Call`
- `Schedule Follow-up`
- `Leave`
- `Meeting Details`
- `Participants`
- `))) :`
- `No participant data yet.`
- `Notes`
- `Share key decisions, pricing updates, and next actions here during the call.`
- `react`
- `react-router-dom`
- `../lib/auth`
- `available`
- `failed`
- `ws://localhost:4000`
- `callId`
- `matchId`
- `, {
        method:`
- `:`
- `)
      }
    } catch (err) {
      setStatusMessage(err.message ||`
- `ice`
- `offer`
- `{}`
- `) {
          setPeerState(payload.should_offer ?`
- `) {
          setPeerState(`
- `WebSocket error`
- `Follow-up date/time`
- `/calls/scheduled`
- `POST`
- `,
          security_audit_id: callDetails?.security_audit_id ||`
- `Failed to schedule follow-up.`
- `)
    } catch (err) {
      setStatusMessage(err.message ||`
- `scheduled`
- `text-sm text-gray-600 dark:text-gray-300`
- `grid grid-cols-1 gap-3 md:grid-cols-2`
- `h-full w-full object-cover`
- `grid gap-2`
- `Started`
- `Not started`
- `mt-2 flex flex-wrap gap-2`
- **Button labels detected:** `{isRefreshing ? 'Refreshing…' : 'Refresh Recording'}`, `End Call`, `Schedule Follow-up`, `Start Call`, `🖥️ Share`
- **Static Link destinations:** `/`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => {
                  setIsCameraOn((v) => !v)
                  const stream = localStreamRef.current
                  if (stream) stream.getVideoTracks().forEach((t) => { t.enabled = !isCameraOn`
  - `() => {
                  setIsMuted((v) => !v)
                  const stream = localStreamRef.current
                  if (stream) stream.getAudioTracks().forEach((t) => { t.enabled = isMuted`
  - `endCall`
  - `refreshRecordingStatus`
  - `scheduleFollowUp`
  - `startCall`
- **Behavior model:** user actions trigger local state updates and/or API requests through shared auth/request helpers where used.

## Images & Media
- **Image elements:** none explicitly declared in this page source (icons may come from component libraries).
- **Video elements:** present (`<video>` tag detected).
- **Iconography:** uses shared icon sets/components (e.g., Lucide or emoji/text icons where coded).

## Extra Notes / Metadata
- **SEO metadata:** no page-specific `<head>` metadata is set in this component; defaults are inherited from app shell/index.
- **Accessibility notes:** semantic improvements should ensure button labels, alt text, focus states, and color contrast remain compliant.
- **Responsive behavior:** controlled by utility breakpoints (`sm:`, `md:`, `lg:` etc.) and flexible grid/flex containers.
- **Implementation source of truth:** this markdown reflects the current component and should be updated whenever UI text/layout/classes change.
