import { readJson } from "../utils/jsonStore.js";

const DEFAULTS = {
  auto_reply_enabled: false,
  allow_numeric_commitments: false,
  auto_reply_rate_limit_per_hour: 20,
  ai_handoff_threshold: parseFloat(process.env.AI_HANDOFF_THRESHOLD || "0.65"),
  ai_hallucination_threshold: parseFloat(
    process.env.AI_HALLUCINATION_THRESHOLD || "0.7",
  ),
};

export async function getOrgAiSettings(orgOwnerId = "") {
  const rows = await readJson("org_ai_settings.json");
  const found = Array.isArray(rows)
    ? rows.find(
        (r) => String(r.org_owner_id || "") === String(orgOwnerId || ""),
      )
    : null;
  return { ...DEFAULTS, ...(found || {}) };
}

export default { getOrgAiSettings };
