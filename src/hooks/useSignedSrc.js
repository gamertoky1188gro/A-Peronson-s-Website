import { useEffect, useState } from "react";
import { signOne } from "../lib/signedFile.js";

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
 * @param {{ refreshMs?: number }} [options] - `refreshMs` re-signs on an
 *   interval so a surface the user leaves open past the signature's ttl keeps
 *   working. Pass 0 (the default) for short-lived decorative thumbnails: every
 *   refresh swaps the element's src, which visibly reloads an <img> and restarts
 *   a <video>, so it is only worth paying for on interactive surfaces.
 * @returns {string} The signed url, or "" while pending and after a refusal.
 */
export function useSignedSrc(url, { refreshMs = 0 } = {}) {
	const [signedSrc, setSignedSrc] = useState("");

	useEffect(() => {
		let alive = true;

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

		const sign = async () => {
			const next = await signOne(url);
			if (alive) {
				setSignedSrc(next || "");
			}
		};

		void sign();
		// The timer lives inside this effect, so a refresh swaps the url without
		// clearing it first — only a genuinely new asset blanks the element.
		const timer = refreshMs > 0 ? setInterval(sign, refreshMs) : null;
		return () => {
			alive = false;
			if (timer) clearInterval(timer);
		};
	}, [url, refreshMs]);

	return signedSrc;
}

export default useSignedSrc;
