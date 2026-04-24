import fs from "node:fs/promises";
import path from "node:path";
import { jest } from "@jest/globals";

async function readSource(relPath) {
  return fs.readFile(path.join(process.cwd(), relPath), "utf8");
}

function makeStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(String(key), String(value));
    },
    removeItem(key) {
      map.delete(String(key));
    },
    clear() {
      map.clear();
    },
  };
}

describe("NavBar auth-state rendering contracts", () => {
  test("NavBar reads auth state and defines public/auth link sets", async () => {
    const source = await readSource("src/components/NavBar.jsx");
    expect(source).toMatch(
      /import \{ apiRequest, clearSession, getCurrentUser, getRoleHome, getToken \} from '\.\.\/lib\/auth'/,
    );
    expect(source).toMatch(/const publicLinks = \[/);
    expect(source).toMatch(/const authenticatedLinks = \[/);
    expect(source).toMatch(/const user = getCurrentUser\(\)/);
  });
});

describe("App routing lifecycle event tracking contracts", () => {
  test("AppLayout tracks page view, duration, and session boundaries", async () => {
    const source = await readSource("src/App.jsx");
    expect(source).toMatch(/trackClientEvent\('page_duration'/);
    expect(source).toMatch(/trackClientEvent\('page_view'/);
    expect(source).toMatch(/trackClientEvent\('session_start'/);
    expect(source).toMatch(/trackClientEvent\('session_end'/);
    expect(source).toMatch(/document\.addEventListener\('visibilitychange'/);
    expect(source).toMatch(/window\.addEventListener\('beforeunload'/);
  });

  test("AppLayout tracks click interactions", async () => {
    const source = await readSource("src/App.jsx");
    expect(source).toMatch(
      /document\.addEventListener\('click', handleClick\)/,
    );
    expect(source).toMatch(/trackClientEvent\('click'/);
  });
});

describe("events.js side effects", () => {
  test("trackClientEvent ignores unknown event types", async () => {
    jest.resetModules();
    const apiRequest = jest.fn();

    global.localStorage = makeStorage();
    global.sessionStorage = makeStorage();

    jest.unstable_mockModule("../../src/lib/auth.js", () => ({
      apiRequest,
      getToken: () => "",
    }));

    const events = await import("../../src/lib/events.js");
    await events.trackClientEvent("unknown_event_type", {
      entityType: "route",
      entityId: "/x",
    });
    expect(apiRequest).not.toHaveBeenCalled();
  });

  test("trackClientEvent sends canonical payload for known events", async () => {
    jest.resetModules();
    const apiRequest = jest.fn(async () => ({}));

    global.localStorage = makeStorage();
    global.sessionStorage = makeStorage();

    jest.unstable_mockModule("../../src/lib/auth.js", () => ({
      apiRequest,
      getToken: () => "token-123",
    }));

    const events = await import("../../src/lib/events.js");
    await events.trackClientEvent("Page View", {
      entityType: "route",
      entityId: "/feed",
      metadata: { foo: "bar" },
    });

    expect(apiRequest).toHaveBeenCalledTimes(1);
    const [pathArg, requestArg] = apiRequest.mock.calls[0];
    expect(pathArg).toBe("/events");
    expect(requestArg.method).toBe("POST");
    expect(requestArg.body.type).toBe("page_view");
    expect(requestArg.body.entity_type).toBe("route");
    expect(requestArg.body.entity_id).toBe("/feed");
    expect(requestArg.body.metadata.actor_type).toBe("user");
    expect(requestArg.body.metadata.source_module).toBe("web_client");
    expect(requestArg.body.metadata.session_id).toBeTruthy();
    expect(requestArg.body.client_id).toBeTruthy();
  });

  test("client and session ids persist in storage", async () => {
    jest.resetModules();
    global.localStorage = makeStorage();
    global.sessionStorage = makeStorage();

    jest.unstable_mockModule("../../src/lib/auth.js", () => ({
      apiRequest: async () => ({}),
      getToken: () => "",
    }));

    const events = await import("../../src/lib/events.js");
    const clientA = events.getClientId();
    const clientB = events.getClientId();
    const sessionA = events.getSessionId();
    const sessionB = events.getSessionId();

    expect(clientA).toBe(clientB);
    expect(sessionA).toBe(sessionB);
    expect(global.localStorage.getItem("gt_client_id")).toBe(clientA);
    expect(global.sessionStorage.getItem("gt_session_id")).toBe(sessionA);
  });
});
