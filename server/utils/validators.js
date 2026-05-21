const ROLES = ["buyer", "factory", "buying_house", "admin", "agent", "owner"];
const PUBLIC_ROLES = ["buyer", "factory", "buying_house", "agent"];

export function validateEmail(email) {
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

export function validateRole(role) {
  return ROLES.includes(role);
}

export function validatePublicRole(role) {
  return PUBLIC_ROLES.includes(role);
}

export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

export function sanitizeString(input, max = 500) {
  if (typeof input !== "string") return "";
  const escaped = escapeHtml(input);
  return escaped
    .trim()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, max);
}

export function sanitizeForHtml(input, max = 1000) {
  return sanitizeString(input, max);
}

export function requireFields(payload, fields) {
  const missing = fields.filter(
    (f) => payload[f] === undefined || payload[f] === null || payload[f] === "",
  );
  return missing;
}

export function isPositiveNumberLike(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}
