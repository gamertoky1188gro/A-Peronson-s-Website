import path from "node:path";
import { canAccessContract, isOwnerOrAdmin } from "../utils/permissions.js";
import prisma from "../utils/prisma.js";
import { isGatedPath, resolveWithinUploads, toPublicPath } from "../utils/signedFileUrl.js";
import { listFriendMatchIdsForUser } from "./messageService.js";

// Strips "?v=2" style suffixes before the filename tail is compared.
const URL_QUERY_SPLIT = /[?#]/;

function text(value) {
	return String(value ?? "").trim();
}

function idList(value) {
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === "string") return [value];
	return [];
}

// uploadsService writes `entity_id: item.name` when it backfills chat
// attachments and call recordings, so the bare filename is the normal shape; a
// full stored path is accepted too. Anything unresolvable denies.
function docFilename(doc) {
	const name = text(doc?.entity_id).split("/").pop() || "";
	return name ? name.toLowerCase() : "";
}

// Attachment is a Json column. messageService posts {name, url, mime_type,
// size}; older rows may hold a bare string or an array of either. Compare the
// lower-cased tail so "/uploads/chat/a.png" and "a.png" name the same file on
// a case-insensitive filesystem.
function attachmentFilenames(attachment) {
	const raw = Array.isArray(attachment) ? attachment : [attachment];
	const names = [];
	for (const entry of raw) {
		const source = typeof entry === "string" ? entry : entry?.url || entry?.path || entry?.name;
		const tail = text(source).split(URL_QUERY_SPLIT)[0].split("/").pop() || "";
		if (tail) {
			names.push(tail.toLowerCase());
		}
	}
	return names;
}

function matchesId(value, userId) {
	const left = text(value);
	const right = text(userId);
	return left !== "" && left === right;
}

// listFriendMatchIdsForUser hands back an array today, but callers may pass a
// Set. Normalising either way keeps the .has() lookup below total; getting this
// wrong throws a TypeError and turns every chat authorization into a 500.
function toIdSet(value) {
	if (Array.isArray(value)) return new Set(value.map(String));
	if (value instanceof Set) return new Set(Array.from(value, String));
	return new Set();
}

// A real contract names its two parties. A Document row whose only claim is a
// self-asserted `uploaded_by` cannot be one, and must not inherit
// canAccessContract's trust in that field — see the note in authorizeFilePath
// for how that field can be forged.
function hasPartyClaim(doc) {
	return text(doc?.buyer_id) !== "" || text(doc?.factory_id) !== "";
}

// Contract PDFs are referenced through artifact.pdf_path, never through
// Document.file_path, so both have to be consulted to resolve one.
function artifactPdfPath(doc) {
	const raw = doc?.artifact?.pdf_path;
	return typeof raw === "string" ? text(raw).toLowerCase() : "";
}

// Does this row actually anchor the requested file? file_path is caller-supplied
// through POST /documents/url, so a row that merely *claims* the path proves
// nothing — the row must be one the server itself wrote for these bytes.
function rowAnchorsPath(doc, key) {
	const target = key.toLowerCase();
	return text(doc?.file_path).toLowerCase() === target || artifactPdfPath(doc) === target;
}

async function canAccessChatAttachment(user, doc) {
	const filename = docFilename(doc);
	if (!filename) return false;

	const mine = toIdSet(await listFriendMatchIdsForUser(user.id));
	// Both filters belong in SQL. `match_id` and `sender_id` are indexed, so this
	// avoids scanning every attachment-bearing message on the platform on each
	// authorization request.
	const messages = await prisma.message.findMany({
		where: {
			attachment: { not: null },
			OR: [{ sender_id: text(user.id) }, { match_id: { in: [...mine] } }],
		},
		select: { match_id: true, sender_id: true, attachment: true },
	});

	// Both axes are required: the message must reference *this* file, and it must
	// sit in a thread the caller is party to. Checking membership alone hands
	// every chat file to anyone who has ever had one conversation, including other
	// people's conversations.
	return messages.some((message) => {
		if (!attachmentFilenames(message.attachment).includes(filename)) {
			return false;
		}
		return matchesId(message.sender_id, user.id) || mine.has(String(message.match_id));
	});
}

