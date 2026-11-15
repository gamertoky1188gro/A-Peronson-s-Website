import crypto from "node:crypto";
import prisma from "../utils/prisma.js";
import { findUserById } from "./userService.js";

const TOKEN_PREFIX = "gtk_sup_";
const TOKEN_BYTES = 32;
const SUPPORT_ELIGIBLE_ROLES = new Set(["buyer", "buying_house"]);

export function hashToken(token) {
	return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function generateToken() {
	const raw = crypto.randomBytes(TOKEN_BYTES).toString("base64url");
	const token = `${TOKEN_PREFIX}${raw}`;
	return { token, hash: hashToken(token) };
}

export async function issueToken({ buyerId, label, expiresAt = null, createdBy }) {
	const buyer = await prisma.user.findUnique({
		where: { id: String(buyerId) },
		select: { id: true, role: true, email: true, name: true },
	});
	if (!buyer) {
		const error = new Error("Buyer not found");
		error.status = 404;
		throw error;
	}
	if (!SUPPORT_ELIGIBLE_ROLES.has(buyer.role)) {
		const error = new Error("Only buyer accounts can be issued a support token");
		error.status = 400;
		throw error;
	}
	const safeLabel = String(label || "")
		.trim()
		.slice(0, 120);
	if (!safeLabel) {
		const error = new Error("A label is required");
		error.status = 400;
		throw error;
	}
	const { token, hash } = generateToken();
	const row = await prisma.supportAccessToken.create({
		data: {
			buyer_id: buyer.id,
			token_hash: hash,
			label: safeLabel,
			expires_at: expiresAt ? new Date(expiresAt) : null,
			created_by: String(createdBy || "unknown"),
		},
	});
	return {
		token,
		id: row.id,
		buyer_id: row.buyer_id,
		label: row.label,
		expires_at: row.expires_at,
		created_at: row.created_at,
	};
}

export async function validateToken(token) {
	const normalized = String(token || "").trim();
	if (!normalized.startsWith(TOKEN_PREFIX)) {
		return { ok: false, reason: "invalid" };
	}
	const row = await prisma.supportAccessToken.findUnique({
		where: { token_hash: hashToken(normalized) },
	});
	if (!row) return { ok: false, reason: "invalid" };
	if (row.revoked_at) return { ok: false, reason: "revoked" };
	if (row.expires_at && new Date(row.expires_at).getTime() <= Date.now()) {
		return { ok: false, reason: "expired" };
	}
	const buyer = await findUserById(row.buyer_id);
	if (!(buyer && SUPPORT_ELIGIBLE_ROLES.has(buyer.role)) || buyer.status === "locked") {
		return { ok: false, reason: "invalid" };
	}
	// fire-and-forget; never block the request on the audit write
	prisma.supportAccessToken
		.update({ where: { id: row.id }, data: { last_used_at: new Date() } })
		.catch(() => {});
	return { ok: true, buyer, tokenId: row.id, label: row.label };
}

export async function listTokens() {
	const rows = await prisma.supportAccessToken.findMany({
		orderBy: { created_at: "desc" },
		take: 200,
		include: { buyer: { select: { id: true, name: true, email: true } } },
	});
	return rows.map(({ token_hash, ...row }) => row);
}

export async function revokeToken(id) {
	const row = await prisma.supportAccessToken.findUnique({ where: { id: String(id) } });
	if (!row || row.revoked_at) return false;
	await prisma.supportAccessToken.update({
		where: { id: row.id },
		data: { revoked_at: new Date() },
	});
	return true;
}
