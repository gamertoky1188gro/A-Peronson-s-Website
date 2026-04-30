# BotLogo Component

**Type:** UI Logo Component
**File:** `src/components/ui/BotLogo.jsx`

## 1) Purpose

GarTex Assistant bot logo:

- SVG logo with gradient
- Color and monochrome variants
- Customizable size
- Accessible with title

## 2) Props

| Prop        | Type   | Default            | Description        |
| ----------- | ------ | ------------------ | ------------------ |
| `width`     | number | 20                 | SVG width          |
| `height`    | number | 20                 | SVG height         |
| `className` | string | ""                 | Additional classes |
| `variant`   | string | "color"            | "color" or "mono"  |
| `title`     | string | "GarTex Assistant" | Accessible title   |

## 3) Accessibility

- `role="img"`
- `aria-label` when title provided
- `<title>` element for screen readers

---

_Generated from source: src/components/ui/BotLogo.jsx_
