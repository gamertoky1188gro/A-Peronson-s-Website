import crypto from "node:crypto";
import prisma from "../utils/prisma.js";

// A support case is the PARENT of a ticket: the thread a client opens, the
// evidence attached to it, and the investigations run against it. The rows
// live in support_cases / support_case_messages / support_investigations /
// support_case_attachments (see prisma/schema.prisma).
//
// The case id is generated here rather than by a database default, because
// the id is also the anchor the evidence rows carry (entity_id on the
// Document row) and the client is handed it immediately.

const DEFAULT_STATUS = "collecting";

function text(value) {
	return String(value ?? "").trim();
}

/**
 * Opens a case for a user.
 *
 * @param {Object} params
 * @param {string} params.userId The id of the user the case belongs to.
 * @param {string} [params.subject] A one-line summary of the problem.
 * @returns {Promise<Object>} The created case row.
 */
export async function createCase({ userId, subject }) {
	const owner = text(userId);
	if (!owner) {
		throw new Error("userId is required to create a case");
	}
	return prisma.supportCase.create({
		data: {
			id: crypto.randomUUID(),
			user_id: owner,
			// Written here as well as in the schema default: the status is part
			// of the case's contract, and a caller that reads the row back must
			// not depend on a database default it cannot see.
			status: DEFAULT_STATUS,
			subject: text(subject) || null,
		},
	});
}

/**
 * Appends one message to a case.
 *
 * The sequence is allocated inside a transaction: two appends that race (the
 * investigator runtime and the client, at the same moment) would otherwise
 * read the same "last sequence" and both write the same number, and the
 * messages are ordered by it.
 *
 * @param {Object} params
 * @param {string} params.caseId The case the message belongs to.
 * @param {string} params.role Who said it ("user", "assistant", "system").
 * @param {string} [params.kind] What kind of message it is.
 * @param {string} params.content The message body.
 * @param {string} [params.agent] The agent that produced it, if any.
 * @returns {Promise<Object>} The created message row.
 */
export async function appendCaseMessage({ caseId, role, kind = "answer", content, agent = null }) {
	return prisma.$transaction(async (tx) => {
		const last = await tx.supportCaseMessage.findFirst({
			where: { case_id: caseId },
			orderBy: { sequence: "desc" },
			select: { sequence: true },
		});
		return tx.supportCaseMessage.create({
			data: {
				id: crypto.randomUUID(),
				case_id: caseId,
				role,
				kind,
				content,
				agent,
				sequence: (last?.sequence || 0) + 1,
			},
		});
	});
}

/**
 * Reads a case and its messages, oldest first.
 *
 * @param {string} caseId
 * @returns {Promise<Object|null>} The case row, or null when there is none.
 */
export async function getCaseWithMessages(caseId) {
	return prisma.supportCase.findUnique({
		where: { id: caseId },
		include: { messages: { orderBy: { sequence: "asc" } } },
	});
}

/**
 * Lists the cases a user opened, most recently touched first.
 *
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
export async function listCasesForUser(userId) {
	return prisma.supportCase.findMany({
		where: { user_id: userId },
		orderBy: { updated_at: "desc" },
	});
}

/**
 * Lists every case, most recently touched first. Staff view.
 *
 * @returns {Promise<Object[]>}
 */
export async function listCasesAdmin() {
	return prisma.supportCase.findMany({ orderBy: { updated_at: "desc" } });
}

/**
 * Deletes a case and everything hanging off it.
 *
 * The attachment rows go with it (the relation cascades), and they are
 * RETURNED so the caller can clean up the bytes and the Document rows that
 * anchor them — those are not part of the case's foreign key, so the database
 * cannot remove them.
 *
 * @param {string} caseId
 * @returns {Promise<Object[]>} The attachment rows that were removed.
 */
export async function deleteCase(caseId) {
	const attachments = await prisma.supportCaseAttachment.findMany({ where: { case_id: caseId } });
	await prisma.supportCase.delete({ where: { id: caseId } });
	return attachments;
}
