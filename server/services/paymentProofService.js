import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { sanitizeString } from "../utils/validators.js";
import { canAccessContract } from "../utils/permissions.js";
import { createNotification } from "./notificationService.js";
import { trackEvent } from "./eventTrackingService.js";

const FILE = "payment_proofs.json";
const DOCUMENTS_FILE = "documents.json";
const USERS_FILE = "users.json";

const BANK_STATUSES = new Set(["pending_check", "received", "not_received"]);
const LC_STATUSES = new Set(["pending_review", "accepted", "rejected"]);

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function ensureContractAccess(actor, contract) {
  if (!actor || !contract) return false;
  return canAccessContract(actor, contract);
}

function getContractById(contracts, id) {
  return (
    (Array.isArray(contracts) ? contracts : []).find(
      (row) => String(row?.id || "") === String(id),
    ) || null
  );
}

function normalizeType(value) {
  const type = String(value || "")
    .toLowerCase()
    .trim();
  if (type === "bank_transfer" || type === "bank") return "bank_transfer";
  if (type === "lc" || type === "letter_of_credit") return "lc";
  return "";
}

function normalizeLcType(value) {
  const type = String(value || "")
    .toLowerCase()
    .trim();
  if (!type) return "";
  if (type === "sight") return "sight";
  if (type === "usance") return "usance";
  return "";
}

function normalizeUsanceDays(value) {
  if (value === undefined || value === null || value === "") return null;
  const days = Number(value);
  if (!Number.isFinite(days)) return null;
  const rounded = Math.round(days);
  if (rounded <= 0) return null;
  if (rounded > 365) return 365;
  return rounded;
}

function requireFields(payload, fields) {
  const missing = fields.filter(
    (field) => !String(payload?.[field] || "").trim(),
  );
  return missing;
}

async function notifyAdmins(message, meta = {}) {
  const users = await readJson(USERS_FILE);
  const admins = (Array.isArray(users) ? users : []).filter((u) =>
    ["owner", "admin"].includes(String(u?.role || "").toLowerCase()),
  );
  for (const admin of admins) {
    await createNotification(admin.id, {
      type: "payment_proof_review",
      entity_type: "payment_proof",
      entity_id: meta?.proof_id || "",
      message,
      meta,
    });
  }
}

