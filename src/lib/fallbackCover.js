import { useEffect, useState } from "react";

const WALLHAVEN_URL =
	"https://wallhaven.cc/api/v1/search?categories=100&purity=100&ratios=16x9,16x10,21x9,32x9,48x9&sorting=random&colors=0066cc";

// Fetches a fresh random blue wallpaper on every mount (every page view /
// reload gets a new banner). Returns "" while loading or on failure —
// callers fall back to the gradient. No caching on purpose.
export function useFallbackCover(enabled) {
	const [url, setUrl] = useState("");
	useEffect(() => {
		if (!enabled) return;
		let alive = true;
		fetch(WALLHAVEN_URL)
			.then((r) => (r.ok ? r.json() : null))
			.then((j) => {
				const first = j?.data?.[0]?.path;
				if (alive && typeof first === "string" && first.startsWith("http")) {
					setUrl(first);
				}
			})
			.catch(() => {
				/* keep gradient fallback */
			});
		return () => {
			alive = false;
		};
	}, [enabled]);
	return url;
}
