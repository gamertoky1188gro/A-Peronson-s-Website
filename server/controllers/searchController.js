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

export async function trendingSearches(req, res) {
  try {
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
      });
    }
    const queryCounts = {};
    const categoryCounts = {};
    searchEvents.forEach((e) => {
      const meta = (e.metadata || {});
      const q = String(meta.query || meta.q || "").trim().toLowerCase();
      const cat = String(meta.category_primary || meta.category || "").trim();
      if (q && q.length > 1) queryCounts[q] = (queryCounts[q] || 0) + 1;
      if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const topQueries = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label]) => label);
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label]) => label);
    const trending = [...new Set([...topQueries, ...topCategories])].slice(0, 10);
    return res.json({ trending, source: "events" });
  } catch (error) {
    return handleControllerError(res, error);
  }
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
