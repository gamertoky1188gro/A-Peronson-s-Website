# GarTexHub Support — Two Modes: Token-Gated Buyer AI Chat + Signed-in Generic Form

Date: 2026-11-15
Status: Approved design (brainstormed with the owner)
Program: Phase 1 of the GarTexHub Support upgrade (1 → 2 → 3 → 4 → 5: two modes, dynamic catalog + buyer model choice, premium workspace, MCP read-only wiring, detailed email report)

## Goal

Split `/support` into two experiences on one page:

- **Mode 01 — AI Investigation (buyer token):** a signed-in/out visitor pastes a
  secure buyer support token; access opens the existing AI investigation
  experience (clarifying conversation → read-only investigation → report →
  submit). Token is a bearer credential naming the issuing buyer account; the
  case API treats the caller as that buyer for support scope only.
- **Mode 02 — General Support:** signed-in users only. A simple form (name,
  email, subject, category, priority, description, optional attachment) that
  creates a plain support ticket through the existing ticket pipeline.

## Non-goals (this phase)

- No public (signed-out, tokenless) ticket submission — Mode 02 is signed-in only.
- No email-report upgrade (full transcript/evidence/audit) — Phase 5.
- No premium purple/cyan workspace UI — Phase 3.
- No dynamic model catalog — Phase 2. The buyer-visible model selector is NOT exposed in this phase; investigations use the owner-side configuration as today.
- No MCP tools — Phase 4.
- No token-based access to anything outside support (no admin, no purchases, no other buyers' data).

## Decisions (owner-approved)

1. Mode 02 signed-in only; Mode 01 bearer token only (session NOT required; token is bound to the buyer who was issued it).
2. Tokens stored in a new `SupportAccessToken` table (Prisma model), validated by sha256 hash lookup; individually revocable; auditable (`last_used_at`).
3. Token issuance: admin console "Buyer Tokens" tab (owner/admin) — pick buyer, label, expiry (never/30/90d/custom), copy-once secret, revoke at will.
4. Migration: SQL generated offline (`migrate diff`, new table only), review it in the terminal, then `migrate deploy`. Nothing existing is altered; refuse any reset.
5. `/support` route becomes public; authorization happens in-page and on the API, not at the route guard.
6. Events on the AI path still flow through the existing SSE stream; the token caller sees the same event contract, no private reasoning.
7. iceman-free stays excluded from investigations (owner may override later in the Phase 2 model manager).

## Architecture

```
/support (public chooser — src/pages/SupportReports.jsx)
   ├─ Card A: AI Investigation
   │    token input → POST /api/support/token/validate
   │    → valid: buyer identity in component state → existing case flow
   │      (useSupportCase — unchanged HTTP/SSE contract)
   │    → invalid/expired/revoked: inline error; card B offered
   └─ Card B: General Support (signed-in only)
        signed-in → form → POST /api/support/tickets (existing)
        signed-out → "Sign in to submit" CTA

Server
  SupportAccessToken model (new table only)
  server/services/supportTokenService.js   — issue/validate/revoke/list
  server/middleware/supportToken.js        — requireSupportToken
  server/routes/caseRoutes.js              — requireAuthOrSupportToken on all routes
  server/routes/supportTokenRoutes.js      — validate (public, limited), me
  server/routes/adminSupportTokenRoutes.js — list/issue/revoke (owner/admin)
  src/pages/admin/sections/AdminAISection.jsx — "Buyer Tokens" tab
```

## Components

### 1. `SupportAccessToken` (Prisma)

```prisma
model SupportAccessToken {
  id           String    @id @default(cuid())
  buyer_id     String
  token_hash   String    @unique
  label        String
  expires_at   DateTime?
  revoked_at   DateTime?
  created_by   String
  last_used_at DateTime?
  created_at   DateTime  @default(now())

  buyer        User      @relation("buyerSupportTokens", fields: [buyer_id], references: [id])
  @@index([buyer_id])
  @@index([revoked_at, expires_at])
  @@map("support_access_tokens")
}
```

Migration SQL is generated offline and reviewed before applying; only the new
table is created. (FK must match the User model's id type; verified against
`schema.prisma` when generating the diff.)

### 2. `supportTokenService.js`

- `generateToken()` — `gtk_sup_` + 32 random bytes (base64url). Return `{ token, hash }`; only the hash is stored.
- `issueToken({ buyerId, label, expiresAt, createdBy })` — validates buyer exists + is a marketplace buyer/customer role; creates row with hash; returns the plain token once.
- `validateToken(token)` — normalize, sha256, lookup; checks `revoked_at == null` and `expires_at` in the future (or null); buyer must still exist; updates `last_used_at` (fire-and-forget, no await on the request path); returns `{ ok: true, buyer, label }` or `{ ok: false, reason: "invalid"|"expired"|"revoked" }`.
- `listTokens()` — joined to buyer for admin display (id, label, buyer {id, name, email}, created_at, expires_at, revoked_at, last_used_at).
- `revokeToken(id)` — sets `revoked_at`. Idempotent.

Store raw tokens nowhere: no logs, no DB, no response except the one issue response.

### 3. `requireSupportToken` middleware

- Reads the token from `Authorization: Bearer gtk_sup_…` or `x-support-token` header.
- On valid: `req.user = buyer` (same shape `requireAuth` fills), plus `req.viaSupportToken = true`, plus `req.tokenId`.
- On invalid: 401 `{ error: "Invalid, expired or revoked support token" }`.
- In caseRoutes, all routes use `requireAuthOrSupportToken` (a wrapper that tries `requireAuth` then `requireSupportToken`). Ownership checks in the controllers are unchanged — token callers act as the buyer, and the buyer can own cases.
- Rate limiting: token callers key on `support-case:tok_<tokenId>`; existing user callers unchanged.

### 4. Routes

- `POST /api/support/token/validate` — public, rate-limited (10/min per IP). `{ token }` → `{ ok, buyer: { id, name }, label }` | `{ ok: false, reason }`.
- `GET /api/support/token/me` — requires `requireSupportToken`; re-validates; returns the same buyer.
- `GET /api/admin/support-tokens` — owner/admin; list active + revoked (no hashes).
- `POST /api/admin/support-tokens` — owner/admin; `{ buyerUserId, label, expiresAt? }` → `{ token, …row }` (plain token returned exactly once).
- `POST /api/admin/support-tokens/:id/revoke` — owner/admin; idempotent.

### 5. Frontend — `/support` (public)

- Remove the route-level ProtectedRoute for `/support` in `App.jsx`; page decides internally.
- New chooser as default view: `SupportChooser` (two cards). Local component state: `mode: "choose" | "ai" | "form"`, `supportBuyer` (buyer from validate), existing case state untouched for `"ai"`.
- Card A never shows internals: no model names, no tool list, no permission config. After validation the UI shows: "Buyer: <name> · token: <label>" + the existing conversation UI.
- Card B: signed-in users get the form; signed-out get a "Sign in to submit a request" CTA (link to `/login`).
- Token persists in memory only for the page session — NOT localStorage — so a copied token is not stashed on disk. On refresh, the chooser returns (token re-entered). Expiry/revocation seen live via 401s turning the view back to the gate with an error.

### 6. Admin — "Buyer Tokens" tab (AdminAISection)

- Search/select buyer (search users endpoint — reuse existing user search used elsewhere in admin; one endpoint call with `?q=`).
- Generate: label input + expiry dropdown (Never / 30 days / 90 days / custom date). On success: modal with the plain token once + copy button + warning it won't be shown again.
- Table: buyer, label, created, last used, expiry, status (Active/Revoked/Expired), revoke action.

## Data flow (Mode 01, happy path)

1. Buyer pastes token in `/support` → `POST /api/support/token/validate` → 200 `{ ok, buyer, label }`.
2. UI enters AI mode; all case requests carry `x-support-token: <token>`.
3. `requireAuthOrSupportToken` → `requireSupportToken` → `req.user = buyer`.
4. Controllers/services behave exactly as for that buyer (open case, messages, SSE stream, confirm, report).
5. `SupportInvestigation`/report paths unchanged; email to owner as today.

## Error handling

- Invalid/expired/revoked token anywhere → 401 `{ error, reason? }`; UI resets to the gate with the reason; no stack/details.
- DB down during validate → 503 `{ error: "Support temporarily unavailable" }`; the chooser still offers Mode 02.
- Expired token holders mid-conversation: next write fails 401 → UI shows "Session no longer authorized" + returns to gate; unsent draft preserved in component state.
- Admin issue failure (e.g. buyer not found) → 400 with the reason; no partial rows.

## Security notes

- Bearer tokens are secrets: hash at rest, never logged, shown once, revocable, auditable (`last_used_at`).
- Scope: the token impersonates the buyer for support routes only; it has no other privileges (admin gates check roles; a buyer is never `owner/admin`).
- Do NOT print `UPLOADS_SIGNING_SECRET`, SMTP keys or any other server secret into reports (existing redaction pipeline unchanged).
- The AI/investigation side sees nothing new — it receives the buyer's identity exactly as `requireAuth` fills it today.

## Testing

- Unit (new `tests/unit/server-support-token.test.js`): issue → validate round-trip; wrong token → invalid; expired → reason `expired`; revoked → `revoked`; disabled timestamps; `requireSupportToken` mounts `req.user`; token callers don't bypass ownership (case of another user still 403/404 as today).
- Existing suite keeps passing untouched (the buyer-token path is additive; isolation suite unchanged).
- Smoke: validate endpoint 401 without token; admin issue → validate ok → revoke → validate 401.

## Rollout

- Migration applied manually in the deploy/terminal session (owner chose interactive apply now); no other migration touched.
- No env var changes; no client bundle changes beyond `/support` and admin tab.
- Existing auth-required behavior is a superset of before — signed-in users keep everything they have today, plus the chooser.
