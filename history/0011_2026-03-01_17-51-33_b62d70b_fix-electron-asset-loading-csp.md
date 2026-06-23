# Commit 0011: Fix Electron Asset Loading and Add CSP for Desktop Runtime

## Commit Metadata

| Field | Value |
|-------|-------|
| **Commit Number** | 0011 |
| **Commit Hash** | `b62d70b824df43fe7d0f6731c369c8f0d8c4e09e` |
| **Parent Hash** | `daba2ccb910d4be00c31d3d955a9e1db8a904b29` |
| **Author** | Cyber Code Master |
| **Date/Time** | 2026-03-01 17:51:33 (+0600) |
| **Files Changed** | 101 |
| **Additions** | 5,540 |
| **Deletions** | 195 |
| **Net Change** | +5,345 lines |
| **Merge Commit** | No |

## Custom Title

**Fix Electron Asset Paths and Add Content Security Policy**

## High-Level Summary

This root branch fixes Electron's inability to load assets by changing Vite's `base` from `/` to `./` (relative paths) and updating `index.html` to use relative paths. It adds a Content-Security-Policy meta tag restricting resources to `'self'` with exceptions for Google Fonts and the local API server. The page title is changed from "meow" to "GarTexHub". Dist build output files are included.

## Key Files

**`vite.config.js`** — Added `base: './'` for relative asset paths (required for Electron's `file://` protocol).

**`index.html`** — Changed `<link href="/vite.svg">` to `./vite.svg`, `<script src="/src/main.jsx">` to `./src/main.jsx`. Added CSP meta tag: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' http://localhost:4000`. Changed title to "GarTexHub".

**`dist/`** — Build output files included in the commit.

## Why

Electron loads from `file://` protocol, so absolute paths like `/src/main.jsx` fail. The CSP is essential for desktop security. The relative base ensures all assets resolve correctly.

## Relationship

This branch will be merged in commit 0012.
