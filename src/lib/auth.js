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

export function saveSession(user, token, { remember = true } = {}) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
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
  const res = await fetch(`${API_BASE}${path}`, {
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

  const data = await res.json().catch(() => ({}))
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
  const data = await apiRequest('/auth/me', { token })
  return data?.user || null
}
