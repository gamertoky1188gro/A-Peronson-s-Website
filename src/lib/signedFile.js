import { apiRequest, getToken } from "./auth.js";

// Client half of the signed-URL gate built in server/utils/signedFileUrl.js.
//
// A signed url is a bearer credential in the query string: it is valid for five
// minutes by default (fifteen for call recordings) and it is the only thing
// `/api/files/content` accepts, because that route deliberately sits outside
// requireAuth so an <img>, an <iframe> and a new tab can all reach it without
// attaching an Authorization header.
//
// Three consequences shape everything below:
//
//   1. Sign immediately before you navigate or render. A url captured at mount
//      and reused across renders has already expired by the time anyone clicks.
//      Callers sign in the click handler (signAndOpen / signAndDownload), in a
//      one-shot ahead of a fetch (signOne), or in an effect keyed on the
//      attachment (signAndAssign / useSignedSrc).
//   2. Normalise first. Callers hold absolute urls whenever VITE_API_URL is set,
//      but the server's path helpers only strip a leading "uploads/", so an
//      absolute url arrives as the first segment "http:" and is reported
//      not_gated. Every entry point therefore reduces to a pathname before it
//      is sent.
//   3. Fail closed. A refused path, a network error, a 503 from an unconfigured
//      signing secret — all of them mean there is no url to use, and the helpers
//      return false / null rather than handing back the unsigned path. Nothing
//      here ever falls back to the raw path, because that fallback is the leak
//      the server-side gate exists to prevent.
//
// There is deliberately NO client-side copy of the server's gated-prefix list.
// The client used to keep one, to decide whether a document could be handed to
// the Office viewer — a live signature is a credential, so a private document
// must never reach view.officeapps.live.com. A second copy of that list is a
// drift hazard with a third-party consequence: a prefix added to the server
// without updating the copy left the embed unsuppressed and handed a private
// document's signed url to Microsoft, which fetches and retains it. The server
// now answers the question instead (thirdPartySafe on every /sign entry), and
// the client asks. The same goes for the signature lifetime: the server
// returns the ttl it actually used, instead of the client mirroring a
// constant that drifts the moment the server changes it.

// server/routes/fileAccessRoutes.js slices the body to MAX_PATHS_PER_REQUEST.
// Matching the cap here keeps the client from sending a request the server
// would silently answer for a prefix of the list.
const MAX_PATHS_PER_SIGN = 50;

/**
 * Reduces any url shape to the pathname the server keys its verdict on.
 *
 * @param {string} path - Relative "/uploads/chat/a.png" or absolute
 *   "https://host/uploads/chat/a.png"; both reduce to "/uploads/chat/a.png".
 * @returns {string} The pathname, or "" when nothing usable can be derived.
 */
export function toSignablePath(path) {
	const raw = String(path || "");
	if (!raw) return "";
	try {
		return new URL(raw, window.location.origin).pathname;
	} catch {
		return raw;
	}
}

/**
 * Asks the server to mint signed urls for a batch of private paths.
 *
 * @param {string[]} [paths] - Public paths, absolute or relative.
 * @returns {Promise<Record<string, { url?: string, error?: string, status?: number, ttlMs?: number, thirdPartySafe?: boolean }>>}
 *   Keyed by the NORMALISED path that was sent. A refused path has
 *   `error`/`status` and no `url`. Every entry carries `thirdPartySafe`
 *   (false for a gated path) and a signed one carries `ttlMs`, the lifetime
 *   the server actually gave the signature. Returns `{}` when the request
 *   fails outright.
 */
export async function signPaths(paths) {
	// Normalise before sending: the response is keyed by the string we send, so
	// every caller must look its own entry up by the normalised form too.
	const list = (paths || [])
		.filter(Boolean)
		.map((path) => toSignablePath(path))
		.filter(Boolean)
		.slice(0, MAX_PATHS_PER_SIGN);
	if (list.length === 0) return {};
	try {
		const data = await apiRequest("/files/sign", {
			method: "POST",
			token: getToken(),
			body: { paths: list },
		});
		return data?.signed || {};
	} catch {
		// A sign failure is not exceptional enough to surface on its own: the
		// callers below already translate a miss into their own error path.
		return {};
	}
}

