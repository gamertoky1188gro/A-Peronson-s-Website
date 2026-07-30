# Project History Index

> Complete chronological documentation of all 637 commits in the GarTexHub B2B Textile Marketplace repository.

## Summary Statistics

| Metric                            | Value                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Total commits documented**      | 637                                                                                                                         |
| **Date range**                    | 2026-03-01 → 2026-07-31                                                                                                                     |
| **Unique files ever touched**     | 2,200+                                                                                                                                      |
| **Most frequently changed files** | `src/pages/SearchResults.jsx` (77x), `server/server.js` (76x), `src/App.jsx` (65x), `src/components/NavBar.jsx` (59x), `package.json` (58x) |
| **Largest commits (by files)**    | 936 files (commit `bdbbbc1` "meow"), 515 files (commit `6b75ca5` "Fixed"), 299 files (commit `bb22700` "Fixed")                            |
| **Major development phases**      | See below                                                                                                                                   |

## Development Phases

| Phase                            | Commits   | Period       | Focus                                                                                       |
| -------------------------------- | --------- | ------------ | ------------------------------------------------------------------------------------------- |
| **1. Initial Scaffold**          | 0001–0020 | Mar 1–2      | Vite+React setup, routing, Express API backend, Electron, theme system                      |
| **2. API & Data Wiring**         | 0021–0090 | Mar 2–6      | Auth, CRM, search, messaging, contracts, analytics, partner network                         |
| **3. Assistant & Chat**          | 0091–0140 | Mar 3–17     | WebSocket chat, AI assistant, friend system, call interface                                 |
| **4. Database & Deployment**     | 0141–0180 | Mar 19–Apr 4 | PostgreSQL/Prisma migration, Docker, admin panel, passkey auth                              |
| **5. Feature Expansion (codex)** | 0181–0250 | Apr 4–19     | CRM analytics, currency/FX, governance, AI orchestration, enterprise ops                    |
| **6. Admin & UI Churn**          | 0251–0300 | Apr 19–28    | AdminPanel rewrites, sidebar, export, build artifacts                                       |
| **7. Theme Refactoring**         | 0301–0350 | Apr 28–May 1 | Sky/cyan theme, OpenSearch CI config, render.yaml deployment                                |
| **8. OpenSearch & CI**           | 0351–0390 | May 1–22     | Password iterations, docker-compose fixes, test fixes, asset rebuilds                       |
| **9. opencode AI Integration**   | 0391–0440 | May 22–26    | AI assistant, streaming SSE, session memory, NavBar refactoring                             |
| **10. Visual System Overhaul**   | 0441–0500 | May 26–Jun 1 | AgentDashboard, BuyerRequestManagement, PartnerNetwork, NeonAtom loaders, scroll animations |
| **11. Search & Feed**            | 0501–0560 | Jun 2–6      | Search features, semantic search, markdown rendering, link previews, live feed SSE          |
| **12. Polish & A11Y**            | 0561–0588 | Jun 7–22     | SEO, accessibility, perf, comment UI, custom cursor, final cleanup |
| **13. History & Lint**           | 0589–0594 | Jun 23–Jul 19 | History documentation framework, HTML/PDF exports, lint fixes, massive rebuild |
| **14. Audit & Quality**          | 0595–0617 | Jul 19–25 | Post-rebuild lint fixes, security audit resolution (HIGH/LOW items), Prisma transaction wrapping, unused import cleanup, build errors, AdminPanel modularization, progress documentation |
| **15. Features & Tooling**       | 0618–0621 | Jul 25–26 | History documentation, build-error fixes, Biome reformat (+ karpathy-coder skill), B2B relationships, feedback, join requests, verification expansion |
| **16. Production Polish & Fixes** | 0622–0637 | Jul 26–31 | History docs, build fixes (dev dep, CORS, auth), diagnostics system, login polish, class→className migration, logger fix, opencode guard, MainFeed fix, BuyerRequestManagement restore, video call enforcement, admin finance |

## Complete Commit List

