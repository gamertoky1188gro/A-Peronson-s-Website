import crypto from "crypto";
import { readJson, writeJson } from "../utils/jsonStore.js";
import { createProviderSignSession } from "./eSignProvider.js";

const DOCUMENTS_FILE = "documents.json";

export async function createSignSession(contractId, actor) {
  const docs = await readJson(DOCUMENTS_FILE);
  const idx = docs.findIndex(
    (d) => d.entity_type === "contract" && String(d.id) === String(contractId),
  );
  if (idx < 0) {
    const err = new Error("Contract not found");
    err.status = 404;
    throw err;
  }
  const contract = docs[idx];
  const actorId = String(actor?.id || "");
  if (!actorId) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const token = crypto.randomUUID();

  // If a real provider is configured (any supported provider type + ESIGN_PROVIDER_URL), call it
  let signingUrl;
  let providerSession = null;
  if (process.env.ESIGN_PROVIDER_TYPE && process.env.ESIGN_PROVIDER_URL) {
    try {
      providerSession = await createProviderSignSession({
        contractId,
        contract,
        actor,
        token,
      });
      signingUrl =
        providerSession.signing_url ||
        providerSession.url ||
        providerSession.signingUrl;
    } catch (err) {
      // Provider call failed — fall back to configured base URL or the local stub
      console.error("createProviderSignSession failed", err);
      const providerBase =
        process.env.ESIGN_PROVIDER_URL || "https://example-esign.local";
      signingUrl = `${providerBase.replace(/\/+$/, "")}/sign?contract_id=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`;
    }
  } else {
    const providerBase =
      process.env.ESIGN_PROVIDER_URL || "https://example-esign.local";
    signingUrl = `${providerBase.replace(/\/+$/, "")}/sign?contract_id=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`;
  }

  contract.artifact = contract.artifact || {};
  contract.artifact.signing_url = signingUrl;
  contract.artifact.signing_token = token;
  if (providerSession && providerSession.session_id)
    contract.artifact.provider_session_id = providerSession.session_id;
  if (providerSession && providerSession.provider_id)
    contract.artifact.provider_request_id = providerSession.provider_id;
  if (providerSession && providerSession.meta)
    contract.artifact.provider_meta = providerSession.meta;
  contract.updated_at = new Date().toISOString();
  docs[idx] = contract;
  await writeJson(DOCUMENTS_FILE, docs);
  return { signing_url: signingUrl, token };
}

export async function handleSignCallback(contractId, payload = {}) {
  const docs = await readJson(DOCUMENTS_FILE);
  const idx = docs.findIndex(
    (d) => d.entity_type === "contract" && String(d.id) === String(contractId),
  );
  if (idx < 0) {
    const err = new Error("Contract not found");
    err.status = 404;
    throw err;
  }
  const contract = docs[idx];

  if (payload.buyer_signed) {
    contract.buyer_signature_state = "signed";
    contract.buyer_signed_at =
      contract.buyer_signed_at || new Date().toISOString();
  }
  if (payload.factory_signed) {
    contract.factory_signature_state = "signed";
    contract.factory_signed_at =
      contract.factory_signed_at || new Date().toISOString();
  }

  contract.updated_at = new Date().toISOString();
  docs[idx] = contract;

  // If both signed, attempt to generate PDF artifact by delegating to documentService
  try {
    if (
      contract.buyer_signature_state === "signed" &&
      contract.factory_signature_state === "signed"
    ) {
      const { generateContractArtifact } = await import("./documentService.js");
      if (typeof generateContractArtifact === "function") {
        const artifact = await generateContractArtifact(contract);
        contract.artifact = { ...(contract.artifact || {}), ...artifact };
        docs[idx] = contract;
      }
    }
  } catch {
    // swallow generation errors - caller can retry
  }

  await writeJson(DOCUMENTS_FILE, docs);
  return contract;
}
