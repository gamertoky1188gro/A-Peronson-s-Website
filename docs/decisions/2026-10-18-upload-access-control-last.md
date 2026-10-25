# Final pass — the last two items (2026-10-20)

Branch: `feat/upload-access-control` (not switched).
Base: `d0f1371c` (the previous surgical pass).
Commit: **`6c7fae37`** — `fix(uploads): keep the sign failure in the server's shape`
Files: 5 (AGENTS.md, 3 `src/`, 1 test). **0 `dist/` paths staged.**
The commit went through the **real** pre-commit hook (biome on the staged files →
full Jest suite → `npm run build`); no `--no-verify`.

Final suite: **464 tests / 48 suites, all passing** (was 461 / 48).
Build: `npm run build` exits 0.
`scripts/verify-precommit-gate.sh` still exits 0 (run under Git Bash — the bare
`bash` on this machine is the WSL stub and fails for an unrelated reason).

---

## Item 1 (Important) — the rate-limit reason never reached the two hook-driven surfaces

### What changed

The mismatch was between two vocabularies for the same fact:

| | shape |
|---|---|
| the server's `/sign` entry | `{ error: string, status: number }` |
| what `useSignedSrcState` reported | `{ reason: string, status: number }` |
| what `describeSignFailure` reads | `entry.error` |

So the hook renamed the server's `error` to `reason`, and the function that
turns a failure into words looked for a field that was no longer there. The
rate-limit reason was dropped at the boundary.

**Chosen fix: the hook keeps the server's entry shape** (the second option the
brief offered). One representation, understood in one place.

- `src/hooks/useSignedSrc.js:103` — the failure is now
  `{ error: entry?.error ?? null, status: entry?.status ?? null }` instead of
  `{ reason: entry?.error || "unavailable", status: … }`.
- `src/hooks/useSignedSrc.js:108` — the bounded-retry check follows the field:
  `error.error === SIGN_RATE_LIMITED`.
- `src/hooks/useSignedSrc.js:22-30` and `:43-50` — the docstring states the
  contract: the failure carries the server's own `{ error, status }` shape and
  can be handed to `describeSignFailure` unchanged; `error` is `null` when the
  sign failed for a reason the server did not report (network error, no entry
  for the path), so the failure is still known even when the reason is not.
- `src/lib/signedFile.js:245-259` — `describeSignFailure`'s docstring now says
  it is the ONE place a sign failure is understood, and why a renamed field is
  a dropped reason. **Its logic is unchanged.**
- `src/components/chat/SignedMedia.jsx:29-30` — the placeholder's documented
  param shape.

`describeSignFailure` itself was **not** touched: with the hook reporting the
server's shape, the function already reads the right field. That is the point
of picking this option — the fix is at the seam, not a second reading of a
second field.

**Nothing regressed.** The direct `signEntry` surfaces (`AttachmentPreviewModal`'s
four preview loaders, `FileAttachmentCard`'s PDF and text thumbnails, the
download action) already passed the server's entry and are untouched. The
underlying properties the reviewer confirmed are unchanged: no raw-path
fallback anywhere, a 429 still produces `{ error: "rate_limited", status: 429 }`,
and the server-side path budget still refuses work before `authorizeFilePath`
is called (fail closed).

One deliberate behavioural improvement falls out of it: a **refusal** through
the hook now says "you do not have access to this file" instead of the generic
"the file could not be loaded". Before, both a rate limit and a refusal
arrived as the generic message.

### Covering tests

`tests/unit/frontend-sign-rate-limit.test.js` — the file already mocks
`src/lib/auth.js` and uses the **real** hook, so the new tests exercise the
whole chain (server answer → hook → rendered words) rather than a mock:

- `:151` **"a rate-limited sign says the server is rate limiting"** — renders
  `SignedImage` with `apiRequest` rejecting 429, and asserts the placeholder
  (`role="status"`) contains `/rate limiting/i`.
