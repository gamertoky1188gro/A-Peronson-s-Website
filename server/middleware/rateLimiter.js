const ipHits = new Map();

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
