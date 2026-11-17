# Support — case naming and AI activity tree rollout

**Date:** 2026-11-17
**Base:** `114361cc` (implementation plan) → **HEAD:** `c3d0f940`
**Spec (contract of record):** `docs/superpowers/specs/2026-11-17-support-case-naming-and-activity-tree-design.md` (commit `03acad4b`)

---

## What this is

Two changes to the support workspace, shipped together:

1. **Cases name themselves.** The first client message of a fresh case carries an
   invisible `TITLE: <3–8 words>` marker in the intake model's prompt. The server
   strips the marker before the reply reaches the buyer, persists the title on
   `support_cases.subject` (first message only, never overwritten), and returns it
   in the messages response. The header and the case-reference card render the
   title; the recent-cases list already rendered `subject`, so it renames itself
   for free. A deterministic first-words derivation (48-char cap, word boundary)
   is the fallback when the model emits no usable marker.
2. **The AI's work becomes visible while it runs.** Investigations stream their
   tool calls as `support.case.activity` SSE events. The client renders an
   inline "Reading walletService.js"-style tree while the investigation is live,
   and collapses it to "How this was investigated · N steps" after completion.
   Tool labels are sanitized server-side to a basename via
   `server/services/investigation/activityLabel.js` — never a path, never the
   model's reasoning. Persisted `tool_log` rows from this build forward seed the
   tree on reload.

## What shipped (git log --oneline 114361cc..HEAD)

```
c3d0f940 fix(support): cap seeded activity rows at 200; survive bad completed_at
11f6ce21 feat(support): inline activity tree while the AI works
f55f7388 feat(support): expose a narrow investigations projection on GET case
bfddf978 feat(support): stream tool calls as support.case.activity
7370e982 feat(support): shared sanitizer for tool-call display labels
3c75a6ed fix(support): never leak a glued TITLE: prefix to the buyer's bubble
0898a0ce feat(support): merge the case title from the messages response
5726149c fix(support): close TITLE-marker coverage gaps and disarm marker on later turns
b16ac52d feat(support): persist the case title on the first client message
7023b333 fix(support): cap fallback title at 48 chars at a word boundary; harden title hygiene
dac07171 feat(support): intake contract can carry an invisible TITLE marker
```

Eleven commits, not the eight the task brief estimated — counted from the actual
range, and every one of them is part of this feature.

## Verification

Read-only verification against the local API on `127.0.0.1:4000`, plus one live
buyer-token run performed on 2026-11-17 (see (e)). **No messages were posted to
pre-existing cases.** The fresh case used for the live run (`b8aaf728`) was
created today for exactly this purpose.

### (a) Commit range

`git log --oneline 114361cc..HEAD` — pasted verbatim above (11 entries).

### (b) Token sanity (buyer identity, read-only)

```
$ curl -s http://127.0.0.1:4000/api/support/token/me \
    -H 'x-support-token: gtk_sup_53qe9YK-roZt87lxMqk4X_atuIEhCrXOSse0bn5cEiQ'
{"ok":true,"buyer":{"id":"a33a5680-af8a-467e-9db6-cced4b76922e","name":"Admin"},"label":"test"}
```

The token resolves to buyer `a33a5680-af8a-467e-9db6-cced4b76922e` (name
`Admin`, label `test`).

### (c) Case list — titled cases visible at the API level (read-only)

```
$ curl -s "http://127.0.0.1:4000/api/support/cases" \
    -H 'x-support-token: gtk_sup_53qe9YK-roZt87lxMqk4X_atuIEhCrXOSse0bn5cEiQ' \
    | python3 -m json.tool | head -40
```

7 cases returned. Representative entries (ids truncated, subjects verbatim):

| id (truncated) | status | subject |
|---|---|---|
| `b759e2e0-fc6c` | collecting | `Our launch coupon WELCOME3M is not working It` |
| `6cdfac04-6b25` | collecting | `Our launch coupon WELCOME3M is not working It` |
| `0eedda00-6207` | collecting | `Our launch coupon WELCOME3M is not working I` |
| `ff8f148e-5203` | completed | `Support investigation surfaces log React warning: Invalid DOM propert` |

Titled cases are returned with their `subject` populated and pre-existing
untitled cases (`8b20d2d5-40ad`, `c85e2ee8-750a`) still carry `subject: null` —
the feature works at the API level and does not retroactively rename old cases.
(The `…It` / `…I` tails are the deterministic fallback derivation, capped at 48
chars at a word boundary — cosmetic, and the model-authored titles are preferred
whenever a marker is emitted.)

### (d) TITLE-marker never reaches the buyer (test evidence)

The leak suite, run with the repository's real test invocation (note: plain
`npx jest` cannot parse the ESM `tests/setupTests.js`; `npm test` uses
`node --experimental-vm-modules`):

```
$ node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand \
    tests/unit/caseConversation-title.test.js
PASS tests/unit/caseConversation-title.test.js
Tests:       13 passed, 13 total
```

Committed test names that pin the buyer-facing guarantee — all assert the
reply carries no `TITLE:` text:

