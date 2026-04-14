# ChatInterface - Route `/chat`

**Access:** Protected (Login required). **Roles:** buyer, buying_house, factory, owner, admin, agent

## 1) Purpose

- **Why it exists:** See the route header comment in `src/pages/ChatInterface.jsx`.
- **Backend interactions:** Yes (see API map below).
- **Primary file:** `src/pages/ChatInterface.jsx`
- **Source snapshot:** `docs/_generated/sources/src_pages_ChatInterface.jsx.txt` (line-numbered)

## 2) Page Structure (Components + Sections)

### 2.1 Imported child components

- ../lib/auth (src/pages/ChatInterface.jsx:49)
- ../lib/events (src/pages/ChatInterface.jsx:50)
- ../lib/leadSource (src/pages/ChatInterface.jsx:51)
- ../components/chat/AttachmentPreviewModal (src/pages/ChatInterface.jsx:52)
- ../components/chat/MarkdownMessage (src/pages/ChatInterface.jsx:53)
- ../components/chat/FileAttachmentCard (src/pages/ChatInterface.jsx:54)
- ../components/JourneyTimeline (src/pages/ChatInterface.jsx:55)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/ChatInterface.jsx:1532`

```jsx
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none' }}>
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
```
- `aside` at `src/pages/ChatInterface.jsx:1572`

```jsx
        <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
```
- `main` at `src/pages/ChatInterface.jsx:1655`

```jsx
        <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 borderless-divider-b">
```
- `aside` at `src/pages/ChatInterface.jsx:1889`

```jsx
        <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="mb-8 text-center">
```
## 3) Styling (className blocks, utility breakdown, and custom CSS)

### 3.1 Custom CSS utilities referenced by this page (App.css / index.css)

- `.nav-glass` definitions:
  - `src/App.css:897`
- `.spotlight-card` definitions:
  - `src/App.css:550`
- `.skeleton` definitions:
  - `src/App.css:865`
- `.neo-page` definitions:
  - `src/App.css:115`
- `.neo-panel` definitions:
  - `src/App.css:123`
- `.cyberpunk-page` definitions:
  - `src/App.css:116`
- `.cyberpunk-card` definitions:
  - `src/App.css:117`
- `.assistant-orb-btn` definitions:
  - `src/App.css:801`
- `.legal-weave` definitions:
  - `src/App.css:649`
- `.signature-draw` definitions:
  - `src/App.css:684`
- `.verified-shimmer` definitions:
  - `src/App.css:717`
- `.verified-pulse` definitions:
  - `src/App.css:576`
- `.conic-beam` definitions:
  - `src/App.css:585`

### 3.2 Every className block (with grouped explanations)

#### `src/pages/ChatInterface.jsx:1040`

```jsx
        <div className="space-y-1">
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
```
**Raw class strings detected (best effort):**

- `space-y-1`
- `mb-1`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1041`

```jsx
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
```
**Raw class strings detected (best effort):**

- `mb-1`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1045`

```jsx
            className="block w-full overflow-hidden rounded-xl borderless-shadow text-left transition-opacity hover:opacity-95"
            title="View image"
          >
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
```
**Raw class strings detected (best effort):**

- `block w-full overflow-hidden rounded-xl borderless-shadow text-left transition-opacity hover:opacity-95`
- `View image`
- `max-h-64 w-full object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-h-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-left` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `transition-opacity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:opacity-95` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `image` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1048`

```jsx
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
          </button>
          <a
            href={attachmentUrl}
```
**Raw class strings detected (best effort):**

- `max-h-64 w-full object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1055`

```jsx
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
          >
            <Download size={12} />
            Download
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1066`

```jsx
        <div className="space-y-1">
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
```
**Raw class strings detected (best effort):**