async function canAccessCallRecording(user, doc) {
	const filename = docFilename(doc);
	if (!filename) return false;

	// recording_url is a plain column, so the filename narrows the row set in SQL.
	// participant_ids is Json, which has no portable array_contains, so that half
	// of the test stays in JS — over what is now a handful of rows rather than the
	// whole table.
	const calls = await prisma.callSession.findMany({
		where: { recording_url: { contains: filename } },
		select: { participant_ids: true, created_by: true, recording_url: true },
	});

	// Same reasoning as chat: taking part in one call must not confer access to an
	// unrelated recording.
	return calls.some((call) => {
		const recording = text(call.recording_url).split("/").pop()?.toLowerCase();
		if (recording !== filename) {
			return false;
		}
		const participants = idList(call.participant_ids);
		return matchesId(call.created_by, user.id) || participants.includes(text(user.id));
	});
}

export function isAdminRole(user) {
	// permissions.js already owns the owner/admin set; re-declaring it here would
	// be a second source of truth for "who is privileged".
	return isOwnerOrAdmin(user);
}

export async function canUserAccessDocument(user, doc) {
	if (!(user && doc)) return false;
	if (isAdminRole(user)) return true;
	if (!text(user.id)) return false;

	switch (doc.entity_type) {
		case "contract":
			return hasPartyClaim(doc) && canAccessContract(user, doc);

		case "chat_attachment":
			return canAccessChatAttachment(user, doc);

		case "call_recording":
			return canAccessCallRecording(user, doc);

		default:
			// Unknown type. `uploaded_by` is self-asserted by anyone who can reach
			// POST /documents/url, so it is not evidence that this caller owns these
			// bytes. Every gated prefix (chat, contracts, calls, search) is a private
			// namespace with its own branch above, so an unrecognised type has no
			// legitimate basis to grant. Deny, and let an admin read it.
			return false;
	}
}

export async function authorizeFilePath(user, relPath) {
	if (!isGatedPath(relPath)) {
		return { ok: false, reason: "not_gated" };
	}
	const abs = resolveWithinUploads(relPath);
	if (!abs) {
		return { ok: false, reason: "outside_root" };
	}

	// Key off the resolved path rather than the raw request string: clients send
	// "/uploads/x" and "/uploads/./x" for the same bytes, and only the first form
	// is what Document.file_path and artifact.pdf_path store.
	const key = toPublicPath(abs);
	const basename = path.posix.basename(key);

	// file_path can never be trusted as an authorization anchor on its own — it is
	// caller-supplied through POST /documents/url — so candidates are collected
	// here and re-checked by rowAnchorsPath before any grant. The artifact arm
	// covers contract PDFs, which live only in artifact.pdf_path.
	const candidates = await prisma.document.findMany({
		where: {
			OR: [
				{ file_path: { contains: basename } },
				{ entity_type: "contract", artifact: { not: null } },
			],
		},
	});
	const docs = candidates.filter((doc) => rowAnchorsPath(doc, key));

	// No Document row means the path never resolved, so it denies rather than
	// falling through to the public file handler.
	if (!docs.length) {
		return { ok: false, reason: "not_found" };
	}

	// Several rows can legitimately share one path — a real contract row plus the
	// `system` backfill row the uploads scanner writes. Any-grant is what keeps the
	// true owner working in that case, so it must not become every-grant.
	const grants = await Promise.all(docs.map((doc) => canUserAccessDocument(user, doc)));
	const granted = grants.indexOf(true);
	if (granted === -1) {
		return { ok: false, reason: "forbidden" };
	}
	return { ok: true, doc: docs[granted] };
}
