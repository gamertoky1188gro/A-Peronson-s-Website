import { canAccessContract, isOwnerOrAdmin } from "../utils/permissions.js";
import prisma from "../utils/prisma.js";
import { isGatedPath, resolveWithinUploads } from "../utils/signedFileUrl.js";
import { listFriendMatchIdsForUser } from "./messageService.js";

const ADMIN_ROLES = new Set(["admin", "owner"]);

// Strips "?v=2" style suffixes before the filename tail is compared.
const URL_QUERY_SPLIT = /[?#]/;

function idList(value) {
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === "string") return [value];
	return [];
}

// uploadsService writes `entity_id: item.name` when it backfills chat
// attachments and call recordings, so the bare filename is the normal shape; a
// full stored path is accepted too. Anything unresolvable denies.
function docFilename(doc) {
	const name =
		String(doc?.entity_id || "")
			.split("/")
			.pop() || "";
	return name.trim() ? name.toLowerCase() : "";
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
		const tail =
			String(source ?? "")
				.split(URL_QUERY_SPLIT)[0]
				.split("/")
				.pop() || "";
		if (tail) {
			names.push(tail.toLowerCase());
		}
	}
	return names;
}

function matchesId(value, userId) {
	const left = String(value ?? "");
	const right = String(userId ?? "");
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

export function isAdminRole(user) {
	return isOwnerOrAdmin(user) || ADMIN_ROLES.has(user?.role);
}

export async function canUserAccessDocument(user, doc) {
	if (!(user && doc)) return false;
	if (isAdminRole(user)) return true;
	if (user.id === null || user.id === undefined || String(user.id) === "") return false;

	switch (doc.entity_type) {
		case "contract":
			// Buyer / factory / uploader / assigned-agent rules already live in
			// permissions.js; delegating keeps one source of truth.
			return canAccessContract(user, doc);

		case "chat_attachment": {
			const filename = docFilename(doc);
			if (!filename) return false;

			const messages = await prisma.message.findMany({
				where: { attachment: { not: null } },
				select: { match_id: true, sender_id: true, attachment: true },
			});
			const mine = toIdSet(await listFriendMatchIdsForUser(user.id));

			// Both axes are required: the message must reference *this* file, and
			// it must sit in a thread the caller is party to. Checking membership
			// alone hands every chat file to anyone who has ever had one
			// conversation, including other people's conversations.
			return messages.some((message) => {
				if (!attachmentFilenames(message.attachment).includes(filename)) {
					return false;
				}
				return matchesId(message.sender_id, user.id) || mine.has(String(message.match_id));
			});
		}

		case "call_recording": {
			const filename = docFilename(doc);
			if (!filename) return false;

			const calls = await prisma.callSession.findMany({
				where: { recording_url: { not: null } },
				select: { participant_ids: true, created_by: true, recording_url: true },
			});
			// Same reasoning as chat: taking part in one call must not confer
			// access to an unrelated recording.
			return calls.some((call) => {
				const recording = String(call.recording_url ?? "")
					.split("/")
					.pop()
					?.toLowerCase();
				if (recording !== filename) {
					return false;
				}
				return (
					matchesId(call.created_by, user.id) ||
					idList(call.participant_ids).includes(String(user.id))
				);
			});
		}

		default:
			// Fail closed: an unrecognised type is readable only by its uploader,
			// which keeps a system-owned orphan away from every non-admin.
			return matchesId(doc.uploaded_by, user.id);
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

	const docs = await prisma.document.findMany({
		where: { file_path: String(relPath) },
	});
	// No Document row means the path never resolved, so it denies rather than
	// falling through to the public file handler.
	if (!docs.length) {
		return { ok: false, reason: "not_found" };
	}

	// Several rows can share one file_path. Granting when any of them does is
	// deterministic, unlike taking an arbitrary docs[0], and matches the
	// "the caller is party to at least one record of this file" reading.
	const grants = await Promise.all(docs.map((doc) => canUserAccessDocument(user, doc)));
	const granted = grants.indexOf(true);
	if (granted === -1) {
		return { ok: false, reason: "forbidden" };
	}
	return { ok: true, doc: docs[granted] };
}
