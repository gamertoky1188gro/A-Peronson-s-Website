# Commit 0899 — b7001fe
| Field | Value |
|-------|-------|
| **Commit Number** | 0899 |
| **Commit Hash** | b7001fe665c965bf3c0a961774f57a2520898b67 |
| **Parent Hash** | b08481cb1a5390ec201989ce95f9ee2e5c024d3c |
| **Author** | Cyber Code Master |
| **Date/Time** | 2026-11-03 20:39:53 |
| **Files Changed** | 242 |
| **Additions** | 18599 |
| **Deletions** | 308 |
| **Net Change** | +18599/-308 |
| **Merge Commit** | Yes |

## Merge PR #102 — Client Feedback Branch

Merge commit bringing `arafat-mahmud/fix/client-feedback-2026-11-03` (11 commits) onto main. Content-wise this includes the client-feedback fixes: documentation backfill (0895), lint zeroing (0896), the ai_early_exit restore (0897) and the PR #101 verification note (0898), plus the earlier client-feedback work already on main.

Original commit message: “Merge pull request #102 from arafat-mahmud/fix/client-feedback-2026-11-03”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `docs/developer/database-reference.md` | Added | 1870 | 0 | +1870/-0 |
| `docs/developer/api-reference.md` | Added | 841 | 0 | +841/-0 |
| `history/index.md` | Modified | 268 | 93 | +268/-93 |
| `scripts/docs/generate-reference.mjs` | Added | 308 | 0 | +308/-0 |
| `shared/assistant/faqEngine.js` | Modified | 255 | 31 | +255/-31 |
| `src/pages/auth/ForgotPassword.jsx` | Added | 270 | 0 | +270/-0 |
| `docs/developer/env-reference.md` | Added | 222 | 0 | +222/-0 |
| `tests/unit/server-sessions-password-reset.test.js` | Added | 185 | 0 | +185/-0 |
| `tests/unit/server-authz-guards.test.js` | Added | 167 | 0 | +167/-0 |
| `server/services/passwordResetService.js` | Added | 161 | 0 | +161/-0 |
| `server/services/sessionService.js` | Added | 143 | 0 | +143/-0 |
| `tests/e2e/critical-workflows.spec.ts` | Added | 142 | 0 | +142/-0 |
| `history/0885_2026-11-03_13-15-48_1879ed8_fix-the-client-s-02-11-requests-harden-auth-add-crash-recovery.md` | Added | 124 | 0 | +124/-0 |
| `history/0739_2026-10-05_23-04-52_ed577cb_build-the-hypercache-offline-twin-and-fix-the-pwa-manifest.md` | Added | 123 | 0 | +123/-0 |
| `history/0781_2026-10-10_21-58-56_834ae4d_add-neon-lab-test-reporting-and-reorganise-tests.md` | Added | 120 | 0 | +120/-0 |
| `history/0881_2026-10-25_21-07-34_cb3ff7e_rebuild-dist-normalise-line-endings-and-return-render-to-the-free-plan.md` | Added | 120 | 0 | +120/-0 |
| `history/0733_2026-10-03_18-01-58_285a654_apply-buyer-final-directives-to-settings-owner-console-and-boosts.md` | Added | 119 | 0 | +119/-0 |
| `history/0749_2026-10-07_23-58-30_0f5eed5_generate-a-12-theme-runtime-palette-system.md` | Added | 119 | 0 | +119/-0 |
| `history/0748_2026-10-06_21-01-26_26d8d84_consolidate-the-ui-on-one-deep-sky-blue-token-palette.md` | Added | 118 | 0 | +118/-0 |
| `history/0884_2026-11-02_23-26-44_eed7e82_add-more-client-conversation-archives.md` | Added | 116 | 0 | +116/-0 |
| `history/0861_2026-10-21_05-18-49_cee57f2_redact-secrets-from-investigation-reports.md` | Added | 108 | 0 | +108/-0 |
| `history/0894_2026-11-03_19-47-00_b2287e8_rebuild-the-user-and-developer-documentation.md` | Added | 100 | 0 | +100/-0 |
| `scripts/perf/serve-dist.mjs` | Added | 98 | 0 | +98/-0 |
| `history/0834_2026-10-21_00-13-26_f36444e_persist-support-cases-and-keep-their-evidence-private.md` | Added | 96 | 0 | +96/-0 |
| `history/0883_2026-11-02_22-01-32_3e3d424_add-client-whatsapp-evidence-for-the-group.md` | Added | 96 | 0 | +96/-0 |
| `history/0886_2026-11-03_15-13-29_697349b_add-revocable-sessions-and-self-service-password-reset.md` | Added | 96 | 0 | +96/-0 |
| `history/0788_2026-10-18_22-41-56_c993506_refresh-the-codebase-atlas.md` | Added | 95 | 0 | +95/-0 |
| `history/0742_2026-10-06_00-48-10_492dfd1_add-bot-aware-seo-metadata-and-buyer-intent-titles.md` | Added | 94 | 0 | +94/-0 |
| `server/controllers/authController.js` | Modified | 86 | 8 | +86/-8 |
| `history/0820_2026-10-20_00-27-54_d0f1371_close-three-residual-holes-in-the-signed-file-gate.md` | Added | 93 | 0 | +93/-0 |
| `history/0855_2026-10-21_03-00-57_457f373_merge-the-support-case-api-review-fixes.md` | Added | 93 | 0 | +93/-0 |
| `history/0853_2026-10-21_02-52-07_fac05f2_add-the-case-stream-endpoint-and-evidence-ownership-checks.md` | Added | 92 | 0 | +92/-0 |
| `history/0859_2026-10-21_04-04-48_cc3950b_finish-investigations-report-email-escalation-and-completion.md` | Added | 92 | 0 | +92/-0 |
| `history/0787_2026-10-17_23-16-54_1f8d7bb_free-the-member-permission-matrix-and-cap-free-seats-at-three.md` | Added | 90 | 0 | +90/-0 |
| `history/0829_2026-10-20_17-40-54_b69c0c1_add-a-read-only-opencode-runtime-for-investigations.md` | Added | 88 | 0 | +88/-0 |
| `history/0887_2026-11-03_19-21-43_6c0b27b_cut-homepage-lcp-to-2-4-s-with-theme-splitting-and-deferred-markdown.md` | Added | 87 | 0 | +87/-0 |
| `history/0813_2026-10-19_21-20-08_05942cd_create-document-rows-at-upload-time.md` | Added | 86 | 0 | +86/-0 |
| `history/0830_2026-10-20_18-37-23_a984ac1_close-review-findings-on-the-read-only-runtime.md` | Added | 86 | 0 | +86/-0 |
| `history/0785_2026-10-11_20-52-18_c1f5bbd_rename-org-settings-to-settings-with-a-redirect.md` | Added | 85 | 0 | +85/-0 |
| `history/0815_2026-10-19_22-09-59_bc388b0_ask-the-server-whether-a-document-may-leave-the-browser.md` | Added | 85 | 0 | +85/-0 |
| `history/0874_2026-10-22_18-44-49_1aba381_give-ai-routes-a-longer-request-budget-untrack-the-session-cache.md` | Added | 84 | 0 | +84/-0 |
| `history/0805_2026-10-19_15-52-05_31a075d_sign-every-gated-download-and-normalise-paths-first.md` | Added | 83 | 0 | +83/-0 |
| `history/0843_2026-10-21_01-52-46_7240c0f_merge-the-support-case-api-workstream.md` | Added | 83 | 0 | +83/-0 |
| `history/0814_2026-10-19_21-35-14_b123140_require-uploads-signing-secret-at-boot.md` | Added | 82 | 0 | +82/-0 |
| `history/0844_2026-10-21_01-53-04_f22a92f_merge-the-investigation-orchestration-workstream.md` | Added | 80 | 0 | +80/-0 |
| `history/0862_2026-10-21_05-47-20_a6f216e_redact-findings-and-catch-more-secret-shapes.md` | Added | 80 | 0 | +80/-0 |
| `history/0786_2026-10-17_23-16-40_7adec7d_fix-feed-author-links-verified-badges-and-public-lookup-privacy-untrac.md` | Added | 79 | 0 | +79/-0 |
| `history/0816_2026-10-19_22-32-05_eb63111_make-the-pre-commit-test-gate-able-to-fail.md` | Added | 79 | 0 | +79/-0 |
| `scripts/perf/lab-benchmark.mjs` | Added | 79 | 0 | +79/-0 |
| `history/0817_2026-10-19_22-47-14_017a4a7_publish-the-upload-access-control-decisions-and-rollout-notes.md` | Added | 78 | 0 | +78/-0 |
| `history/0868_2026-10-21_13-57-45_349bc27_fall-back-through-the-free-model-chain-and-stop-over-escalating.md` | Added | 78 | 0 | +78/-0 |
| `history/0798_2026-10-19_12-00-11_6914bc5_serve-private-files-only-through-signed-urls.md` | Added | 77 | 0 | +77/-0 |
| `history/0864_2026-10-21_11-59-57_0afea34_raise-the-investigation-agent-timeout-and-report-it-honestly.md` | Added | 77 | 0 | +77/-0 |
| `history/0872_2026-10-21_17-24-51_2974b2a_add-a-gmail-smtp-transport-for-investigation-reports.md` | Added | 77 | 0 | +77/-0 |
| `history/0803_2026-10-19_14-20-39_dfacb2c_sign-private-file-urls-in-the-client.md` | Added | 76 | 0 | +76/-0 |
| `history/0857_2026-10-21_03-01-03_ed0e71b_merge-the-admin-console-and-retention-workstream.md` | Added | 76 | 0 | +76/-0 |
| `history/0888_2026-11-03_19-25-55_2d9365b_close-contract-signature-forgery-and-free-premium-upgrade-holes.md` | Added | 76 | 0 | +76/-0 |
| `history/0891_2026-11-03_19-34-34_b1047b7_implement-signed-in-password-change.md` | Added | 76 | 0 | +76/-0 |
| `history/0735_2026-10-05_13-23-21_a2d9ca4_polish-profiles-tabs-and-kpi-grids-from-the-video-audit.md` | Added | 75 | 0 | +75/-0 |
| `history/0795_2026-10-19_02-42-36_47f949b_stop-forged-document-rows-from-granting-file-access.md` | Added | 75 | 0 | +75/-0 |

