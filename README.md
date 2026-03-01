# GarTexHub – Behavioral Architecture & Enterprise UX (MVP)

A trust-first B2B textile marketplace engine with social-style feed UX.

## What this MVP implements
- Multi-role auth: Buyer, Factory, Buying House, Admin
- 3-step onboarding: profile image, organization name, categories
- Combined feed: buyer requests + company products
- Unique toggle (diversified feed behavior)
- Floating AI assistant with rule-based guidance
- Conversation lock system for buying-house internal coordination
- Verification + subscription-backed badge logic
- Analytics summary tracking for key engagement events

## Backend architecture

```
server/
  routes/
  controllers/
  services/
  middleware/
  utils/
  database/
```

## JSON databases
- `server/database/users.json`
- `server/database/buyer_requests.json`
- `server/database/company_products.json`
- `server/database/subscriptions.json`
- `server/database/verification.json`
- `server/database/analytics.json`
- `server/database/documents.json`
- `server/database/conversation_locks.json`

## Key API groups
- Auth: `/api/auth/*`
- User/Profile: `/api/users/*`, `/api/onboarding`
- Feed: `/api/feed`
- Buyer Requests: `/api/requirements`
- Company Products: `/api/products`
- Verification: `/api/verification/*`
- Subscriptions: `/api/subscriptions/*`
- Conversation Lock: `/api/conversations/*`
- Assistant: `/api/assistant/ask`
- Analytics: `/api/analytics/summary`

## Run

```bash
npm install
npm run server
npm run dev
```

Optional frontend env:

```bash
VITE_API_URL=http://localhost:4000/api
```


## Desktop App (Electron)

Run the desktop app flow with one command:

```bash
npm run app
```

What it does:
1. Builds React (`dist/`)
2. Starts backend (`npm run server`)
3. Waits for backend + dist readiness
4. Launches Electron using `dist/index.html`


### Electron troubleshooting
- The build now uses relative asset paths (`vite base: ./`) so Electron `loadFile()` can resolve JS/CSS correctly.
- A CSP meta tag is included in `index.html` to reduce Electron security warnings.
