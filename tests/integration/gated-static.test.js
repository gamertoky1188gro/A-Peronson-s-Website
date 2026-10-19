import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import request from "supertest";
import { createGatedStaticGuard } from "../../server/utils/gatedStaticGuard.js";

// This is the control that makes private files private. It lives in server.js,
// which has no test harness, so an untested version of it is indistinguishable
// from a working one until somebody reads it carefully — which is exactly how a
// percent-encoding bypass shipped once already. The fixture tree below is built
// in a temp directory, never in the real uploads root.

const GATED = ["chat", "contracts", "calls", "search"];
const PRIVATE = "PRIVATE-BYTES";
const PUBLIC = "PUBLIC-BYTES";

// express.static types a .png as image/png, so supertest hands back a Buffer
// rather than a string. The root-level asset case exists because cmsService.js
// writes exactly that kind of file, so it is kept a real image extension.
function bodyText(res) {
	return Buffer.isBuffer(res.body) ? res.body.toString() : String(res.text ?? "");
}

// Every shape below decodes, to something like, `/contracts/a.txt`.
function shapeVariants(folder) {
	const Mixed = `${folder[0].toUpperCase()}${folder.slice(1)}`;
	const firstCharHex = `%${folder[0].charCodeAt(0).toString(16).padStart(2, "0")}${folder.slice(1)}`;
	return [
		{ name: "plain", url: `/${folder}/a.txt` },
		{ name: "./ prefix", url: `/./${folder}/a.txt` },
		{ name: "double ./ prefix", url: `/././${folder}/a.txt` },
		{ name: "%XX-encoded first char", url: `/${firstCharHex}/a.txt` },
		{ name: "%2e segment", url: `/%2e/${folder}/a.txt` },
		{ name: "mixed case", url: `/${Mixed}/a.txt` },
		{ name: "upper case", url: `/${folder.toUpperCase()}/a.txt` },
		{ name: "%2f separator", url: `/${folder}%2fa.txt` },
		{ name: "%5c separator", url: `/${folder}%5ca.txt` },
		{ name: "../ traversal from a public folder", url: `/feed/../${folder}/a.txt` },
	];
}

// Built at module scope, not in beforeAll: the 8.3 alias probe below has to run
// during collection so the alias rows can register as test or test.skip. Always
// in a temp directory — the real uploads root is never touched.
const root = fs.mkdtempSync(path.join(os.tmpdir(), "gated-static-"));
for (const folder of GATED) {
	fs.mkdirSync(path.join(root, folder), { recursive: true });
	fs.writeFileSync(path.join(root, folder, "a.txt"), PRIVATE);
}
fs.mkdirSync(path.join(root, "feed"), { recursive: true });
fs.writeFileSync(path.join(root, "feed", "public.txt"), PUBLIC);
// Root-level assets are public and unlisted: cmsService.js:102 writes
// `/uploads/${file.name}` for files sitting directly in the uploads root.
fs.writeFileSync(path.join(root, "logo.png"), PUBLIC);

// Resolved during collection for the same reason: the alias rows must know now
// whether to register as skipped.
const alias = await detectShortNameAlias(root, "contracts");

// Planted at module scope for the same reason as the alias probe: the row below
// has to decide now whether it registers as skipped.
const linkProbe = await plantEscapeLink();

let app;

beforeAll(() => {
	app = express();
	app.use("/uploads", createGatedStaticGuard({ root }));
	app.use("/uploads", express.static(root));
});

afterAll(async () => {
	await fs.promises.rm(path.join(os.tmpdir(), `gated-static-escape-${process.pid}.txt`), {
		force: true,
	});
	fs.rmSync(root, { recursive: true, force: true });
});

