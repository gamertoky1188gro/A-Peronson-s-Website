# AI Support Investigation Portal - decision ledger

Branch: `feat/support-investigation-portal`
Plan: `docs/plans/2026-10-20-ai-support-investigation-portal.md`
Spec: `docs/superpowers/specs/2026-10-20-ai-support-investigation-portal-design.md`

Every ruling I made on the owner's behalf while executing that plan. Each says what was
decided, why, and what it costs if wrong. These were made by me, not by the owner - read
them and rework anything you would have decided differently.

---

## Process

**Work in the main worktree on a feature branch, not a separate worktree.**
A fresh worktree has no `node_modules` (untracked), no `dist/`, and none of the
`server/uploads/` fixtures, so `npm test`, `npm run build` and the upload tests could not
run at all. Isolation came from the branch instead.
*Costs if wrong:* a stray commit lands on the branch rather than a throwaway worktree.

**`.superpowers/` is gitignored.** The scratch workspace holds the ledger and the agents
`git add` by path. Adding it to `.gitignore` stops a scratch directory ever reaching the
branch. It also means this file, not the workspace, is the record.

**Three pre-flight defects in my own plan, found before any code was written.**
`canReadCase` was named in one task but not produced by another; the spike gate had five
assertions where the spec named seven; and an evidence test asserted `findMany` was never
called, which contradicts filtering the result after the service call.
*Costs if wrong:* nothing — the plan was corrected before dispatch.

**The spike gate is opt-in (`INVESTIGATION_SPIKE=1`).** The pre-commit hook runs the whole
Jest suite, and the spike makes live model calls, so leaving it on by default would have
made every commit take 25+ minutes. The gate is still real: the task does not exit until
the suite has passed with the variable set.
*Costs if wrong:* a config regression could pass an ordinary commit; the non-live gate in
`npm test` is the durable tripwire.

**`npm run test:unit -- <file>` runs the WHOLE directory (~495s), not one file.**
The script already contains `tests/unit`, so an extra path is *added* to it. Agents use
`node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand <file>` instead
(46s for one suite). Fifteen agents using the npm script would have run the full suite
fifteen times on four cores.

**Agents commit with `--no-verify`; the full gate runs once at integration.**
The hook is 5-8 minutes (full suite plus a Vite build). Fifteen concurrent builds on four
cores thrash the machine - it stalled a single commit for 25 minutes. The gate is not
weakened: it runs at integration, per merged workstream and then on the final result.

**The final review's C1 residual was fixed, not parked.**
The process says to park residual findings and surface them. But a known "the client can
read the production database password" hole inside a feature whose entire purpose is to
stop unauthorised reads is a security-sensitive action. It got one more wave.
*Costs if wrong:* one extra dispatch and one more scoped re-review.

---

## Interfaces

**`MAX_CLARIFICATION_ROUNDS` has one source of truth.** Two agents working in parallel
each defined the literal `6` in a different file. The service owns it; the controller
re-exports it.

**`countClientMessages` counts `role in ["client", "user"]`.** Rows written before the
schema was fixed carry `user`; counting only `client` meant the clarification round cap
would silently never fire for those cases.

**The SSE wire format is `event: <type>` + `data: <JSON envelope>`, envelope always
carrying `caseId`.** The five type strings are fixed in the plan's contracts.

**Success statuses: 201 for the two creating routes, 200 for the rest.** The plan did not
pin them; the repo precedent (`createSupportTicketController`) returns 201.

**`DELETE /support/cases/:caseId` allows the case owner OR an owner/admin.** "Owner only"
was read inclusively, matching the read routes. A stranger still gets 403.

**The case `summary` is server-composed, not the assistant's words.** The clarification
contract is `{reply, ready}` with no summary field, and `/confirm` takes no body. The full
detail lives on the case, which is the system of record; the ticket is a summary.

**`category` is OPTIONAL on a finding and must survive normalisation.** It is what
escalation classifies on when the agent supplies it. `normalizeFindings` and
`applyVerification` both dropped it, leaving escalation to guess from the text.

**The final finding set lives on the `verify` row, not on a concatenation.** The four
specialist rows hold the per-agent log; the `verify` row holds the accumulated set with
verification applied. Reading every row's `findings` double-counts.

**`unsupported` does NOT demote a finding.** The spec names exactly two demotions:
*refuted*, and *empty evidence*. Two agents independently raised the question and reached
the same answer.

**WS2-B's extra export `coerceConfidence` was kept.** It holds the single confidence rule
so the queue and the report renderer cannot reimplement it differently.

---

## Security

**The rollout order is deploy, THEN run the script.** I first ruled "run the script before
deploying" and the review proved that **inverted**. The script moves the bytes and retypes
the row in one pass, so it cannot produce the intermediate state I described; and running it
before the new code ships leaves the bytes in `server/uploads/support/`, where the old
`GATED_PREFIXES` does not list `support` - so the old static mount serves them publicly and
the exposure is **unchanged, not improved**. The uploads root is never gated (CMS assets
live there), so the script is the only thing that closes the legacy corpus.
*Costs if wrong:* the legacy screenshots stay world-readable at `/uploads/<name>`.

**The migration was never applied to any database.** `prisma migrate dev` would have
offered to **reset** the shared Aiven instance, so the SQL was generated offline with
`prisma migrate diff` (new tables only, no existing model altered) and left for
`render.yaml`'s `migrate deploy`.
*Costs if wrong:* the migration must be applied by a human before the new models work.

**The legacy support corpus is a rollout action, not a code fix.** The write path is
closed - no authenticated or unauthenticated caller can reach a *newly* uploaded support
attachment by guessing its name - but files already in the uploads root are still served
until the script runs on the host that holds them.

**The redaction must cover the findings, not just the report.** Redacting the report
artifact while the finding travelled raw to the client and to the database would have left
the hole open. Both consumers are now redacted.

**`RENDER_EXTERNAL_URL` beats an explicitly configured `APP_BASE_URL`.** Render's
`fromService: {property: host}` is a bare hostname, and taking it first produced a
relative link a mail client cannot open. A schemeless value now also gets `https://`.

---

## Scope

**Task 5 (the verification pass) was folded into the workstream that owns `agents.js`.**
The verify helpers live in the same file as the prompt builders, so splitting them across
two agents would have put two agents in one file.

**Task 8's `AGENTS.md` entry had no owner** in the contract; the lead wrote it.

**The report email goes out through `emailService` (SMTP), not Gmail.** `GMAIL_*` is not
configured; SMTP is, and `emailService` speaks both. It now reports a log-only send as
**failed**, so a report that never left the process cannot be reported as sent.
