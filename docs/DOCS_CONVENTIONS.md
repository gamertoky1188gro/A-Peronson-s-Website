# Documentation Conventions

This project uses **generated, line-numbered documentation** for pages and backend endpoints.

## Line references

- Format: `path:line` (1-based)
- Example: `src/pages/TexHub.jsx:290`

Line numbers are derived from snapshots under `docs/_generated/sources/`.

## Snippets

- Each reference includes a 3-4 line fenced snippet to provide local context.

## Tailwind/CSS notes

- Page docs list every `className` block and group utilities into: layout, spacing, typography, color, borders/rings/shadows, interaction, responsive, dark.
- Custom utilities (e.g. `.nav-glass`, `.spotlight-card`, `.skeleton`) are referenced back to `src/App.css` / `src/index.css`.

## Regeneration

Whenever source files change, regenerate docs so references stay correct:

```bash
npm run docs:generate
```
