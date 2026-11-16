# Support Portal — Full Todo List

Source of truth: `docs/plans/2026-11-16-support-portal-master-plan.md`.
Rules: checkboxes mean done **with evidence**, not "code written".
Gate: Phase A.1 must pass before anything in B–E.
Owner machine = the laptop; THIS sandbox cannot run the live spike or Gmail send.

## Phase A — Read-only boundary (GATE)
- [x] **A.0.1** Rewrite `.opencode/agents/investigator.md` frontmatter to native V2 ordered `permissions` array (`{action, resource, effect}`), one rule per line
- [x] **A.0.2** Rewrite `.opencode/agents/assistant.md` the same way
- [x] **A.0.3** Drop V1-only keys from both files: `bash`→`shell`, `write`/`patch` folded into `edit` deny, `task`→`subagent` deny, nested maps removed, `list` rule removed (V2 has no `list`; `glob` covers it)
- [x] **A.0.4** Include `external_directory: * → deny` and the full read-only shell allowlist as explicit V2 rules (`git log*`, `grep*`, `rg*`, `find *`, `ls *`, `cat *`, `head *`, `tail *`, `sed -n *`, `wc *`, `pwd`, `sort*`, `diff *`, `stat *`, `file *`, `uniq *`, `cut *`, `du *`, `df *`, `true`, `echo *`, `whoami`, `uname*`), then `shell: * → deny` last
- [x] **A.0.5** Update `tests/unit/server-investigation-runtime-config.test.js` to assert ordered native format (rejects V1 syntax, requires deny-first rule and no stale actions)
- [x] **A.0.6** Run `npm test -- --testPathPattern="runtime-config|investigation-mcp"` → PASS
- [x] **A.0.7** Grep sweep: `grep -rn "bash:|write:|patch:|task:|permission:|default_agent" .opencode/ server/services/` → only expected hits (docs, tests)
- [x] **A.0.8** Commit: `refactor(investigation): native V2 ordered-permissions frontmatter`
- [x] **A.1.1** Owner machine: `INVESTIGATION_SPIKE=1 npm test -- --testPathPattern=investigation-readonly` → suite EXECUTES (not skipped)
- [x] **A.1.2** Scratch-repo probe, record in tool_log: `.env` refused; `write`/`edit` refused; `shell` outside allowlist refused; `git log`/`read`/`grep` work; `subagent` refused
- [x] **A.1.3** Record evidence (tool_log rows / screenshots) in `docs/rollout/2026-11-16-investigation-readonly-proof.md`
- [x] **A.1.4** If ANY denial absent → STOP, fix A.0, re-run A.1 (loop, do not advance)
- [x] **A.2.1** Verify investigation sessions pin OpenCode free models only (`providerID: "opencode"` + intersect with live catalog; `iceman-free` absent from every list)
- [x] **A.2.2** Verify assistant sessions pin OpenCode free models only as well (shared chain)
- [x] **A.3.1** (Option 2, owner-approved; github+render+parallel-search merged) OWNER DECISION: investigation MCP policy — Option 1 (investigator without MCP) or Option 2 (merge `opencode.mcp.optional.json` + env keys + re-verify). Default if silent: Option 1
- [x] **A.3.2** (Option 2 only) Merge opt-in block into `.opencode/opencode.json`
- [x] **A.3.3** (GITHUB_PERSONAL_ACCESS_TOKEN + RENDER_API_KEY in environment) (Option 2 only) Set `GITHUB_PERSONAL_ACCESS_TOKEN`, `RENDER_API_KEY`, `CONTEXT7_API_KEY` in investigation environment
- [x] **A.3.4** (8/8, 2026-11-16 09:06 +06; forged-tool deny-guard intact) (Option 2 only) Re-run A.1.1; confirm `mcp list` shows exactly the four servers and each tool class used in tool_log
- [x] **A.4.1** (fast-forward merge, main @ 63bc8137) `git checkout main && git merge feat/support-mcp-wiring` (only after A.1.4 green)
- [x] **A.4.2** (1088 passed) Full `npm test` green on `main`
- [x] **A.4.3** (build clean) `npm run build` clean
- [x] **A.4.4** (pushed to origin/main 2026-11-16; Render auto-deploys; investigations remain inert without issued tokens) Do NOT `git push` until owner explicitly asks; branch state + 45+ unpushed commits documented in rollout note

