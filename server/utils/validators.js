const ROLES = ["buyer", "factory", "buying_house", "admin", "agent", "owner"];

export function validateEmail(email) {
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

export function validateRole(role) {
  return ROLES.includes(role);
}

export function sanitizeString(input, max = 500) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, max);
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