- `:164` **"a refused sign says the file is not accessible, and says something
  DIFFERENT"** — renders `SignedImage` with the server answering
  `{ error: "forbidden", status: 403 }`, asserts the placeholder contains
  `/access/i`, and asserts the rendered text is **not** the rate-limit message
  and does not match `/rate limiting/i`. Both are distinguishable.
- `:137` **"a failure with no reported reason is still a failure"** — the
  request fails outright; the hook must still report a failure (a surface that
  shows nothing on failure has to use the state form).
- `:121` the existing hook test, **edited** to the server's shape:
  `expect(result.current.error).toMatchObject({ error: SIGN_RATE_LIMITED, status: 429 })`
  (was `error.reason`). The assertion is not weaker — it is stricter, it now
  pins the shape as well as the reason.

The placeholder is the surface the original finding named. The modal's sign
banner (`AttachmentPreviewModal.jsx:1358`) consumes the same hook output
through the same `describeSignFailure`, so it is fixed by the same change; it
is not rendered by any test (a 1,500-line component with Prism and pdfjs), and
the task named the thumbnail.

### How it was proved to fail

The hook was reverted in the working tree (`{ error: … }` → `{ reason: … }`,
and the retry check back to `error.reason`) and the suite re-run:
**4 of 11 fail**.

```
● the thumbnail placeholder › a rate-limited sign says the server is rate limiting
    expect(element).toHaveTextContent()
    Expected element to have text content: /rate limiting/i
    Received: Preview unavailable — the file could not be loaded.

● the thumbnail placeholder › a refused sign says the file is not accessible…
    expect(element).toHaveTextContent()
    Expected element to have text content: /access/i
    Received: Preview unavailable — the file could not be loaded.

● the signed-src hook › reports the rate limit so a surface can show it
    expect(received).toMatchObject(expected)   (no `error` key)

● the signed-src hook › a failure with no reported reason is still a failure
    - Expected  - 1      Object { - "error": null, "status": null }
```

That is the reviewer's measurement reproduced exactly: with the old hook, both
reasons arrive as the same generic sentence. The file was then restored from a
byte-exact copy and re-run green (11/11).

---

## Item 2 (Important) — the deferral record in `AGENTS.md` was wrong by 2x

### What changed

`AGENTS.md:19` said "**Five** pre-existing `class=` on `<LazyImage>` remain".
It is **ten**.

Verified, not taken on faith: every `<LazyImage>` element in `src/` was
scanned for its props (38 elements in total), and ten carry `class=` rather
than `className=`. `git blame` on each `class=` line confirms every one
predates this branch — `ed577cbcf` (2026-10-05) or `0f5eed5b` (2026-10-07);
none is from the fix wave.

The record now lists all ten with file and line:

| file:line | blame |
|---|---|
| `src/components/chat/AttachmentPreviewModal.jsx:1375` | `0f5eed5b` (2026-10-07) |
| `src/components/chat/MarkdownMessage.jsx:183` | `0f5eed5b` (2026-10-07) |
| `src/components/feed/FeedItemCard.jsx:137` | `0f5eed5b` (2026-10-07) |
| `src/components/feed/PostDetailModal.jsx:220` | `0f5eed5b` (2026-10-07) |
| `src/components/ui/PostPreview.jsx:154` | `0f5eed5b` (2026-10-07) |
| `src/pages/AdminPanel.jsx:3618` | `ed577cbcf` (2026-10-05) |
| `src/pages/chat/MessageArea.jsx:80` | `0f5eed5b` (2026-10-07) |
| `src/pages/ChatInterface.jsx:1537` | `ed577cbcf` (2026-10-05) |
| `src/pages/Settings.jsx:2739` | `ed577cbcf` (2026-10-05) |
| `src/pages/Settings.jsx:2785` | `ed577cbcf` (2026-10-05) |

