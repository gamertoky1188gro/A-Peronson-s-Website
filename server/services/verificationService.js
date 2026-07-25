import { isEuCountry } from "../../shared/config/geo.js";
import { logInfo } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";

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

const REVIEW_STATUSES = new Set(["pending", "approved", "rejected", "incomplete", "expired"]);
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
	if (role !== "buyer") {
		return;
	}

	const buyerCountry = normalizeBuyerCountry(docs?.buyer_country);
	const countryIsEu = isEuCountry(buyerCountry);

	if (countryIsEu && buyerRegion !== BUYER_REGIONS.EU) {
		const err = new Error("Selected buyer country is in the EU. Set buyer_region to EU.");
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
	if (role !== "buyer") {
		return requiredByRoleRegion[role] || [];
	}
	return requiredByRoleRegion.buyer[buyerRegion] || requiredByRoleRegion.buyer.OTHER;
}

function hasDocument(docs, field) {
	const possibleFields = fieldAliases[field] || [field];
	return possibleFields.some((name) => Boolean(docs?.[name]));
}

function normalizeDocValue(value) {
	return sanitizeString(String(value || ""), 240).toLowerCase();
}

function buildCredibility(required, docs) {
	const completedRequired = required.filter((field) => hasDocument(docs, field)).length;
	const requiredTotal = required.length;
	const optionalLicenses = Array.isArray(docs?.optional_licenses)
		? docs.optional_licenses.filter(Boolean)
		: [];
	const requiredCompletionPct = requiredTotal > 0 ? (completedRequired / requiredTotal) * 100 : 100;

	const requiredScore = requiredCompletionPct * 0.85;
	const optionalScore = Math.min(optionalLicenses.length, 5) * 3;
	const score = Math.min(100, Math.round(requiredScore + optionalScore));

	let badge = "Basic credibility";
	if (score >= 90) {
		badge = "High credibility";
	} else if (score >= 70) {
		badge = "Strong credibility";
	} else if (score >= 40) {
		badge = "Moderate credibility";
	}

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
	if (!docs) {
		return false;
	}
	const keys = Object.keys(docs);
	return keys.some((key) => {
		if (key === "optional_licenses") {
			return Array.isArray(docs.optional_licenses) && docs.optional_licenses.some(Boolean);
		}
		return Boolean(String(docs[key] || "").trim());
	});
}

function toPublicFileUrl(filePath = "") {
	if (!filePath) {
		return "";
	}
	const normalized = String(filePath).replace(/\\/g, "/");
	if (normalized.startsWith("/uploads/")) {
		return normalized;
	}
	const idx = normalized.indexOf("server/uploads/");
	if (idx >= 0) {
		return `/uploads/${normalized.slice(idx + "server/uploads/".length)}`;
	}
	return normalized.startsWith("uploads/") ? `/${normalized}` : normalized;
}

export async function getVerification(userId) {
	return prisma.verification.findUnique({ where: { user_id: userId } });
}

