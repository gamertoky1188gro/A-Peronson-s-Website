/**
 * In-memory session for a support-token buyer.
 *
 * The raw token (plus the buyer it belongs to and the label the owner
 * attached to it) lives in module state only: never localStorage,
 * sessionStorage or cookies, and never logged. A page refresh drops it,
 * which is the intended lifetime — the buyer re-enters the token.
 */

let session = null;

/**
 * @param {Object} input
 * @param {string} input.token - The raw support token.
 * @param {{ id: string, name?: string } | null} [input.buyer] - The buyer the token maps to.
 * @param {string} [input.label] - The owner-facing label for the token.
 */
export function setSupportSession({ token, buyer = null, label = "" } = {}) {
	if (!token) {
		session = null;
		return;
	}
	session = { token, buyer, label };
}

/** @returns {{ token: string, buyer: { id: string, name?: string } | null, label: string } | null} */
export function getSupportSession() {
	return session ? { ...session } : null;
}

export function clearSupportSession() {
	session = null;
}
