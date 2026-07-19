## Commit Metadata

- **Hash:** 9e3c56e7e7190ec0477f29996c47bc695abe25e2
- **Parent:** b823097673c15e1f2d49e53b02aa3060ff7bbfe8
- **Author:** gamertoky1188gro
- **Date:** 2026-03-31 21:51:44
- **Message:** Add request logging and timeout diagnostics

## Custom Title

Request logger middleware and timeout diagnostics

## High-Level Summary

Added a comprehensive request logging middleware with timing, headers, and body logging. Updated the server to use it, added query timeout diagnostics to the database utility, and refactored the frontend auth lib to improve API request timeout handling and error logging.

## File-by-File Breakdown

- **server/middleware/requestLogger.js** — New middleware (120 lines): logs method, URL, status, duration, user agent, referrer, IP, request/response headers, body summary
- **server/server.js** — Added requestLogger import and `app.use()`
- **server/utils/db.js** — Added query timeout configuration and timeout error diagnostics
- **src/lib/auth.js** — Refactored API request function with better timeout handling, error classification, and logging
- **.env** — Updated database connection or timeout config (1 line changed)

## Detailed Diff Analysis

**requestLogger.js:** Captures start time, logs after response with duration, sanitizes auth headers, logs truncated body for POST/PUT, outputs to console with timestamp.

**server.js:** Simple middleware registration.

**db.js:** Added timeout detection for database queries with configurable threshold.

**auth.js:** Restructured `apiRequest` to use AbortController for timeout, classifies errors (timeout, network, server, auth), provides descriptive error messages.

## Why This Change

To diagnose slow requests and timeouts, both on server and client side. Essential for debugging performance issues.

## Was It Useful

Yes. The logger provides observability; timeout diagnostics help identify slow queries.

## Impact Analysis

- **Scope:** 5 files across server and client
- **Risk:** Low — all additions are behind feature flags or opt-in
- **Performance:** Minimal overhead from logging

## Relationships

Baseline for diagnosing issues in subsequent passkey commits (162+).

## Confidence Notes

High. Well-structured middleware with proper sanitization.
