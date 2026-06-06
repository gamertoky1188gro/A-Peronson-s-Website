# AGENTS.md — GartexHub

## Dev commands

```bash
npm run server        # backend (Express, port 4000, --watch)
npm run dev           # frontend (Vite, port 5173)
npm run dev:full      # both concurrently
npm run app           # Electron: build → server → launch
```

## Test / lint / build

| command | what |
|---|---|
| `npm test` | Jest unit tests (`--experimental-vm-modules --runInBand`) |
| `npm run test:unit` | same as `npm test` but scoped to `tests/unit/` |
| `npm run test:e2e` | Playwright (`tests/e2e/`) |
| `npm run lint` | ESLint |
| `npm run build` | Vite build |
| `npm run ci:full` | OpenSearch → reindex → tests → smoke |

Pre-commit (husky) runs: Prettier → lint → test → build. If it fails, fix the first failing step.

## Architecture

- **Monorepo-style** but single `package.json`. Frontend in `src/`, backend in `server/`, both ESM.
- **Database:** PostgreSQL via Prisma (`prisma/schema.prisma`). Also has JSON file stores under `server/database/` for rapid MVP iteration.
- **Prisma commands:** `npm run db:generate`, `npm run db:migrate:dev`, `npm run db:studio`
- **OpenSearch** required for search tests/CI. Start via `docker compose up -d opensearch`. Reindex with `npm run ci:reindex`.
- **No TypeScript** in source — JSX/JS only. `typescript` is a devDependency but unused for source code.
- **Tailwind v4** (via `@tailwindcss/vite` plugin, not PostCSS). `tailwind.config.js` exists but may be legacy — check `tailwind.css` for `@import "tailwindcss"`. Uses `@tailwindcss/typography` v0.5.19 for `prose` classes — add with `@plugin "@tailwindcss/typography";` in `tailwind.css`. Required dependency. If `prose` styles (headings, lists, tables, blockquotes, etc.) aren't rendering, typography plugin is missing — install it and add the `@plugin` directive.
- **Markdown rendering** uses `react-markdown` with `remark-gfm` (tables, strikethrough, task lists) and `remark-smartypants` (curly quotes, em/en dashes, ellipses, copyright/trademark symbols). Both plugins must be added to `remarkPlugins` array. Used in `MarkdownReadme.jsx`, `FeedManagement.jsx` (preview), and `MarkdownMessage.jsx` (chat).
- **Syntax highlighting** uses `react-syntax-highlighter` v16 with Prism and `oneDark` style via `CodeBlock.jsx` — a reusable component in `src/components/ui/`. Pass `className="language-xxx"` to trigger highlighting. Inline code is unaffected. If a language isn't matched, it renders as plain `<code>`. `code` components in `MarkdownReadme.jsx`, `FeedManagement.jsx`, and `MarkdownMessage.jsx` delegate to `CodeBlock` for fenced blocks.
- **Jest config:** `jest.config.cjs` + `babel.config.cjs` with `babel-plugin-transform-vite-meta-env` for Vite env var compatibility.

## Search page (`/search`)

The search page (`src/pages/SearchResults.jsx`) features:

| Feature | Implementation |
|---|---|
| **Sort by** | Dropdown: Relevance, Newest, Price asc/desc, MOQ asc. Passes `sort` param to backend. |
| **Pagination** | "Load more" button using cursor-based pagination (`cursor`, `next_cursor`, `limit`). |
| **Search suggestions** | Debounced autocomplete dropdown below search bar (queries backend + trending). |
| **Refine within results** | Client-side text filter in results section header. |
| **Field-specific search** | Toggle button cycles: All fields → Buyer name → Company name. Passes `field` param. |
| **Image / visual search** | File upload button next to search bar with preview. |
| **Compare / shortlist** | Checkbox on each card; comparison panel shows shortlisted items side-by-side. |
| **Export CSV** | Button in results header downloads current results as CSV. |
| **Trending searches** | Sidebar widget showing popular search terms (from analytics or fallback). |
| **Season / Collection filter** | Dropdown in More Filters: Spring, Summer, Fall, Winter, Spring 2026, etc. |
| **Machinery / Equipment filter** | Text input in More Filters. |
| **Availability / Stock status** | Dropdown in More Filters: In stock, Made to order, Sample only. |

**Backend sort support:** Both `requirementController.searchRequirements` and `productController.searchProducts` accept `sort` query param (`relevance`, `newest`, `price_asc`, `price_desc`, `moq_asc`) and new filter params: `season`, `machinery`, `stockStatus`.

## Key quirks

- `ALLOW_DB_OFFLINE=true` allows running backend without a real PostgreSQL connection.
- Frontend Vite dev server proxies `/api`, `/uploads`, `/ws` to `localhost:4000`.
- `VITE_API_URL` env var for standalone frontend (without proxy).
- `VITE_BASE_URL=./` in production/Electron for relative asset paths.
- Server uses `node --watch` (built-in Node 20+ file watcher).
- No explicit typecheck command — `tsc` is not run in CI.
- `docs/` contains auto-generated API docs (run `npm run docs:generate` to rebuild).

## jsonStore → Prisma conversion

**COMPLETE.** All `readJson`/`writeJson`/`updateJson` calls have been replaced with direct Prisma queries. The file `server/utils/jsonStore.js` has been deleted.

- ~400 calls across 60+ files → direct `prisma.model.findMany/findUnique/create/update/upsert/delete` using proper `where`, `orderBy`, `skip`/`take` clauses.
- Filters pushed to SQL wherever possible (no more loading entire tables then filtering in JS).
- Legacy JSON abstraction layer fully eliminated from production code.
- **Scripts:** `scripts/debug-esign.mjs` updated to use `prisma.document.findUnique`; other scripts in `scripts/` either use their own file reader or reference jsonStore in docs text only.
- **Tests:** 20 test files still have inert `jest.mock("../server/utils/jsonStore.js")` calls — these are harmless (jest auto-mocks a non-existent module). No functional impact.
- `docs/` auto-generated API docs still reference jsonStore in prose; run `npm run docs:generate` to rebuild.

If any test fails due to the removed module, just delete the inert `jest.mock` line — the source no longer imports from it.
