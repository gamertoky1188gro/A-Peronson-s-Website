import { jest } from "@jest/globals";

function makeStorage() {
	const map = new Map();
	return {
		getItem: (k) => (map.has(k) ? map.get(k) : null),
		setItem: (k, v) => {
			map.set(String(k), String(v));
		},
		removeItem: (k) => {
			map.delete(k);
		},
		clear: () => {
			map.clear();
		},
	};
}

describe("client event tracking (src/lib/events.js)", () => {
	beforeEach(() => {
		const local = makeStorage();
		const session = makeStorage();
		Object.defineProperty(window, "localStorage", {
			value: local,
			configurable: true,
			writable: true,
		});
		Object.defineProperty(window, "sessionStorage", {
			value: session,
			configurable: true,
			writable: true,
		});
		global.localStorage = local;
		global.sessionStorage = session;
	});

	test("getClientId persists one id in localStorage", async () => {
		jest.resetModules();
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({
			apiRequest: jest.fn(),
			getToken: () => "",
		}));
		const { getClientId } = await import("../../src/lib/events.js");
		const first = getClientId();
		expect(typeof first).toBe("string");
		expect(getClientId()).toBe(first);
		expect(global.localStorage.getItem("gt_client_id")).toBe(first);
	});

	test("getSessionId persists one id in sessionStorage", async () => {
		jest.resetModules();
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({
			apiRequest: jest.fn(),
			getToken: () => "",
		}));
		const { getSessionId } = await import("../../src/lib/events.js");
		const first = getSessionId();
		expect(getSessionId()).toBe(first);
		expect(global.sessionStorage.getItem("gt_session_id")).toBe(first);
	});

	test("trackClientEvent drops non-canonical event types without any request", async () => {
		jest.resetModules();
		const apiRequest = jest.fn();
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest, getToken: () => "" }));
		const { trackClientEvent } = await import("../../src/lib/events.js");
		await trackClientEvent("definitely_not_a_real_event", { entityType: "route", entityId: "/x" });
		expect(apiRequest).not.toHaveBeenCalled();
	});

	test("trackClientEvent posts a canonical payload for page_view", async () => {
		jest.resetModules();
		const apiRequest = jest.fn(async () => ({}));
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest, getToken: () => "" }));
		const { trackClientEvent } = await import("../../src/lib/events.js");
		await trackClientEvent("page_view", { entityType: "route", entityId: "/feed" });
		expect(apiRequest).toHaveBeenCalledTimes(1);
		const [path, options] = apiRequest.mock.calls[0];
		expect(path).toBe("/events");
		expect(options.method).toBe("POST");
		expect(options.body.type).toBe("page_view");
		expect(options.body.entity_type).toBe("route");
		expect(options.body.entity_id).toBe("/feed");
		expect(typeof options.body.client_id).toBe("string");
	});

	test("trackClientEvent never throws when the request fails", async () => {
		jest.resetModules();
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({
			apiRequest: () => Promise.reject(new Error("network down")),
			getToken: () => "",
		}));
		const { trackClientEvent } = await import("../../src/lib/events.js");
		await expect(
			trackClientEvent("click", { entityType: "button", entityId: "save" }),
		).resolves.toBeUndefined();
	});
});
