# Upload Access Control - Design (2026-10-18)

## 1. Goal

Close unauthenticated read access to private files under `server/uploads/`, and fix
`emailService` reporting success when no email was sent.

## 2. Problem (verified 2026-10-18)

`server/server.js:297` mounts the entire uploads tree as static content with no
authorization:

```js
app.use("/uploads", express.static(uploadsRoot));
```

Measured on-disk contents of `server/uploads/`:

| Path | Files | Sensitivity |
|---|---|---|
| `contracts/` | 208 | **private** - e-signed contract PDFs, monetary terms |
| `chat/` | 8 | **private** - 1:1 conversation attachments (PDFs, screenshots, 9MB screen recordings, source files) |
| `profile/` | 2 | public - avatars |
| `feed/` | 1 | public - feed media |
| root | 5 | public - CMS assets |

Filenames are `<millisecond-timestamp>-v1.pdf`, immutable and never expiring. Any URL
that leaks (API response, shared link, referrer, browser history) is permanently
public and unauthenticated thereafter.

Supporting evidence:

- `server.js:281,287` defines `chatUploadsRoot` and creates the directory, but
  **no route ever references it**. Dead setup; the blanket mount serves it anyway.
- `server/routes/uploadsRoutes.js` is admin file *management* (listing/stats/delete)
  only. It never serves file bytes.
- `DocumentView` (`document_id`, `viewer_id`, `viewer_ip`, `viewed_at`) already models
  document access, but the static mount bypasses it entirely. **No real access log
  exists.** The audit trail is decorative.
- `server/services/emailService.js:118-122` returns `{ ok: true, status:
  "logged_no_gmail" }` when Gmail is unconfigured. Callers treat this as delivered.
- `server/services/uploadsService.js:248-254` back-fills a typed `Document` row for
  every orphan upload (`entity_type` in `contract | chat_attachment | call_recording |
  feed_media | profile_pic | uploads`, `uploaded_by: "system"`,
  `entity_id: <filename>`). This is the authorization key.

## 3. Scope

**In**
- Gate `chat/`, `contracts/`, `calls/`, `search/` behind short-lived signed URLs.
- One authorization resolver keyed on `Document.entity_type`.
- Frontend sign-then-open in `ContractVault.jsx` and chat attachment components.
- Real `DocumentView` rows on authorized contract access.
- `emailService` no longer reports `ok: true` when it did not send.

**Out (non-goals)**
- Moving files on disk. No directory migration, no `pdf_path` rewrite.
- Cookie-based session auth. Rejected: introduces CSRF surface into a Bearer-only app.
- Fetch-then-blob frontend delivery. Rejected: breaks `window.open`/`<img>`/`<iframe>`
  and buffers 9MB media in memory.
- Changing auth itself, or the `uploadsService` admin listing/delete surface.
- Gitignoring `dist/` (tracked separately).

## 4. Why signed URLs

The app is navigation-heavy: `ContractVault.jsx:663-665` does
`window.open(API_BASE + pdfPath)`, chat uses `<img>`/`<iframe>`/`href=`. Auth is
`Authorization: Bearer` from localStorage (`auth.js:62`). A plain browser navigation
**cannot attach a Bearer header**, so `requireAuth` on the static route would break
ContractVault and chat rendering immediately.

Signed URLs preserve every existing render path while still requiring a prior
authenticated `POST /api/files/sign`. The codebase already uses
`crypto.createHmac("sha256", ...)` (`documentController.js:249`), so this reuses an
established idiom rather than introducing new crypto.

## 5. Visibility matrix

| Path | Visibility | Reason |
|---|---|---|
| `feed/` | public | rendered by public `/share/:entityType/:entityId` (`App.jsx:232`) |
| `profile/` | public | author avatar on public share page (`SharedPost.jsx:494`) |
| root (CMS) | public | `cmsService.js:102`, site-wide assets incl. landing page |
| `contracts/` | gated | `Document.buyer_id` / `factory_id` / `uploaded_by` |
| `chat/` | gated | `Message.match_id` -> conversation participants |
| `calls/` | gated | `CallSession.participant_ids` / `created_by` |
| `search/` | gated | candidate-sourced imagery, not public marketing |

