import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { logInfo } from "../utils/logger.js";
import { isEuCountry } from "../../shared/config/geo.js";

const FILE = "verification.json";

const BUYER_REGIONS = {
  EU: "EU",
  USA: "USA",
  OTHER: "OTHER",
};

const requiredByRoleRegion = {
  factory: [
    "company_registration",
    "trade_license",
    "tin",
    "authorized_person_nid",
    "bank_proof",
    "erc",
  ],
  buying_house: [
    "company_registration",
    "trade_license",
    "tin",
    "authorized_person_nid",
    "bank_proof",
  ],
  buyer: {
    EU: ["company_registration", "vat", "eori", "bank_proof"],
    USA: ["company_registration", "ein", "ior", "bank_proof"],
    OTHER: ["company_registration", "bank_proof"],
  },
};

const fieldAliases = {
  tin: ["tin", "tin_or_ein"],
  ein: ["ein", "tin_or_ein"],
  erc: ["erc", "erc_or_eori"],
  eori: ["eori", "erc_or_eori"],
};

const REVIEW_STATUSES = new Set([
  "pending",
  "approved",
  "rejected",
  "incomplete",
  "expired",
]);
const DUPLICATE_FIELDS = [
  "company_registration",
  "vat",
  "ein",
  "eori",
  "bank_proof",
  "erc",
  "tin",
  "trade_license",
];

export const VERIFICATION_FIELD_LABELS = {
  company_registration: "Company Registration",
  trade_license: "Trade License",
  tin: "TIN (Tax Identification Number)",
  ein: "EIN (Employer Identification Number)",
  vat: "VAT Number",
  eori: "EORI (Customs Registration)",
  ior: "IOR (Importer of Record)",
  authorized_person_nid: "Authorized Person NID",
  bank_proof: "Company Bank Proof",
  erc: "ERC (Export Registration)",
};

function normalizeReviewStatus(value, fallback = "pending") {
  const status = sanitizeString(String(value || ""), 20).toLowerCase();
  return REVIEW_STATUSES.has(status) ? status : fallback;
}

function emptyDocs() {
  return {
    company_registration: "",
    trade_license: "",
    tin: "",
    ein: "",
    vat: "",
    eori: "",
    ior: "",
    authorized_person_nid: "",
    bank_proof: "",
    erc: "",
    tin_or_ein: "",
    erc_or_eori: "",
    buyer_country: "",
    optional_licenses: [],
  };
}

function sanitizeDocsPatch(documentsPatch = {}) {
  const entries = Object.entries(documentsPatch);
  const out = {};

  for (const [key, value] of entries) {
    if (key === "optional_licenses") {
      const values = Array.isArray(value) ? value : [value];
      out.optional_licenses = values
        .map((v) => sanitizeString(String(v || ""), 240))
        .filter(Boolean);
      continue;
    }

    out[key] = sanitizeString(String(value || ""), 240);
  }

  return out;
}

function normalizeBuyerCountry(rawCountry) {
  return sanitizeString(String(rawCountry || ""), 60);
}

function validateBuyerGeography(role, docs, buyerRegion) {
  if (role !== "buyer") return;

  const buyerCountry = normalizeBuyerCountry(docs?.buyer_country);
  const countryIsEu = isEuCountry(buyerCountry);

  if (countryIsEu && buyerRegion !== BUYER_REGIONS.EU) {
    const err = new Error(
      "Selected buyer country is in the EU. Set buyer_region to EU.",
    );
    err.statusCode = 400;
    throw err;
  }

  if (buyerRegion === BUYER_REGIONS.EU && !countryIsEu) {
    const err = new Error(
      "buyer_region=EU requires selecting a valid EU country in buyer_country.",
    );
    err.statusCode = 400;
    throw err;
  }
}

function normalizeBuyerRegion(rawRegion) {
  const region = sanitizeString(String(rawRegion || ""), 20).toUpperCase();
  return BUYER_REGIONS[region] || BUYER_REGIONS.OTHER;
}

