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
- [ ] **A.1.1** Owner machine: `INVESTIGATION_SPIKE=1 npm test -- --testPathPattern=investigation-readonly` → suite EXECUTES (not skipped)
- [ ] **A.1.2** Scratch-repo probe, record in tool_log: `.env` refused; `write`/`edit` refused; `shell` outside allowlist refused; `git log`/`read`/`grep` work; `subagent` refused
- [ ] **A.1.3** Record evidence (tool_log rows / screenshots) in `docs/rollout/2026-11-16-investigation-readonly-proof.md`
- [ ] **A.1.4** If ANY denial absent → STOP, fix A.0, re-run A.1 (loop, do not advance)
- [ ] **A.2.1** Verify investigation sessions pin OpenCode free models only (`providerID: "opencode"` + intersect with live catalog; `iceman-free` absent from every list)
- [ ] **A.2.2** Verify assistant sessions pin OpenCode free models only as well (shared chain)
- [ ] **A.3.1** OWNER DECISION: investigation MCP policy — Option 1 (investigator without MCP) or Option 2 (merge `opencode.mcp.optional.json` + env keys + re-verify). Default if silent: Option 1
- [ ] **A.3.2** (Option 2 only) Merge opt-in block into `.opencode/opencode.json`
- [ ] **A.3.3** (Option 2 only) Set `GITHUB_PERSONAL_ACCESS_TOKEN`, `RENDER_API_KEY`, `CONTEXT7_API_KEY` in investigation environment
- [ ] **A.3.4** (Option 2 only) Re-run A.1.1; confirm `mcp list` shows exactly the four servers and each tool class used in tool_log
- [ ] **A.4.1** `git checkout main && git merge feat/support-mcp-wiring` (only after A.1.4 green)
- [ ] **A.4.2** Full `npm test` green on `main`
- [ ] **A.4.3** `npm run build` clean
- [ ] **A.4.4** Do NOT `git push` until owner explicitly asks; branch state + 45+ unpushed commits documented in rollout note

## Phase B — Gmail report, end to end (GATE)
- [ ] **B.1.1** Confirm report transport: env name in code (likely `INVESTIGATION_REPORT_EMAIL_PROVIDER=gmail`) + `GMAIL_CLIENT_ID`/`GMAIL_CLIENT_SECRET`/`GMAIL_REFRESH_TOKEN` (or service-account path) matches `emailService` implementation
- [ ] **B.1.2** `.env.example` documents the vars; `render.yaml` carries them with `sync: false`; secrets never in repo (Render env only)
- [ ] **B.1.3** Admin config `notifications.email.enabled=true` set ONLY via admin config UI/DB, tested with `logged_*` status honestly reported by test email
- [ ] **B.2.1** Owner machine: one real investigation → report arrives in owner mailbox
- [ ] **B.2.2** Verify subject format `[Client Report #<case-id>]`, sections 1–8 present (complaint, conversation, per-run log with `model_id` + tool evidence, findings, next steps, Sources, Audit events)
- [ ] **B.2.3** Delivery truth: recording on case shows `sent` only when Gmail API confirmed HTTP 2xx; failure path shows `failed`, never `sent`
- [ ] **B.2.4** Verify escalation independent of email (confirmed data-loss escalates even if email fails)
- [ ] **B.3.1** Owner `/owner?case=<id>` auto-selects the case; tabs show: overview, conversation, evidence, code findings, research, activity log, email report + delivery status + retry
- [ ] **B.3.2** Appendix in rollout doc: B.2 evidence + owner sign-off line

## Phase C — Purple/cyan identity (cosmetic)
- [ ] **C.1** Tailwind theme extension: bg `#0b0714`, surface `#151020`, primary `#a855f7`, secondary `#d946ef`, accent `#22d3ee`, text `#f4eeff` / `#a99bbd`; radius 12–20px; no per-component one-off colors
- [ ] **C.2** Apply tokens across `/support` landing + workspace + `/report` + `/submitted` + owner console restyle surfaces (cards, glows restrained, purple borders)
- [ ] **C.3** Mobile: sidebars → drawers below `lg`; verified 375px + tablet
- [ ] **C.4** Contrast/a11y check (WCAG AA): primary text on new surfaces; focus rings visible
- [ ] **C.5** OWNER DECISION: brand = GarTexHub Support Center (default) vs "TOKY SUPPORT"; apply or document rejection
- [ ] **C.6** Visual QA pass with screenshots (browsermcp) for all six client screens + owner inbox; note regressions

## Phase D — Optional extras (each blocked on owner go-ahead)
- [ ] **D.1** Per-agent model assignment: config schema + admin Model Management tab + per-role override + tests
- [ ] **D.2** Live model health monitor: catalog availability + per-model failure/quota counters + latency surfaced in admin
- [ ] **D.3** Report export: PDF (or print-optimized HTML) alongside email
- [ ] **D.4** Investigation replay / chronological activity timeline in owner console
- [ ] **D.5** Buyer feedback on final report (rating + correction) → stored on case
- [ ] **D.6** Smart auto-model routing (task-type → model) — only after Phase A+B stable; separate spec required

## Phase E — Production enable (owner-only, last)
- [ ] **E.1** Preconditions met: A.1 green evidence on file, B.2 delivery proof on file, C signed off
- [ ] **E.2** `notifications.email.enabled=true` + Gmail creds live in Render production
- [ ] **E.3** Investigation queue enabled in admin config; `enabled=false` default remains until this box checked
- [ ] **E.4** Canary case: full pipeline observed (intake → clarification → confirm → investigate → report → email → owner console); rollback = admin config flag off, immediate
- [ ] **E.5** `docs/rollout/2026-11-15-support-two-mode-migration.md` updated: enable date, canary result, known limits
- [ ] **E.6** OWNER DECISION: push `main` to `origin/main`; branch protection + required checks (if yes)
- [ ] **E.7** AGENTS.md final verification pass: entries 22–23 accurate post-enable; note final opencode-runtime state for future maintainers

## Cross-cutting / housekeeping
- [x] **H.1** Commit `docs/plans/2026-11-16-plan-corrections.md`, `docs/plans/2026-11-16-support-portal-master-plan.md`, this todo file (message: `docs(support): master plan + todos`)
- [ ] **H.2** Decide `dist/assets/*` + `dist/brand/` (untracked build artifacts): either gitignore or owner cleans; never commit
- [ ] **H.3** `render.yaml` plaintext production secrets flagged to owner (history); new keys always `sync: false`
- [ ] **H.4** Re-run full `npm test` + `npm run build` after any code change; no "trust me" merges
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
- A.1 spike: harness-backgrounded; earlier attempts invalid (OpenCode resolves `./node_modules/.bin/opencode` V1 under npm test — must set `OPENCODE_BIN=/home/ccm/.opencode/bin/opencode` (v2.3.0)). Result pending.
- Husky pre-commit de-sourced from the missing `.husky/_/husky.sh` and chmod +x; gate re-verified end-to-end (biome → npm test → npm run build) on the main branch.