function diffDaysFromNow(endDate) {
	const endTime = new Date(endDate || "").getTime();
	if (!Number.isFinite(endTime)) {
		return 0;
	}
	const diffMs = endTime - Date.now();
	if (diffMs <= 0) {
		return 0;
	}
	return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

export async function isVerificationSubscriptionValid(userId) {
	const rec = await getVerification(userId);
	if (!rec?.subscription_valid_until) {
		return false;
	}
	return diffDaysFromNow(rec.subscription_valid_until) > 0;
}

export async function setVerificationSubscription(userId, endDate) {
	const nextEnd = endDate || "";
	const remainingDays = diffDaysFromNow(nextEnd);
	const expiringSoon = remainingDays > 0 && remainingDays <= 7;

	const existing = await prisma.verification.findUnique({
		where: { user_id: userId },
	});

	if (!existing) {
		return prisma.verification.create({
			data: {
				user_id: userId,
				role: "",
				buyer_region: "",
				documents: emptyDocs(),
				verified: false,
				subscription_valid_until: nextEnd,
				subscription_remaining_days: remainingDays,
				expiring_soon: expiringSoon,
				missing_required: [],
				credibility: buildCredibility([], emptyDocs()),
				review_status: "pending",
				review_reason: "",
			},
		});
	}

	const verification_status = existing.verified
		? expiringSoon
			? "expiring_soon"
			: "verified_active"
		: remainingDays > 0
			? "pending_review"
			: "expired";

	return prisma.verification.update({
		where: { user_id: userId },
		data: {
			subscription_valid_until: nextEnd,
			subscription_remaining_days: remainingDays,
			expiring_soon: expiringSoon,
			verification_status,
			updated_at: new Date(),
		},
	});
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
	if (record?.buyer_region) {
		return record.buyer_region;
	}
	const docsCountry = normalizeBuyerCountry(record?.documents?.buyer_country);
	const profileCountry = normalizeCountryCode(user?.profile?.country);
	const candidate = docsCountry || profileCountry;
	const upper = candidate.toUpperCase();

	if (isEuCountry(candidate)) {
		return BUYER_REGIONS.EU;
	}
	if (
		upper === "USA" ||
		upper === "US" ||
		upper === "UNITED STATES" ||
		upper === "UNITED STATES OF AMERICA"
	) {
		return BUYER_REGIONS.USA;
	}
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
	const existing = await prisma.verification.findUnique({
		where: { user_id: user.id },
	});

	const docs = {
		...(existing?.documents || emptyDocs()),
		...sanitizeDocsPatch(documentsPatch || {}),
	};

	const buyerRegion =
		user.role === "buyer"
			? normalizeBuyerRegion(documentsPatch?.buyer_region || existing?.buyer_region)
			: "";

	validateBuyerGeography(user.role, docs, buyerRegion);

	const required = getRequiredFields(user.role, buyerRegion);
	const missing_required = required.filter((key) => !hasDocument(docs, key));
	const credibility = buildCredibility(required, docs);

	const shouldKeepApproved = Boolean(existing?.verified) && missing_required.length === 0;
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
		verified_at: shouldKeepApproved ? existing?.verified_at || null : null,
		subscription_valid_until: existing?.subscription_valid_until || null,
		missing_required,
		credibility,
		review_status: nextReviewStatus,
		review_reason:
			nextReviewStatus === "rejected"
				? sanitizeString(String(existing?.review_reason || ""), 240)
				: "",
		reviewed_at: shouldKeepApproved ? existing?.reviewed_at || null : null,
		updated_at: new Date(),
	};

	const result = await prisma.verification.upsert({
		where: { user_id: user.id },
		update: record,
		create: record,
	});

	logInfo("Verification documents updated", {
		user_id: user.id,
		buyer_region: buyerRegion,
		missing_required: missing_required.length,
		credibility_score: credibility.score,
	});
	return result;
}

export async function adminApproveVerification(userId) {
	const existing = await prisma.verification.findUnique({
		where: { user_id: userId },
	});
	if (!existing) {
		return null;
	}

	const validSub = await isVerificationSubscriptionValid(userId);
	if (!validSub) {
		return prisma.verification.update({
			where: { user_id: userId },
			data: {
				verified: false,
				missing_required: [
					...(existing.missing_required || []),
					"premium_subscription_required_for_verification",
				],
			},
		});
	}

	if ((existing.missing_required || []).length > 0) {
		return prisma.verification.update({
			where: { user_id: userId },
			data: {
				verified: false,
				review_status: "incomplete",
				review_reason: "missing_required_documents",
				reviewed_at: new Date(),
			},
		});
	}

	logInfo("Verification approved", { user_id: userId });
	return prisma.verification.update({
		where: { user_id: userId },
		data: {
			verified: true,
			verified_at: new Date(),
			review_status: "approved",
			review_reason: "",
			reviewed_at: new Date(),
			subscription_valid_until: existing.subscription_valid_until || null,
		},
	});
}

export async function adminRejectVerification(userId, reason = "") {
	const existing = await prisma.verification.findUnique({
		where: { user_id: userId },
	});
	if (!existing) {
		return null;
	}

	logInfo("Verification rejected", { user_id: userId, reason });
	return prisma.verification.update({
		where: { user_id: userId },
		data: {
			verified: false,
			verified_at: null,
			review_status: "rejected",
			review_reason: sanitizeString(String(reason || "rejected_by_admin"), 240),
			reviewed_at: new Date(),
		},
	});
}

