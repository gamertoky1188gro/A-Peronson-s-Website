import { apiRequest, getToken } from './auth'

const CLIENT_ID_KEY = 'gt_client_id'

function randomId() {
  // Prefer crypto UUID when available; fall back to a simple random string.
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  } catch {
    // ignore
  }
  return `cid_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function getClientId() {
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY)
    if (existing) return existing
    const created = randomId()
    localStorage.setItem(CLIENT_ID_KEY, created)
    return created
  } catch {
    // localStorage may be blocked; fall back to an ephemeral id.
    return randomId()
  }
}

export async function trackClientEvent(type, { entityType = '', entityId = '', metadata = {} } = {}) {
  // Best-effort event logging: failures should never break UI flows.
  try {
    await apiRequest('/events', {
      method: 'POST',
      token: getToken(),
      body: {
        type,
        entity_type: entityType,
        entity_id: entityId,
        client_id: getClientId(),
        metadata,
      },
    })
  } catch {
    // silent
  }
}

