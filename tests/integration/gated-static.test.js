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

let root;
let app;

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

beforeAll(() => {
	root = fs.mkdtempSync(path.join(os.tmpdir(), "gated-static-"));
	for (const folder of GATED) {
		fs.mkdirSync(path.join(root, folder), { recursive: true });
		fs.writeFileSync(path.join(root, folder, "a.txt"), PRIVATE);
	}
	fs.mkdirSync(path.join(root, "feed"), { recursive: true });
	fs.writeFileSync(path.join(root, "feed", "public.txt"), PUBLIC);
	// Root-level assets are public and unlisted: cmsService.js:102 writes
	// `/uploads/${file.name}` for files sitting directly in the uploads root.
	fs.writeFileSync(path.join(root, "logo.png"), PUBLIC);

	app = express();
	app.use("/uploads", createGatedStaticGuard({ root }));
	app.use("/uploads", express.static(root));
});

afterAll(() => {
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
});
