import {
	confirmRelationship,
	getRelationshipStatus,
	listRelationships,
	rejectRelationship,
	sendRelationshipRequest,
} from "../services/businessRelationshipService.js";

export async function sendRelationshipController(req, res) {
	try {
		const result = await sendRelationshipRequest(req.user.id, req.body.recipient_id);
		return res.status(201).json(result);
	} catch (error) {
		const status = error?.statusCode || 500;
		return res.status(status).json({ error: error.message });
	}
}

export async function confirmRelationshipController(req, res) {
	try {
		const result = await confirmRelationship(req.params.id, req.user.id);
		return res.json(result);
	} catch (error) {
		const status = error?.statusCode || 500;
		return res.status(status).json({ error: error.message });
	}
}

export async function rejectRelationshipController(req, res) {
	try {
		const result = await rejectRelationship(req.params.id, req.user.id);
		return res.json(result);
	} catch (error) {
		const status = error?.statusCode || 500;
		return res.status(status).json({ error: error.message });
	}
}

export async function listRelationshipsController(req, res) {
	try {
		const result = await listRelationships(req.user.id);
		return res.json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export async function relationshipStatusController(req, res) {
	try {
		const result = await getRelationshipStatus(req.user.id, req.params.counterpartyId);
		return res.json({ status: result });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
