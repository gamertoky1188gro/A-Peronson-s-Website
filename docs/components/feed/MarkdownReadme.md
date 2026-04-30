# MarkdownReadme Component

**Type:** Markdown Renderer
**File:** `src/components/feed/MarkdownReadme.jsx`

## 1) Purpose

Renders Markdown content with:

- GitHub Flavored Markdown (GFM) support
- Raw HTML rendering
- Sanitized output

## 2) Props

| Prop      | Type   | Description                |
| --------- | ------ | -------------------------- |
| `content` | string | Markdown content to render |

## 3) Dependencies

- `react-markdown` - Markdown parser
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-raw` - Raw HTML support
- `rehype-sanitize` - HTML sanitization

## 4) Styling

- Tailwind Typography plugin (`prose`)
- Custom styling for dark mode
- Code block styling with `prose-pre`

---

_Generated from source: src/components/feed/MarkdownReadme.jsx_
