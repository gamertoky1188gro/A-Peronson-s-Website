import { readJson, writeJson } from "../utils/jsonStore.js";
import { detectHallucination } from "../utils/hallucinationDetector.js";
import { verifyExtraction } from "./aiVerifier.js";
import { postMessage } from "./messageService.js";
import { resolveOrgOwnerFromMatch } from "./aiConversationService.js";
import { getOrgAiSettings } from "./orgAiService.js";
import { callLlama } from "./assistantService.js";

function getEnvFloat(name, defaultVal) {
  const v = parseFloat(process.env[name]);
  return Number.isFinite(v) ? v : defaultVal;
}

const DEFAULT_CONFIDENCE_THRESHOLD = getEnvFloat("AI_HANDOFF_THRESHOLD", 0.65);
const DEFAULT_HALLUCINATION_THRESHOLD = getEnvFloat(
  "AI_HALLUCINATION_THRESHOLD",
  0.7,
);

async function extractRequirementWithLlama(text) {
  const systemPrompt = `Extract textile business requirements from the user text into a valid JSON object.
Fields: product_type (string), category (string), moq (string/null), target_price (string/null), timeline (string/null), incoterm (string/null), certifications (array of strings).
If a field is unknown, use null or empty string. Return ONLY the JSON object.`;

  const response = await callLlama(text, systemPrompt);
  try {
    // Robust JSON extraction from LLM response
    const match = response?.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        product_type: String(parsed.product_type || ""),
        category: String(parsed.category || ""),
        moq: parsed.moq ? String(parsed.moq) : null,
        target_price: parsed.target_price ? String(parsed.target_price) : null,
        timeline: parsed.timeline ? String(parsed.timeline) : null,
        incoterm: parsed.incoterm ? String(parsed.incoterm) : null,
        certifications: Array.isArray(parsed.certifications)
          ? parsed.certifications
          : [],
        notes: text.slice(0, 500),
      };
    }
  } catch (err) {
    console.error("Failed to parse Llama extraction JSON", err);
  }
  return {
    product_type: "",
    category: "",
    moq: null,
    target_price: null,
    timeline: null,
    incoterm: null,
    certifications: [],
    notes: text,
  };
}

