import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { authorizeFilePath } from "../services/fileAccessService.js";
import { logWarn } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import {
	MEDIA_TTL_MS,
	resolveWithinUploads,
	signFileUrl,
	toPublicPath,
	uploadsRoot,
	verifySignedFile,
} from "../utils/signedFileUrl.js";

const router = Router();

// Bounds the work one /sign call can schedule: each entry is a database round
// trip inside the authorization resolver, so an unbounded body would let a
// single request fan out into thousands of queries.
const MAX_PATHS_PER_REQUEST = 50;

const CALL_RECORDING_PREFIX = "/uploads/calls/";

// Maps an authorizeFilePath verdict onto the status the client should see for
// that path. An unmapped reason falls back to 403 rather than 2xx — the caller
// asked for bytes and did not get clearance for them, so the safe default is
// "denied".
const REASON_STATUS = {
	not_gated: 400,
	outside_root: 400,
	not_found: 404,
	forbidden: 403,
};

router.post("/sign", requireAuth, async (req, res) => {
	const paths = Array.isArray(req.body?.paths)
		? req.body.paths.slice(0, MAX_PATHS_PER_REQUEST)
		: [];
	const signed = {};

	for (const raw of paths) {
		const relPath = String(raw);
		const verdict = await authorizeFilePath(req.user, relPath);
		if (!verdict.ok) {
			signed[relPath] = {
				error: verdict.reason,
				status: REASON_STATUS[verdict.reason] || 403,
			};
			continue;
		}
		try {
			// Recordings are long enough that the default ttl expires mid-playback.
			// Keyed off the canonical path rather than the raw request string, so
			// "/uploads/./calls/r.mp4" is recognised as the recording it is.
			const resolved = resolveWithinUploads(relPath);
			const publicPath = resolved ? toPublicPath(resolved) : relPath;
			signed[relPath] = {
				url: signFileUrl({
					relPath,
					userId: req.user.id,
					ttlMs: publicPath.startsWith(CALL_RECORDING_PREFIX) ? MEDIA_TTL_MS : undefined,
				}),
			};
		} catch (error) {
			// signFileUrl throws on an unusable path, a blank user id, a missing
			// secret, or an out-of-range ttl. authorizeFilePath has already rejected
			// the path-shaped cases, so in practice this is the unconfigured-secret
			// path — surfaced as 503 so the client can tell a misconfiguration from
			// a permission problem.
			logWarn("file sign refused", { relPath, reason: error.message });
			signed[relPath] = { error: "not_configured", status: 503 };
		}
	}

	return res.json({ signed });
});

// Deliberately not behind requireAuth: auth in this app is a Bearer token held
// in localStorage, and these URLs are opened with window.open (an <img> or a
// download), neither of which can attach an Authorization header. The HMAC is
// the authorization — `uid` is one of its inputs, so presenting a different one
// yields bad_signature rather than acting as a claim about identity.
router.get("/content", async (req, res) => {
	const { path: relPath, exp, uid, sig } = req.query;
	const verdict = verifySignedFile({ relPath, userId: uid, exp, sig });
	if (!verdict.ok) {
		return res.status(403).json({ error: "Forbidden", reason: verdict.reason });
	}

	// verifySignedFile proves the signature was minted by this server for a path
	// that resolved *lexically* inside the uploads root. path.resolve cannot see
	// a symlink, so a link planted inside the root passes every check above and
	// still points out of it. Re-resolve both ends through the filesystem and
	// serve only what is genuinely under the genuine root.
	let realRoot;
	let realPath;
	try {
		realRoot = await fs.promises.realpath(uploadsRoot());
		realPath = await fs.promises.realpath(verdict.absPath);
	} catch {
		// Vanished or unresolvable — a broken link lands here too.
		return res.status(404).json({ error: "Not found" });
	}
	if (!realPath.startsWith(realRoot + path.sep)) {
		logWarn("file content refused: symlink escape", { relPath, realPath });
		return res.status(403).json({ error: "Forbidden", reason: "symlink_escape" });
	}

	// Contract PDFs are the auditable case, and — per fileAccessService — a real
	// contract names them through artifact.pdf_path rather than Document.file_path,
	// so both anchors have to be consulted or the view is recorded against the
	// wrong (or a non-existent) document.
	if (path.relative(realRoot, realPath).split(path.sep)[0].toLowerCase() === "contracts") {
		await recordContractView(toPublicPath(realPath), String(uid), req.ip);
	}

	return res.sendFile(realPath);
});

// Audit-only side effect: authorization already succeeded above, so a failure
// here must not turn a legitimate download into a 500. Matches the existing
// recordDocumentView helper's stance in documentService.js.
async function recordContractView(publicPath, viewerId, viewerIp) {
	try {
		const docs = await prisma.document.findMany({
			where: {
				OR: [
					{ file_path: { equals: publicPath } },
					{ artifact: { path: ["pdf_path"], equals: publicPath } },
				],
			},
			select: { id: true },
		});
		for (const doc of docs) {
			await prisma.documentView.create({
				data: {
					// DocumentView.id has no database default, so the write must
					// supply one or Prisma rejects the create outright.
					id: crypto.randomUUID(),
					document_id: doc.id,
					viewer_id: viewerId || null,
					viewer_ip: viewerIp || null,
				},
			});
		}
	} catch (error) {
		logWarn("document view record failed", { publicPath, reason: error.message });
	}
}

export default router;
