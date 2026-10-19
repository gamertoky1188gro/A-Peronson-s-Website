import { useEffect, useState } from "react";
import { signOneWithTtl } from "../lib/signedFile.js";

/**
 * Signs a gated asset path and returns "" until the server hands back a url.
 *
 * "" is the fail-closed value: callers render nothing rather than the raw path,
 * so an unsigned private url can never reach a DOM sink. That also means a
 * public (non-gated) path renders nothing too — the server reports `not_gated`
 * and issues no url — so use this only for gated assets (chat attachments,
 * contract artifacts, call recordings).
 *
 * @param {string} url - Asset path, relative or absolute. Falsy disables signing.
 * @param {{ refreshMs?: number | null }} [options] - `refreshMs` re-signs on an
 *   interval so a surface the user leaves open past the signature's ttl keeps
 *   working. `null` (the default) means "half the lifetime the SERVER gave the
 *   signature" — the server is the authority on how long a signature lasts, and
 *   a client-side copy of that number drifts the moment the server changes it.
 *   Pass 0 for short-lived decorative thumbnails: every refresh swaps the
 *   element's src, which visibly reloads an <img> and restarts a <video>, so it
 *   is only worth paying for on interactive surfaces.
 * @returns {string} The signed url, or "" while pending and after a refusal.
 */
export function useSignedSrc(url, { refreshMs = null } = {}) {
	const [signedSrc, setSignedSrc] = useState("");

	useEffect(() => {
		let alive = true;
		let timer = null;

		// Always clear first, on every url change and not only when the url goes
		// empty: a new asset invalidates the previous signature, and a stale url
		// rendering against a different file is exactly the leak this guards.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSignedSrc("");

		if (!url) {
			return () => {
				alive = false;
			};
		}

		const clearTimer = () => {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		};

		const sign = async () => {
			const signed = await signOneWithTtl(url);
			if (!alive) {
				return;
			}
			setSignedSrc(signed?.url || "");
			clearTimer();
			// The interval is half the signature's own lifetime, so the refresh
			// always lands before the signature expires — and it follows the
			// server when the server changes the lifetime.
			const interval = refreshMs === null ? Math.floor((signed?.ttlMs || 0) / 2) : refreshMs;
			if (interval > 0) {
				timer = setInterval(sign, interval);
			}
		};

		void sign();
		// The timer lives inside this effect, so a refresh swaps the url without
		// clearing it first — only a genuinely new asset blanks the element.
		return () => {
			alive = false;
			clearTimer();
		};
	}, [url, refreshMs]);

	return signedSrc;
}

export default useSignedSrc;
