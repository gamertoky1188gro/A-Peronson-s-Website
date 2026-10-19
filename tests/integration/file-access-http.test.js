import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Exercises the REAL router so a regression in a handler fails here rather than
// in production. Only the two Task-2/3 collaborators are replaced; the
// authorization and signing cores are stubbed at their public seams so the route
// logic itself — status mapping, ttl selection, signature rejection — is what is
// under test. Prisma is additionally neutralised by userService: without a
// mocked findUserById the real requireAuth would resolve a token against the
// database, and /sign must not need a live connection to be exercised.
const authorizeFilePath = jest.fn();
const signFileUrl = jest.fn();
const verifySignedFile = jest.fn();
const findUserById = jest.fn();
const uploadsRoot = jest.fn(() => "server/uploads");

const MOCK_UPLOADS_ROOT = path.resolve("server/uploads");

jest.unstable_mockModule("../../server/services/fileAccessService.js", () => ({
	authorizeFilePath,
}));
jest.unstable_mockModule("../../server/utils/signedFileUrl.js", () => ({
	GATED_PREFIXES: ["chat", "contracts", "calls", "search"],
	MEDIA_TTL_MS: 900_000,
	// Mirrors the real path helpers instead of collapsing them to constants, so
	// the route is still exercised through the canonical-path logic it relies on.
	resolveWithinUploads: (relPath) =>
		path.resolve(
			MOCK_UPLOADS_ROOT,
			String(relPath)
				.replace(/^\/uploads\/?/, "")
				.replace(/^\/+/, ""),
		),
	signFileUrl,
	toPublicPath: (absPath) =>
		`/uploads/${path.relative(MOCK_UPLOADS_ROOT, absPath).split(path.sep).join("/")}`,
	uploadsRoot,
	verifySignedFile,
}));
jest.unstable_mockModule("../../server/services/userService.js", () => ({
	findUserById,
}));

const { signToken } = await import("../../server/middleware/auth.js");
const fileAccessRoutes = (await import("../../server/routes/fileAccessRoutes.js")).default;

const USER = { id: "buyer1", role: "buyer" };
const AUTH = { Authorization: `Bearer ${signToken({ ...USER, email: "buyer1@x.com" })}` };

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/files", fileAccessRoutes);
	return app;
}

beforeEach(() => {
	authorizeFilePath.mockReset();
	signFileUrl.mockReset();
	verifySignedFile.mockReset();
	findUserById.mockReset();
	findUserById.mockResolvedValue(USER);
});

describe("file access routes (real router)", () => {
	test("mints a signed url for an authorized path", async () => {
		authorizeFilePath.mockResolvedValue({ ok: true, doc: { id: "d1" } });
		signFileUrl.mockReturnValue("/api/files/content?path=x&exp=1&uid=buyer1&sig=abc");
		const res = await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["/uploads/contracts/a.pdf"] })
			.expect(200);
		expect(res.body.signed["/uploads/contracts/a.pdf"].url).toContain("sig=abc");
		expect(signFileUrl).toHaveBeenCalledWith(expect.objectContaining({ userId: "buyer1" }));
	});

	test("uses the longer media ttl only for call recordings", async () => {
		authorizeFilePath.mockResolvedValue({ ok: true, doc: { id: "d1" } });
		signFileUrl.mockReturnValue("/api/files/content?x=1");
		await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["/uploads/calls/r.mp4"] })
			.expect(200);
		expect(signFileUrl).toHaveBeenCalledWith(expect.objectContaining({ ttlMs: 900_000 }));
	});

	test("maps a forbidden verdict to 403 instead of minting", async () => {
		authorizeFilePath.mockResolvedValue({ ok: false, reason: "forbidden" });
		const res = await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["/uploads/contracts/a.pdf"] })
			.expect(200);
		expect(res.body.signed["/uploads/contracts/a.pdf"]).toMatchObject({
			error: "forbidden",
			status: 403,
		});
		expect(signFileUrl).not.toHaveBeenCalled();
	});

	test("maps a not_found verdict to 404", async () => {
		authorizeFilePath.mockResolvedValue({ ok: false, reason: "not_found" });
		const res = await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["/uploads/contracts/a.pdf"] })
			.expect(200);
		expect(res.body.signed["/uploads/contracts/a.pdf"].status).toBe(404);
	});

	test("rejects an invalid signature on the content route", async () => {
		verifySignedFile.mockReturnValue({ ok: false, reason: "bad_signature" });
		await request(buildApp())
			.get("/api/files/content")
			.query({ path: "/uploads/contracts/a.pdf", exp: 1, uid: "buyer1", sig: "x" })
			.expect(403);
	});
});

// --- symlink escape guard -------------------------------------------------
//
// Task 2's containment is lexical (path.resolve), so a symlink planted inside
// server/uploads satisfies every lexical check and still resolves outside the
// root. /content therefore re-checks the realpath before serving.
//
// Windows refuses symlink creation for a non-elevated process (EPERM without
// Developer Mode), so the probe runs once up front and the test registers as
// *skipped* rather than silently passing when the platform will not cooperate.
const PROBE_DIR = "server/uploads/contracts";
const PROBE_NAME = `__escape-probe-${process.pid}.pdf`;
const PROBE_OUTSIDE = path.join(os.tmpdir(), `escape-target-${process.pid}.pdf`);

const probe = await createEscapeProbe();
const symlinkTest = probe.created ? test : test.skip;
const symlinkName = probe.created
	? "refuses to serve a symlink that escapes the uploads root"
	: `refuses to serve a symlink that escapes the uploads root [platform refused the probe: ${probe.reason}]`;

afterAll(async () => {
	await fs.promises.rm(PROBE_OUTSIDE, { force: true }).catch(() => {});
	await fs.promises.rm(path.join(PROBE_DIR, PROBE_NAME), { force: true }).catch(() => {});
});

symlinkTest(symlinkName, async () => {
	verifySignedFile.mockReturnValue({
		ok: true,
		absPath: path.resolve(PROBE_DIR, PROBE_NAME),
	});
	const res = await request(buildApp())
		.get("/api/files/content")
		.query({
			path: `/uploads/contracts/${PROBE_NAME}`,
			exp: Date.now() + 60_000,
			uid: "buyer1",
			sig: "irrelevant",
		})
		.expect(403);
	// biome-ignore lint/suspicious/noMisplacedAssertion: false positive, the assertion is inside the test above
	expect(res.body.reason).toBe("symlink_escape");
});

async function createEscapeProbe() {
	try {
		await fs.promises.mkdir(PROBE_DIR, { recursive: true });
		await fs.promises.writeFile(PROBE_OUTSIDE, "not a real contract");
		await fs.promises.rm(path.join(PROBE_DIR, PROBE_NAME), { force: true });
		await fs.promises.symlink(PROBE_OUTSIDE, path.join(PROBE_DIR, PROBE_NAME), "file");
		return { created: true, reason: "" };
	} catch (error) {
		await fs.promises.rm(PROBE_OUTSIDE, { force: true }).catch(() => {});
		return { created: false, reason: error.code || error.message };
	}
}
