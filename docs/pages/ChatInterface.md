# ChatInterface — Complete Page Specification

## Page Title & Description
- **Page title:** `ChatInterface`
- **Primary route(s):** `(route not directly registered in App.jsx)`
- **Purpose:** This page is implemented by `src/pages/ChatInterface.jsx` and supports a specific GarTexHub user workflow.

## Layout & Structure
- **Top-level layout:** Built as a React functional page component with utility-class-driven responsive structure.
- **Major structural elements present:** `<aside>`, `<button>`, `<img>`, `<input>`, `<main>`, `<section>`, `<video>`.
- **Approximate placement model (desktop):**
  - Header / top controls: `x: 0-100%`, `y: 0-15%` (if present).
  - Primary content zone: `x: 5-95%`, `y: 12-88%`.
  - Sidebars/panels: left and/or right columns where `aside` blocks are present.
  - Footer/trailing actions: lower area of the page card/container.

## Theme & Styling
- **Theme system:** Tailwind utility classes and app-level dark/light behavior.
- **Explicit color tokens found in implementation:** `#0d0f2a`, `#0f0f1b`, `#0f1335`, `#101018`, `#111119`, `#111120`, `#121225`, `#12162f`, `#131327`, `#13132a`, `#141414`, `#16161e`, `#19192b`, `#1a1a2a`, `#1e1e2f`, `#2a2a3a`, `#2c2f45`, `#362f78`, `#6c5ce7`, `#6f6f8d`, `#707090`, `#7b61ff`, `#7f7f98`, `#8b5cf6`, `#8e8eaa`, `#94a3b8`, `#9db2ff`, `#a4a4bc`, `#b3b5cc`, `#b7b7cc`, `#bec3de`, `#c2c4dc`, `#d4ff59`, `#d4ff70`, `#d6d6ea`.
- **Typography:** Sans-serif utility-based text sizing/weight hierarchy (`text-*`, `font-*`).
- **Spacing/rhythm:** Padding/gap/margin utilities (`p-*`, `m-*`, `gap-*`, `space-y-*`) define vertical and horizontal density.

## Content Details
The following user-facing strings/placeholders/buttons are present in source and should appear exactly as implemented:
- `Messages`
- `Loading inbox...`
- `PRIORITY INBOX`
- `REQUESTS`
- `Pending approval.`
- `Accept Friend`
- `Accept`
- `Reject`
- `No pending requests.`
- `Video`
- `Audio`
- `Schedule`
- `No messages yet.`
- `Send`
- `) :`
- `Select a chat to begin`
- `Call History`
- `)) :`
- `No calls scheduled yet.`
- `Thread details appear here.`
- `react`
- `react-router-dom`
- `lucide-react`
- `../lib/auth`
- `ws://localhost:4000`
- `/feed`
- `Feed`
- `/search`
- `Search`
- `, label:`
- `/chat`
- `Chat`
- `/help`
- `Help`
- `).startsWith(`
- `}

  if (!lock || lock.status ===`
- `if (lock.status ===`
- `you`
- `image`
- `video`
- `if (url.startsWith(`
- `) || url.startsWith(`
- `) ?`
- `:`
- `).replace(/[^a-zA-Z0-9]/g,`
- `).slice(0, 7) ||`
- `}${words[1][0] ||`
- `{}`
- `chat_message`
- `chat_error`
- `)) {
            setError(payload.error ||`
- `accept`
- `POST`
- `Schedule date/time (ISO or YYYY-MM-DD HH:mm)`
- `,`
- `) ||`
- `/calls/scheduled`
- `Failed to schedule call`
- `, {
        method:`
- `)
      setScheduleStatus(`
- `Failed to start call`
- `file`
- `message`
- `Upload failed`
- `)
      setUploadStatus(`
- `space-y-1`
- `rel=`
- `Shared image`
- `text`
- `border-[#8b5cf6]/70 bg-[#8b5cf6]/20 text-[#d4ff59]`
- **Button labels detected:** `updateRequestState(thread, 'accept')}>Accept`, `updateRequestState(thread, 'accept')}>Accept Friend`, `updateRequestState(thread, 'reject')}>Reject`
- **Input placeholders detected:** `Search Message...`, `Type a message...`

## Interactions & Functionality
- **Forms/inputs/buttons:** wired with React state and event handlers.
- **Event handler expressions found:**
  - `() => fileInputRef.current?.click()`
  - `() => navigate('/org-settings')`
  - `() => scheduleCall(activeThread)`
  - `() => setActiveThreadId(thread.id)`
  - `() => setIsLiveMessagingEnabled((value) => !value)`
  - `() => setShowThreadInfo((value) => !value)`
  - `() => startInstantCall(activeThread)`
  - `() => updateRequestState(thread, 'accept')`
  - `() => updateRequestState(thread, 'reject')`
  - `(event) => setDraftMessage(event.target.value)`
  - `(event) => setQuery(event.target.value)`
  - `(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file)`
  - `(event) => { if (event.key === 'Enter') sendMessage()`
  - `sendMessage`
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
