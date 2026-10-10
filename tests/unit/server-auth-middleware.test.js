import { jest } from "@jest/globals";

const mockFindUserById = jest.fn();

function mockRes() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

describe("auth middleware (server/middleware/auth.js)", () => {
	let auth;

	beforeEach(async () => {
		jest.resetModules();
		mockFindUserById.mockReset();
		mockFindUserById.mockResolvedValue({ id: "u-1", status: "active" });
		jest.unstable_mockModule("../../server/services/userService.js", () => ({
			findUserById: (...args) => mockFindUserById(...args),
		}));
		auth = await import("../../server/middleware/auth.js");
	});

	test("signToken creates a verifiable JWT with the platform claims", async () => {
		const { default: jwt } = await import("jsonwebtoken");
		const token = auth.signToken({ id: "u-1", role: "buyer", email: "b@x.com" });
		const decoded = jwt.verify(token, process.env.JWT_SECRET, {
			issuer: "gartexhub-api",
			audience: "gartexhub-client",
		});
		expect(decoded).toMatchObject({ id: "u-1", role: "buyer", email: "b@x.com" });
	});

	test("requireAuth rejects requests without a bearer token", async () => {
		const res = mockRes();
		const next = jest.fn();
		await auth.requireAuth({ headers: {}, method: "GET", path: "/api/users/me" }, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	test("requireAuth rejects forged tokens", async () => {
		const res = mockRes();
		await auth.requireAuth(
			{
				headers: { authorization: "Bearer forged.token.here" },
				method: "GET",
				path: "/api/users/me",
			},
			res,
			jest.fn(),
		);
		expect(res.status).toHaveBeenCalledWith(401);
	});

	test("requireAuth passes valid users through", async () => {
		const token = auth.signToken({ id: "u-1", role: "factory", email: "f@x.com" });
		const req = {
			headers: { authorization: `Bearer ${token}` },
			method: "GET",
			path: "/api/users/me",
		};
		const next = jest.fn();
		await auth.requireAuth(req, mockRes(), next);
		expect(next).toHaveBeenCalled();
		expect(req.user).toMatchObject({ id: "u-1", role: "factory" });
	});

	test("requireAuth blocks locked accounts except the unlock/logout allowlist", async () => {
		mockFindUserById.mockResolvedValue({ id: "u-9", status: "locked" });
		const token = auth.signToken({ id: "u-9", role: "buyer", email: "b@x.com" });

		const blocked = mockRes();
		await auth.requireAuth(
			{ headers: { authorization: `Bearer ${token}` }, method: "GET", path: "/api/users/me" },
			blocked,
			jest.fn(),
		);
		expect(blocked.status).toHaveBeenCalledWith(403);

		const allowed = mockRes();
		const next = jest.fn();
		await auth.requireAuth(
			{
				headers: { authorization: `Bearer ${token}` },
				method: "DELETE",
				path: "/api/users/me/lock",
			},
			allowed,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test("requireAuth rejects tokens issued before a password reset", async () => {
		mockFindUserById.mockResolvedValue({
			id: "u-2",
			status: "active",
			password_reset_at: new Date(Date.now() + 3_600_000).toISOString(),
		});
		const token = auth.signToken({ id: "u-2", role: "buyer", email: "b@x.com" });
		const res = mockRes();
		await auth.requireAuth(
			{ headers: { authorization: `Bearer ${token}` }, method: "GET", path: "/api/users/me" },
			res,
			jest.fn(),
		);
		expect(res.status).toHaveBeenCalledWith(401);
	});

	test("optionalAuth continues anonymously on missing/invalid tokens", async () => {
		const next = jest.fn();
		const anon = { headers: {}, method: "GET", path: "/" };
		await auth.optionalAuth(anon, {}, next);
		expect(anon.user).toBeNull();
		expect(next).toHaveBeenCalled();
	});

	test("allowRoles gates handlers by role", () => {
		const factoryOnly = auth.allowRoles("factory");
		const next = jest.fn();
		factoryOnly({ user: { role: "factory" } }, mockRes(), next);
		expect(next).toHaveBeenCalled();

		const res = mockRes();
		factoryOnly({ user: { role: "buyer" } }, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(403);
	});
});
