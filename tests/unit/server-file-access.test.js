import { jest } from "@jest/globals";

const documentFindMany = jest.fn();
const messageFindMany = jest.fn();
const callSessionFindMany = jest.fn();
const listFriendMatchIdsForUser = jest.fn(async () => new Set());

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		document: { findMany: documentFindMany },
		message: { findMany: messageFindMany },
		callSession: { findMany: callSessionFindMany },
	},
}));

jest.unstable_mockModule("../../server/services/messageService.js", () => ({
	listFriendMatchIdsForUser,
}));

const { authorizeFilePath, canUserAccessDocument, isAdminRole } = await import(
	"../../server/services/fileAccessService.js"
);

const ADMIN = { id: "admin1", role: "admin" };
const BUYER = { id: "buyer1", role: "buyer" };
const FACTORY = { id: "factory1", role: "factory" };
const STRANGER = { id: "nobody", role: "buyer" };

// uploadsService.js stores `entity_id` as the bare filename when it backfills a
// chat attachment or call recording document, so the fixtures mirror that.
function chatDoc(filename) {
	return { id: "d1", entity_type: "chat_attachment", entity_id: filename };
}

function chatMessage(matchId, senderId, filename) {
	return {
		match_id: matchId,
		sender_id: senderId,
		attachment: { name: filename, url: `/uploads/chat/${filename}` },
	};
}

function callDoc(filename) {
	return { id: "d1", entity_type: "call_recording", entity_id: filename };
}

beforeEach(() => {
	documentFindMany.mockReset();
	messageFindMany.mockReset();
	callSessionFindMany.mockReset();
	listFriendMatchIdsForUser.mockReset();
	listFriendMatchIdsForUser.mockResolvedValue(new Set());
});

describe("file access authorization (server/services/fileAccessService.js)", () => {
	test("recognises admin roles", () => {
		expect(isAdminRole(ADMIN)).toBe(true);
		expect(isAdminRole({ id: "x", role: "owner" })).toBe(true);
		expect(isAdminRole(BUYER)).toBe(false);
		expect(isAdminRole(null)).toBe(false);
	});

	test("allows the contract buyer", async () => {
		const doc = {
			id: "d1",
			entity_type: "contract",
			buyer_id: "buyer1",
			factory_id: "factory1",
			uploaded_by: "u9",
		};
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("allows the contract factory", async () => {
		const doc = {
			id: "d1",
			entity_type: "contract",
			buyer_id: "buyer1",
			factory_id: "factory1",
			uploaded_by: "u9",
		};
		expect(await canUserAccessDocument(FACTORY, doc)).toBe(true);
	});

	test("allows an owner or admin over any document", async () => {
		const doc = { id: "d1", entity_type: "contract", buyer_id: "buyer1", uploaded_by: "u9" };
		expect(await canUserAccessDocument(ADMIN, doc)).toBe(true);
	});

	test("denies an unrelated user the contract", async () => {
		const doc = {
			id: "d1",
			entity_type: "contract",
			buyer_id: "buyer1",
			factory_id: "factory1",
			uploaded_by: "u9",
		};
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	test("denies a system-owned orphan contract to everyone but an admin", async () => {
		const doc = { id: "d1", entity_type: "contract", uploaded_by: "system" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
		expect(await canUserAccessDocument(ADMIN, doc)).toBe(true);
	});

	test("allows a chat sender", async () => {
		const doc = chatDoc("secret.png");
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "buyer1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("allows a chat participant who is not the sender", async () => {
		const doc = chatDoc("secret.png");
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("denies a third party to a chat attachment", async () => {
		const doc = chatDoc("secret.png");
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:zzz:yyy"]));
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	test("denies a chat attachment when no message claims the file", async () => {
		const doc = chatDoc("secret.png");
		messageFindMany.mockResolvedValue([]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	// The brief's version returned true here: it asked only "is the user party
	// to any message that has an attachment", which cannot tell one
	// conversation's file from another's. Membership alone must not carry over.
	test("denies a chat attachment from a conversation the user is not part of", async () => {
		const doc = chatDoc("other.png");
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "mine.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	// messageService.listFriendMatchIdsForUser returns an array at runtime, not
	// the Set the brief assumed. Calling .has() on it would throw a TypeError
	// and turn every chat authorization into a 500.
	test("accepts a friend-match id list returned as an array", async () => {
		const doc = chatDoc("secret.png");
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("denies a chat attachment with no resolvable filename", async () => {
		const doc = { id: "d1", entity_type: "chat_attachment" };
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "buyer1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("allows a call recording participant", async () => {
		const doc = callDoc("rec-1.webm");
		callSessionFindMany.mockResolvedValue([
			{
				participant_ids: ["buyer1"],
				created_by: "x",
				recording_url: "/uploads/calls/rec-1.webm",
			},
		]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("denies a call recording from a session the user is not part of", async () => {
		const doc = callDoc("rec-2.webm");
		callSessionFindMany.mockResolvedValue([
			{
				participant_ids: ["buyer1"],
				created_by: "x",
				recording_url: "/uploads/calls/rec-1.webm",
			},
		]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("denies an unknown entity type to a non-admin", async () => {
		const doc = { id: "d1", entity_type: "mystery", uploaded_by: "someone-else" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("allows an unknown entity type to its uploader", async () => {
		const doc = { id: "d1", entity_type: "mystery", uploaded_by: "buyer1" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("refuses to sign a public path", async () => {
		const res = await authorizeFilePath(BUYER, "/uploads/feed/x.png");
		expect(res).toEqual({ ok: false, reason: "not_gated" });
	});

	test("reports a path that escapes the uploads root", async () => {
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/../../etc/passwd");
		expect(res).toEqual({ ok: false, reason: "outside_root" });
	});

	test("reports a missing document", async () => {
		documentFindMany.mockResolvedValue([]);
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/missing.pdf");
		expect(res).toEqual({ ok: false, reason: "not_found" });
	});

	test("reports forbidden when the caller owns no part of the document", async () => {
		documentFindMany.mockResolvedValue([
			{
				id: "d1",
				entity_type: "contract",
				buyer_id: "buyer1",
				factory_id: "factory1",
				uploaded_by: "u9",
			},
		]);
		const res = await authorizeFilePath(STRANGER, "/uploads/contracts/a.pdf");
		expect(res).toEqual({ ok: false, reason: "forbidden" });
	});

	test("authorizes an owned contract end to end", async () => {
		documentFindMany.mockResolvedValue([
			{
				id: "d1",
				entity_type: "contract",
				buyer_id: "buyer1",
				factory_id: "factory1",
				uploaded_by: "u9",
			},
		]);
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/a.pdf");
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d1");
	});
});