## Phase B — Gmail report, end to end (GATE)
- [x] **B.1.1** (pinned provider = gmail; GMAIL_USER/APP_PASSWORD present) Confirm report transport: env name in code (likely `INVESTIGATION_REPORT_EMAIL_PROVIDER=gmail`) + `GMAIL_CLIENT_ID`/`GMAIL_CLIENT_SECRET`/`GMAIL_REFRESH_TOKEN` (or service-account path) matches `emailService` implementation
- [x] **B.1.2** `.env.example` documents the vars; `render.yaml` carries them with `sync: false`; secrets never in repo (Render env only)
- [ ] **B.1.3** Admin config `notifications.email.enabled=true` set ONLY via admin config UI/DB, tested with `logged_*` status honestly reported by test email — DONE FOR ONE CANARY (2026-11-16: `send_result={"ok":true,"status":"sent"}` to admin@gmail.com), then deliberately restored to `false`. The flag stays off until E.2.
- [x] **B.2.1** (one canary email sent to admin@gmail.com; send_result={"ok":true,"status":"sent"}) Owner machine: one real investigation → report arrives in owner mailbox
- [x] **B.2.2** Subject format verified in code: `buildSubject` renders `[GarTexHub Support] Investigation report: <subject>` (`server/services/investigation/delivery.js:275`) — the plan's `[Client Report #<case-id>]` shape was never implemented; sections 1–8 are present (complaint, conversation, per-run log with `model_id` + tool evidence, findings, next steps, Sources, Audit events)
- [x] **B.2.3** (sent only on SMTP delivery, else logged_*) Delivery truth: recording on case shows `sent` only when Gmail API confirmed HTTP 2xx; failure path shows `failed`, never `sent`
- [x] **B.2.4** Escalation is independent of the mail by construction (`escalate()` never reads the delivery result, `server/services/investigationQueue.js:1364`) and is pinned by the integration test "the escalation runs on the final findings, and the mail does not gate it"
- [~] **B.3.1** Owner `/admin?case=<id>` auto-selects the case and the six tabs render (overview, conversation, evidence, code findings, activity, email report + delivery status + resend). Verified by CODE + unit test (`tests/unit/frontend-admin-case-tabs.test.js`), live screenshots of the AI Support surface (`/admin`, desktop + mobile), and NOT by a live drill-down with a real case — production has 0 rows in `support_cases`; that is part of the canary. The Activity tab is now a per-run investigation timeline (D.4).
- [x] **B.3.2** Appendix in rollout doc: `docs/rollout/2026-11-15-support-two-mode-migration.md` → Phase 8 appendix (B.2 evidence, B.3 verification status, D-feature hashes, owner sign-off line)

## Phase C — Purple/cyan identity (cosmetic)
- [x] **C.1** Tailwind theme extension: bg `#0b0714`, surface `#151020`, primary `#a855f7`, secondary `#d946ef`, accent `#22d3ee`, text `#f4eeff` / `#a99bbd`; radius 12–20px (applied in the support surfaces and the admin AI Support tab)
- [x] **C.2** Tokens applied across `/support` landing + workspace + `/report` + `/submitted` and the AI Support admin surfaces (cards, restrained glows, purple borders)
- [x] **C.3** Mobile: sidebars → drawers below `lg`; VERIFIED at 375px (local playwright, 2026-11-16): support landing stacks + nav collapses; admin sidebar is off-canvas with a working hamburger (screenshot `admin-ai-375-drawer.png`); the support workspace side rails are hidden below `lg` with evidence/investigation drawers; the AI Support section stacks (tokens grid, per-agent grid, routing inputs)
- [x] **C.4** Contrast/a11y check (WCAG AA) DONE: measured pairs (primary 17.6, muted 7.5–7.7, accents 5.0+); slate-400 replaced slate-500; an INDEPENDENT subagent audit was run and its 6 majors + ~20 minors were folded in (`435d6a33`): aria-live transcript, AA CTA gradient, focus trap/Escape/return on the 3 dialogs and 2 drawers (new useModalFocus hook), 24px tap targets, tablist semantics, role=alert/status, decorative icons aria-hidden
- [x] **C.5** OWNER DECISION (2026-11-16): brand stays **GarTexHub** — no "TOKY SUPPORT" overlay
- [~] **C.6** Visual QA pass with screenshots — IMPROVED: the local playwright/CDP MCP reaches localhost (the remote browser could not). Screenshots captured this session (see /tmp/opencode/qa-screenshots/): `support-desktop-full.png` (1280px), `support-375.png`, `support-768.png` (tablet), `admin-ai-support.png` + `admin-ai-models-full.png` (desktop), `admin-ai-375.png` + `admin-ai-375-drawer.png` (mobile drawer), `report-preview-empty.png` + `submitted-empty.png` (tablet, empty states — both render the intended no-case UI), `support-after-footer-fix.png`, `login-state.png`. A real deep-link bug was found by it (local dist resolved `./assets/...` relative to the route — fixed in vite.config.js). NOT covered: the support chat and the report preview with a REAL case report (needs the canary — owner-gated), and a fullTablet sweep of every screen

