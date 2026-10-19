# Final fix wave — upload access control (2026-10-18)

Branch: `feat/upload-access-control`
Base of this wave: `082fcc3` (the whole-branch review's head)
Commits: `05942cd`, `b123140`, `bc388b0`, `eb63111`, `017a4a70`, `7b81717`

Final suite: **446 tests / 46 suites, all passing** (was 387 before this wave).
Every commit went through the real pre-commit hook (biome + the full Jest suite +
`npm run build`); no `--no-verify`, and no `dist/` path was ever staged.

---

## Summary

| Finding | Status | Commit |
|---|---|---|
| **C1** `Document` row never created | fixed (write-time rows) | `05942cd` |
| **C2** `search/` gated with no way in | fixed (modelled, not un-gated) | `05942cd` |
| **C3** recording anchored on a caller-writable column | fixed (anchored on the owning call) | `05942cd` |
| **I1** signing secret in no deploy path | fixed (required, declared, length-floored) | `b123140` |
| **I2** 208 orphan contract PDFs | rollout note | `017a4a70` |
| **I3** `/sign` amplification lever | fixed (hoisted, capped, rate limited) | `05942cd`, `bc388b0` |
| **I4** `POST /documents/url` role change unrecorded | recorded in spec, plan, AGENTS.md | `017a4a70` |
| **I5** client/server `GATED_PREFIXES` duplication | fixed (server answers; mirror deleted) | `bc388b0` |
| **I6** the denylist test tested its own copy | fixed (imports the server's list + coverage) | `b123140` |
| **I7** SQL case-sensitive, JS case-insensitive | fixed (they now agree) | `eb63111` |
| **I8** the pre-commit test gate cannot fail | fixed (npm's own exit status) | `eb63111` |
| **M1** the JSX-guard docblock misstates the mechanism | fixed and measured | `eb63111` |
| **M2** `readEmailDeliveryStatus` accepts a flattened body | fixed (narrowed) | `eb63111` |
| **M3** the modal's "Download" does not download | fixed | `bc388b0`, `7b81717` |
| **M4** `src={signedSrc \|\| null}` | fixed | `bc388b0`, `7b81717` |
| **M5** `DocumentView.id` needs a UUID | no change required (noted) | — |
| **M6** the decision ledger is gitignored | fixed (copied into `docs/decisions/`) | `017a4a70` |

Nothing in the declined-to-judge list was touched.

---

## CRITICAL

### C1 — The `Document` row the authorization model keys on was never created

**Change.** The row is now written at **write time**, where the ownership facts exist.
New module `server/services/privateDocumentService.js:41` (`recordPrivateUpload`) is the
single writer; it creates a `Document` row with `uploaded_by`, `entity_type`,
`entity_id`, `file_path` and `type`, and it never throws into the request path (a
failure is logged: the file is already on disk and the message already sent, so failing
the response would only produce a duplicate upload).

Call sites:

- `server/controllers/messageController.js:184` — a chat attachment gets a
  `chat_attachment` row: `entity_id` = the file name, `uploaded_by` = the uploader.
  Written **after** `postMessage` succeeds, so the message that references the file
  exists.
- `server/controllers/callSessionController.js:218` — a recording gets a
  `call_recording` row: `entity_id` = the **owning call id** (see C3), `uploaded_by` =
  the uploader. Written after `markRecording(... "available")` succeeds.
- `server/controllers/searchController.js:93` — a search image gets a `search_image`
  row (see C2). **Awaited**, not fired and forgotten: the client renders the returned
  url immediately, and a row that lands a moment later would make that first request
  fail with `not_found`.

The backfill is decoupled from the moderation feature. `ensureDocumentRowsForExistingFiles`
(`server/services/uploadsService.js:244`) is a new export that creates a row for every
file on disk that has none, for **every file type** (the old scanner only covered
image/video), and it runs whatever `AI_HARAM_ANALYTICS_ENABLED` says.
`server/server.js:1289` now runs it at boot, unconditionally, **before** the
moderation scan (which is still gated). The scan keeps its own create-if-missing path
for defence in depth. Row creation and the AI scan are now separate concerns: the
scanner's `subfolders` list also gained `"search"`.

**Covering tests.**

- `tests/unit/server-private-documents.test.js` — drives the three real controllers
  (multer, prisma and the message/call services mocked) and asserts the row each one
  writes: `entity_type`, `entity_id`, `file_path`, `uploaded_by`. Four tests: the chat
  row, the chat row for a **non-media** file (`.pdf` — the case the old backfill could
  never cover), the recording row (asserting `entity_id` is the **call id**, not the
  file name), the search row.
- `tests/unit/server-uploads-registry.test.js` — drives the registry pass against a
  temporary tree (never the real uploads root) and asserts that a row is created for a
  `.txt`, for a search image, for a contract PDF, for a public feed file and for a
  root-level file, that no second row is created for a file that already has one, and
  that it all happens with `AI_HARAM_ANALYTICS_ENABLED=false`.
- `tests/unit/server-file-access.test.js` — "authorizes a chat attachment through its
  write-time row" and "authorizes a search image through its write-time row": with the
  row present, `authorizeFilePath` grants; without it, it answers `not_found`.

**How I proved they can fail.** `git stash push -- server/` (which also stashes the new
untracked service) and re-running the three suites: **12 failures**. The write-time
tests fail with "expected 1 call, got 0" (no row was written at all); the recording test
fails because the row that is written has the wrong `entity_id`; the registry suite
fails at import (the export does not exist). The registry suite is new, so it is RED by
construction: the old code has no `ensureDocumentRowsForExistingFiles` at all.

**Ruling applied.** "Write-time rows, not a backfill" — followed. The moderation flag
was **not** re-enabled, and the row creation was not made conditional on it.

**The 3 already-orphaned files on disk** (`1773450152511-example.txt`,
`1773453895424-sample1.html`, `1773455031098-ARRAY.c`): the ruling allowed leaving them
unreachable. They are not left unreachable — the registry pass adopts them at boot with
a `system` row, and because chat authorization is message-based, the participants of the
thread they were posted in (and the uploader) can read them again. That is recorded in
the rollout note.

**Deferred / residual.** The registry pass runs at boot, once, and walks the uploads
tree. It is idempotent and does one query for the whole tree, but on a very large tree
it is a boot cost. It is not a migration and it is idempotent, so it is safe to re-run.

### C2 — `search/` was gated with no way in

**Change.** Modelled, not un-gated (the ruling's first branch, and the ruling's
condition for the second branch — "only fall back to removing `search` from
`GATED_PREFIXES` if the upload route turns out to be unauthenticated" — does not hold:
`POST /api/search/image` is `requireAuth`, `server/routes/searchRoutes.js:26`).

- `server/controllers/searchController.js:93` writes a `search_image` row at upload
  time.
- `server/services/fileAccessService.js:241` (`canAccessSearchImage`) authorizes on
  `uploaded_by` **and** on the path being under `/uploads/search/`, so the type can
  never authorise another folder's bytes.
- The scanner's `uploads` entity type (what the old backfill wrote for a `search/`
  file) is still a hard deny for a non-admin — it carries no ownership fact.

**Covering tests.** `tests/unit/server-file-access.test.js`: "allows the uploader of a
search image", "denies a search image to anyone but the uploader", "denies a search
image row that points outside the search folder", "denies the scanner's uploads entity
type to a non-admin", and "authorizes a search image through its write-time row".
`tests/unit/server-private-documents.test.js`: "writes a search_image row naming the
uploader".

**How I proved they can fail.** Same stash run: the search cases are among the 12
failures — against the old code the `search_image` type did not exist, so the branch
fell into the default deny, and no row was written at upload time.

**Reasoning recorded.** A search image is the requester's own query input, and the
upload route is authenticated, so "the uploader" is a real party to the file. Nobody
else has a claim on it, so authorizing on `uploaded_by` is correct and it keeps the
prefix gated.

### C3 — The `call_recording` anchor was a column the caller can write

**Change.** The recording is authorized against the session that **owns** it, named by
`entity_id`:

- `server/services/fileAccessService.js:222` (`canAccessCallRecording`) resolves
  `CallSession` by `prisma.callSession.findUnique({ where: { id: entity_id } })` and
  grants when the caller is in that session's `participant_ids` or is its
  `created_by`. **`recording_url` is never consulted.**
- `server/controllers/callSessionController.js:218` writes the row with
  `entity_id = req.params.callId` — the call the file was uploaded for, which the
  upload handler has already checked with `getCallSession` (participant check).

**Covering tests.** `tests/unit/server-file-access.test.js`:

- "denies a recording to a caller who only pointed their own session at it" — the
  exploit. The attacker's own session carries the victim's file name in
  `recording_url`; the row names the victim's call. The assertion is `false`.
- "resolves the owning call session by id, not by recording_url" — asserts
  `findUnique` was called with `{ id: "call-1" }` and that `findMany` was **not**
  called at all.
- "denies a call recording row that names no call session" — a row whose `entity_id`
  is a file name (the old backfill's shape) anchors nothing.
- `tests/unit/server-private-documents.test.js`: "writes a call_recording row naming
  the owning call and the uploader" — asserts `entity_id === "call-1"`, i.e. the call
  id and not the file name.

**How I proved they can fail.** Stash run: the exploit test **grants** against the old
implementation (the old code found the attacker's session by `recording_url contains
<filename>` and the attacker is a participant of their own session), so the assertion
fails. The two "allows/denies a call recording" tests fail too, with the old code
calling the mocked `findMany` and never the new `findUnique`.

**Residual, stated plainly.** `POST /api/documents/url` can still mint a
`call_recording` row for owner/admin, pointing `entity_id` at a call they are in and
`file_path` at another call's recording. That would delegate read access to that
recording to the participants of the named call. It requires owner/admin, who can
already read every file, so it is a delegation by a trusted role, not an escalation —
but it is not closed, and no schema change is available to close it (the spec promises
no migration). The alternative anchors were all rejected for the same reason:
`recording_url` is caller-writable, and the file name is not a call.

---

## IMPORTANT

### I1 — `UPLOADS_SIGNING_SECRET` was in no deploy path

**Change.**

- `server/utils/envValidation.js` (new) — `REQUIRED_ENV_VARS` now includes
  `UPLOADS_SIGNING_SECRET`, and `findMissingEnvVars` (`:23`) reports it missing when
  unset **or shorter than 32 characters**. `server/server.js:105` calls it and exits
  like it already did for `DATABASE_URL` / `JWT_SECRET`.
- `server/utils/signedFileUrl.js:19` — `MIN_SIGNING_SECRET_LENGTH = 32`;
  `readSecret()` returns `null` for a short secret, so `signFileUrl` throws ("must be at
  least 32 characters") and `verifySignedFile` answers `not_configured`.
- `render.yaml:70` — declares it with `generateValue: true`.
- `.env.example` — documents that it is required and 32 characters minimum. The local
  `.env` (untracked) got a generated 64-character value so the dev server still boots.

**Covering tests.** `tests/unit/server-env-validation.test.js` (new): the secret is in
the required list; a complete environment has no problems; an unset or blank secret is
a boot failure; a secret one character below the minimum is a boot failure and the
message names the minimum; a secret at exactly the minimum is accepted; **and
`render.yaml` declares the secret** (a regex over the deploy manifest).
`tests/unit/server-signed-file-url.test.js`: "fails closed when the secret is shorter
than the minimum length" (sign throws, verify answers `not_configured`) and "signs
with a secret at exactly the minimum length".

**How I proved they can fail.** The env-validation suite is RED by construction
against the old code (the module does not exist). The signed-file-url test was proved
RED by hand: with a 31-character secret the old `readSecret()` accepted it, so
`signFileUrl` did not throw and the assertion "at least 32 characters" failed. The
existing tests in that file had to move to a 32+ character fixture, because a fixture
the server would refuse makes every test in it prove the wrong thing.

### I2 — The 208 orphan contract PDFs

**Change.** Documentation only, as the finding requires ("not a code change to the
authorization rules"): `docs/rollout/2026-10-18-upload-access-control-rollout.md` (new)
states that all 208 rows are `uploaded_by: "system"` with no parties and no
`contract_number`, that they are denied to every non-admin and readable only by an
admin, that **ContractVault is therefore empty for every real user on day one**, that
this is the intended outcome, and what the options are (re-upload through the contract
flow, or ask an admin) until a claim path exists. It also records what happens to the
other orphan classes (chat files adopted and readable by the thread; adopted
recordings and adopted search images admin-only).

`AGENTS.md` (item 23) carries the same fact in its gotchas, and the spec (§6.4) links
to the rollout note.

**Covering test.** None — this is a rollout note, and the finding explicitly says the
change is documentation. What *is* tested is the behaviour it describes: the
authorization rules for an orphan are covered by "denies a system-owned orphan contract
to everyone but an admin" (`tests/unit/server-file-access.test.js`), and the registry
pass's behaviour on orphan files by `tests/unit/server-uploads-registry.test.js`.

### I3 — `/sign` was an amplification lever

**Change**, in three parts:

1. **Hoisted.** `listFriendMatchIdsForUser` scans every friend message on the
   platform. It is user-scoped and constant within a request, so it is fetched once
   into the request context (`server/services/fileAccessService.js:159`,
   `friendMatchIdsFor`) and shared by every document in that request. `authorizeFilePath`
   creates the context once (`fileAccessService.js`, the `const context = { friendMatchIds: null }`
   line) and passes it down.
2. **Capped.** The `IN` list is capped at `MAX_FRIEND_MATCH_IDS = 1000`
   (`fileAccessService.js:17`); the truncation is logged, not silent.
3. **Rate limited.** `server/routes/fileAccessRoutes.js:33` — a per-**user** limiter on
   `POST /api/files/sign`: 60 requests per minute, keyed on `req.user.id`. The
   limiter grew a `keyResolver` option (`server/middleware/rateLimiter.js:43`),
   because the existing limiter is IP-based and the callers of this route are
   authenticated — many users share one NAT address, and one address behind many users
   is not a user.

**Covering tests.**

- `tests/unit/server-file-access.test.js`: "fetches the friend match ids once per
  request, not once per document" (3 chat rows → `listFriendMatchIdsForUser` called
  **once**); "caps the friend match id list used in the IN clause" (1500 ids in → at
  most 1000 in the `IN` list).
- `tests/integration/file-access-http.test.js`: "answers 429 once a user has spent the
  /sign budget" (60 requests succeed, the 61st is 429) and "another user is not
  affected by that user's budget" (a second user id still gets 200).
- `tests/unit/server-rate-limiter.test.js` (new): the limiter counts per key when a
  `keyResolver` is supplied, and falls back to the address when the resolver yields
  nothing.

**How I proved they can fail.** Stash run: the hoisting test failed with "expected 1
call, received 0" against the old code (the old code called it once **per document**),
the cap test failed with a TypeError (no `IN` list at all, because the old code took
the uploader shortcut), and the rate-limit test failed with "expected 200, received
429"-style mismatch — against the old code there is no limiter at all, so the 61st
request returns 200.

**Note.** The rate limiter's memory store previously called `setInterval(...).unref()`
unconditionally, which throws in a browser-style environment (jsdom) — the frontend
suites run in jsdom, and the router now imports the limiter. Fixed at
`server/middleware/rateLimiter.js:22` with a `typeof timer?.unref === "function"`
guard. Without it the integration suite cannot even load.

### I4 — `POST /api/documents/url` was narrowed to owner/admin

**Change.** Documentation only — the code change was already on the branch and is
correct. Recorded in three places, as the finding requires:

- the design spec, new §6.4a (`docs/superpowers/specs/2026-10-18-upload-access-control-design.md`):
  what changed, why it is necessary (`ensureAllowedUrl` accepts any `/uploads/...`
  path, so the route was the forgery vector), what it breaks (an external client
  calling it as a non-privileged user; nothing in this repository calls it), and how
  the change is held.
- the plan, a "Task 3 addendum" plus a table of the whole fix wave
  (`docs/plans/2026-10-18-upload-access-control.md`).
- `AGENTS.md`, item 23's gotchas.

**Covering test.** `tests/unit/server-file-access.test.js` already asserted the role
restriction on the route ("POST /url requires a privileged role"). This wave adds
"the role restriction is recorded in the spec, the plan and AGENTS.md", which reads
all three documents and asserts each mentions both `documents/url` and `allowRoles` —
so a revert of the documentation alone fails the suite, exactly like a revert of the
code.

**Note.** The design spec was **not tracked** (`.gitignore:16` ignores
`docs/superpowers/`), so an edit to it would not have shipped. It is force-added in
`017a4a70`, which follows the precedent of `docs/superpowers/specs/2026-08-08-tui-neon-observe-design.md`,
which is tracked.

### I5 — The client/server `GATED_PREFIXES` duplication

**Change.** The decision moved server-side, as ruled.

- `server/routes/fileAccessRoutes.js:71` — every `/sign` entry now carries
  `thirdPartySafe`: `false` for a gated path, `true` for a public one, and the flag is
  present even on a refused path (a refusal is not permission to hand a document to a
  third party). The server classifies with its own `isGatedPath`.
- `src/lib/signedFile.js` — `GATED_PREFIXES`, `isGatedAssetPath`,
  `SIGNED_URL_TTL_MS` and `SIGNED_URL_REFRESH_MS` are **gone**. `isThirdPartySafe`
  (`:113`) asks the server and fails closed.
- `src/components/chat/AttachmentPreviewModal.jsx:743` — the Office embed is built
  only when the **server** says the path is safe; the state is tri-state (`null` =
  not answered yet, so the embed is suppressed and no notice flashes).
- The same ruling for the lifetime: `/sign` returns the `ttlMs` it used, the client
  has `signOneWithTtl` (`src/lib/signedFile.js:148`), and `useSignedSrc`
  (`src/hooks/useSignedSrc.js:24`) re-signs at half of **the server's** lifetime.
  `refreshMs` is now `null` (auto) by default and `0` still means "never re-sign" —
  `SignedMedia.jsx` passes `0` explicitly, because a re-sign swaps an `<img>`'s src
  and restarts a `<video>`.

**Covering tests.** `tests/unit/frontend-signed-file.test.js`: "reports the server's
answer for a public path" / "for a private path" / "is false when the server does not
answer" / "is false when the request fails outright"; "the client keeps no copy of the
server's gated-prefix list" (the source contains neither `GATED_PREFIXES` nor any of
the four prefix strings); "the client keeps no copy of the server's signature
lifetime"; "the preview modal asks the server instead of deciding locally";
"signOneWithTtl returns the url and the server's ttl"; "re-signs at half the lifetime
the server reported"; "does not re-sign when the caller asks for no refresh".
`tests/integration/file-access-http.test.js`: "a gated path is never safe to hand to a
third party", "a public path is safe to hand to a third party", "a refused path still
carries the third-party decision", "the response carries the lifetime the server used".

**How I proved they can fail.** Stash run: **18 failures**. The client suite failed
with "isThirdPartySafe is not a function"; the integration suite failed on the
`thirdPartySafe` and `ttlMs` assertions (the old response had neither) and on the
rate limit. The source guards ("the client keeps no copy…") fail against the old
client, which contained the list.

### I6 — The denylist was correct, but the "new private folder" trap was unguarded

**Change.** `tests/integration/gated-static.test.js` now **imports**
`GATED_PREFIXES` from `server/utils/signedFileUrl.js` (line 7) instead of re-declaring
it, and two coverage tests were added:

- "every folder the server writes uploads into is gated or explicitly public" — scans
  the server source for the upload destinations (`"server", "uploads", "<folder>"`),
  which is environment-independent.
- "every directory under server/uploads is gated or explicitly public" — reads the
  real tree (skipped when the directory does not exist, i.e. a fresh clone).

The public allow-list is explicit: `feed` and `profile`.

**Covering tests.** The two coverage tests above.

**How I proved they can fail.** Both were run against injected faults:

- `server/uploads/invoices/` created on disk → "every directory under server/uploads is
  gated or explicitly public" **fails** with `"directory": "invoices"`.
- a source file containing `path.join(process.cwd(), "server", "uploads", "invoices")`
  → "every folder the server writes uploads into is gated or explicitly public"
  **fails** with `"folder": "invoices"`.

The old test file would have passed in both cases, because it tested its own copy of
the list — which is the finding.

### I7 — `file_path` matching was case-sensitive in SQL and case-insensitive in JS

**Change — with a deliberate deviation, argued below.** The two now agree: both are
case-sensitive. `rowAnchorsPath` (`server/services/fileAccessService.js:149`) compares
exactly, and `artifactPdfPath` no longer lower-cases.

**Deviation from the finding's first suggestion.** The finding offered
`mode: "insensitive"` on the `file_path` arm *or* dropping the lower-casing in
`rowAnchorsPath`. I took the second branch, because the first one opens a hole:

> The row that matches is not the row that names the file that is served. The route
> serves the path the **request** asked for. A row for `/uploads/chat/SECRET.png` would
> authorize a request for `/uploads/chat/secret.png` — a **different file** on a
> case-sensitive filesystem, which is what the server runs on (Render, Linux). That is
> a cross-file grant.

The case-insensitive SQL arm plus the case-insensitive JS re-check (the current code's
JS, with the SQL relaxed to match) would have produced exactly that. The symptom the
finding wants removed — a hand-retyped URL with different case failing to resolve — is
unreachable in practice: the client always asks for the exact path the server gave it,
and a hand-typed URL is answered by the static mount, which 404s the gated prefixes
for everyone anyway. So the safe direction costs nothing real and closes a real hole.

The reasoning is in the code at `fileAccessService.js:120-138`.

**Covering tests.** `tests/unit/server-file-access.test.js`: "a row that differs only
in case does not anchor the request" (a row stored as `/uploads/contracts/A.pdf` does
not authorize a request for `/uploads/contracts/a.pdf` → `not_found`) and "the exact
stored spelling resolves". The existing test "narrows the contract lookup to
artifact.pdf_path in SQL" pins the SQL side (no `mode: "insensitive"`).

**How I proved they can fail.** The "differs only in case" test fails if the JS
re-check is loosened to lower-case both sides (it then accepts the row). The SQL side
is pinned by the existing assertion on the `where.OR` shape.

### I8 — The pre-commit test gate could not fail

**Change.** `.husky/pre-commit` now reads **npm's own exit status**:

```sh
TEST_STATUS=0
TEST_OUTPUT=$(npm test 2>&1) || TEST_STATUS=$?
echo "$TEST_OUTPUT" | grep -E "(PASS|FAIL|Tests:)" || true
if [ "$TEST_STATUS" -ne 0 ]; then
  echo "Tests failed!"
  echo "$TEST_OUTPUT"
  exit 1
fi
```

The output is captured rather than piped, so a failure prints the whole suite output
instead of only the grep summary.

**Deviation from the finding's first suggestion.** The finding suggested
`set -o pipefail`. That is not portable here: husky runs the hook with `sh -e`
(`.husky/_/h`), and `/bin/sh` is **dash** on Debian, where `pipefail` does not exist —
the hook would abort with "Illegal option" on every Linux deploy machine. The finding's
own alternative ("or capture npm's own exit code") is portable and reads the right
status, so that is what shipped. The reason is recorded in the hook's comments.

**Covering test.** `scripts/verify-precommit-gate.sh` (new, committed) — it extracts
the gate from the hook **verbatim**, runs it with a stub `npm` on `PATH` that prints
what a red suite prints and exits non-zero, and checks the gate's exit status. It runs
three cases: the new gate with a red suite (must fail), the new gate with a green suite
(must pass), and the **old** gate with the same red suite (must pass — the defect).

**How I proved it can fail.** The script's own output:

```
=== 1. the NEW gate with a RED suite (npm exits 1)
gate exit status: 1
Tests failed!
=== 2. the NEW gate with a GREEN suite (npm exits 0)
gate exit status: 0
=== 3. the OLD gate with the same RED suite (npm exits 1)
gate exit status: 0
=== verdict
PASS: the new gate fails a red suite and passes a green one; the old gate passed a red suite.
```

Every commit in this wave went through the real hook, which ran the full suite and
the build.

---

## MINOR

### M1 — The JSX-bindings guard's docblock

**Change.** `tests/unit/frontend-jsx-bindings.test.js`: the mechanism sentence and
the measurement are both corrected, and the numbers are now produced by a test.

- The mechanism: the narrowing is `getBinding`, not `hasBinding`, and the reason is
  **not** the `{ noGlobals: true }` argument — `Scope#getBinding(name)` takes one
  parameter and ignores the second. The narrowing works because `getBinding` never
  consults the runtime's globals, while `hasBinding` does. The docblock says exactly
  that now.
- The measurement: the old text ("Measured over 39 probed names: 25 escaped, 14 were
  flagged") matched no measurement. The new text quotes a pinned list of the 32
  capitalised globals in `GLOBAL_PROBE_NAMES`: **with getBinding, 32 are flagged and 0
  escape; with hasBinding alone, 5 are flagged and 27 escape.**

**Covering tests.** "measures the global-name escape rate" (measures the pinned list
through the real scanner and asserts 32 flagged / 0 escaped) and "hasBinding alone
would let the runtime globals through" (the same list through a hasBinding-only
scanner, asserting 5 flagged / 27 escaped — the instrument for the mechanism claim).
The stale "25 of 39" comment next to the caveat-1 test was corrected to the measured
27-of-32.

**How I proved they can fail.** Swapping the guard's `scope.getBinding(name, { noGlobals: true })`
for `scope.hasBinding(name)` in the shipped file → **2 tests fail** (the escape-rate
test and "flags a JSX name that resolves only to a runtime global"), and the file was
restored afterwards. The numbers in the docblock are the numbers the test measures, so
they cannot drift from the code without the suite noticing.

**Note.** The docblock now uses "-" where the original used an em dash, to keep the
file's byte-level encoding simple; the meaning is unchanged.

### M2 — `readEmailDeliveryStatus` still accepted a flattened body

**Change.** `src/pages/AdminPanel.helpers.js` — `readEmailDeliveryResult` now accepts
exactly two shapes: the canonical `response.result.result`, and an **explicitly
flagged** flattened form, `response.delivery`. The previous candidates
(`response.result`, `response`) are gone, so a future envelope change that put a
`status` on the outer object can no longer be read as a delivery result.

**Covering tests.** `tests/unit/admin-email-test-outcome.test.js`: "a status on the
outer envelope is not a delivery result" (both `{ ok, status }` and
`{ ok, result: { ok, status } }` → `null`) and "a flattened body is accepted only when
it is explicitly flagged" (`{ ok, status }` → `null`; `{ delivery: { ok, status } }` →
the delivery result). The existing envelope test is unchanged and still passes.

**How I proved they can fail.** Both new tests fail against the old implementation,
which accepted `response` and `response.result` whenever they carried a `status`.

### M3 — The modal's "Download" no longer downloads

**Change.** `src/components/chat/AttachmentPreviewModal.jsx:1313` — the button calls
`signAndDownload(file.url, safeDownloadName(file.name))` instead of `signAndOpen`.
`window.open` renders the document inline in a new tab; a download needs the
synthesised anchor that `signAndDownload` clicks, because a signed url cannot carry a
`download` attribute. A local `safeDownloadName` helper was added to the modal
(mirroring `FileAttachmentCard`'s) — it was missing and the build would have failed
without it.

**Covering test.** `tests/unit/frontend-signed-file.test.js`: "the preview modal
downloads instead of opening a new tab" — a source-level assertion, because the modal
is not rendered in any test and a render test of that component is not proportionate.
It fails if the button goes back to `signAndOpen`, and if the preview `<img>` goes
back to `src={signedSrc || null}`.

### M4 — `src={signedSrc || null}` on the preview `<img>`

**Change.** `src={signedSrc || undefined}` — React omits the attribute for `null`, so
the element is briefly src-less and the browser may re-request the current document.
The `<video>` path already used `undefined`; the image now matches.

**Covering test.** The same source-level test as M3.

### M5 — `DocumentView.id` needs a UUID

No change required, as the finding says. The comment at
`server/routes/fileAccessRoutes.js` still explains why the insert supplies one, and
this wave did not touch that route's insert.

### M6 — The decision ledger was gitignored

**Change.** The ledger and the final review are copied **verbatim** into the repo:
`docs/decisions/2026-10-18-upload-access-control-decisions.md` and
`docs/decisions/2026-10-18-upload-access-control-final-review.md`, each with a header
saying where it came from and that it is a copy. The design spec is now tracked too
(`docs/superpowers/specs/2026-10-18-upload-access-control-design.md`), so its update
ships.

**Covering test.** None — this is a documentation requirement. The *content* it
carries is covered by the tests it describes, and the plan now points at the copies.

---

## Things deliberately deferred

1. **The owner/admin delegation on `call_recording` rows** (C3 residual) — a trusted
   role can mint a row that delegates a recording to another call's participants. No
   schema change is available to close it, and the role can already read every file.
2. **The chat counterparty in a requirement-match thread.** Chat authorization's
   thread-membership test only knows *friend* threads
   (`listFriendMatchIdsForUser` returns `friend:` match ids). A participant of a
   requirement-match thread cannot read an attachment posted there. This is
   pre-existing (it is in the branch's own resolver, untouched by the findings) and it
   is not in the findings list, so it was not changed — but the write-time rows are
   what make chat attachments reachable at all, so it is worth a ticket. The uploader
   always reaches their own attachment.
3. **A claim path for the 208 orphan contract PDFs.** The rollout note says there is
   none and what the alternatives are. Deciding who the parties were is a product
   decision.
4. **The registry pass's boot cost** on a very large uploads tree. It is one query for
   the whole tree and creates rows only where one is missing.
5. **`/uploads/search` in the search results.** A search image is now readable by its
   uploader only. If a search result ever renders another user's query image, that
   image will not load for them — which is the correct fail-closed outcome, but it is
   worth watching.

## Notes on the branch state

- `dist/` was never staged. The pre-existing build churn (~400 paths) is still in the
  working tree, untouched.
- No Prisma schema change and no migration: the spec's promise holds.
- The suite grew from 387 to **446 tests in 46 suites**, all passing at `7b81717`.
- The pre-commit hook now runs the same gates as before (biome on the staged files,
  the full Jest suite, `npm run build`) — the test gate is strictly stronger, not
  weaker: it reads npm's exit status instead of grep's.
