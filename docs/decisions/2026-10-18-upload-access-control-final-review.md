# Final review findings - upload access control (2026-10-18)

> Copied verbatim from the working-tree review at
> .superpowers/sdd/2026-10-18-upload-access-control/final-review-findings.md,
> which is gitignored. The review that produced it returned "With fixes" on
> the whole branch; the fix wave's report is at
> docs/decisions/2026-10-18-upload-access-control-final-fix-report.md.
# Final review findings â€” fix wave

Source: final whole-branch review of `feat/upload-access-control` (752ab06..082fcc3).
Verdict: **With fixes**. 4 merge-blocking items, plus 8 Important and 6 Minor.
Read `.superpowers/sdd/2026-10-18-upload-access-control/progress.md` for the ruling history.

Everything below is **read-only review output**. The fix wave addresses it; it does not
re-litigate it. Where I have ruled, the ruling is stated in **bold**.

---

## CRITICAL

### C1 â€” The `Document` row the entire authorization model keys on is never created in the deployed configuration
`server/server.js:1294-1299` Â· `server/services/uploadsService.js:196-199,203,119-121,249-261` Â· `render.yaml:55-56`

`render.yaml:55-56` and the local `.env` set `AI_HARAM_ANALYTICS_ENABLED=false`, so
`server.js:1294-1299` returns before calling `scanAndAnalyzeExistingFiles()`, and
`uploadsService.js:196-199` returns early for the same reason. The backfill at
`uploadsService.js:249` is the **only** producer of a `Document` row for `chat/`, `calls/`
and orphan `contracts/` files. It also only covers `isMediaFile` types
(`uploadsService.js:119-121`), so a chat `.pdf`/`.txt`/`.html` never gets one regardless.

The reviewer confirmed by read-only query against the production DB: 8 chat files on disk,
5 `Document` rows. Three files have no row and are now permanently unreachable:
`1773450152511-example.txt`, `1773453895424-sample1.html`, `1773455031098-ARRAY.c`.

`authorizeFilePath` returns `not_found` when no `Document` row anchors the path
(`fileAccessService.js:259-261`), so every new chat attachment and every call recording
becomes unreadable by everyone, legitimate participants included. The static mount 404s the
gated prefixes, so there is no fallback.

**Required: create the `Document` row at write time**, where the ownership facts (uploader,
thread, call session) actually exist. A backfill can never know them. Specifically:
- `server/controllers/messageController.js:138-170` (chat upload) should write a
  `chat_attachment` row with `entity_id` = the filename and `uploaded_by` = the uploader.
- `server/controllers/callSessionController.js:182-197` (recording upload) should write a
  `call_recording` row carrying the owning call id and the uploader.
- `server/controllers/searchController.js:73-101` (search image upload) â€” see C2.
- Separately: decouple row creation from the AI-moderation flag, and extend it past
  image/video.

**Ruling: write-time rows, not a backfill.** Also decide what to do about the 3 already-orphaned
files on disk â€” leaving them unreachable is acceptable (fail-closed), but say so in the report.

### C2 â€” `search/` is gated with no way in; the endpoint returns a dead URL
`server/utils/signedFileUrl.js:4` Â· `server/controllers/searchController.js:73-101` Â·
`server/services/uploadsService.js:203` Â· `server/services/fileAccessService.js:214-220`

The backfill's subfolder list (`uploadsService.js:203`) is
`["profile","feed","chat","calls","contracts",""]` â€” it **omits `"search"` entirely**. So a
`search/` `Document` row can never exist from any code path. With `search` in
`GATED_PREFIXES`, the static mount 404s it and `/sign` returns `not_found`. Even with a row,
the scanner labels it `entity_type: "uploads"`, which lands in `canUserAccessDocument`'s
`default` branch â€” a hard deny for every non-admin.

**Required: decide `search/` deliberately. Do not leave it gated and unreachable.**
**Ruling: model it, not un-gate it.** Write a `Document` row with a dedicated
`entity_type` (e.g. `search_image`) at upload time and authorize on `uploaded_by`, exactly
as the other write-time rows in C1 do. Only fall back to removing `"search"` from
`GATED_PREFIXES` if the upload route turns out to be unauthenticated â€” you cannot authorize
what nobody can be authorized for. Whatever you choose, state the reasoning.

