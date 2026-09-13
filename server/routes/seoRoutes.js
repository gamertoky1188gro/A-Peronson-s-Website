import { Router } from "express";

const router = Router();

/* ──────────────────────────────────────────────
   SEO files are now static in public/
   (robots.txt, sitemap.xml, sitemaps/pages.xml)
   Served by Vite's dist middleware WITHOUT
   helmet CSP headers — fixes Google sitemap fetch.
   ────────────────────────────────────────────── */

export default router;
