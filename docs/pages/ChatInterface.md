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
- ../components/chat/AttachmentPreviewModal (src/pages/ChatInterface.jsx:50)
- ../components/chat/MarkdownMessage (src/pages/ChatInterface.jsx:51)
- ../components/chat/FileAttachmentCard (src/pages/ChatInterface.jsx:52)

### 2.2 Structural section tags in JSX

- `aside` at `src/pages/ChatInterface.jsx:1181`

```jsx
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
```
- `aside` at `src/pages/ChatInterface.jsx:1221`

```jsx
        <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
```
- `main` at `src/pages/ChatInterface.jsx:1284`

```jsx
        <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
```
- `aside` at `src/pages/ChatInterface.jsx:1390`

```jsx
        <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="mb-8 text-center">
```
## 3) Styling (className blocks, utility breakdown, and custom CSS)

### 3.1 Custom CSS utilities referenced by this page (App.css / index.css)

- `.nav-glass` definitions:
  - `src/App.css:615`
- `.spotlight-card` definitions:
  - `src/App.css:267`
- `.skeleton` definitions:
  - `src/App.css:583`
- `.neo-page` definitions:
  - `src/App.css:108`
- `.neo-panel` definitions:
  - `src/App.css:116`
- `.cyberpunk-page` definitions:
  - `src/App.css:109`
- `.cyberpunk-card` definitions:
  - `src/App.css:110`
- `.assistant-orb-btn` definitions:
  - `src/App.css:518`
- `.legal-weave` definitions:
  - `src/App.css:366`
- `.signature-draw` definitions:
  - `src/App.css:401`
- `.verified-shimmer` definitions:
  - `src/App.css:434`
- `.verified-pulse` definitions:
  - `src/App.css:293`
- `.conic-beam` definitions:
  - `src/App.css:302`

### 3.2 Every className block (with grouped explanations)

#### `src/pages/ChatInterface.jsx:901`

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

#### `src/pages/ChatInterface.jsx:902`

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

#### `src/pages/ChatInterface.jsx:906`

```jsx
            className="block w-full overflow-hidden rounded-xl border border-slate-100 text-left transition-opacity hover:opacity-95 dark:border-transparent"
            title="View image"
          >
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
```
**Raw class strings detected (best effort):**

- `block w-full overflow-hidden rounded-xl border border-slate-100 text-left transition-opacity hover:opacity-95 dark:border-transparent`
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
  - `border` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
- **Interaction / motion:**
  - `transition-opacity` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:opacity-95` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `image` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:909`

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

#### `src/pages/ChatInterface.jsx:916`

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

#### `src/pages/ChatInterface.jsx:927`

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

#### `src/pages/ChatInterface.jsx:928`

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

#### `src/pages/ChatInterface.jsx:932`

```jsx
            className="relative block w-full overflow-hidden rounded-xl border border-slate-100 text-left dark:border-transparent"
            title="View video"
          >
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
```
**Raw class strings detected (best effort):**

- `relative block w-full overflow-hidden rounded-xl border border-slate-100 text-left dark:border-transparent`
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
  - `border` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `View` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `video` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:935`

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

#### `src/pages/ChatInterface.jsx:936`

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

#### `src/pages/ChatInterface.jsx:937`

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

#### `src/pages/ChatInterface.jsx:945`

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

#### `src/pages/ChatInterface.jsx:956`

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

#### `src/pages/ChatInterface.jsx:957`

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

#### `src/pages/ChatInterface.jsx:973`

```jsx
        <div className="space-y-2">
          <MarkdownMessage text={message.message} />
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-transparent dark:bg-black/20">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
```
**Raw class strings detected (best effort):**

- `space-y-2`
- `block rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-transparent dark:bg-black/20`
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
  - `border` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#1f2448]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#b8bfe8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:975`

```jsx
          <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-transparent dark:bg-black/20">
            <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
              {meta.host}
            </div>
```
**Raw class strings detected (best effort):**

- `block rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-transparent dark:bg-black/20`
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
  - `border` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
  - `rounded-lg` — Corner radius.