/**
 * Asks the server whether a document may be handed to a third party.
 *
 * The Office viewer (view.officeapps.live.com) fetches whatever url it is
 * given and retains it, so a private document must never reach it. Whether a
 * path is private is the SERVER's answer: it owns the gated-prefix list, and
 * a client-side copy of it drifts — a prefix added to the server without
 * updating the copy leaves the embed unsuppressed and hands a private
 * document's signed url to a third party.
 *
 * Fails closed: anything the server does not explicitly clear is not safe.
 *
 * @param {string} path - Public path, relative or absolute.
 * @returns {Promise<boolean>} True only when the server says the path is not
 *   gated.
 */
export async function isThirdPartySafe(path) {
	const normalised = toSignablePath(path);
	if (!normalised) return false;
	const result = await signPaths([normalised]);
	return result[normalised]?.thirdPartySafe === true;
}

/**
 * Signs one path and returns the url.
 *
 * The one-shot counterpart to signAndOpen/signAndAssign, for callers that need
 * the url itself rather than a side effect — a fetch of a preview, a pdf.js
 * document, a library that takes a url and not an element.
 *
 * @param {string} path - Public path to sign, relative or absolute.
 * @returns {Promise<string | null>} The signed url, or null when refused.
 */
export async function signOne(path) {
	const normalised = toSignablePath(path);
	if (!normalised) return null;
	const result = await signPaths([normalised]);
	return result[normalised]?.url || null;
}

/**
 * Signs one path and returns the url and the lifetime the server gave it.
 *
 * The ttl is the server's, not a client-side mirror: a mirrored constant
 * drifts the moment the server changes it, and a stale refresh interval
 * outlives the signature it was meant to renew.
 *
 * @param {string} path - Public path to sign, relative or absolute.
 * @returns {Promise<{ url: string, ttlMs: number } | null>} The signed url
 *   and its lifetime, or null when refused.
 */
export async function signOneWithTtl(path) {
	const normalised = toSignablePath(path);
	if (!normalised) return null;
	const result = await signPaths([normalised]);
	const entry = result[normalised];
	if (!entry?.url) return null;
	const ttlMs = Number(entry.ttlMs);
	return { url: entry.url, ttlMs: Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : 0 };
}

/**
 * Signs one path and opens it in a new tab.
 *
 * @param {string} path - Public path to sign, relative or absolute.
 * @returns {Promise<boolean>} True only when a url was returned *and* opened.
 */
export async function signAndOpen(path) {
	const url = await signOne(path);
	if (!url) return false;
	window.open(url, "_blank");
	return true;
}

/**
 * Signs one path and hands the url to a setter, for surfaces that render the
 * file inline (<img src>, <video src>, <iframe src>).
 *
 * The setter is invoked asynchronously and only on success, so callers should
 * render `signedUrl || null` — an empty state keeps the unsigned path out of
 * the DOM while the request is in flight and if it fails.
 *
 * @param {string} path - Public path to sign, relative or absolute.
 * @param {(url: string) => void} setter - Receives the signed url.
 * @returns {Promise<boolean>} True when the setter was called.
 */
export async function signAndAssign(path, setter) {
	if (typeof setter !== "function") return false;
	const url = await signOne(path);
	if (!url) return false;
	setter(url);
	return true;
}

/**
 * Signs one path and downloads it under a caller-chosen filename.
 *
 * window.open cannot carry a `download` attribute, so "Save as..." needs a
 * synthesised anchor. The signed url is put in the anchor's href at the moment
 * of the click, never before, so the unsigned path never reaches the DOM.
 *
 * @param {string} path - Public path to sign, relative or absolute.
 * @param {string} [filename] - Suggested download filename.
 * @returns {Promise<boolean>} True only when a url was returned *and* clicked.
 */
export async function signAndDownload(path, filename = "") {
	const url = await signOne(path);
	if (!url) return false;
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.rel = "noopener noreferrer";
	if (filename) {
		anchor.download = filename;
	}
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	return true;
}
