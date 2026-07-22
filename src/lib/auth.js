import { logger } from "./logger";

/** @typedef {import('./types.js').User} User */
/** @typedef {import('./types.js').AuthResponse} AuthResponse */

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

const USER_KEY = "user";
const TOKEN_KEY = "jwt";

/**
 * Retrieves the JWT token from local or session storage.
 * @returns {string} The JWT token, or an empty string if not found.
 */
export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""
  );
}

/**
 * Retrieves the current user from memory cache or storage.
 * @returns {User|null} The current user object, or null if not authenticated.
 */
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;


  const now = Date.now();
  if (cachedUser && now - cacheTime < CACHE_TTL_MS) {
    return cachedUser;
  }

  fetchAndCacheUser(token).catch(() => {});
  return cachedUser;
}

/**
 * Retrieves the current user from memory cache or storage asynchronously.
 * @returns {Promise<User|null>} The current user object, or null if not authenticated.
 */
export async function getCurrentUserAsync() {
  const token = getToken();
  if (!token) return null;

  const stored = loadUserFromStorage();
  if (stored) {
    cachedUser = stored;
    cacheTime = Date.now();
  }

  const now = Date.now();
  if (cachedUser && now - cacheTime < CACHE_TTL_MS) {
    return cachedUser;
  }

  return fetchAndCacheUser(token);
}

// Sync user data from API before page loads - security critical
/**
 * Sync user data from API before page loads - security critical
 * @param {string} [token] - The JWT token.
 * @returns {Promise<User|null>} The user object, or null if sync failed.
 */
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
/**
 * Check and sync user data - compares localStorage with DB and updates if needed
 * @param {string} [token] - The JWT token.
 * @returns {Promise<User|null>} The synced user object, or null if failed.
 */
export async function verifyAndSyncUser(token = getToken()) {
  if (!token) {
    clearSession();
    return null;
  }

  // Always fetch fresh from API - never trust localStorage for security
  return syncUserFromApi(token);
}

/**
 * Persists the minimal user object to localStorage.
 * @param {User} user - The user object to persist.
 * @returns {User|null} The persisted minimal user object, or null if user is null.
 */
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

/**
 * Saves the session user and token to storage.
 * @param {User} user - The user object.
 * @param {string} token - The JWT token.
 * @param {Object} [options] - Options.
 * @param {boolean} [options.remember=true] - Whether to remember the session.
 * @returns {void}
 */
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

/**
 * Clears the session user and token from storage.
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Makes an API request.
 * @param {string} path - The request path.
 * @param {Object} [options] - The request options.
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {string} [options.token=''] - JWT token.
 * @param {any} [options.body] - Request body.
 * @param {AbortSignal} [options.signal] - Abort signal.
 * @param {Object} [options.headers={}] - HTTP headers.
 * @returns {Promise<any>} The response data.
 */
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

  let data;
  try {
    data = await res.json();
  } catch (parseErr) {
    logger.error("[api] failed to parse JSON response", { method, path, status: res.status, error: parseErr.message });
    data = {};
  }
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

/**
 * Gets the home page path for a role.
 * @param {string} _role - The user role.
 * @returns {string} The home page path.
 */
export function getRoleHome(_role) {
  return "/feed";
}

/**
 * Fetches the current user from API.
 * @param {string} [token] - The JWT token.
 * @returns {Promise<User|null>} The user object, or null if not found.
 */
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
/**
 * Fetches fresh user data from API - use this for sensitive/permission checks
 * Never trust localStorage for security decisions
 * @param {string} [token] - The JWT token.
 * @returns {Promise<User|null>} The user object, or null if failed.
 */
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
/**
 * Checks if the user has a role (fetches fresh from API for security-critical checks).
 * @param {string} requiredRole - The required role.
 * @param {string} [token] - The JWT token.
 * @returns {Promise<boolean>} True if the user has the role, false otherwise.
 */
export async function hasRole(requiredRole, token = getToken()) {
  const user = await getUserFromApi(token);
  return user?.role === requiredRole;
}

/**
 * Checks if the user has a specific entitlement.
 * @param {User} user - The user object.
 * @param {string} feature - The feature to check.
 * @returns {boolean} True if the user has the entitlement, false otherwise.
 */
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
