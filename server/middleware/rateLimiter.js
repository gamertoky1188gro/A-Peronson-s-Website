import { getRedisClient, isRedisConnected } from "../utils/redis.js";

// ---------- memory store ----------
const ipHits = new Map();
let memoryCleanupStarted = false;

function ensureMemoryCleanup() {
	if (memoryCleanupStarted) {
		return;
	}
	memoryCleanupStarted = true;
	const timer = setInterval(() => {
		const cutoff = Date.now() - 3_600_000;
		for (const [ip, hits] of ipHits) {
			const recent = hits.filter((t) => t > cutoff);
			if (recent.length === 0) {
				ipHits.delete(ip);
			} else {
				ipHits.set(ip, recent);
			}
		}
	}, 300_000);
	// Node returns a Timeout with unref(); a browser-style environment (jsdom,
	// which the frontend suites run in) returns a number, and a number has no
	// unref. The timer is only a memory sweep, so it must not keep the process
	// alive where unref is unavailable.
	if (typeof timer?.unref === "function") {
		timer.unref();
	}
}

// ---------- createRateLimiter ----------
//
// keyResolver lets a route limit by something other than the caller's IP: a
// route that sits behind requireAuth can count per USER, which is the only
// meaningful key for a bearer-token API (many users behind one NAT share an
// address, and one address behind many users is not a user).
export function createRateLimiter({
	windowMs = 15 * 60 * 1000,
	max = 20,
	store = "memory",
	prefix = "global",
	keyResolver = null,
} = {}) {
	if (store === "redis") {
		return createRedisLimiter(windowMs, max, prefix, keyResolver);
	}
	return createMemoryLimiter(windowMs, max, keyResolver);
}

function limiterKey(req, keyResolver) {
	if (typeof keyResolver === "function") {
		const key = keyResolver(req);
		if (key !== undefined && key !== null && String(key) !== "") {
			return String(key);
		}
	}
	return req.ip || req.connection?.remoteAddress || "unknown";
}

// ---------- in-memory limiter ----------
function createMemoryLimiter(windowMs, max, keyResolver) {
	ensureMemoryCleanup();

	return (req, res, next) => {
		const key = limiterKey(req, keyResolver);
		const now = Date.now();
		const windowStart = now - windowMs;

		if (!ipHits.has(key)) {
			ipHits.set(key, []);
		}

		const hits = ipHits.get(key).filter((t) => t > windowStart);
		hits.push(now);
		ipHits.set(key, hits);

		if (hits.length > max) {
			return res.status(429).json({ error: "Too many requests, please try again later." });
		}

		next();
	};
}

// ---------- Redis limiter ----------
function createRedisLimiter(windowMs, max, prefix, keyResolver) {
	const windowSeconds = Math.ceil(windowMs / 1000);

	return (req, res, next) => {
		const key = `ratelimit:${prefix}:${limiterKey(req, keyResolver)}`;

		if (!isRedisConnected()) {
			return createMemoryLimiter(windowMs, max, keyResolver)(req, res, next);
		}

		const client = getRedisClient();

		client
			.incr(key)
			.then((count) => {
				if (count === 1) {
					return client.expire(key, windowSeconds).then(() => count);
				}
				return count;
			})
			.then((count) => {
				if (count > max) {
					return res.status(429).json({ error: "Too many requests, please try again later." });
				}
				next();
			})
			.catch(() => {
				next();
			});
	};
}

// ---------- named limiters ----------
const authLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 20,
	prefix: "auth",
});

const passkeyLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	prefix: "passkey",
});

const adminLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: 60,
	prefix: "admin",
});

const generalLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: 100,
	prefix: "general",
});

export { adminLimiter, authLimiter, generalLimiter, passkeyLimiter };