**Note on the paths:** four of the five paths in the brief were wrong about the
directory — `FeedItemCard.jsx` is in `src/components/feed/`, not
`src/components/chat/`; `PostDetailModal.jsx` is in `src/components/feed/`;
`PostPreview.jsx` is in `src/components/ui/`; `MessageArea.jsx` is in
`src/pages/chat/`. The files and line numbers are right; the folders were not.
The list above is what the scan found.

### Covering test

None — this is a documentation record, and the scan is a one-off script. The
number in the record is now the number the scan produces.

---

## Item 3 (Minor) — the `Invalid DOM property 'class'` sentence

### What changed

`AGENTS.md:5` said the warning fires "for every `<img>`". It does not.

**Measured**, in an isolated module registry per case (React 19.2.6), so the
per-module dedupe could not hide a difference:

| case | warnings |
|---|---|
| `<img class="a">` rendered **3 times** | **1** |
| `<video class="a">` alone | **1** |
| `<div class="a">` alone | **1** |

And in React's own source (`node_modules/react-dom/cjs/react-dom-client.development.js`):

- `validateProperty` starts with
  `if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) return true;`
  — the warning is **deduplicated per property name for the life of the React
  module**.
- the `class` branch is `possibleStandardNames.hasOwnProperty("class")` →
  `"className" !== "class"` → warn. `possibleStandardNames` is **global**, with
  no per-tag logic.

So the warning is about the **property**, not the element: `class` on a DOM
element warns, whichever element renders first. The sentence now says exactly
that — it fires **once**, and only the first DOM element that receives a `class`
prop reports it, `<img>`, `<video>` or `<div>` alike.

This is a small correction to the reviewer's own phrasing: "it warns for
`<img>` but not for `<video>` or `<div>`" is an artefact of measuring in one
module, where `<img>` happened to render first and claimed the single warning.
Measured in isolation, `<video>` and `<div>` warn too.

### Covering test

None — the sentence now describes a measurement. The measurement is recorded
above and is reproducible with three one-case jest files.

---

## Deferred / not done, and why

1. **The ten pre-existing `class=` on `<LazyImage>` are still there.** Genuinely
   out of scope (they predate the branch) and now correctly recorded. They cost
   the fade, not the layout.
2. **The moderation scanner's basename match**
   (`server/services/uploadsService.js`, `scanAndAnalyzeExistingFiles` still
   looks a row up with `file_path endsWith <name>`) — carried over from the
   previous pass's deferral list. It cannot make a file unreachable (the
   registry pass has already adopted it under its own path) and it is disabled
   in the deployed configuration.
3. **The modal's sign banner is not covered by a render test.** The modal is a
   1,500-line component that pulls in Prism and pdf.js; the previous pass made
   the same call for its download button. The banner reads the same hook output
   through the same `describeSignFailure` as the thumbnail, which is covered
   end to end.
4. **`describeSignFailure`'s message taxonomy is unchanged.** A server reason
   that is not `rate_limited` still maps to "you do not have access to this
   file", including `not_configured` (503), which is a server misconfiguration
   rather than a permission verdict. Pre-existing behaviour, out of scope for
   this pass, and changing it would be a third representation of the failure.
5. **The client's cooldown is still a flat one second**, not derived from a
   `Retry-After` header (the server does not send one). Carried over.

## Environment notes

- PowerShell swallows inline `bash -c '<script>'`, so the RED proof was done by
  patching the working tree with a script file, re-running jest, and restoring
  the file from a byte-exact copy in
  `%LOCALAPPDATA%\Temp\opencode\fix-backup-lastpass`. The file was restored and
  the suite re-run green before the commit; `git diff` after the restore shows
  only the intended change.
- The React-warning probes were scratch test files, deleted before the commit.
  `git status` shows only the five intended files.
- `npx biome check` on the four changed source files: **0 errors** (25
  warnings and 7 infos, all pre-existing — the same warnings the previous pass
  committed these files with). The hook's biome step ran on the staged files
  and passed.
