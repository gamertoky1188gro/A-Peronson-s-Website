import prisma from "../utils/prisma.js";

const FETCH_TIMEOUT_MS = 5000;
const MAX_RESPONSE_SIZE = 256 * 1024;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function extractMeta(html, property) {
  const patterns = [
    new RegExp(`<meta\\s+[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["']`, "i"),
    new RegExp(`<meta\\s+[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decodeHtmlEntities(m[1]);
  }
  return null;
}

function extractFavicon(html, baseUrl) {
  const patterns = [
    /<link\s+[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["']/i,
    /<link\s+[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']*)["']/i,
    /<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']icon["']/i,
    /<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']shortcut icon["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return resolveUrl(m[1], baseUrl);
  }
  return `${baseUrl.origin}/favicon.ico`;
}

function extractTitle(html) {
  const og = extractMeta(html, "title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (m) return decodeHtmlEntities(m[1].trim());
  return null;
}

function extractDescription(html) {
  const og = extractMeta(html, "description");
  if (og) return og;
  const meta = extractMeta(html, "description");
  if (meta) return meta;
  return null;
}

function extractSiteName(html) {
  return extractMeta(html, "site_name");
}

function extractImage(html, baseUrl) {
  const og = extractMeta(html, "image");
  if (og) return resolveUrl(og, baseUrl);
  return null;
}

function resolveUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl.origin).href;
  } catch {
    return href;
  }
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)));
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GartexHub/1.0; +https://gartexhub.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const contentType = resp.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("Not an HTML page");
    }
    const reader = resp.body.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_RESPONSE_SIZE) {
        chunks.push(value.slice(0, MAX_RESPONSE_SIZE - total + value.length));
        break;
      }
      chunks.push(value);
    }
    const decoder = new TextDecoder();
    return chunks.map((c) => decoder.decode(c, { stream: true })).join("");
  } finally {
    clearTimeout(timer);
  }
}

function parseDomain(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

export async function getLinkPreview(url) {
  if (!url || typeof url !== "string") return null;
  try {
    new URL(url);
  } catch {
    return null;
  }

  const existing = await prisma.linkPreview.findUnique({ where: { url } });
  if (existing && Date.now() - new Date(existing.updated_at).getTime() < CACHE_TTL_MS) {
    return existing;
  }

  try {
    const html = await fetchHtml(url);
    const baseUrl = new URL(url);
    const title = extractTitle(html);
    const description = extractDescription(html);
    const image = extractImage(html, baseUrl);
    const favicon = extractFavicon(html, baseUrl);
    const siteName = extractSiteName(html);
    const domain = parseDomain(url);

    const data = { url, title, description, image, favicon, site_name: siteName, domain };

    if (existing) {
      return prisma.linkPreview.update({ where: { url }, data });
    }
    return prisma.linkPreview.create({ data });
  } catch (err) {
    const domain = parseDomain(url);
    const fallback = { url, title: domain, description: null, image: null, favicon: null, site_name: null, domain };

    if (existing) {
      return prisma.linkPreview.update({ where: { url }, data: fallback }).catch(() => fallback);
    }
    return prisma.linkPreview.create({ data: fallback }).catch(() => fallback);
  }
}

export async function batchGetLinkPreviews(urls) {
  const unique = [...new Set(urls.filter(Boolean))];
  const existing = await prisma.linkPreview.findMany({
    where: { url: { in: unique } },
  });
  const cached = new Map(existing.map((p) => [p.url, p]));
  const stale = existing.filter(
    (p) => Date.now() - new Date(p.updated_at).getTime() >= CACHE_TTL_MS,
  );
  const missing = unique.filter((u) => !cached.has(u));
  const toFetch = [...new Set([...missing, ...stale.map((s) => s.url)])];

  const results = new Map(cached);
  await Promise.allSettled(
    toFetch.map(async (u) => {
      const preview = await getLinkPreview(u);
      if (preview) results.set(u, preview);
    }),
  );
  return unique.map((u) => results.get(u) || null).filter(Boolean);
}
