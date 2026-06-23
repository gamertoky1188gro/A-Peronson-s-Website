# 0441 — Remove sidebar nav links from AgentDashboard

**Commit:** `34a9bae5383fd02d9d646f16c8e5c23d2ba646a2`
**Parent:** `1d3640e8210fdac8bdb00fe11f37291ad8f1c0df`
**Author:** gamertoky1188gro
**Date:** 2026-05-26 14:30:46 +0600

## High-Level Summary
Removes the three sidebar navigation links (My Requests, My Chats, Connected Factories) from AgentDashboard, leaving only the plan card and logout. The navigation links are now expected to be accessed via the main NavBar.

## File-by-File Breakdown
| File | Change |
|------|--------|
| `src/pages/AgentDashboard.jsx` | 1 insertion, 47 deletions |

## Detailed Diff Analysis
Complete removal of the `<nav>` element with three `<Link>` components (requests, chats, factories) and their associated ChevronRight icons. These were introduced in 0440's rewrite.

## Why This Change
These nav links duplicated the main NavBar functionality and consumed sidebar space. The Agent Dashboard should focus on metrics and actions, not navigation.

## Was It Useful
Yes — reduces redundancy and sidebar clutter.

## Impact Analysis
**Low.** Navigation was already accessible from the top NavBar.

## Relationships
Cleanup follow-up to 0440. Part of the AgentDashboard polish series (0441-0446).

## Confidence Notes
High — straightforward deletion.
