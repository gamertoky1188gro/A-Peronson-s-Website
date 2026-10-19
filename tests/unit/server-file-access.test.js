import fs from "node:fs";
import path from "node:path";
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
const CONTRACT_PDF = "/uploads/contracts/a.pdf";

// uploadsService.js stores `entity_id` as the bare filename when it backfills a
// chat attachment or call recording document, so the fixtures mirror that.
const chatDoc = (filename) => ({ id: "d1", entity_type: "chat_attachment", entity_id: filename });
const callDoc = (filename) => ({ id: "d1", entity_type: "call_recording", entity_id: filename });
const chatMessage = (matchId, senderId, filename) => ({
	match_id: matchId,
	sender_id: senderId,
	attachment: { name: filename, url: `/uploads/chat/${filename}` },
});
const contractRow = (over = {}) => ({
	id: "d1",
	entity_type: "contract",
	buyer_id: "buyer1",
	factory_id: "factory1",
	uploaded_by: "u9",
	file_path: CONTRACT_PDF,
	...over,
});
// A row an attacker minted through POST /documents/url: uploaded_by is their own
// id and file_path points at someone else's bytes.
const forgedRow = (over = {}) => ({
	id: "d-forged",
	uploaded_by: "nobody",
	buyer_id: "",
	factory_id: "",
	file_path: CONTRACT_PDF,
	...over,
});
const callSession = (participantIds, filename) => ({
	participant_ids: participantIds,
	created_by: "x",
	recording_url: `/uploads/calls/${filename}`,
});

beforeEach(() => {
	documentFindMany.mockReset();
	messageFindMany.mockReset();
	callSessionFindMany.mockReset();
	listFriendMatchIdsForUser.mockReset();
	listFriendMatchIdsForUser.mockResolvedValue([]);
});

