import crypto from "crypto";
import { updateJson } from "../utils/jsonStore.js";
import {
  sanitizePlatformAnalytics,
  getAnalyticsGovernanceConfig,
  checkAnalyticsAccessPolicy,
} from "./analyticsGovernanceService.js";
import { sanitizeString } from "../utils/validators.js";

export async function exportAnalytics(user = {}, rawPayload = {}) {
  const governance = await getAnalyticsGovernanceConfig();
  // Check access policy for exports
  const policy = checkAnalyticsAccessPolicy(user, governance, {
    mode: "export",
  });

  const auditEntryBase = {
    id: crypto.randomUUID(),
    type: "analytics_export",
    actor_id: sanitizeString(String(user?.id || ""), 120) || null,
    actor_role: String(user?.role || "").toLowerCase() || null,
    requested_at: new Date().toISOString(),
    allowed: Boolean(policy.allowed),
    governance: { ...governance },
  };

  // Record an audit entry regardless of outcome
  try {
    await updateJson("event_logs.json", (existing) => {
      const arr = Array.isArray(existing) ? existing.slice() : [];
      arr.push({
        ...auditEntryBase,
        payload: policy.allowed ? rawPayload || {} : undefined,
      });
      return arr;
    });
  } catch (e) {
    // best-effort: don't fail export on audit write error
    console.debug("audit write failed", e?.message || e);
  }

  if (!policy.allowed) {
    const err = new Error("Analytics export denied by governance policy");
    err.status = 403;
    err.code = "ANALYTICS_EXPORT_DENIED";
    throw err;
  }

  // Sanitize payload according to governance
  const sanitized = sanitizePlatformAnalytics(rawPayload || {}, governance);

  // Update audit record to include sanitized result and timestamp
  try {
    await updateJson("event_logs.json", (existing) => {
      const arr = Array.isArray(existing) ? existing.slice() : [];
      const idx = arr.findIndex((r) => r.id === auditEntryBase.id);
      const now = new Date().toISOString();
      const entry = {
        ...auditEntryBase,
        allowed: true,
        completed_at: now,
        exported_at: now,
        result: sanitized.report || sanitized,
      };
      if (idx === -1) arr.push(entry);
      else arr[idx] = entry;
      return arr;
    });
  } catch (e) {
    // swallow
    console.debug("audit finalize failed", e?.message || e);
  }

  return { export_id: auditEntryBase.id, sanitized };
}

export default { exportAnalytics };
