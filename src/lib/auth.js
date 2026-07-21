import { logger } from "./logger";

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

const USER_KEY = "user";
const TOKEN_KEY = "jwt";

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""
  );
}

let userFetchPromise = null;
let cachedUser = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5000;

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  // First check localStorage for immediate availability
  const stored = localStorage.getItem(USER_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Return stored user immediately
      cachedUser = parsed;
      cacheTime = Date.now();
    } catch {
      // ignore parse errors
    }
  }

  // If we have recent cache, return it
  const now = Date.now();
  if (cachedUser && now - cacheTime < CACHE_TTL_MS) {
    return cachedUser;
  }

  // Start background fetch to update cache
  if (!userFetchPromise) {
    userFetchPromise = apiRequest("/users/me", { token })
      .then((user) => {
        if (user) {
          cachedUser = user;
          cacheTime = Date.now();
          persistUser(user);
        }
        return user;
      })
      .catch(() => cachedUser)
      .finally(() => {
        userFetchPromise = null;
      });
  }

  return cachedUser;
}

// Sync user data from API before page loads - security critical
export async function syncUserFromApi(token = getToken()) {
  if (!token) return null;
  try {
    const user = await apiRequest("/users/me", { token });
    if (user) {
      persistUser(user);
      return user;
    }
  } catch (err) {
    logger.error("User sync failed:", err);
  }
  return null;
}

// Check and sync user data - compares localStorage with DB and updates if needed
export async function verifyAndSyncUser(token = getToken()) {
  if (!token) {
    clearSession();
    return null;
  }

  // Always fetch fresh from API - never trust localStorage for security
  return syncUserFromApi(token);
}

export function persistUser(user) {
  if (!user) return null;
  // Only store minimal essential data - never trust sensitive data from localStorage
  // subscription_status, entitlements, capabilities should NOT be stored
  // role is stored but ALWAYS synced from API on page load via verifyAndSyncUser
  const minimalUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile
      ? {
          avatar_url: user.profile.avatar_url,
          profile_image: user.profile.profile_image,
          organization_name: user.profile.organization_name,
        }
      : null,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(minimalUser));
  return minimalUser;
}

export function saveSession(user, token, { remember = true } = {}) {
  persistUser(user);
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(
  path,
  { method = "GET", token = "", body, signal, headers = {} } = {},
) {
  const debugRequests = import.meta.env.DEV;
  const startedAt = debugRequests ? performance.now() : 0;

  const isFormData = body instanceof FormData;
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      cache: "no-store",
      signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
    });
  } catch (err) {
    if (debugRequests) {
      const elapsed = performance.now() - startedAt;
      logger.warn("[api] request failed", {
        method,
        path,
        ms: Math.round(elapsed),
      });
    }
    throw err;
  }

  const data = await res.json().catch(() => ({}));
  if (debugRequests) {
    const elapsed = performance.now() - startedAt;
    const entry = { method, path, status: res.status, ms: Math.round(elapsed) };
    if (elapsed >= 10000) {
      logger.warn("[api] slow request", entry);
    } else {
      logger.info("[api] request", entry);
    }
  }
  if (!res.ok) {
    if (res.status === 401) {
      clearSession();
    }
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    error.details = data;
    throw error;
  }
  return data;
}

export function getRoleHome(_role) {
  return "/feed";
}

export async function fetchCurrentUser(token = getToken()) {
  if (!token) return null;
  const data = await apiRequest("/users/me", { token });
  const user = data || null;
  if (user) {
    persistUser(user);
  }
  return user;
}

// Fetch fresh user data from API - use this for sensitive/permission checks
// Never trust localStorage for security decisions
export async function getUserFromApi(token = getToken()) {
  if (!token) return null;
  try {
    const user = await apiRequest("/users/me", { token });
    return user;
  } catch (err) {
    logger.error("Failed to fetch user from API:", err);
    return null;
  }
}

// Check if user has role (fetches fresh from API for security-critical checks)
export async function hasRole(requiredRole, token = getToken()) {
  const user = await getUserFromApi(token);
  return user?.role === requiredRole;
}

export function hasEntitlement(user, feature) {
  if (!user || !feature) return false;
  const entitlements = user.entitlements || user;
  if (
    entitlements?.features &&
    Object.prototype.hasOwnProperty.call(entitlements.features, feature)
  ) {
    return Boolean(entitlements.features[feature]);
  }
  const plan = String(
    entitlements?.plan || user.subscription_status || "",
  ).toLowerCase();
  if (plan === "premium") return true;
  return false;
}