function getRequiredFields(role, buyerRegion) {
  if (role !== "buyer") return requiredByRoleRegion[role] || [];
  return (
    requiredByRoleRegion.buyer[buyerRegion] || requiredByRoleRegion.buyer.OTHER
  );
}

function hasDocument(docs, field) {
  const possibleFields = fieldAliases[field] || [field];
  return possibleFields.some((name) => !!docs?.[name]);
}

function normalizeDocValue(value) {
  return sanitizeString(String(value || ""), 240).toLowerCase();
}

function buildCredibility(required, docs) {
  const completedRequired = required.filter((field) =>
    hasDocument(docs, field),
  ).length;
  const requiredTotal = required.length;
  const optionalLicenses = Array.isArray(docs?.optional_licenses)
    ? docs.optional_licenses.filter(Boolean)
    : [];
  const requiredCompletionPct =
    requiredTotal > 0 ? (completedRequired / requiredTotal) * 100 : 100;

  const requiredScore = requiredCompletionPct * 0.85;
  const optionalScore = Math.min(optionalLicenses.length, 5) * 3;
  const score = Math.min(100, Math.round(requiredScore + optionalScore));

  let badge = "Basic credibility";
  if (score >= 90) badge = "High credibility";
  else if (score >= 70) badge = "Strong credibility";
  else if (score >= 40) badge = "Moderate credibility";

  return {
    score,
    badge,
    completeness: `${completedRequired}/${requiredTotal} required documents submitted`,
    required_completed: completedRequired,
    required_total: requiredTotal,
    optional_licenses_count: optionalLicenses.length,
  };
}

function hasAnyDocument(docs) {
  if (!docs) return false;
  const keys = Object.keys(docs);
  return keys.some((key) => {
    if (key === "optional_licenses") {
      return (
        Array.isArray(docs.optional_licenses) &&
        docs.optional_licenses.some(Boolean)
      );
    }
    return Boolean(String(docs[key] || "").trim());
  });
}

function toPublicFileUrl(filePath = "") {
  if (!filePath) return "";
  const normalized = String(filePath).replace(/\\/g, "/");
  if (normalized.startsWith("/uploads/")) return normalized;
  const idx = normalized.indexOf("server/uploads/");
  if (idx >= 0)
    return `/uploads/${normalized.slice(idx + "server/uploads/".length)}`;
  return normalized.startsWith("uploads/") ? `/${normalized}` : normalized;
}

export async function getVerification(userId) {
  const all = await readJson(FILE);
  return all.find((v) => v.user_id === userId) || null;
}

