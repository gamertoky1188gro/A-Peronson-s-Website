# Commit 0013: Use Shared Global Navbar and Add 3D Dark Styling Across Pages

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0013                                       |
| **Commit Hash**   | `020952ff33af20d10d829390401239c1fff5af0d` |
| **Parent Hash**   | `daba2ccb910d4be00c31d3d955a9e1db8a904b29` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-01 19:25:48 (+0600)                |
| **Files Changed** | 121                                        |
| **Additions**     | 5,713                                      |
| **Deletions**     | 541                                        |
| **Net Change**    | +5,172 lines                               |
| **Merge Commit**  | No                                         |

## Custom Title

**Global 3D Dark Styling Applied Across All Page Components**

## High-Level Summary

This root branch applies a comprehensive 3D dark styling pass across every page component in the application. It updates `src/App.css` and `src/index.css` with 3D effects (inset highlights, neon glows, lifted shadows, hover transforms) and modifies all 25+ page components and the MvpDashboard to use CSS variables and shared styling. The commit also brings the Electron setup, enterprise backend, and all previous features.

## Key Changes

**`src/App.css`** — CSS custom properties (`--bg`, `--surface`, `--text`, `--border`) for theming. 3D card/button styles with inset highlights and shadows. Dark mode adds cyan and purple neon glow effects. Focus rings with sky-blue glow.

**All page components** — Stripped of inline dark mode classes and restyled to use CSS variable-based theming. Classes like `bg-white`, `bg-gray-50` replaced with variable-driven styling.

## Why

To create a consistent, modern 3D UI across the entire application with proper dark mode support. The neon glow effects in dark mode give the app a distinctive visual identity.

## Relationship

This branch will be further polished in commit 0014 and merged in 0015.