export async function createPaymentProof(actor, payload = {}) {
  const contractId = sanitizeString(
    payload.contract_id || payload.contractId || "",
    120,
  );
  if (!contractId) {
    const err = new Error("contract_id is required");
    err.status = 400;
    throw err;
  }

  const type = normalizeType(payload.type);
  if (!type) {
    const err = new Error("type must be bank_transfer or lc");
    err.status = 400;
    throw err;
  }

  const contracts = await readJson(DOCUMENTS_FILE);
  const contract = getContractById(contracts, contractId);
  if (!contract) {
    const err = new Error("Contract not found");
    err.status = 404;
    throw err;
  }
  if (!ensureContractAccess(actor, contract)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  if (type === "bank_transfer") {
    const missing = requireFields(payload, [
      "transaction_reference",
      "bank_name",
      "sender_account_name",
      "receiver_account_name",
      "transaction_date",
      "amount",
      "currency",
    ]);
    if (missing.length) {
      const err = new Error(`Missing fields: ${missing.join(", ")}`);
      err.status = 400;
      throw err;
    }
  }

  if (type === "lc") {
    const missing = requireFields(payload, [
      "lc_number",
      "issuing_bank",
      "advising_bank",
      "applicant_name",
      "beneficiary_name",
      "issue_date",
      "expiry_date",
      "amount",
      "currency",
    ]);
    if (missing.length) {
      const err = new Error(`Missing fields: ${missing.join(", ")}`);
      err.status = 400;
      throw err;
    }

    const lcType = normalizeLcType(payload.lc_type || payload.lcType);
    if (!lcType) {
      const err = new Error("lc_type is required (sight or usance)");
      err.status = 400;
      throw err;
    }

    if (lcType === "usance") {
      const usanceDays = normalizeUsanceDays(
        payload.usance_days ?? payload.usanceDays ?? payload.usance_tenor,
      );
      if (!usanceDays) {
        const err = new Error("usance_days is required for usance LC");
        err.status = 400;
        throw err;
      }
    }
  }

  const proofs = await readJson(FILE);
  const now = new Date().toISOString();
  const row = {
    id: crypto.randomUUID(),
    contract_id: contractId,
    type,
    status: type === "bank_transfer" ? "pending_check" : "pending_review",
    created_by: actor.id,
    reviewed_by: null,
    review_reason: "",
    transaction_reference: sanitizeString(
      payload.transaction_reference || "",
      160,
    ),
    bank_name: sanitizeString(payload.bank_name || "", 120),
    sender_account_name: sanitizeString(payload.sender_account_name || "", 120),
    receiver_account_name: sanitizeString(
      payload.receiver_account_name || "",
      120,
    ),
    transaction_date: normalizeDate(payload.transaction_date),
    amount: Number(payload.amount || 0) || null,
    currency: sanitizeString(payload.currency || "", 20),
    lc_number: sanitizeString(payload.lc_number || "", 120),
    issuing_bank: sanitizeString(payload.issuing_bank || "", 120),
    advising_bank: sanitizeString(payload.advising_bank || "", 120),
    applicant_name: sanitizeString(payload.applicant_name || "", 120),
    beneficiary_name: sanitizeString(payload.beneficiary_name || "", 120),
    issue_date: normalizeDate(payload.issue_date),
    expiry_date: normalizeDate(payload.expiry_date),
    lc_type: normalizeLcType(payload.lc_type || payload.lcType) || null,
    usance_days: normalizeUsanceDays(
      payload.usance_days ?? payload.usanceDays ?? payload.usance_tenor,
    ),
    document_id: sanitizeString(payload.document_id || "", 120) || null,
    document_url:
      sanitizeString(
        payload.document_url || payload.document_path || "",
        600,
      ) || null,
    created_at: now,
    updated_at: now,
  };

  proofs.push(row);
  await writeJson(FILE, proofs);

  const counterpartyId =
    String(actor.id || "") === String(contract.buyer_id || "")
      ? String(contract.factory_id || "")
      : String(contract.buyer_id || "");

  if (counterpartyId) {
    await createNotification(counterpartyId, {
      type: "payment_proof_submitted",
      entity_type: "contract",
      entity_id: contractId,
      message: `Payment proof submitted for contract ${contract.contract_number || contractId}.`,
      meta: { contract_id: contractId, payment_proof_id: row.id, type },
    });
  }

  await trackEvent({
    type: "payment_proof_created",
    actor_id: actor.id,
    entity_id: row.id,
    metadata: { contract_id: contractId, type },
  });
  return row;
}

export async function listPaymentProofsByContract(actor, contractId) {
  const id = sanitizeString(contractId || "", 120);
  if (!id) return [];

  const contracts = await readJson(DOCUMENTS_FILE);
  const contract = getContractById(contracts, id);
  if (!contract) return [];
  if (!ensureContractAccess(actor, contract)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const proofs = await readJson(FILE);
  return (Array.isArray(proofs) ? proofs : [])
    .filter((row) => String(row.contract_id || "") === id)
    .sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || "")),
    );
}

export async function updatePaymentProof(actor, proofId, payload = {}) {
  const id = sanitizeString(proofId || "", 120);
  if (!id) return null;

  const proofs = await readJson(FILE);
  const idx = proofs.findIndex((row) => String(row.id || "") === id);
  if (idx < 0) return null;

  const contracts = await readJson(DOCUMENTS_FILE);
  const contract = getContractById(contracts, proofs[idx].contract_id);
  if (!contract) return null;
  if (!ensureContractAccess(actor, contract)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const type = normalizeType(proofs[idx].type);
  const nextStatus = String(payload.status || "")
    .toLowerCase()
    .trim();
  const allowed = type === "bank_transfer" ? BANK_STATUSES : LC_STATUSES;
  if (!allowed.has(nextStatus)) {
    const err = new Error("Invalid status");
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const next = {
    ...proofs[idx],
    status: nextStatus,
    reviewed_by: actor.id,
    review_reason: sanitizeString(payload.review_reason || "", 200),
    updated_at: now,
  };

  proofs[idx] = next;
  await writeJson(FILE, proofs);

  await trackEvent({
    type: "payment_proof_status_updated",
    actor_id: actor.id,
    entity_id: next.id,
    metadata: { status: nextStatus },
  });

  if (["not_received", "rejected"].includes(nextStatus)) {
    await notifyAdmins(
      `Payment proof requires review for contract ${contract.contract_number || contract.id}.`,
      {
        proof_id: next.id,
        contract_id: contract.id,
        status: nextStatus,
      },
    );
  }

  return next;
}
