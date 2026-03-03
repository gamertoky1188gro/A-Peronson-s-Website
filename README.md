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

## Frontend Routing

### Public Pages
- `/` → Landing page (`TexHub`)
- `/pricing` → Pricing/Subscription page
- `/about` → About page
- `/terms` → Terms page
- `/privacy` → Privacy page
- `/help` → Help Center
- `/login` → Login page
- `/signup` → Signup page
- `/access-denied` → Access denied page

### Protected Pages (Login Required)
#### Available to all authenticated roles (`buyer`, `buying_house`, `factory`, `owner`, `admin`, `agent`)
- `/feed`
- `/search`
- `/buyer/:id`
- `/factory/:id`
- `/buying-house/:id`
- `/contracts`
- `/notifications`
- `/chat`
- `/call`
- `/verification`
- `/verification-center` (same page component as `/verification`)

#### Role-specific Protected Pages
- `/partner-network` → roles: `buying_house`, `admin`, `factory`, `agent`, `owner`
- `/product-management` → roles: `factory`, `buying_house`, `admin`
- `/buyer-requests` → roles: `buyer`, `buying_house`, `admin`
- `/member-management` → roles: `owner`, `admin`, `buying_house`, `factory`
- `/org-settings` → roles: `owner`, `admin`
- `/insights` → roles: `owner`, `admin`
- `/owner` → roles: `owner`, `admin`
- `/agent` → roles: `buying_house`, `owner`, `admin`, `agent`

### Extra/Dev Route
- `/mvp` → MVP dashboard/test page

### Fallback Behavior
- Any unknown route (`*`) redirects to `/`.

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
