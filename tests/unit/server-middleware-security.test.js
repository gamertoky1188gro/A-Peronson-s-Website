import fs from "node:fs";
import path from "node:path";
import { jest } from "@jest/globals";
import { requireDualExportApproval } from "../../server/middleware/adminDualConfirm.js";
import { requireAdminStepUp } from "../../server/middleware/adminStepUp.js";
import { errorHandler } from "../../server/middleware/errorHandler.js";
import validateFiltersMiddleware from "../../server/middleware/validateSearchFilters.js";

function mockRes() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

describe("admin step-up middleware (server/middleware/adminStepUp.js)", () => {
	const OLD = process.env.ADMIN_STEPUP_CODE;
	afterEach(() => {
		if (OLD === undefined) {
			delete process.env.ADMIN_STEPUP_CODE;
		} else {
			process.env.ADMIN_STEPUP_CODE = OLD;
		}
		delete process.env.ADMIN_STEPUP_MAX_MINUTES;
	});

	test("passes through when no step-up code is configured", () => {
		delete process.env.ADMIN_STEPUP_CODE;
		const next = jest.fn();
		requireAdminStepUp({ headers: {} }, mockRes(), next);
		expect(next).toHaveBeenCalled();
	});

	test("rejects missing or wrong codes with 403", () => {
		process.env.ADMIN_STEPUP_CODE = "s3cret";
		for (const headers of [{}, { "x-admin-stepup": "wrong" }]) {
			const res = mockRes();
			const next = jest.fn();
			requireAdminStepUp({ headers }, res, next);
			expect(res.status).toHaveBeenCalledWith(403);
			expect(next).not.toHaveBeenCalled();
		}
	});

	test("accepts the correct code and enforces the timestamp window", () => {
		process.env.ADMIN_STEPUP_CODE = "s3cret";
		const next = jest.fn();
		requireAdminStepUp({ headers: { "x-admin-stepup": "s3cret" } }, mockRes(), next);
		expect(next).toHaveBeenCalled();

		const stale = mockRes();
		requireAdminStepUp(
			{
				headers: { "x-admin-stepup": "s3cret", "x-admin-stepup-at": new Date(2000).toISOString() },
			},
			stale,
			jest.fn(),
		);
		expect(stale.status).toHaveBeenCalledWith(403);
	});
});

describe("dual export approval (server/middleware/adminDualConfirm.js)", () => {
	const OLD_P = process.env.ADMIN_EXPORT_CODE_PRIMARY;
	const OLD_S = process.env.ADMIN_EXPORT_CODE_SECONDARY;
	afterEach(() => {
		if (OLD_P === undefined) {
			delete process.env.ADMIN_EXPORT_CODE_PRIMARY;
		} else {
			process.env.ADMIN_EXPORT_CODE_PRIMARY = OLD_P;
		}
		if (OLD_S === undefined) {
			delete process.env.ADMIN_EXPORT_CODE_SECONDARY;
		} else {
			process.env.ADMIN_EXPORT_CODE_SECONDARY = OLD_S;
		}
	});

	test("passes through when no export codes are configured", () => {
		delete process.env.ADMIN_EXPORT_CODE_PRIMARY;
		delete process.env.ADMIN_EXPORT_CODE_SECONDARY;
		const next = jest.fn();
		requireDualExportApproval({ user: { role: "owner" }, headers: {} }, mockRes(), next);
		expect(next).toHaveBeenCalled();
	});

	test("admins bypass dual approval", () => {
		process.env.ADMIN_EXPORT_CODE_PRIMARY = "one";
		process.env.ADMIN_EXPORT_CODE_SECONDARY = "two";
		const next = jest.fn();
		requireDualExportApproval({ user: { role: "admin" }, headers: {} }, mockRes(), next);
		expect(next).toHaveBeenCalled();
	});

	test("non-admins must present both codes", () => {
		process.env.ADMIN_EXPORT_CODE_PRIMARY = "one";
		process.env.ADMIN_EXPORT_CODE_SECONDARY = "two";
		const res = mockRes();
		requireDualExportApproval(
			{ user: { role: "owner" }, headers: { "x-admin-export-approval": "one" } },
			res,
			jest.fn(),
		);
		expect(res.status).toHaveBeenCalledWith(403);

		const ok = jest.fn();
		requireDualExportApproval(
			{ user: { role: "owner" }, headers: { "x-admin-export-approval": "one, two" } },
			mockRes(),
			ok,
		);
		expect(ok).toHaveBeenCalled();
	});
});

describe("error handler contract (server/middleware/errorHandler.js)", () => {
	test("returns a stable 500 payload without leaking internals", () => {
		const res = mockRes();
		errorHandler(new Error("db exploded"), {}, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
	});

	test("delegates when headers were already sent", () => {
		const res = mockRes();
		res.headersSent = true;
		const next = jest.fn();
		errorHandler(new Error("late"), {}, res, next);
		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});
});

describe("search filter validation middleware (server/middleware/validateSearchFilters.js)", () => {
	test("coerces query strings and attaches parsedFilters", () => {
		const req = { query: { verifiedOnly: "true", gsmMin: "180", category: "Denim,Knit" } };
		const res = mockRes();
		const next = jest.fn();
		validateFiltersMiddleware(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(req.parsedFilters).toMatchObject({ verifiedOnly: true, gsmMin: 180 });
		expect(req.parsedFilters.category).toEqual(["Denim", "Knit"]);
	});

	test("rejects mistyped filters with a 400 and detail entries", () => {
		const req = { query: { gsmMin: "not-a-number-at-all" } };
		// "not-a-number-at-all" stays a string -> schema expects number -> 400
		const res = mockRes();
		validateFiltersMiddleware(req, res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json.mock.calls[0][0].error).toMatch(/Invalid search filter/);
	});

	test("ignores unknown query keys the schema does not describe", () => {
		const req = { query: { someFutureFilter: "anything" } };
		const res = mockRes();
		const next = jest.fn();
		validateFiltersMiddleware(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("schema file itself is valid JSON with typed properties", () => {
		const schema = JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), "server", "schemas", "searchFilters.schema.json"),
				"utf8",
			),
		);
		expect(typeof schema.properties).toBe("object");
		expect(schema.properties.verifiedOnly.type).toBe("boolean");
	});
});
