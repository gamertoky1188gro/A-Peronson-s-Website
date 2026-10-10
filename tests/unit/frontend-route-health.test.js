import { isRouteValid, ROUTE_MANIFEST } from "../../src/lib/routeHealthCheck.js";

describe("route health check (src/lib/routeHealthCheck.js)", () => {
	test("manifest lists the real application routes", () => {
		for (const path of [
			"/",
			"/login",
			"/signup",
			"/feed",
			"/search",
			"/chat",
			"/call",
			"/owner",
			"/contracts",
			"/leads",
			"/verification",
			"/agent",
			"/admin",
			"/orders",
			"/notifications",
			"/insights",
			"/support",
			"/profile/:id",
			"/share/:entityType/:entityId",
			"/boosts/:id",
		]) {
			expect(ROUTE_MANIFEST).toContain(path);
		}
	});

	test("accepts exact manifest routes", () => {
		expect(isRouteValid("/")).toBe(true);
		expect(isRouteValid("/feed")).toBe(true);
		expect(isRouteValid("/owner")).toBe(true);
		expect(isRouteValid("/contracts")).toBe(true);
		expect(isRouteValid("/admin/governance")).toBe(true);
	});

	test("accepts dynamic entity routes via patterns", () => {
		expect(isRouteValid("/industry/denim")).toBe(true);
		expect(isRouteValid("/buyer/abc123")).toBe(true);
		expect(isRouteValid("/factory/f-9")).toBe(true);
		expect(isRouteValid("/buying-house/bh-1")).toBe(true);
		expect(isRouteValid("/profile/user-42")).toBe(true);
		expect(isRouteValid("/share/product/p-1")).toBe(true);
		expect(isRouteValid("/boosts/b-7")).toBe(true);
		expect(isRouteValid("/join-requests/req-3")).toBe(true);
	});

	test("rejects unknown, empty, and wildcard paths", () => {
		expect(isRouteValid("/verification-center")).toBe(false);
		expect(isRouteValid("/contract-vault")).toBe(false);
		expect(isRouteValid("/definitely-not-a-route")).toBe(false);
		expect(isRouteValid("")).toBe(false);
		expect(isRouteValid(null)).toBe(false);
		expect(isRouteValid("*")).toBe(false);
	});

	test("does not match nested paths under a dynamic segment", () => {
		expect(isRouteValid("/buyer/123/orders")).toBe(false);
		expect(isRouteValid("/industry")).toBe(false);
	});
});
