/**
 * Session for a support-token buyer.
 *
 * The raw token (plus the buyer it belongs to and the label the owner
 * attached to it) lives in module state and is mirrored into
 * `sessionStorage` so a page reload or navigating back to /support does not
 * force the buyer to re-paste the token. Nothing is ever written to
 * localStorage or cookies, and the token is never logged.
 */

const STORAGE_KEY = "gartexhub_support_session";

let session = null;

function loadFromStorage() {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return null;
		}
		const parsed = JSON.parse(raw);
		if (!parsed || !parsed.token) {
			return null;
		}
		return {
			token: parsed.token,
			buyer: parsed.buyer ?? null,
			label: parsed.label ?? "",
		};
	} catch {
		return null;
	}
}

function saveToStorage(value) {
	try {
		if (value) {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} else {
			sessionStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// Storage may be disabled in private mode; fall back to memory only.
	}
}

/**
 * @param {Object} input
 * @param {string} input.token - The raw support token.
 * @param {{ id: string, name?: string } | null} [input.buyer] - The buyer the token maps to.
 * @param {string} [input.label] - The owner-facing label for the token.
 */
export function setSupportSession({ token, buyer = null, label = "" } = {}) {
	if (!token) {
		session = null;
		saveToStorage(null);
		return;
	}
	session = { token, buyer, label };
	saveToStorage(session);
}

/** @returns {{ token: string, buyer: { id: string, name?: string } | null, label: string } | null} */
export function getSupportSession() {
	if (session) {
		return { ...session };
	}
	const stored = loadFromStorage();
	if (stored) {
		session = stored;
		return { ...session };
	}
	return null;
}

export function clearSupportSession() {
	session = null;
	saveToStorage(null);
}