### C3 â€” The `call_recording` authorization anchor is a column the caller can write
`server/services/fileAccessService.js:141-166` Â· `server/services/callSessionService.js:234` Â·
`server/routes/callSessionRoutes.js:91` Â· `server/controllers/callSessionController.js:100`

`canAccessCallRecording` authorizes a recording by finding `CallSession` rows whose
`recording_url` mentions the requested filename, then asking whether the caller created or
participates in one of those sessions. But `recording_url` is **caller-supplied**:
`PATCH /api/calls/:callId/recording` is `requireAuth` only and sets
`recording_url = sanitizeString(payload?.recording_url, 400)`. `markRecording` only requires
`ensureParticipant(call, userId)` â€” the caller is a participant of their own session, which
they trivially are.

So a caller can point their own session at any recording path, and then be "a participant of
a session whose recording is that file". With a `Document` row present for the target file
(the backfill creates one for `.webm`), `authorizeFilePath` grants and the attacker reads a
recording they were not on.

Exposure is **zero today** (`server/uploads/calls/` is empty, 0 `call_recording` rows) but
becomes a live private-data read the moment the first recording is uploaded and the server
restarts.

**Required: anchor the authorization on a fact the caller cannot write.** Write a `Document`
row at recording-upload time carrying the uploader and the owning call id, and authorize
against that row plus the **owning** session's `participant_ids` â€” never against a URL the
caller supplied.

**Out of scope (reviewer declined it, and I concur):** `listCallsByContract`
(`callSessionService.js:390-400`) ignores `_userId` and returns every call session for a
contract to any authenticated caller. Pre-existing; separate ticket. But note C3's exploit
depends on it, so fixing C3 matters more than fixing that.

---

## IMPORTANT

### I1 â€” `UPLOADS_SIGNING_SECRET` is in no deploy path; the first deploy silently breaks every private file
`server/server.js:105-113` Â· `render.yaml` Â· `server/utils/signedFileUrl.js:66-70` Â· `server/routes/fileAccessRoutes.js:70-79`

`REQUIRED_ENV_VARS` is `["DATABASE_URL","JWT_SECRET"]`. The secret is in neither the required
nor the recommended list, and `render.yaml` does not declare it. Unset, the server boots
**clean**, `/sign` returns 503 for every path, the static mount 404s the gated prefixes â€” so
private files become unreachable by *anyone*, with no boot-time signal, only a per-request
`logWarn`. `readSecret()` also accepts a 1-character secret.

**Required:** add `UPLOADS_SIGNING_SECRET` to `REQUIRED_ENV_VARS` so the server fails loudly
at boot the way it already does for the other two; declare it in `render.yaml`
(`generateValue: true` or a dashboard secret); enforce a minimum length (32 chars).

### I2 â€” The 208 orphan contract PDFs are admin-only with no claim path
`server/services/fileAccessService.js:189-206` Â· `server/services/uploadsService.js:630-668`

Live DB: **208/208** contract rows have `uploaded_by:"system"`, `contract_number:null`,
`artifact:null`, and null buyer/factory. There is not one real contract row in the
production DB. Every one is denied to every non-admin. The spec explicitly accepts this, so
it is not a code defect â€” but ContractVault is empty for every real user on day one.

**Required:** a rollout note. Not a code change to the authorization rules.

### I3 â€” `/sign` is an amplification lever
`server/routes/fileAccessRoutes.js:23` Â· `server/services/messageService.js:85-105` Â·
`server/services/fileAccessService.js:121`

`MAX_PATHS_PER_REQUEST = 50`, and each chat path calls `canUserAccessDocument` â†’
`canAccessChatAttachment` â†’ `listFriendMatchIdsForUser(user.id)`, which runs
`prisma.message.findMany({ where: { match_id: { startsWith: "friend:" } } })` â€” a scan of
every friend message on the platform â€” then builds an unbounded `IN` list. 50 chat paths â‡’
50 full scans plus 50 unbounded `IN` clauses per request. Latent DoS that scales with the
platform.

