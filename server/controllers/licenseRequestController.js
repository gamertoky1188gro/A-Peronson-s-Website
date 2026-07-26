import {
	createLicenseRequest,
	listMyRequests,
	listPendingForUser,
	rejectLicenseRequest,
	uploadLicenseDocument,
} from "../services/licenseRequestService.js";

export async function createLicenseRequestController(req, res) {
	try {
		const { recipient_id, license_name } = req.body;
		const result = await createLicenseRequest(req.user.id, recipient_id, license_name);
		return res.status(201).json(result);
	} catch (error) {
		const status = Number(error?.statusCode) || 400;
		return res.status(status).json({ error: error?.message || "Failed to create license request" });
	}
}

export async function uploadLicenseDocumentController(req, res) {
	try {
		const result = await uploadLicenseDocument(
			req.params.requestId,
			req.user.id,
			req.body.file_url,
		);
		return res.json(result);
	} catch (error) {
		const status = Number(error?.statusCode) || 400;
		return res
			.status(status)
			.json({ error: error?.message || "Failed to upload license document" });
	}
}

export async function rejectLicenseRequestController(req, res) {
	try {
		const result = await rejectLicenseRequest(req.params.requestId, req.user.id);
		return res.json(result);
	} catch (error) {
		const status = Number(error?.statusCode) || 400;
		return res.status(status).json({ error: error?.message || "Failed to reject license request" });
	}
}

export async function listPendingController(req, res) {
	try {
		const items = await listPendingForUser(req.user.id);
		return res.json({ items });
	} catch {
		return res.status(500).json({ error: "Failed to list pending requests" });
	}
}

export async function listMyRequestsController(req, res) {
	try {
		const items = await listMyRequests(req.user.id);
		return res.json({ items });
	} catch {
		return res.status(500).json({ error: "Failed to list outgoing requests" });
	}
}
