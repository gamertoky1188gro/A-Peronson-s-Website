import path from "node:path";
import { GATED_PREFIXES } from "./signedFileUrl.js";

const GATED = new Set(GATED_PREFIXES);

const PARENT_SEGMENT = `..${path.sep}`;

/**
 * Mount in front of `express.static(uploadsRoot)` so the private namespaces
 * (chat, contracts, calls, search) are unreachable over plain HTTP.
 *
 * The classification has to be performed in the *same* order the downstream
 * static handler performs it in, or the thing that decides to deny and the
 * thing that opens the file disagree. serve-static hands its raw, still
 * percent-encoded pathname to send@1.x, which percent-decodes it and then
 * textually normalizes it *before* touching the filesystem. `req.path` at a
 * mounted middleware is likewise undecoded, so classifying it as-is — the
 * obvious reading — leaves the two sides out of step and lets
 * `/uploads/%63ontracts/x.pdf`, `/uploads/./contracts/x.pdf` and
 * `/uploads/feed/../contracts/x.pdf` walk straight past the guard.
 *
 * Order therefore is: decode, normalize, classify. Anything that cannot be
 * decoded, contains a NUL, or escapes the root is refused rather than guessed
 * at.
 *
 * Backslashes are folded to `/` before normalizing. On Windows that is exactly
 * what the filesystem would do anyway; on POSIX a backslash is a legal
 * filename character, so this is a *stricter* reading than send would take
 * (it would look for a single file named `contracts\x.pdf`). Erring toward a
 * 404 is the correct direction for this control.
 */
export function createGatedStaticGuard({ root }) {
	const uploadsRoot = path.resolve(root);

	return function gatedStaticGuard(req, res, next) {
		let decoded;
		try {
			decoded = decodeURIComponent(req.path);
		} catch {
			return res.status(404).json({ error: "Not found" });
		}
		// A NUL cannot appear in a name send would serve; refuse rather than let
		// the two sides disagree about it.
		if (decoded.includes("\0")) {
			return res.status(404).json({ error: "Not found" });
		}

		// Textual normalization first — collapse separators, resolve "." and "..",
		// drop the leading slash — then join with the platform separator. Doing it
		// in that order means "." and "%2e" are indistinguishable by the time the
		// classification runs, which is the whole point.
		const trimmed = decoded.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+/, "");
		const target = path.resolve(uploadsRoot, path.posix.normalize(trimmed));

		const rel = path.relative(uploadsRoot, target);
		if (rel === "") {
			// The uploads root itself. Not gated, and not ours to change here —
			// hand it to the static handler's existing behaviour.
			return next();
		}
		if (rel === ".." || rel.startsWith(PARENT_SEGMENT)) {
			return res.status(404).json({ error: "Not found" });
		}
		// Lower-cased: the filesystem is case-insensitive, so "/uploads/Contracts"
		// names the same file as "/uploads/contracts", and missing that variant
		// would mean "public".
		if (GATED.has(rel.split(path.sep)[0].toLowerCase())) {
			return res.status(404).json({ error: "Not found" });
		}
		return next();
	};
}

export default createGatedStaticGuard;
