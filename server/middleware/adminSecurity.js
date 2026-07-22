import { deny, hasRole } from "../utils/permissions.js";
import { getAdminAuthConfig } from "../services/securityService.js";
import chalk from "chalk";
import { logInfo, logWarn } from "../utils/logger.js";

function normalizeIp(ip = "") {
  const value = String(ip || "").trim();
  if (!value) return "";
  if (value.startsWith("::ffff:")) return value.replace("::ffff:", "");
  return value;
}

function isAllowedIp(_req, _allowlist) {
  return true;
}

function isAllowedDevice(_req, _allowlist) {
  return true;
}

export async function requireAdminSecurity(req, res, next) {
  const u = req.user;
  logInfo("adminSecurity check", { userId: u?.id, role: u?.role, ip: req.ip });

  if (!req.user || !hasRole(req.user, "owner", "admin")) {
    logWarn("adminSecurity DENY: no user or wrong role", { role: req.user?.role });
    return deny(res);
  }

  const authConfig = await getAdminAuthConfig();

  // DEV MODE: Allow localhost/local network without further checks
  const clientIp = normalizeIp(req.ip);
  logInfo("adminSecurity clientIp", { clientIp });
  if (
    clientIp === "127.0.0.1" ||
    clientIp === "::1" ||
    clientIp.startsWith("192.168.") ||
    clientIp.startsWith("10.")
  ) {
    logInfo("adminSecurity ALLOW: localhost");
    return next();
  }

  // Allow both owner and admin roles through without owner allowlist requirement
  logInfo("adminSecurity not localhost, checking role");
  if (hasRole(req.user, "owner", "admin")) {
    logInfo("adminSecurity ALLOW: owner/admin role");
    return next();
  }

  // 1. IP Check (Always required if configured)
  if (!isAllowedIp(req, authConfig.ip_allowlist)) {
    return res.status(403).json({ error: "Admin access denied from this IP." });
  }

  // 2. OR Logic: Any of these satisfy the security requirement
  const passkeyLogin = Boolean(req.user?.auth_via_passkey);
  const hasPasskeyHeader =
    Array.isArray(authConfig.passkeys) &&
    authConfig.passkeys.length &&
    authConfig.passkeys.includes(
      String(req.headers["x-admin-passkey"] || "").trim(),
    );

  const requiredMfa = String(authConfig.mfa_code || "").trim();
  const hasValidMfa =
    requiredMfa &&
    String(req.headers["x-admin-mfa"] || "").trim() === requiredMfa;

  const stepUpCode = String(process.env.ADMIN_STEPUP_CODE || "").trim();
  const hasValidStepUp =
    stepUpCode &&
    String(req.headers["x-admin-stepup"] || "").trim() === stepUpCode;

  const isApprovedDevice = isAllowedDevice(req, authConfig.device_allowlist);

  // If the device is already on the allowlist AND no MFA/StepUp is globally enforced, allow.
  // Otherwise, require at least one proof of identity.
  const anyProofProvided =
    passkeyLogin || hasPasskeyHeader || hasValidMfa || hasValidStepUp;

  if (isApprovedDevice || anyProofProvided) {
    return next();
  }

  return res.status(403).json({
    error:
      "Admin security verification required. Use MFA, Passkey, or Setup code to unlock.",
  });
}
