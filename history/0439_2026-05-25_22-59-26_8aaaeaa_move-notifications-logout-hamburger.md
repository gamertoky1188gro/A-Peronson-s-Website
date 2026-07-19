# 0439 — Move notifications and logout inside mobile hamburger menu

**Commit:** `8aaaeaa6c50836b7f196a38e4de51510070217c7`
**Parent:** `ee152ae3eb09ff8afcd5b97e09ced4a5f0e0fd02`
**Author:** gamertoky1188gro
**Date:** 2026-05-25 22:59:26 +0600

## High-Level Summary

Hides the notification bell and Login/Logout button on mobile screens (`md:`) — they are now only shown on desktop. On mobile, these actions are accessed through the hamburger menu.

## File-by-File Breakdown

| File                        | Change                     |
| --------------------------- | -------------------------- |
| `src/components/NavBar.jsx` | 11 insertions, 9 deletions |

## Detailed Diff Analysis

```diff
+              <div className="hidden md:block">
                 <IconNavLink to="/notifications" ... />
+              </div>
...
-                  className="inline-flex h-11 items-center ..."
+                  className="hidden md:inline-flex h-11 items-center ..."
```

Same `hidden md:block` / `hidden md:inline-flex` applied to:

- Notifications icon
- Logout button
- Login link

## Why This Change

The notification bell and login/logout buttons consumed horizontal space needed for nav items. They were already available in the mobile hamburger menu.

## Was It Useful

Yes — creates more breathing room for navigation on smaller screens.

## Impact Analysis

**Low.** Mobile-only visibility change. Desktop experience unaffected.

## Relationships

Final step in the NavBar polish series (0436-0439).

## Confidence Notes

High — simple Tailwind responsive class changes.