**Required:** hoist `listFriendMatchIdsForUser` out of the per-document loop (it is
user-scoped and constant within a request), cap the `IN` list, and add a per-user rate limit
on `/sign`.

### I4 â€” `POST /api/documents/url` was narrowed to owner/admin: an undocumented API contract change
`server/routes/documentRoutes.js` â€” `router.post("/url", requireAuth, allowRoles("owner","admin"), registerDocumentUrl)`

The change is **correct and necessary** â€” `ensureAllowedUrl` (`documentService.js:335-346`)
accepts any `/uploads/...` path, so it was the forgery vector. But it is not in the spec or
the plan, no frontend calls it, and it is a public-API break for any external client.

**Required: record it.** Update the spec (`docs/superpowers/specs/2026-10-18-upload-access-control-design.md`)
and the plan (`docs/plans/2026-10-18-upload-access-control.md`) to state the change, and make
sure `AGENTS.md` mentions it.

### I5 â€” The client/server `GATED_PREFIXES` duplication is a real drift hazard with a third-party consequence
`server/utils/signedFileUrl.js:4` vs `src/lib/signedFile.js:57,61-62` Â·
`src/components/chat/AttachmentPreviewModal.jsx:1218-1224`

The client copy has exactly one job: decide whether to hand a URL to
`view.officeapps.live.com`. If the server gates a fifth prefix and the client is not
updated, the Office embed is **not** suppressed and a private document's **signed** URL is
handed to Microsoft, which fetches and retains it. That reintroduces the leak this branch
exists to stop, via a one-line omission nothing detects.

**Required: remove the client-side guess.**
**Ruling: move the decision server-side.** Have `/api/files/sign` return
`thirdPartySafe: false` for gated paths, and have the client ask rather than duplicate the
list. Delete the client-side `GATED_PREFIXES` mirror. `SIGNED_URL_TTL_MS` mirroring
`DEFAULT_TTL_MS` is the same drift â€” prefer having the client use the server's returned
value where it needs one.

### I6 â€” The denylist is correct today, but the "new private folder" trap is unguarded and the test cannot catch it
`tests/integration/gated-static.test.js:14` Â· `server/utils/signedFileUrl.js:4` Â·
`server/services/cmsService.js:102`

The denylist ruling stands (root CMS assets are public and unlisted, so a subdirectory
allow-list would 404 the site logo). But adding a private subdirectory without touching
`GATED_PREFIXES` **publishes** it, silently, and the matrix test cannot detect it because
`gated-static.test.js:14` re-declares `const GATED = ["chat","contracts","calls","search"]`
locally instead of importing the server's exported constant. **The test is testing its own
copy of the list.**

**Required (cheap, two lines):** import `GATED_PREFIXES` from
`server/utils/signedFileUrl.js` into `gated-static.test.js` (it is importable â€” no DB, no
Express), and add one test asserting every directory actually present under `server/uploads/`
is either gated or explicitly allow-listed.

### I7 â€” `file_path` matching is case-sensitive in SQL but case-insensitive in JS
`server/services/fileAccessService.js:236-255` vs `:110-114`

The SQL arm is `file_path: { contains: basename }` (case-sensitive `LIKE`) plus an exact,
case-sensitive `artifact.pdf_path` equality; the JS re-check `rowAnchorsPath` lower-cases
both sides. On a case-insensitive filesystem `/uploads/contracts/CN-1-v1.pdf` and
`.../cn-1-v1.pdf` name the same bytes, but only the exact-case spelling resolves. Fail-closed,
so not a leak â€” but it contradicts the deliberate case-insensitivity of
`isGatedPath`/`isGatedRelative` and will surface as a spurious "file not found" on Windows.

**Required:** use `mode: "insensitive"` on the `file_path` arm, or drop the lower-casing in
`rowAnchorsPath` so the two agree.

### I8 â€” The pre-commit test gate still cannot fail, and this branch edited that file
`.husky/pre-commit:25-26`