describe("gated static guard", () => {
	for (const folder of GATED) {
		for (const shape of shapeVariants(folder)) {
			test(`404 /uploads/${folder} via ${shape.name}`, async () => {
				const res = await request(app).get(`/uploads${shape.url}`);
				expect(res.status).toBe(404);
				expect(bodyText(res)).not.toContain(PRIVATE);
			});
		}
	}

	test("404 the gated directory itself", async () => {
		const res = await request(app).get("/uploads/contracts");
		expect(res.status).toBe(404);
	});

	test("404 a traversal that escapes the uploads root", async () => {
		const res = await request(app).get("/uploads/../etc/passwd");
		expect(res.status).toBe(404);
	});

	// --- NTFS 8.3 short-name aliasing -------------------------------------
	//
	// `contracts` is the only gated prefix longer than eight characters, so it is
	// the only one NTFS mints an alias for (`dir /x` shows `CONTRA~1` for it in
	// this repo's real server/uploads). The guard classifies the *requested*
	// name, "contra~1", which is not gated, while the filesystem resolves it to
	// the gated `contracts`. Same defect class as the decode-then-normalize
	// bypass, arriving through the filesystem instead of through URL syntax.
	//
	// These only bite on a filesystem that mints aliases; the alias probe below
	// skips the whole block where it does not exist, so this suite reports the
	// gap as skipped rather than silently passing.
	const aliasTest = alias.found ? test : test.skip;
	const aliasCases = [
		{ name: "plain", url: `/${alias.alias}/a.txt` },
		{
			name: "%XX-encoded first char",
			url: `/%${alias.alias[0].charCodeAt(0).toString(16).padStart(2, "0")}${alias.alias.slice(1)}/a.txt`,
		},
		{ name: "./ prefix", url: `/./${alias.alias}/a.txt` },
		{ name: "../ traversal from a public folder", url: `/feed/../${alias.alias}/a.txt` },
		{ name: "the alias directory itself", url: `/${alias.alias}` },
	];

	for (const shape of aliasCases) {
		aliasTest(`404 /uploads/${shape.name} via the NTFS 8.3 alias for contracts`, async () => {
			const res = await request(app).get(`/uploads${shape.url}`);
			expect([403, 404]).toContain(res.status);
			expect(bodyText(res)).not.toContain(PRIVATE);
		});
	}

	// Without these the whole matrix would also pass for a guard that rejects
	// every request, which is not the same property as "private files are private".
	test("200 a public feed file", async () => {
		const res = await request(app).get("/uploads/feed/public.txt");
		expect(res.status).toBe(200);
		expect(bodyText(res)).toBe(PUBLIC);
	});

	test("200 a public root-level asset", async () => {
		const res = await request(app).get("/uploads/logo.png");
		expect(res.status).toBe(200);
		expect(bodyText(res)).toBe(PUBLIC);
	});

	test("200 a public file reached through ./ and %XX shapes", async () => {
		for (const url of [
			"/uploads/./feed/public.txt",
			"/uploads/%66eed/public.txt",
			"/uploads/feed/../feed/public.txt",
		]) {
			const res = await request(app).get(url);
			expect(res.status).toBe(200);
			expect(bodyText(res)).toBe(PUBLIC);
		}
	});

	// --- the realpath step must not become a new source of 404s ------------
	//
	// The guard re-checks the classification against the resolved path, and
	// fs.realpath throws for anything that is not there. When it does, the
	// guard has to step aside: express.static is the thing that decides whether
	// a missing file exists, and a directory request is static's to redirect,
	// not the guard's to refuse.
	test("a missing public file is answered by static, not the guard", async () => {
		const res = await request(app).get("/uploads/feed/absent.txt");
		expect(res.status).toBe(404);
		// The guard answers with JSON. Express's own 404 is HTML, so this
		// distinguishes "the guard refused it" from "static decided it does not
		// exist" even though both are 404.
		expect(bodyText(res)).toContain("Cannot GET");
		expect(bodyText(res)).not.toContain('"error"');
	});

	test("a public directory is redirected by static, not 404'd by the guard", async () => {
		const res = await request(app).get("/uploads/feed");
		expect(res.status).toBe(301);
		expect(res.headers.location).toContain("feed");
	});

	test("the uploads root itself is left to static", async () => {
		const res = await request(app).get("/uploads");
		expect(res.status).toBe(301);
	});

	// send's containment check is lexical on the requested path, so a link inside
	// the public tree that points out of the uploads root is served from wherever
	// it points. The guard resolves before allowing a request through, so it is
	// the place that has to notice.
	// Windows refuses symlink creation for a non-elevated process, so this
	// registers as skipped rather than passing vacuously where that is true.
	const escapeLinkTest = linkProbe.created ? test : test.skip;

	escapeLinkTest(
		linkProbe.created
			? "404 a public-path symlink that resolves out of the uploads root"
			: `404 a public-path symlink that resolves out of the uploads root [platform refused the probe: ${linkProbe.reason}]`,
		async () => {
			const res = await request(app).get("/uploads/feed/escape-link.txt");
			expect(res.status).toBe(404);
			expect(bodyText(res)).not.toContain("OUTSIDE-THE-ROOT");
		},
	);
});

async function plantEscapeLink() {
	const outside = path.join(os.tmpdir(), `gated-static-escape-${process.pid}.txt`);
	try {
		await fs.promises.writeFile(outside, "OUTSIDE-THE-ROOT");
		await fs.promises.symlink(outside, path.join(root, "feed", "escape-link.txt"), "file");
		return { created: true, reason: "" };
	} catch (error) {
		await fs.promises.rm(outside, { force: true }).catch(() => {});
		return { created: false, reason: error.code || error.message };
	}
}

// NTFS mints 8.3 aliases for names longer than eight characters, and the alias
// is a different, non-gated string that still resolves to the gated directory.
// The alias is not derivable from the name, so it is discovered by probing: try
// the conventional encoding, and confirm it by checking that resolving through
// it lands on the same directory the long name names. Where the filesystem mints
// no alias (POSIX, or short-name generation disabled) this returns found:false
// and the alias rows register as skipped rather than passing vacuously.
//
// Async on purpose: on Windows only fs.promises.realpath expands a short name.
// realpathSync returns "CONTRA~1" unchanged, so a probe built on it would
// report no alias on a filesystem that very much has one, and the rows would
// skip instead of running.
async function detectShortNameAlias(fixtureRoot, longName) {
	const stem = longName.slice(0, 6).toUpperCase();
	let longReal;
	try {
		longReal = await fs.promises.realpath(path.join(fixtureRoot, longName));
	} catch {
		return { found: false, alias: `${stem}~1` };
	}
	for (const tail of ["~1", "~2", "~3", "~4"]) {
		const candidate = `${stem}${tail}`;
		try {
			if (!(await fs.promises.stat(path.join(fixtureRoot, candidate))).isDirectory()) continue;
			if ((await fs.promises.realpath(path.join(fixtureRoot, candidate))) !== longReal) continue;
			return { found: true, alias: candidate };
		} catch {
			// no such alias on this filesystem
		}
	}
	return { found: false, alias: `${stem}~1` };
}