| #                                                                                             | Date             | Hash      | Title                                                           | Summary                                                                    |
| --------------------------------------------------------------------------------------------- | ---------------- | --------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [0001](./0001_2026-03-01_13-33-05_daba2cc_initial-vite-react-app-scaffold.md)                 | 2026-03-01 13:33 | `daba2cc` | Initial Vite + React App Scaffold for B2B Textile Platform      | Root commit — 40 files, Vite+React 19, Tailwind v4, 25 routes, dark mode   |
| [0002](./0002_2026-03-01_14-08-53_eb33a13_add-global-dark-theme-and-page-docs.md)             | 2026-03-01 14:08 | `eb33a13` | Add Global Dark Theme Toggle, Responsive Nav, and Page Docs     | Dark theme refinement, responsive navbar, page documentation               |
| [0003](./0003_2026-03-01_15-43-59_6213071_rebuild-into-textile-trust-mvp-with-express-api.md) | 2026-03-01 15:43 | `6213071` | Rebuild into Textile Trust MVP with Express API                 | Major backend addition — Express API server, routes, controllers, services |
| [0004](./0004_2026-03-01_15-57-18_f4b274f_merge-codex-branch-overwrite-main.md)               | 2026-03-01 15:57 | `f4b274f` | Merge Codex Branch: Overwrite Main                              | Merge of codex branch into main                                            |
| [0005](./0005_2026-03-01_16-00-45_c80862d_restore-page-routes-keep-mvp-dashboard.md)          | 2026-03-01 16:00 | `c80862d` | Restore Page Routes and Keep MVP Dashboard                      | Route restoration from initial commit                                      |
| [0006](./0006_2026-03-01_16-10-28_583f613_merge-codex-dark-theme-branch.md)                   | 2026-03-01 16:10 | `583f613` | Merge: Dark Theme and Page Documentation                        | Merge of dark theme branch                                                 |
| [0007](./0007_2026-03-01_16-45-56_795caf8_implement-enterprise-behavioral-architecture.md)    | 2026-03-01 16:45 | `795caf8` | Implement Enterprise Behavioral Architecture Modules            | Behavioral architecture for MVP                                            |
| [0008](./0008_2026-03-01_16-55-11_f391d0d_merge-codex-enterprise-architecture.md)             | 2026-03-01 16:55 | `f391d0d` | Merge: Enterprise Architecture                                  | Merge of enterprise architecture branch                                    |
| [0009](./0009_2026-03-01_17-09-51_67d698f_set-up-electron-app-runner.md)                      | 2026-03-01 17:09 | `67d698f` | Set Up Electron App Runner with Backend Boot                    | Electron desktop app setup                                                 |
| [0010](./0010_2026-03-01_17-27-03_5aa7226_merge-electron-app-runner.md)                       | 2026-03-01 17:27 | `5aa7226` | Merge: Electron App Runner                                      | Merge of electron branch                                                   |
| [0011](./0011_2026-03-01_17-51-33_b62d70b_fix-electron-asset-loading-csp.md)                  | 2026-03-01 17:51 | `b62d70b` | Fix Electron Asset Loading and CSP                              | Electron runtime fixes                                                     |
| [0012](./0012_2026-03-01_18-05-41_3f63c0f_merge-electron-fixes.md)                            | 2026-03-01 18:05 | `3f63c0f` | Merge: Electron Fixes                                           | Merge of electron fix branch                                               |
| [0013](./0013_2026-03-01_19-25-48_020952f_use-shared-global-navbar-3d-dark-styling.md)        | 2026-03-01 19:25 | `020952f` | Use Shared Global Navbar and 3D Dark Styling                    | Unified navbar, 3D dark effects                                            |
| [0014](./0014_2026-03-01_19-59-01_cf1a386_polish-global-3d-styling.md)                        | 2026-03-01 19:59 | `cf1a386` | Polish Global 3D Styling                                        | Polish 3D styling across UI                                                |
| [0015](./0015_2026-03-01_22-48-56_75e2331_merge-3d-dark-styling.md)                           | 2026-03-01 22:48 | `75e2331` | Merge: 3D Dark Styling                                          | Merge of styling branch                                                    |
| [0016](./0016_2026-03-02_00-31-27_2dc4c0a_apply-cyberpunk-purple-neon-styling.md)             | 2026-03-02 00:31 | `2dc4c0a` | Apply Cyberpunk Purple Neon Styling                             | Purple neon theme applied manually                                         |
| [0017](./0017_2026-03-02_00-38-59_5de6103_merge-cyberpunk-styling.md)                         | 2026-03-02 00:38 | `5de6103` | Merge: Cyberpunk Styling                                        | Merge of cyberpunk branch                                                  |
| [0018](./0018_2026-03-02_01-32-44_e5cca34_wire-feed-search-to-live-api.md)                    | 2026-03-02 01:32 | `e5cca34` | Wire Feed and Search Pages to Live API                          | Live API data integration                                                  |
| [0019](./0019_2026-03-02_06-03-17_08fc408_merge-api-data-integration-pr9.md)                  | 2026-03-02 06:03 | `08fc408` | Merge PR #9: API Data Integration                               | Merge of API integration PR                                                |
| [0020](./0020_2026-03-02_06-55-59_6fffdef_add-smart-notifications-social-access-matrix.md)    | 2026-03-02 06:55 | `6fffdef` | Add Smart Notifications, Social Interactions, and Access Matrix | Notifications, social features, access control                             |
| [0021–0089](files above continue sequentially)                                                | ...              | ...       | ...                                                             | (see individual files for details)                                         |
| [0090](./0090_2026-03-03_10-51-16_5ddb592_merge-account-age-boost-abuse-pr28.md)              | 2026-03-03 10:51 | `5ddb592` | Merge PR #28: Account Age Boost                                 | Merge account age boost                                                    |
| [0091–0180](files 0091-0180)                                                                  | ...              | ...       | ...                                                             | Assistant, Chat, DB, Docker, Admin Panel, Passkeys                         |
| [0181–0250](files 0181-0250)                                                                  | ...              | ...       | ...                                                             | CRM, FX, Governance, AI, Enterprise Ops, Admin rewrites                    |
| [0251–0300](files 0251-0300)                                                                  | ...              | ...       | ...                                                             | Admin panel rewrites, sidebar, exports, build artifacts                    |
| [0301–0350](files 0301-0350)                                                                  | ...              | ...       | ...                                                             | Theme refactoring, render.yaml, OpenSearch config                          |
| [0351–0390](files 0351-0390)                                                                  | ...              | ...       | ...                                                             | OpenSearch password/CI, test fixes, asset rebuilds                         |
| [0391–0440](files 0391-0440)                                                                  | ...              | ...       | ...                                                             | opencode AI, SSE streaming, session memory, NavBar                         |
| [0441–0500](files 0441-0500)                                                                  | ...              | ...       | ...                                                             | Visual system overhaul, NeonAtom loaders, animations                       |
| [0501–0560](files 0501-0560)                                                                  | ...              | ...       | ...                                                             | Search features, semantic search, markdown, link previews                  |
| [0561–0588](files 0561-0588)                                                                  | ...              | ...       | ...                                                             | SEO, accessibility, perf, comments, cursor, final cleanup                  |
| [0589](./0589_2026-06-23_09-51-41_c82ffcd_create-history-documentation-framework.md)          | 2026-06-23 09:51 | `c82ffcd` | Create History Documentation Framework                           | Added 594 history files documenting all prior commits                      |
| [0590](./0590_2026-06-23_21-55-15_d6588c6_add-history-html-output.md)                         | 2026-06-23 21:55 | `d6588c6` | Add History HTML Output                                          | 88,644-line HTML rendering of commit history                               |
| [0591](./0591_2026-06-23_22-25-09_7b2ce92_add-history-pdf-split-files.md)                     | 2026-06-23 22:25 | `7b2ce92` | Add History PDF Split Files                                      | 4 binary PDF files with exported history (1.3M lines)                      |
| [0592](./0592_2026-07-12_15-51-18_9c670b2_update-test-print-statement.md)                     | 2026-07-12 15:51 | `9c670b2` | Update Test Print Statement                                      | Changed 1.txt from "Hello" to "Goodbye", reduced from 690KB to 2 bytes     |
| [0593](./0593_2026-07-17_00-09-56_543b633_fix-resolve-218-lint-errors.md)                     | 2026-07-17 00:09 | `543b633` | Fix: Resolve All 218 Lint Errors                                 | Comprehensive lint fix across 274 files (server + client)                  |
| [0594](./0594_2026-07-19_23-23-52_bdbbbc1_massive-rebuild-post-lint-fixes.md)                 | 2026-07-19 23:23 | `bdbbbc1` | Massive Rebuild Post-Lint Fixes                                  | 936 files rebuilt, dist/ regeneration, server/client refinements           |
| [0595](./0595_2026-07-19_23-40-16_9dfb2ac_document-history-for-commits-0589-0594.md)           | 2026-07-19 23:40 | `9dfb2ac` | Document History for Commits 0589-0594                           | Created markdown documentation for the 6 most recent commits               |
| [0596](./0596_2026-07-19_23-41-21_86f4e88_fix-remaining-lint-errors-across-33-files.md)       | 2026-07-19 23:41 | `86f4e88` | Fix Remaining Lint Errors Across 33 Files                        | Second pass of lint fixes across 33 source files (+1,472/-908)             |
| [0597](./0597_2026-07-20_23-52-48_0acab6c_stop-tracking-env-and-fix-empty-promise-handlers.md)| 2026-07-20 23:52 | `0acab6c` | Stop Tracking .env and Fix Empty Promise Handlers                | Added .env to .gitignore, fixed silent promise rejection in 5 components   |
| [0598](./0598_2026-07-21_00-16-36_5b2e698_revert-env-tracking-changes.md)                     | 2026-07-21 00:16 | `5b2e698` | Revert .env Tracking Changes                                     | Re-added .env to tracking, removed from .gitignore                          |
| [0599](./0599_2026-07-21_00-19-12_df28dfe_update-audit-reports-with-fix-status.md)            | 2026-07-21 00:19 | `df28dfe` | Update Audit Reports with Fix Status                             | Updated all 5 AUDIT*.md files to reflect current remediation state          |
| [0600](./0600_2026-07-21_12-31-47_5059792_resolve-4-high-audit-items.md)                      | 2026-07-21 12:31 | `5059792` | Resolve 4 High Audit Items                                       | Security fixes: console logger, admin credentials, SSE token, validation   |
| [0601](./0601_2026-07-21_13-17-44_f8947c1_fix-missing-catch-in-floating-assistant.md)         | 2026-07-21 13:17 | `f8947c1` | Fix Missing .catch() in FloatingAssistant                        | Added proper error handling to fetchSessionData promises (BUG-001)         |
| [0602](./0602_2026-07-21_13-19-46_db90012_update-audit-files-for-bug-001.md)                  | 2026-07-21 13:19 | `db90012` | Update Audit Files for BUG-001                                   | Updated all 5 audit reports to reflect BUG-001 completion                   |
| [0603](./0603_2026-07-21_13-29-58_ef0308f_fix-cors-errorboundary-csrf-validation-proptypes.md)| 2026-07-21 13:29 | `ef0308f` | Fix CORS, ErrorBoundary, CSRF, Validation, PropTypes             | Created ErrorBoundary, validation lib, CORS hardening, PropTypes additions |
| [0604](./0604_2026-07-21_13-31-58_169c0e0_finalize-audit-file-dates.md)                       | 2026-07-21 13:31 | `169c0e0` | Finalize Audit File Dates                                        | Marked audit files as (final) in index and report                           |
| [0605](./0605_2026-07-21_13-39-17_199b40e_round-3-hardcoded-localhost-resizeobserver-leak.md) | 2026-07-21 13:39 | `199b40e` | Round 3: Localhost, ResizeObserver, Deps, Env Validation         | Fixed hardcoded localhost URLs, ResizeObserver cleanup, env validation lib |
| [0606](./0606_2026-07-21_13-40-00_5103b07_remove-leftover-debug-files.md)                     | 2026-07-21 13:40 | `5103b07` | Remove Leftover Debug Files                                      | Deleted 3 debug output files (then_calls.txt, then_calls2.txt, then_calls3.txt) |
| [0607](./0607_2026-07-21_13-56-31_0b16124_round-4-code-splitting-cn-routes-memo-constants.md) | 2026-07-21 13:56 | `0b16124` | Round 4: Code Splitting, cn(), Routes, Memo, Constants, JSDoc    | Added shared cn() utility, route constants, code splitting, React.memo     |
| [0608](./0608_2026-07-21_14-16-49_4235ca_gate-vite-request-debug-to-dev.md)                   | 2026-07-21 14:16 | `4235ca`  | Gate VITE_REQUEST_DEBUG to Dev Environment                       | Restricted VITE_REQUEST_DEBUG to dev only (SEC-007), updated audit files   |
| [0609](./0609_2026-07-21_14-59-06_00350f_wrap-multi-step-prisma-in-transactions.md)           | 2026-07-21 14:59 | `00350f`  | Wrap Multi-Step Prisma Operations in Transactions                | Transaction wrapping in 16 server files (DATA-002), ~+1,196/-1,021 lines   |
| [0610](./0610_2026-07-21_15-21-31_3f2122_remove-48-unused-imports-across-34-files.md)         | 2026-07-21 15:21 | `3f2122`  | Remove 48 Unused Imports Across 34 Files                         | Cleaned unused imports from 29 client + 5 server files (QUALITY-004)       |
| [0611](./0611_2026-07-21_18-19-39_7ea7e2d_document-history-for-commits-0595-0610.md)          | 2026-07-21 18:19 | `7ea7e2d` | Document History for Commits 0595-0610                           | Created markdown documentation for 16 recent commits (595-610)             |
| [0612](./0612_2026-07-21_20-23-56_e872ced_remove-hardcoded-jwt-secret-and-add-json-parse-error-logging.md)| 2026-07-21 20:23 | `e872ced` | Remove Hardcoded JWT_SECRET and Add JSON Parse Error Logging     | Removed JWT fallback, added JSON parse error handling, updated audit files |
| [0613](./0613_2026-07-21_20-33-42_8b67fe8_fix-high-severity-audit-issues-3-5.md)              | 2026-07-21 20:33 | `8b67fe8` | Fix High-Severity Audit Issues 3-5                               | Cache dedup, useEffect deps cleanup, WebSocket lifecycle fixes             |
| [0614](./0614_2026-07-22_21-36-19_335b94_fix-low-severity-audit-issues-11-15.md)              | 2026-07-22 21:36 | `335b94f` | Fix Low-Severity Audit Issues 11-15                              | console.log → logger, N+1 queries, dead code removal, hardcoded values→constants, JSDoc additions |
| [0615](./0615_2026-07-22_21-47-32_cc5c8ce_fix-error-boundaries-and-form-validation.md)       | 2026-07-22 21:47 | `cc5c8ce` | Fix Error Boundaries and Form Validation                         | safeLazy fallback for chunk failures, ErrorBoundary wrapping, email validation |
| [0616](./0616_2026-07-22_21-57-46_4b141b2_fix-database-indexes-env-vars-cors-aria-and-focus-trap.md)| 2026-07-22 21:57 | `4b141b2` | Fix Database Indexes, Env Vars, CORS, ARIA, and Focus Trap       | @@index on 18+ model FKs, ADMIN_TEST_EMAIL fallback, env validation, focus trap hook |
| [0617](./0617_2026-07-25_09-56-04_4277269_fix-audit-issues-31-to-50-across-71-files.md)       | 2026-07-25 09:56 | `4277269` | Fix Audit Issues 31 to 50 Across 71 Files                        | Dead code, memory leaks, test pollution, build config, Docker, env restoration, AdminPanel split |
| [0618](./0618_2026-07-25_10-05-22_0ffab80_document-history-for-commits-0611-0617.md)          | 2026-07-25 10:05 | `0ffab80` | Document History for Commits 0611-0617                           | Created markdown documentation for 7 audit-fix commits (611-617)            |
| [0619](./0619_2026-07-25_13-46-16_cdb4cc4_resolve-build-errors-wrong-import-paths-missing-timeouts-export-circular-vendor-chunks.md)| 2026-07-25 13:46 | `cdb4cc4` | Resolve Build Errors — Import Paths, TIMEOUTS, Vendor Chunks     | Fixed 8 admin section imports, added TIMEOUTS export, restructured vendor chunks |
| [0620](./0620_2026-07-26_00-45-49_54bb516_workspace-save-biome-rebuild-karpathy.md)           | 2026-07-26 00:45 | `54bb516` | Workspace Save — Biome Reformat, Rebuild, Karpathy-Coder Skill   | 690-file Biome reformat, dist/ rebuild, new karpathy-coder agent skill suite, config consolidation |
| [0621](./0621_2026-07-26_15-42-09_65a448e_workspace-save-feedback-join-request-relationships.md)| 2026-07-26 15:42 | `65a448e` | Workspace Save — Feedback, Join Requests, B2B Relationships       | New FeedbackPage, JoinRequestPage, B2B relationship services, verification expansion, Prisma schema |
| [0622](./0622_2026-07-26_15-47-14_bcbfea1_document-history-for-commits-0618-0621.md)                     | 2026-07-26 15:47 | `bcbfea1` | Document Commits 0618-0621 in History                            | Created history docs for 4 commits, updated index/progress, rebuilt dist/ |
| [0623](./0623_2026-07-26_15-53-22_5e48229_move-dev-dependency-to-optional.md)                           | 2026-07-26 15:53 | `5e48229` | Move Dev Dependency to Optional to Fix Node 22 Build             | Moved `dev` package to optionalDependencies to prevent inotify build failure |
| [0624](./0624_2026-07-26_16-00-54_7e1086a_fix-license-route-auth-middleware.md)                         | 2026-07-26 16:00 | `7e1086a` | Fix License Route Auth Middleware                                | Replaced authenticateToken with requireAuth in 5 license request routes |
| [0625](./0625_2026-07-27_12-15-54_81e63d6_allow-cors-no-origin-requests.md)                             | 2026-07-27 12:15 | `81e63d6` | Allow CORS No-Origin Requests for Health Checks                  | Relaxed CORS to accept no-origin requests in production for curl/monitoring |
| [0626](./0626_2026-07-27_14-13-51_be140f3_add-production-start-script.md)                               | 2026-07-27 14:13 | `be140f3` | Add Production Start Script                                      | Added start:prod script, simplified render.yaml startCommand |
| [0627](./0627_2026-07-27_14-26-15_638ac75_add-self-diagnostics-system.md)                                | 2026-07-27 14:26 | `638ac75` | Add Self-Diagnostics System                                      | New /api/diagnostics, /api/health, /api/uptime endpoints + CLI diagnose script |
| [0628](./0628_2026-07-27_14-36-06_7ad2445_enlarge-login-page-brand.md)                                   | 2026-07-27 14:36 | `7ad2445` | Enlarge Login Page Brand Area                                    | Redesigned login brand with larger GarTexHub logo and decorative divider |
| [0629](./0629_2026-07-27_14-39-39_6a3e4f6_scale-down-login-brand-section.md)                             | 2026-07-27 14:39 | `6a3e4f6` | Scale Down Login Brand Section                                   | Reversed brand enlargement — smaller icon, compact layout |
| [0630](./0630_2026-07-27_14-42-19_9b57e20_fix-react-attributes-and-shrink-login-icons.md)                | 2026-07-27 14:42 | `9b57e20` | Fix React Attributes and Shrink Login Icons                      | Fixed class→className in Login.jsx, reduced icon/spacing sizes |
| [0631](./0631_2026-07-27_14-45-31_aef2fa4_replace-html-class-with-react-classname.md)                    | 2026-07-27 14:45 | `aef2fa4` | Replace HTML class with React className Across Codebase          | 6,921 replacements across 106 JSX files — class→className |
| [0632](./0632_2026-07-27_14-49-39_495efd5_replace-remaining-class-with-classname.md)                     | 2026-07-27 14:49 | `495efd5` | Replace Remaining class={ with className={ Across 60 Files       | 854 replacements of dynamic class={ expressions across 60 files |
| [0633](./0633_2026-07-27_14-51-42_0f97e2b_remove-watch-flag-from-server-script.md)                      | 2026-07-27 14:51 | `0f97e2b` | Remove Watch Flag from Server Script                             | Changed node --watch to node for server script |
| [0634](./0634_2026-07-27_14-52-51_e5a6be7_fix-no-op-logger-stubs.md)                                      | 2026-07-27 14:52 | `e5a6be7` | Fix No-Op Logger Stubs                                           | Replaced empty logInfo/logWarn/logError stubs with real implementations |
| [0635](./0635_2026-07-27_14-56-42_e4f7520_add-opencode-enabled-env-guard.md)                             | 2026-07-27 14:56 | `e4f7520` | Add OPENCODE_ENABLED Env Guard                                   | Added env var to skip opencode server startup when disabled |
| [0636](./0636_2026-07-27_14-58-38_fe656b4_guard-ensure-opencode-server-in-session-init.md)               | 2026-07-27 14:58 | `fe656b4` | Guard ensureOpencodeServer in Session Init                       | Extended OPENCODE_ENABLED guard to ensureOpencodeServer bypass path |
| [0637](./0637_2026-07-31_00-24-57_d581aa0_restore-buyer-request-management-and-enforce-video-calls.md)   | 2026-07-31 00:24 | `d581aa0` | Restore Corrupted Component, Fix Prisma Schema, Enforce Video Calls | Restored BuyerRequestManagement, MainFeed loop fix, video call enforcement, admin finance, dist rebuild |

> **Note**: Due to the large number of commits (637), the full index table references individual files. Browse any commit's full analysis by clicking its number link above. For commits 0021–0089 and beyond, please navigate directly to the corresponding numbered file in this directory.

## File Naming Convention

`history/NNNN_YYYY-MM-DD_HH-MM-SS_ABBREV_HASH_descriptive-title.md`

- `NNNN` = 4-digit commit sequence number (0001-0637)
- `YYYY-MM-DD_HH-MM-SS` = commit date/time
- `ABBREV_HASH` = first 7 characters of commit hash
- `descriptive-title` = generated title (kebab-case)

## Key Patterns Observed

- **Merge-heavy workflow**: Frequent merge commits from codex branches with "override main" strategy
- **Rapid iteration**: Multiple small fix commits following large feature additions (especially in admin panel, search, and AI assistant areas)
- **Dist churn**: Build artifacts (`dist/`) were committed and rebuilt many times, causing large line-count fluctuations
- **Theme evolution**: From basic light/dark → cyberpunk purple neon → sky/cyan → cohesive visual system
- **Backend migration**: JSON file store → Prisma/PostgreSQL
- **AI integration**: Local llama.cpp → opencode SDK with SSE streaming
- **History documentation**: Commits 0589–0591 retroactively documented all prior commits; 0593–0594 fixed lint errors and rebuilt the entire codebase
- **Audit remediation (0595–0617)**: Systematic security audit fix rounds (HIGH items → LOW items), Prisma transaction safety, unused import cleanup, JWT secret removal, error boundaries, form validation, database indexes, ARIA/focus trap, AdminPanel modularization, and ongoing progress documentation
- **Biome reformat (0620)**: A massive 690-file reformat using Biome, replacing ESLint/Prettier, plus karpathy-coder skill suite and file catalogs
- **B2B relationships (0621)**: New B2B relationship management, join requests, feedback page, company licensing, and verification expansion
- **class→className migration (0631–0632)**: 166 files, 7,775 replacements fixing incorrect HTML `class` attributes in React JSX
- **Production polish (0623–0636)**: 14 focused fixes — CORS, auth middleware, diagnostics, logger restoration, opencode env guard, login page polish, production start script
- **Component restoration (0637)**: BuyerRequestManagement restored from stubs after class migration; MainFeed infinite loop fixed via liveRef pattern; video call enforcement added to messaging and contracts

## Progress Tracking

See [progress.md](./progress.md) and [progress.json](./progress.json) for live checkpoint state.
