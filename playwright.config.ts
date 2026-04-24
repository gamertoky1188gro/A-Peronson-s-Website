import { defineConfig } from "@playwright/test";

const enableWebServer =
  String(process.env.E2E_WEB_SERVER || "").toLowerCase() === "true";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:4000",
  },
  ...(enableWebServer
    ? {
        webServer: {
          command: "node server/server.js",
          url: process.env.E2E_BASE_URL || "http://localhost:4000",
          reuseExistingServer: true,
          timeout: 120000,
          env: {
            ...process.env,
            NODE_ENV: process.env.NODE_ENV || "test",
            ALLOW_DB_OFFLINE: process.env.ALLOW_DB_OFFLINE || "true",
          },
        },
      }
    : {}),
});