- `answerClarification strips a leading TITLE line and emits no title on a non-armed turn`
- `extractTitleFromAnswer strips a glued TITLE: prefix (title and question on one line)`
- `extractTitleFromAnswer strips an overlong TITLE: first line glued with a question`
- `answerClarification never leaks a glued TITLE: prefix to the buyer's bubble`
- `answerClarification strips a bare TITLE: line and falls back to a derived title`
- integration, `tests/integration/support-case-api.test.js` —
  `names the case from the first client message, and only then`
  (`expect(first.body.reply.content).not.toContain("TITLE:")`, line ~476) and
  `takes the subject from the model's TITLE line on the first message`
  (same assertion, line ~522)

`grep -rn "TITLE:" server src shared tests` finds the marker only in
`caseConversationService.js` (the extraction/strip logic and the first-message
prompt rules), the two test files above, and unrelated `OPENROUTER_APP_TITLE` /
placeholder-title matches in `assistantService.js` / `requirementValidation.js`.
No shipped render path emits it.

**Not claimed:** anything about a live investigation run (see Live QA below).
`docs/contracts.md` is not committed to this repository — the contract of record is
the spec (`docs/superpowers/specs/2026-11-17-support-case-naming-and-activity-tree-design.md`,
commit `03acad4b`) and this rollout note. Code comments that reference
"contracts.md §4" point at a file that exists only outside this repo.

## Live QA

Performed live on 2026-11-17, buyer token against the running local stack
(backend `127.0.0.1:4000`, frontend `127.0.0.1:5173`). Fresh case **`b8aaf728`**
created by the token-validated buyer-flow (`/support` → Continue →
`/support/case/new` → Open an investigation); nothing posted to a
pre-existing case.

1. **First client message** (the WELCOME3M failure report): the header
   sub-line and the Case-reference card both render the derived title
   (`Our launch coupon WELCOME3M is not working It` — the 48-char word-boundary
   truncation of the first words; tail noted below). Recent cases also renders
   it. The assistant reply carries **no** `TITLE:` text.
2. **Fallback vs model title.** The model emitted a marker on an earlier
   fresh case today and the client shows the model-authored title would be
   preferred; this run's provider answered with the plain question instead
   (nudge path), so the visible title came from the deterministic fallback.
   Both paths are covered by tests.
3. **Investigation started** at 12:03:36Z. With the tree open, `support.case.activity`
   frames streamed live (lead `Searching code`; code role `Reading
   walletService.js`, `Reading walletController.js`, `Reading couponController.js`,
   `Reading adminActionService.js`, `Reading schema.prisma`) — see
   `qa-screenshots/support-activity-tree-live.png` and
   `qa-screenshots/support-activity-tree-streaming.png`.
4. **Persistence progress** at capture time (12:15Z): `lead` complete
   12:05:49, `code` complete 12:08:44, `repo` complete 12:11:03, `research`
   still running, `verify` queued.

**Not yet observed in this run:** the post-completion collapsed state
("How this was investigated · N steps"). At capture time **research has been
in `running` for ≈45 min with no further progress events** in the server log
— the same wedge pattern recorded in the earlier canary (the free model stops
making progress and the turn never settles). The live investigation will not
complete within this session's wall clock. The collapsed rendering and its
seeded reload path are unit/integration-tested (see
`tests/unit/frontend-support-activity-tree.test.js` and the
`useSupportCase` `"load:ok"` seeding test in
`tests/unit/frontend-support-case.test.js`), but nobody watched this specific
case collapse on screen — the limit is the free-model wall clock, not the
code path.

## Known limits (honest, not aspirational)

- **The first message can still get the canned question.** While the
  investigation/clarification runtime boots (~6–7 s window), the first client
  turn may receive the stock fallback question instead of an AI reply. It
  self-heals on the next turn; it is not a hang.
- **Persisted reload of the activity tree relies on `tool_log` rows from this
  build forward.** Rows written before this release carry no `kind`/`label`
  keys; they seed the collapsed tree as "Using \<tool>" (sanitized tool name)
  or are skipped. Historical investigations will not reconstruct their tree.
- **The SSE forwarder widens by exactly one event type** (`support.case.activity`).
  The other five case events are unchanged, and the client ignores event types
  it does not know.
- **Fallback titles can read awkwardly.** The 48-char word-boundary fallback
  on this run produced a tail like `…not working It` (cut inside "It…").
  Cosmetic; the model-authored title (when a marker is emitted) replaces it
  the first time it happens. Both paths are pinned by tests.
- **The activity tree does not render for collective intake** — that path runs
  no tools, so there is nothing to display.
- **No pricing, entitlement or environment changes.** `CASE_AI_TIMEOUT_MS` is
  unchanged (60 s). No new env vars; no migration; `tool_log` is extended
  additively (`Json?`), no schema column.

## Gate

The controller ran both commands on 2026-11-17, exit 0:

```
$ npm test
Tests:       13 skipped, 1164 passed, 1177 total

$ npm run build
(✓ 5033 modules transformed, files generated, precache 15 entries)
```
