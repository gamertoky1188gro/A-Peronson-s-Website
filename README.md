# Cross-Border B2B Textile Trust Platform (MVP)

A focused MVP for structured cross-border textile sourcing:

- Buyer requirement posting
- Rule-based AI-style factory matching
- Structured negotiation inbox (priority/request-pool)
- Trust workflow (verification, document sharing, status transitions)
- Admin verification and audit

## Architecture

```
server/
  controllers/
  routes/
  services/
  middleware/
  utils/
  database/*.json
  uploads/
src/
  App.jsx (single MVP dashboard)
```

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- DB: JSON files (`server/database/*.json`)
- Auth: JWT
- Password hashing: bcrypt
- Uploads: local storage (`server/uploads`)

## Data Files

- `server/database/users.json`
- `server/database/requirements.json`
- `server/database/matches.json`
- `server/database/messages.json`
- `server/database/documents.json`
- `server/database/metrics.json`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PATCH /api/users/me/profile`
- `POST /api/requirements` (buyer)
- `GET /api/requirements`
- `GET /api/requirements/:requirementId/matches`
- `PATCH /api/requirements/:requirementId/matches/:factoryId/status`
- `POST /api/messages/:matchId`
- `GET /api/messages/:matchId`
- `GET /api/messages/inbox`
- `POST /api/documents/:matchId` (`multipart/form-data`, pdf only)
- Admin: `GET /api/users`, `PATCH /api/users/:userId/verify`, `DELETE /api/users/:userId`, `DELETE /api/requirements/:requirementId`, `GET /api/admin/matches/audit`, `GET /api/admin/metrics`

## Matching Logic (MVP)

Scoring by:
- category compatibility
- MOQ <= requested quantity
- certification overlap
- lead time <= requested timeline

Produces ranked matches and stores in `matches.json`.

## Conversion Metric Tracking

Tracked transitions:
`requirement_created -> matched -> first_message_sent -> accepted/closed`

Stored in `metrics.json`.

## Run

```bash
npm install
npm run dev
npm run server
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

For frontend API, optional `.env`:

```bash
VITE_API_URL=http://localhost:4000/api
```