export async function revokeExpiredVerifications() {
	const all = await prisma.verification.findMany({ where: { verified: true } });
	const now = Date.now();

	for (const rec of all) {
		const subEnd = rec.subscription_valid_until;
		if (!subEnd || new Date(subEnd).getTime() <= now) {
			await prisma.verification.update({
				where: { user_id: rec.user_id },
				data: {
					verified: false,
					review_status: "expired",
					review_reason: "subscription_expired",
					reviewed_at: new Date(),
					subscription_remaining_days: 0,
					expiring_soon: false,
					verification_status: "expired",
				},
			});
		}
	}

	return prisma.verification.findMany();
}

export async function listVerificationQueue({ status } = {}) {
	const [all, users, documents] = await Promise.all([
		prisma.verification.findMany(),
		prisma.user.findMany(),
		prisma.document.findMany({
			where: { entity_type: "verification" },
		}),
	]);

	const usersById = new Map(users.map((u) => [String(u.id), u]));
	const docsByUser = new Map();

	for (const doc of documents) {
		const ownerId = String(doc.entity_id || doc.uploaded_by || "");
		if (!ownerId) {
			continue;
		}
		if (!docsByUser.has(ownerId)) {
			docsByUser.set(ownerId, []);
		}
		docsByUser.get(ownerId).push({
			...doc,
			public_url: toPublicFileUrl(doc.file_path || doc.url || ""),
		});
	}

	const duplicateIndex = {};
	DUPLICATE_FIELDS.forEach((field) => {
		duplicateIndex[field] = new Map();
	});

	for (const rec of all) {
		const docs = rec?.documents || {};
		DUPLICATE_FIELDS.forEach((field) => {
			const aliasFields = fieldAliases[field] || [field];
			const value = aliasFields.map((key) => docs?.[key]).find(Boolean);
			if (!value) {
				return;
			}
			const normalized = normalizeDocValue(value);
			if (!normalized) {
				return;
			}
			const bucket = duplicateIndex[field];
			if (!bucket.has(normalized)) {
				bucket.set(normalized, new Set());
			}
			bucket.get(normalized).add(String(rec.user_id || ""));
		});
	}

	const filtered = all.filter((rec) => {
		const reviewStatus = normalizeReviewStatus(
			rec.review_status,
			rec.verified ? "approved" : "pending",
		);
		if (status) {
			return reviewStatus === status;
		}
		if (!hasAnyDocument(rec.documents)) {
			return false;
		}
		return reviewStatus !== "approved";
	});

	return filtered
		.map((rec) => {
			const user = usersById.get(String(rec.user_id || "")) || null;
			const summary = getVerificationPublicSummary(user || {}, rec);
			const duplicate_flags = DUPLICATE_FIELDS.reduce((flags, field) => {
				const aliasFields = fieldAliases[field] || [field];
				const value = aliasFields.map((key) => rec?.documents?.[key]).find(Boolean);
				if (!value) {
					return flags;
				}
				const normalized = normalizeDocValue(value);
				if (!normalized) {
					return flags;
				}
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
		.sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")));
}

export async function listExpiringVerifications(thresholdDays = 7) {
	return prisma.verification.findMany({
		where: {
			verified: true,
			subscription_remaining_days: { gt: 0, lte: thresholdDays },
		},
	});
}

export async function markVerificationExpiringSoon(userId, remainingDays, thresholdDays = 7) {
	const existing = await prisma.verification.findUnique({
		where: { user_id: userId },
	});
	if (!existing) {
		return null;
	}

	const nextRemainingDays = Math.max(0, Number(remainingDays) || 0);
	const isExpiringSoon =
		existing.verified && nextRemainingDays > 0 && nextRemainingDays <= thresholdDays;

	const verification_status = existing.verified
		? isExpiringSoon
			? "expiring_soon"
			: "verified_active"
		: "expired";

	return prisma.verification.update({
		where: { user_id: userId },
		data: {
			subscription_remaining_days: nextRemainingDays,
			expiring_soon: isExpiringSoon,
			verification_status,
			updated_at: new Date(),
		},
	});
}
