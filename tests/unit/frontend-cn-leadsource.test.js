import { cn } from "../../src/lib/cn.js";
import { consumeLeadSource, peekLeadSource, recordLeadSource } from "../../src/lib/leadSource.js";

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

function installStorage() {
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
}

describe("cn classnames helper (src/lib/cn.js)", () => {
	test("joins truthy classes and drops falsy values", () => {
		expect(cn("a", "b", "c")).toBe("a b c");
		expect(cn("a", false, "c", undefined, null, "")).toBe("a c");
		expect(cn()).toBe("");
	});
});

describe("lead source attribution (src/lib/leadSource.js)", () => {
	beforeEach(() => {
		installStorage();
	});

	test("records a lead source only when type and id are present", () => {
		expect(recordLeadSource({ type: "product", id: "p-1", label: "Denim" })).toBe(true);
		expect(recordLeadSource({ type: "", id: "p-1" })).toBe(false);
		expect(recordLeadSource({ type: "product", id: "" })).toBe(false);
		expect(recordLeadSource({})).toBe(false);
	});

	test("peek returns the stored entry and consume clears it", () => {
		recordLeadSource({ type: "buyer-request", id: "r-9" });
		const peeked = peekLeadSource();
		expect(peeked).toMatchObject({ type: "buyer-request", id: "r-9" });
		expect(typeof peeked.ts).toBe("number");

		const consumed = consumeLeadSource();
		expect(consumed).toMatchObject({ type: "buyer-request", id: "r-9" });
		expect(peekLeadSource()).toBeNull();
	});

	test("peek returns null for missing, corrupt, or expired entries", () => {
		expect(peekLeadSource()).toBeNull();

		global.localStorage.setItem("gt_lead_source", "not-json{{");
		expect(peekLeadSource()).toBeNull();

		recordLeadSource({ type: "product", id: "p-2" });
		expect(peekLeadSource({ maxAgeMs: -1 })).toBeNull();
	});

	test("returns false when storage throws", () => {
		const throwing = {
			getItem: () => null,
			setItem: () => {
				throw new Error("blocked");
			},
			removeItem: () => {
				throw new Error("blocked");
			},
		};
		Object.defineProperty(window, "localStorage", {
			value: throwing,
			configurable: true,
			writable: true,
		});
		global.localStorage = throwing;
		expect(recordLeadSource({ type: "product", id: "p-3" })).toBe(false);
		expect(peekLeadSource()).toBeNull();
		expect(consumeLeadSource()).toBeNull();
	});
});
