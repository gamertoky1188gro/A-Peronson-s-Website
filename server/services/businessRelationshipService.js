import crypto from "node:crypto";
import prisma from "../utils/prisma.js";
import { createNotification } from "./notificationService.js";

export async function sendRelationshipRequest(senderId, recipientId) {
	try {
		const existing = await prisma.businessRelationship.findFirst({
			where: {
				OR: [
					{ buyer_id: senderId, counterparty_id: recipientId },
					{ buyer_id: recipientId, counterparty_id: senderId },
				],
			},
		});

		if (existing) {
			throw Object.assign(new Error("Relationship already exists"), { statusCode: 409 });
		}

		const relationship = await prisma.businessRelationship.create({
			data: {
				id: crypto.randomUUID(),
				buyer_id: senderId,
				counterparty_id: recipientId,
				status: "pending",
			},
		});

		await createNotification(recipientId, {
			type: "relationship_request",
			entity_type: "relationship_request",
			entity_id: relationship.id,
			message: "You have received a business relationship request",
			meta: { senderId },
		});

		return relationship;
	} catch (error) {
		if (error?.statusCode) {
			throw error;
		}
		throw new Error(error?.message || "Failed to send relationship request");
	}
}

export async function confirmRelationship(relationshipId, userId) {
	try {
		const existing = await prisma.businessRelationship.findUnique({
			where: { id: relationshipId },
		});

		if (!existing) {
			throw Object.assign(new Error("Relationship not found"), { statusCode: 404 });
		}

		if (existing.counterparty_id !== userId) {
			throw Object.assign(new Error("Not authorized to confirm this relationship"), {
				statusCode: 403,
			});
		}

		if (existing.status !== "pending") {
			throw Object.assign(new Error("Relationship is not in pending status"), {
				statusCode: 400,
			});
		}

		const updated = await prisma.businessRelationship.update({
			where: { id: relationshipId },
			data: {
				status: "confirmed",
				confirmed_at: new Date(),
			},
		});

		await createNotification(existing.buyer_id, {
			type: "relationship_confirmed",
			entity_type: "relationship_confirmed",
			entity_id: relationshipId,
			message: "Your business relationship request has been confirmed",
			meta: { counterpartyId: userId },
		});

		return updated;
	} catch (error) {
		if (error?.statusCode) {
			throw error;
		}
		throw new Error(error?.message || "Failed to confirm relationship");
	}
}

export async function rejectRelationship(relationshipId, userId) {
	try {
		const existing = await prisma.businessRelationship.findUnique({
			where: { id: relationshipId },
		});

		if (!existing) {
			throw Object.assign(new Error("Relationship not found"), { statusCode: 404 });
		}

		if (existing.counterparty_id !== userId) {
			throw Object.assign(new Error("Not authorized to reject this relationship"), {
				statusCode: 403,
			});
		}

		if (existing.status !== "pending") {
			throw Object.assign(new Error("Relationship is not in pending status"), {
				statusCode: 400,
			});
		}

		const updated = await prisma.businessRelationship.update({
			where: { id: relationshipId },
			data: { status: "rejected" },
		});

		await createNotification(existing.buyer_id, {
			type: "relationship_rejected",
			entity_type: "relationship_rejected",
			entity_id: relationshipId,
			message: "Your business relationship request has been rejected",
			meta: { counterpartyId: userId },
		});

		return updated;
	} catch (error) {
		if (error?.statusCode) {
			throw error;
		}
		throw new Error(error?.message || "Failed to reject relationship");
	}
}

export async function listRelationships(userId) {
	try {
		return await prisma.businessRelationship.findMany({
			where: {
				OR: [{ buyer_id: userId }, { counterparty_id: userId }],
			},
			orderBy: { created_at: "desc" },
		});
	} catch {
		return [];
	}
}

export async function hasConfirmedRelationship(userId, counterpartyId) {
	try {
		const row = await prisma.businessRelationship.findFirst({
			where: {
				OR: [
					{ buyer_id: userId, counterparty_id: counterpartyId },
					{ buyer_id: counterpartyId, counterparty_id: userId },
				],
				status: "confirmed",
			},
		});
		return Boolean(row);
	} catch {
		return false;
	}
}

export async function getRelationshipStatus(userId, counterpartyId) {
	try {
		const row = await prisma.businessRelationship.findFirst({
			where: {
				OR: [
					{ buyer_id: userId, counterparty_id: counterpartyId },
					{ buyer_id: counterpartyId, counterparty_id: userId },
				],
			},
		});

		if (!row) {
			return "none";
		}
		return row.status;
	} catch {
		return "none";
	}
}
