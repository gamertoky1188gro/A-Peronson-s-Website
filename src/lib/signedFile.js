import { apiRequest, getToken } from "./auth.js";

// Client half of the signed-URL gate built in server/utils/signedFileUrl.js.
//
// A signed url is a bearer credential in the query string: it is valid for five
// minutes by default (fifteen for call recordings) and it is the only thing
// `/api/files/content` accepts, because that route deliberately sits outside
// requireAuth so an <img>, an <iframe> and a new tab can all reach it without
// attaching an Authorization header.
//
// Two consequences shape everything below:
//
//   1. Sign immediately before you navigate or render. A url captured at mount
//      and reused across renders has already expired by the time anyone clicks.
//      Callers therefore sign in the click handler (signAndOpen) or in an effect
//      keyed on the attachment (signAndAssign).
//   2. Fail closed. A refused path, a network error, a 503 from an unconfigured
//      signing secret — all of them mean there is no url to use, and the helper
//      returns false rather than handing back the unsigned path. Nothing here
//      ever falls back to the raw path, because that fallback is the leak the
//      server-side gate exists to prevent.

// server/routes/fileAccessRoutes.js slices the body to MAX_PATHS_PER_REQUEST.
// Matching the cap here keeps the client from sending a request the server
// would silently answer for a prefix of the list.
const MAX_PATHS_PER_SIGN = 50;

/**
 * Asks the server to mint signed urls for a batch of private paths.
 *
 * @param {string[]} [paths] - Public paths, e.g. "/uploads/contracts/a.pdf".
 * @returns {Promise<Record<string, { url?: string, error?: string, status?: number }>>}
 *   Keyed by the path string that was sent. A refused path has `error`/`status`
 *   and no `url`. Returns `{}` when the request fails outright.
 */
export async function signPaths(paths) {
	const list = (paths || []).filter(Boolean).slice(0, MAX_PATHS_PER_SIGN);
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
		// callers below already translate `false` into their own error path.
		return {};
	}
}

/**
 * Signs one path and opens it in a new tab.
 *
 * @param {string} path - Public path to sign.
 * @returns {Promise<boolean>} True only when a url was returned *and* opened.
 */
export async function signAndOpen(path) {
	if (!path) return false;
	const result = await signPaths([path]);
	const url = result[path]?.url;
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
 * @param {string} path - Public path to sign.
 * @param {(url: string) => void} setter - Receives the signed url.
 * @returns {Promise<boolean>} True when the setter was called.
 */
export async function signAndAssign(path, setter) {
	if (!path || typeof setter !== "function") return false;
	const result = await signPaths([path]);
	const url = result[path]?.url;
	if (!url) return false;
	setter(url);
	return true;
}
