import {
	GATED_PREFIXES,
	isGatedPath,
	MEDIA_TTL_MS,
	resolveWithinUploads,
	signFileUrl,
	verifySignedFile,
} from "../../server/utils/signedFileUrl.js";

const SECRET = "test-signing-secret-value";
const ORIGINAL_SECRET = process.env.UPLOADS_SIGNING_SECRET;

beforeEach(() => {
	process.env.UPLOADS_SIGNING_SECRET = SECRET;
});

afterAll(() => {
	if (ORIGINAL_SECRET === undefined) delete process.env.UPLOADS_SIGNING_SECRET;
	else process.env.UPLOADS_SIGNING_SECRET = ORIGINAL_SECRET;
});

describe("signed file urls (server/utils/signedFileUrl.js)", () => {
	test("classifies gated and public prefixes", () => {
		expect(GATED_PREFIXES).toEqual(["chat", "contracts", "calls", "search"]);
		expect(isGatedPath("/uploads/contracts/a.pdf")).toBe(true);
		expect(isGatedPath("chat/b.png")).toBe(true);
		expect(isGatedPath("/uploads/feed/c.png")).toBe(false);
		expect(isGatedPath("/uploads/profile/d.png")).toBe(false);
	});

	test("resolves paths inside the uploads root", () => {
		const abs = resolveWithinUploads("/uploads/contracts/a.pdf");
		expect(abs).toContain("contracts");
		expect(abs.endsWith("a.pdf")).toBe(true);
	});

	test("refuses to escape the uploads root", () => {
		expect(resolveWithinUploads("/uploads/../../.env")).toBeNull();
		expect(resolveWithinUploads("../../../../etc/passwd")).toBeNull();
		expect(resolveWithinUploads("")).toBeNull();
	});

	test("signs a path into a verifiable url", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		expect(url.startsWith("/api/files/content?")).toBe(true);
		const q = new URL(url, "http://x").searchParams;
		expect(q.get("path")).toBe("/uploads/contracts/a.pdf");
		expect(q.get("uid")).toBe("u1");
		expect(Number(q.get("exp"))).toBeGreaterThan(Date.now());
	});

	test("accepts a freshly minted signature", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(true);
		expect(res.absPath).toContain("contracts");
	});

	test("rejects a tampered user id", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: "attacker",
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(false);
		expect(res.reason).toBe("bad_signature");
	});

	test("rejects a swapped path", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: "/uploads/contracts/secret-b.pdf",
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(false);
	});

	test("rejects an expired url", () => {
		const url = signFileUrl({
			relPath: "/uploads/contracts/a.pdf",
			userId: "u1",
			ttlMs: -1000,
		});
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res).toEqual({ ok: false, reason: "expired" });
	});

	test("rejects a truncated signature without throwing", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: "abc",
		});
		expect(res).toEqual({ ok: false, reason: "bad_signature" });
	});

	test("fails closed when the secret is unset", () => {
		delete process.env.UPLOADS_SIGNING_SECRET;
		expect(() => signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" })).toThrow(
			/UPLOADS_SIGNING_SECRET/,
		);
		expect(
			verifySignedFile({
				relPath: "/uploads/contracts/a.pdf",
				userId: "u1",
				exp: Date.now() + 1000,
				sig: "x",
			}),
		).toEqual({ ok: false, reason: "not_configured" });
	});

	test("honours the media ttl for large files", () => {
		expect(MEDIA_TTL_MS).toBeGreaterThan(300_000);
	});
});
