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

## Project status (Mar 2026)
**Tech stack**
- Backend: Node.js + Express
- Frontend: React + Vite
- Database: MySQL (Prisma used for schema/migrations)
- Storage: JSON stores for MVP data (server/database/*.json)

**Completed**
- Garments/Textile buyer request flow (split + specs)
- Verified-first + message-request inbox tiers
- Contact-sharing block (policy + enforcement)
- Rating/review system with reviewer-only edit/delete
- Buyer request notifications + verified surfacing
- Auto-search alerts and feed boosts
- Verification document checklist by role/region
- Basic analytics dashboard + top metrics

**Pending / evolving**
- Expanded analytics instrumentation (more dashboards as traffic grows)
- Full payment gateway for subscriptions/verification
- Advanced admin moderation workflows

**Verification + auto-credit rules**
- New accounts receive **$5 restricted credit** (usable for verification/subscription only).
- Verification is subscription-based: **$1.99 first month**, then **$6.99/month**.
- Verification expires if renewal payment fails or lapses.

**Analytics events tracked (MVP)**
- page_view, click, page_duration/session_end
- Summary: total views, total clicks, avg session duration, top pages

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

## Key API Endpoints

### Authentication (`/api/auth`)
*   `POST /register`: Registers a new user (Buyer, Factory, Buying House, etc.).
*   `POST /login`: Authenticates a user and returns a JWT token.
*   `GET /me`: Returns the currently authenticated user's data.
*   `POST /logout`: Placeholder for logout (handled on client by dropping the token).

### User Management (`/api/users`)
*   `GET /me`: Get profile details of the logged-in user.
*   `PATCH /me/profile`: Updates profile fields (country, certifications, capacity, etc.).
*   `GET /`: [Admin/Owner] List all registered users.
*   `PATCH /:userId/verify`: [Admin/Owner] Manually toggle a user's "verified" status.
*   `DELETE /:userId`: [Admin/Owner] Delete a user account.

### Buyer Requirements (`/api/requirements`)
*   `POST /`: [Buyer] Create a new buyer request (category, quantity, material, etc.).
*   `GET /`: List requirements (buyers see their own; others see all).
*   `GET /search`: Search requirements with support for advanced filters and daily search quotas.
*   `GET /:requirementId`: Retrieve details of a specific requirement.
*   `PATCH /:requirementId`: [Buyer/Admin] Update requirement details or status.
*   `DELETE /:requirementId`: [Buyer/Admin] Remove a requirement.

### Company Products (`/api/products`)
*   `POST /`: [Factory/Buying House] Upload a new product to the marketplace.
*   `GET /`: List all company products.
*   `GET /search`: Search products with support for advanced filters and daily search quotas.

### Combined Feed (`/api/feed`)
*   `GET /`: Returns a ranked feed of buyer requests and products with anti-abuse and boost logic.

### Document & Contract Management (`/api/documents`)
*   `POST /`: Upload a document (PDF/Image) for verification or general storage.
*   `GET /`: List documents associated with an entity.
*   `DELETE /:documentId`: Remove a document.
*   `POST /contracts/draft`: Create a draft B2B contract.
*   `GET /contracts`: List contracts (scoped to the participating parties).
*   `PATCH /contracts/:contractId/signatures`: Update signature status (Buyer/Factory).
*   `PATCH /contracts/:contractId/artifact`: Manage contract artifact status (Draft/Generated/Locked).

### Verification & Subscriptions (`/api/verification` & `/api/subscriptions`)
*   `GET /verification/me`: Check own verification progress and missing documents.
*   `POST /verification/me`: Submit/update verification documents.
*   `POST /verification/admin/:userId/approve`: [Admin] Approve a user's verification.
*   `GET /subscriptions/me`: View current plan (Free/Premium) and expiry date.
*   `POST /subscriptions/me`: Upgrade/update subscription plan.
*   `GET /subscriptions/me/remaining-days`: Check days left on premium access.

### AI Assistant (`/api/assistant`)
*   `POST /ask`: Send a question to the AI assistant for rule-based guidance.
*   `GET /knowledge`: List organization-specific knowledge entries.
*   `POST /knowledge`: [Admin] Add organization-specific knowledge.

### Messaging & Collaboration (`/api/messages` & `/api/conversations`)
*   `GET /messages/inbox`: Tiered inbox (Priority for verified/accepted; Request Pool for others).
*   `POST /messages/:matchId`: Send a message in a specific match/thread.
*   `POST /messages/requests/:threadId/accept`: Accept an incoming message request.
*   `POST /conversations/:requestId/claim`: [Buying House] Claim a request to lock it for internal handling.

### Partner Network (`/api/partners`)
*   `GET /`: List your network (connected partners and pending requests).
*   `POST /requests`: Send a partnership request to another account.
*   `POST /requests/:requestId/accept`: Accept a partnership request.

### Call Sessions (`/api/calls`)
*   `POST /scheduled`: Schedule a video/audio call between parties.
*   `GET /history`: View past call logs.
*   `POST /:callId/start`: Initialize a call session.
*   `PATCH /:callId/recording`: Update the status/URL of a call recording.

### Analytics (`/api/analytics`)
*   `GET /summary`: High-level engagement metrics for the user.
*   `GET /dashboard`: [Admin] Comprehensive system-wide growth and activity metrics.

### Ratings & Reviews (`/api/ratings`)
*   `GET /profiles/:profileKey`: View ratings and aggregate score for a profile.
*   `POST /profiles/:profileKey`: Submit a rating/review after an interaction.
*   `POST /milestones`: Record business milestones (Contract Signed, Deal Completed) to qualify for ratings.

### Organization & Member Management (`/api/members`)
*   `GET /`: List sub-account members in the organization.
*   `POST /`: Create a new sub-account member.
*   `PATCH /:memberId/permissions`: Fine-tune specific access permissions for a member.

### System (`/api/system`)
*   `GET /meta`: Returns system version, modules, and design metadata.
*   `GET /api/health`: Basic service health check.

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
# Nginx Reverse Proxy Setup (Production)

This proxy lets the frontend use `/api` and `/ws` on the same host/port.
Assumes:
- Frontend runs on port 5173
- Backend runs on port 4000

## Config File
See: `docs/nginx/gartexhub.conf`

## Install Nginx (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx -y
```

## Enable Config
```bash
sudo cp /path/to/gartexhub.conf /etc/nginx/sites-available/gartexhub.conf
sudo ln -s /etc/nginx/sites-available/gartexhub.conf /etc/nginx/sites-enabled/gartexhub.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Notes
- If you use HTTPS, add a `listen 443 ssl;` block with certificates.
- Update `server_name` to your domain.
- If your frontend is static (built in `dist/`), use a static file server or `root` + `try_files` instead of proxying to 5173.