- **Dark mode variants:**
  - `dark:border-transparent` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-black/20` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-[#1f2448]` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-[#b8bfe8]` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:976`

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

#### `src/pages/ChatInterface.jsx:979`

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

#### `src/pages/ChatInterface.jsx:980`

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

#### `src/pages/ChatInterface.jsx:1035`

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

#### `src/pages/ChatInterface.jsx:1126`

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

#### `src/pages/ChatInterface.jsx:1128`

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

#### `src/pages/ChatInterface.jsx:1130`

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

#### `src/pages/ChatInterface.jsx:1131`

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

#### `src/pages/ChatInterface.jsx:1133`

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

#### `src/pages/ChatInterface.jsx:1143`

```jsx
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#14122b] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
```
**Raw class strings detected (best effort):**

- `fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4`
- `w-full max-w-sm rounded-2xl border border-white/10 bg-[#14122b] p-6 text-white shadow-2xl`
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
  - `border` — Border style/width/color.
  - `border-white/10` — Border style/width/color.
  - `shadow-2xl` — Drop shadow depth (elevation).

#### `src/pages/ChatInterface.jsx:1144`

```jsx
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#14122b] p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              {callPromptThread.avatar ? (
                <img
```
**Raw class strings detected (best effort):**

- `w-full max-w-sm rounded-2xl border border-white/10 bg-[#14122b] p-6 text-white shadow-2xl`
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
  - `border` — Border style/width/color.
  - `border-white/10` — Border style/width/color.
  - `shadow-2xl` — Drop shadow depth (elevation).

#### `src/pages/ChatInterface.jsx:1145`

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

#### `src/pages/ChatInterface.jsx:1150`

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

#### `src/pages/ChatInterface.jsx:1153`

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

#### `src/pages/ChatInterface.jsx:1158`

```jsx
                <p className="text-sm text-slate-300">{callPromptThread.direction === 'incoming' ? 'Incoming call' : 'Calling'}</p>
                <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call?'}</p>
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

#### `src/pages/ChatInterface.jsx:1159`

```jsx
                <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call?'}</p>
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

#### `src/pages/ChatInterface.jsx:1160`

```jsx
                <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call?'}</p>
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

#### `src/pages/ChatInterface.jsx:1163`

```jsx
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={closeCallPrompt}
                className="flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
```
**Raw class strings detected (best effort):**

- `mt-6 flex items-center justify-between gap-3`
- `flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20`

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
  - `border` — Border style/width/color.
  - `border-red-400/30` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-red-500/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1166`

```jsx
                className="flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
              >
                Decline
              </button>
```
**Raw class strings detected (best effort):**

- `flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20`

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
  - `border` — Border style/width/color.
  - `border-red-400/30` — Border style/width/color.
- **Interaction / motion:**
  - `hover:bg-red-500/20` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1172`

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

#### `src/pages/ChatInterface.jsx:1180`

```jsx
      <div className="grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-[62px_1fr] lg:grid-cols-[62px_minmax(260px,22vw)_1fr] xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]">
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
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

#### `src/pages/ChatInterface.jsx:1181`

```jsx
        <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
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

#### `src/pages/ChatInterface.jsx:1182`

```jsx
          <div className="space-y-2">
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
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

#### `src/pages/ChatInterface.jsx:1184`

```jsx
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
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

#### `src/pages/ChatInterface.jsx:1199`

```jsx
                  className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all ${
                    isActive
                      ? (isLight ? 'bg-[#6366f1] text-white' : 'bg-[#6e4ff6]/20 text-[#D4FF59]')
                      : (isLight ? 'text-slate-400 hover:bg-white hover:text-[#6366f1]' : 'bg-[#171031] text-[#8f95bb] hover:text-white')
```
**Raw class strings detected (best effort):**

- `bg-[#6366f1] text-white`
- `bg-[#6e4ff6]/20 text-[#D4FF59]`
- `text-slate-400 hover:bg-white hover:text-[#6366f1]`
- `bg-[#171031] text-[#8f95bb] hover:text-white`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#6366f1]` — Background color/surface.
  - `bg-[#6e4ff6]/20` — Background color/surface.
  - `text-[#D4FF59]` — Text color or text sizing.
  - `bg-[#171031]` — Background color/surface.
  - `text-[#8f95bb]` — Text color or text sizing.
- **Interaction / motion:**
  - `hover:bg-white` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-[#6366f1]` — Variant prefix (responsive, dark, or interaction state).
  - `hover:text-white` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1212`

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

#### `src/pages/ChatInterface.jsx:1221`

```jsx
        <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
```
**Raw class strings detected (best effort):**

- `hidden lg:block rounded-[24px] p-5 overflow-hidden border border-slate-200/50 dark:border-none`
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
  - `border` — Border style/width/color.
  - `border-slate-200/50` — Border style/width/color.
- **Responsive variants:**
  - `lg:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1222`

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

#### `src/pages/ChatInterface.jsx:1223`

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

#### `src/pages/ChatInterface.jsx:1224`

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

#### `src/pages/ChatInterface.jsx:1227`

```jsx
          <div className="relative mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50"
```
**Raw class strings detected (best effort):**

- `relative mb-6`
- `absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`
- `h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50`

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
  - `border` — Border style/width/color.
  - `border-transparent` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `focus:border-[#6366f1]/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1228`

```jsx
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50"
              style={{ background: theme.inputBg, color: theme.textPrimary }}
```
**Raw class strings detected (best effort):**

- `absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`
- `h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50`

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
  - `border` — Border style/width/color.
  - `border-transparent` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `focus:border-[#6366f1]/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `-translate-y-1/2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1230`

```jsx
              className="h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50"
              style={{ background: theme.inputBg, color: theme.textPrimary }}
              placeholder="Search conversations..."
              value={query}
```
**Raw class strings detected (best effort):**

- `h-11 w-full appearance-none rounded-[14px] border border-transparent pl-10 pr-11 text-[13px] outline-none transition-all focus:border-[#6366f1]/50`
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
  - `border` — Border style/width/color.
  - `border-transparent` — Border style/width/color.
  - `outline-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `focus:border-[#6366f1]/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `appearance-none` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `Search` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `conversations...` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1238`

```jsx
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[#6366f1]">{allVisibleThreads.length}</span>
          </div>
```
**Raw class strings detected (best effort):**

- `mb-3 flex items-center justify-between px-1`
- `text-xs font-bold uppercase tracking-wider`
- `text-[10px] font-bold text-[#6366f1]`

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
  - `text-[#6366f1]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1239`

```jsx
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[#6366f1]">{allVisibleThreads.length}</span>
          </div>

```
**Raw class strings detected (best effort):**

- `text-xs font-bold uppercase tracking-wider`
- `text-[10px] font-bold text-[#6366f1]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-bold` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `uppercase` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `tracking-wider` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
  - `text-[#6366f1]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1240`

```jsx
            <span className="text-[10px] font-bold text-[#6366f1]">{allVisibleThreads.length}</span>
          </div>

          <div className="h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar">
```
**Raw class strings detected (best effort):**

- `text-[10px] font-bold text-[#6366f1]`
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
  - `text-[#6366f1]` — Text color or text sizing.
- **Other:**
  - `custom-scrollbar` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1243`

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

#### `src/pages/ChatInterface.jsx:1244`

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

#### `src/pages/ChatInterface.jsx:1245`

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

#### `src/pages/ChatInterface.jsx:1254`

```jsx
                    className="group w-full rounded-[16px] px-3 py-3 text-left transition-all"
                    style={{ background: isActive ? theme.threadActiveBg : 'transparent' }}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
```
**Raw class strings detected (best effort):**

- `group w-full rounded-[16px] px-3 py-3 text-left transition-all`
- `transparent`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `w-full` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `px-3` — Horizontal padding (left/right).
  - `py-3` — Vertical padding (top/bottom).
- **Typography:**
  - `text-left` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `rounded-[16px]` — Corner radius.
- **Interaction / motion:**
  - `transition-all` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Other:**
  - `group` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1258`

```jsx
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {thread.avatar ? (
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `relative flex-shrink-0`
- `h-11 w-11 rounded-full object-cover shadow-sm`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `relative` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1259`

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

#### `src/pages/ChatInterface.jsx:1261`

```jsx
                          <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm ${isActive ? 'bg-[#6366f1] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
                        )}
```
**Raw class strings detected (best effort):**

- `h-11 w-11 rounded-full object-cover shadow-sm`
- `bg-[#6366f1] text-white`
- `bg-slate-100 text-slate-500`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `h-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-11` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-500` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#6366f1]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-sm` — Drop shadow depth (elevation).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1263`

```jsx
                          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm ${isActive ? 'bg-[#6366f1] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
                        )}
                        <span
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
```
**Raw class strings detected (best effort):**

- `bg-[#6366f1] text-white`
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
  - `bg-[#6366f1]` — Background color/surface.
  - `bg-slate-100` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.

#### `src/pages/ChatInterface.jsx:1266`

```jsx
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
                          style={{ background: presenceStatus(thread.senderId) === 'online' ? '#22c55e' : '#94a3b8', border: '2px solid transparent' }}
                        />
                      </div>
```
**Raw class strings detected (best effort):**

- `absolute bottom-0 right-0 h-3 w-3 rounded-full`
- `online`
- `#22c55e`
- `#94a3b8`
- `2px solid transparent`

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
  - `2px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `solid` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1270`

```jsx
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-[14px] font-semibold ${isActive ? 'text-[#6366f1]' : ''}`}>{threadName}</p>
                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
```
**Raw class strings detected (best effort):**

- `min-w-0 flex-1`
- `flex items-center justify-between gap-1`
- `text-[#6366f1]`
- `flex-shrink-0 text-[10px] font-medium text-slate-400`

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
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[#6366f1]` — Text color or text sizing.
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1271`

```jsx
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-[14px] font-semibold ${isActive ? 'text-[#6366f1]' : ''}`}>{threadName}</p>
                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                        </div>
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between gap-1`
- `text-[#6366f1]`
- `flex-shrink-0 text-[10px] font-medium text-slate-400`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-between` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `flex-shrink-0` — Flex layout.
- **Spacing:**
  - `gap-1` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
- **Color / surface:**
  - `text-[#6366f1]` — Text color or text sizing.
  - `text-[10px]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1272`

```jsx
                          <p className={`truncate text-[14px] font-semibold ${isActive ? 'text-[#6366f1]' : ''}`}>{threadName}</p>
                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                        </div>
                        <p className={`truncate text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
```
**Raw class strings detected (best effort):**

- `text-[#6366f1]`
- `flex-shrink-0 text-[10px] font-medium text-slate-400`
- `text-slate-600`
- `text-slate-400`
- `No messages`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-shrink-0` — Flex layout.
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[#6366f1]` — Text color or text sizing.
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `No` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1273`

```jsx
                          <span className="flex-shrink-0 text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
                        </div>
                        <p className={`truncate text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
                      </div>
```
**Raw class strings detected (best effort):**

- `flex-shrink-0 text-[10px] font-medium text-slate-400`
- `text-slate-600`
- `text-slate-400`
- `No messages`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex-shrink-0` — Flex layout.
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `text-slate-600` — Text color or text sizing.
- **Color / surface:**
  - `text-[10px]` — Text color or text sizing.
- **Other:**
  - `No` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1275`

```jsx
                        <p className={`truncate text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
                      </div>
                    </div>
                  </button>
```
**Raw class strings detected (best effort):**

- `text-slate-600`
- `text-slate-400`
- `No messages`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-slate-600` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.
- **Other:**
  - `No` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `messages` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1284`

```jsx
        <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
```
**Raw class strings detected (best effort):**

- `rounded-[24px] p-0 flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-none`
- `flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50`

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
  - `border` — Border style/width/color.
  - `border-slate-200/50` — Border style/width/color.
  - `border-b` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-none` — Variant prefix (responsive, dark, or interaction state).
  - `dark:border-slate-800/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1287`

```jsx
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeAvatar ? (
```
**Raw class strings detected (best effort):**

- `flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50`
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
  - `border-b` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1288`

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

#### `src/pages/ChatInterface.jsx:1289`

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

#### `src/pages/ChatInterface.jsx:1291`

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

#### `src/pages/ChatInterface.jsx:1293`

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

#### `src/pages/ChatInterface.jsx:1296`

```jsx
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                      style={{ background: presenceStatus(activeThread?.senderId) === 'online' ? '#22c55e' : '#94a3b8', border: '2px solid transparent' }}
                    />
                  </div>
```
**Raw class strings detected (best effort):**

- `absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full`
- `online`
- `#22c55e`
- `#94a3b8`
- `2px solid transparent`

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
  - `2px` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `solid` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `transparent` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1301`

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

#### `src/pages/ChatInterface.jsx:1302`

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

#### `src/pages/ChatInterface.jsx:1309`

```jsx
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startInstantCall(activeThread)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
```
**Raw class strings detected (best effort):**

- `flex items-center gap-3`
- `flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `flex` — Flex layout.
  - `items-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `h-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `w-9` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-center` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Spacing:**
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
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

#### `src/pages/ChatInterface.jsx:1312`

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

#### `src/pages/ChatInterface.jsx:1317`

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

#### `src/pages/ChatInterface.jsx:1320`

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

#### `src/pages/ChatInterface.jsx:1326`

```jsx
              <div className="flex-1 space-y-4 overflow-auto p-6 custom-scrollbar" style={{ background: isLight ? '#f8fafc' : 'transparent' }}>
                <div className="flex justify-center mb-6">
                  <span className="rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600">{todayLabel}</span>
                </div>
```
**Raw class strings detected (best effort):**

- `flex-1 space-y-4 overflow-auto p-6 custom-scrollbar`
- `flex justify-center mb-6`
- `rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600`

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
  - `border` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `custom-scrollbar` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1327`

```jsx
                <div className="flex justify-center mb-6">
                  <span className="rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600">{todayLabel}</span>
                </div>
                {activeMessages.length > 0 ? (
```
**Raw class strings detected (best effort):**

- `flex justify-center mb-6`
- `rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600`

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
  - `border` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1328`

```jsx
                  <span className="rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600">{todayLabel}</span>
                </div>
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => {
```
**Raw class strings detected (best effort):**

- `rounded-full bg-transparent border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-600`

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
  - `border` — Border style/width/color.
  - `border-slate-200/60` — Border style/width/color.
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:text-slate-600` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1334`

```jsx
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
                          isOwn 
                            ? 'bg-[#6366f1] text-white rounded-br-none' 
```
**Raw class strings detected (best effort):**

- `justify-end`
- `justify-start`
- `bg-[#6366f1] text-white rounded-br-none`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `justify-end` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `justify-start` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#6366f1]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-br-none` — Corner radius.

#### `src/pages/ChatInterface.jsx:1335`

```jsx
                        <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
                          isOwn 
                            ? 'bg-[#6366f1] text-white rounded-br-none' 
                            : `${isLight ? 'bg-white border border-slate-100' : 'bg-[#2a2744]'} rounded-bl-none`
```
**Raw class strings detected (best effort):**

- `bg-[#6366f1] text-white rounded-br-none`
- `bg-white border border-slate-100`
- `bg-[#2a2744]`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
- **Color / surface:**
  - `bg-[#6366f1]` — Background color/surface.
  - `bg-white` — Background color/surface.
  - `bg-[#2a2744]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-br-none` — Corner radius.
  - `border` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.

#### `src/pages/ChatInterface.jsx:1341`

```jsx
                          <div className={`mt-1 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-60 ${isOwn ? 'text-white' : 'text-slate-400'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
```
**Raw class strings detected (best effort):**

- `text-white`
- `text-slate-400`

**Utility breakdown (grouped):**

- **Typography:**
  - `text-white` — Text color or text sizing.
  - `text-slate-400` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1349`

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

#### `src/pages/ChatInterface.jsx:1353`

```jsx
              <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Plus size={20} />
```
**Raw class strings detected (best effort):**

- `p-4 border-t border-slate-100 dark:border-slate-800/50`
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
  - `p-4` — Padding (all sides).
  - `gap-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `p-1.5` — Padding (all sides).
- **Typography:**
  - `text-slate-400` — Text color or text sizing.
- **Borders / rings / shadows:**
  - `border-t` — Border style/width/color.
  - `border-slate-100` — Border style/width/color.
  - `rounded-[18px]` — Corner radius.
  - `rounded-full` — Corner radius.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-200/50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-700/50` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1354`

```jsx
                <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
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

#### `src/pages/ChatInterface.jsx:1355`

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
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

#### `src/pages/ChatInterface.jsx:1360`

```jsx
                    className="flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400"
                    style={{ color: theme.textPrimary, maxHeight: 140 }}
                    placeholder="Write a message..."
                    value={draftMessage}
```
**Raw class strings detected (best effort):**

- `flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400`
- `Write a message...`

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

#### `src/pages/ChatInterface.jsx:1372`

```jsx
                  <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} />
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95" onClick={sendMessage}>
                    <SendHorizontal size={18} />
                  </button>
```
**Raw class strings detected (best effort):**

- `hidden`
- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95`

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
  - `bg-[#6366f1]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:scale-105` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1373`

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95" onClick={sendMessage}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
```
**Raw class strings detected (best effort):**

- `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95`

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
  - `bg-[#6366f1]` — Background color/surface.
- **Borders / rings / shadows:**
  - `rounded-full` — Corner radius.
  - `shadow-md` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-transform` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:scale-105` — Variant prefix (responsive, dark, or interaction state).
  - `active:scale-95` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1378`

```jsx
                  <p className="mt-2 px-4 text-[11px] font-medium text-[#6366f1]">{uploadStatus || scheduleStatus}</p>
                ) : null}
              </div>
            </>
```
**Raw class strings detected (best effort):**

- `mt-2 px-4 text-[11px] font-medium text-[#6366f1]`

**Utility breakdown (grouped):**

- **Spacing:**
  - `mt-2` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `px-4` — Horizontal padding (left/right).
- **Typography:**
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Color / surface:**
  - `text-[11px]` — Text color or text sizing.
  - `text-[#6366f1]` — Text color or text sizing.

#### `src/pages/ChatInterface.jsx:1382`

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

#### `src/pages/ChatInterface.jsx:1383`

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

#### `src/pages/ChatInterface.jsx:1384`

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

#### `src/pages/ChatInterface.jsx:1386`

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

#### `src/pages/ChatInterface.jsx:1390`

```jsx
        <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto border border-slate-200/50 dark:border-none" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
          {activeThread ? (
            <>
              <div className="mb-8 text-center">
```
**Raw class strings detected (best effort):**

- `hidden xl:block rounded-[24px] p-6 h-full overflow-auto border border-slate-200/50 dark:border-none`
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
  - `border` — Border style/width/color.
  - `border-slate-200/50` — Border style/width/color.
- **Responsive variants:**
  - `xl:block` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-none` — Variant prefix (responsive, dark, or interaction state).

#### `src/pages/ChatInterface.jsx:1393`

```jsx
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-md dark:border-slate-800">
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
```
**Raw class strings detected (best effort):**

- `mb-8 text-center`
- `mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-md dark:border-slate-800`
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
  - `border-4` — Border style/width/color.
  - `border-white` — Border style/width/color.
  - `shadow-md` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1394`

```jsx
                <div className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-md dark:border-slate-800">
                  {activeAvatar ? (
                    <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
                  ) : (
```
**Raw class strings detected (best effort):**

- `mx-auto mb-4 h-24 w-24 rounded-full border-4 border-white shadow-md dark:border-slate-800`
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
  - `border-4` — Border style/width/color.
  - `border-white` — Border style/width/color.
  - `shadow-md` — Drop shadow depth (elevation).
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `object-cover` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1396`

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

#### `src/pages/ChatInterface.jsx:1398`

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

#### `src/pages/ChatInterface.jsx:1401`

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

#### `src/pages/ChatInterface.jsx:1402`

```jsx
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

              <div className="mb-8 grid grid-cols-4 gap-3">
```
**Raw class strings detected (best effort):**

- `text-xs font-medium text-slate-400 tracking-wide`
- `mb-8 grid grid-cols-4 gap-3`

**Utility breakdown (grouped):**

- **Layout / positioning:**
  - `grid` — Grid layout.
  - `grid-cols-4` — Grid layout.
- **Spacing:**
  - `mb-8` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `gap-3` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
- **Typography:**
  - `text-xs` — Text color or text sizing.
  - `font-medium` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `text-slate-400` — Text color or text sizing.
  - `tracking-wide` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1405`

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

#### `src/pages/ChatInterface.jsx:1412`

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

#### `src/pages/ChatInterface.jsx:1413`

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

#### `src/pages/ChatInterface.jsx:1420`

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

#### `src/pages/ChatInterface.jsx:1426`

```jsx
                  <div key={section.id} className="overflow-hidden rounded-[18px] border border-slate-100/50 dark:border-slate-800/50">
                    <button 
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
```
**Raw class strings detected (best effort):**

- `overflow-hidden rounded-[18px] border border-slate-100/50 dark:border-slate-800/50`
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
  - `border` — Border style/width/color.
  - `border-slate-100/50` — Border style/width/color.
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:bg-slate-50` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
  - `dark:hover:bg-slate-800/50` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `#f8fafc` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `#101328` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1428`

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

#### `src/pages/ChatInterface.jsx:1432`

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

#### `src/pages/ChatInterface.jsx:1433`

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

#### `src/pages/ChatInterface.jsx:1434`

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

#### `src/pages/ChatInterface.jsx:1439`

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

#### `src/pages/ChatInterface.jsx:1441`

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

#### `src/pages/ChatInterface.jsx:1449`

```jsx
                                  className="flex w-full items-center gap-2 rounded-xl border border-slate-50 bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors hover:border-[#6366f1]/20 dark:border-slate-800 dark:bg-slate-800/30"
                                  title="Preview"
                                >
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
```
**Raw class strings detected (best effort):**

- `flex w-full items-center gap-2 rounded-xl border border-slate-50 bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors hover:border-[#6366f1]/20 dark:border-slate-800 dark:bg-slate-800/30`
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
  - `border` — Border style/width/color.
  - `border-slate-50` — Border style/width/color.
  - `rounded` — Corner radius.
  - `shadow-xs` — Drop shadow depth (elevation).
- **Interaction / motion:**
  - `transition-colors` — Utility class (see Tailwind docs or local CSS utilities for custom classes).
  - `hover:border-[#6366f1]/20` — Variant prefix (responsive, dark, or interaction state).
- **Dark mode variants:**
  - `dark:border-slate-800` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-800/30` — Variant prefix (responsive, dark, or interaction state).
  - `dark:bg-slate-700` — Variant prefix (responsive, dark, or interaction state).
- **Other:**
  - `Preview` — Utility class (see Tailwind docs or local CSS utilities for custom classes).

#### `src/pages/ChatInterface.jsx:1452`

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

#### `src/pages/ChatInterface.jsx:1453`

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

#### `src/pages/ChatInterface.jsx:1456`

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

#### `src/pages/ChatInterface.jsx:1460`

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

#### `src/pages/ChatInterface.jsx:1469`

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

#### `src/pages/ChatInterface.jsx:1474`

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

#### `src/pages/ChatInterface.jsx:1475`

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

#### `src/pages/ChatInterface.jsx:1476`

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

#### `src/pages/ChatInterface.jsx:1480`

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

#### `src/pages/ChatInterface.jsx:1484`

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

#### `src/pages/ChatInterface.jsx:1488`

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

#### `src/pages/ChatInterface.jsx:1491`

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

#### `src/pages/ChatInterface.jsx:1493`

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

#### `src/pages/ChatInterface.jsx:1502`

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

- `src/pages/ChatInterface.jsx:1133` — setNotice(null)} className="text-xs font-semibold">Dismiss

```jsx
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
```
- `src/pages/ChatInterface.jsx:1223` — Messages

```jsx
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
          </div>

```
- `src/pages/ChatInterface.jsx:1239` — Direct Messages

```jsx
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
            <span className="text-[10px] font-bold text-[#6366f1]">{allVisibleThreads.length}</span>
          </div>

```
- `src/pages/ChatInterface.jsx:1386` — Select a conversation to start chatting

```jsx
                <p className="text-sm font-medium">Select a conversation to start chatting</p>
              </div>}
        </main>

```
- `src/pages/ChatInterface.jsx:1402` — @{truncateId(activeThread.senderId \|\| activeThread.matchId, 16)}

```jsx
                <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
              </div>

              <div className="mb-8 grid grid-cols-4 gap-3">
```
- `src/pages/ChatInterface.jsx:1434` — ({section.count})

```jsx
                        <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
                      </div>
                      {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
```
- `src/pages/ChatInterface.jsx:1456` — No documents shared

```jsx
                            }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedMedia' && (
```
- `src/pages/ChatInterface.jsx:1484` — No media shared

```jsx
                            }) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
                          </div>
                        )}
                        {section.id === 'sharedPost' && (
```
- `src/pages/ChatInterface.jsx:1493` — No posts shared

```jsx
                            )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
                          </div>
                        )}
                      </div>
```
- `src/pages/ChatInterface.jsx:907` — View image

```jsx
            title="View image"
          >
            <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
          </button>
```
- `src/pages/ChatInterface.jsx:933` — View video

```jsx
            title="View video"
          >
            <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
```
- `src/pages/ChatInterface.jsx:1215` — Logout

```jsx
            title="Logout"
          >
            <LogOut size={18} strokeWidth={1.5} />
          </button>
```
- `src/pages/ChatInterface.jsx:1232` — Search conversations...

```jsx
              placeholder="Search conversations..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
```
- `src/pages/ChatInterface.jsx:1313` — Start call

```jsx
                    title="Start call"
                  >
                    <Phone size={16} />
                  </button>
```
- `src/pages/ChatInterface.jsx:1362` — Write a message...

```jsx
                    placeholder="Write a message..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
```
- `src/pages/ChatInterface.jsx:1450` — Preview

```jsx
                                  title="Preview"
                                >
                                  <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
                                  <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
```
- `src/pages/ChatInterface.jsx:1470` — View

```jsx
                                  title="View"
                                >
                                  {isVideo ? (
                                    <>
```
- `src/pages/ChatInterface.jsx:903` — (element) <button>

```jsx
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="block w-full overflow-hidden rounded-xl border border-slate-100 text-left transition-opacity hover:opacity-95 dark:border-transparent"
```
- `src/pages/ChatInterface.jsx:929` — (element) <button>

```jsx
          <button
            type="button"
            onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
            className="relative block w-full overflow-hidden rounded-xl border border-slate-100 text-left dark:border-transparent"
```
- `src/pages/ChatInterface.jsx:1133` — (element) <button>

```jsx
            <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      ) : null}
```
- `src/pages/ChatInterface.jsx:1164` — (element) <button>

```jsx
              <button
                onClick={closeCallPrompt}
                className="flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
              >
```
- `src/pages/ChatInterface.jsx:1170` — (element) <button>

```jsx
              <button
                onClick={acceptCallPrompt}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
```
- `src/pages/ChatInterface.jsx:1183` — (element) <button>

```jsx
            <button
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] border-none shadow-none text-lg transition-colors ${
                isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
              }`}
```
- `src/pages/ChatInterface.jsx:1196` — (element) <Link>

```jsx
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all ${
```
- `src/pages/ChatInterface.jsx:1211` — (element) <button>

```jsx
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
            style={{ background: isLight ? '#ffffff' : theme.tileBg, color: isLight ? '#ef4444' : '#8f95bb' }}
            onClick={() => navigate('/login')}
```
- `src/pages/ChatInterface.jsx:1252` — (element) <button>

```jsx
                  <button
                    key={thread.id}
                    className="group w-full rounded-[16px] px-3 py-3 text-left transition-all"
                    style={{ background: isActive ? theme.threadActiveBg : 'transparent' }}
```
- `src/pages/ChatInterface.jsx:1310` — (element) <button>

```jsx
                  <button
                    onClick={() => startInstantCall(activeThread)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
                    title="Start call"
```
- `src/pages/ChatInterface.jsx:1317` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <Search size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
```
- `src/pages/ChatInterface.jsx:1320` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
                    <EllipsisVertical size={16} />
                  </button>
                </div>
```
- `src/pages/ChatInterface.jsx:1355` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Plus size={20} />
                  </button>
                  <textarea
```
- `src/pages/ChatInterface.jsx:1373` — (element) <button>

```jsx
                  <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-md transition-transform hover:scale-105 active:scale-95" onClick={sendMessage}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
```
- `src/pages/ChatInterface.jsx:1412` — (element) <button>

```jsx
                  <button key={i} className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70" title={action.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
                      <action.icon size={16} strokeWidth={2} />
                    </div>
```
- `src/pages/ChatInterface.jsx:1427` — (element) <button>

```jsx
                    <button 
                      className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                      style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
                      onClick={() => setAccordionState(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
```
- `src/pages/ChatInterface.jsx:1445` — (element) <button>

```jsx
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
```
- `src/pages/ChatInterface.jsx:1465` — (element) <button>

```jsx
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => openAttachmentPreview(item.attachment, url)}
```
## 5) Backend Mapping (Frontend → Express → Controller → Service/DB)

| Frontend call (path:line) | Express mount | Route definition | Controller file | Handler |
|---|---|---|---|---|
| GET /users/me (src/pages/ChatInterface.jsx:385) | /api/users -> server/routes/userRoutes.js:60 | GET /me (server/routes/userRoutes.js:17) | - | me |
| GET /messages/inbox (src/pages/ChatInterface.jsx:399) | /api/messages -> server/routes/messageRoutes.js:71 | GET /inbox (server/routes/messageRoutes.js:31) | - | inbox |
| POST /users/lookup (src/pages/ChatInterface.jsx:413) | /api/users -> server/routes/userRoutes.js:60 | POST /lookup (server/routes/userRoutes.js:20) | - | lookupUsers |
| GET /calls/history?match_ids=${allMatchIds.join( (src/pages/ChatInterface.jsx:445) | /api/calls -> server/routes/callSessionRoutes.js:78 | - | - | - |
| GET /messages/${matchId} (src/pages/ChatInterface.jsx:471) | /api/messages -> server/routes/messageRoutes.js:71 | - | - | - |
| POST /presence (src/pages/ChatInterface.jsx:549) | /api/presence -> server/routes/presenceRoutes.js:82 | POST / (server/routes/presenceRoutes.js:7) | server/controllers/presenceController.js | getPresence |
| GET /calls/pending (src/pages/ChatInterface.jsx:703) | /api/calls -> server/routes/callSessionRoutes.js:78 | GET /pending (server/routes/callSessionRoutes.js:22) | - | getPendingInvites |
| POST /users/${thread.senderId}/friend-request (src/pages/ChatInterface.jsx:735) | /api/users -> server/routes/userRoutes.js:60 | - | - | - |
| POST /messages/requests/${thread.id}/${decision} (src/pages/ChatInterface.jsx:742) | /api/messages -> server/routes/messageRoutes.js:71 | - | - | - |
| POST /calls/scheduled (src/pages/ChatInterface.jsx:771) | /api/calls -> server/routes/callSessionRoutes.js:78 | POST /scheduled (server/routes/callSessionRoutes.js:18) | - | createScheduledCall |
| POST /calls/join (src/pages/ChatInterface.jsx:815) | /api/calls -> server/routes/callSessionRoutes.js:78 | POST /join (server/routes/callSessionRoutes.js:19) | - | joinOrCreateCall |
| POST /messages/${activeThread.matchId} (src/pages/ChatInterface.jsx:1006) | /api/messages -> server/routes/messageRoutes.js:71 | - | - | - |

## 6) How to Edit Safely

- **Change copy/text:** search in `src/pages/ChatInterface.jsx` and update the JSX text nodes or string literals (use the Content Inventory references above).
- **Change layout/structure:** edit the JSX sections near the structural tags listed in **2.2**.
- **Change styling:** edit the relevant `className` block; for global utilities see:
  - `src/App.css`
  - `src/index.css` (contains global dark-mode overrides that can affect borders/shadows)
- **When line numbers drift:** re-run `npm run docs:generate` to refresh `path:line` references.