`products/` is not an uploads subfolder (`uploadsService.js:202` allowlist is
`["profile","feed","chat","calls","contracts",""]`); `productService.js` only
normalizes URLs. `SharedPost` renders product cards publicly, so product imagery must
stay public - this spec does not touch it.

## 6. Architecture

```
Browser (Bearer in localStorage)
  |
  | 1. POST /api/files/sign  { paths: ["/uploads/contracts/x.pdf"] }
  |    + Authorization: Bearer <jwt>
  v
fileAccessRoutes.js  --requireAuth-->  signedFileUrl.js
  |                                         |
  | 2. for each path:                        | resolve -> containment check
  |    resolve real path                     | authorize via Document
  |    canUserAccess(user, doc)              | sign(realPath + uid + exp)
  |    mint signed URL                       | timingSafeEqual on verify
  v
  | 3. browser navigates to signed URL
  v
GET /api/files/content?path=...&exp=...&uid=...&sig=...
  verify HMAC + expiry  ->  res.sendFile  ->  write DocumentView
```

### 6.1 `server/utils/signedFileUrl.js` (new)

```js
signFileUrl({ relPath, userId, ttlMs }) -> "/api/files/content?path=..&exp=..&uid=..&sig=.."
verifySignedFile({ relPath, userId, exp, sig }) -> { ok: true } | { ok: false, reason }
```

Rules, all mandatory:

- HMAC input is the **`path.resolve`d absolute path**, `userId`, and `exp` joined with
  `\n`. Signing the raw query parameter would let `?file=../../.env` sign cleanly.
- Containment check **before** hashing: resolved path must start with
  `path.resolve(UPLOADS_ROOT) + path.sep`.
- `crypto.timingSafeEqual` on equal-length buffers; length mismatch is a failure, not
  a throw.
- Secret from `env.UPLOADS_SIGNING_SECRET`. **If unset, minting and verification both
  fail closed** (throw / `ok:false`). Never a default secret, never a silent bypass.
- Default TTL 5 minutes (contracts) and 15 minutes (`calls/` media), overridable per
  call site.

### 6.2 `server/routes/fileAccessRoutes.js` (new)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/files/sign` | `requireAuth`; `{ paths: string[] }` -> `{ signed: string[] }` |
| `GET` | `/api/files/content` | verify HMAC + expiry, `res.sendFile`, no auth header needed |

Registered in `server.js` **before** the static mount. The static mount additionally
404s the four gated prefixes as defense in depth against future reordering.

### 6.3 Authorization resolver

`server/services/fileAccessService.js` (new), `canUserAccessDocument(user, doc)`:

| `entity_type` | Allow when |
|---|---|
| `contract` | `user.id` in `doc.buyer_id` / `doc.factory_id` / `doc.uploaded_by`, or user is admin/owner |
| `chat_attachment` | a `Message` references the file in `attachment`, and `user.id` is `sender_id` or a participant of `match_id` |
| `call_recording` | a `CallSession.recording_url` matches, and `user.id` is in `participant_ids` or `created_by` |
| anything else | `doc.uploaded_by === user.id`, or user is admin/owner |

**Fails closed.** An unresolvable document denies. Roles come from the existing
`requireAuth`-populated `req.user` shape; no new role system.

### 6.4 Orphan contract policy

The 208 back-filled contracts have `uploaded_by: "system"` and
`entity_id: <filename>`, so no owner is derivable. Under fail-closed they return 403
until claimed.

Mitigation shipped in the same change: a reconciliation entry in the admin uploads
listing (`uploadsService.getUploadsListing`) marks unclaimed private files, and
`documentService` claims `pdf_path` rows it creates. Files that are genuinely orphaned
stay locked - that is the intended outcome, not a regression.

The operational half of this - what a user sees on day one, and what is still locked -
is in `docs/rollout/2026-10-18-upload-access-control-rollout.md`.

### 6.4a API change: `POST /api/documents/url` is owner/admin only

**Added during the final review fix wave, 2026-10-18.** This was not in the original
spec or plan, and it is a public-API change:

| Before | After |
|---|---|
| `POST /api/documents/url` - `requireAuth` only | `POST /api/documents/url` - `requireAuth` + `allowRoles("owner","admin")` |

