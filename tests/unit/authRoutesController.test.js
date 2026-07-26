import { login, register } from "../../server/controllers/authController.js";
import authRoutes from "../../server/routes/authRoutes.js";

function createMockRes() {
	return {
		statusCode: 200,
		body: null,
		status(code) {
			this.statusCode = code;
			return this;
		},
		json(payload) {
			this.body = payload;
			return this;
		},
	};
}

function routeEntries(router) {
	return router.stack
		.filter((layer) => layer.route)
		.map((layer) => ({
			path: layer.route.path,
			methods: Object.keys(layer.route.methods),
		}));
}

describe("auth routes and controller", () => {
	test("authRoutes exposes register/login/me endpoints", () => {
		const entries = routeEntries(authRoutes);
		expect(entries).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: "/register",
					methods: expect.arrayContaining(["post"]),
				}),
				expect.objectContaining({
					path: "/login",
					methods: expect.arrayContaining(["post"]),
				}),
				expect.objectContaining({
					path: "/me",
					methods: expect.arrayContaining(["get"]),
				}),
			]),
		);
	});

	test("register rejects invalid role", async () => {
		process.env.NODE_ENV = "test";
		const req = {
			body: {
				name: "Test User",
				email: "invalid-role@example.com",
				password: "pw123456",
				role: "hacker",
				company_name: "Test Org",
				profile: { country: "Bangladesh", position: "Owner" },
			},
		};
		const res = createMockRes();

		await register(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({ error: "Invalid role" });
	});

	test("register then login succeeds with identifier", async () => {
		process.env.NODE_ENV = "test";
		const suffix = Date.now();
		const email = `auth-${suffix}@example.com`;
		const password = "pw123456";

		const registerReq = {
			body: {
				name: "Auth User",
				email,
				password,
				role: "buyer",
				company_name: "Auth Org",
				profile: { country: "Bangladesh", position: "Owner" },
			},
		};
		const registerRes = createMockRes();
		await register(registerReq, registerRes);

		expect(registerRes.statusCode).toBe(201);
		expect(registerRes.body?.user?.email).toBe(email);
		expect(registerRes.body?.token).toBeTruthy();

		const loginReq = {
			body: {
				identifier: email,
				password,
			},
		};
		const loginRes = createMockRes();
		await login(loginReq, loginRes);

		expect(loginRes.statusCode).toBe(200);
		expect(loginRes.body?.user?.email).toBe(email);
		expect(loginRes.body?.token).toBeTruthy();

	});

	test("register rejects factory accounts without a sector", async () => {
		process.env.NODE_ENV = "test";
		const req = {
			body: {
				name: "Factory User",
				email: "factory-no-sector@example.com",
				password: "pw123456",
				role: "factory",
				company_name: "Factory Org",
				profile: { country: "Bangladesh", position: "Owner" },
			},
		};
		const res = createMockRes();

		await register(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({ error: "Missing field: factory_sector" });
	});
});

afterAll(() => {
	process.env.NODE_ENV = "test";
});