- `space-y-1`
- `mb-1`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1067`

```jsx
          {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
```
**Raw class strings detected (best effort):**

- `mb-1`
- `button`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1071`

```jsx
            className="relative block w-full overflow-hidden rounded-xl borderless-shadow text-left"
            title="View video"
          >
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
```
**Raw class strings detected (best effort):**

- `relative block w-full overflow-hidden rounded-xl borderless-shadow text-left`
- `View video`
- `max-h-64 w-full object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-h-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-left` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Other:**
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `video` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1074`

```jsx
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white">Play</div>
            </div>
```
**Raw class strings detected (best effort):**

- `max-h-64 w-full object-cover`
- `pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25`
- `rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `max-h-64` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/25` — Background color/surface.
  - `bg-black/40` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1075`

```jsx
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white">Play</div>
            </div>
          </button>
```
**Raw class strings detected (best effort):**

- `pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25`
- `rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/25` — Background color/surface.
  - `bg-black/40` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1076`

```jsx
              <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white">Play</div>
            </div>
          </button>
          <a
```
**Raw class strings detected (best effort):**

- `rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/40` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1084`

```jsx
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
          >
            <Download size={12} />
            Download
```
**Raw class strings detected (best effort):**

- `inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-blue-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-blue-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `underline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `underline-offset-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1095`

```jsx
        <div className="space-y-1">
          {message.message && message.message !== 'Shared a file' ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <FileAttachmentCard
            attachment={message?.attachment}
```
**Raw class strings detected (best effort):**

- `space-y-1`
- `mb-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1096`

```jsx
          {message.message && message.message !== 'Shared a file' ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
          <FileAttachmentCard
            attachment={message?.attachment}
            url={attachmentUrl}
```
**Raw class strings detected (best effort):**

- `mb-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1112`

```jsx
        <div className="space-y-2">
          <MarkdownMessage text={message.message} />
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl borderless-shadow bg-slate-50 p-2 dark:bg-black/20">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `block rounded-xl borderless-shadow bg-slate-50 p-2 dark:bg-black/20`
- `mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-slate-200` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#1f2448]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#b8bfe8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1114`

```jsx
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl borderless-shadow bg-slate-50 p-2 dark:bg-black/20">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
              {meta.host}
            </div>
```
**Raw class strings detected (best effort):**

- `block rounded-xl borderless-shadow bg-slate-50 p-2 dark:bg-black/20`
- `mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-2` — Padding (all sides).
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `bg-slate-200` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#1f2448]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#b8bfe8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1115`

```jsx
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
              {meta.host}
            </div>
            <div className="text-sm font-semibold">{meta.title}</div>
```
**Raw class strings detected (best effort):**

- `mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]`
- `text-sm font-semibold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-200` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-[#1f2448]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#b8bfe8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1118`

```jsx
            <div className="text-sm font-semibold">{meta.title}</div>
            <div className="text-xs opacity-70">{meta.description}</div>
          </a>
        </div>
```
**Raw class strings detected (best effort):**

- `text-sm font-semibold`
- `text-xs opacity-70`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1119`

```jsx
            <div className="text-xs opacity-70">{meta.description}</div>
          </a>
        </div>
      )
```
**Raw class strings detected (best effort):**

- `text-xs opacity-70`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `opacity-70` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1391`

```jsx
      className="h-screen w-screen font-['Poppins',sans-serif] text-white chat-interface-container overflow-hidden"
      style={{
        background: theme.pageBg,
        color: theme.textPrimary,
```
**Raw class strings detected (best effort):**

- `h-screen w-screen font-[`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-screen` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-[` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1477`

```jsx
        <div className="mx-3 mt-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
          style={{ background: notice.type === 'error' ? '#fee2e2' : '#e0f2fe', color: '#0f172a' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
```
**Raw class strings detected (best effort):**

- `mx-3 mt-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm`
- `error`
- `#fee2e2`
- `#e0f2fe`
- `#0f172a`
- `flex items-center justify-between gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-3` — Horizontal margin (left/right).
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `error` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#fee2e2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#e0f2fe` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#0f172a` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1479`

```jsx
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold">{notice.title || 'Notice'}</div>
              <div className="text-[12px] opacity-80">{notice.message || ''}</div>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-4`
- `text-[13px] font-semibold`
- `text-[12px] opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[13px]` — Text color or text sizing.
  - `text-[12px]` — Text color or text sizing.
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1481`

```jsx
              <div className="text-[13px] font-semibold">{notice.title || 'Notice'}</div>
              <div className="text-[12px] opacity-80">{notice.message || ''}</div>
            </div>
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
```
**Raw class strings detected (best effort):**

- `text-[13px] font-semibold`
- `text-[12px] opacity-80`
- `text-xs font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
- **Color / surface:**
  - `text-[13px]` — Text color or text sizing.
  - `text-[12px]` — Text color or text sizing.
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1482`

```jsx
              <div className="text-[12px] opacity-80">{notice.message || ''}</div>
            </div>
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
```
**Raw class strings detected (best effort):**

- `text-[12px] opacity-80`
- `text-xs font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[12px]` — Text color or text sizing.
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1484`

```jsx
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1494`

```jsx
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl borderless-shadow bg-[#14122b] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
```
**Raw class strings detected (best effort):**

- `fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4`
- `w-full max-w-sm rounded-2xl borderless-shadow bg-[#14122b] p-6 text-white shadow-2xl`
- `flex items-center gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `fixed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `z-[80]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-sm` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/50` — Background color/surface.
  - `bg-[#14122b]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-2xl` — Drop shadow depth (elevation).

#### `src/pages/ChatInterface.jsx:1495`

```jsx
          <div className="w-full max-w-sm rounded-2xl borderless-shadow bg-[#14122b] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
                <img
```
**Raw class strings detected (best effort):**

- `w-full max-w-sm rounded-2xl borderless-shadow bg-[#14122b] p-6 text-white shadow-2xl`
- `flex items-center gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `max-w-sm` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#14122b]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `shadow-2xl` — Drop shadow depth (elevation).

#### `src/pages/ChatInterface.jsx:1496`

```jsx
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
                <img
                  src={avatarUrl(callPromptThread.avatar)}
```
**Raw class strings detected (best effort):**

- `flex items-center gap-4`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1501`

```jsx
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold">
```
**Raw class strings detected (best effort):**

- `h-16 w-16 rounded-full object-cover`
- `flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#2a2744]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1504`

```jsx
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold">
                  {getInitials(formatDisplayName(callPromptThread.name, callPromptThread.senderId))}
                </div>
              )}
```
**Raw class strings detected (best effort):**

- `flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-16` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#2a2744]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1509`

```jsx
                <p className="text-sm text-slate-300">{callPromptThread.direction === 'incoming' ? 'Incoming call' : 'Calling'}</p>
                <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call*'}</p>
              </div>
```
**Raw class strings detected (best effort):**

- `text-sm text-slate-300`
- `text-lg font-semibold`
- `text-xs text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `text-slate-300` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1510`

```jsx
                <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call*'}</p>
              </div>
            </div>
```
**Raw class strings detected (best effort):**

- `text-lg font-semibold`
- `text-xs text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1511`

```jsx
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call*'}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
```
**Raw class strings detected (best effort):**

- `text-xs text-slate-400`
- `mt-6 flex items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1514`

```jsx
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={closeCallPrompt}
                className="flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
```
**Raw class strings detected (best effort):**

- `mt-6 flex items-center justify-between gap-3`
- `flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `mt-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-red-300` — Text color or text sizing.
- **Color / surface:**
  - `bg-red-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-red-500/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1517`

```jsx
                className="flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
              >
                Decline
              </button>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-red-300` — Text color or text sizing.
- **Color / surface:**
  - `bg-red-500/10` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-red-500/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1523`

```jsx
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                Accept
              </button>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
- **Spacing:**
  - `px-4` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-emerald-400` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1531`

```jsx
      <div className="grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-[62px_1fr] lg:grid-cols-[62px_minmax(260px,22vw)_1fr] xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]">
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none' }}>
          <div className="space-y-2">
            <button
```
**Raw class strings detected (best effort):**

- `grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-[62px_1fr] lg:grid-cols-[62px_minmax(260px,22vw)_1fr] xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]`
- `hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1`
- `space-y-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `grid-cols-1` — Grid layout.
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2` — Padding (all sides).
  - `py-1` — Vertical padding (top/bottom).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[22px]` — Corner radius.
- **Responsive variants:**
  - `md:grid-cols-[62px_1fr]` — Variant prefix (responsive, dark, or interaction state).
  - `lg:grid-cols-[62px_minmax(260px,22vw)_1fr]` — Variant prefix (responsive, dark, or interaction state).
  - `xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]` — Variant prefix (responsive, dark, or interaction state).
  - `md:flex` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1532`

```jsx
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none' }}>
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
```
**Raw class strings detected (best effort):**

- `hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1`
- `space-y-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-2` — Padding (all sides).
  - `py-1` — Vertical padding (top/bottom).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[22px]` — Corner radius.
- **Responsive variants:**
  - `md:flex` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1533`

```jsx
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
                isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `bg-white text-orange-400 shadow-sm`
- `bg-[#171031] text-[#D4FF59]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-orange-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-[#171031]` — Background color/surface.
  - `text-[#D4FF59]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `shadow-sm` — Drop shadow depth (elevation).

#### `src/pages/ChatInterface.jsx:1535`

```jsx
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
                isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
              }`}
              onClick={() => setThemeMode((value) => (value === 'light' ? 'dark' : 'light'))}
```
**Raw class strings detected (best effort):**

- `bg-white text-orange-400 shadow-sm`
- `bg-[#171031] text-[#D4FF59]`
- `light`
- `dark`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-orange-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `bg-[#171031]` — Background color/surface.
  - `text-[#D4FF59]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `light` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `dark` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1550`

```jsx
                  className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all${
                    isActive
                      ? (isLight ? 'bg-[var(--gt-blue)] text-white' : 'bg-[rgba(10,102,194,0.18)] text-[#D4FF59]')
                      : (isLight ? 'text-slate-400 hover:bg-white hover:text-[var(--gt-blue)]' : 'bg-[#171031] text-[#8f95bb] hover:text-white')
```
**Raw class strings detected (best effort):**

- `bg-[var(--gt-blue)] text-white`
- `bg-[rgba(10,102,194,0.18)] text-[#D4FF59]`
- `text-slate-400 hover:bg-white hover:text-[var(--gt-blue)]`
- `bg-[#171031] text-[#8f95bb] hover:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-[rgba(10,102,194,0.18)]` — Background color/surface.
  - `text-[#D4FF59]` — Text color or text sizing.
  - `bg-[#171031]` — Background color/surface.
  - `text-[#8f95bb]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-[var(--gt-blue)]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1563`

```jsx
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
            style={{ background: isLight ? '#ffffff' : theme.tileBg, color: isLight ? '#ef4444' : '#8f95bb' }}
            onClick={() => navigate('/login')}
            title="Logout"
```
**Raw class strings detected (best effort):**

- `flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors`
- `#ffffff`
- `#ef4444`
- `#8f95bb`
- `/login`
- `Logout`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[12px]` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `#ffffff` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#ef4444` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#8f95bb` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `/login` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Logout` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1572`

```jsx
        <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
```
**Raw class strings detected (best effort):**

- `hidden lg:block rounded-[24px] p-5 overflow-hidden borderless-shadow`
- `mb-6`
- `text-xl font-bold tracking-tight`
- `text-xs font-medium`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-5` — Padding (all sides).
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[24px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `lg:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1573`

```jsx
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>
```
**Raw class strings detected (best effort):**

- `mb-6`
- `text-xl font-bold tracking-tight`
- `text-xs font-medium`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1574`

```jsx
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>

```
**Raw class strings detected (best effort):**

- `text-xl font-bold tracking-tight`
- `text-xs font-medium`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1575`

```jsx
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>

          <div className="relative mb-6">
```
**Raw class strings detected (best effort):**

- `text-xs font-medium`
- `relative mb-6`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1578`

```jsx
          <div className="relative mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all"
```
**Raw class strings detected (best effort):**

- `relative mb-6`
- `absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`
- `h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pl-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[13px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[14px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1579`

```jsx
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all"
              style={{ background: theme.inputBg, color: theme.textPrimary }}
```
**Raw class strings detected (best effort):**

- `absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`
- `h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `left-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `top-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `pl-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[13px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[14px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1581`

```jsx
              className="h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all"
              style={{ background: theme.inputBg, color: theme.textPrimary }}
              placeholder="Search conversations..."
              value={query}
```
**Raw class strings detected (best effort):**

- `h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all`
- `Search conversations...`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `pl-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[13px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[14px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `conversations...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1589`

```jsx
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[var(--gt-blue)]">{allVisibleThreads.length}</span>
          </div>
```
**Raw class strings detected (best effort):**

- `mb-3 flex items-center justify-between px-1`
- `text-xs font-bold uppercase tracking-wider`
- `text-[10px] font-bold text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-1` — Horizontal padding (left/right).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1590`

```jsx
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[var(--gt-blue)]">{allVisibleThreads.length}</span>
          </div>

```
**Raw class strings detected (best effort):**

- `text-xs font-bold uppercase tracking-wider`
- `text-[10px] font-bold text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1591`

```jsx
            <span className="text-[10px] font-bold text-[var(--gt-blue)]">{allVisibleThreads.length}</span>
          </div>

          <div className="h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar">
```
**Raw class strings detected (best effort):**

- `text-[10px] font-bold text-[var(--gt-blue)]`
- `h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-[calc(100vh-250px)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Other:**
  - `custom-scrollbar` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1594`

```jsx
          <div className="h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar">
            {loading ? <div className="p-4 text-center text-sm text-slate-400">Loading inbox...</div> : null}
            {!loading && visibleError ? <div className="p-4 text-center text-sm text-red-400">{visibleError}</div> : null}
            {!loading &&
```
**Raw class strings detected (best effort):**

- `h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar`
- `p-4 text-center text-sm text-slate-400`
- `p-4 text-center text-sm text-red-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-[calc(100vh-250px)]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pr-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
  - `text-red-400` — Text color or text sizing.
- **Other:**
  - `custom-scrollbar` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1595`

```jsx
            {loading ? <div className="p-4 text-center text-sm text-slate-400">Loading inbox...</div> : null}
            {!loading && visibleError ? <div className="p-4 text-center text-sm text-red-400">{visibleError}</div> : null}
            {!loading &&
              !visibleError &&
```
**Raw class strings detected (best effort):**

- `p-4 text-center text-sm text-slate-400`
- `p-4 text-center text-sm text-red-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
  - `text-red-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1596`

```jsx
            {!loading && visibleError ? <div className="p-4 text-center text-sm text-red-400">{visibleError}</div> : null}
            {!loading &&
              !visibleError &&
              [...filteredPriorityInbox, ...filteredRequests].map((thread) => {
```
**Raw class strings detected (best effort):**

- `p-4 text-center text-sm text-red-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-center` — Text color or text sizing.
  - `text-sm` — Text color or text sizing.
  - `text-red-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1606`

```jsx
                    className={`group w-full rounded-[16px] px-3 py-3 text-left transition-all${hasUnread && !isActive ? 'ring-1 ring-[var(--gt-blue)]/20' : ''}`}
                    style={{ background: isActive ? theme.threadActiveBg : (hasUnread ? (isLight ? '#eef6ff' : '#1b1f3b') : 'transparent') }}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
```
**Raw class strings detected (best effort):**

- `ring-1 ring-[var(--gt-blue)]/20`
- `#eef6ff`
- `#1b1f3b`
- `transparent`

**Utility breakdown (grouped):**

- **Borders / rings / shadows:**
  - `ring-1` — Outline ring (often used instead of borders in dark mode).
  - `ring-[var(--gt-blue)]/20` — Outline ring (often used instead of borders in dark mode).
- **Other:**
  - `#eef6ff` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#1b1f3b` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1610`

```jsx
                    <div className="flex items-center gap-3">
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`
- `relative flex-shrink-0`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1611`

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`
- `relative flex-shrink-0`
- `h-11 w-11 rounded-full object-cover shadow-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1612`

```jsx
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
                        ) : (
```
**Raw class strings detected (best effort):**

- `relative flex-shrink-0`
- `h-11 w-11 rounded-full object-cover shadow-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1614`

```jsx
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm${isActive ? 'bg-[var(--gt-blue)] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
                        )}
```
**Raw class strings detected (best effort):**

- `h-11 w-11 rounded-full object-cover shadow-sm`
- `bg-[var(--gt-blue)] text-white`
- `bg-slate-100 text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1616`

```jsx
                          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm${isActive ? 'bg-[var(--gt-blue)] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
                        )}
                        <span
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
```
**Raw class strings detected (best effort):**

- `bg-[var(--gt-blue)] text-white`
- `bg-slate-100 text-slate-500`
- `absolute bottom-0 right-0 h-3 w-3 rounded-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1619`

```jsx
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
                          style={{
                            background: presenceStatus(thread.senderId) === 'online' ? '#22c55e' : '#94a3b8',
                            boxShadow: `0 0 0 2px ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
```
**Raw class strings detected (best effort):**

- `absolute bottom-0 right-0 h-3 w-3 rounded-full`
- `online`
- `#22c55e`
- `#94a3b8`
- `#e2e8f0`
- `rgba(255,255,255,0.18)`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#22c55e` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#94a3b8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#e2e8f0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(255,255,255,0.18)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1626`

```jsx
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-[14px] font-semibold${isActive ? 'text-[var(--gt-blue)]' : ''}`}>{threadName}</p>
                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
```
**Raw class strings detected (best effort):**

- `min-w-0 flex-1`
- `flex items-center justify-between gap-1`
- `text-[var(--gt-blue)]`
- `ml-2 flex flex-shrink-0 items-center gap-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ml-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1627`

```jsx
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-[14px] font-semibold${isActive ? 'text-[var(--gt-blue)]' : ''}`}>{threadName}</p>
                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                            {thread.policyStatus && thread.policyStatus !== 'delivered' ? (
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-1`
- `text-[var(--gt-blue)]`
- `ml-2 flex flex-shrink-0 items-center gap-1`
- `delivered`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ml-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
- **Other:**
  - `delivered` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1628`

```jsx
                          <p className={`truncate text-[14px] font-semibold${isActive ? 'text-[var(--gt-blue)]' : ''}`}>{threadName}</p>
                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                            {thread.policyStatus && thread.policyStatus !== 'delivered' ? (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
```
**Raw class strings detected (best effort):**

- `text-[var(--gt-blue)]`
- `ml-2 flex flex-shrink-0 items-center gap-1`
- `delivered`
- `rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-shrink-0` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `ml-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[var(--gt-blue)]` — Text color or text sizing.
  - `bg-amber-100` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `delivered` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1629`

```jsx
                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                            {thread.policyStatus && thread.policyStatus !== 'delivered' ? (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
                            ) : null}
```
**Raw class strings detected (best effort):**

- `ml-2 flex flex-shrink-0 items-center gap-1`
- `delivered`
- `rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-shrink-0` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `ml-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-100` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `delivered` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1631`

```jsx
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
                            ) : null}
                            {thread.policyPriority ? (
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{thread.policyPriority}</span>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700`
- `rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-700` — Text color or text sizing.
  - `text-indigo-700` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-100` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
  - `bg-indigo-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1634`

```jsx
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{thread.policyPriority}</span>
                            ) : null}
                            <span className="text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                          </div>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700`
- `text-[10px] font-medium text-slate-400`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-700` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-100` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1636`

```jsx
                            <span className="text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
```
**Raw class strings detected (best effort):**

- `text-[10px] font-medium text-slate-400`
- `flex items-center justify-between gap-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1639`

```jsx
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate text-xs${isActive ? 'text-slate-600' : hasUnread ? 'text-slate-700' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
                          {hasUnread ? (
                            <span className="min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white">
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2`
- `text-slate-600`
- `text-slate-700`
- `text-slate-400`
- `No messages`
- `min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `min-w-[18px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `No` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1640`

```jsx
                          <p className={`truncate text-xs${isActive ? 'text-slate-600' : hasUnread ? 'text-slate-700' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
                          {hasUnread ? (
                            <span className="min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white">
                              {thread.unread}
```
**Raw class strings detected (best effort):**

- `text-slate-600`
- `text-slate-700`
- `text-slate-400`
- `No messages`
- `min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-[18px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `No` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1642`

```jsx
                            <span className="min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white">
                              {thread.unread}
                            </span>
                          ) : null}
```
**Raw class strings detected (best effort):**

- `min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `min-w-[18px]` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1655`

```jsx
        <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 borderless-divider-b">
```
**Raw class strings detected (best effort):**

- `rounded-[24px] p-0 flex flex-col h-full overflow-hidden borderless-shadow`
- `flex items-center justify-between px-6 py-4 borderless-divider-b`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-0` — Padding (all sides).
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
- **Borders / rings / shadows:**
  - `rounded-[24px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `borderless-divider-b` — Border style/width/color.

#### `src/pages/ChatInterface.jsx:1658`

```jsx
              <div className="flex items-center justify-between px-6 py-4 borderless-divider-b">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeAvatar ? (
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between px-6 py-4 borderless-divider-b`
- `flex items-center gap-3`
- `relative`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `py-4` — Vertical padding (top/bottom).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `borderless-divider-b` — Border style/width/color.

#### `src/pages/ChatInterface.jsx:1659`

```jsx
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeAvatar ? (
                      <img src={activeAvatar} alt={activeThreadDisplayName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `relative`
- `h-10 w-10 rounded-full object-cover shadow-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1660`

```jsx
                  <div className="relative">
                    {activeAvatar ? (
                      <img src={activeAvatar} alt={activeThreadDisplayName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                    ) : (
```
**Raw class strings detected (best effort):**

- `relative`
- `h-10 w-10 rounded-full object-cover shadow-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1662`

```jsx
                      <img src={activeAvatar} alt={activeThreadDisplayName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{activeThreadInitials}</div>
                    )}
```
**Raw class strings detected (best effort):**

- `h-10 w-10 rounded-full object-cover shadow-sm`
- `flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1664`

```jsx
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{activeThreadInitials}</div>
                    )}
                    <span
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
```
**Raw class strings detected (best effort):**

- `flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500`
- `absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1667`

```jsx
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                      style={{
                        background: presenceStatus(activeThread?.senderId) === 'online' ? '#22c55e' : '#94a3b8',
                        boxShadow: `0 0 0 2px ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
```
**Raw class strings detected (best effort):**

- `absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full`
- `online`
- `#22c55e`
- `#94a3b8`
- `#e2e8f0`
- `rgba(255,255,255,0.18)`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `bottom-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `right-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-2.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#22c55e` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#94a3b8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#e2e8f0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(255,255,255,0.18)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1675`

```jsx
                    <p className="text-sm font-bold tracking-tight">{activeThreadDisplayName}</p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {presenceStatus(activeThread?.senderId) === 'online'
                        ? 'Online'
```
**Raw class strings detected (best effort):**

- `text-sm font-bold tracking-tight`
- `text-[11px] font-medium text-slate-400`
- `online`
- `Online`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1676`

```jsx
                    <p className="text-[11px] font-medium text-slate-400">
                      {presenceStatus(activeThread?.senderId) === 'online'
                        ? 'Online'
                        : formatPresence(presenceLastSeen(activeThread?.senderId))}
```
**Raw class strings detected (best effort):**

- `text-[11px] font-medium text-slate-400`
- `online`
- `Online`

**Utility breakdown (grouped):**

- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Online` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1682`

```jsx
                      <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {lockStatusLabel(lockMeta, activeThread)}
                      </span>
                    ) : null}
```
**Raw class strings detected (best effort):**

- `mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1688`

```jsx
                <div className="flex items-center gap-3">
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                  {isLockOwner ? (
                    <button
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1689`

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                  {isLockOwner ? (
                    <button
                      onClick={grantAccess}
```
**Raw class strings detected (best effort):**

- `rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-[#E8F3FF]` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `text-[#0A66C2]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-[#D9ECFF]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1693`

```jsx
                      className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      title="Grant access to another member"
                    >
                      Grant access
```
**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60`
- `Grant access to another member`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Grant` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `access` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `another` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `member` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1702`

```jsx
                      className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      title="Transfer this conversation to another agent"
                    >
                      Transfer
```
**Raw class strings detected (best effort):**

- `rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60`
- `Transfer this conversation to another agent`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `transition` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-300` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/60` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Transfer` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `this` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `conversation` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `another` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `agent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1710`

```jsx
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
                    title="Start call"
                  >
                    <Phone size={16} />
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50`
- `Start call`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `call` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1715`

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <Search size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1718`

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <EllipsisVertical size={16} />
                  </button>
                </div>
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1724`

```jsx
              <div className="px-6 pb-3">
                <JourneyTimeline title="Journey Timeline" matchId={activeThread?.matchId || ''} />
              </div>

```
**Raw class strings detected (best effort):**

- `px-6 pb-3`
- `Journey Timeline`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-6` — Horizontal padding (left/right).
  - `pb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Journey` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Timeline` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1729`

```jsx
                <div className="mx-6 mt-4 rounded-xl borderless-shadow bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      Video calls are recommended for trust. No recorded call exists yet for this conversation.
```
**Raw class strings detected (best effort):**

- `mx-6 mt-4 rounded-xl borderless-shadow bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200`
- `flex flex-wrap items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-6` — Horizontal margin (left/right).
  - `mt-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1730`

```jsx
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      Video calls are recommended for trust. No recorded call exists yet for this conversation.
                    </span>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1737`

```jsx
                      className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500"
                    >
                      Start call
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-amber-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1745`

```jsx
              <div className="flex-1 space-y-4 overflow-auto p-6 custom-scrollbar" style={{ background: isLight ? '#f8fafc' : 'transparent' }}>
                <div className="flex justify-center mb-6">
                  <span className="rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{todayLabel}</span>
                </div>
```
**Raw class strings detected (best effort):**

- `flex-1 space-y-4 overflow-auto p-6 custom-scrollbar`
- `flex justify-center mb-6`
- `rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-6` — Padding (all sides).
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `custom-scrollbar` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1746`

```jsx
                <div className="flex justify-center mb-6">
                  <span className="rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{todayLabel}</span>
                </div>
                {activeMessages.length > 0 ? (
```
**Raw class strings detected (best effort):**

- `flex justify-center mb-6`
- `rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1747`

```jsx
                  <span className="rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{todayLabel}</span>
                </div>
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => {
```
**Raw class strings detected (best effort):**

- `rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1758`

```jsx
                      <div key={message.id} className={`flex${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
                          isOwn 
                            ? 'bg-[var(--gt-blue)] text-white rounded-br-none' 
```
**Raw class strings detected (best effort):**

- `justify-end`
- `justify-start`
- `bg-[var(--gt-blue)] text-white rounded-br-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-br-none` — Corner radius.

#### `src/pages/ChatInterface.jsx:1759`

```jsx
                        <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
                          isOwn 
                            ? 'bg-[var(--gt-blue)] text-white rounded-br-none' 
                            : isBot
```
**Raw class strings detected (best effort):**

- `bg-[var(--gt-blue)] text-white rounded-br-none`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-br-none` — Corner radius.

#### `src/pages/ChatInterface.jsx:1767`

```jsx
                            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--gt-blue)]">
                              AI Assistant
                            </div>
                          ) : null}
```
**Raw class strings detected (best effort):**

- `mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-extrabold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-widest` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1772`

```jsx
                          <div className={`mt-1 flex items-center gap-2 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-60${isOwn ? 'text-white' : 'text-slate-400'}`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {message.policy_status && message.policy_status !== 'delivered' ? (
                              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
```
**Raw class strings detected (best effort):**

- `text-white`
- `text-slate-400`
- `delivered`
- `inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-1.5` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-500/20` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `delivered` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1775`

```jsx
                              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
                                {message.policy_status === 'needs_review' ? 'Needs review' : 'Queued'}
                              </span>
                            ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600`
- `needs_review`
- `Needs review`
- `Queued`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-1.5` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-500/20` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `needs_review` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Needs` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `review` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Queued` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1780`

```jsx
                              <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600">{message.policy_priority}</span>
                            ) : null}
                            {showReadTick ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600`
- `inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-1.5` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-indigo-600` — Text color or text sizing.
  - `text-emerald-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-indigo-500/20` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
  - `bg-emerald-500/20` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1783`

```jsx
                              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                                ✓ Read
                              </span>
                            ) : null}
```
**Raw class strings detected (best effort):**

- `inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `inline-flex` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-1.5` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-emerald-600` — Text color or text sizing.
- **Color / surface:**
  - `bg-emerald-500/20` — Background color/surface.
  - `text-[9px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1793`

```jsx
                  <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400 italic">No messages yet. Start the conversation!</div>
                )}
              </div>

```
**Raw class strings detected (best effort):**

- `flex h-full items-center justify-center text-sm font-medium text-slate-400 italic`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1797`

```jsx
              <div className="p-4 borderless-divider-t">
                {isLockRestricted ? (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    <span>
```
**Raw class strings detected (best effort):**

- `p-4 borderless-divider-t`
- `mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `borderless-divider-t` — Border style/width/color.
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1799`

```jsx
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    <span>
                      Conversation locked by {lockMeta?.claimed_by_name || (lockMeta?.lock_type === 'verified_first' ? 'verified supplier' : 'another agent')}.
                    </span>
```
**Raw class strings detected (best effort):**

- `mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200`
- `verified_first`
- `verified supplier`
- `another agent`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `verified_first` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `verified` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `supplier` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `another` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `agent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1806`

```jsx
                      className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
                    >
                      Request access
                    </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1813`

```jsx
                  <div className="mb-3 rounded-xl borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        AI pre-qual flagged missing info. {prequal?.missing ? `Missing: ${prequal.missing}.` : 'Request more details before negotiating.'}
```
**Raw class strings detected (best effort):**

- `mb-3 rounded-xl borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200`
- `flex flex-wrap items-center justify-between gap-2`
- `Request more details before negotiating.`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-3` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-amber-900` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-amber-500/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-amber-200` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Request` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `more` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `details` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `before` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `negotiating.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1814`

```jsx
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        AI pre-qual flagged missing info. {prequal?.missing ? `Missing: ${prequal.missing}.` : 'Request more details before negotiating.'}
                      </span>
```
**Raw class strings detected (best effort):**

- `flex flex-wrap items-center justify-between gap-2`
- `Request more details before negotiating.`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Request` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `more` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `details` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `before` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `negotiating.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1822`

```jsx
                          className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
                        >
                          Allow send anyway
                        </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-amber-600` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1829`

```jsx
                      <div className="mt-1 text-[10px] text-amber-800">
                        Only verified suppliers can override this pre-qualification gate.
                      </div>
                    ) : null}
```
**Raw class strings detected (best effort):**

- `mt-1 text-[10px] text-amber-800`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-amber-800` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1835`

```jsx
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                  <span>AI Suggested Reply</span>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-wrap` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1841`

```jsx
                    className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                  >
                    {aiSuggesting ? 'Thinking...' : 'Generate'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20`
- `Thinking...`
- `Generate`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Thinking...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Generate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1846`

```jsx
                {aiError ? <div className="mb-2 text-[11px] font-semibold text-rose-600">{aiError}</div> : null}
                <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading || !canSendMessage}>
                    <Plus size={20} />
```
**Raw class strings detected (best effort):**

- `mb-2 text-[11px] font-semibold text-rose-600`
- `relative flex items-center gap-2 rounded-[18px] p-1.5`
- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1.5` — Padding (all sides).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[18px]` — Corner radius.
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200/50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-slate-700/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1847`

```jsx
                <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading || !canSendMessage}>
                    <Plus size={20} />
                  </button>
```
**Raw class strings detected (best effort):**

- `relative flex items-center gap-2 rounded-[18px] p-1.5`
- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1.5` — Padding (all sides).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[18px]` — Corner radius.
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200/50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-slate-700/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1848`

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading || !canSendMessage}>
                    <Plus size={20} />
                  </button>
                  <textarea
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200/50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-slate-700/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1853`

```jsx
                    className="flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400"
                    style={{ color: theme.textPrimary, maxHeight: 140 }}
                    placeholder={canSendMessage ? 'Write a message...' : 'Conversation locked. Request access to reply.'}
                    disabled={!canSendMessage}
```
**Raw class strings detected (best effort):**

- `flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400`
- `Write a message...`
- `Conversation locked. Request access to reply.`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-1` — Flex layout.
  - `placeholder:text-slate-400` — Variant prefix (responsive, dark, or interaction state).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `leading-5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
  - `text-[14px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `resize-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Write` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `a` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `message...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Conversation` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `locked.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Request` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `access` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `to` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `reply.` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1866`

```jsx
                  <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} disabled={!canSendMessage} />
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60" onClick={sendMessage} disabled={!canSendMessage}>
                    <SendHorizontal size={18} />
                  </button>
```
**Raw class strings detected (best effort):**

- `hidden`
- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:scale-105` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1867`

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60" onClick={sendMessage} disabled={!canSendMessage}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[var(--gt-blue)]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:scale-105` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1872`

```jsx
                  <p className="mt-2 px-4 text-[11px] font-medium text-rose-500">
                    Blocked: {policyFeedback.reason}{policyFeedback.retryAfter > 0 ? ` • Retry in ${policyFeedback.retryAfter}s` : ''}
                  </p>
                ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 px-4 text-[11px] font-medium text-rose-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1877`

```jsx
                  <p className="mt-2 px-4 text-[11px] font-medium text-[var(--gt-blue)]">{uploadStatus || scheduleStatus}</p>
                ) : null}
              </div>
            </>
```
**Raw class strings detected (best effort):**

- `mt-2 px-4 text-[11px] font-medium text-[var(--gt-blue)]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[var(--gt-blue)]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1881`

```jsx
          ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30">
                  <MessageCircle size={32} className="opacity-20" />
                </div>
```
**Raw class strings detected (best effort):**

- `flex h-full flex-col items-center justify-center text-slate-400 gap-4`
- `h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30`
- `opacity-20`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `opacity-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1882`

```jsx
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30">
                  <MessageCircle size={32} className="opacity-20" />
                </div>
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
```
**Raw class strings detected (best effort):**

- `h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30`
- `opacity-20`
- `text-sm font-medium`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `opacity-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1883`

```jsx
                  <MessageCircle size={32} className="opacity-20" />
                </div>
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
              </div>}
```
**Raw class strings detected (best effort):**

- `opacity-20`
- `text-sm font-medium`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `opacity-20` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1885`

```jsx
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
              </div>}
        </main>

```
**Raw class strings detected (best effort):**

- `text-sm font-medium`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-sm` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1889`

```jsx
        <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="mb-8 text-center">
```
**Raw class strings detected (best effort):**

- `hidden xl:block rounded-[24px] p-6 h-full overflow-auto borderless-shadow`
- `mb-8 text-center`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-auto` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-6` — Padding (all sides).
  - `mb-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[24px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Responsive variants:**
  - `xl:block` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1892`

```jsx
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full shadow-md">
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
```
**Raw class strings detected (best effort):**

- `mb-8 text-center`
- `mx-auto mb-4 h-24 w-24 rounded-full shadow-md`
- `h-full w-full rounded-full object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `mx-auto` — Horizontal margin (left/right).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-center` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1893`

```jsx
                <div className="mx-auto mb-4 h-24 w-24 rounded-full shadow-md">
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
```
**Raw class strings detected (best effort):**

- `mx-auto mb-4 h-24 w-24 rounded-full shadow-md`
- `h-full w-full rounded-full object-cover`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-24` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mx-auto` — Horizontal margin (left/right).
  - `mb-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1895`

```jsx
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">{activeThreadInitials}</div>
                  )}
```
**Raw class strings detected (best effort):**

- `h-full w-full rounded-full object-cover`
- `flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1897`

```jsx
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">{activeThreadInitials}</div>
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight">{activeThreadDisplayName}</h3>
```
**Raw class strings detected (best effort):**

- `flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400`
- `text-lg font-bold tracking-tight`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-2xl` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `text-lg` — Text color or text sizing.
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1900`

```jsx
                <h3 className="text-lg font-bold tracking-tight">{activeThreadDisplayName}</h3>
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

```
**Raw class strings detected (best effort):**

- `text-lg font-bold tracking-tight`
- `text-xs font-medium text-slate-400 tracking-wide`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-lg` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-tight` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1901`

```jsx
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

              {leadLoading ? (
```
**Raw class strings detected (best effort):**

- `text-xs font-medium text-slate-400 tracking-wide`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1905`

```jsx
                <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/30">
                  Loading AI pre-qualification summary...
                </div>
              ) : prequal ? (
```
**Raw class strings detected (best effort):**

- `mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/30`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1909`

```jsx
                <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Pre-Qual Summary</p>
                  <p className="mt-1">Score: <span className="font-semibold">{prequal.score ?? '--'}</span></p>
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
```
**Raw class strings detected (best effort):**

- `mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30`
- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `mt-1`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1910`

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Pre-Qual Summary</p>
                  <p className="mt-1">Score: <span className="font-semibold">{prequal.score ?? '--'}</span></p>
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
                </div>
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `mt-1`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1911`

```jsx
                  <p className="mt-1">Score: <span className="font-semibold">{prequal.score ?? '--'}</span></p>
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
                </div>
              ) : null}
```
**Raw class strings detected (best effort):**

- `mt-1`
- `font-semibold`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1912`

```jsx
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
                </div>
              ) : null}

```
**Raw class strings detected (best effort):**

- `mt-1`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1916`

```jsx
              <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Conversation Summary</p>
                  <button
```
**Raw class strings detected (best effort):**

- `mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30`
- `flex items-center justify-between gap-2`
- `text-xs font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1917`

```jsx
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Conversation Summary</p>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2`
- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1918`

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Conversation Summary</p>
                  <button
                    type="button"
                    onClick={requestAiSummary}
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1923`

```jsx
                    className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                  >
                    {aiSummaryLoading ? 'Summarizing...' : 'Refresh'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20`
- `Summarizing...`
- `Refresh`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Summarizing...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Refresh` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1928`

```jsx
                {aiSummaryError ? <div className="mt-2 text-[10px] font-semibold text-rose-600">{aiSummaryError}</div> : null}
                {aiSummary?.text ? (
                  <>
                    <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiSummary.text}</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] font-semibold text-rose-600`
- `mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1931`

```jsx
                    <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiSummary.text}</p>
                    {aiSummary.suggestedReply ? (
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiSummary.suggestedReply}</p>
                    ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1933`

```jsx
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiSummary.suggestedReply}</p>
                    ) : null}
                  </>
                ) : (
```
**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1937`

```jsx
                  <p className="mt-2 text-[10px] text-slate-400 italic">No summary yet.</p>
                )}
              </div>

```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] text-slate-400 italic`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1941`

```jsx
              <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Negotiation Helper</p>
                  <button
```
**Raw class strings detected (best effort):**

- `mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30`
- `flex items-center justify-between gap-2`
- `text-xs font-semibold text-slate-800 dark:text-slate-100`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mb-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-3` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-2xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1942`

```jsx
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Negotiation Helper</p>
                  <button
                    type="button"
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-2`
- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `button`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1943`

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Negotiation Helper</p>
                  <button
                    type="button"
                    onClick={requestNegotiationHelper}
```
**Raw class strings detected (best effort):**

- `text-xs font-semibold text-slate-800 dark:text-slate-100`
- `button`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-800` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-100` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `button` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1948`

```jsx
                    className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                  >
                    {aiNegotiationLoading ? 'Thinking...' : 'Generate'}
                  </button>
```
**Raw class strings detected (best effort):**

- `rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20`
- `Thinking...`
- `Generate`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-1` — Vertical padding (top/bottom).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-slate-900` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `hover:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).
  - `disabled:opacity-60` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:bg-white/10` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-white/20` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Thinking...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Generate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1953`

```jsx
                {aiNegotiationError ? <div className="mt-2 text-[10px] font-semibold text-rose-600">{aiNegotiationError}</div> : null}
                {aiNegotiation?.guidance ? (
                  <>
                    <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiNegotiation.guidance}</p>
```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] font-semibold text-rose-600`
- `mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-semibold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-rose-600` — Text color or text sizing.
  - `text-slate-700` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1956`

```jsx
                    <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiNegotiation.guidance}</p>
                    {aiNegotiation.suggestedReply ? (
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiNegotiation.suggestedReply}</p>
                    ) : null}
```
**Raw class strings detected (best effort):**

- `mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200`
- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `whitespace-pre-wrap` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-700` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
- **Dark mode variants:**
  - `dark:text-slate-200` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1958`

```jsx
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiNegotiation.suggestedReply}</p>
                    ) : null}
                  </>
                ) : (
```
**Raw class strings detected (best effort):**

- `mt-2 text-[11px] text-slate-500`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1962`

```jsx
                  <p className="mt-2 text-[10px] text-slate-400 italic">Generate guidance for this thread.</p>
                )}
              </div>

```
**Raw class strings detected (best effort):**

- `mt-2 text-[10px] text-slate-400 italic`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1966`

```jsx
              <div className="mb-8 grid grid-cols-4 gap-3">
                {[
                  { icon: Flag, title: 'Report' },
                  { icon: Lock, title: 'Block' },
```
**Raw class strings detected (best effort):**

- `mb-8 grid grid-cols-4 gap-3`
- `Report`
- `Block`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-4` — Grid layout.
- **Spacing:**
  - `mb-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `Report` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Block` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1973`

```jsx
                  <button key={i} className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70" title={action.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
                      <action.icon size={16} strokeWidth={2} />
                    </div>
```
**Raw class strings detected (best effort):**

- `flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70`
- `flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-[14px]` — Corner radius.
- **Interaction / motion:**
  - `transition-opacity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:opacity-70` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1974`

```jsx
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
                      <action.icon size={16} strokeWidth={2} />
                    </div>
                  </button>
```
**Raw class strings detected (best effort):**

- `flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-10` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-transparent` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-[14px]` — Corner radius.
- **Dark mode variants:**
  - `dark:text-slate-500` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1981`

```jsx
              <div className="space-y-4">
                {[
                  { id: 'sharedDocument', label: 'Documents', count: sharedLinks.length, icon: FolderOpen },
                  { id: 'sharedMedia', label: 'Media', count: sharedMedia.length, icon: Search },
```
**Raw class strings detected (best effort):**

- `space-y-4`
- `sharedDocument`
- `Documents`
- `sharedMedia`
- `Media`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-4` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `sharedDocument` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Documents` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `sharedMedia` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Media` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1987`

```jsx
                  <div key={section.id} className="overflow-hidden rounded-[18px] borderless-shadow">
                    <button 
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
```
**Raw class strings detected (best effort):**

- `overflow-hidden rounded-[18px] borderless-shadow`
- `flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`
- `#f8fafc`
- `#101328`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-[18px]` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#f8fafc` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#101328` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1989`

```jsx
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
                      onClick={() => setAccordionState(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                    >
```
**Raw class strings detected (best effort):**

- `flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`
- `#f8fafc`
- `#101328`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `p-4` — Padding (all sides).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#f8fafc` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#101328` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1993`

```jsx
                      <div className="flex items-center gap-2">
                        <section.icon size={14} className="opacity-50" />
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
```
**Raw class strings detected (best effort):**

- `flex items-center gap-2`
- `opacity-50`
- `ml-1 opacity-50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `opacity-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1994`

```jsx
                        <section.icon size={14} className="opacity-50" />
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
                      {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
```
**Raw class strings detected (best effort):**

- `opacity-50`
- `ml-1 opacity-50`

**Utility breakdown (grouped):**

- **Spacing:**
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `opacity-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1995`

```jsx
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
                      {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
```
**Raw class strings detected (best effort):**

- `ml-1 opacity-50`

**Utility breakdown (grouped):**

- **Spacing:**
  - `ml-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `opacity-50` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2000`

```jsx
                      <div className="p-3 bg-white dark:bg-transparent">
                        {section.id === 'sharedDocument' && (
                          <div className="space-y-2">
                            {sharedLinks.length > 0 ? sharedLinks.map(item => {
```
**Raw class strings detected (best effort):**

- `p-3 bg-white dark:bg-transparent`
- `sharedDocument`
- `space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `p-3` — Padding (all sides).
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-white` — Background color/surface.
- **Dark mode variants:**
  - `dark:bg-transparent` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `sharedDocument` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2002`

```jsx
                          <div className="space-y-2">
                            {sharedLinks.length > 0 ? sharedLinks.map(item => {
                              const url = toAbsoluteAssetUrl(item.attachment?.url || '')
                              return (
```
**Raw class strings detected (best effort):**

- `space-y-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2010`

```jsx
                                  className="flex w-full items-center gap-2 rounded-xl borderless-shadow bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors dark:bg-slate-800/30"
                                  title="Preview"
                                >
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
```
**Raw class strings detected (best effort):**

- `flex w-full items-center gap-2 rounded-xl borderless-shadow bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors dark:bg-slate-800/30`
- `Preview`
- `h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700`
- `opacity-30`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-2.5` — Padding (all sides).
- **Typography:**
  - `text-left` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `bg-slate-50/50` — Background color/surface.
  - `text-[11px]` — Text color or text sizing.
  - `bg-white` — Background color/surface.
  - `opacity-30` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-xl` — Corner radius.
  - `borderless-shadow` — Border style/width/color.
  - `rounded` — Corner radius.
  - `shadow-xs` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Dark mode variants:**
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Preview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2013`

```jsx
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
                                  <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
                                </button>
                              )
```
**Raw class strings detected (best effort):**

- `h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700`
- `opacity-30`
- `truncate flex-1`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-6` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Color / surface:**
  - `bg-white` — Background color/surface.
  - `opacity-30` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded` — Corner radius.
  - `shadow-xs` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:2014`

```jsx
                                  <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
                                </button>
                              )
                            }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
```
**Raw class strings detected (best effort):**

- `truncate flex-1`
- `text-[10px] text-slate-400 italic text-center py-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `truncate` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-1` — Flex layout.
- **Spacing:**
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:2017`

```jsx
                            }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedMedia' && (
```
**Raw class strings detected (best effort):**

- `text-[10px] text-slate-400 italic text-center py-2`
- `sharedMedia`

**Utility breakdown (grouped):**

- **Spacing:**
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `sharedMedia` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2021`

```jsx
                          <div className="grid grid-cols-3 gap-1.5">
                            {sharedMedia.length > 0 ? sharedMedia.slice(0, 6).map(item => {
                              const url = toAbsoluteAssetUrl(item.attachment?.url || '')
                              const isVideo = isVideoMessage(item)
```
**Raw class strings detected (best effort):**

- `grid grid-cols-3 gap-1.5`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-3` — Grid layout.
- **Spacing:**
  - `gap-1.5` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2030`

```jsx
                                  className="relative aspect-square overflow-hidden rounded-lg"
                                  title="View"
                                >
                                  {isVideo ? (
```
**Raw class strings detected (best effort):**

- `relative aspect-square overflow-hidden rounded-lg`
- `View`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `aspect-square` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `overflow-hidden` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-lg` — Corner radius.
- **Other:**
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2035`

```jsx
                                      <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                                        <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">Play</div>
                                      </div>
```
**Raw class strings detected (best effort):**

- `h-full w-full object-cover`
- `pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25`
- `rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/25` — Background color/surface.
  - `bg-black/40` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2036`

```jsx
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                                        <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">Play</div>
                                      </div>
                                    </>
```
**Raw class strings detected (best effort):**

- `pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25`
- `rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `absolute` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `inset-0` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/25` — Background color/surface.
  - `bg-black/40` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
- **Other:**
  - `pointer-events-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2037`

```jsx
                                        <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">Play</div>
                                      </div>
                                    </>
                                  ) : (
```
**Raw class strings detected (best effort):**

- `rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white`

**Utility breakdown (grouped):**

- **Spacing:**
  - `px-2` — Horizontal padding (left/right).
  - `py-0.5` — Vertical padding (top/bottom).
- **Typography:**
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-black/40` — Background color/surface.
  - `text-[10px]` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:2041`

```jsx
                                    <img src={url} alt="" className="h-full w-full object-cover transition-transform hover:scale-110" />
                                  )}
                                </button>
                              )
```
**Raw class strings detected (best effort):**

- `h-full w-full object-cover transition-transform hover:scale-110`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:scale-110` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2045`

```jsx
                            }) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedPost' && (
```
**Raw class strings detected (best effort):**

- `col-span-3 text-[10px] text-slate-400 italic text-center py-2`
- `sharedPost`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `col-span-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `sharedPost` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2049`

```jsx
                          <div className="space-y-2">
                            {sharedPosts.length > 0 ? sharedPosts.map(item => (
                              <div key={item.id} style={{ background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.03)' }}>
                                <p className="line-clamp-2 leading-relaxed opacity-80">{item.message}</p>
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `#f1f5f9`
- `rgba(255,255,255,0.03)`
- `line-clamp-2 leading-relaxed opacity-80`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `space-y-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `#f1f5f9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `rgba(255,255,255,0.03)` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:2052`

```jsx
                                <p className="line-clamp-2 leading-relaxed opacity-80">{item.message}</p>
                              </div>
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
                          </div>
```
**Raw class strings detected (best effort):**

- `line-clamp-2 leading-relaxed opacity-80`
- `text-[10px] text-slate-400 italic text-center py-2`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `line-clamp-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `leading-relaxed` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `opacity-80` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:2054`

```jsx
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
                          </div>
                        )}
                      </div>
```
**Raw class strings detected (best effort):**

- `text-[10px] text-slate-400 italic text-center py-2`

**Utility breakdown (grouped):**

- **Spacing:**
  - `py-2` — Vertical padding (top/bottom).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-center` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:2063`

```jsx
          ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 text-xs italic">Details will appear here</div>}
        </aside>
      </div>
    </div>
```
**Raw class strings detected (best effort):**

- `flex h-full flex-col items-center justify-center text-slate-400 text-xs italic`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `h-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-col` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
  - `text-xs` — Text color or text sizing.
  - `italic` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

## 4) Content Inventory (all extracted visible copy + element anchors)

> This list is generated by heuristics. It includes hard-coded UI strings and key element anchors. For absolute truth, use the source snapshot.

- `src/pages/ChatInterface.jsx:1484` — setNotice(null)} className="text-xs font-semibold">Dismiss

```jsx
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
```
- `src/pages/ChatInterface.jsx:1574` — Messages

```jsx
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>

```
- `src/pages/ChatInterface.jsx:1590` — Direct Messages

```jsx
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[var(--gt-blue)]">{allVisibleThreads.length}</span>
          </div>

```
- `src/pages/ChatInterface.jsx:1611` — Contract draft

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
```
- `src/pages/ChatInterface.jsx:1631` — Queued

```jsx
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
                            ) : null}
                            {thread.policyPriority ? (
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{thread.policyPriority}</span>
```
- `src/pages/ChatInterface.jsx:1689` — Contract draft

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                  {isLockOwner ? (
                    <button
                      onClick={grantAccess}
```
- `src/pages/ChatInterface.jsx:1836` — AI Suggested Reply

```jsx
                  <span>AI Suggested Reply</span>
                  <button
                    type="button"
                    onClick={requestAiSuggestion}
```
- `src/pages/ChatInterface.jsx:1885` — Select a conversation to start chatting

```jsx
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
              </div>}
        </main>

```
- `src/pages/ChatInterface.jsx:1901` — @{truncateId(activeThread.senderId \|\| activeThread.matchId, 16)}

```jsx
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

              {leadLoading ? (
```
- `src/pages/ChatInterface.jsx:1910` — AI Pre-Qual Summary

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Pre-Qual Summary</p>
                  <p className="mt-1">Score: <span className="font-semibold">{prequal.score ?? '--'}</span></p>
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
                </div>
```
- `src/pages/ChatInterface.jsx:1912` — Missing: {prequal.missing \|\| 'None'}

```jsx
                  <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
                </div>
              ) : null}

```
- `src/pages/ChatInterface.jsx:1918` — AI Conversation Summary

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Conversation Summary</p>
                  <button
                    type="button"
                    onClick={requestAiSummary}
```
- `src/pages/ChatInterface.jsx:1933` — Suggested reply: {aiSummary.suggestedReply}

```jsx
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiSummary.suggestedReply}</p>
                    ) : null}
                  </>
                ) : (
```
- `src/pages/ChatInterface.jsx:1937` — No summary yet.

```jsx
                  <p className="mt-2 text-[10px] text-slate-400 italic">No summary yet.</p>
                )}
              </div>

```
- `src/pages/ChatInterface.jsx:1943` — AI Negotiation Helper

```jsx
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Negotiation Helper</p>
                  <button
                    type="button"
                    onClick={requestNegotiationHelper}
```
- `src/pages/ChatInterface.jsx:1958` — Suggested reply: {aiNegotiation.suggestedReply}

```jsx
                      <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiNegotiation.suggestedReply}</p>
                    ) : null}
                  </>
                ) : (
```
- `src/pages/ChatInterface.jsx:1962` — Generate guidance for this thread.

```jsx
                  <p className="mt-2 text-[10px] text-slate-400 italic">Generate guidance for this thread.</p>
                )}
              </div>

```
- `src/pages/ChatInterface.jsx:1995` — ({section.count})

```jsx
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
                      {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
```
- `src/pages/ChatInterface.jsx:2017` — No documents shared

```jsx
                            }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedMedia' && (
```
- `src/pages/ChatInterface.jsx:2045` — No media shared

```jsx
                            }) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedPost' && (
```
- `src/pages/ChatInterface.jsx:2054` — No posts shared

```jsx
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
                          </div>
                        )}
                      </div>
```
- `src/pages/ChatInterface.jsx:1046` — View image

```jsx
            title="View image"
          >
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
          </button>
```
- `src/pages/ChatInterface.jsx:1072` — View video

```jsx
            title="View video"
          >
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
```
- `src/pages/ChatInterface.jsx:1566` — Logout

```jsx
            title="Logout"
          >
            <LogOut size={18} strokeWidth={1.5} />
          </button>
```
- `src/pages/ChatInterface.jsx:1583` — Search conversations...

```jsx
              placeholder="Search conversations..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
```
- `src/pages/ChatInterface.jsx:1694` — Grant access to another member

```jsx
                      title="Grant access to another member"
                    >
                      Grant access
                    </button>
```
- `src/pages/ChatInterface.jsx:1703` — Transfer this conversation to another agent

```jsx
                      title="Transfer this conversation to another agent"
                    >
                      Transfer
                    </button>
```
- `src/pages/ChatInterface.jsx:1711` — Start call

```jsx
                    title="Start call"
                  >
                    <Phone size={16} />
                  </button>
```
- `src/pages/ChatInterface.jsx:1725` — Journey Timeline

```jsx
                <JourneyTimeline title="Journey Timeline" matchId={activeThread?.matchId || ''} />
              </div>

              {!hasRecordedCall ? (
```
- `src/pages/ChatInterface.jsx:2011` — Preview

```jsx
                                  title="Preview"
                                >
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
                                  <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
```
- `src/pages/ChatInterface.jsx:2031` — View

```jsx
                                  title="View"
                                >
                                  {isVideo ? (
                                    <>
```
- `src/pages/ChatInterface.jsx:1042` — (element) <button>

```jsx
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="block w-full overflow-hidden rounded-xl borderless-shadow text-left transition-opacity hover:opacity-95"
```
- `src/pages/ChatInterface.jsx:1068` — (element) <button>

```jsx
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="relative block w-full overflow-hidden rounded-xl borderless-shadow text-left"
```
- `src/pages/ChatInterface.jsx:1484` — (element) <button>

```jsx
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
```
- `src/pages/ChatInterface.jsx:1515` — (element) <button>

```jsx
              <button
                onClick={closeCallPrompt}
                className="flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
              >
```
- `src/pages/ChatInterface.jsx:1521` — (element) <button>

```jsx
              <button
                onClick={acceptCallPrompt}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
```
- `src/pages/ChatInterface.jsx:1534` — (element) <button>

```jsx
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
                isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
              }`}
```
- `src/pages/ChatInterface.jsx:1547` — (element) <Link>

```jsx
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all${
```
- `src/pages/ChatInterface.jsx:1562` — (element) <button>

```jsx
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
            style={{ background: isLight ? '#ffffff' : theme.tileBg, color: isLight ? '#ef4444' : '#8f95bb' }}
            onClick={() => navigate('/login')}
```
- `src/pages/ChatInterface.jsx:1604` — (element) <button>

```jsx
                  <button
                    key={thread.id}
                    className={`group w-full rounded-[16px] px-3 py-3 text-left transition-all${hasUnread && !isActive ? 'ring-1 ring-[var(--gt-blue)]/20' : ''}`}
                    style={{ background: isActive ? theme.threadActiveBg : (hasUnread ? (isLight ? '#eef6ff' : '#1b1f3b') : 'transparent') }}
```
- `src/pages/ChatInterface.jsx:1611` — (element) <Link>

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
```
- `src/pages/ChatInterface.jsx:1689` — (element) <Link>

```jsx
                  <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
                  {isLockOwner ? (
                    <button
                      onClick={grantAccess}
```
- `src/pages/ChatInterface.jsx:1691` — (element) <button>

```jsx
                    <button
                      onClick={grantAccess}
                      className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      title="Grant access to another member"
```
- `src/pages/ChatInterface.jsx:1700` — (element) <button>

```jsx
                    <button
                      onClick={transferAccess}
                      className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      title="Transfer this conversation to another agent"
```
- `src/pages/ChatInterface.jsx:1708` — (element) <button>

```jsx
                  <button
                    onClick={() => startInstantCall(activeThread)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
                    title="Start call"
```
- `src/pages/ChatInterface.jsx:1715` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <Search size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
```
- `src/pages/ChatInterface.jsx:1718` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <EllipsisVertical size={16} />
                  </button>
                </div>
```
- `src/pages/ChatInterface.jsx:1734` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={() => startInstantCall(activeThread)}
                      className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500"
```
- `src/pages/ChatInterface.jsx:1803` — (element) <button>

```jsx
                    <button
                      type="button"
                      onClick={requestAccess}
                      className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
```
- `src/pages/ChatInterface.jsx:1819` — (element) <button>

```jsx
                        <button
                          type="button"
                          onClick={() => setPrequalOverride(true)}
                          className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
```
- `src/pages/ChatInterface.jsx:1837` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={requestAiSuggestion}
                    disabled={aiSuggesting || !activeThread?.matchId}
```
- `src/pages/ChatInterface.jsx:1848` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading || !canSendMessage}>
                    <Plus size={20} />
                  </button>
                  <textarea
```
- `src/pages/ChatInterface.jsx:1867` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60" onClick={sendMessage} disabled={!canSendMessage}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
```
- `src/pages/ChatInterface.jsx:1919` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={requestAiSummary}
                    disabled={aiSummaryLoading || !activeThread?.matchId}
```
- `src/pages/ChatInterface.jsx:1944` — (element) <button>

```jsx
                  <button
                    type="button"
                    onClick={requestNegotiationHelper}
                    disabled={aiNegotiationLoading || !activeThread?.matchId}
```
- `src/pages/ChatInterface.jsx:1973` — (element) <button>

```jsx
                  <button key={i} className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70" title={action.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
                      <action.icon size={16} strokeWidth={2} />
                    </div>
```
- `src/pages/ChatInterface.jsx:1988` — (element) <button>

```jsx
                    <button 
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
                      onClick={() => setAccordionState(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
```
- `src/pages/ChatInterface.jsx:2006` — (element) <button>

```jsx
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
```
- `src/pages/ChatInterface.jsx:2026` — (element) <button>

```jsx
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /users/me (src/pages/ChatInterface.jsx:439) | /api/users -> server/routes/userRoutes.js:112 | GET /me (server/routes/userRoutes.js:24) | - | me |
| GET /messages/inbox (src/pages/ChatInterface.jsx:453) | /api/messages -> server/routes/messageRoutes.js:123 | GET /inbox (server/routes/messageRoutes.js:39) | - | inbox |
| POST /users/lookup (src/pages/ChatInterface.jsx:467) | /api/users -> server/routes/userRoutes.js:112 | POST /lookup (server/routes/userRoutes.js:29) | - | lookupUsers |
| GET /calls/history?match_ids=${allMatchIds.join( (src/pages/ChatInterface.jsx:505) | /api/calls -> server/routes/callSessionRoutes.js:134 | - | - | - |
| GET /messages/${matchId} (src/pages/ChatInterface.jsx:531) | /api/messages -> server/routes/messageRoutes.js:123 | - | - | - |
| GET /leads/by-match/${encodeURIComponent(activeThread.matchId)} (src/pages/ChatInterface.jsx:575) | /api/leads -> server/routes/leadRoutes.js:126 | - | - | - |
| POST /messages/${encodeURIComponent(activeThread.matchId)}/read (src/pages/ChatInterface.jsx:701) | /api/messages -> server/routes/messageRoutes.js:123 | - | - | - |
| POST /presence (src/pages/ChatInterface.jsx:720) | /api/presence -> server/routes/presenceRoutes.js:138 | POST / (server/routes/presenceRoutes.js:7) | server/controllers/presenceController.js | getPresence |
| GET /calls/pending (src/pages/ChatInterface.jsx:878) | /api/calls -> server/routes/callSessionRoutes.js:134 | GET /pending (server/routes/callSessionRoutes.js:46) | - | getPendingInvites |
| POST /calls/join (src/pages/ChatInterface.jsx:925) | /api/calls -> server/routes/callSessionRoutes.js:134 | POST /join (server/routes/callSessionRoutes.js:42) | - | joinOrCreateCall |
| POST /assistant/ask (src/pages/ChatInterface.jsx:1152) | /api/assistant -> server/routes/assistantRoutes.js:121 | POST /ask (server/routes/assistantRoutes.js:19) | - | askAssistant |
| POST /assistant/conversation-summary (src/pages/ChatInterface.jsx:1172) | /api/assistant -> server/routes/assistantRoutes.js:121 | POST /conversation-summary (server/routes/assistantRoutes.js:24) | - | getConversationSummary |
| POST /assistant/negotiation (src/pages/ChatInterface.jsx:1201) | /api/assistant -> server/routes/assistantRoutes.js:121 | POST /negotiation (server/routes/assistantRoutes.js:25) | - | getNegotiationHelper |
| POST /messages/${activeThread.matchId} (src/pages/ChatInterface.jsx:1269) | /api/messages -> server/routes/messageRoutes.js:123 | - | - | - |
| POST /chatbot/reply (src/pages/ChatInterface.jsx:1296) | /api/chatbot -> server/routes/chatbotRoutes.js:140 | POST /reply (server/routes/chatbotRoutes.js:11) | server/controllers/chatbotController.js | replyWithChatbot |
| POST /conversations/${encodeURIComponent(activeThread.requestId)}/request-access (src/pages/ChatInterface.jsx:1335) | /api/conversations -> server/routes/conversationRoutes.js:122 | - | - | - |
| GET /conversations/${encodeURIComponent(activeThread.requestId)}/grant (src/pages/ChatInterface.jsx:1349) | /api/conversations -> server/routes/conversationRoutes.js:122 | - | - | - |
| GET /conversations/${encodeURIComponent(activeThread.requestId)}/transfer (src/pages/ChatInterface.jsx:1367) | /api/conversations -> server/routes/conversationRoutes.js:122 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/ChatInterface.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

