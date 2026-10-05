// HyperCache Phase 2 — content hashing (SHA-256 via SubtleCrypto).
// Canonical JSON: stable key order, recursive, so identical payloads hash equally.

export function canonicalize(value) {
	if (value === null || value === undefined) return "null";
	if (Array.isArray(value)) {
		return `[${value.map((v) => canonicalize(v)).join(",")}]`;
	}
	if (typeof value === "object") {
		const keys = Object.keys(value).sort();
		const parts = keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`);
		return `{${parts.join(",")}}`;
	}
	return JSON.stringify(value);
}

function toHex(buffer) {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

function sha256Fallback(input) {
	// Non-crypto fallback (tests / insecure contexts): FNV-1a 32-bit, hex-padded.
	// NOT cryptographically secure — only used when SubtleCrypto is unavailable.
	let h = 0x81_1c_9d_c5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01_00_01_93) >>> 0;
	}
	return `fnv1a-${h.toString(16).padStart(8, "0")}`;
}

export async function sha256Hex(text) {
	try {
		const subtle = globalThis.crypto?.subtle;
		if (!subtle) return sha256Fallback(text);
		const digest = await subtle.digest("SHA-256", new TextEncoder().encode(text));
		return toHex(digest);
	} catch {
		return sha256Fallback(text);
	}
}

export async function contentHash(value) {
	return sha256Hex(canonicalize(value));
}

export default { canonicalize, sha256Hex, contentHash };
