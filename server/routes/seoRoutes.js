import { Router } from "express";

const router = Router();
const BASE = "https://gartexhub.onrender.com";
const TODAY = new Date().toISOString().slice(0, 10);

/* ──────────────────────────────────────────────
   robots.txt
   ────────────────────────────────────────────── */
const robotsTxt = `# ── GarTexHub robots.txt ─────────────────────────────
# Generated: ${TODAY}
# https://gartexhub.onrender.com/robots.txt

# ── Default: allow all crawlers ──────────────────────
User-agent: *
Allow: /
Disallow: /api/
Disallow: /uploads/
Disallow: /log-viewer/
Disallow: /ws/
Disallow: /health

# ── Search parameter crawl-waste prevention ──────────
# Prevents indexing of faceted search / filter URLs
Disallow: /feed?*
Disallow: /search?*

# ── Googlebot ────────────────────────────────────────
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /uploads/
Disallow: /log-viewer/
Disallow: /ws/
Disallow: /health
Disallow: /feed?*
Disallow: /search?*

# ── Bingbot ──────────────────────────────────────────
User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /uploads/
Disallow: /log-viewer/
Disallow: /ws/
Disallow: /health
Disallow: /feed?*
Disallow: /search?*

# ── AI Crawlers ──────────────────────────────────────
# Block AI training scrapers; allow search-related AI
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

# ── Bad bots ─────────────────────────────────────────
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# ── Sitemap ──────────────────────────────────────────
Sitemap: ${BASE}/sitemap.xml
`;

/* ──────────────────────────────────────────────
   /sitemap.xml — Index pointing to sub-sitemaps
   ────────────────────────────────────────────── */
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE}/sitemaps/pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <!-- Future sub-sitemaps:
  <sitemap>
    <loc>${BASE}/sitemaps/products.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemaps/blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemaps/users.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  -->
</sitemapindex>
`;

/* ──────────────────────────────────────────────
   /sitemaps/pages.xml — Public pages
   ────────────────────────────────────────────── */
const publicPages = [
  { path: "/", lastmod: "2026-09-12" },
  { path: "/pricing", lastmod: "2026-09-10" },
  { path: "/about", lastmod: "2026-09-10" },
  { path: "/help", lastmod: "2026-09-10" },
  { path: "/login", lastmod: "2026-09-12" },
  { path: "/signup", lastmod: "2026-09-12" },
  { path: "/terms", lastmod: "2026-09-10" },
  { path: "/privacy", lastmod: "2026-09-10" },
];

const pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages
	.map(
		(p) => `  <url>
    <loc>${BASE}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
  </url>`,
	)
	.join("\n")}
</urlset>
`;

/* ── Routes ──────────────────────────────────────── */
router.get("/robots.txt", (_req, res) => {
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.set("Cache-Control", "public, max-age=86400");
	res.send(robotsTxt);
});

router.get("/sitemap.xml", (_req, res) => {
	res.set("Content-Type", "application/xml; charset=utf-8");
	res.set("Cache-Control", "public, max-age=86400");
	res.send(sitemapIndex);
});

router.get("/sitemaps/pages.xml", (_req, res) => {
	res.set("Content-Type", "application/xml; charset=utf-8");
	res.set("Cache-Control", "public, max-age=86400");
	res.send(pagesSitemap);
});

export default router;
