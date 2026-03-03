import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'analytics.json'

export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
  const all = await readJson(FILE)
  all.push({
    id: crypto.randomUUID(),
    type,
    actor_id,
    entity_id,
    metadata,
    created_at: new Date().toISOString(),
  })
  await writeJson(FILE, all)
}

export async function getAnalyticsSummary() {
  const all = await readJson(FILE)
  const byType = all.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})
  return { total_events: all.length, by_type: byType }
}

function monthKey(value) {
  const d = new Date(value || '')
  if (Number.isNaN(d.getTime())) return null
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function toMonthlySeries(items, dateKey) {
  const bucket = items.reduce((acc, item) => {
    const key = monthKey(item[dateKey])
    if (!key) return acc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(bucket)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))
}

export async function getDashboardAnalytics() {
  const [events, requirements, messages, matches, documents, users] = await Promise.all([
    readJson(FILE),
    readJson('requirements.json'),
    readJson('messages.json'),
    readJson('matches.json'),
    readJson('documents.json'),
    readJson('users.json'),
  ])

  const uniqueActiveChats = new Set(messages.map((m) => m.match_id).filter(Boolean)).size
  const connectedPartners = new Set(matches.map((m) => m.factory_id).filter(Boolean)).size
  const contractDocs = documents.filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
  const byType = events.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  return {
    totals: {
      buyer_requests: requirements.length,
      open_buyer_requests: requirements.filter((r) => r.status === 'open').length,
      chats: uniqueActiveChats,
      messages: messages.length,
      partner_network: connectedPartners,
      contracts: contractDocs.length,
      documents: documents.length,
      factories: users.filter((u) => u.role === 'factory').length,
    },
    analytics_events: {
      total: events.length,
      by_type: byType,
    },
    series: {
      buyer_requests: toMonthlySeries(requirements, 'created_at'),
      chats: toMonthlySeries(messages, 'timestamp'),
      documents: toMonthlySeries(documents, 'created_at'),
    },
  }
}
