import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { trackEvent } from "./eventTrackingService.js";

const FILE = "product_views.json";
const USERS_FILE = "users.json";
const PRODUCTS_FILE = "company_products.json";

function toIsoNow() {
  return new Date().toISOString();
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function sortNewest(a, b) {
  return String(b.viewed_at || "").localeCompare(String(a.viewed_at || ""));
}

function normalizeProductVideoFlags(product) {
  const reviewStatus = product.video_review_status || "approved";
  const restricted = Boolean(
    product.video_restricted || reviewStatus !== "approved",
  );
  return {
    ...product,
    video_review_status: reviewStatus,
    video_restricted: restricted,
    video_url: restricted ? "" : product.video_url,
    hasVideo: !restricted && Boolean(product.video_url),
  };
}

function publicAuthor(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || "",
    role: user.role || "",
    verified: Boolean(user.verified),
    country: String(user.profile?.country || ""),
  };
}

export async function recordView(
  userId,
  productId,
  { windowMinutes = 10, geo = null } = {},
) {
  const viewerId = sanitizeString(String(userId || ""), 120);
  const pid = sanitizeString(String(productId || ""), 120);
  if (!viewerId || !pid) return "not_found";

  const products = await readJson(PRODUCTS_FILE);
  const product = safeArray(products).find((p) => String(p.id) === pid) || null;
  if (!product) return "not_found";

  const all = safeArray(await readJson(FILE));
  const now = Date.now();
  const windowMs = Math.max(1, Number(windowMinutes) || 10) * 60 * 1000;

  const existingIndex = all.findIndex(
    (row) => row.user_id === viewerId && row.product_id === pid,
  );
  if (existingIndex >= 0) {
    const lastAt = new Date(all[existingIndex].viewed_at || 0).getTime();
    if (Number.isFinite(lastAt) && now - lastAt < windowMs) {
      return {
        ok: true,
        deduped: true,
        viewed_at: all[existingIndex].viewed_at,
      };
    }
    all[existingIndex].viewed_at = toIsoNow();
    all[existingIndex].updated_at = toIsoNow();
  } else {
    all.push({
      id: crypto.randomUUID(),
      user_id: viewerId,
      product_id: pid,
      viewed_at: toIsoNow(),
      created_at: toIsoNow(),
      updated_at: toIsoNow(),
    });
  }

  await writeJson(FILE, all);
  await trackEvent({
    type: "product_viewed",
    actor_id: viewerId,
    entity_id: pid,
    metadata:
      geo && typeof geo === "object"
        ? {
            country: geo.country || "",
            city: geo.city || "",
            lat: geo.lat ?? null,
            lng: geo.lng ?? null,
          }
        : {},
  });
  return { ok: true, deduped: false };
}

export async function listMyProductViews(
  userId,
  { cursor = 0, limit = 10 } = {},
) {
  const viewerId = sanitizeString(String(userId || ""), 120);
  const safeCursor = Math.max(0, Math.floor(Number(cursor || 0)));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit || 10))));

  const [views, products, users] = await Promise.all([
    readJson(FILE),
    readJson(PRODUCTS_FILE),
    readJson(USERS_FILE),
  ]);

  const viewsForUser = safeArray(views)
    .filter((v) => v.user_id === viewerId)
    .sort(sortNewest);
  const productsById = new Map(
    safeArray(products).map((p) => [
      String(p.id),
      normalizeProductVideoFlags(p),
    ]),
  );
  const usersById = new Map(safeArray(users).map((u) => [String(u.id), u]));

  const pageRows = viewsForUser.slice(safeCursor, safeCursor + safeLimit);
  const items = pageRows
    .map((v) => {
      const product = productsById.get(String(v.product_id)) || null;
      const author = product
        ? publicAuthor(usersById.get(String(product.company_id)))
        : null;
      return {
        id: v.id,
        viewed_at: v.viewed_at,
        product: product
          ? {
              id: product.id,
              title: product.title,
              category: product.category,
              material: product.material,
              moq: product.moq,
              lead_time_days: product.lead_time_days,
              description: product.description,
              hasVideo: Boolean(product.hasVideo),
              video_url: product.video_url || "",
              video_review_status: product.video_review_status || "",
            }
          : null,
        author,
      };
    })
    .filter((row) => row.product);

  const nextCursor =
    safeCursor + safeLimit < viewsForUser.length
      ? safeCursor + safeLimit
      : null;
  return {
    cursor: safeCursor,
    next_cursor: nextCursor,
    total: viewsForUser.length,
    items,
  };
}