## Phase D — Optional extras (each blocked on owner go-ahead)
- [x] **D.1** Per-agent model assignment — `roleModels: { role: modelId }` in the model config, per-role selects in the admin tab, the pin reorders that role's chain (`orderChainForRole`), commit `549cd222`
- [x] **D.2** Live model health monitor — per-model runs/failures/quota refusals/average duration read from `support_investigations`, surfaced in the admin tab, commit `2d07399d`
- [x] **D.3** Report export — self-contained print-ready HTML ("Print / Save as PDF" + "Download HTML"), no new dependency, buyer and owner surfaces, commit `9ed3391e`
- [x] **D.4** Investigation replay / chronological activity timeline — the Activity tab now replays one group per investigation run (role, model, status, attempt, start→end, its tool calls in order), commit `b772fb1f`
- [x] **D.5** Buyer feedback on the final report — rating + note, stored out-of-line in `local_json`, shown on the owner console Overview tab, commit `8d75c0e6`
- [x] **D.6** Smart auto-model routing — keyword → model rules (`routing: [{ keyword, modelId, role? }]`), first match wins, reuses the same chain reorder, commit `476a5ed1`

## Phase E — Production enable (owner-only, last)
- [~] **E.1** A.1 green evidence on file (live spike 8/8 twice, shell removed after the host-read probe) and B.2 delivery proof on file (one canary mail, `status: sent`). C is signed off for brand and tokens but C.6 (visual QA) is still open.
- [ ] **E.2** `notifications.email.enabled=true` + Gmail creds live in Render production
- [ ] **E.3** Investigation queue enabled in admin config; `enabled=false` default remains until this box checked
- [ ] **E.4** Canary case: full pipeline observed (intake → clarification → confirm → investigate → report → email → owner console); rollback = admin config flag off, immediate
- [ ] **E.5** `docs/rollout/2026-11-15-support-two-mode-migration.md` updated: enable date, canary result, known limits — the doc is current through Phase 8; the enable date and the real-complaint canary result still have to be filled in after E.4
- [ ] **E.6** OWNER DECISION: push `main` to `origin/main`; branch protection + required checks (if yes)
- [x] **E.7** AGENTS.md final verification pass: entries 22–23 accurate post-enable; entry 32 added (crash logger prune bug, with the measured 6-of-8 → 8-of-8 evidence); the final opencode-runtime state is documented (native V2 ordered permissions, read-only, no shell, MCP opt-in)