function diffDaysFromNow(endDate) {
  const endTime = new Date(endDate || "").getTime();
  if (!Number.isFinite(endTime)) return 0;
  const diffMs = endTime - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export async function isVerificationSubscriptionValid(userId) {
  const rec = await getVerification(userId);
  if (!rec?.subscription_valid_until) return false;
  return diffDaysFromNow(rec.subscription_valid_until) > 0;
}

export async function setVerificationSubscription(userId, endDate) {
  const all = await readJson(FILE);
  const idx = all.findIndex((v) => v.user_id === userId);
  const nextEnd = endDate || "";
  const remainingDays = diffDaysFromNow(nextEnd);
  const expiringSoon = remainingDays > 0 && remainingDays <= 7;

  if (idx < 0) {
    all.push({
      user_id: userId,
      role: "",
      buyer_region: "",
      documents: emptyDocs(),
      verified: false,
      verified_at: "",
      subscription_valid_until: nextEnd,
      subscription_remaining_days: remainingDays,
      expiring_soon: expiringSoon,
      missing_required: [],
      credibility: buildCredibility([], emptyDocs()),
      review_status: "pending",
      review_reason: "",
      reviewed_at: "",
      updated_at: new Date().toISOString(),
    });
  } else {
    all[idx].subscription_valid_until = nextEnd;
    all[idx].subscription_remaining_days = remainingDays;
    all[idx].expiring_soon = expiringSoon;
    all[idx].verification_status = all[idx].verified
      ? expiringSoon
        ? "expiring_soon"
        : "verified_active"
      : remainingDays > 0
        ? "pending_review"
        : "expired";
    all[idx].updated_at = new Date().toISOString();
  }

  await writeJson(FILE, all);
  return idx < 0 ? all[all.length - 1] : all[idx];
}

function addDaysFrom(baseDate, days = 30) {
  const now = Date.now();
  const base = new Date(baseDate || "").getTime();
  const start = Number.isFinite(base) && base > now ? base : now;
  return new Date(start + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function extendVerificationSubscription(userId, days = 30) {
  const rec = await getVerification(userId);
  const nextEnd = addDaysFrom(rec?.subscription_valid_until, days);
  return setVerificationSubscription(userId, nextEnd);
}

function normalizeCountryCode(value) {
  return sanitizeString(String(value || ""), 80).trim();
}

function inferBuyerRegion(user, record) {
  if (record?.buyer_region) return record.buyer_region;
  const docsCountry = normalizeBuyerCountry(record?.documents?.buyer_country);
  const profileCountry = normalizeCountryCode(user?.profile?.country);
  const candidate = docsCountry || profileCountry;
  const upper = candidate.toUpperCase();

  if (isEuCountry(candidate)) return BUYER_REGIONS.EU;
  if (
    upper === "USA" ||
    upper === "US" ||
    upper === "UNITED STATES" ||
    upper === "UNITED STATES OF AMERICA"
  )
    return BUYER_REGIONS.USA;
  return BUYER_REGIONS.OTHER;
}

export function getVerificationPublicSummary(user, record) {
  const role = user?.role || record?.role || "";
  const buyerRegion = role === "buyer" ? inferBuyerRegion(user, record) : "";
  const required = getRequiredFields(role, buyerRegion);
  const docs = record?.documents || emptyDocs();
  const credibility = record?.credibility || buildCredibility(required, docs);

  const required_checklist = required.map((key) => ({
    key,
    label: VERIFICATION_FIELD_LABELS[key] || key,
    submitted: hasDocument(docs, key),
  }));

  const optionalLicenses = Array.isArray(docs?.optional_licenses)
    ? docs.optional_licenses.filter(Boolean)
    : [];

  return {
    verified: Boolean(record?.verified),
    buyer_region: buyerRegion,
    credibility,
    required_checklist,
    optional_licenses_count: optionalLicenses.length,
  };
}

export async function upsertVerification(user, documentsPatch) {
  const all = await readJson(FILE);
  const idx = all.findIndex((v) => v.user_id === user.id);
  const existing = idx >= 0 ? all[idx] : null;

  const docs = {
    ...(existing?.documents || emptyDocs()),
    ...sanitizeDocsPatch(documentsPatch || {}),
  };

  const buyerRegion =
    user.role === "buyer"
      ? normalizeBuyerRegion(
          documentsPatch?.buyer_region || existing?.buyer_region,
        )
      : "";

  validateBuyerGeography(user.role, docs, buyerRegion);

  const required = getRequiredFields(user.role, buyerRegion);
  const missing_required = required.filter((key) => !hasDocument(docs, key));
  const credibility = buildCredibility(required, docs);

  const shouldKeepApproved =
    Boolean(existing?.verified) && missing_required.length === 0;
  const nextReviewStatus = shouldKeepApproved
    ? "approved"
    : missing_required.length > 0
      ? "incomplete"
      : "pending";

  const record = {
    user_id: user.id,
    role: user.role,
    buyer_region: buyerRegion,
    documents: docs,
    verified: shouldKeepApproved,
    verified_at: shouldKeepApproved ? existing?.verified_at || "" : "",
    subscription_valid_until: existing?.subscription_valid_until || "",
    missing_required,
    credibility,
    review_status: nextReviewStatus,
    review_reason:
      nextReviewStatus === "rejected"
        ? sanitizeString(String(existing?.review_reason || ""), 240)
        : "",
    reviewed_at: shouldKeepApproved ? existing?.reviewed_at || "" : "",
    updated_at: new Date().toISOString(),
  };

  if (idx >= 0) all[idx] = record;
  else all.push(record);

  await writeJson(FILE, all);
  logInfo("Verification documents updated", {
    user_id: user.id,
    buyer_region: buyerRegion,
    missing_required: missing_required.length,
    credibility_score: credibility.score,
  });
  return record;
}

export async function adminApproveVerification(userId) {
  const all = await readJson(FILE);
  const idx = all.findIndex((v) => v.user_id === userId);
  if (idx < 0) return null;

  const validSub = await isVerificationSubscriptionValid(userId);
  if (!validSub) {
    all[idx].verified = false;
    all[idx].missing_required = [
      ...(all[idx].missing_required || []),
      "premium_subscription_required_for_verification",
    ];
    await writeJson(FILE, all);
    return all[idx];
  }

  if ((all[idx].missing_required || []).length > 0) {
    all[idx].verified = false;
    all[idx].review_status = "incomplete";
    all[idx].review_reason = "missing_required_documents";
    all[idx].reviewed_at = new Date().toISOString();
    await writeJson(FILE, all);
    return all[idx];
  }

  all[idx].verified = true;
  all[idx].verified_at = new Date().toISOString();
  all[idx].review_status = "approved";
  all[idx].review_reason = "";
  all[idx].reviewed_at = new Date().toISOString();
  all[idx].subscription_valid_until = all[idx].subscription_valid_until || "";
  await writeJson(FILE, all);
  logInfo("Verification approved", { user_id: userId });
  return all[idx];
}

export async function adminRejectVerification(userId, reason = "") {
  const all = await readJson(FILE);
  const idx = all.findIndex((v) => v.user_id === userId);
  if (idx < 0) return null;

  all[idx].verified = false;
  all[idx].verified_at = "";
  all[idx].review_status = "rejected";
  all[idx].review_reason = sanitizeString(
    String(reason || "rejected_by_admin"),
    240,
  );
  all[idx].reviewed_at = new Date().toISOString();
  await writeJson(FILE, all);
  logInfo("Verification rejected", { user_id: userId, reason });
  return all[idx];
}

export async function revokeExpiredVerifications() {
  const all = await readJson(FILE);
  let changed = false;

  for (const rec of all) {
    const active =
      rec.subscription_valid_until &&
      new Date(rec.subscription_valid_until).getTime() > Date.now();
    const remainingDays = rec.subscription_valid_until
      ? Math.max(
          0,
          Math.ceil(
            (new Date(rec.subscription_valid_until).getTime() - Date.now()) /
              (24 * 60 * 60 * 1000),
          ),
        )
      : 0;
    const expiringSoon =
      rec.verified && remainingDays > 0 && remainingDays <= 7;
    if (!active && rec.verified) {
      rec.verified = false;
      rec.subscription_valid_until = rec.subscription_valid_until || "";
      rec.review_status = "expired";
      rec.review_reason = "subscription_expired";
      rec.reviewed_at = new Date().toISOString();
      changed = true;
    }
    if (rec.subscription_remaining_days !== remainingDays) {
      rec.subscription_remaining_days = remainingDays;
      changed = true;
    }
    if (rec.expiring_soon !== expiringSoon) {
      rec.expiring_soon = expiringSoon;
      changed = true;
    }
    const nextStatus = rec.verified
      ? expiringSoon
        ? "expiring_soon"
        : "verified_active"
      : remainingDays > 0
        ? "pending_review"
        : "expired";
    if (rec.verification_status !== nextStatus) {
      rec.verification_status = nextStatus;
      changed = true;
    }
  }

  if (changed) await writeJson(FILE, all);
  return all;
}

export async function listVerificationQueue({ status } = {}) {
  const [all, users, documents] = await Promise.all([
    readJson(FILE),
    readJson("users.json"),
    readJson("documents.json"),
  ]);

  const usersById = new Map(users.map((u) => [String(u.id), u]));
  const docsByUser = new Map();

  const verificationDocs = Array.isArray(documents)
    ? documents.filter(
        (doc) => String(doc.entity_type || "") === "verification",
      )
    : [];

  for (const doc of verificationDocs) {
    const ownerId = String(doc.entity_id || doc.uploaded_by || "");
    if (!ownerId) continue;
    if (!docsByUser.has(ownerId)) docsByUser.set(ownerId, []);
    docsByUser.get(ownerId).push({
      ...doc,
      public_url: toPublicFileUrl(doc.file_path || doc.url || ""),
    });
  }

  const duplicateIndex = {};
  DUPLICATE_FIELDS.forEach((field) => {
    duplicateIndex[field] = new Map();
  });
  const rows = Array.isArray(all) ? all : [];

  for (const rec of rows) {
    const docs = rec?.documents || {};
    DUPLICATE_FIELDS.forEach((field) => {
      const aliasFields = fieldAliases[field] || [field];
      const value = aliasFields.map((key) => docs?.[key]).find(Boolean);
      if (!value) return;
      const normalized = normalizeDocValue(value);
      if (!normalized) return;
      const bucket = duplicateIndex[field];
      if (!bucket.has(normalized)) bucket.set(normalized, new Set());
      bucket.get(normalized).add(String(rec.user_id || ""));
    });
  }

  const filtered = rows.filter((rec) => {
    const reviewStatus = normalizeReviewStatus(
      rec.review_status,
      rec.verified ? "approved" : "pending",
    );
    if (status) return reviewStatus === status;
    if (!hasAnyDocument(rec.documents)) return false;
    return reviewStatus !== "approved";
  });

  return filtered
    .map((rec) => {
      const user = usersById.get(String(rec.user_id || "")) || null;
      const summary = getVerificationPublicSummary(user || {}, rec);
      const duplicate_flags = DUPLICATE_FIELDS.reduce((flags, field) => {
        const aliasFields = fieldAliases[field] || [field];
        const value = aliasFields
          .map((key) => rec?.documents?.[key])
          .find(Boolean);
        if (!value) return flags;
        const normalized = normalizeDocValue(value);
        if (!normalized) return flags;
        const bucket = duplicateIndex[field];
        const matchedUsers = bucket.get(normalized);
        if (matchedUsers && matchedUsers.size > 1) {
          flags.push({
            field,
            value,
            user_ids: Array.from(matchedUsers),
          });
        }
        return flags;
      }, []);
      return {
        ...rec,
        review_status: normalizeReviewStatus(
          rec.review_status,
          rec.verified ? "approved" : "pending",
        ),
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              verified: Boolean(user.verified),
              subscription_status: user.subscription_status,
              country: user.profile?.country || "",
            }
          : null,
        required_checklist: summary.required_checklist,
        credibility: summary.credibility,
        duplicate_flags,
        uploaded_documents: docsByUser.get(String(rec.user_id || "")) || [],
      };
    })
    .sort((a, b) =>
      String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
    );
}

export async function listExpiringVerifications(thresholdDays = 7) {
  const all = await readJson(FILE);
  const rows = Array.isArray(all) ? all : [];
  return rows.filter((rec) => {
    const remaining = Number(rec.subscription_remaining_days || 0);
    return rec.verified && remaining > 0 && remaining <= thresholdDays;
  });
}

export async function markVerificationExpiringSoon(
  userId,
  remainingDays,
  thresholdDays = 7,
) {
  const all = await readJson(FILE);
  const idx = all.findIndex((v) => v.user_id === userId);
  if (idx < 0) return null;

  const nextRemainingDays = Math.max(0, Number(remainingDays) || 0);
  const isExpiringSoon =
    all[idx].verified &&
    nextRemainingDays > 0 &&
    nextRemainingDays <= thresholdDays;

  all[idx].subscription_remaining_days = nextRemainingDays;
  all[idx].expiring_soon = isExpiringSoon;
  all[idx].verification_status = all[idx].verified
    ? isExpiringSoon
      ? "expiring_soon"
      : "verified_active"
    : "expired";
  all[idx].updated_at = new Date().toISOString();

  await writeJson(FILE, all);
  return all[idx];
}
