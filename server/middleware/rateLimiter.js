import { getRedisClient, isRedisConnected } from "../utils/redis.js";

// ---------- memory store ----------
const ipHits = new Map();
let memoryCleanupStarted = false;

function ensureMemoryCleanup() {
	if (memoryCleanupStarted) {
		return;
	}
	memoryCleanupStarted = true;
	setInterval(() => {
		const cutoff = Date.now() - 3_600_000;
		for (const [ip, hits] of ipHits) {
			const recent = hits.filter((t) => t > cutoff);
			if (recent.length === 0) {
				ipHits.delete(ip);
			} else {
				ipHits.set(ip, recent);
			}
		}
	}, 300_000).unref();
}

// ---------- createRateLimiter ----------
export function createRateLimiter({
	windowMs = 15 * 60 * 1000,
	max = 20,
	store = "memory",
	prefix = "global",
} = {}) {
	if (store === "redis") {
		return createRedisLimiter(windowMs, max, prefix);
	}
	return createMemoryLimiter(windowMs, max);
}

// ---------- in-memory limiter ----------
function createMemoryLimiter(windowMs, max) {
	ensureMemoryCleanup();

	return (req, res, next) => {
		const ip = req.ip || req.connection?.remoteAddress || "unknown";
		const now = Date.now();
		const windowStart = now - windowMs;

		if (!ipHits.has(ip)) {
			ipHits.set(ip, []);
		}

		const hits = ipHits.get(ip).filter((t) => t > windowStart);
		hits.push(now);
		ipHits.set(ip, hits);

		if (hits.length > max) {
			return res.status(429).json({ error: "Too many requests, please try again later." });
		}

		next();
	};
}

// ---------- Redis limiter ----------
function createRedisLimiter(windowMs, max, prefix) {
	const windowSeconds = Math.ceil(windowMs / 1000);

	return (req, res, next) => {
		const ip = req.ip || req.connection?.remoteAddress || "unknown";
		const key = `ratelimit:${prefix}:${ip}`;

		if (!isRedisConnected()) {
			return createMemoryLimiter(windowMs, max)(req, res, next);
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
