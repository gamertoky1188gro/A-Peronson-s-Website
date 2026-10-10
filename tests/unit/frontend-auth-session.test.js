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

describe("frontend session helpers (src/lib/auth.js)", () => {
	let auth;

	beforeEach(async () => {
		jest.resetModules();
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
		auth = await import("../../src/lib/auth.js");
	});

	test("getToken reads localStorage first, then sessionStorage", () => {
		expect(auth.getToken()).toBe("");
		global.sessionStorage.setItem("jwt", "session-token");
		expect(auth.getToken()).toBe("session-token");
		global.localStorage.setItem("jwt", "local-token");
		expect(auth.getToken()).toBe("local-token");
	});

	test("saveSession persists user + token per remember flag", () => {
		const user = { id: "u-1", name: "Buyer", email: "b@x.com", role: "buyer" };
		auth.saveSession(user, "tok-1", { remember: true });
		expect(global.localStorage.getItem("jwt")).toBe("tok-1");
		expect(global.sessionStorage.getItem("jwt")).toBeNull();
		expect(JSON.parse(global.localStorage.getItem("user"))).toMatchObject({
			id: "u-1",
			role: "buyer",
		});

		auth.saveSession(user, "tok-2", { remember: false });
		expect(global.localStorage.getItem("jwt")).toBeNull();
		expect(global.sessionStorage.getItem("jwt")).toBe("tok-2");
	});

	test("persistUser stores only the minimal safe subset", () => {
		const minimal = auth.persistUser({
			id: "u-2",
			name: "Factory",
			email: "f@x.com",
			role: "factory",
			entitlements: { features: { secret: true } },
			profile: {
				avatar_url: "a",
				profile_image: "p",
				organization_name: "Org",
				secret_field: "must-not-persist",
			},
		});
		expect(minimal).not.toHaveProperty("entitlements");
		expect(minimal.profile).not.toHaveProperty("secret_field");
		expect(minimal.profile.organization_name).toBe("Org");
		expect(auth.persistUser(null)).toBeNull();
	});

	test("getCurrentUser primes from storage on a cold cache", () => {
		global.localStorage.setItem("jwt", "tok");
		global.localStorage.setItem(
			"user",
			JSON.stringify({ id: "u-3", name: "N", email: "e@x.com", role: "buyer" }),
		);
		const user = auth.getCurrentUser();
		expect(user).toMatchObject({ id: "u-3" });
	});

	test("getCurrentUser returns null without a token", () => {
		expect(auth.getCurrentUser()).toBeNull();
	});

	test("clearSession removes user and tokens from both storages", () => {
		auth.saveSession({ id: "u-9", role: "buyer" }, "tok");
		auth.clearSession();
		expect(auth.getToken()).toBe("");
		expect(global.localStorage.getItem("user")).toBeNull();
	});

	test("getRoleHome routes every role to the feed", () => {
		for (const role of ["buyer", "factory", "buying_house", "owner", "admin", "agent"]) {
			expect(auth.getRoleHome(role)).toBe("/feed");
		}
	});

	test("hasEntitlement checks feature flags then premium plan fallback", () => {
		expect(
			auth.hasEntitlement(
				{ features: { advanced_search_filters: true } },
				"advanced_search_filters",
			),
		).toBe(true);
		expect(
			auth.hasEntitlement(
				{ features: { advanced_search_filters: false } },
				"advanced_search_filters",
			),
		).toBe(false);
		expect(auth.hasEntitlement({ plan: "premium" }, "any_feature")).toBe(true);
		expect(auth.hasEntitlement({ subscription_status: "premium" }, "any_feature")).toBe(true);
		expect(auth.hasEntitlement({ plan: "free" }, "any_feature")).toBe(false);
		expect(auth.hasEntitlement(null, "x")).toBe(false);
		expect(auth.hasEntitlement({}, null)).toBe(false);
	});
});
