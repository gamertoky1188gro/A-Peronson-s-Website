# Playwright Configuration

**File:** `playwright.config.ts`

## Purpose
E2E test runner configuration for Playwright

## Configuration

| Property | Value | Description |
|----------|-------|-------------|
| `testDir` | `tests/e2e` | Test directory |
| `timeout` | `30000ms` | Test timeout |
| `baseURL` | `http://localhost:4000` | Base URL (configurable via `E2E_BASE_URL`) |

## Web Server

| Setting | Value | Description |
|---------|-------|-------------|
| `command` | `node server/server.js` | Start server command |
| `url` | `http://localhost:4000` | Server URL |
| `reuseExistingServer` | `true` | Reuse running server |
| `timeout` | `120000ms` | Startup timeout |
| `env.NODE_ENV` | `test` | Node environment |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `E2E_WEB_SERVER` | (empty) | Enable/disable web server |
| `E2E_BASE_URL` | `http://localhost:4000` | Base URL |
| `ALLOW_DB_OFFLINE` | `true` | Allow offline DB |

---

*Generated from: playwright.config.ts*