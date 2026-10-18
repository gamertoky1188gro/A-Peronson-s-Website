import crypto from "node:crypto";
import path from "node:path";

export const GATED_PREFIXES = ["chat", "contracts", "calls", "search"];
export const DEFAULT_TTL_MS = 5 * 60 * 1000;
export const MEDIA_TTL_MS = 15 * 60 * 1000;

function uploadsRoot() {
	return path.resolve(process.cwd(), "server", "uploads");
}

function readSecret() {
	const raw = process.env.UPLOADS_SIGNING_SECRET;
	if (!(raw && String(raw).trim())) return null;
	return String(raw);
}

export function isGatedPath(relPath) {
	// The public url carries a leading "/uploads/" segment but callers also pass
	// bare upload-relative paths ("chat/b.png"), so strip the root segment too.
	// Without this, "/uploads/contracts/a.pdf" would classify on "uploads".
	const first = String(relPath || "")
		.replace(/^\/+/, "")
		.replace(/^uploads(?:\/|$)/, "")
		.split("/")[0];
	return GATED_PREFIXES.includes(first);
}

export function resolveWithinUploads(relPath) {
	const root = uploadsRoot();
	const rel = String(relPath || "")
		.replace(/^\/uploads\/?/, "")
		.replace(/^\/+/, "");
	if (!rel) return null;
	const abs = path.resolve(root, rel);
	if (abs !== root && !abs.startsWith(root + path.sep)) return null;
	return abs;
}

function toPublicPath(absPath) {
	const rel = path.relative(uploadsRoot(), absPath);
	return `/uploads/${rel.split(path.sep).join("/")}`;
}

function canonical(absPath, userId, exp) {
	return `${absPath}\n${userId}\n${exp}`;
}

export function signFileUrl({ relPath, userId, ttlMs = DEFAULT_TTL_MS }) {
	const secret = readSecret();
	if (!secret) {
		throw new Error("UPLOADS_SIGNING_SECRET is not configured");
	}
	const abs = resolveWithinUploads(relPath);
	if (!abs) {
		throw new Error("Path is outside the uploads root");
	}
	const exp = Date.now() + ttlMs;
	const sig = crypto
		.createHmac("sha256", secret)
		.update(canonical(abs, userId, exp))
		.digest("hex");
	const query = new URLSearchParams({
		path: toPublicPath(abs),
		exp: String(exp),
		uid: String(userId),
		sig,
	});
	return `/api/files/content?${query.toString()}`;
}

export function verifySignedFile({ relPath, userId, exp, sig }) {
	const secret = readSecret();
	if (!secret) return { ok: false, reason: "not_configured" };

	const abs = resolveWithinUploads(relPath);
	if (!abs) return { ok: false, reason: "outside_root" };

	const expNum = Number(exp);
	if (!Number.isFinite(expNum)) return { ok: false, reason: "bad_exp" };
	if (Date.now() > expNum) return { ok: false, reason: "expired" };

	const expected = crypto
		.createHmac("sha256", secret)
		.update(canonical(abs, userId, expNum))
		.digest();
	const given = Buffer.from(String(sig || ""), "hex");
	if (given.length !== expected.length || !crypto.timingSafeEqual(expected, given)) {
		return { ok: false, reason: "bad_signature" };
	}
	return { ok: true, absPath: abs };
}
