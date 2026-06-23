# 0438 — Merge Management dropdown into Core

**Commit:** `ee152ae3eb09ff8afcd5b97e09ced4a5f0e0fd02`
**Parent:** `0fb0b0b55fb832766dcf6774142b1b2feafb5369`
**Author:** gamertoky1188gro
**Date:** 2026-05-25 22:21:24 +0600

## High-Level Summary
Moves "Owner Dashboard" and "Agent Dashboard" links from the separate "Management" dropdown into the "Core" dropdown group, then removes the "Management" dropdown entirely. Reduces the number of top-level nav groups.

## File-by-File Breakdown
| File | Change |
|------|--------|
| `src/components/NavBar.jsx` | 10 insertions, 16 deletions |

## Detailed Diff Analysis
```diff
       { to: "/verification", label: "Verification" },
+      {
+        to: "/owner",
+        label: "Owner Dashboard",
+        roles: ["owner", "admin", "buying_house", "factory"],
+      },
+      {
+        to: "/agent",
+        label: "Agent Dashboard",
+        roles: ["buying_house", "owner", "admin", "agent"],
+      },
     ],
   },
-  {
-    label: "Management",
-    icon: Star,
-    items: [
-      { to: "/owner", ... },
-      { to: "/agent", ... },
-    ],
-  },
```

## Why This Change
Reduces nav complexity by consolidating related items. "Management" was a thin wrapper around two links that fit naturally under "Core."

## Was It Useful
Yes — simplifies the navigation bar, reducing horizontal space usage critical for the flex-nowrap approach in 0436-0437.

## Impact Analysis
**Low.** Structural navigation change only. No functional behavior change.

## Relationships
Part of the NavBar simplification series (0436-0439).

## Confidence Notes
High — mechanical move of items between arrays.
