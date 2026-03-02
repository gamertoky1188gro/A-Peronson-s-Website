export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const USER_KEY = 'user'
const TOKEN_KEY = 'jwt'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', token = '', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export function getRoleHome(role) {
  switch (role) {
    case 'admin':
      return '/owner'
    case 'buying_house':
      return '/owner'
    case 'factory':
      return '/product-management'
    case 'buyer':
      return '/buyer-requests'
    default:
      return '/feed'
  }
}

export async function fetchCurrentUser(token = getToken()) {
  if (!token) return null
  const data = await apiRequest('/auth/me', { token })
  return data?.user || null
}
