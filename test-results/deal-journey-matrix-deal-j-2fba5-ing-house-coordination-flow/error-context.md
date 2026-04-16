# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deal-journey-matrix.spec.ts >> deal journey matrix >> buying-house coordination flow
- Location: tests\e2e\deal-journey-matrix.spec.ts:27:5

# Error details

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:4000
Call log:
  - → POST http://localhost:4000/api/deal-journeys/events
    - user-agent: Playwright/1.59.1 (x64; windows 10.0) node/24.14
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/json
    - content-length: 167

```