# Commit 0042: Add Org-Scoped Assistant Knowledge and FAQ Management UI

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0042                                       |
| **Commit Hash**   | `d056c9d50b51e39958af91fc3268e58ff6d53446` |
| **Parent Hash**   | `d647203b85f1ff614d513eb3cdc79a102a63952e` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-03 09:45:24                        |
| **Files Changed** | 11                                         |
| **Additions**     | 400                                        |
| **Deletions**     | 35                                         |
| **Net Change**    | +365                                       |
| **Merge Commit**  | No                                         |

## Custom Title

Add Org-Scoped Assistant Knowledge and FAQ Management UI

## High-Level Summary

Replaces the hardcoded assistant rules with an org-scoped knowledge base system. Organizations can create, edit, and delete FAQ entries that the floating assistant uses to answer questions. The assistant now performs keyword-based matching against org knowledge entries first, then falls back to global rules, then to agent forwarding.

## File-by-File Breakdown

- **dist/assets/*** (various): Updated build artifacts with new CSS/JS bundles (meta rename from "meow" to "GarTexHub", CSP headers).
- **server/controllers/assistantController.js** (+54/-1): Added knowledge CRUD controllers.
- **server/database/assistant_knowledge.json** (+1): New JSON store.
- **server/routes/assistantRoutes.js** (+12/-2): Added /knowledge CRUD routes.
- **server/services/assistantService.js** (+195/-5): Full rewrite with scoring/matching, global rules, and org knowledge lookup.
- **src/pages/MvpDashboard.jsx** (+4/-1): Updated to display new assistant response format.
- **src/pages/OrgSettings.jsx** (+117/-7): Added Assistant FAQ tab with create/edit/delete UI.

## Detailed Diff Analysis

The assistant now uses a scoring algorithm to match questions against org knowledge entries (by question text and keywords), then global rules, and finally forwards to a human agent. The OrgSettings page gains an "Assistant FAQ" tab with a form for adding question/answer/keyword entries and a list view with edit/delete actions.

## Why This Change May Have Been Needed

The hardcoded assistant rules were too limited. Organizations needed custom FAQ entries for their specific context.

## Was It Useful?

Yes, makes the assistant extensible and organization-aware.

## Impact Analysis

Medium to large. Backend service rewrite, new data store, frontend FAQ management UI.

## Relationship to Surrounding Commits

This branch is merged by 0043. Routes are hardened to owner/admin in commit 0059.

## Confidence Notes

High confidence. Well-designed scoring system with fallback logic.
