# Commit 0020: Add Smart Notifications, Social Interactions, and Access Matrix

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0020                                       |
| **Commit Hash**   | `6fffdefc55a436cae3681bdc864a662d568cabbb` |
| **Parent Hash**   | `daba2ccb910d4be00c31d3d955a9e1db8a904b29` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-02 06:55:59 (+0600)                |
| **Files Changed** | 135                                        |
| **Additions**     | 6,651                                      |
| **Deletions**     | 1,103                                      |
| **Net Change**    | +5,548 lines                               |
| **Merge Commit**  | No                                         |

## Custom Title

**Add Notification Engine, Social Interactions API, and Role-Based Access Control**

## High-Level Summary

A root branch that adds three major feature sets: (1) a smart notification system with search alerts, (2) social interactions (comments, shares, reports), and (3) role-based access control with protected routes. Introduces `src/lib/auth.js` for centralized auth, `AccessDenied.jsx` page, rewrites `Login.jsx` and `Signup.jsx`, and adds fully role-gated route definitions using a `ProtectedRoute` component.

## Key New Files

**`src/lib/auth.js`** (60 lines) — Centralized auth library: `getToken()`, `getCurrentUser()`, `saveSession()`, `clearSession()`, `apiRequest()`, `getRoleHome()`.

**`src/pages/AccessDenied.jsx`** (21 lines) — Simple "403 Access Denied" page for unauthorized route access.

**Backend:**

- `server/controllers/notificationController.js` — Search alerts CRUD, notification listing/marking read
- `server/controllers/socialController.js` — Comments, shares, reports
- `server/services/notificationService.js` — Smart search alert matching, notification generation
- `server/services/socialService.js` — Comment/share/report persistence
- `server/database/notifications.json`, `search_alerts.json`, `social_interactions.json`

## Key Changes

**`src/App.jsx`** — Complete rewrite with `ProtectedRoute` component that checks JWT auth and role permissions. Routes are organized into public, protected, and role-gated groups. FloatingAssistant added to app shell.

**`src/pages/auth/Login.jsx`** (162 lines) — Rewritten with API integration, error handling, redirects.

**`src/pages/auth/Signup.jsx`** (371 lines, -182) — Rewritten with role-aware registration form.

## Role-Based Route Protection

Routes now gated by role:

- `/partner-network`: buying_house, admin, factory
- `/product-management`: factory, buying_house, admin
- `/buyer-requests`: buyer, buying_house, admin
- `/member-management`, `/org-settings`: buying_house, factory, admin
- `/insights`, `/owner`: buying_house, admin
- `/agent`: buying_house, admin
- `/feed`, `/search`, `/buyer/:id`, `/factory/:id`, `/chat`, etc.: any authenticated user

## Why

To add essential B2B platform features: social engagement (comments/shares), smart alerts (notify users when matching content appears), and proper access control (different roles see different pages).

## Relationship

This branch will be merged in commit 0021.
