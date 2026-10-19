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
const documentFindMany = jest.fn();
const documentViewCreate = jest.fn();
const prismaMock = {
	document: { findMany: documentFindMany },
	documentView: { create: documentViewCreate },
};

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
// The router writes DocumentView rows directly, so Prisma is stubbed here to
// assert that write. This is also what guarantees /sign reaches no database.
jest.unstable_mockModule("../../server/utils/prisma.js", () => ({ default: prismaMock }));

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

// sendFile types a .pdf as application/pdf, so supertest hands back a Buffer
// rather than a string.
function bodyText(res) {
	if (Buffer.isBuffer(res.body)) return res.body.toString();
	return String(res.text ?? res.body ?? "");
}

beforeEach(() => {
	authorizeFilePath.mockReset();
	signFileUrl.mockReset();
	verifySignedFile.mockReset();
	findUserById.mockReset();
	findUserById.mockResolvedValue(USER);
	documentFindMany.mockReset();
	documentFindMany.mockResolvedValue([]);
	documentViewCreate.mockReset();
	documentViewCreate.mockResolvedValue({});
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

		// The "only" half. Without it, an implementation that handed every path
		// MEDIA_TTL_MS would pass the assertion above.
		signFileUrl.mockClear();
		await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["/uploads/contracts/a.pdf"] })
			.expect(200);
		expect(signFileUrl).toHaveBeenCalledWith(expect.objectContaining({ ttlMs: undefined }));
	});

	test("does not let a caller-supplied key reach Object.prototype", async () => {
		// A plain `{}` accumulator turns this into a write through the inherited
		// __proto__ setter, which does not show up as an own key — the entry would
		// silently vanish from the response.
		authorizeFilePath.mockResolvedValue({ ok: false, reason: "not_gated" });
		const res = await request(buildApp())
			.post("/api/files/sign")
			.set(AUTH)
			.send({ paths: ["__proto__"] })
			.expect(200);
		expect(Object.keys(res.body.signed)).toEqual(["__proto__"]);
		expect(res.body.signed["__proto__"]).toMatchObject({ error: "not_gated", status: 400 });
		expect(Object.getPrototypeOf(res.body.signed)).toBe(Object.prototype);
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

// --- containment guard -----------------------------------------------------
//
// Task 2's containment is lexical (path.resolve), so a symlink planted inside
// server/uploads satisfies every lexical check and still resolves outside the
// root. /content therefore re-checks the realpath before serving.
//
// Both halves matter. A guard that 403s unconditionally would pass the escape
// test alone, so a genuine in-root file is planted alongside the symlink and
// must come back 200 with its bytes.
//
// Windows refuses symlink creation for a non-elevated process (EPERM without
// Developer Mode), so the probe runs once up front and that one test registers
// as *skipped* rather than silently passing when the platform will not
// cooperate. The in-root half runs unconditionally.
const PROBE_DIR = "server/uploads/contracts";
const INSIDE_NAME = `__contained-${process.pid}.pdf`;
const INSIDE_BODY = "INSIDE-UPLOADS-BYTES";
const PROBE_NAME = `__escape-probe-${process.pid}.pdf`;
const PROBE_OUTSIDE = path.join(os.tmpdir(), `escape-target-${process.pid}.pdf`);

const insideAbs = path.resolve(PROBE_DIR, INSIDE_NAME);
const escapeAbs = path.resolve(PROBE_DIR, PROBE_NAME);

const probe = await createEscapeProbe();
const symlinkTest = probe.created ? test : test.skip;
const symlinkName = probe.created
	? "refuses to serve a symlink that escapes the uploads root"
	: `refuses to serve a symlink that escapes the uploads root [platform refused the probe: ${probe.reason}]`;

// Unconditional, and deliberately independent of the symlink probe: this is the
// half that would catch a guard denying everything.
await plantInRootFile();

afterAll(async () => {
	await fs.promises.rm(PROBE_OUTSIDE, { force: true }).catch(() => {});
	await fs.promises.rm(escapeAbs, { force: true }).catch(() => {});
	await fs.promises.rm(insideAbs, { force: true }).catch(() => {});
});

describe("file access content route (real router)", () => {
	test("serves a legitimate in-root file, and marks it private", async () => {
		verifySignedFile.mockReturnValue({ ok: true, absPath: insideAbs });
		const res = await request(buildApp())
			.get("/api/files/content")
			.query({
				path: `/uploads/contracts/${INSIDE_NAME}`,
				exp: Date.now() + 60_000,
				uid: "buyer1",
				sig: "irrelevant",
			})
			.expect(200);
		expect(bodyText(res)).toBe(INSIDE_BODY);
		// Private bytes behind a short-lived signature must not be storable by a
		// shared cache. Express's own Cache-Control is off for this reason.
		expect(res.headers["cache-control"]).toBe("private, no-store");
	});

	test("records exactly one DocumentView per human view", async () => {
		// A real contract row and the `system` scanner backfill row legitimately
		// share one path. One view must not become two rows.
		documentFindMany.mockResolvedValue([
			{ id: "sys-1", uploaded_by: "system" },
			{ id: "real-1", uploaded_by: "buyer9" },
		]);
		verifySignedFile.mockReturnValue({ ok: true, absPath: insideAbs });
		await request(buildApp())
			.get("/api/files/content")
			.query({
				path: `/uploads/contracts/${INSIDE_NAME}`,
				exp: Date.now() + 60_000,
				uid: "buyer1",
				sig: "irrelevant",
			})
			.expect(200);
		expect(documentViewCreate).toHaveBeenCalledTimes(1);
		expect(documentViewCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ document_id: "real-1", viewer_id: "buyer1" }),
			}),
		);
	});
});

symlinkTest(symlinkName, async () => {
	verifySignedFile.mockReturnValue({ ok: true, absPath: escapeAbs });
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

async function plantInRootFile() {
	await fs.promises.mkdir(PROBE_DIR, { recursive: true });
	await fs.promises.rm(insideAbs, { force: true });
	await fs.promises.writeFile(insideAbs, INSIDE_BODY);
}

async function createEscapeProbe() {
	try {
		await fs.promises.writeFile(PROBE_OUTSIDE, "not a real contract");
		await fs.promises.rm(escapeAbs, { force: true });
		await fs.promises.symlink(PROBE_OUTSIDE, escapeAbs, "file");
		return { created: true, reason: "" };
	} catch (error) {
		await fs.promises.rm(PROBE_OUTSIDE, { force: true }).catch(() => {});
		await fs.promises.rm(escapeAbs, { force: true }).catch(() => {});
		return { created: false, reason: error.code || error.message };
	}
}
