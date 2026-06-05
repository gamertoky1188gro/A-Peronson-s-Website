import crypto from "crypto";
import multer from "multer";
import path from "path";
import prisma from "../utils/prisma.js";
import { handleControllerError } from "../utils/permissions.js";

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const uploadDir = path.join(process.cwd(), "server", "uploads", "search");
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").slice(0, 12);
      const baseWithoutExt = path.basename(file.originalname || "image", ext);
      const safeBase =
        baseWithoutExt.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 80) || "image";
      cb(null, `${Date.now()}-${safeBase}${ext || ""}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, webp, and gif images are allowed"));
    }
  },
});

const singleUpload = upload.single("file");

export function uploadSearchImage(req, res) {
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const fileUrl = `/uploads/search/${req.file.filename}`;
    return res.json({
      ok: true,
      file: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      message: "Image received. Visual search indexes all product images — results will match by tags, category, and color similarity.",
    });
  });
}

function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export async function spellingSuggestions(req, res) {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    if (!q || q.length < 2) {
      return res.json({ suggestion: null });
    }
    const [products, requirements] = await Promise.all([
      prisma.product.findMany({ select: { title: true }, take: 200 }),
      prisma.requirement.findMany({ select: { title: true }, take: 200 }),
    ]);
    const allTitles = [
      ...new Set([
        ...products.map((p) => (p.title || "").toLowerCase()),
        ...requirements.map((r) => (r.title || "").toLowerCase()),
      ]),
    ].filter(Boolean);
    for (const title of allTitles) {
      const distance = levenshteinDistance(q, title);
      if (distance > 0 && distance <= 2) {
        return res.json({ suggestion: title });
      }
    }
    return res.json({ suggestion: null });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function searchHistoryCreate(req, res) {
  try {
    const query = String(req.body?.query || req.body?.q || "").trim();
    const filters = req.body?.filters || {};
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    await prisma.eventLog.create({
      data: {
        id: crypto.randomUUID(),
        org_owner_id: req.user.id,
        actor_id: req.user.id,
        entity_id: req.user.id,
        type: "search_run",
        metadata: { query, filters },
        occurred_at: new Date(),
      },
    });
    return res.status(201).json({ ok: true });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function searchHistoryList(req, res) {
  try {
    const rows = await prisma.eventLog.findMany({
      where: { type: "search_run", entity_id: req.user.id },
      orderBy: { created_at: "desc" },
      take: 20,
    });
    const seen = new Set();
    const history = [];
    for (const row of rows) {
      const meta = (row.metadata || {});
      const query = String(meta.query || "").trim();
      if (query && !seen.has(query)) {
        seen.add(query);
        history.push({ query, filters: meta.filters || {}, searched_at: row.created_at });
      }
    }
    return res.json(history);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function trendingSearches(req, res) {
  try {
    const currentQ = String(req.query.q || "").trim().toLowerCase();
    const searchEvents = await prisma.eventLog.findMany({
      where: { type: "search_run" },
      select: { metadata: true },
      orderBy: { created_at: "desc" },
      take: 500,
    });
    if (searchEvents.length === 0) {
      const categories = await prisma.product.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ["category"],
        take: 8,
      });
      const fallback = categories.map((c) => c.category).filter(Boolean);
      return res.json({
        trending: fallback.length ? fallback : ["Wovens", "Knits", "Denim", "T-shirts", "Home Textiles", "Organic Cotton", "PPE", "Sustainable"],
        source: "fallback",
        ...(currentQ ? { related: [] } : {}),
      });
    }
    const queryCounts = {};
    const categoryCounts = {};
    const relatedCounts = {};
    const currentQWords = currentQ ? currentQ.split(/\s+/).filter(Boolean) : [];
    searchEvents.forEach((e) => {
      const meta = (e.metadata || {});
      const q = String(meta.query || meta.q || "").trim().toLowerCase();
      const cat = String(meta.category_primary || meta.category || "").trim();
      if (q && q.length > 1) queryCounts[q] = (queryCounts[q] || 0) + 1;
      if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      if (currentQWords.length && q) {
        const sharesWord = currentQWords.some((w) => q.includes(w));
        if (sharesWord && q !== currentQ) relatedCounts[q] = (relatedCounts[q] || 0) + 1;
      }
    });
    const topQueries = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label]) => label);
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label]) => label);
    const trending = [...new Set([...topQueries, ...topCategories])].slice(0, 10);
    const related = currentQWords.length
      ? Object.entries(relatedCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label]) => label)
      : undefined;
    return res.json({ trending, source: "events", ...(related ? { related } : {}) });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function searchAnalytics(req, res) {
  try {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalSearches, recentLogs, searchesByDay] = await Promise.all([
      prisma.eventLog.count({ where: { type: "search_run", created_at: { gte: since } } }),
      prisma.eventLog.findMany({
        where: { type: "search_run", created_at: { gte: since } },
        select: { metadata: true },
        take: 5000,
        orderBy: { created_at: "desc" },
      }),
      prisma.$queryRaw`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM event_logs WHERE type = 'search_run' AND created_at >= ${since} GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7`,
    ]);

    let zeroResultSearches = 0;
    for (const log of recentLogs) {
      const meta = (log.metadata || {});
      if (String(meta.result_count) === "0") zeroResultSearches++;
    }

    const queryCounts = {};
    for (const log of recentLogs) {
      const meta = (log.metadata || {});
      const q = String(meta.query || meta.q || "").trim();
      if (q) queryCounts[q] = (queryCounts[q] || 0) + 1;
    }
    const topQueries = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }));

    return res.json({
      totalSearches,
      zeroResultSearches,
      zeroResultRate: totalSearches > 0 ? Math.round((zeroResultSearches / totalSearches) * 100) : 0,
      topQueries,
      searchesByDay: Array.isArray(searchesByDay) ? searchesByDay : [],
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
}

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname?.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

export async function batchSearch(req, res) {
  try {
    const { terms = [], type = "all" } = req.body;
    if (!Array.isArray(terms) || terms.length === 0) {
      return res.status(400).json({ error: "No search terms provided" });
    }
    const trimmed = terms.map(t => String(t).trim()).filter(Boolean);
    if (trimmed.length > 100) {
      return res.status(400).json({ error: "Maximum 100 terms allowed" });
    }

    const results = {};

    if (type === "all" || type === "requirements") {
      const reqs = await prisma.requirement.findMany({
        where: {
          OR: trimmed.map(term => ({
            OR: [
              { title: { contains: term, mode: "insensitive" } },
              { category: { contains: term, mode: "insensitive" } },
              { material: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
        take: 200,
      });
      results.requirements = reqs;
    }

    if (type === "all" || type === "products") {
      const prods = await prisma.product.findMany({
        where: {
          OR: trimmed.map(term => ({
            OR: [
              { title: { contains: term, mode: "insensitive" } },
              { name: { contains: term, mode: "insensitive" } },
              { category: { contains: term, mode: "insensitive" } },
              { material: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
        take: 200,
      });
      results.products = prods;
    }

    return res.json(results);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function batchSearchCSV(req, res) {
  csvUpload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file provided" });
    }

    try {
      const content = req.file.buffer.toString("utf-8");
      const lines = content.split(/\r?\n/);
      const terms = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const firstColumn = trimmed.split(",")[0].trim();
        if (!firstColumn) continue;
        const lower = firstColumn.toLowerCase();
        if (lower === "sku" || lower === "term" || lower === "terms" || lower === "product") continue;
        terms.push(firstColumn);
      }

      if (terms.length === 0) {
        return res.status(400).json({ error: "No valid terms found in CSV" });
      }

      const type = String(req.body?.type || "all").trim();
      req.body = { terms, type };
      return batchSearch(req, res);
    } catch (parseErr) {
      return res.status(400).json({ error: "Failed to parse CSV file: " + parseErr.message });
    }
  });
}

export async function searchSuggestions(req, res) {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    if (!q || q.length < 1) {
      return res.json({ suggestions: [] });
    }
    const like = `%${q}%`;
    const [products, requirements, eventRows] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { material: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { title: true, category: true, material: true },
        take: 8,
      }),
      prisma.requirement.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { product: { contains: q, mode: "insensitive" } },
            { material: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { title: true, category: true, product: true, material: true },
        take: 8,
      }),
      prisma.eventLog.findMany({
        where: { type: "search_run" },
        select: { metadata: true },
        take: 50,
        orderBy: { created_at: "desc" },
      }),
    ]);
    const seen = new Set();
    const matches = [];
    const addMatch = (term) => {
      const n = normalizeSearchText(term);
      if (n && n.includes(q) && !seen.has(n)) {
        seen.add(n);
        matches.push(term);
      }
    };
    products.forEach((p) => {
      if (p.title) addMatch(p.title);
      if (p.category) addMatch(p.category);
      if (p.material) addMatch(p.material);
    });
    requirements.forEach((r) => {
      if (r.title) addMatch(r.title);
      if (r.category) addMatch(r.category);
      if (r.product) addMatch(r.product);
      if (r.material) addMatch(r.material);
    });
    eventRows.forEach((e) => {
      const meta = (e.metadata || {});
      const query = String(meta.query || meta.q || "").trim();
      if (query && query.toLowerCase().includes(q) && query.length > 1) {
        addMatch(query);
      }
    });
    return res.json({ suggestions: matches.slice(0, 8) });
  } catch (error) {
    return handleControllerError(res, error);
  }
}
