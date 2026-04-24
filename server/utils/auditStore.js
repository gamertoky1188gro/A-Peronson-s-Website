import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const AUDIT_PATH = path.join(
  process.cwd(),
  "server",
  "database",
  "admin_audit.json",
);

let auditQueue = Promise.resolve();

function normalizeValue(value) {
  if (value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeValue(v)]),
    );
  }
  return value;
}

function hashPayload(payload) {
  return crypto
    .createHash("sha256")
    .update(String(payload || ""))
    .digest("hex");
}

async function ensureAuditFile() {
  try {
    await fs.access(AUDIT_PATH);
  } catch {
    await fs.mkdir(path.dirname(AUDIT_PATH), { recursive: true });
    await fs.writeFile(AUDIT_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readAuditLog() {
  await ensureAuditFile();
  const raw = await fs.readFile(AUDIT_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function sanitizeAuditPayload(payload = {}) {
  const redactedKeys = new Set([
    "password",
    "new_password",
    "token",
    "authorization",
    "jwt",
    "secret",
  ]);
  if (!payload || typeof payload !== "object") return payload;
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (redactedKeys.has(String(key).toLowerCase())) {
        return [key, "[redacted]"];
      }
      return [key, normalizeValue(value)];
    }),
  );
}

export async function appendAuditLog(entry) {
  auditQueue = auditQueue.then(async () => {
    await ensureAuditFile();
    const existing = await readAuditLog();
    const last = existing[existing.length - 1];
    const prevHash = last?.hash || "";
    const core = {
      ...normalizeValue(entry || {}),
      prev_hash: prevHash,
    };
    const hash = hashPayload(`${prevHash}:${JSON.stringify(core)}`);
    const record = {
      ...core,
      hash,
    };
    existing.push(record);
    await fs.writeFile(AUDIT_PATH, JSON.stringify(existing, null, 2), "utf8");
    return record;
  });

  return auditQueue;
}