function normalizeWhitespace(value = "") {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function computeConfidence(extracted = {}) {
  let score = 0;
  if (extracted.product_type) score += 0.35;
  if (extracted.category) score += 0.15;
  if (extracted.moq) score += 0.15;
  if (extracted.target_price) score += 0.15;
  if (extracted.timeline) score += 0.1;
  if (extracted.incoterm) score += 0.05;
  if (
    Array.isArray(extracted.certifications) &&
    extracted.certifications.length
  )
    score += 0.05;
  return Math.min(1, Number(score.toFixed(2)));
}

function detectMissing(extracted = {}) {
  const keys = [
    "product_type",
    "category",
    "moq",
    "target_price",
    "timeline",
    "incoterm",
    "certifications",
  ];
  return keys.filter(
    (k) =>
      extracted[k] === null ||
      extracted[k] === undefined ||
      extracted[k] === "",
  );
}

export async function orchestrateRequirementExtraction(
  { text = "" } = {},
  orgOwnerId = null,
) {
  const notes = String(text || "").trim();

  // Use Llama for intelligent extraction
  const extracted = await extractRequirementWithLlama(notes);

  const missing_fields = detectMissing(extracted);
  const confidence = computeConfidence(extracted);
  const halluc = detectHallucination(extracted);
  const verification = await verifyExtraction(extracted, orgOwnerId);

  // Determine thresholds (allow per-org overrides)
  let confidenceThreshold = DEFAULT_CONFIDENCE_THRESHOLD;
  let hallucinationThreshold = DEFAULT_HALLUCINATION_THRESHOLD;
  try {
    if (orgOwnerId) {
      const orgSettings = await getOrgAiSettings(orgOwnerId);
      if (orgSettings && typeof orgSettings.ai_handoff_threshold === "number")
        confidenceThreshold = orgSettings.ai_handoff_threshold;
      if (
        orgSettings &&
        typeof orgSettings.ai_hallucination_threshold === "number"
      )
        hallucinationThreshold = orgSettings.ai_hallucination_threshold;
    }
  } catch {
    void 0;
  }

  const hallucinationFlag = Boolean(
    halluc && (halluc.score || 0) >= hallucinationThreshold,
  );
  const verificationFlag = verification?.verified === false;
  const shouldHandoff =
    confidence < confidenceThreshold ||
    missing_fields.length > 0 ||
    hallucinationFlag ||
    verificationFlag;

  return {
    intent: "general_inquiry",
    extracted,
    missing_fields,
    confidence,
    handoff: shouldHandoff ? "manual" : "auto",
    hallucination: { ...halluc, flagged: hallucinationFlag },
    verification: verification || null,
    guardrails: { banned_instruction_detected: false },
    thresholds: {
      confidence: confidenceThreshold,
      hallucination: hallucinationThreshold,
    },
  };
}

export async function extractRequirementFromText(text = "", orgOwnerId = null) {
  const out = await orchestrateRequirementExtraction({ text }, orgOwnerId);
  return {
    extracted: out.extracted,
    missing_fields: out.missing_fields,
    confidence: out.confidence,
    handoff: out.handoff,
    guardrails: out.guardrails,
    thresholds: out.thresholds,
  };
}

export function generateDraftResponse(extracted = {}, missing_fields = []) {
  const parts = [];
  parts.push(`Thanks — I captured: ${extracted.product_type || "product"}.`);
  if (extracted.moq) parts.push(`MOQ: ${extracted.moq}.`);
  if (extracted.target_price)
    parts.push(`Target price: ${extracted.target_price}.`);
  if (missing_fields && missing_fields.length)
    parts.push(`I still need: ${missing_fields.join(", ")}.`);
  return parts.join(" ");
}

export async function validateDraftResponse(
  draftText = "",
  extracted = {},
  threshold = null,
  orgOwnerId = null,
) {
  const draft = String(draftText || "");
  const conf = computeConfidence(extracted);
  const missing = detectMissing(extracted);
  const halluc = detectHallucination(extracted);
  const verification = await verifyExtraction(extracted);

  // determine effective threshold: explicit threshold > org setting > default
  let effectiveThreshold = Number.isFinite(Number(threshold))
    ? Number(threshold)
    : null;
  if (effectiveThreshold === null) {
    try {
      if (orgOwnerId) {
        const orgSettings = await getOrgAiSettings(orgOwnerId);
        if (
          orgSettings &&
          typeof orgSettings.ai_handoff_threshold === "number"
        ) {
          effectiveThreshold = orgSettings.ai_handoff_threshold;
        }
      }
    } catch {
      void 0;
    }
    if (effectiveThreshold === null)
      effectiveThreshold = DEFAULT_CONFIDENCE_THRESHOLD;
  }

  let hallucinationThreshold = DEFAULT_HALLUCINATION_THRESHOLD;
  try {
    if (orgOwnerId) {
      const orgSettings = await getOrgAiSettings(orgOwnerId);
      if (
        orgSettings &&
        typeof orgSettings.ai_hallucination_threshold === "number"
      )
        hallucinationThreshold = orgSettings.ai_hallucination_threshold;
    }
  } catch {
    void 0;
  }

  const hallucinationFlag = Boolean(
    halluc && (halluc.score || 0) >= hallucinationThreshold,
  );
  const verificationFlag = verification?.verified === false;
  const shouldHandoff =
    conf < effectiveThreshold ||
    missing.length > 0 ||
    hallucinationFlag ||
    verificationFlag;
  const suggested = missing.map((f) => `Please provide ${f}.`);
  return {
    confidence: conf,
    missing_fields: missing,
    handoff: shouldHandoff,
    handoff_reason: shouldHandoff ? "manual" : null,
    suggested_clarifying_questions: suggested,
    draft: draft,
    verification: verification,
    hallucination: { ...halluc, flagged: hallucinationFlag },
  };
}

export async function persistAiMetadataForMatch(matchId, metadata = {}) {
  if (!matchId) return null;
  try {
    const messages = await readJson("messages.json");
    messages.push({
      id: `ai-meta-${Date.now()}`,
      match_id: matchId,
      sender_id: "system:ai",
      message: JSON.stringify({ ai_metadata: metadata }),
      timestamp: new Date().toISOString(),
      type: "system",
      policy_status: "delivered",
    });
    await writeJson("messages.json", messages);
  } catch (err) {
    // ignore write failures
    console.debug(
      "persistAiMetadataForMatch messages write failed",
      err?.message || err,
    );
  }
  try {
    const leads = await readJson("leads.json");
    const lead = leads.find(
      (l) => String(l.match_id || "") === String(matchId || ""),
    );
    if (lead) {
      const notes = await readJson("lead_notes.json");
      notes.push({
        id: `ai-note-${Date.now()}`,
        lead_id: lead.id,
        org_owner_id: lead.org_owner_id,
        author_id: "system:ai",
        note: `AI metadata: ${JSON.stringify(metadata)}`,
        created_at: new Date().toISOString(),
      });
      await writeJson("lead_notes.json", notes);
    }
  } catch (err) {
    console.debug(
      "persistAiMetadataForMatch lead_notes write failed",
      err?.message || err,
    );
  }
  return true;
}

export default {
  orchestrateRequirementExtraction,
  extractRequirementFromText,
  generateDraftResponse,
  validateDraftResponse,
  persistAiMetadataForMatch,
};

export function approveReply({
  draft = "",
  extractedRequirements = {},
  allowNumericCommitment = false,
} = {}) {
  // Basic safety: disallow empty draft
  const text = String(draft || "").trim();
  if (!text)
    return {
      approved: false,
      status: "blocked",
      guardrails: {},
      reason: "Reply blocked: empty draft",
    };

  // If numeric commitments are not allowed, block drafts that contain standalone numbers
  if (!allowNumericCommitment && /\b\d[\d,.]*\b/.test(text)) {
    return {
      approved: false,
      status: "blocked",
      guardrails: { disallowed_numbers: true },
      reason:
        "Reply blocked: numeric commitments are not allowed in automated replies",
    };
  }

  // Very small heuristic: ensure extractedRequirements is an object (keeps variable used)
  const _ = extractedRequirements || {};
  return {
    approved: true,
    status: "approved",
    guardrails: {},
    reason: "Reply approved for sending.",
  };
}

export async function sendReply({ draft = "", approval = {} } = {}) {
  // Legacy compatibility: if not approved, require human
  if (!approval?.approved)
    return {
      sent: false,
      status: "manual_required",
      message: "Draft not approved.",
    };

  // If a matchId was provided in the approval metadata, attempt to post the reply into the thread
  const matchId = approval?.match_id || approval?.meta?.match_id || null;
  const senderId = approval?.sender_id || "system:ai";
  if (!matchId) {
    return {
      sent: true,
      status: "sent",
      sent_at: new Date().toISOString(),
      payload: { message: normalizeWhitespace(draft) },
    };
  }

  // Enforce per-org AI settings where possible
  try {
    const orgOwnerId =
      (await resolveOrgOwnerFromMatch(matchId, senderId)) || "";
    const orgSettings = await getOrgAiSettings(orgOwnerId);
    if (!orgSettings.auto_reply_enabled) {
      return {
        sent: false,
        status: "disabled",
        message: "Auto-reply disabled by organization settings.",
      };
    }

    // Basic rate limiting: count system:ai messages in the last hour for this match
    const messages = await readJson("messages.json");
    const cutoff = Date.now() - 60 * 60 * 1000;
    const recent = (Array.isArray(messages) ? messages : []).filter(
      (m) =>
        String(m.sender_id || "") === String(senderId) &&
        new Date(m.timestamp || 0).getTime() >= cutoff,
    );
    if (
      recent.length >= Number(orgSettings.auto_reply_rate_limit_per_hour || 20)
    ) {
      return {
        sent: false,
        status: "rate_limited",
        message: "Auto-reply rate limit exceeded for this organization.",
      };
    }

    // Post message using messageService to ensure consistent metadata
    try {
      const created = await postMessage(
        matchId,
        senderId,
        normalizeWhitespace(draft),
        "text",
        null,
        { source_label: "ai:auto_reply" },
      );
      return {
        sent: true,
        status: "sent",
        sent_at: new Date().toISOString(),
        payload: created,
      };
    } catch (err) {
      // fallback: persist as ai metadata if post fails
      await persistAiMetadataForMatch(matchId, {
        draft,
        approval,
        error: String(err?.message || err),
      });
      return {
        sent: false,
        status: "persisted_metadata",
        message: "Reply persisted as metadata due to posting error.",
      };
    }
  } catch (err) {
    // On unexpected errors, persist metadata and require manual review
    await persistAiMetadataForMatch(matchId, {
      draft,
      approval,
      error: String(err?.message || err),
    });
    return {
      sent: false,
      status: "manual_required",
      message: "Auto-reply failed and was persisted for review.",
    };
  }
}
