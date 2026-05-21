const ipHits = new Map();

// Periodically clean stale entries to prevent memory leak
setInterval(() => {
  const cutoff = Date.now() - 3600000;
  for (const [ip, hits] of ipHits) {
    const recent = hits.filter((t) => t > cutoff);
    if (recent.length === 0) ipHits.delete(ip);
    else ipHits.set(ip, recent);
  }
}, 300000).unref();

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 20 }) {
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
