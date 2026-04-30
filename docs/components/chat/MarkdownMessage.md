# MarkdownMessage Component

**Type:** Chat Message Renderer
**File:** `src/components/chat/MarkdownMessage.jsx`

## 1) Purpose

Renders chat messages with Markdown support:

- Parses and displays Markdown content
- Code block syntax highlighting
- Link detection and rendering
- Image embedding support

## 2) Props

| Prop        | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `content`   | string | Message content (Markdown) |
| `sender`    | string | Message sender name        |
| `timestamp` | string | Message timestamp          |

## 3) Dependencies

- `react-markdown` - Markdown parsing
- `remark-gfm` - GitHub Flavored Markdown
- `react-syntax-highlighter` - Code highlighting

## 4) Styling

- Tailwind utilities
- Dark mode support
- Message bubble styling

---

_Generated from source: src/components/chat/MarkdownMessage.jsx_
