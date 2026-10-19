# Final surgical pass — upload access control (2026-10-20)

Branch: `feat/upload-access-control` (not switched).
Base of this pass: `3676315c` (the fix wave's head).
Scope: the three residual items the scoped re-review left open. Nothing else was
touched.

Final suite: **461 tests / 48 suites, all passing** (was 446 / 46).
Build: `npm run build` exits 0.
Every commit went through the real pre-commit hook (biome + the full Jest suite
+ `npm run build`); no `--no-verify`, and no `dist/` path was ever staged.

---

## (a) `SignedMedia.jsx` — the media had lost its fade

### What changed

`src/components/chat/SignedMedia.jsx:56` and `:84` — `class={className}` is
`className={className}` again. That is the whole of the regression: the fix
wave (`bc388b01`) changed both props, and `LazyImage` reads `className`
(`src/components/ui/LazyImage.jsx:19`) and spreads everything else onto the
`<img>` it renders, so `class` fell through `...rest` and landed on the `<img>`
as a **second** class attribute, replacing the
`transition-opacity duration-200 opacity-0/100` classes LazyImage sets.

The file was also given a visible failure state, because (b) needs it:
`useSignedSrcState` (`:46`, `:72`) and a `SignFailure` placeholder (`:34-42`)
render a message where the media would have been, instead of nothing.

### Measured, not assumed

The brief said React logs "Invalid DOM property `class`" on every render. What
is actually true, measured on this repo's React 19.2:

| element | `class` prop | rendered | React warns |
|---|---|---|---|
| `<img class>` | yes | `class="a"` | **yes**, once |
| `<video class>` | yes | `class="a"` | no |
| `<div class>` | yes | `class="a"` | no |
| `<LazyImage class>` | yes | **two** `class` attributes | yes |
| `<LazyImage className>` | yes | one merged `class` | no |

React 19 accepts `class` on a DOM element (that is why this repo uses it
everywhere); it warns only for `<img>`, and it **deduplicates the warning per
property name for the life of the module**, so it fires once, not on every
render. The substantive defect — the second class attribute replacing the
first — is real and is what the fix removes.

### Covering test

`tests/unit/frontend-signed-media.test.js` (new, 3 tests). It renders the
component and asserts on the **rendered element**, not on the props:

- "the caller's classes reach the rendered image, together with LazyImage's own"
  — the rendered `<img>`'s `class` attribute contains `max-h-64 w-full
  object-cover` **and** `transition-opacity duration-200 opacity-0`.
- "the class attribute is written once, not twice" — records every
  `setAttribute` React performs and asserts exactly one `class` write. This is
  the literal "no second class attribute" claim: the DOM keeps one attribute
  per name, so the duplicate is only observable in the attribute stream.
- "the video carries the caller's classes in one class attribute".

A fourth assertion lives in `afterAll`: no `Invalid DOM property` warning was
logged anywhere in the file. It is collected across the whole file because
React's dedupe would hide the warning from every test but the first.

### How it was proved to fail

The fix was reverted in the working tree (`className` → `class` on both
props) and the suite re-run:

```
× the caller's classes reach the rendered image, together with LazyImage's own
    Expected substring: "transition-opacity"
    Received string:    "max-h-64 w-full object-cover"
× the class attribute is written once, not twice
    Expected length: 1
    Received length: 2
    Received array:  [["class", "transition-opacity duration-200 opacity-0 "],
                      ["class", "max-h-64 w-full object-cover"]]
● Test suite failed to run
    expect(received).not.toMatch(expected)
    Expected pattern: not /Invalid DOM property/
    Received string:   "Invalid DOM property `%s`. Did you mean `%s`? class className"
```

3 of 3 tests fail, and the recorded attribute stream is the reviewer's
observation reproduced exactly. The file was then restored from a backup and
re-run green.

---

## (b) `/sign` — realistic headroom, and a 429 that fails visibly

### What changed

**Server, `server/routes/fileAccessRoutes.js:51-63` and `:90`:**

| budget | before | after |
|---|---|---|
| requests / user / minute | 60 | **300** (`SIGN_REQUEST_BUDGET`) |
| paths / user / minute | — | **1500** (`SIGN_PATH_BUDGET`) |

The request budget answers "how often may the caller ask". The path budget
answers "how much work may the caller cause", and it is the one that matters:
a request may carry up to 50 paths and every path costs a database round trip
inside the authorization resolver, so 300 requests x 50 paths would be 15,000
authorizations a minute. 1500 paths a minute is **half** the work the old
60-request cap allowed (60 x 50 = 3000). The headroom above is paid for in
requests, not in server load.

`createUnitBudget` (`server/middleware/rateLimiter.js:146-207`) is the new
counter: memory and redis stores, keyed like the request limiters (per user,
not per address). Over budget is a **429**, never an allow-through — the
request limiter, the path budget and the client all fail closed.

**Client, `src/lib/signedFile.js`:**

- **Batching** (`signEntry` `:211`, `scheduleFlush` `:192`,
  `flushPendingSigns` `:225`). Sign requests are queued on a microtask, so
  everything asked for in the same turn goes in **one** request, chunked at
  the server's own 50-path cap (`MAX_PATHS_PER_SIGN` `:74`). A chat thread
  with fifty images is one request, not fifty.
- **A 429 is reported, not swallowed** (`signPaths` `:139-176`). The old code
  caught every failure and returned `{}`, so a rate-limited sign and a refused
  sign were indistinguishable. A 429 now answers one entry per path with
  `error: SIGN_RATE_LIMITED` (`:79`) and `status: 429`.
- **Backoff** (`RATE_LIMIT_COOLDOWN_MS` `:88`, `signRateLimitWaitMs` `:101`).
  The next request waits out a one-second cooldown instead of adding to the
  load the limiter is shedding. The failed request is not retried — a retry
  would add exactly the load being shed.
- **A message the user can act on** (`describeSignFailure` `:252`): a rate
  limit and a refusal say different things, and the surface can now tell them
  apart.
- `signAndDownloadWithReason` (`:384`) is the reason-aware download; the
  boolean `signAndDownload` (`:366`) is kept for the existing callers.

**Surfaces, so the failure is visible:**

- `src/hooks/useSignedSrc.js:38` — `useSignedSrcState` returns
  `{ src, error }`; `useSignedSrc` (`:136`) still returns a string, so every
  existing caller is unchanged. A rate limit is retried up to 3 times after
  the cooldown (`MAX_RATE_LIMIT_RETRIES` `:7`, `:88`) — bounded, because an
  unbounded retry is a poll and a poll is the load the limiter is shedding.
- `src/components/chat/SignedMedia.jsx:34-48, 72-74` — a failed sign renders
  a placeholder that says so, instead of a hole in the thread.
- `src/components/chat/AttachmentPreviewModal.jsx` — a banner for a failed
  preview sign and for a download that could not start; the four preview
  loaders use `signEntry` so a 429 is no longer reported as "This file is not
  available to you".
- `src/components/chat/FileAttachmentCard.jsx` — same for the PDF and text
  thumbnails, which already displayed an error but with the wrong reason.

### Covering tests

`tests/unit/frontend-sign-rate-limit.test.js` (new, 8 tests):
signs 25 paths in ONE request; never sends more than 50 paths in one request;
the same path asked for twice is sent once; a 429 is reported as
`rate_limited`; a rate-limited sign still fails closed (no url, never the raw
path); the client backs off before the next request; the message says *why*;
the hook reports the rate limit so a surface can show it.

`tests/integration/file-access-http.test.js` (real router, real limiter):
"answers 429 once a user has spent the /sign REQUEST budget" (300 requests,
then 429) and "answers 429 once a user has spent the /sign PATH budget"
(30 requests x 50 paths = 1500 paths, then 429 — the request budget is not
spent, so the 429 can only be the path budget).

### How it was proved to fail

**Client.** The three behaviours were reverted in place (the 429 branch of
`signPaths` removed, `signEntry` signing one path at a time, the backoff
returning 0) and the suite re-run: **7 of 8 tests fail** —

```
Expected number of calls: 1   Received number of calls: 25   (no batching)
Expected number of calls: 2   Received number of calls: 60   (no chunking)
Expected number of calls: 1   Received number of calls: 2    (no dedupe)
Matcher error: received value must be a non-null object                (429 swallowed)
Expected: > 0   Received:   0                                     (no backoff)
Expected pattern: /rate limiting/i  Received: "Preview unavailable — the file could not be loaded."
Expected: "rate_limited"  Received: "unavailable"                    (hook cannot tell)
```

**Server.** The route was reverted to the old budget (request cap 60, no path
budget) and the integration suite re-run: **2 of 16 fail** —

```
× answers 429 once a user has spent the /sign REQUEST budget
    expected 200 "OK", got 429 "Too Many Requests"
× answers 429 once a user has spent the /sign PATH budget
    Expected: 429   Received: 200
```

Both files were restored from backups and re-run green.

### Deliberate edits to existing tests

Three, each because the behaviour under test changed on purpose:

1. `tests/integration/file-access-http.test.js` — the old test hard-coded
   "60 requests then 429". It now spends `SIGN_REQUEST_BUDGET` (the constant
   the route exports) and a second test was added for the path budget. The
   assertion is unchanged in kind: over the documented budget is a 429.
2. `tests/unit/frontend-signed-file.test.js` — "the preview modal downloads
   instead of opening a tab" pinned `signAndDownload(file.url`; the modal now
   calls the reason-aware `signAndDownloadWithReason(file.url`, so the pin was
   moved to that. It is a **stricter** pin, not a looser one.
3. `tests/unit/frontend-signed-file.test.js` — the two refresh tests asserted
   `toHaveBeenCalledTimes(1)`. With the sign queued on a microtask, the first
   observation of it is one `waitFor` poll away, so a 5 ms / 20 ms window was
   too narrow to observe "exactly one call". The windows were widened
   (`refreshMs: 500`, `ttlMs: 1000`) and the assertion kept as it was, so the
   "the first sign happened before any refresh" property is still pinned — with
   a 450 ms margin instead of a 0 ms one.

`tests/unit/frontend-jsx-bindings.test.js` — the pinned JSX element counts
moved (`AttachmentPreviewModal.jsx` 98 -> 100, `SignedMedia.jsx` 2 -> 5)
because the fix adds elements. The file says to bump the count when a file
legitimately gains an element; the count is the guard's anti-vacuity anchor,
so leaving it stale would have made the guard fail for the wrong reason.

---

## (c) The registry pass matched by basename

### What changed

`server/services/uploadsService.js`:

- `knownKeyOf` (`:237-252`) is the new key: the **normalised public path**,
  lower-cased, with `.`/`..` segments collapsed, so a row written with a
  different spelling of the same path still counts as "known" while a
  different path never does.
- `ensureDocumentRowsForExistingFiles` (`:276`, `:286`) keys the known set and
  looks a file up by that key instead of by `item.name.toLowerCase()`.

The old basename key meant `a.pdf` in `chat/` marked the name as known and
`a.pdf` in `contracts/` was never adopted — and a file with no `Document` row
is not public, it is **unreachable for everyone** (AGENTS.md item 23). The
registry pass exists to fix exactly that, so matching by basename
re-introduced a slice of the bug it replaced.

The pre-existing moderation scanner (`scanAndAnalyzeExistingFiles`,
`uploadsService.js:307`) still matches by `file_path endsWith <name>`. It is
disabled in the deployed configuration (`AI_HARAM_ANALYTICS_ENABLED=false`),
it only ever covered media, and a mis-match there mislabels a row for
moderation rather than making a file unreachable. Left alone on purpose —
see "Deferred".

### Covering test

`tests/unit/server-uploads-registry.test.js`, 2 new tests plus 1 new
non-regression test:

- "adopts the file in each directory under its OWN path" — `chat/x.pdf` and
  `contracts/x.pdf` both get their own row, with their own `entity_type`.
- "a row for one directory does not suppress the same name in another" — the
  sharpest form: the chat file is already registered, and the contracts file
  with the same name still has to be adopted.
- "recognises a row written with a different spelling of the same path" —
  `/uploads/./chat/x.png` still counts as the same file, so the key is
  normalised and not merely exact.

### How it was proved to fail

The registry was reverted to basename matching in place and the suite re-run:
**2 of 9 fail** —

```
× adopts the file in each directory under its OWN path
    expect(received).toMatchObject(expected)
    Matcher error: received value must be a non-null object
    Received has value: null            (no row for /uploads/contracts/x.pdf)
× a row for one directory does not suppress the same name in another
    expect(received).not.toBeNull()
    Received: null
```

The file was then restored from a backup and re-run green.

---

## Deferred / not done, and why

1. **Five pre-existing `class=` on `<LazyImage>`** — `AttachmentPreviewModal.jsx:1370`,
   `AdminPanel.jsx:3613`, `ChatInterface.jsx:1532`, `Settings.jsx:2734` and
   `:2780`. The same defect as (a) (the caller's classes replace LazyImage's
   `transition-opacity`/`opacity-*`), but they predate the fix wave and are
   outside the three residual items. The cost is the fade, not the layout:
   the caller's own classes still apply. Left alone deliberately; recorded in
   AGENTS.md item 24.
2. **The moderation scanner's basename match** —
   `server/services/uploadsService.js:307` (`scanAndAnalyzeExistingFiles`
   still looks a row up with `file_path endsWith <name>`). It cannot make a
   file unreachable — the registry pass has already adopted it under its own
   path — but it can point the AI-moderation scan at the wrong row when two
   directories hold the same media name. It is disabled in the deployed
   configuration and only ever covered image/video, so it was left out of a
   pass that was told to touch nothing else.
3. **The `sign/` path budget does not cover `POST /api/search/image`** or any
   other upload route. Only `/sign` schedules authorization work, so only
   `/sign` needs a path budget.
4. **The client's cooldown is a flat one second** and is not derived from a
   `Retry-After` header; the server's rate limiter does not send one. A
   `Retry-After` header on the 429 would be the better design and is a
   follow-up, not a fix for a residual item.
5. **`signOne` and `signOneWithTtl` still return `null` on a 429** rather than
   throwing. That is deliberate — their contract is "null means no url" and
   eleven call sites depend on it — but it means a caller that only wants the
   url cannot see the reason. The reason-aware path is `signEntry`, and the
   surfaces that show messages use it.

## Environment notes

- PowerShell swallows inline `bash -c '<script>'`; the RED proofs were
  therefore done by patching the working tree with PowerShell, re-running
  jest, and restoring from a copy in `%TEMP%\opencode\fix-backup`. Every
  patched file was restored and the suites re-run green before the commit.
- `npx biome check` reports **0 errors** on every changed file. The
  suppression comment for the awaited chunk loop needed the exact category
  name (`lint/performance/noAwaitInLoops`); a wrong one is a
  `suppressions/parse` **error** and fails the hook.
- The formatter was run on the four files it flagged, and the diff was
  reviewed: it touched only the new code, no pre-existing lines.