## Cross-cutting / housekeeping
- [x] **H.1** Commit `docs/plans/2026-11-16-plan-corrections.md`, `docs/plans/2026-11-16-support-portal-master-plan.md`, this todo file (message: `docs(support): master plan + todos`)
- [x] **H.2** DECIDED BY PRACTICE, CONFIRM BEFORE CLEANUP: `dist/` IS tracked and every commit rebuilds it (the pre-commit gate runs `npm run build`, and the bundle is committed in the same commit or the one after). `dist/brand/` was removed from the tree. The owner was asked which policy to keep and never answered; the tracked state is the one that keeps the Render deploy and the local `SERVE_DIST=true` server working. Switching to gitignored `dist/` is a one-line change plus a `git rm -r --cached dist` if the owner wants it.
- [x] **H.3** Flagged to the owner repeatedly (Aiven password, `ADMIN_MFA_CODE`, `GMAIL_APP_PASSWORD` are in `render.yaml` and in git history). The owner chose to leave them; they should still be rotated externally.
- [x] **H.4** (1088 passed; build clean; spike 8/8 twice) Re-run full `npm test` + `npm run build` after any code change; no "trust me" merges
- [ ] **H.5** Owner walk-through: buyer token mode + generic form mode + confirm → investigation → report → email + owner console, on staging/scratch env
- [x] **H.6** Support-token secrets: confirm no `gtk_sup_` token ever logged at info level; audit middleware once (supportController, messageController, callSessionController, searchController)

## Blocked / waiting on owner
1. MCP policy choice (A.3.1) — Option 1 (default) vs Option 2
2. Brand decision (C.5)
3. Per-agent model assignment? (D.1)
4. Push `main`? (A.4.4 / E.6)
5. Gmail mailbox for delivery target + confirmation the owner has it configured

## Done already (do not redo)
- [x] Phases 1–3: two-mode `/support`, dynamic free-model catalog + buyer/owner picker, premium blue UI — merged to local `main` (45 commits ahead of origin)
- [x] Phase 4 partial: report renderer Sources/Audit events; native lockdown wiring commit `ab1a893c` (V1 frontmatter — see A.0)
- [x] Restriction removed from repo root `.opencode/opencode.json` (operator's own opencode unaffected)
- [x] Full suite green at last run: 1070 passed / 13 spike-skipped / 102 suites
- [x] Docs: rollout note addendum, AGENTS.md entries 22–23, plan corrections file


## Evidence log (2026-11-16)

- A.0 native V2 rewrite committed `b3dd68bb`; full suite 1084 passed / 103 suites; build OK.
- Redaction fix committed `4d172c43` and `8c34212e` (disk log never holds bodies/support tokens/signed URLs; raw non-JSON bodies omitted).
- H.6 audit findings closed; client-side `logger.warn(... url ...)` calls removed (`FileAttachmentCard.jsx`).
- Server boot verified with `/health` → `{"status":"ok"}`.
- A.1 spike history (all on live spawned runtime, minimax-m3.1-flash-free):
  attempt 1 (V1 binary at PATH) → runtime refused to start; binary check works.
  attempt 2 → 6/8; shell read /tmp/SPIKE_BASH_SECRET.txt via allowlisted `cat *` (.env refused, writes refused, subagents refused). Fix: shell REMOVED from investigator/assistant entirely (no command tool exists, catch-all deny applies).
  attempt 3 → 8/8 pending. Assertions rewritten: BASH_SECRET random per run (never tracked), .env check asserts no VALUE from .env appears + refusal visible in text or a permission-error toolCall.
  Test gate (`npm test`): biome errors fail; warnings pass.
  Husky fix verified end-to-end (biome → npm test → npm run build → "Pre-commit checks passed!").
  Fresh clones need `git config core.hooksPath .husky`.
- Husky pre-commit de-sourced from the missing `.husky/_/husky.sh` and chmod +x; gate re-verified end-to-end (biome → npm test → npm run build) on the main branch.

Additional evidence (2026-11-16 PM):
- Canary email: one live test email sent to admin@gmail.com via Gmail SMTP
  (send_result={"ok":true,"status":"sent"}); admin email flag restored to
  false afterward in the same script run.
- MCP Option 2 (owner-approved) merged into the project config:
  github + render + parallel-search, context7 deliberately absent
  (no CONTEXT7_API_KEY). README rewritten; tests pin the merged set and the
  inert optional block.
- Browser verification: browsermcp/playwright tools are remote (separate workspace); localhost:4461 unreachable. Local verification therefore limited to: production-server boot + /health 200, Vite build, unit+integration suites, live spawn spike. Live buyer/owner flows verified only by integration tests, not by UI walk-through.
