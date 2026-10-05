import crypto from "node:crypto";

// HyperCache Phase 3 — deterministic content hashing.
// Canonical JSON (sorted keys, stable primitives) -> sha256 hex.

function canonicalize(value) {
	if (value === null || value === undefined) {
		return "null";
	}
	if (Array.isArray(value)) {
		return `[${value.map((entry) => canonicalize(entry)).join(",")}]`;
	}
	if (typeof value === "object") {
		if (value instanceof Date) {
			return JSON.stringify(value.toISOString());
		}
		const keys = Object.keys(value).sort();
		const parts = keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`);
		return `{${parts.join(",")}}`;
	}
	return JSON.stringify(value);
}

export function canonicalJson(value) {
	return canonicalize(value ?? null);
}

export function contentHash(entity) {
	return crypto.createHash("sha256").update(canonicalJson(entity), "utf8").digest("hex");
}

export function contentHashOfFields(entity, fields) {
	if (!Array.isArray(fields) || fields.length === 0) {
		return contentHash(entity);
	}
	const picked = {};
	for (const field of fields) {
		picked[field] = entity?.[field] ?? null;
	}
	return contentHash(picked);
}
