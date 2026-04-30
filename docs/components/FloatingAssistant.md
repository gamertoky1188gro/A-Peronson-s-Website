# FloatingAssistant Component

**Type:** Global AI Assistant Component
**File:** `src/components/FloatingAssistant.jsx`
**Lines:** ~388

## 1) Purpose

Persistent AI/help assistant UI as a slide-in panel:
- Floating button to toggle the panel
- WebSocket connection for real-time AI responses
- Typewriter effect for assistant messages
- Special "orb" styling on `/help` route

## 2) Routes Impacted

- Renders on most routes (via AppLayout)
- Special visual mode on `/help` (glass + conic ring via `.assistant-orb-btn`)

## 3) Key Backend

- WebSocket URL: Derived from `API_BASE` (http -> ws, /api -> /ws)
- Protocol: `{ type: 'ask', question }` → `{ type: 'reply', answer }`
- Authentication via WebSocket identify message

## 4) Dependencies

### External Libraries
- `react` - useState, useRef, useEffect

### Local Imports
- `../lib/auth` - API_BASE, getToken
- `./ui/BotLogo` - Bot logo component

## 5) State Management

- `useState` for:
  - `open` - Panel visibility
  - `input` - Message composer input
  - `messages` - Chat transcript array
  - `loading` - Thinking state
- `useRef` for:
  - `scrollRef` - Message list scroll
  - `socketRef` - WebSocket instance
  - `requestSeqRef` - Request sequence

## 6) Key Components

- `TypewriterText` - Helper for typewriter effect

## 7) Styling

### Custom CSS Classes
- `.assistant-orb-btn` - Orb styling on /help

### Tailwind Utilities
- Layout: `fixed`, `bottom-*`, `right-*`
- Colors: `bg-slate-*`, `text-slate-*`
- Transitions: `transition-all`

## 8) Animations

- Typewriter effect (character-by-character reveal)
- Slide-in panel animation
- Thinking indicator (dot animation)

## 9) Real-time Features

- WebSocket connection to `/ws`
- Auto-scroll on new messages
- Token authentication via WebSocket

## 10) Error Handling

- WebSocket connection error handling
- Graceful fallback if WS unavailable

---

*Generated from source: src/components/FloatingAssistant.jsx*