*…and 182 more files not listed individually (top 60 by line count above; the rest are predominantly line-ending normalisation or generated artifacts).*

### What changed per file

- **`docs/developer/database-reference.md`** — added. +1870/-0 lines.
- **`docs/developer/api-reference.md`** — added. +841/-0 lines.
- **`history/index.md`** — modified. +268/-93 lines.
- **`scripts/docs/generate-reference.mjs`** — added. +308/-0 lines.
- **`shared/assistant/faqEngine.js`** — modified. +255/-31 lines.
- **`src/pages/auth/ForgotPassword.jsx`** — added. +270/-0 lines.
- **`docs/developer/env-reference.md`** — added. +222/-0 lines.
- **`tests/unit/server-sessions-password-reset.test.js`** — added. +185/-0 lines.
- **`tests/unit/server-authz-guards.test.js`** — added. +167/-0 lines.
- **`server/services/passwordResetService.js`** — added. +161/-0 lines.
- **`server/services/sessionService.js`** — added. +143/-0 lines.
- **`tests/e2e/critical-workflows.spec.ts`** — added. +142/-0 lines.
- **`history/0885_2026-11-03_13-15-48_1879ed8_fix-the-client-s-02-11-requests-harden-auth-add-crash-recovery.md`** — added. +124/-0 lines.
- **`history/0739_2026-10-05_23-04-52_ed577cb_build-the-hypercache-offline-twin-and-fix-the-pwa-manifest.md`** — added. +123/-0 lines.
- **`history/0781_2026-10-10_21-58-56_834ae4d_add-neon-lab-test-reporting-and-reorganise-tests.md`** — added. +120/-0 lines.
- **`history/0881_2026-10-25_21-07-34_cb3ff7e_rebuild-dist-normalise-line-endings-and-return-render-to-the-free-plan.md`** — added. +120/-0 lines.
- **`history/0733_2026-10-03_18-01-58_285a654_apply-buyer-final-directives-to-settings-owner-console-and-boosts.md`** — added. +119/-0 lines.
- **`history/0749_2026-10-07_23-58-30_0f5eed5_generate-a-12-theme-runtime-palette-system.md`** — added. +119/-0 lines.
- **`history/0748_2026-10-06_21-01-26_26d8d84_consolidate-the-ui-on-one-deep-sky-blue-token-palette.md`** — added. +118/-0 lines.
- **`history/0884_2026-11-02_23-26-44_eed7e82_add-more-client-conversation-archives.md`** — added. +116/-0 lines.
- **`history/0861_2026-10-21_05-18-49_cee57f2_redact-secrets-from-investigation-reports.md`** — added. +108/-0 lines.
- **`history/0894_2026-11-03_19-47-00_b2287e8_rebuild-the-user-and-developer-documentation.md`** — added. +100/-0 lines.
- **`scripts/perf/serve-dist.mjs`** — added. +98/-0 lines.
- **`history/0834_2026-10-21_00-13-26_f36444e_persist-support-cases-and-keep-their-evidence-private.md`** — added. +96/-0 lines.
- **`history/0883_2026-11-02_22-01-32_3e3d424_add-client-whatsapp-evidence-for-the-group.md`** — added. +96/-0 lines.
- (remaining 35 listed files above follow the same change class.)

## Detailed Diff Analysis

- **Files changed:** 242; **+18599/-308**.
- **Areas touched:** docs/history 189 file(s), src/server/shared 36 file(s), tests 7 file(s), config/CI 2 file(s).
- **Line-ending normalisation:** the bulk of the line count is CRLF/LF, so review with `git diff -w`.

## Why This Change Was Needed

Release integration: land the client-feedback branch after review.

## Was It Useful

Useful. Merge mechanics; the risk lives in the branch commits, which are documented individually.

## Impact Analysis

No new code beyond the branch. CI re-runs on the merge; deploys follow the repo's normal pipeline.

## Relationship to Surrounding Commits

- **Follows:** 0898 — merge pr #102 — client feedback branch.
- Ships the entire fix/client-feedback-2026-11-03 line of work; directly followed by the production-stability branch (0899 → 0900–0901 → 0902).

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- **Merge commit:** file stats are the diff vs the first parent; the branch content is documented in the individual commits.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
