import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { createNotification } from "../services/notificationService.js";
import { getAdminConfig } from "../services/adminConfigService.js";

function resolveReviewStatus(status) {
  const normalized = String(status || "approved").toLowerCase();
  if (["approved", "pending_review", "rejected"].includes(normalized))
    return normalized;
  return "approved";
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
  };
}

export async function listModerationProducts(req, res) {
  const status = resolveReviewStatus(req.query?.status || "pending_review");
  const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 50)));
  const offset = Math.max(0, Number(req.query?.offset || 0));

  const [products, users] = await Promise.all([
    readJson("company_products.json"),
    readJson("users.json"),
  ]);

  const rows = Array.isArray(products) ? products : [];
  const usersById = new Map(
    (Array.isArray(users) ? users : []).map((u) => [String(u.id), u]),
  );
  const filtered = rows
    .filter((p) => resolveReviewStatus(p.content_review_status) === status)
    .sort((a, b) =>
      String(b.updated_at || b.created_at || "").localeCompare(
        String(a.updated_at || a.created_at || ""),
      ),
    );

  const items = filtered.slice(offset, offset + limit).map((row) => ({
    ...row,
    owner: publicUser(usersById.get(String(row.company_id || ""))),
  }));

  return res.json({ items, total: filtered.length, status });
}

export async function updateModerationProduct(req, res) {
  const productId = sanitizeString(String(req.params.productId || ""), 120);
  const nextStatusRaw = sanitizeString(String(req.body?.status || ""), 40);
  if (!productId || !nextStatusRaw)
    return res.status(400).json({ error: "productId and status are required" });

  const nextStatus = resolveReviewStatus(nextStatusRaw);
  const reason = sanitizeString(String(req.body?.reason || ""), 240);

  const products = await readJson("company_products.json");
  const rows = Array.isArray(products) ? products : [];
  const idx = rows.findIndex((p) => String(p.id) === String(productId));
  if (idx < 0) return res.status(404).json({ error: "Product not found" });

  const current = rows[idx];
  rows[idx] = {
    ...current,
    content_review_status: nextStatus,
    content_review_reason:
      nextStatus === "rejected"
        ? reason ||
          current.content_review_reason ||
          "Content standards violation."
        : "",
    content_reviewed_at: new Date().toISOString(),
    content_reviewed_by: sanitizeString(String(req.user?.id || "admin"), 120),
    updated_at: new Date().toISOString(),
  };

  await writeJson("company_products.json", rows);

  const config = await getAdminConfig();
  const fixTip =
    config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || "";
  const notifyMessage =
    nextStatus === "approved"
      ? "Your product was approved after review."
      : `Your product was rejected: ${rows[idx].content_review_reason || "Content standards violation."} ${fixTip}`.trim();

  if (rows[idx].company_id) {
    await createNotification(rows[idx].company_id, {
      type: "product_content_review",
      entity_type: "company_product",
      entity_id: rows[idx].id,
      message: notifyMessage,
      meta: {
        review_status: nextStatus,
        reason: rows[idx].content_review_reason,
      },
    });
  }

  return res.json({ ok: true, item: rows[idx] });
}
