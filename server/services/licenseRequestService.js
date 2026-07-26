import prisma from "../utils/prisma.js";
import { createNotification } from "./notificationService.js";

export async function createLicenseRequest(requesterId, recipientId, licenseName) {
	try {
		const request = await prisma.licenseRequest.create({
			data: {
				id: crypto.randomUUID(),
				requester_id: requesterId,
				recipient_id: recipientId,
				license_name: licenseName,
				status: "pending",
			},
		});

		await createNotification(recipientId, {
			type: "license_request",
			entity_type: "license_request",
			entity_id: request.id,
			message: `You have received a license request for "${licenseName}"`,
			meta: { requesterId, licenseName },
		});

		return request;
	} catch (error) {
		throw new Error(error?.message || "Failed to create license request");
	}
}

export async function uploadLicenseDocument(requestId, userId, fileUrl) {
	try {
		const existing = await prisma.licenseRequest.findUnique({
			where: { id: requestId },
		});

		if (!existing) {
			throw Object.assign(new Error("License request not found"), { statusCode: 404 });
		}

		if (existing.recipient_id !== userId) {
			throw Object.assign(new Error("Not authorized to upload for this request"), {
				statusCode: 403,
			});
		}

		const updated = await prisma.licenseRequest.update({
			where: { id: requestId },
			data: {
				uploaded_file_url: fileUrl,
				status: "document_uploaded",
				responded_at: new Date(),
			},
		});

		await createNotification(existing.requester_id, {
			type: "license_request_fulfilled",
			entity_type: "license_request",
			entity_id: requestId,
			message: `License document for "${existing.license_name}" has been uploaded`,
			meta: { recipientId: userId, licenseName: existing.license_name },
		});

		return updated;
	} catch (error) {
		if (error?.statusCode) throw error;
		throw new Error(error?.message || "Failed to upload license document");
	}
}

export async function rejectLicenseRequest(requestId, userId) {
	try {
		const existing = await prisma.licenseRequest.findUnique({
			where: { id: requestId },
		});

		if (!existing) {
			throw Object.assign(new Error("License request not found"), { statusCode: 404 });
		}

		if (existing.recipient_id !== userId) {
			throw Object.assign(new Error("Not authorized to reject this request"), { statusCode: 403 });
		}

		const updated = await prisma.licenseRequest.update({
			where: { id: requestId },
			data: {
				status: "rejected",
				responded_at: new Date(),
			},
		});

		await createNotification(existing.requester_id, {
			type: "license_request_rejected",
			entity_type: "license_request",
			entity_id: requestId,
			message: `Your license request for "${existing.license_name}" was rejected`,
			meta: { recipientId: userId, licenseName: existing.license_name },
		});

		return updated;
	} catch (error) {
		if (error?.statusCode) throw error;
		throw new Error(error?.message || "Failed to reject license request");
	}
}

export async function listPendingForUser(userId) {
	try {
		return await prisma.licenseRequest.findMany({
			where: { recipient_id: userId, status: "pending" },
			include: {
				requester: { select: { id: true, name: true, email: true, avatar_url: true } },
			},
			orderBy: { created_at: "desc" },
		});
	} catch {
		return [];
	}
}

export async function listMyRequests(userId) {
	try {
		return await prisma.licenseRequest.findMany({
			where: { requester_id: userId },
			include: {
				recipient: { select: { id: true, name: true, email: true, avatar_url: true } },
			},
			orderBy: { created_at: "desc" },
		});
	} catch {
		return [];
	}
}
