export const API_BASE = import.meta.env.VITE_API_URL || '/api'

const USER_KEY = 'user'
const TOKEN_KEY = 'jwt'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ''
}

export function getCurrentUser() {
  if (!getToken()) return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function persistUser(user) {
  if (!user) return null
  const existing = getCurrentUser() || {}
  const merged = {
    ...existing,
    ...user,
    entitlements: user.entitlements || existing.entitlements || null,
  }
  localStorage.setItem(USER_KEY, JSON.stringify(merged))
  return merged
}

export function saveSession(user, token, { remember = true } = {}) {
  persistUser(user)
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token)
    sessionStorage.removeItem(TOKEN_KEY)
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', token = '', body, signal, headers = {} } = {}) {
  const debugRequests = import.meta.env.DEV || String(import.meta.env.VITE_REQUEST_DEBUG || '').toLowerCase() === 'true'
  const startedAt = debugRequests ? performance.now() : 0
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      cache: 'no-store',
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (debugRequests) {
      const elapsed = performance.now() - startedAt
      console.warn('[api] request failed', { method, path, ms: Math.round(elapsed) })
    }
    throw err
  }

  const data = await res.json().catch(() => ({}))
  if (debugRequests) {
    const elapsed = performance.now() - startedAt
    const entry = { method, path, status: res.status, ms: Math.round(elapsed) }
    if (elapsed >= 10000) {
      console.warn('[api] slow request', entry)
    } else {
      console.info('[api] request', entry)
    }
  }
  if (!res.ok) {
    if (res.status === 401) {
      clearSession()
    }
    const error = new Error(data.error || 'Request failed')
    error.status = res.status
    throw error
  }
  return data
}

export function getRoleHome(role) {
  switch (role) {
    case 'admin':
      return '/owner'
    case 'owner':
      return '/owner'
    case 'buying_house':
      return '/owner'
    case 'factory':
      return '/product-management'
    case 'buyer':
      return '/buyer-requests'
    case 'agent':
      return '/agent'
    default:
      return '/feed'
  }
}

export async function fetchCurrentUser(token = getToken()) {
  if (!token) return null
  const data = await apiRequest('/users/me', { token })
  const user = data || null
  if (user) {
    persistUser(user)
  }
  return user
}

export function hasEntitlement(user, feature) {
  if (!user || !feature) return false
  const entitlements = user.entitlements || user
  if (entitlements?.features && Object.prototype.hasOwnProperty.call(entitlements.features, feature)) {
    return Boolean(entitlements.features[feature])
  }
  const plan = String(entitlements?.plan || user.subscription_status || '').toLowerCase()
  if (plan === 'premium') return true
  return false
}
