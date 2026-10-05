import { Router } from "express";
import { botMetaMiddleware } from "../seo/botMeta.js";

const router = Router();

/* ──────────────────────────────────────────────
   Bot-aware static meta: crawler User-Agents on
   exact public paths get dist/index.html with
   per-route title/description/og tags + canonical.
   Mounted (app.use(seoRoutes)) BEFORE the SPA
   fallback in server.js, so bots never hit it.
   ────────────────────────────────────────────── */
router.use(botMetaMiddleware);

/* ──────────────────────────────────────────────
   SEO files are now static in public/
   (robots.txt, sitemap.xml, pages.xml)
   Served by Vite's dist middleware WITHOUT
   helmet CSP headers — fixes Google sitemap fetch.
   ────────────────────────────────────────────── */

export default router;
