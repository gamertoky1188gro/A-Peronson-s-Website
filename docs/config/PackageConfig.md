# Package Configuration

**File:** `package.json`

## Project Info

| Field   | Value  |
| ------- | ------ |
| Name    | meow   |
| Version | 0.0.0  |
| Type    | module |

## Scripts

| Script                  | Command                                                              | Purpose                   |
| ----------------------- | -------------------------------------------------------------------- | ------------------------- |
| `dev`                   | `vite`                                                               | Start dev server          |
| `build`                 | `vite build`                                                         | Production build          |
| `lint`                  | `eslint .`                                                           | Lint code                 |
| `preview`               | `vite preview`                                                       | Preview production build  |
| `server`                | `node --watch server/server.js`                                      | Start Express server      |
| `dev:full`              | concurrently server + dev                                            | Full-stack dev mode       |
| `app`                   | build + electron                                                     | Desktop app               |
| `docs:generate`         | node scripts/generate-docs-index.mjs && node scripts/render-docs.mjs | Generate docs             |
| `db:generate`           | prisma generate                                                      | Generate Prisma client    |
| `db:migrate:dev`        | prisma migrate dev                                                   | Run migrations            |
| `test`                  | jest                                                                 | Run all tests             |
| `test:unit`             | jest --testPathPattern=tests/unit                                    | Unit tests only           |
| `test:e2e`              | playwright test                                                      | E2E tests                 |
| `worker:lead-reminders` | node server/workers/leadRemindersWorker.js                           | Run lead reminders worker |

## Key Dependencies

### Frontend

- `react` ^19.2.0 - UI framework
- `react-dom` ^19.2.0 - React DOM
- `react-router-dom` ^7.13.0 - Routing
- `framer-motion` ^12.36.0 - Animations
- `recharts` ^2.12.7 - Charts
- `lucide-react` ^0.575.0 - Icons
- `tailwindcss` ^4.2.0 - Styling

### Backend

- `express` ^5.2.1 - Web framework
- `@prisma/client` ^6.15.0 - Database ORM
- `jsonwebtoken` ^9.0.3 - JWT auth
- `bcryptjs` ^3.0.3 - Password hashing
- `ws` ^8.19.0 - WebSocket
- `nodemailer` ^6.10.1 - Email

### Integrations

- `@opensearch-project/opensearch` ^2.13.0 - Search
- `googleapis` ^133.0.0 - Google APIs
- `@simplewebauthn/browser` ^13.3.0 - Passkeys
- `pdfjs-dist` ^5.5.207 - PDF rendering
- `xlsx` ^0.18.5 - Excel handling
- `rtf.js` ^3.0.9 - RTF handling

## Dev Dependencies

- `vite` - Build tool
- `eslint` - Linting
- `jest` - Testing
- `playwright` - E2E testing
- `prisma` - Database tools

---

_Generated from source: package.json_