describe("file access authorization (server/services/fileAccessService.js)", () => {
	test("recognises admin roles", () => {
		expect(isAdminRole(ADMIN)).toBe(true);
		expect(isAdminRole({ id: "x", role: "owner" })).toBe(true);
		expect(isAdminRole(BUYER)).toBe(false);
		expect(isAdminRole(null)).toBe(false);
	});

	test("allows the contract buyer", async () => {
		expect(await canUserAccessDocument(BUYER, contractRow())).toBe(true);
	});

	test("allows the contract factory", async () => {
		expect(await canUserAccessDocument(FACTORY, contractRow())).toBe(true);
	});

	test("allows an owner or admin over any document", async () => {
		expect(await canUserAccessDocument(ADMIN, { id: "d1", entity_type: "contract" })).toBe(true);
	});

	test("denies an unrelated user the contract", async () => {
		expect(await canUserAccessDocument(STRANGER, contractRow())).toBe(false);
	});

	test("denies a system-owned orphan contract to everyone but an admin", async () => {
		const doc = { id: "d1", entity_type: "contract", uploaded_by: "system" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
		expect(await canUserAccessDocument(ADMIN, doc)).toBe(true);
	});

	test("allows a chat sender", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "buyer1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		expect(await canUserAccessDocument(BUYER, chatDoc("secret.png"))).toBe(true);
	});

	test("allows a chat participant who is not the sender", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		expect(await canUserAccessDocument(BUYER, chatDoc("secret.png"))).toBe(true);
	});

	// listFriendMatchIdsForUser returns an array at runtime, not the Set the
	// original brief assumed; .has() on it would 500 every chat request.
	test("accepts a friend-match id list returned as a Set", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, chatDoc("secret.png"))).toBe(true);
	});

	test("denies a third party to a chat attachment", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:zzz:yyy"]);
		expect(await canUserAccessDocument(STRANGER, chatDoc("secret.png"))).toBe(false);
	});

	test("denies a chat attachment when no message claims the file", async () => {
		messageFindMany.mockResolvedValue([]);
		expect(await canUserAccessDocument(BUYER, chatDoc("secret.png"))).toBe(false);
	});

	// The thread the caller genuinely belongs to carries a *different* file; the
	// requested one exists only in a thread they are not part of. Membership must
	// not carry the grant across threads. `mine` is an array, as the real
	// service returns, not the Set the original brief assumed.
	test("denies a member of thread X a file that only exists in thread Y", async () => {
		messageFindMany.mockResolvedValue([
			chatMessage("friend:aaa:bbb", "factory1", "mine.png"),
			chatMessage("friend:zzz:yyy", "factory1", "secret.png"),
		]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		expect(await canUserAccessDocument(BUYER, chatDoc("secret.png"))).toBe(false);
	});

	test("denies a chat attachment with no resolvable filename", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "buyer1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		expect(await canUserAccessDocument(BUYER, { id: "d1", entity_type: "chat_attachment" })).toBe(
			false,
		);
	});

	// Unbounded per-request scans of `messages` are a DoS lever, so the caller's
	// own threads must be part of the SQL predicate, not a JS filter applied to
	// every attachment-bearing row.
	test("constrains the chat message query to the caller's own threads", async () => {
		messageFindMany.mockResolvedValue([chatMessage("friend:aaa:bbb", "factory1", "secret.png")]);
		listFriendMatchIdsForUser.mockResolvedValue(["friend:aaa:bbb"]);
		await canUserAccessDocument(BUYER, chatDoc("secret.png"));
		expect(messageFindMany).toHaveBeenCalledTimes(1);
		expect(messageFindMany.mock.calls[0][0].where.OR).toEqual([
			{ sender_id: "buyer1" },
			{ match_id: { in: ["friend:aaa:bbb"] } },
		]);
	});

	test("allows a call recording participant", async () => {
		callSessionFindMany.mockResolvedValue([callSession(["buyer1"], "rec-1.webm")]);
		expect(await canUserAccessDocument(BUYER, callDoc("rec-1.webm"))).toBe(true);
	});

	test("denies a call recording from a session the user is not part of", async () => {
		callSessionFindMany.mockResolvedValue([callSession(["buyer1"], "rec-1.webm")]);
		expect(await canUserAccessDocument(BUYER, callDoc("rec-2.webm"))).toBe(false);
	});

	// Same DoS argument as chat: the row set must be narrowed in SQL.
	test("constrains the call query to the recorded filename", async () => {
		callSessionFindMany.mockResolvedValue([callSession(["buyer1"], "rec-1.webm")]);
		await canUserAccessDocument(BUYER, callDoc("rec-1.webm"));
		expect(callSessionFindMany).toHaveBeenCalledTimes(1);
		expect(callSessionFindMany.mock.calls[0][0].where).toEqual({
			recording_url: { contains: "rec-1.webm" },
		});
	});

	test("denies an unknown entity type to a non-admin", async () => {
		const doc = { id: "d1", entity_type: "mystery", uploaded_by: "someone-else" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	// `uploaded_by` is self-asserted by anyone who can reach POST /documents/url,
	// so it is not evidence that the caller owns these bytes. Every gated prefix
	// has its own branch above; an unrecognised type has no basis to grant.
	test("denies an unknown entity type to its own claimed uploader", async () => {
		const doc = { id: "d1", entity_type: "mystery", uploaded_by: "buyer1" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	// createDraftContract skips the rating check when either party is blank
	// (documentService.js:621) and persists "" for both (documentService.js:640),
	// so a blank-party contract is real. Its creator must still reach its PDF.
	test("allows a blank-party contract to the manager who created it", async () => {
		const doc = forgedRow({
			entity_type: "contract",
			uploaded_by: "buyer1",
			contract_number: "CN-7",
		});
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	// The other side of the discriminator: a forged /url row carries a real
	// attacker id in uploaded_by but neither marker, because
	// registerExternalDocument writes neither contract_number nor artifact and
	// registerDocumentUrl cannot inject them. It must stay denied.
	test("denies a party-less contract row to its claimed uploader", async () => {
		const doc = forgedRow({ entity_type: "contract", uploaded_by: "buyer1" });
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	// A generated artifact is the second marker. sanitizeString returns "" for a
	// non-string input, so a contract_number posted as a JSON number lands blank
	// while still going through the contract flow.
	test("allows a blank-party contract with a generated artifact to its creator", async () => {
		const doc = forgedRow({
			entity_type: "contract",
			uploaded_by: "buyer1",
			artifact: { pdf_path: CONTRACT_PDF, status: "generated" },
		});
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	// A blank-party contract belongs to its creator and nobody else.
	test("denies a blank-party contract to an unrelated user", async () => {
		const doc = forgedRow({
			entity_type: "contract",
			uploaded_by: "buyer1",
			contract_number: "CN-7",
		});
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	// The uploaded_by fallback is scoped to entity_type "contract". It must not
	// leak into the default branch, which stays a hard deny.
	test("denies an unknown entity type even when it carries a contract number", async () => {
		const doc = {
			id: "d1",
			entity_type: "mystery",
			uploaded_by: "buyer1",
			contract_number: "CN-7",
		};
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("refuses to sign a public path", async () => {
		expect(await authorizeFilePath(BUYER, "/uploads/feed/x.png")).toEqual({
			ok: false,
			reason: "not_gated",
		});
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
		documentFindMany.mockResolvedValue([contractRow()]);
		const res = await authorizeFilePath(STRANGER, CONTRACT_PDF);
		expect(res).toEqual({ ok: false, reason: "forbidden" });
	});

	test("authorizes an owned contract end to end", async () => {
		documentFindMany.mockResolvedValue([contractRow()]);
		const res = await authorizeFilePath(BUYER, CONTRACT_PDF);
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d1");
	});

	// The primary use case: a contract PDF lives in artifact.pdf_path and never
	// in Document.file_path, so a file_path-only lookup denies the real buyer.
	test("authorizes a contract resolved through artifact.pdf_path", async () => {
		const pdfPath = "/uploads/contracts/CN-1-v1.pdf";
		documentFindMany.mockResolvedValue([
			contractRow({ id: "d3", file_path: null, artifact: { pdf_path: pdfPath } }),
		]);
		const res = await authorizeFilePath(BUYER, pdfPath);
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d3");
	});

	// The contract arm must be an equality Postgres can evaluate. Reading every
	// contract row plus its JSON blob on each request is the same whole-table
	// DoS lever the chat query had.
	test("narrows the contract lookup to artifact.pdf_path in SQL", async () => {
		documentFindMany.mockResolvedValue([]);
		await authorizeFilePath(BUYER, CONTRACT_PDF);
		expect(documentFindMany).toHaveBeenCalledTimes(1);
		const or = documentFindMany.mock.calls[0][0].where.OR;
		expect(or).toEqual([
			{ file_path: { contains: "a.pdf" } },
			{ artifact: { path: ["pdf_path"], equals: CONTRACT_PDF } },
		]);
		expect(JSON.stringify(or)).not.toContain("entity_type");
	});

	// The lookup key must come from the resolved absolute path, so a request that
	// differs from the stored string only in path shape still resolves.
	test("resolves the lookup key from the resolved path, not the raw request", async () => {
		documentFindMany.mockResolvedValue([contractRow()]);
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/./a.pdf");
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d1");
	});

	// The forged-row attack: the attacker registers a Document pointing at a
	// victim's gated file, then requests it.
	test("denies a forged document row the attacker registered for a gated file", async () => {
		documentFindMany.mockResolvedValue([
			forgedRow({ entity_type: "mystery", file_path: "/uploads/chat/victim.png" }),
		]);
		const res = await authorizeFilePath(STRANGER, "/uploads/chat/victim.png");
		expect(res).toEqual({ ok: false, reason: "forbidden" });
	});

	test("denies a forged contract row the attacker registered for a gated file", async () => {
		documentFindMany.mockResolvedValue([forgedRow({ entity_type: "contract" })]);
		const res = await authorizeFilePath(STRANGER, CONTRACT_PDF);
		expect(res).toEqual({ ok: false, reason: "forbidden" });
	});

	// A legitimate contract keeps working even when a forged row shares its path:
	// any-grant is load-bearing now that contract PDFs legitimately have a system
	// backfill row alongside the real contract row.
	test("still authorizes the true owner when a forged row shares the path", async () => {
		documentFindMany.mockResolvedValue([forgedRow({ entity_type: "mystery" }), contractRow()]);
		const res = await authorizeFilePath(BUYER, CONTRACT_PDF);
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d1");
	});
});

describe("external document registration route (server/routes/documentRoutes.js)", () => {
	// Read as source rather than imported: the route graph pulls in the whole
	// controller chain and a Prisma client, which this unit suite must not load.
	const source = fs.readFileSync(
		path.join(process.cwd(), "server", "routes", "documentRoutes.js"),
		"utf8",
	);

	test("POST /url requires a privileged role", () => {
		const line = source.split("\n").find((l) => l.includes('router.post("/url"'));
		expect(line).toBeDefined();
		expect(line).toMatch(/allowRoles\(\s*"(owner|admin)"/);
	});
});