`npm test 2>&1 | grep -E "(PASS|FAIL|Tests:)"` then `if [ $? -ne 0 ]` reads **grep's** exit
status; a red suite still prints `FAIL`/`Tests:`, grep exits 0, and the gate passes. The gate
is the only automated defence against exactly the defect class this branch shipped three
times ("passing while asserting nothing"), so the branch's headline "387/387 tests" is not
enforced anywhere.

**Required: one-line fix â€” `set -o pipefail`** (or capture npm's own exit code).

---

## MINOR

- **M1 â€” The JSX-bindings guard's docblock misattributes its mechanism and states numbers that do not reproduce.**
  `tests/unit/frontend-jsx-bindings.test.js:121-135`. The file claims `"{ noGlobals: true }`
  matters" and "Measured over 39 probed names: 25 escaped, 14 were flagged". The reviewer
  measured: `Scope#getBinding(name)` takes **one** parameter and ignores the second â€” the
  narrowing works because `getBinding` never consults globals while `hasBinding` does; and
  with the shipped code **34 of 36** probed global names are *flagged* and 0 escape.
  "25 escaped, 14 flagged" matches neither measurement. Behaviour is correct; the stated
  reason is wrong. **This is the parked item from Task 5 round 4, and the final review
  independently confirmed it is real â€” fix it in this wave.** Correct both the mechanism
  sentence and the measurement, and make the numbers reproducible.
- **M2 â€” `readEmailDeliveryStatus` still accepts a flattened body.**
  `src/pages/AdminPanel.helpers.js:980` â€” candidates are
  `[response?.result?.result, response?.result, response]`. The third is accepted when it
  carries a `status`, so a future envelope change putting `status` on the outer object would
  be read as a delivery result. Narrow it to `response.result.result` plus an explicitly
  flagged flattened form.
- **M3 â€” The modal's "Download" no longer downloads.**
  `src/components/chat/AttachmentPreviewModal.jsx` replaced `<a download={downloadName}>` with
  a button calling `signAndOpen`, which `window.open`s â€” the browser renders the PDF inline
  instead of saving it. `FileAttachmentCard` already uses `signAndDownload` with a
  synthesised anchor. Use `signAndDownload` there too.
- **M4 â€” `src={signedSrc || null}` on the preview `<img>`.** React omits `src` when it is
  `null`, so the element briefly has no `src` and the browser may re-request the current
  document. The `<video>` path already uses `undefined`; make the image match.
- **M5 â€” `DocumentView.id` needs a UUID.** `fileAccessRoutes.js:139` supplies
  `crypto.randomUUID()` because the column has no database default. Load-bearing, correctly
  commented â€” noting it for the next person who refactors that insert. No change required.
- **M6 â€” `.superpowers/` is gitignored, so the decision ledger lives only in the working
  tree.** The 20+ rulings that justify this design are not reviewable by anyone else.
  **Required: copy the ledger into the repo under `docs/`** so the decisions ship with the
  code.

---

## Declined to judge â€” do NOT fix these in this wave

1. `DELETE /api/admin/uploads/file` path traversal â€” pre-existing, admin-only, out of spec.
2. `GET /api/calls/by-contract/:contractId` returning every call session for a contract to
   any authenticated user â€” pre-existing, out of spec (though C3's exploit depends on it).
3. `AI_HARAM_ANALYTICS_ENABLED=false` in production â€” an existing product decision.
4. Moving the 208 orphan files or rewriting `pdf_path` â€” explicitly out of scope.
5. Cookie sessions / CSRF â€” explicitly out of scope.
6. Fetch-then-blob frontend delivery â€” explicitly out of scope.
7. Gitignoring `dist/` â€” explicitly out of scope.
8. The `lower(file_path)` functional index â€” the shipped code does not use `lower()`;
   reclassified as I7.
9. Hardening `PATCH /contracts/:id/signatures` and `/artifact` â€” ruled correct; the reviewer
   independently re-verified and concurred.
10. The `objectSrc`/`frameSrc` CSP directives vs. the PDF preview iframe â€” pre-existing.
