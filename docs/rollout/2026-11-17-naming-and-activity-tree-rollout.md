# Support — case naming and AI activity tree rollout

**Date:** 2026-11-17
**Base:** `114361cc` (implementation plan) → **HEAD:** `db271263`
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
db271263 fix(support): close final-review findings — marker line≥2 strip, collapse-by-default, seed merge, tool_log projection scrub
11a165db docs(support): record the live run's research wedge for the collapsed-state limit
b4f94c21 docs(support): rollout notes and QA evidence for naming + activity tree
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

Fourteen commits, counted from the actual range.

## Verification

### (a) Commit range

`git log --oneline 114361cc..HEAD` — pasted verbatim above (14 entries).

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

Buyer sees their titled cases. Representative entries (ids truncated, subjects verbatim):

| id (truncated) | status | subject |
|---|---|---|
| `b759e2e0-fc6c` | collecting | `Our launch coupon WELCOME3M is not working It` |
| `6cdfac04-6b25` | collecting | `Our launch coupon WELCOME3M is not working It` |
| `0eedda00-6207` | collecting | `Our launch coupon WELCOME3M is not working I` |
| `ff8f148e-5203` | completed | `Support investigation surfaces log React warning: Invalid DOM propert` |

Pre-existing untitled cases (`8b20d2d5-40ad`, `c85e2ee8-750a`) still carry
`subject: null` — the feature works at the API level and does not
retroactively rename old cases. (The `…It` / `…I` tails are the deterministic
fallback derivation, capped at 48 chars at a word boundary — cosmetic; the
model-authored titles are preferred whenever a marker is emitted.)

### (d) TITLE-marker never reaches the buyer (test evidence)

```
$ node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand \
    tests/unit/caseConversation-title.test.js
PASS tests/unit/caseConversation-title.test.js
Tests:       13 passed, 13 total
```

(Committed test names that pin the buyer-facing guarantee — all assert the
reply carries no `TITLE:` text — remain in `tests/unit/caseConversation-title.test.js`
and `tests/integration/support-case-api.test.js`. The post-review-fix run is
suite-wide green: see Gate.)

`grep -rn "TITLE:" server src shared tests` finds the marker only in the
strip/extraction logic and the two test files, never in a shipped render path.

`docs/contracts.md` is **not committed** to this repository — the contract of
record is the spec (`docs/superpowers/specs/2026-11-17-support-case-naming-and-activity-tree-design.md`,
commit `03acad4b`) and this rollout note. Code comments that reference
"contracts.md §4" point at a file that exists only outside this repo.

## Live QA

Performed live on 2026-11-17, buyer token against the running local stack
(backend `127.0.0.1:4000`, frontend `127.0.0.1:5173`). Fresh case **`b8aaf728`**
was created by the token-validated buyer flow and received the WELCOME3M
report; the assistant reply carried **no** `TITLE:` text. The header
sub-line, the Case-reference card and the Recent-cases list all rendered the
derived title live.

With the tree open, `support.case.activity` frames streamed live on that
case (lead `Searching code`; code role `Reading walletService.js`,
`Reading walletController.js`, `Reading couponController.js`,
`Reading adminActionService.js`, `Reading schema.prisma`) — see
`qa-screenshots/support-activity-tree-live.png` and
`qa-screenshots/support-activity-tree-streaming.png`.

**Persistence progress at capture time (12:15Z):** `lead` complete 12:05:49;
`code` complete 12:08:44; `repo` complete 12:11:03; `research` still running;
`verify` queued.

**Research is wedged for this live case.** The `research` role has been in
`running` for over an hour with no further progress events in the server
log — the same free-model stall pattern as the earlier canary. The
investigation will not reach completion on this run. The collapsed-state
client behaviour was therefore proven on a **completed case** instead:

### Collapsed-state evidence (completed case `ff8f148e`)

Case `ff8f148e-5203-4fca-abe1-ba37abd88b54` (the canary investigation on the
React-class-prop warning, status `completed`) was opened in the browser via
the buyer-token SPA flow. The investigation's persisted `tool_log` rows
(lead 16 + code 23 + repo 21 + research 49 + verify 21 = **130 entries**)
seed the tree on reload:

- **Collapsed by default** on completion status (`useState(() => …)` from the
  final-review fix): initially renders `aria-expanded="false"`,
  `<ol>` unmounted (0 rows in the DOM).
- **Heading:** `✓ How this was investigated · 130 steps · 697s`
- **Toggle expands:** after a click, `aria-expanded="true"`, all 130 rows
  render `|_ Using …` (old `tool_log` rows carry no `kind`/`label`, so they
  fall back to the honest `Using <tool>` form) — see
  `qa-screenshots/support-activity-tree-expanded.png`.
- Right rail shows all six stages `DONE`.

This exercises the full path the spec requires: investigation → persisted
`tool_log` → `investigations` projection → `load:ok` seed → merged/capped
render → collapsed default.

## Known limits (honest, not aspirational)

- **The first message can still get the canned question.** While the
  investigation runtime boots (~6–7 s window), the first client turn may
  receive the stock fallback question instead of an AI reply. It self-heals
  on the next turn; it is not a hang.
- **Persisted reload of the tree relies on `tool_log` rows from this build
  forward.** Rows written before this release carry no `kind`/`label` keys;
  they seed as `Using <tool>` (sanitized tool name). Historical
  investigations will render with fallback labels, not basename-only labels.
- **The SSE forwarder widens by exactly one event type**
  (`support.case.activity`). The other five case events are unchanged, and
  the client ignores event types it does not know.
- **No pricing, entitlement or environment changes.** `CASE_AI_TIMEOUT_MS` is
  unchanged (60 s). No new env vars; no migration; `tool_log` is extended
  additively (`Json?`), no schema column.
- **Old investigations seed with `Using <tool>` labels, not basename labels.**
  The canary's rows are from before the `activityLabelFor` persistence was
  wired; rows from this build onward carry `kind`/`label`.
- **This live run's investigation stalled in `research`** (free-model wall
  clock, not the code). The full collapsed behaviour is proven on the
  completed canary case instead.

## Gate

The controller ran both commands after the final-review fix, exit 0:

```
$ npm test
Tests:       13 skipped, 1169 passed, 1182 total

$ npm run build
(✓ 5033 modules transformed, files generated, precache 15 entries)
```