**Why it is necessary.** `ensureAllowedUrl` (`documentService.js:335-346`) accepts any
`/uploads/...` path, so this route was the forgery vector: a caller could register a
`Document` row pointing at someone else's gated bytes, and `uploaded_by` - which the
authorization resolver had to distrust for exactly this reason - would then be a
self-assertion. Restricting the route to the roles that can already read every file
closes the vector at its source.

**What it breaks.** Any external client that called the route as a non-privileged
authenticated user. No frontend in this repository calls it, and no contract flow calls
it (`registerExternalDocument` is used by the contract flow, not this route).

**How it is recorded.** `docs/plans/2026-10-18-upload-access-control.md` (Task 3
addendum) and `AGENTS.md` carry the same note, and
`tests/unit/server-file-access.test.js` asserts the role restriction on the route so a
future widening has to be a deliberate edit to a test.

### 6.5 Frontend

| File | Change |
|---|---|
| `src/pages/ContractVault.jsx:663` | `POST /api/files/sign` then `window.open(signed)` |
| `src/components/chat/FileAttachmentCard.jsx` | sign before `href=` |
| `src/components/chat/AttachmentPreviewModal.jsx` | sign before preview/download |

All three go through one helper, `src/lib/signedFile.js`, exposing
`signAndOpen(path)` / `signAndSetSrc(path)`. No other call site changes.

### 6.6 `emailService` fix

`emailService.js:118-122` currently returns `ok: true` after only writing a DB row.
Change the not-configured branch to return `{ ok: false, status: "logged_no_gmail" }`
and log at warn. Audit existing callers for `ok`-truthiness assumptions before
switching the return shape.

## 7. Threat model

| Attack | Defense |
|---|---|
| `?path=../../.env` | containment check before hashing; resolution outside `UPLOADS_ROOT` rejects |
| `..%2f` / backslash variants | `path.resolve` normalizes before both containment check and hash |
| Unsigned direct GET | no HMAC -> `ok:false`; gated prefixes 404 on the static mount |
| Expired URL replay | `exp` in the HMAC input; rejected after TTL |
| Logged-out user | signing requires `requireAuth`; no token, no URL |
| Cross-user URL sharing | `userId` is inside the HMAC input, so `uid` cannot be swapped |
| Timing attack on `sig` | `timingSafeEqual`, length-checked |
| Missing secret in prod | fail closed; never a default |
| Large-file DoS | TTL-bounded; no new buffering; `res.sendFile` streams |

## 8. Testing

New `tests/unit/server-signed-file-url.test.js` and
`tests/unit/server-file-access.test.js`:

- signs and verifies a valid URL
- rejects `../../.env`, `..%2f..`, absolute-path escape, and trailing-slash tricks
- rejects tampered `exp`, `uid`, and `sig` independently
- rejects expired URLs
- fails closed when `UPLOADS_SIGNING_SECRET` is unset
- timing-safe compare handles length mismatch without throwing
- resolver allows contract buyer/factory/uploader/admin, denies strangers
- resolver denies unresolvable orphan documents
- chat resolver allows sender and match participants, denies third parties

Integration (`tests/integration/`):

- `GET /uploads/contracts/<file>` now 404s (static mount no longer serves it)
- signed URL for an authorized user returns 200 and writes a `DocumentView`
- signed URL for an unauthorized user is never minted
- `/uploads/feed/*` and `/uploads/profile/*` still 200 without auth (regression guard)
- `emailService` returns `ok: false` when Gmail is unconfigured

## 9. Verification

1. `npm test` green, including new suites.
2. Manual: anonymous `curl /uploads/contracts/<known-file>` -> 404.
3. Manual: `ContractVault` open-contract still renders (signed URL round trip).
4. Manual: chat attachment preview renders for a participant, fails for a stranger.
5. `git status` clean except intended changes; `DocumentView` rows appear after step 3.

## 10. Rollout

Single PR. Migration-free. Old unsigned URLs for gated paths stop working immediately -
acceptable, since those URLs were the vulnerability. Deploy order is irrelevant; there
is no schema change and no backfill job.